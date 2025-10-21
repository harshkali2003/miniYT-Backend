# 🎬 MiniYT Backend

The backend service for **MiniYT**, a YouTube-inspired video streaming platform.  
This API handles authentication, user management, and video data operations, providing a secure and scalable backend for the MiniYT frontend.

---

## 🚀 Features

- 🔐 **Google OAuth Login** using Google Identity Services  
- 👤 **User Authentication** with JWT-based session management  
- 🎞️ **Video Uploads & Metadata** (titles, descriptions, thumbnails, etc.)  
- 💬 **Comment & Like APIs** (if implemented later)  
- ⚙️ **MongoDB Integration** using Mongoose  
- 🌐 **CORS Configured** for frontend-backend communication  
- 🧩 **Modular Structure** for scalability and maintainability

---

## 🛠️ Tech Stack

- **Node.js** – Runtime environment  
- **Express.js** – Web framework  
- **MongoDB** – Database  
- **Mongoose** – ODM for MongoDB  
- **Google OAuth 2.0** – User authentication  
- **JWT** – Token-based authentication  
- **dotenv** – Environment configuration  
- **CORS** – Secure cross-origin access

---


---

## 🧩 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/user/google-login` | Handles Google OAuth login and returns JWT |
| `GET`  | `/videos` | Fetch all videos |
| `POST` | `/videos/upload` | Upload a new video (if implemented) |
| `GET`  | `/videos/:id` | Get video details by ID |

---

## 🚀 Deployment

- **Frontend:** Netlify  
- **Backend:** Render  
- **Database:** MongoDB Atlas  


## 🧑‍💻 Author

**Harsh Vardhan**  
MERN Stack Developer | Java Programmer | 5⭐ HackerRank Java  
🔗 [LinkedIn](#)


Create a `.env` file in the root directory:

