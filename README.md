# 📝 ToDo Web App --- Full Stack Assignment (Humanli.AI)

A full-stack To-Do Board Management application where users can:

-   Register & Login (Firebase Authentication)
-   Create Boards
-   Add, update & delete Todos inside boards
-   Perform all CRUD operations
-   Fully secure API using Firebase Admin verification

------------------------------------------------------------------------

## 🚀 Tech Stack

### **Frontend**

-   React.js
-   Tailwind CSS
-   Firebase Authentication
-   Axios

### **Backend**

-   Node.js + Express.js
-   MongoDB (local via MongoDB Compass)
-   Firebase Admin SDK
-   Mongoose

------------------------------------------------------------------------

## 📌 Features

-   Email/Password Login
-   Protected Routes
-   Board Management (CRUD)
-   Todo Management inside Boards (CRUD)
-   Firebase Token Security

------------------------------------------------------------------------

## 📂 Folder Structure

    todo-app/
      backend/
        src/
          config/db.js
          middleware/auth.js
          models/Board.js
          models/Todo.js
          routes/boardRoutes.js
          routes/todoRoutes.js
          app.js
          server.js
        firebase-admin.json
        .env
        package.json

      frontend/
        src/
          pages/
          components/
          context/AuthContext.jsx
          firebase.js
          api.js
          App.js
          index.js
          index.css
        tailwind.config.js
        package.json

------------------------------------------------------------------------

# ⚙️ Backend Setup

    cd backend
    npm install

Create `.env`:

    MONGO_URI=mongodb://127.0.0.1:27017/todoapp
    PORT=5000

Start backend:

    npm run dev

------------------------------------------------------------------------

# 🎨 Frontend Setup

    cd frontend
    npm install
    npm start

------------------------------------------------------------------------

# 🎯 How to Run Full Project

Start backend:

    cd backend
    npm run dev

Start frontend:

    cd frontend
    npm start

------------------------------------------------------------------------

# 📡 API Endpoints

## Boards

-   GET `/api/boards`
-   POST `/api/boards`
-   PUT `/api/boards/:id`
-   DELETE `/api/boards/:id`

## Todos

-   GET `/api/todos/:boardId`
-   POST `/api/todos`
-   PUT `/api/todos/:id`
-   DELETE `/api/todos/:id`

------------------------------------------------------------------------

# 🙌 Thank You

Full-stack assignment project for Humanli.AI\
Author: **Harsh Kumar Agrawal**
