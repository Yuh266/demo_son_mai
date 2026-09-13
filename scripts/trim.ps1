Add-Type -AssemblyName System.Drawing

$destDir = "C:\laragon\www\demo_son_mai\public\images\layers"
$files = Get-ChildItem -Path $destDir -Filter "*.png"

foreach ($file in $files) {
    $bmp = New-Object System.Drawing.Bitmap($file.FullName)
    $minX = $bmp.Width; $minY = $bmp.Height; $maxX = 0; $maxY = 0
    $hasPixel = $false

    for ($x = 0; $x -lt $bmp.Width; $x++) {
        for ($y = 0; $y -lt $bmp.Height; $y++) {
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
        Write-Host "Trimming $($file.Name): X=$minX, Y=$minY, W=$w, H=$h"

        $trimmed = New-Object System.Drawing.Bitmap($w, $h)
        $g = [System.Drawing.Graphics]::FromImage($trimmed)
        $srcRect = [System.Drawing.Rectangle]::new($minX, $minY, $w, $h)
        $destRect = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
        $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()

        $bmp.Dispose()
        $trimmed.Save($file.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
        $trimmed.Dispose()
    } else {
        $bmp.Dispose()
    }
}

Write-Host "All 6 images tightly trimmed without transparent padding!"
