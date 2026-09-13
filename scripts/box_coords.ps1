Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Image]::FromFile('C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\media_1789284873089.jpg')
Write-Host "Width = $($b.Width), Height = $($b.Height)"

# Let's inspect where the box is located in the image
$bmp = New-Object System.Drawing.Bitmap($b)
$boxMinX = $b.Width; $boxMaxX = 0; $boxMinY = $b.Height; $boxMaxY = 0

for ($y = 0; $y -lt $b.Height; $y++) {
    for ($x = 0; $x -lt 600; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # anything noticeably brighter than the black background (background is ~10-20)
        if ($c.R -gt 50 -or $c.G -gt 50 -or $c.B -gt 50) {
            if ($x -lt $boxMinX) { $boxMinX = $x }
            if ($x -gt $boxMaxX) { $boxMaxX = $x }
            if ($y -lt $boxMinY) { $boxMinY = $y }
            if ($y -gt $boxMaxY) { $boxMaxY = $y }
        }
    }
}

Write-Host "Exploded Box Bounding Box in image: X=$boxMinX to $boxMaxX, Y=$boxMinY to $boxMaxY"
$b.Dispose()
$bmp.Dispose()
