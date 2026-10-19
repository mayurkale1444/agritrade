#!/usr/bin/env bash
# ==============================================================================
# AgriTrade - Android App Bundle (.aab) Release Generation Script
# Target SDK: 36 (Android 16 Ready)
# Application ID: in.agritrade.app
# ==============================================================================

set -e

echo "=========================================================="
echo " Starting AgriTrade Production Release AAB Build"
echo "=========================================================="

# 1. Build optimized web frontend
echo ">> Step 1: Building production web bundle..."
npm run build

# 2. Check Java / Android SDK environment and generate release bundle
echo ">> Step 2: Packaging Android App Bundle (AAB)..."
python3 scripts/generate-release-aab.py

echo "=========================================================="
echo " AgriTrade Android Release Bundle Ready for Play Console"
echo " Package Name: in.agritrade.app"
echo " Version Code: 3"
echo " Version Name: 1.0.2"
echo " Target SDK: 36 (Android 16)"
echo " Output: android/app/build/outputs/bundle/release/app-release.aab"
echo "=========================================================="
