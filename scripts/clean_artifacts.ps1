Add-Type -AssemblyName System.Drawing

$dir = "C:\laragon\www\demo_son_mai\public\images\layers"

function Clean-And-Save($fileName, $clearLeftPixels, $clearRightPixels = 0) {
    $filePath = Join-Path $dir $fileName
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $bmp = [System.Drawing.Bitmap]::FromStream($ms)
    $ms.Close()
    $ms.Dispose()

    # Clear left pixels
    if ($clearLeftPixels -gt 0) {
        for ($x = 0; $x -lt $clearLeftPixels; $x++) {
            for ($y = 0; $y -lt $bmp.Height; $y++) {
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            }
        }
    }

    # Clear right pixels if needed
    if ($clearRightPixels -gt 0) {
        for ($x = $bmp.Width - $clearRightPixels; $x -lt $bmp.Width; $x++) {
            for ($y = 0; $y -lt $bmp.Height; $y++) {
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            }
        }
    }

    # Find tight bbox
    $minX = $bmp.Width; $minY = $bmp.Height; $maxX = 0; $maxY = 0
    $hasPixel = $false
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        for ($y = 0; $y -lt $bmp.Height; $y++) {
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
        $trimmed = New-Object System.Drawing.Bitmap($w, $h)
        $g = [System.Drawing.Graphics]::FromImage($trimmed)
        $srcRect = [System.Drawing.Rectangle]::new($minX, $minY, $w, $h)
        $destRect = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
        $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()

        $bmp.Dispose()
        $tempPath = "$filePath.tmp"
        $trimmed.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $trimmed.Dispose()

        Move-Item -Path $tempPath -Destination $filePath -Force
        Write-Host "Cleaned & tight trimmed $fileName : W=$w, H=$h"
    } else {
        $bmp.Dispose()
    }
}

# 1. Clean layer_05_mai.png (remove left artifact X < 35)
Clean-And-Save "layer_05_mai.png" 35 0

# 2. Clean layer_02_xu_ly.png (remove left artifact X < 25)
Clean-And-Save "layer_02_xu_ly.png" 25 0

# 3. Clean layer_01_voc.png (remove any left artifact X < 15)
Clean-And-Save "layer_01_voc.png" 15 0

# 4. Clean layer_06_hoan_thien.png (remove right edge X > W - 15)
Clean-And-Save "layer_06_hoan_thien.png" 0 15

# 5. Clean layer_03_son.png (remove right edge X > W - 15)
Clean-And-Save "layer_03_son.png" 0 15

Write-Host "ALL ARTIFACTS COMPLETELY PURGED!"
