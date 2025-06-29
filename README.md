# 📝 Smart Notes App

A **progressive, offline-first notes application** built with **React, IndexedDB, and Firebase**. This app enables users to create, edit, delete, and sync notes seamlessly across offline and online states.

---

## 🔧 Tech Stack

| Layer         | Technology                    |
| ------------- | ----------------------------- |
| Frontend      | React + TypeScript            |
| Local Storage | IndexedDB (via `idb` package) |
| Cloud Sync    | Firebase Firestore            |
| Styling       | CSS / Tailwind (optional)     |

---

## 🚀 Features

- ✅ Create and edit text notes
- ✅ Tag notes with keywords
- ✅ Store notes offline (IndexedDB)
- ✅ Auto-sync unsynced notes when back online
- ✅ Delete notes (syncs to Firebase)
- ✅ Notes sorted by newest
- ✅ Clean, responsive UI

---

## 📦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/smart-notes-app.git
cd smart-notes-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Firebase

- Go to Firebase Console
- Create a new project
- Enable Cloud Firestore
- Create a collection named notes
- Replace the Firebase config in firebase.ts

### 4. Scripts

```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm preview   # Preview production build
```

### 5. Architecture Overview

- Notes are stored in IndexedDB first for instant offline-first behavior.

- If online:
  Notes are immediately synced to Firebase Firestore.

- If offline:
  - Notes are flagged synced: false and stored locally.
  - When network connectivity resumes:
    - Unsynced notes (create/update/delete) are synced automatically to Firestore.
