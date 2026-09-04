$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$version = (Get-Content -Raw -LiteralPath (Join-Path $projectRoot 'package.json') | ConvertFrom-Json).version
$releaseRoot = Join-Path $projectRoot 'release'
New-Item -ItemType Directory -Path $releaseRoot -Force | Out-Null
$rootFiles = @('package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', '.npmrc', 'twilight.json', 'webpack.config.js', 'postcss.config.js', 'tailwind.config.js', 'README.md', 'CHANGELOG.md', 'STORE_SETUP.md')
$files = @($rootFiles | ForEach-Object { Get-Item -LiteralPath (Join-Path $projectRoot $_) })
$files += @(foreach ($folder in @('src', 'public', 'scripts')) { Get-ChildItem -LiteralPath (Join-Path $projectRoot $folder) -Recurse -File })
foreach ($kind in @('Salla-Upload', 'Source')) {
  $destination = Join-Path $releaseRoot "ZOD-Commerce-v$version-$kind.zip"
  $stream = [IO.File]::Open($destination, [IO.FileMode]::Create)
  $archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)
  try {
    foreach ($file in ($files | Sort-Object FullName)) {
      $relative = [IO.Path]::GetRelativePath($projectRoot, $file.FullName).Replace('\', '/')
      if ($kind -eq 'Salla-Upload' -and $relative.StartsWith('public/videos/')) { continue }
      [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $relative, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
  } finally { $archive.Dispose(); $stream.Dispose() }
  $check = [IO.Compression.ZipFile]::OpenRead($destination)
  try {
    if ($check.Entries.FullName -contains 'RECOVERED_CONVERSATION.md') { throw 'Private conversation must not be packaged' }
    if (-not ($check.Entries.FullName -contains 'public/app.js')) { throw 'Build missing from archive' }
    Write-Output "$kind : $($check.Entries.Count) files, $((Get-Item -LiteralPath $destination).Length) bytes"
  } finally { $check.Dispose() }
}
