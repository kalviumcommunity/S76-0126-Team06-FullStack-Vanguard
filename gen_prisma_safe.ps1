$currentDir = Get-Location
$shortDir = (New-Object -ComObject Scripting.FileSystemObject).GetFolder($currentDir).ShortPath
Write-Host "Short Path: $shortDir"
cd $shortDir
npx prisma generate --schema=prisma/schema.prisma
