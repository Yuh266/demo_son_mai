Add-Type -AssemblyName System.Drawing

$files = @(
    "media_1789282213947.png",
    "media_1789282286307.png",
    "media_1789282362896.png",
    "media_1789282422227.png"
)

foreach ($f in $files) {
    $path = "C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\$f"
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $bmp = [System.Drawing.Bitmap]::FromStream($ms)
    
    # Sample center color and some stats
    $center = $bmp.GetPixel([int]($bmp.Width/2), [int]($bmp.Height/2))
    $top = $bmp.GetPixel([int]($bmp.Width/2), 50)
    
    Write-Host "File: $f ($($bmp.Width)x$($bmp.Height)) - Center: R=$($center.R),G=$($center.G),B=$($center.B) - Top: R=$($top.R),G=$($top.G),B=$($top.B)"
    
    $bmp.Dispose()
    $ms.Dispose()
}
