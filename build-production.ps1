# ============================================
# Production Build Script untuk Fundamental Metpen
# Melakukan obfuscation dan minification otomatis
# ============================================

Write-Host " Starting Production Build..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js installed
try {
    $nodeVersion = node --version
    Write-Host " Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host " Node.js tidak terinstall!" -ForegroundColor Red
    Write-Host "Install dari: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if NPM installed
try {
    $npmVersion = npm --version
    Write-Host " NPM detected: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host " NPM tidak terinstall!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host " Checking dependencies..." -ForegroundColor Cyan

# Function to check if package is installed
function Test-GlobalPackage {
    param($packageName)
    try {
        $null = & npm list -g $packageName 2>$null
        return $true
    } catch {
        return $false
    }
}

# Install required packages if not exists
$packages = @(
    @{name="javascript-obfuscator"; display="JavaScript Obfuscator"},
    @{name="terser"; display="Terser (JS Minifier)"},
    @{name="clean-css-cli"; display="Clean-CSS (CSS Minifier)"}
)

foreach ($pkg in $packages) {
    Write-Host "Checking $($pkg.display)..." -NoNewline
    
    # Try to check if command exists
    $command = $pkg.name -replace "-cli", ""
    $installed = $false
    
    try {
        $result = Get-Command $command -ErrorAction SilentlyContinue
        if ($result) {
            $installed = $true
        }
    } catch {
        $installed = $false
    }
    
    if (-not $installed) {
        Write-Host "  Installing..." -ForegroundColor Yellow
        npm install -g $($pkg.name) --silent
        Write-Host "    Installed!" -ForegroundColor Green
    } else {
        Write-Host "  OK" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🔨 Creating dist folder..." -ForegroundColor Cyan

# Create dist folder
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}
New-Item -ItemType Directory -Path "dist" | Out-Null
New-Item -ItemType Directory -Path "dist/js" | Out-Null
New-Item -ItemType Directory -Path "dist/css" | Out-Null
New-Item -ItemType Directory -Path "dist/content" | Out-Null

Write-Host " Folder structure created" -ForegroundColor Green
Write-Host ""

# ============================================
# OBFUSCATE JAVASCRIPT FILES
# ============================================
Write-Host "[*] Obfuscating JavaScript files..." -ForegroundColor Cyan

$jsFiles = @(
    @{source="js/protection.js"; output="dist/js/protection.min.js"; level="high"},
    @{source="js/app.js"; output="dist/js/app.min.js"; level="medium"},
    @{source="js/ContentLoader.js"; output="dist/js/ContentLoader.min.js"; level="medium"},
    @{source="js/NavigationManager.js"; output="dist/js/NavigationManager.min.js"; level="medium"}
)

foreach ($file in $jsFiles) {
    if (Test-Path $file.source) {
        Write-Host "  Processing $($file.source)..." -NoNewline
        
        if ($file.level -eq "high") {
            # High obfuscation for protection.js
            javascript-obfuscator $file.source `
                --output $file.output `
                --compact true `
                --control-flow-flattening true `
                --control-flow-flattening-threshold 0.75 `
                --dead-code-injection true `
                --dead-code-injection-threshold 0.4 `
                --debug-protection false `
                --disable-console-output false `
                --string-array true `
                --string-array-encoding "base64" `
                --string-array-threshold 0.75 `
                --unicode-escape-sequence false `
                --simplify true `
                --rename-globals false `
                --self-defending true 2>$null
        } else {
            # Medium obfuscation for other files
            javascript-obfuscator $file.source `
                --output $file.output `
                --compact true `
                --control-flow-flattening false `
                --dead-code-injection false `
                --string-array true `
                --string-array-threshold 0.5 `
                --simplify true `
                --rename-globals false 2>$null
        }
        
        Write-Host " " -ForegroundColor Green
    } else {
        Write-Host "    $($file.source) not found" -ForegroundColor Yellow
    }
}

Write-Host ""

# ============================================
# MINIFY CSS FILES
# ============================================
Write-Host " Minifying CSS files..." -ForegroundColor Cyan

if (Test-Path "css/styles.css") {
    Write-Host "  Processing css/styles.css..." -NoNewline
    cleancss -o dist/css/styles.min.css css/styles.css 2>$null
    Write-Host " " -ForegroundColor Green
} else {
    Write-Host "    css/styles.css not found" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# COPY CONTENT FILES
# ============================================
Write-Host " Copying content files..." -ForegroundColor Cyan

Copy-Item -Path "content" -Destination "dist/content" -Recurse -Force
Write-Host " Content copied" -ForegroundColor Green
Write-Host ""

# ============================================
# CREATE PRODUCTION INDEX.HTML
# ============================================
Write-Host " Creating production index.html..." -ForegroundColor Cyan

$htmlContent = Get-Content "index.html" -Raw

# Replace file paths for minified versions
$htmlContent = $htmlContent.Replace("styles.css", "styles.min.css")
$htmlContent = $htmlContent.Replace("protection.js", "protection.min.js")
$htmlContent = $htmlContent.Replace("js/app.js", "js/app.min.js")

# Save to dist
$htmlContent | Out-File -FilePath "dist/index.html" -Encoding UTF8 -NoNewline

Write-Host " Production index.html created" -ForegroundColor Green
Write-Host ""

# ============================================
# UPDATE MODULE IMPORTS IN DIST
# ============================================
Write-Host "🔧 Updating module imports..." -ForegroundColor Cyan

if (Test-Path "dist/js/app.min.js") {
    $appContent = Get-Content "dist/js/app.min.js" -Raw
    $appContent = $appContent -replace "ContentLoader\.js", "ContentLoader.min.js"
    $appContent = $appContent -replace "NavigationManager\.js", "NavigationManager.min.js"
    $appContent | Out-File -FilePath "dist/js/app.min.js" -Encoding UTF8 -NoNewline
    Write-Host " Imports updated" -ForegroundColor Green
} else {
    Write-Host "  dist/js/app.min.js not found" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# FILE SIZE COMPARISON
# ============================================
Write-Host " File Size Comparison:" -ForegroundColor Cyan
Write-Host ""

function Get-FileSizeFormatted {
    param($path)
    if (Test-Path $path) {
        $size = (Get-Item $path).Length
        if ($size -lt 1KB) {
            return "$size B"
        } elseif ($size -lt 1MB) {
            return "{0:N2} KB" -f ($size / 1KB)
        } else {
            return "{0:N2} MB" -f ($size / 1MB)
        }
    }
    return "N/A"
}

$comparisons = @(
    @{name="protection.js"; original="js/protection.js"; minified="dist/js/protection.min.js"},
    @{name="app.js"; original="js/app.js"; minified="dist/js/app.min.js"},
    @{name="ContentLoader.js"; original="js/ContentLoader.js"; minified="dist/js/ContentLoader.min.js"},
    @{name="NavigationManager.js"; original="js/NavigationManager.js"; minified="dist/js/NavigationManager.min.js"},
    @{name="styles.css"; original="css/styles.css"; minified="dist/css/styles.min.css"}
)

Write-Host "File                    Original      Minified      Reduction" -ForegroundColor White
Write-Host "-------------------------------------------------------------" -ForegroundColor DarkGray

foreach ($comp in $comparisons) {
    if ((Test-Path $comp.original) -and (Test-Path $comp.minified)) {
        $origSize = (Get-Item $comp.original).Length
        $minSize = (Get-Item $comp.minified).Length
        $reduction = [math]::Round((($origSize - $minSize) / $origSize) * 100, 1)
        
        $origStr = Get-FileSizeFormatted $comp.original
        $minStr = Get-FileSizeFormatted $comp.minified
        
        Write-Host ("{0,-20} {1,12} {2,12} {3,10}%" -f $comp.name, $origStr, $minStr, $reduction) -ForegroundColor Gray
    }
}

Write-Host ""

# ============================================
# COPY README
# ============================================
if (Test-Path "README.md") {
    Copy-Item "README.md" "dist/README.md"
}

if (Test-Path "PROTECTION-GUIDE.md") {
    Copy-Item "PROTECTION-GUIDE.md" "dist/PROTECTION-GUIDE.md"
}

# ============================================
# FINAL MESSAGE
# ============================================
Write-Host ""
Write-Host "===============================================================" -ForegroundColor Green
Write-Host " Build completed successfully!" -ForegroundColor Green
Write-Host "===============================================================" -ForegroundColor Green
Write-Host ""
Write-Host " Production files tersimpan di folder: " -NoNewline -ForegroundColor White
Write-Host "dist/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. Test file di dist/index.html" -ForegroundColor Gray
Write-Host "   2. Deploy folder dist/ ke hosting" -ForegroundColor Gray
Write-Host "   3. Keep source files js/ dan css/ untuk development" -ForegroundColor Gray
Write-Host ""
Write-Host "Protections active:" -ForegroundColor Yellow
Write-Host "   - Code obfuscation: high level" -ForegroundColor Gray
Write-Host "   - JavaScript minification" -ForegroundColor Gray
Write-Host "   - CSS minification" -ForegroundColor Gray
Write-Host "   - Right-click disabled" -ForegroundColor Gray
Write-Host "   - DevTools detection" -ForegroundColor Gray
Write-Host "   - Copy/paste blocked" -ForegroundColor Gray
Write-Host "   - Inspect element blocked" -ForegroundColor Gray
Write-Host ""
Write-Host "Read PROTECTION-GUIDE.md for more info" -ForegroundColor Cyan
Write-Host ""
