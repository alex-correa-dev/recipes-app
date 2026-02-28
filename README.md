# 🍳 Recipes App - Mobile First with React Native & Expo

[![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-29.7-C21325?style=flat&logo=jest)](https://jestjs.io/)
[![Testing Library](https://img.shields.io/badge/RNTL-13.3-E33332?style=flat&logo=testing-library)](https://callstack.github.io/react-native-testing-library/)

> A recipe application built to consolidate knowledge in React Native and explore the Expo ecosystem. This project serves as a solid foundation to demonstrate mobile development best practices, including unit testing, state management, API consumption, and navigation.

## ✨ Features

- **Recipe Search**: Find recipes by name with debounce functionality to optimize API calls.
- **Intuitive Navigation**: Explore recipes by category on the home screen and view complete details (ingredients, instructions, and YouTube video) on a dedicated screen.
- **Favorites List**: Add and remove recipes from your personal favorites list, with persistent data using `AsyncStorage`.
- **Consistent Design**: Clean and responsive interface built with reusable components and a custom design system.

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 54](https://docs.expo.dev/) - For rapid development and easy access to native APIs.
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) - File-based navigation, modern and efficient.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - For more robust code with static typing and an enhanced development experience.
- **State & Data Management**: [TanStack Query](https://tanstack.com/query/latest) for asynchronous requests and caching, combined with `useState` and `AsyncStorage` for favorites logic.
- **Styling**: React Native's `StyleSheet`, focusing on performance and componentization.
- **Testing**: [Jest](https://jestjs.io/) and [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) to ensure quality and proper component functionality.
- **Icons**: `@expo/vector-icons` (MaterialIcons and Ionicons).

## 📂 Project Structure

The project is organized to be scalable and maintainable, following best practices for separation of concerns:

```
recipes-app/
├── app/ # Application routes (Expo Router)
│ ├── (tabs)/ # Tab routes (Home, Search, Favorites)
│ └── recipe/[id].tsx # Details screen (dynamic route)
├── components/ # Reusable UI components
├── hooks/ # Custom hooks (e.g., useFavorites)
├── services/ # API layer (recipeApi)
├── utils/ # Utilities (e.g., AsyncStorage wrapper)
├── types/ # Global TypeScript types and interfaces
├── tests/ # Unit tests (mirrored structure)
├── mocks/ # Manual mocks for testing
├── assets/ # Images and fonts
├── jest.config.js # Jest configuration
└── babel.config.js # Babel configuration (with alias support)
```

## 🚀 How to Run the Project

### Prerequisites

- Node.js (version 20 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- An Android/iOS emulator set up or the Expo Go app on your physical device

### Step by Step

1. **Clone the repository**

   ```bash
   git clone https://github.com/alex-correa-dev/recipes-app.git
   cd recipes-app

   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npx expo start
   ```
   Scan the QR Code with the Expo Go app (Android/iOS) or press `a` to open in the Android emulator, `ì for iOS.

## 🧪 Running Tests

Code quality is a priority in this project. Therefore, a suite of unit tests has been implemented covering the main components, hooks, and utilities.

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## ✨ Code Standards and Linting

To maintain code consistency and quality, we use ESLint with the configuration recommended by Expo.

```bash
# Check for linting issues
npm run lint

# Automatically fix issues
npm run lint -- --fix
```

## 📱 Screenshots

| Android                               | iOS                               |
| ------------------------------------- | --------------------------------- |
| ![](/screenshots/android_home.png)    | ![](/screenshots/ios_home.png)    |
| ![](/screenshots/android_details.png) | ![](/screenshots/ios_details.png) |

## 💡 What This Project Demonstrates About Me

- **Mastery of the React Native Ecosystem**: Practical experience with Expo, Expo Router, navigation, and hooks.
- **Commitment to Quality**: Implementation of unit tests with Jest and Testing Library, ensuring code robustness.
- **Clean and Organized Code**: Clear folder structure, use of TypeScript, creation of reusable components, and custom hooks.
- **Development Best Practices**: API consumption, state management, data persistence (AsyncStorage), and performance optimization with debounce.
- **Technical Communication**: Ability to document the project clearly and objectively for other developers.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📬 Contact

**Alex Roberto Corrêa**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/alex-correa-947955a2/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/alex-correa-dev)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:alx.rcorrea@gmail.com)

---

**Built with ☕ and dedication by Alex Corrêa.**
