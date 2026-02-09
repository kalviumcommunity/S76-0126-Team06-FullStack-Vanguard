# fix-dev.ps1 - Senior Architect Stability Script

Write-Host "🚀 Stabilizing Vanguard Dev Environment..." -ForegroundColor Cyan

# 1. Kill stale Next.js/Node processes
Write-Host "🔍 Searching for stale processes on port 3000..."
$processId = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1

if ($processId) {
    Write-Host "🧨 Killing process $processId..." -ForegroundColor Yellow
    Stop-Process -Id $processId -Force
} else {
    Write-Host "✅ No stale processes found on port 3000."
}

# 2. Clear Next.js lock file
$lockFile = ".next\dev\lock"
if (Test-Path $lockFile) {
    Write-Host "🔐 Removing stale dev lock file..."
    Remove-Item $lockFile -Force
}

Write-Host "✨ Environment stabilized. You can now run 'npm run dev' safely." -ForegroundColor Green
