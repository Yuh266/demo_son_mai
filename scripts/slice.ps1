Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\media_1789280590690.png"
$destDir = "C:\laragon\www\demo_son_mai\public\images\layers"

$srcBmp = New-Object System.Drawing.Bitmap($srcPath)
$W = $srcBmp.Width
$H = $srcBmp.Height

function Get-TightBBox($minX, $minY, $maxX, $maxY) {
    $bLeft = $maxX; $bTop = $maxY; $bRight = $minX; $bBottom = $minY
    $hasPixel = $false

    for ($x = $minX; $x -lt $maxX; $x++) {
        for ($y = $minY; $y -lt $maxY; $y++) {
            $c = $srcBmp.GetPixel($x, $y)
            if (!($c.R -gt 245 -and $c.G -gt 245 -and $c.B -gt 245)) {
                $hasPixel = $true
                if ($x -lt $bLeft) { $bLeft = $x }
                if ($x -gt $bRight) { $bRight = $x }
                if ($y -lt $bTop) { $bTop = $y }
                if ($y -gt $bBottom) { $bBottom = $y }
            }
        }
    }
    if (!$hasPixel) { return $null }
    $pad = 2
    $x0 = [Math]::Max($minX, $bLeft - $pad)
    $y0 = [Math]::Max($minY, $bTop - $pad)
    $x1 = [Math]::Min($maxX, $bRight + $pad)
    $y1 = [Math]::Min($maxY, $bBottom + $pad)
    return [System.Drawing.Rectangle]::new($x0, $y0, $x1 - $x0, $y1 - $y0)
}

$partitions = @(
    @{ name = "layer_06_hoan_thien"; bbox = (Get-TightBBox 0 0 348 350) },
    @{ name = "layer_05_mai";        bbox = (Get-TightBBox 355 0 675 350) },
    @{ name = "layer_04_trang_tri";  bbox = (Get-TightBBox 682 0 1024 350) },
    @{ name = "layer_03_son";        bbox = (Get-TightBBox 0 350 345 682) },
    @{ name = "layer_02_xu_ly";      bbox = (Get-TightBBox 348 350 690 682) },
    @{ name = "layer_01_voc";        bbox = (Get-TightBBox 698 350 1024 682) }
)

foreach ($p in $partitions) {
    $rect = $p.bbox
    Write-Host "Partition $($p.name): X=$($rect.X), Y=$($rect.Y), W=$($rect.Width), H=$($rect.Height)"
    
    $cropBmp = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
    $g = [System.Drawing.Graphics]::FromImage($cropBmp)
    $destRect = [System.Drawing.Rectangle]::new(0, 0, $rect.Width, $rect.Height)
    $g.DrawImage($srcBmp, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    # Alpha keying for pure white
    for ($x = 0; $x -lt $cropBmp.Width; $x++) {
        for ($y = 0; $y -lt $cropBmp.Height; $y++) {
            $col = $cropBmp.GetPixel($x, $y)
            if ($col.R -gt 240 -and $col.G -gt 240 -and $col.B -gt 240) {
                $cropBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($col.R -gt 220 -and $col.G -gt 220 -and $col.B -gt 220) {
                $alpha = [int](255 * ((240 - $col.R) / 20.0))
                if ($alpha -lt 0) { $alpha = 0 }
                if ($alpha -gt 255) { $alpha = 255 }
                $cropBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $col.R, $col.G, $col.B))
            }
        }
    }

    $outPath = Join-Path $destDir "$($p.name).png"
    $cropBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropBmp.Dispose()
}

$srcBmp.Dispose()
Write-Host "Clean segmented and transparently keyed all 6 pieces!"
