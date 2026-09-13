Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile('C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\media_1789284881576.png')
Write-Host "Image size: $($b.Width) x $($b.Height)"

# Let's inspect the top area (Y from 10 to 100) to find where text pixels exist horizontally
$minX = $b.Width; $maxX = 0
for ($y = 20; $y -lt 90; $y++) {
    for ($x = 300; $x -lt $b.Width; $x++) {
        $c = $b.GetPixel($x, $y)
        if ($c.R -gt 100 -and $c.G -gt 100 -and $c.B -gt 100) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
        }
    }
}
Write-Host "Top-right text ('Đây là hành trình...'): X from $minX to $maxX (Width of image is $($b.Width))"
Write-Host "Percentage: $([math]::Round($minX / $b.Width * 100, 1))% to $([math]::Round($maxX / $b.Width * 100, 1))%"

# Now find where the step circles (01, 02...) start horizontally
$stepMinX = $b.Width
for ($y = 100; $y -lt 400; $y++) {
    for ($x = 300; $x -lt $b.Width; $x++) {
        $c = $b.GetPixel($x, $y)
        if ($c.R -gt 100 -and $c.G -gt 100 -and $c.B -gt 100) {
            if ($x -lt $stepMinX) { $stepMinX = $x }
        }
    }
}
Write-Host "Step circles start at X = $stepMinX ($([math]::Round($stepMinX / $b.Width * 100, 1))%)"

$b.Dispose()
