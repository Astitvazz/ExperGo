# Blog Platform

A full-stack blog platform built with **React.js** (frontend), **Express.js** (backend), **MongoDB** (database), and **Zustand** (state management). This project allows users to create, read, update, and comment on blog posts with authentication, image uploads (via Cloudinary), and a modern UI.

---

## 🟢 Live Demo

👉 **[View the app live here!](https://exper-go-sigma.vercel.app/)**

---

## 🗂️ Folder Structure

```
.
├── backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
└── my-app
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── pages/
    │   ├── store/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── ...
    ├── .env
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

---

## 🚀 Features

- **Authentication:** Register, Login, and Profile management.
- **Blog Posts:** Create, view, edit, and delete blogs.
- **Comments:** Add and manage comments on each blog.
- **Media Uploads:** Image upload support via Cloudinary.
- **Modern UI:** Responsive design using React and custom CSS.
- **State Management:** Powered by Zustand for clean, scalable state.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Zustand, Vite
- **Backend:** Express.js, Node.js
- **Database:** MongoDB (Mongoose)
- **Cloud:** Cloudinary (image uploads)
- **Others:** JWT Auth, Custom Middleware

---

## ⚡ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Astitvazz/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Backend Setup

```bash
cd backend
npm install
```

- Create a `.env` file in the `backend` folder with the following variables:

    ```
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

- Start the backend server:

    ```bash
    npm run dev
    # or
    node index.js
    ```

### 3. Frontend Setup

```bash
cd ../my-app
npm install
```

- Create a `.env` file in the `my-app` folder if you need to store environment variables (e.g., VITE_API_URL).

- Start the frontend development server:

    ```bash
    npm run dev
    ```

### 4. Access the App

- Frontend: [http://localhost:5173](http://localhost:5173) (default Vite port)
- Backend API: [http://localhost:5000](http://localhost:5000) (default Express port)

---

## 🧑‍💻 Scripts

**Backend:**

- `npm run dev` — start the backend server in development with nodemon
- `node index.js` — start server normally

**Frontend:**

- `npm run dev` — start the frontend (Vite)
- `npm run build` — build for production

---

## 📂 Environment Variables

**Backend (`backend/.env`):**
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**Frontend (`my-app/.env`):**
- `VITE_API_URL` (e.g., `http://localhost:5000`)

---


## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Cloudinary](https://cloudinary.com/)
