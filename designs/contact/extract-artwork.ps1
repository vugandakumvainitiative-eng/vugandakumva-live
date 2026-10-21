Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Image]::FromFile((Join-Path $PSScriptRoot 'contact-page-design-v1.png'))
$crops = @(@('hero',414,166,370,288),@('volunteer',59,1283,198,112),@('partnership',305,1283,199,112),@('awareness',552,1283,197,112))
foreach ($crop in $crops) {
 $bitmap = New-Object System.Drawing.Bitmap($crop[3],$crop[4])
 $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
 $graphics.DrawImage($source,[System.Drawing.Rectangle]::new(0,0,$crop[3],$crop[4]),[System.Drawing.Rectangle]::new($crop[1],$crop[2],$crop[3],$crop[4]),[System.Drawing.GraphicsUnit]::Pixel)
 $bitmap.Save((Join-Path $PSScriptRoot ('contact-'+$crop[0]+'.png')))
 $graphics.Dispose(); $bitmap.Dispose()
}
$source.Dispose()
