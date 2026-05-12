# GrocyGo - Grocery Shopping List App

A React Native application for managing grocery shopping lists, built with Expo and featuring user authentication, list sharing, and product management.

## App Preview 📱

<div align="center">
  <img src="./client/preview/1.jpg" alt="App Screenshot 1" width="300" height="auto" />
  <img src="./client/preview/2.jpg" alt="App Screenshot 2" width="300" height="auto" />
</div>

## Features

- User authentication with Clerk
- Create and manage shopping lists
- Add products to lists
- Share lists with others
- Scan products (camera integration)
- Color and emoji customization
- Offline support with SQLite
- Cross-platform (iOS, Android, Web)

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI
- For mobile development: Android Studio (for Android) or Xcode (for iOS)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd GroceryApp
   ```

2. Install client dependencies:

   ```bash
   cd client
   npm install
   ```

3. Install server dependencies:
   ```bash
   cd ../server
   npm install
   ```

## Setup

### Environment Variables

1. For the client, create a `.env` file in the `client` directory with your Clerk keys:

   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

2. For the server, configure Cloudflare Workers if deploying, or set up local development.

### Clerk Setup

- Sign up for a Clerk account at [clerk.dev](https://clerk.dev)
- Create a new application
- Copy the publishable and secret keys to your environment variables

## Running the App

1. Start the server:

   ```bash
   cd server
   npm run dev
   ```

2. In a new terminal, start the client:

   ```bash
   cd client
   npm start
   ```

3. Follow the Expo CLI prompts to run on your desired platform:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web

## Project Structure

- `client/`: React Native Expo app
  - `app/`: Expo Router screens and routes
  - `assets/`: images, icons, and static resources
  - `component/`: reusable UI components
  - `context/`: app context providers and hooks
  - `hooks/`: custom React hooks
  - `stores/`: persistence and sync stores
  - `utils/`: shared utilities and helpers
- `server/`: Cloudflare Worker backend and API logic
- `preview/`: app demo screenshots

## Key File Descriptions

- `client/app.json`: Expo app configuration, icons, and platform settings.
- `client/babel.config.js`: Babel configuration for Expo and nativewind.
- `client/tsconfig.json`: TypeScript configuration for the client app.
- `client/app/_layout.tsx`: Main layout for Expo Router navigation.
- `client/app/(auth)/index.tsx`: Authentication landing and sign-in logic.
- `client/app/(index)/index.tsx`: Main app home screen and navigation entry.
- `client/component/`: Custom UI components used across the app.
- `client/stores/ShoppingListsStore.tsx`: Shopping list persistence store.
- `client/stores/ShoppingListStore.tsx`: Individual shopping list state management.
- `server/package.json`: Server dependency and script definitions.
- `server/src/index.ts`: Entry point for the Cloudflare Worker backend.
- `preview/1.jpg`, `preview/2.jpg`, `preview/3.jpg`: App demo screenshots used in this README.

## How to Use the App

1. Open the app and sign in using Clerk authentication.
2. Create a new shopping list from the main list screen.
3. Add products to the list using the product form or camera scanner.
4. Customize each list with colors and emojis.
5. Share a list with others using the share action on a list page.
6. View and edit products by selecting a product inside any shopping list.

## Development Guide

- Use `npm install` inside both `client/` and `server/` to install dependencies.
- Start development with `npm start` in `client/` and `npm run dev` in `server/`.
- Edit UI and navigation inside `client/app/`.
- Add reusable components to `client/component/` and helper functions to `client/utils/`.
- Manage app state and persistence in `client/stores/` and `client/context/`.
- Run Expo in web mode with `npm run web` from `client/`.
- Use the `client/.eslintrc` and `babel.config.js` configuration if linting or build issues appear.

## Technologies Used

- React Native
- Expo
- Clerk (Authentication)
- Tinybase (Database)
- NativeWind (Styling)
- Expo Router (Navigation)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
