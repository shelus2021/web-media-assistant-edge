param(
  [string]$OutputPath
)

$ErrorActionPreference = "Stop"
$extensionRoot = Split-Path -Parent $PSScriptRoot
$projectRoot = Split-Path -Parent $extensionRoot
$manifest = Get-Content -LiteralPath (Join-Path $extensionRoot "manifest.json") -Raw -Encoding UTF8 | ConvertFrom-Json
if (-not $OutputPath) {
  $OutputPath = Join-Path $projectRoot ("WebMediaAssistant-edge-store-" + $manifest.version + ".zip")
}
$OutputPath = [IO.Path]::GetFullPath($OutputPath)
$staging = Join-Path $projectRoot (".wma-store-stage-" + [guid]::NewGuid().ToString("N"))

$rootFiles = @(
  "manifest.json",
  "service-worker.js",
  "offscreen.html",
  "popup.html",
  "popup.css",
  "popup.js",
  "inject.js",
  "inject.css",
  "shadow.css",
  "support.jpg",
  "LICENSE",
  "THIRD_PARTY_NOTICES.md"
)
$directories = @("_locales", "icons", "imagus", "js", "lib", "licenses")

try {
  New-Item -ItemType Directory -Path $staging | Out-Null
  foreach ($name in $rootFiles) {
    Copy-Item -LiteralPath (Join-Path $extensionRoot $name) -Destination $staging
  }
  foreach ($name in $directories) {
    Copy-Item -LiteralPath (Join-Path $extensionRoot $name) -Destination $staging -Recurse
  }
  if (Test-Path -LiteralPath $OutputPath) { Remove-Item -LiteralPath $OutputPath -Force }
  Compress-Archive -Path (Join-Path $staging "*") -DestinationPath $OutputPath -CompressionLevel Optimal
  Get-Item -LiteralPath $OutputPath
} finally {
  $resolvedStage = [IO.Path]::GetFullPath($staging)
  $resolvedProject = [IO.Path]::GetFullPath($projectRoot)
  if ($resolvedStage.StartsWith($resolvedProject + [IO.Path]::DirectorySeparatorChar) -and (Split-Path $resolvedStage -Leaf) -like ".wma-store-stage-*") {
    Remove-Item -LiteralPath $resolvedStage -Recurse -Force -ErrorAction SilentlyContinue
  }
}
