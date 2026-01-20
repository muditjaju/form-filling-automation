# Outmarket Admin Helper - Chrome Extension

A Chrome extension for Outmarket admins to manage `IN_PROGRESS` customers and easily copy their data into various tools.

## Features

- **Admin Login**: Secure login with email and PIN.
- **Customer List**: Real-time listing of customers currently being processed.
- **Customer Search**: Search for customers by their email address.
- **Ready-to-Copy Overlay**: Injects a floating, draggable, and resizable overlay on any website to display customer details with one-click copy buttons.
- **TypeScript & Modular Design**: Built with modular TypeScript for better maintainability and performance.

## Project Structure

- `src/`: TypeScript source files.
  - `popup/`: Modules for the extension's popup UI.
  - `content/`: Modules for the content script and overlay logic.
- `dist/`: Compiled code and finalized extension folder.
- `icons/`: Extension icons.

## Build Instructions

To build the extension from source, run the following command from the project root:

```bash
npm run build:plugin
```

This will compile the TypeScript files and update the `browser-plugin/dist/` directory using the configuration in `browser-plugin/tsconfig.json`.

## Installation into Chrome

1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **"Developer mode"** (top right corner).
3.  Click **"Load unpacked"**.
4.  Navigate to and select the `browser-plugin/dist/` folder.

## Development

When making changes to the source files (`src/*`), make sure to:
1. Re-run the build command.
2. Go back to `chrome://extensions/` and click the **Reload** icon on the Outmarket Admin Helper extension.
