Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile("C:\laragon\www\demo_son_mai\public\images\exploded_box_master.jpg")
Write-Host "Right edge samples:"
for ($y = 50; $y -lt 600; $y += 50) {
    $c = $b.GetPixel($b.Width - 10, $y)
    Write-Host "Y=$($y): R=$($c.R), G=$($c.G), B=$($c.B)"
}
$b.Dispose()
