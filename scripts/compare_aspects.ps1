Add-Type -AssemblyName System.Drawing

$img1 = [System.Drawing.Image]::FromFile('C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\media_1789284873089.jpg')
$img2 = [System.Drawing.Image]::FromFile('C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\media_1789284881576.png')

Write-Host "Raw render: $($img1.Width) x $($img1.Height) (Aspect: $([math]::Round($img1.Width / $img1.Height, 3)))"
Write-Host "Mockup:     $($img2.Width) x $($img2.Height) (Aspect: $([math]::Round($img2.Width / $img2.Height, 3)))"

$img1.Dispose()
$img2.Dispose()
