Add-Type -AssemblyName System.Drawing

$files = @(
    @{ name="media_1789282144903.png"; note="User said Layer 5" },
    @{ name="media_1789282213947.png"; note="Candidate" },
    @{ name="media_1789282286307.png"; note="Candidate" },
    @{ name="media_1789282362896.png"; note="Candidate" },
    @{ name="media_1789282422227.png"; note="Candidate" }
)

foreach ($item in $files) {
    $f = $item.name
    $path = "C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\$f"
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $bmp = [System.Drawing.Bitmap]::FromStream($ms)
    
    $c00 = $bmp.GetPixel(0, 0)
    $cMidTop = $bmp.GetPixel([int]($bmp.Width/2), 2)
    $cCenter = $bmp.GetPixel([int]($bmp.Width/2), [int]($bmp.Height/2))
    
    Write-Host "File $f ($($item.note)): $($bmp.Width)x$($bmp.Height) | (0,0)=A:$($c00.A),R:$($c00.R),G:$($c00.G),B:$($c00.B) | MidTop=A:$($cMidTop.A),R:$($cMidTop.R) | Center=R:$($cCenter.R),G:$($cCenter.G),B:$($cCenter.B)"
    
    $bmp.Dispose()
    $ms.Dispose()
}
