# Generate App Assets for MarianTrack

## Quick Setup

I've updated the app configuration to use "MarianTrack" as the app name. Now you need to create the icon and splash screen images.

## Option 1: Use Online Tools (Easiest)

### 1. Generate App Icon (1024x1024)

Use one of these free tools:
- **Canva**: https://www.canva.com/
- **Figma**: https://www.figma.com/
- **Icon Kitchen**: https://icon.kitchen/

**Design Suggestions for MarianTrack Icon:**
- Background: Red (#9b0302)
- Add a white "M" letter or footprint icon
- Keep it simple and recognizable
- Size: 1024x1024 pixels

### 2. Generate Splash Screen (1242x2436)

**Design:**
- Background: Red (#9b0302)
- Center: White "MarianTrack" text or logo
- Optional: Add tagline "Track Your Carbon Footprint"

### 3. Use Expo's Asset Generator

After creating your base images, use this tool to generate all sizes:
https://www.appicon.co/

## Option 2: Use Expo's Icon Generator

```bash
# Install expo-splash-screen
npx expo install expo-splash-screen

# Generate splash screen from a single image
npx expo-splash-screen --background-color "#9b0302"
```

## Required Assets

Place these files in the `assets` folder:

1. **icon.png** (1024x1024)
   - Main app icon
   - Will be used for iOS and Android

2. **adaptive-icon.png** (1024x1024)
   - Android adaptive icon foreground
   - Should have transparent background
   - Keep important elements in center 66%

3. **splash.png** (1242x2436 or larger)
   - Splash screen image
   - Will be shown when app launches
   - Background color: #9b0302 (set in app.json)

4. **favicon.png** (48x48)
   - Web favicon

## Quick Placeholder Creation

If you need quick placeholders for testing, you can use this simple approach:

### Using PowerShell (Windows):

```powershell
# This creates simple colored squares as placeholders
# You should replace these with proper designs later

# Create a simple red square for icon (requires ImageMagick or similar)
# Or use online tools mentioned above
```

## Design Guidelines

### Colors
- **Primary Red**: #9b0302
- **Dark Blue**: #0c2d55
- **White**: #FFFFFF

### Icon Design Tips
1. Keep it simple - icons are small
2. Use high contrast (white on red works well)
3. Avoid text in icons (except single letter like "M")
4. Make it recognizable at small sizes

### Splash Screen Design Tips
1. Center your logo/text
2. Use the red background (#9b0302)
3. Keep text large and readable
4. Add app name "MarianTrack"
5. Optional: Add a tagline

## After Creating Assets

1. Place all images in the `assets` folder
2. Make sure file names match:
   - `icon.png`
   - `adaptive-icon.png`
   - `splash.png`
   - `favicon.png`

3. Run prebuild to apply changes:
```bash
npx expo prebuild --clean
```

4. Test the app:
```bash
npx expo start
```

## Current Configuration

Your app.json is already configured with:
- ✅ App name: "MarianTrack"
- ✅ Package: com.mariantrack.app
- ✅ Splash background: #9b0302 (red)
- ✅ Adaptive icon background: #9b0302 (red)

You just need to create the image files!

## Need Help?

If you want me to create simple text-based placeholders, I can generate SVG files that you can convert to PNG using online tools like:
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/

Let me know if you need help with the design!
