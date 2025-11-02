# App Assets

This folder contains the app icon and splash screen assets for the Carbon Footprint Tracker app.

## Asset Requirements

### App Icon (icon.png)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Design**: Should feature a green leaf or earth icon representing environmental sustainability
- **Background**: Transparent or solid color (#4CAF50 - primary green)

### Adaptive Icon (adaptive-icon.png)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Design**: Same as app icon but optimized for Android adaptive icons
- **Safe Zone**: Keep important elements within the center 66% of the canvas

### Splash Screen (splash-icon.png)
- **Size**: 1242x2436 pixels (or larger)
- **Format**: PNG
- **Background**: Primary green (#4CAF50)
- **Design**: Centered app icon with app name below
- **Text**: "Carbon Footprint Tracker" in white

### Favicon (favicon.png)
- **Size**: 48x48 pixels
- **Format**: PNG
- **Design**: Simplified version of the app icon

## Design Guidelines

### Color Palette
- **Primary**: #4CAF50 (Green)
- **Secondary**: #2196F3 (Blue)
- **Accent**: #FF9800 (Orange)
- **Background**: #FFFFFF (White)

### Icon Concept
The app icon should convey:
- Environmental awareness
- Carbon footprint tracking
- Sustainability
- Clean, modern design

### Suggested Icon Elements
- Leaf symbol
- Earth/globe
- Footprint outline
- CO₂ molecule
- Recycling symbol

## Tools for Creating Assets

### Online Tools
- [Figma](https://www.figma.com/) - Professional design tool
- [Canva](https://www.canva.com/) - Easy-to-use design platform
- [Icon Kitchen](https://icon.kitchen/) - Android icon generator

### Asset Generators
- [App Icon Generator](https://www.appicon.co/) - Generate all required sizes
- [Expo Asset Generator](https://docs.expo.dev/guides/app-icons/) - Expo-specific tool

## Current Assets

The current placeholder assets should be replaced with professionally designed icons that match the app's branding and purpose.

### To Update Assets:
1. Design new icons following the guidelines above
2. Replace the files in this directory
3. Ensure file names match exactly:
   - `icon.png`
   - `adaptive-icon.png`
   - `splash-icon.png`
   - `favicon.png`
4. Run `expo prebuild --clean` to regenerate native projects (if needed)

## Testing

After updating assets:
1. Test on iOS simulator/device
2. Test on Android emulator/device
3. Verify splash screen displays correctly
4. Check app icon on home screen
5. Verify adaptive icon on Android (different launcher shapes)

## Notes

- All assets should be optimized for file size without losing quality
- Use PNG format for transparency support
- Maintain consistent branding across all assets
- Follow platform-specific guidelines (iOS Human Interface Guidelines, Material Design)
