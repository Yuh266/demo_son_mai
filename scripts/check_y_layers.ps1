Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Image]::FromFile('C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\media_1789284873089.jpg')
$bmp = New-Object System.Drawing.Bitmap($b)

# Check colors along a vertical line through the center of the box (say X = 280)
for ($y = 80; $y -lt 580; $y += 5) {
    $c = $bmp.GetPixel(280, $y)
    Write-Host "Y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$b.Dispose()
$bmp.Dispose()
