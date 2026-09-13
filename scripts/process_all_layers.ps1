Add-Type -AssemblyName System.Drawing

$layers = @(
    @{ file="media_1789282422227.png"; target="layer_01_voc.png"; name="Layer 01 - Nền/Vóc" },
    @{ file="media_1789282362896.png"; target="layer_02_xu_ly.png"; name="Layer 02 - Xử lý" },
    @{ file="media_1789282286307.png"; target="layer_03_son.png"; name="Layer 03 - Sơn" },
    @{ file="media_1789282213947.png"; target="layer_04_trang_tri.png"; name="Layer 04 - Trang trí" },
    @{ file="media_1789282144903.png"; target="layer_05_mai.png"; name="Layer 05 - Mài" },
    @{ file="media_1789282096392.png"; target="layer_06_hoan_thien.png"; name="Layer 06 - Hoàn thiện" }
)

$destDir = "C:\laragon\www\demo_son_mai\public\images\layers"

foreach ($l in $layers) {
    $srcPath = "C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\" + $l.file
    $destPath = Join-Path $destDir $l.target
    
    $bytes = [System.IO.File]::ReadAllBytes($srcPath)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $srcBmp = [System.Drawing.Bitmap]::FromStream($ms)
    $ms.Close()
    $ms.Dispose()

    $W = $srcBmp.Width
    $H = $srcBmp.Height

    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $rect = [System.Drawing.Rectangle]::new(0, 0, $W, $H)
    $g.DrawImage($srcBmp, $rect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $srcBmp.Dispose()

    # Alpha keying for pure/near white
    for ($x = 0; $x -lt $W; $x++) {
        for ($y = 0; $y -lt $H; $y++) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.A -gt 0) {
                if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
                    $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                } elseif ($c.R -gt 220 -and $c.G -gt 220 -and $c.B -gt 220) {
                    $alpha = [int]($c.A * ((240 - [Math]::Max($c.R, [Math]::Max($c.G, $c.B))) / 20.0))
                    if ($alpha -lt 0) { $alpha = 0 }
                    if ($alpha -gt 255) { $alpha = 255 }
                    $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
                }
            }
        }
    }

    # Find tight bounding box
    $minX = $W; $minY = $H; $maxX = 0; $maxY = 0
    $hasPixel = $false
    for ($x = 0; $x -lt $W; $x++) {
        for ($y = 0; $y -lt $H; $y++) {
            $col = $bmp.GetPixel($x, $y)
            if ($col.A -gt 20) {
                $hasPixel = $true
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    if ($hasPixel) {
        $w = $maxX - $minX + 1
        $h = $maxY - $minY + 1
        Write-Host "$($l.name): Cropping from [X=$minX, Y=$minY, W=$w, H=$h] -> aspect: $w/$h"

        $cropped = New-Object System.Drawing.Bitmap($w, $h)
        $gCrop = [System.Drawing.Graphics]::FromImage($cropped)
        $srcR = [System.Drawing.Rectangle]::new($minX, $minY, $w, $h)
        $destR = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
        $gCrop.DrawImage($bmp, $destR, $srcR, [System.Drawing.GraphicsUnit]::Pixel)
        $gCrop.Dispose()
        $bmp.Dispose()

        $tempPath = "$destPath.tmp"
        $cropped.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $cropped.Dispose()

        Move-Item -Path $tempPath -Destination $destPath -Force
        Write-Host "Successfully saved $destPath ($w x $h)"
    } else {
        $bmp.Dispose()
        Write-Host "Warning: No pixels found for $($l.file)"
    }
}
