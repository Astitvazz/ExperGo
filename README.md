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

---

## 📝 Project Reflection

### What was the hardest part of this assignment?
The hardest part was integrating file uploads (images) with Cloudinary and ensuring that the authentication system worked seamlessly across both the frontend and backend. Managing state globally with Zustand for authentication and user data also required careful design to avoid race conditions and ensure a smooth user experience.Managing Respnsiveness for small screen was a bit complex too.

### How did I debug an error?
I followed a systematic approach for debugging:
- Checked browser and server logs for error messages.
- Used `console.log` and `debugger` statements to trace code execution.
- Utilized Postman to test backend API endpoints independently.

### What would I improve if I had more time?
If I had more time, I would:
- Add pagination and search for blogs and comments.
- Improve responsiveness on small screens.
- Implement role-based authorization (admin/moderator).
- Enhance UI/UX with better design and more responsive layouts.
- Add Trending Feature
- User Search
- Blog Search
- Following and Unfollowing other accounts.
- Chat Feature.
## 📝 Project Reflection

<img width="1920" height="1080" alt="Screenshot 2025-09-11 210111" src="https://github.com/user-attachments/assets/ce9db869-db07-4266-8db9-abf96b2d1ef6" />

<img width="1920" height="1080" alt="Screenshot 2025-09-11 210055" src="https://github.com/user-attachments/assets/f2154584-a88f-4e65-85a9-f6bdabde5ade" />


<img width="1920" height="1080" alt="Screenshot 2025-09-11 210030" src="https://github.com/user-attachments/assets/03824411-3360-460e-9b00-ca950e000faa" />

<img width="1920" height="1080" alt="Screenshot 2025-09-11 210007" src="https://github.com/user-attachments/assets/0bd52839-63e4-4e33-b938-1bff57eba9c9" />

<img width="1920" height="1080" alt="Screenshot 2025-09-11 205933" src="https://github.com/user-attachments/assets/b420fd7a-fd7d-46e6-ac10-89b529df8cbc" />


<img width="1920" height="1080" alt="Screenshot 2025-09-11 205847" src="https://github.com/user-attachments/assets/41491075-06c4-4c60-8613-6605a692696c" />

<img width="1920" height="1080" alt="Screenshot 2025-09-11 205910" src="https://github.com/user-attachments/assets/5f5eb15c-02b8-4b66-ae78-c064550d1c98" />

