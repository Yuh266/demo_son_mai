Add-Type -AssemblyName System.Drawing

$layers = @(
    @{ file="media_1789282422227.png"; target="layer_01_voc.png"; name="Layer 01 - Nền/Vóc" },
    @{ file="media_1789282362896.png"; target="layer_02_xu_ly.png"; name="Layer 02 - Xử lý" },
    @{ file="media_1789282286307.png"; target="layer_03_son.png"; name="Layer 03 - Sơn" },
    @{ file="media_1789282213947.png"; target="layer_04_trang_tri.png"; name="Layer 04 - Trang trí" },
    @{ file="media_1789282144903.png"; target="layer_05_mai.png"; name="Layer 05 - Mài" },
    @{ file="media_1789282096392.png"; target="layer_06_hoan_thien.png"; name="Layer 06 - Hoàn thiện" }
)

foreach ($l in $layers) {
    $srcPath = "C:\Users\Admin\.gemini\antigravity-ide\brain\3fa11c5c-0f37-441d-8a6d-83cb2885b397\.user_uploaded\" + $l.file
    $bytes = [System.IO.File]::ReadAllBytes($srcPath)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $bmp = [System.Drawing.Bitmap]::FromStream($ms)
    $W = $bmp.Width
    $H = $bmp.Height

    # Find bounding box of non-transparent and non-white pixels
    $minX = $W; $minY = $H; $maxX = 0; $maxY = 0
    $hasPixel = $false
    for ($x = 0; $x -lt $W; $x++) {
        for ($y = 0; $y -lt $H; $y++) {
            $c = $bmp.GetPixel($x, $y)
            # ignore transparent or near-white background if any
            if ($c.A -gt 25 -and !($c.R -gt 245 -and $c.G -gt 245 -and $c.B -gt 245)) {
                $hasPixel = $true
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    $w = $maxX - $minX + 1
    $h = $maxY - $minY + 1
    Write-Host "$($l.name) ($($l.file)): Dim=${W}x${H} -> Tight BBox: X=$minX, Y=$minY, W=$w, H=$h (Aspect: $w/$h)"
    
    $bmp.Dispose()
    $ms.Dispose()
}
