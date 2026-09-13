Add-Type -AssemblyName System.Drawing
Get-ChildItem 'C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\*.png' | ForEach-Object {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $b = [System.Drawing.Bitmap]::FromStream($ms)
    Write-Host "$($_.Name) -> $($b.Width) x $($b.Height)"
    $b.Dispose()
    $ms.Dispose()
}
