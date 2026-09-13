Add-Type -AssemblyName System.Drawing
$f = "C:\laragon\www\demo_son_mai\public\images\layers\layer_02_xu_ly.png"
$bytes = [System.IO.File]::ReadAllBytes($f)
$ms = New-Object System.IO.MemoryStream(,$bytes)
$bmp = [System.Drawing.Bitmap]::FromStream($ms)
Write-Host "Layer 02: Width = $($bmp.Width), Height = $($bmp.Height)"
$ms.Dispose()
$bmp.Dispose()
