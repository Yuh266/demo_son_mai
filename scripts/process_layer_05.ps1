Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\media_1789282144903.png"
$destPath = "C:\laragon\www\demo_son_mai\public\images\layers\layer_05_mai.png"

$bytes = [System.IO.File]::ReadAllBytes($srcPath)
$ms = New-Object System.IO.MemoryStream(,$bytes)
$srcBmp = [System.Drawing.Bitmap]::FromStream($ms)
$ms.Close()
$ms.Dispose()

$W = $srcBmp.Width
$H = $srcBmp.Height
Write-Host "Source Image 5 size: $W x $H"

$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$destRect = [System.Drawing.Rectangle]::new(0, 0, $W, $H)
$g.DrawImage($srcBmp, $destRect, $destRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$srcBmp.Dispose()

# Alpha keying for pure/near white
for ($x = 0; $x -lt $W; $x++) {
    for ($y = 0; $y -lt $H; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($c.R -gt 220 -and $c.G -gt 220 -and $c.B -gt 220) {
            $alpha = [int](255 * ((240 - $c.R) / 20.0))
            if ($alpha -lt 0) { $alpha = 0 }
            if ($alpha -gt 255) { $alpha = 255 }
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
        }
    }
}

# Tight bounding box
$minX = $W; $minY = $H; $maxX = 0; $maxY = 0
$hasPixel = $false
for ($x = 0; $x -lt $W; $x++) {
    for ($y = 0; $y -lt $H; $y++) {
        $col = $bmp.GetPixel($x, $y)
        if ($col.A -gt 25) {
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
    Write-Host "Tight trim Image 5: X=$minX, Y=$minY, W=$w, H=$h"

    $trimmed = New-Object System.Drawing.Bitmap($w, $h)
    $g2 = [System.Drawing.Graphics]::FromImage($trimmed)
    $srcR = [System.Drawing.Rectangle]::new($minX, $minY, $w, $h)
    $destR = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
    $g2.DrawImage($bmp, $destR, $srcR, [System.Drawing.GraphicsUnit]::Pixel)
    $g2.Dispose()
    $bmp.Dispose()

    $tempPath = "$destPath.tmp"
    $trimmed.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $trimmed.Dispose()

    Move-Item -Path $tempPath -Destination $destPath -Force
    Write-Host "Saved high-res layer_05_mai.png successfully!"
} else {
    $bmp.Dispose()
}
