# 📱 React Native Threads-Like App (Android)

## ✨ About This Project  
This is a **React Native CLI** project designed for **Android**, inspired by the core features of **Threads by Instagram** (excluding share functionality).

### 🔧 Tech Stack  
- **React Native CLI**
- **Firebase Authentication** (Facebook login)  
- **Firebase Realtime Database**  
- **Cloudinary** – Store images and videos  
- **TailwindCSS** (via `nativewind`) for styling  

---

## 📦 Features  
- 🔐 **Login with Facebook** using Firebase  
- 🧕 **Create, view, comment, and repost threads**  
- 🧑‍💬 **Profile page** displaying user threads  
- 🖼️ **Upload image/video** to Cloudinary  
- 🎯 **Activity screen** showing posts and replies  
- ⚡ **Fast Refresh** for development speed  

---

## 🛠️ Setup Instructions  

### 📌 Prerequisites  
Make sure you’ve followed the official [React Native environment setup](https://reactnative.dev/docs/environment-setup).

> You need:
> - Node.js  
> - Android Studio or physical Android device  
> - Firebase project setup  
> - Cloudinary account

---

## 📁 Installation  

```bash
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
npm install
```

---

## 🔐 Environment Setup  

Create a `.env` file in the root and add your Firebase and Cloudinary credentials:

```env
FIREBASE_API_KEY=your_key
FIREBASE_PROJECT_ID=your_project_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## ▶️ Getting Started

### 1. Start Metro

```bash
npm run start
```

### 2. Run the App on Android

```bash
npm run android
```

### 3. View Android Logs

```bash
npm run log
```

> ⚠️ Ensure an Android emulator or device is connected and USB debugging is enabled.

---

---

## 🔄 Reload Options

- **Fast Refresh**: Auto-updates on file save  
- **Full Reload**:  
  - Press `R` twice in Metro terminal  
  - Or use `Ctrl+M` (Cmd+M on macOS) to open Dev Menu and tap **Reload**  

---

## 📚 Learn More

- 🌐 [React Native Docs](https://reactnative.dev/docs/getting-started)  
- 🔥 [Firebase Docs](https://firebase.google.com/docs)  
- ☁️ [Cloudinary Docs](https://cloudinary.com/documentation)  
- 🎨 [NativeWind Docs](https://www.nativewind.dev)  

---

## 🛠️ Troubleshooting

If you run into issues:

- Follow the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)  
- Double-check `.env` configurations  
- Use `npm run log` for Android logs  

---

## 📌 Notes

- ✅ This project currently **only supports Android**  
- ❌ **Thread sharing** is not implemented  
- 🧪 iOS support can be added later (via macOS + CocoaPods)

