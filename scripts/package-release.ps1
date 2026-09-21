param([switch]$AllowSnapshot)
# Default release packaging requires a full production build. Use -AllowSnapshot
# only for an explicitly labelled staging snapshot, never as proof of approval.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectRoot = Split-Path $PSScriptRoot -Parent
$version = (Get-Content -Raw -LiteralPath (Join-Path $projectRoot 'package.json') | ConvertFrom-Json).version
Push-Location $projectRoot
try {
  $verifyArgs = @('scripts/check-build-integrity.mjs')
  if (-not $AllowSnapshot) { $verifyArgs += '--require-production' }
  & node @verifyArgs
  if ($LASTEXITCODE -ne 0) { throw 'Build verification failed; no archive was created.' }
  if ($AllowSnapshot) { Write-Warning 'Staging snapshot: full production provenance is not required by this invocation.' }
} finally { Pop-Location }
$releaseRoot = Join-Path $projectRoot 'release' 
New-Item -ItemType Directory -Path $releaseRoot -Force | Out-Null
$rootFiles = @('package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', '.npmrc', 'twilight.json', 'webpack.config.js', 'postcss.config.js', 'tailwind.config.js', 'README.md', 'CHANGELOG.md', 'STORE_SETUP.md', 'MERCHANT_GUIDE_AR.md', 'COMPONENTS.md', 'QA_REPORT.md', 'START_HERE.html', 'BUILD_MANIFEST.json', 'BROWSER_QA.json', 'INTEGRITY_QA.json', 'SOURCE_CHANGES.json')
$rootFiles += @('DEPARTMENTS_AR.md', 'AUDIT_REPORT.md')
$files = @($rootFiles | ForEach-Object { Get-Item -LiteralPath (Join-Path $projectRoot $_) })
$files += @(foreach ($folder in @('src', 'public', 'scripts')) { Get-ChildItem -LiteralPath (Join-Path $projectRoot $folder) -Recurse -File })
foreach ($kind in @('Salla-Upload', 'Source')) {
  $destination = Join-Path $releaseRoot "ZOD-Commerce-v$version-$kind.zip"
  $stream = [IO.File]::Open($destination, [IO.FileMode]::Create)
  $archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)
  try {
    foreach ($file in ($files | Sort-Object FullName)) {
      $relative = $file.FullName.Substring($projectRoot.Length).TrimStart([char[]]@('\', '/')).Replace('\', '/')
      [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $relative, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
  } finally { $archive.Dispose(); $stream.Dispose() }
  $check = [IO.Compression.ZipFile]::OpenRead($destination)
  try {
    if ($check.Entries.FullName -contains 'RECOVERED_CONVERSATION.md') { throw 'Private conversation must not be packaged' }
    if (-not ($check.Entries.FullName -contains 'public/app.js')) { throw 'Build missing from archive' }
    if ($check.Entries.FullName | Where-Object { $_ -match '^(node_modules|\.pnpm-store|output|release|\.git|zod-commerce-theme)/' }) { throw 'Archive contains a forbidden build or nested-project directory' }
    if ($kind -eq 'Salla-Upload' -and (Get-Item -LiteralPath $destination).Length -gt 1MB) { throw "Upload archive exceeds this project's configured 1 MB release budget" }
    Write-Output "$kind : $($check.Entries.Count) files, $((Get-Item -LiteralPath $destination).Length) bytes"
  } finally { $check.Dispose() }
}
