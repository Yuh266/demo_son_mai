Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Image]::FromFile('C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\media_1789284873089.jpg')
Write-Host "Width = $($b.Width), Height = $($b.Height)"
$b.Dispose()
