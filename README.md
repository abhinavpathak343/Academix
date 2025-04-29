# 📚 Academix

Academix is a modern educational platform offering real-time live classes, secure Google OAuth login, and a seamless, fast learning experience. Built with cutting-edge web technologies for optimal performance and scalability.

[![Visit Academix](https://img.shields.io/badge/Visit-Academix-4F46E5?style=for-the-badge&logo=vercel)](https://academix-oz6b.vercel.app/)


## 🚀 Features

- **⚡ Ultra-fast Frontend** — Built with React + Vite for lightning performance
- **🎥 WebRTC Live Classes** — Real-time video and audio learning sessions
- **🔒 Google OAuth Authentication** — Secure and hassle-free login/signup flow
- **📱 Fully Responsive** — Perfect experience on desktop, tablet, and mobile
- **🎨 Intuitive Interface** — Clean UI designed for optimal learning
- **🌐 Full-Stack Deployment** — Frontend on Vercel, Backend on Railway
- **🔥 Scalable Architecture** — Built for future feature expansion


## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React, Vite, Tailwind CSS |
| **Authentication** | Google OAuth 2.0 |
| **Live Classes** | WebRTC,WebSocket's |
| **Backend** | Node.js, Express |
| **Database** | MongoDB |
| **State Management** | React Context API |
| **Deployment** | Vercel (Frontend), Railway (Backend) |

## ⚙️ Architecture

```
  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
  │             │       │             │       │             │
  │  Frontend   │◄─────►│   Backend   │◄─────►│  Database   │
  │  (Vercel)   │       │  (Railway)  │       │ (MongoDB)   │
  │             │       │             │       │             │
  └─────────────┘       └─────────────┘       └─────────────┘
         ▲                     ▲                    
         │                     │                    
         ▼                     ▼                    
  ┌─────────────┐       ┌─────────────┐       
  │             │       │             │       
  │    OAuth    │       │   WebRTC    │       
  │  Provider   │       │   Server    │       
  │             │       │             │       
  └─────────────┘       └─────────────┘       
```

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/academix/repo.git

# Navigate to project directory
cd academix

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```


## 💡 Key Features in Depth

### WebRTC Live Classes

Academix leverages WebRTC technology to provide high-quality, low-latency video streaming for virtual classrooms.

### Secure Authentication

User security is paramount at Academix. Our authentication system:

- Implements Google OAuth 2.0 for trusted authentication
- Uses JWT for secure session management
- Maintains proper RBAC (Role-Based Access Control)
- Complies with data protection regulations


 
