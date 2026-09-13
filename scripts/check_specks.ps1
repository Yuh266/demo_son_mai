Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("C:\laragon\www\demo_son_mai\public\images\layers\layer_02_xu_ly.png")
Write-Host "Layer 02: $($img.Width)x$($img.Height)"
# Check leftmost pixels
for ($x = 0; $x -lt 50; $x++) {
    for ($y = 0; $y -lt $img.Height; $y++) {
        $c = $img.GetPixel($x, $y)
        if ($c.A -gt 10) {
            Write-Host "Layer 02 has pixel at X=$x, Y=$y, A=$($c.A), R=$($c.R), G=$($c.G), B=$($c.B)"
        }
    }
}
$img.Dispose()

$img1 = [System.Drawing.Bitmap]::FromFile("C:\laragon\www\demo_son_mai\public\images\layers\layer_01_voc.png")
Write-Host "Layer 01: $($img1.Width)x$($img1.Height)"
for ($x = 0; $x -lt 50; $x++) {
    for ($y = 0; $y -lt $img1.Height; $y++) {
        $c = $img1.GetPixel($x, $y)
        if ($c.A -gt 10) {
            Write-Host "Layer 01 has pixel at X=$x, Y=$y, A=$($c.A), R=$($c.R), G=$($c.G), B=$($c.B)"
        }
    }
}
$img1.Dispose()
