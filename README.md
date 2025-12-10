# Aether - Advanced AI Bot Assistant

Aether is a dual-platform project featuring a futuristic mobile application build with React Native (Expo) and a companion static landing page.

## Project Structure

- **Mobile App**: The root directory contains the React Native/Expo project.
- **Website**: The `website/` directory contains the static landing page (`index.html`, `app.js`, `styles.css`).

## Prerequisites

Before running this project, ensure you have the following installed:

1.  **Node.js**: [Download and Install Node.js](https://nodejs.org/) (LTS version recommended).
2.  **Git**: [Download Git](https://git-scm.com/).
3.  **VS Code**: Recommended code editor. [Download VS Code](https://code.visualstudio.com/).
4.  **Expo Go**: Download the "Expo Go" app on your iOS or Android device from the App Store or Play Store.

## Getting Started

### 1. Clone the Repository

Open your terminal (Command Prompt, PowerShell, or VS Code Terminal) and run:

```bash
git clone https://github.com/Epic1st/Aether.git
cd Aether
```

### 2. Install Dependencies for Mobile App

The mobile app requires Node.js dependencies. Run the following command in the root folder:

```bash
npm install
```

## Running the Mobile App

To start the development server for the mobile application:

1.  Open the terminal in the project root.
2.  Run the start command:
    ```bash
    npx expo start
    ```
    *   Alternatively, you can run `npm start`.
3.  **To run on your phone**:
    *   Open the **Expo Go** app on your phone.
    *   **Android**: Scan the QR code shown in the terminal using the Expo Go app.
    *   **iOS**: Use the Camera app to scan the QR code (ensure you are on the same Wi-Fi network).
4.  **To run on Emulator/Simulator**:
    *   Press `a` in the terminal for Android Emulator (requires Android Studio).
    *   Press `i` in the terminal for iOS Simulator (requires Xcode on macOS).

## Running the Website

The website is a static HTML/CSS/JS site located in the `website/` folder.

**Recommended Method (VS Code Live Server):**

1.  Open VS Code.
2.  Go to the Extensions view (Ctrl+Shift+X) and search for **"Live Server"** by Ritwick Dey. Install it.
3.  Open the `website/index.html` file in VS Code.
4.  Right-click anywhere in the file and select **"Open with Live Server"**.
5.  The site will automatically open in your default browser.

**Alternative Method:**

1.  Navigate to the `website/` folder in your file explorer.
2.  Double-click `index.html` to open it directly in your browser.

## Troubleshooting

*   **'expo' is not recognized**: Ensure you are running commands inside the project folder where `package.json` is located.
*   **Repo not found**: Make sure you have the correct URL `https://github.com/Epic1st/Aether.git`.
*   **Dependency errors**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again.
*   **App not loading**: Ensure your computer and phone are connected to the **same Wi-Fi network**.