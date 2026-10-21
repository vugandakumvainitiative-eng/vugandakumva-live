Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Image]::FromFile((Join-Path $PWD 'designs/awareness/approved-design.png'))
$crops = @(
  @('hero',500,90,348,237),
  @('intro',516,352,332,198),
  @('physical',56,644,151,169),
  @('psychological',442,644,149,169),
  @('economic',56,840,151,169),
  @('sexual',442,840,149,169),
  @('leaves-left',0,1572,135,114),
  @('leaves-right',710,1572,138,114)
)
foreach($crop in $crops) {
  $bitmap = New-Object System.Drawing.Bitmap($crop[3],$crop[4])
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.DrawImage($source, [System.Drawing.Rectangle]::new(0,0,$crop[3],$crop[4]), [System.Drawing.Rectangle]::new($crop[1],$crop[2],$crop[3],$crop[4]), [System.Drawing.GraphicsUnit]::Pixel)
  $bitmap.Save((Join-Path $PWD "designs/awareness/art-$($crop[0]).png"),[System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose()
}
$source.Dispose()

