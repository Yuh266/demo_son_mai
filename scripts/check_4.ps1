Add-Type -AssemblyName System.Drawing
$f = "C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\media_1789282213947.png"
$bytes = [System.IO.File]::ReadAllBytes($f)
$ms = New-Object System.IO.MemoryStream(,$bytes)
$bmp = [System.Drawing.Bitmap]::FromStream($ms)
Write-Host "Uploaded 4: Width = $($bmp.Width), Height = $($bmp.Height)"
$ms.Dispose()
$bmp.Dispose()
