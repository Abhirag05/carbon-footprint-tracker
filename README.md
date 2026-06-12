# Carbon Footprint Tracker

A React Native mobile application for tracking and analyzing personal carbon footprint across various activities including transportation, energy usage, food consumption, and waste generation.

## Features

- 📊 **Activity Tracking**: Log daily activities and their carbon emissions
- 📈 **Insights & Analytics**: Visualize your carbon footprint with charts and trends
- 🔄 **Offline Support**: Works offline with automatic sync when online
- 🔐 **User Authentication**: Secure Firebase authentication
- 🎨 **Polished UI**: Modern, responsive design with smooth animations
- 📱 **Cross-Platform**: Works on iOS and Android

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carbon-footprint-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
    # Edit .env and add your Firebase credentials
    # See docs/FIREBASE_SETUP.md for detailed instructions
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## Environment Setup

The app requires Firebase configuration. Follow these steps:

1. Copy `.env.example` to `.env`
2. Get your Firebase credentials from [Firebase Console](https://console.firebase.google.com/)
3. Update the `.env` file with your credentials
4. Restart the development server

**📖 For detailed setup instructions, see [FIREBASE_SETUP.md](./docs/FIREBASE_SETUP.md)**

## Project Structure

```
carbon-footprint-tracker/
├── docs/                 # Project documentation and guides
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/          # React Context providers
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # App screens
│   ├── services/         # Business logic and API calls
│   ├── theme/            # Theme configuration
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Images, icons, fonts
├── .env                  # Environment variables (not in git)
├── .env.example         # Environment template
├── App.tsx              # App entry point
└── package.json         # Dependencies
```

## Key Technologies

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Firebase** - Authentication and database
- **React Navigation** - Navigation
- **React Native Paper** - UI components
- **React Native Chart Kit** - Data visualization

## Available Scripts

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Build for production (Android)
npm run build:android:production

# Build for production (iOS)
npm run build:ios:production
```

## Features in Detail

### Activity Tracking
- Track transportation (car, bus, train, bike, walk)
- Monitor energy usage (electricity, gas, renewable)
- Log food consumption (meals with carbon impact)
- Record waste generation (recyclable, compostable, landfill)

### Insights & Analytics
- Daily, weekly, and monthly emission trends
- Category breakdown charts
- Personalized recommendations
- Historical data analysis

### Offline Support
- Activities saved locally when offline
- Automatic sync when connection restored
- Pending sync indicator
- Conflict resolution

### User Experience
- Smooth animations and transitions
- Haptic feedback for interactions
- Responsive layouts for all screen sizes
- Consistent theming throughout

## Documentation

All project documentation guides can be found in the [docs/](./docs) directory:
- [Firebase Setup Guide](./docs/FIREBASE_SETUP.md) - Detailed environment configuration
- [UI Polish Guide](./docs/UI_POLISH_GUIDE.md) - UI/UX features and guidelines
- [UI Improvements Summary](./docs/UI_IMPROVEMENTS_SUMMARY.md) - Recent UI enhancements
- [Security Overview](./docs/SECURITY.md) - Credential management and db security
- [Assets Guide](./assets/README.md) - App icon and splash screen guidelines

## Security

- ✅ API keys stored in environment variables
- ✅ `.env` file excluded from version control
- ✅ Firebase security rules configured
- ✅ User authentication required for all operations
- ✅ Data validation on client and server

**⚠️ Never commit your `.env` file to version control!**

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore Database
4. Set up security rules (see `src/services/firebaseService.ts`)
5. Add your credentials to `.env`

## Troubleshooting

### App won't start
- Make sure you have a `.env` file with valid Firebase credentials
- Try clearing the cache: `npm start -- --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Firebase errors
- Verify your Firebase credentials in `.env`
- Check that Authentication and Firestore are enabled in Firebase Console
- Ensure security rules are properly configured

### Build errors
- Update dependencies: `npm update`
- Clear Expo cache: `expo start -c`
- Check for TypeScript errors: `npx tsc --noEmit`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review the documentation files
- Open an issue on GitHub

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI components from [React Native Paper](https://callstack.github.io/react-native-paper/)
- Charts powered by [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- Backend by [Firebase](https://firebase.google.com/)

---

**Made with 💚 for a sustainable future**
