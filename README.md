React Native Threads-Like App (Android)
This is a React Native CLI project for Android, built with:

Firebase Authentication (Facebook login)

Firebase Realtime Database

Cloudinary for storing uploaded images and videos

TailwindCSS for styling (via nativewind)

Core app features similar to Threads by Instagram, excluding thread sharing.

🚀 Features
🔐 Facebook login via Firebase Authentication

🧵 Create, view, and interact with threads

💬 Comment (reply) and repost threads

📸 Upload images/videos to Cloudinary

🧑 Profile page with your posts

🎯 Activity feed showing threads and interactions

🎨 Styled using TailwindCSS

📦 Prerequisites
📌 Make sure you've completed the official React Native environment setup before continuing.

Node.js

Android Studio + emulator or Android device connected

Firebase project (Auth + Realtime Database configured)

Cloudinary account

🛠️ Installation
Clone the project and install dependencies:

sh
Sao chép
Chỉnh sửa
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
npm install
Firebase & Cloudinary Setup
Set up Firebase (Facebook Auth + Realtime DB)

Configure your .env file with Firebase and Cloudinary keys:

makefile
Sao chép
Chỉnh sửa
FIREBASE_API_KEY=your_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
...
▶️ Getting Started
Step 1: Start Metro
sh
Sao chép
Chỉnh sửa
npm run start
Step 2: Run the App on Android
sh
Sao chép
Chỉnh sửa
npm run android
✅ Make sure an emulator is running or a real Android device is connected with USB debugging enabled.

Step 3: Debug Log (Optional)
sh
Sao chép
Chỉnh sửa
npm run log
This runs adb logcat for debugging Android logs.

🔧 File Structure
bash
Sao chép
Chỉnh sửa
/src
  /components     # Reusable UI components
  /screens        # App screens (Home, Profile, etc.)
  /services       # Firebase & Cloudinary integrations
  /store          # App context or state management
App.tsx           # Entry point
🔄 Live Reloading
React Native supports Fast Refresh. Just save a file to see changes immediately.

Full reload:

Android: Press R twice in the terminal or Ctrl+M (Cmd+M on macOS) in the emulator and select Reload.

Device: Shake device to open Dev Menu → Reload

📚 Learn More
React Native Docs

Firebase Docs

Cloudinary Docs

NativeWind (TailwindCSS for RN)

📌 Notes
Currently only Android is supported.

You can build for iOS later by adding a macOS dev environment and CocoaPods.

Thread sharing is not included.

🧪 Troubleshooting
If you run into issues:

Follow React Native Troubleshooting Guide

Check your Firebase and Cloudinary setup.

Use npm run log for real-time logs and error tracking.
