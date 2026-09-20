# Food Delivery App 🍔

A cross-platform mobile application for ordering food from restaurants and cafes, built with **React Native** and **Expo**. The app features user authentication, image capture, offline support, Firebase synchronization, multi-language support, and a modern UI with light/dark theme.

## 📋 About The Project

**Food Delivery App** is a mobile application that allows users to browse recommended dishes from an external API, create and manage their own restaurant orders, take photos of dishes, and share them. The app follows a clean **MVVM-style architecture** with `ViewModels` and `Services`, and works seamlessly both online and offline.

### Key Features

- **User Authentication:** Register and log in via Firebase Authentication (email/password).
- **Order Management:** Create, edit, delete, and search orders.
- **Fuzzy Search:** Filter orders by title or description in real time.
- **Sorting:** Sort orders by name (A–Z) or by newest first.
- **Image Capture:** Pick images from gallery or take photos with the camera (`expo-image-picker`).
- **Cloud Image Upload:** Automatic upload of selected images to Cloudinary.
- **Firebase Sync:** Real-time synchronization of orders with Firestore.
- **Offline Support:** Local SQLite database caches orders and API data.
- **Network Status Indicator:** Banner displayed when the device is offline.
- **Recommended Dishes:** Fetches random meals from [TheMealDB API](https://www.themealdb.com/api.php).
- **Local Notifications:** Schedule order reminders via `expo-notifications`.
- **Dark / Light Theme:** Automatic theme based on system preference with manual toggle.
- **Internationalization (i18n):** Full support for **Russian** and **English**.
- **Share Orders:** Native `Share` API to send order details.
- **Splash Screen:** Animated intro with a rotating bicycle icon.
- **Settings Screen:** Theme toggle, language picker, app info, and logout.
- **Responsive UI:** Works on phones and tablets.

## 🛠 Technologies

The project is built on a modern React Native stack:

- **React Native** (Expo) — Cross-platform mobile framework.
- **Expo SDK** — Managed workflow with `expo-image-picker`, `expo-notifications`, `expo-vector-icons`.
- **Firebase** — Authentication (`firebase/auth`) and Firestore (`firebase/firestore`).
- **Cloudinary** — Cloud image storage for order photos.
- **SQLite (`expo-sqlite`)** — Local database for offline caching.
- **AsyncStorage** — Persistent storage for theme and language preferences.
- **NetInfo** (`@react-native-community/netinfo`) — Network connectivity monitoring.
- **React Navigation** — Native stack navigation between screens.
- **TheMealDB API** — External source of recommended dishes.
- **@expo/vector-icons (Ionicons)** — Icon set.

## 📂 Project Structure

```text
MobileApp/
├── assets/                          # Images, fonts, app icons
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js            # Reusable button
│   │   │   ├── Card.js              # Rounded card container
│   │   │   ├── Header.js            # Section heading
│   │   │   └── Input.js             # Themed text input
│   │   ├── ApiDataCard.js           # Recommended dishes card (TheMealDB)
│   │   ├── CameraButton.js          # Camera icon + launchCameraAsync
│   │   ├── FoodItem.js              # Order list item with delete action
│   │   ├── NetworkStatus.js         # Offline banner
│   │   └── ShareButton.js           # Native share button
│   ├── config/
│   │   └── firebase.js              # Firebase initialization (auth + firestore)
│   ├── constants/
│   │   ├── colors.js                # LIGHT_COLORS / DARK_COLORS palettes
│   │   └── languages.js             # LANGUAGES list + DEFAULT_LANGUAGE
│   ├── models/
│   │   └── OrderModel.js            # Order entity + fromDatabase mapper
│   ├── screens/
│   │   ├── AuthScreen.js            # Login / Register form
│   │   ├── CartScreen.js            # Empty cart placeholder
│   │   ├── DetailsScreen.js         # Order details + reminder + share
│   │   ├── MainScreen.js            # Orders list + toolbar + add order
│   │   ├── SettingsScreen.js        # Theme, language, about, logout
│   │   └── SplashScreen.js          # Animated intro screen
│   ├── services/
│   │   ├── APIService.js            # TheMealDB fetch
│   │   ├── AuthService.js           # Firebase Auth wrapper (singleton)
│   │   ├── NetworkMonitor.js        # NetInfo listener + pub/sub
│   │   ├── NotificationService.js   # expo-notifications wrapper
│   │   └── RemoteDBService.js       # Firestore orders + Cloudinary upload
│   ├── utils/
│   │   ├── database.js              # SQLite helpers (orders cache, API cache)
│   │   ├── helpers.js               # showAlert, formatDate, validateInput
│   │   ├── i18n.js                  # I18nProvider + useI18n hook
│   │   └── theme.js                 # ThemeProvider + useTheme hook
│   └── viewmodels/
│       └── OrdersViewModel.js       # Orders + sync + search + sort logic
├── App.js                           # Root component + providers + navigation
├── app.json                         # Expo configuration
├── index.js                         # Expo entry point
├── package.json
└── README.md
```

## 🚀 Installation and Setup

To run the project locally, follow these steps.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/MobileApp.git
cd MobileApp
```

### 2. Install dependencies

Using **npm**:

```bash
npm install
```

Or using **yarn**:

```bash
yarn install
```

### 3. Configure Firebase

Firebase is already configured in `src/config/firebase.js`. To use your own project, replace the `firebaseConfig` object with your credentials:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Make sure **Email/Password** authentication and **Firestore** are enabled in your Firebase console.

### 4. Configure Cloudinary (optional)

Image upload uses a public Cloudinary preset. If you want to use your own account, update the constants in `src/services/RemoteDBService.js`:

```js
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET = 'your_unsigned_preset';
```

### 5. Start the Expo development server

```bash
npx expo start
```

Or:

```bash
npm start
```

Then press:

- `a` — open on Android emulator
- `i` — open on iOS simulator
- `w` — open in web browser
- Scan the QR code with the **Expo Go** app on your physical device.

### 6. Run on a specific platform

```bash
npm run android
npm run ios
npm run web
```

## ✨ Implementation Details

### Architecture (MVVM)

The app follows a **Model–View–ViewModel** pattern:

- **Model:** `OrderModel` — the data shape of an order.
- **View:** React Native screens (`MainScreen`, `DetailsScreen`, etc.).
- **ViewModel:** `OrdersViewModel` — holds business logic, subscribes listeners, and notifies the UI of changes.

Screens subscribe via:

```js
const unsubscribe = viewModel.subscribe(setState);
```

This keeps the UI reactive without a heavy state library.

### Authentication Flow

- `AuthService` is a **singleton** wrapping Firebase Auth.
- On `logout()`, it clears the local SQLite `orders` table to protect user privacy.
- `initAuthListener()` uses `onAuthStateChanged` to keep the user in sync.
- `App.js` renders `AuthScreen` if no user, otherwise the main navigator.

### Offline-First Data Flow

1. All orders are stored in **SQLite** (`utils/database.js`).
2. When online, orders are also pushed to **Firestore** (`RemoteDBService.saveOrder`).
3. `subscribeToOrders` listens to Firestore changes and pushes them into the local DB.
4. `OrdersViewModel.syncWithFirebase` deduplicates by `firebaseId` **and** by `title + date` to prevent duplicates.
5. Recommended dishes are cached and served from cache when offline.

### Image Handling

- `CameraButton` uses `expo-image-picker` → `launchCameraAsync`.
- `MainScreen` uses `launchImageLibraryAsync` for gallery selection.
- `RemoteDBService.uploadImage` sends the file to **Cloudinary** via `FormData` and returns the secure URL, which is then saved with the order.

### Theming

- `ThemeProvider` reads the system color scheme via `useColorScheme()`.
- User's choice is persisted in `AsyncStorage` (`'theme'` key).
- `useTheme()` returns `{ theme, colors, toggleTheme }`.
- Palettes are defined in `constants/colors.js` as `LIGHT_COLORS` and `DARK_COLORS`.

### Internationalization (i18n)

- `I18nProvider` stores translations for **Russian** and **English**.
- `useI18n()` returns `{ language, changeLanguage, t }`.
- Language is persisted in `AsyncStorage`.
- `LANGUAGES` list is defined in `constants/languages.js` and rendered in `SettingsScreen`.

### Network Monitoring

- `NetworkMonitor` is a singleton wrapping `NetInfo`.
- Components subscribe via `networkMonitor.addListener(cb)`.
- `NetworkStatus` renders a red banner when the device goes offline.
- `OrdersViewModel` also listens to switch between cloud and cache modes.

### Notifications

- `NotificationService` uses `expo-notifications` to schedule order reminders.
- Triggered from `DetailsScreen` via the "Remind about order" button.

### State Sync Prevention

`OrdersViewModel.syncWithFirebase` uses two guards:

1. `existingFirebaseIds` — skip orders already linked to a Firestore ID.
2. `pendingLocalIds` — skip orders with the same `title + date` that haven't yet been synced.

This prevents the classic offline/online duplicate-order bug.

## 📞 Contacts
- **GitHub:** [github.com/ppl0l/MobileApp](https://github.com/ppl0l/MobileApp)

---

*Mobile application developed as part of an academic project.*
