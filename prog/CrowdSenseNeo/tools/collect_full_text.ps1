# Collect full text of repository into full_text_stack.txt
# Excludes common build and dependency directories
$root = Get-Location
$out = Join-Path $root "full_text_stack.txt"
if (Test-Path $out) { Remove-Item $out -Force }
$excludePatterns = @('\\.git\\','\\node_modules\\','\\venv\\','\\.venv\\','\\__pycache__\\','\\build\\','\\dist\\','\\.gradle\\')
Get-ChildItem -Recurse -File | Where-Object {
    $p = $_.FullName
    -not ($excludePatterns | ForEach-Object { $p -match $_ })
} | Sort-Object FullName | ForEach-Object {
    $rel = $_.FullName.Substring($root.Path.Length+1)
    "=== $rel ===`r`n" | Out-File -FilePath $out -Encoding utf8 -Append
    Get-Content -Raw -LiteralPath $_.FullName | Out-File -FilePath $out -Encoding utf8 -Append
}
Write-Output "Wrote: $out" 
