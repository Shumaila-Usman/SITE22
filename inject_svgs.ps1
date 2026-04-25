$file = "src/components/outfit-preview.tsx"
$existing = [System.IO.File]::ReadAllText($file)
$marker = "// --- Main export"
$idx = $existing.IndexOf($marker)
Write-Host "idx=$idx"