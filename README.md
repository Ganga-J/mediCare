# MediCare - Healthcare Management System

A comprehensive full-stack MERN (MongoDB, Express.js, React, Node.js) healthcare management application that connects patients with doctors through real-time chat, appointment scheduling, and user management.

## 🌟 Features

- **User Authentication**: Secure JWT-based authentication for patients and doctors
- **Real-time Chat**: Socket.IO powered messaging between patients and doctors
- **Appointment Management**: Schedule, view, and manage medical appointments
- **User Profiles**: Dedicated dashboards for patients and doctors
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Role-based Access**: Different permissions for patients vs doctors

## 🚀 Live Demo

- **Frontend**: [https://medi-care-gamma-vert.vercel.app](https://medi-care-gamma-vert.vercel.app)
- **Backend API**: [https://medicare-backend-j5kv.onrender.com](https://medicare-backend-j5kv.onrender.com)

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Data validation

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Socket.IO Client** - Real-time features

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting

## 📁 Project Structure

```
mediCare/
├── backend/
│   └── server/
│       ├── config/
│       │   └── dbConnect.js          # Database connection
│       ├── controllers/              # Business logic
│       │   ├── appointmentController.js
│       │   ├── authControllers.js
│       │   ├── chatController.js
│       │   ├── doctorControllers.js
│       │   └── patientController.js
│       ├── middleware/
│       │   ├── authMiddleware.js     # JWT authentication
│       │   ├── errorHandler.js       # Error handling
│       │   └── validator.js          # Input validation
│       ├── models/                   # Database schemas
│       │   ├── appointment.js
│       │   ├── chat.js
│       │   ├── doctor.js
│       │   ├── message.js
│       │   ├── patient.js
│       │   └── user.js
│       ├── routes/                   # API routes
│       │   ├── appointmentRoutes.js
│       │   ├── authRoutes.js
│       │   ├── chatRoutes.js
│       │   ├── doctorRoutes.js
│       │   ├── mediBridgeRoutes.js
│       │   └── patientRoutes.js
│       ├── utils/
│       │   └── customError.js
│       ├── .env                      # Environment variables
│       ├── package.json
│       ├── server.js                 # Main server file
│       └── render.yaml               # Render deployment config
├── frontend/
│   └── mediCare-Client/
│       ├── public/
│       ├── src/
│       │   ├── components/           # Reusable components
│       │   ├── context/              # React context
│       │   │   └── AuthContext.jsx
│       │   ├── hooks/                # Custom hooks
│       │   ├── pages/                # Page components
│       │   │   ├── Chat.jsx
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── Profile.jsx
│       │   └── services/
│       │       └── api.js            # API service
│       ├── vercel.json               # Vercel deployment config
│       └── package.json
├── railway.toml                      # Railway config (alternative)
└── README.md
```

## 🔧 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Git

### Backend Setup

1. **Clone and navigate**:
   ```bash
   git clone https://github.com/your-username/mediCare.git
   cd mediCare/backend/server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment variables**:
   Create a `.env` file:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**:
   ```bash
   npm run dev  # Development with nodemon
   # or
   npm start    # Production
   ```

### Frontend Setup

1. **Navigate to frontend**:
   ```bash
   cd ../../frontend/mediCare-Client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment variables** (optional for local):
   Create a `.env.local` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` for the frontend and `http://localhost:5000` for the backend.

## 🚀 Deployment

### Backend (Render)

1. **Connect GitHub repo** to Render
2. **Create Web Service**:
   - Runtime: Node
   - Root Directory: `backend/server`
   - Build Command: `npm ci --omit=dev`
   - Start Command: `npm start`

3. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_atlas_string
   JWT_SECRET=your_secure_secret
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

### Frontend (Vercel)

1. **Import GitHub repo** to Vercel
2. **Configure project**:
   - Root Directory: `frontend/mediCare-Client`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com/api
   VITE_SOCKET_URL=https://your-render-backend.onrender.com
   ```

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Appointment Endpoints
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Chat Endpoints
- `GET /api/chat` - Get user chats
- `POST /api/chat` - Create new chat
- `GET /api/chat/:chatId/messages` - Get chat messages

### Doctor/Patient Endpoints
- `GET /api/doctors` - Get all doctors
- `GET /api/patients/profile` - Get patient profile
- `PUT /api/patients/profile` - Update patient profile

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secure_secret_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - Verify connection string is correct

2. **CORS Errors**
   - Check `FRONTEND_URL` in backend environment variables
   - Ensure it matches your deployed frontend URL

3. **Login Failed**
   - Verify JWT_SECRET is consistent between deployments
   - Check MongoDB connection

4. **Socket.IO Not Working**
   - Ensure `VITE_SOCKET_URL` points to backend
   - Check browser console for connection errors

### Logs
- **Render**: Dashboard → Logs tab
- **Vercel**: Dashboard → Functions/Logs
- **Local**: Check terminal output

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, email your-email@example.com or open an issue on GitHub.

---

Built with ❤️ for better healthcare management
