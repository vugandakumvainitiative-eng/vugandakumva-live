Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Image]::FromFile((Join-Path $PWD 'designs/resources/approved-design.png'))
$crops = @(@('hero',540,60,425,226),@('leaves-left',0,1307,115,118),@('leaves-right',878,1307,87,118))
foreach($crop in $crops) {
$bitmap = New-Object System.Drawing.Bitmap($crop[3],$crop[4])
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.DrawImage($source,[System.Drawing.Rectangle]::new(0,0,$crop[3],$crop[4]),[System.Drawing.Rectangle]::new($crop[1],$crop[2],$crop[3],$crop[4]),[System.Drawing.GraphicsUnit]::Pixel)
$bitmap.Save((Join-Path $PWD "designs/resources/$($crop[0])-art.png"),[System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose(); $bitmap.Dispose()
}
$source.Dispose()
