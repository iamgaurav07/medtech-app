# 🏥 MedTech Surgical Planning Web Application

A full-stack web application for simulating medical image processing for surgical planning. This project demonstrates a complete full-stack workflow with React frontend, Node.js backend, and Python image processing server.

## 🎯 Live Demo

**Frontend:** [https://iamgaurav07.github.io/medtech-app/](https://iamgaurav07.github.io/medtech-app/)

> **Note:** For full functionality, the backend and Python servers need to be running locally as described in the setup instructions below.

---

## 📋 Features

- ✅ **Upload CT Scan Images** - Support for JPG, PNG formats
- ✅ **Dual-Phase Processing** - Arterial (contrast enhancement) and Venous (smoothing) phases
- ✅ **Real-time Processing** - Backend image processing with Python OpenCV
- ✅ **Side-by-Side Comparison** - Professional image comparison interface
- ✅ **Medical-Grade Processing** - Subtle, professional image enhancements
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Type Safety** - Full TypeScript implementation

---

## 🏗️ System Architecture

```
Frontend (React + TypeScript)
        ↓
Backend API (Node.js + Express + TypeScript)
        ↓
Python Image Processing (Flask + OpenCV)
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework with hooks
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for Python server communication

### Image Processing
- **Python 3.9+** - Programming language
- **Flask** - Web framework
- **OpenCV** - Computer vision and image processing
- **Pillow** - Image manipulation
- **NumPy** - Numerical computing

---

## 📁 Project Structure

```
medtech-app/
├── 📁 frontend/                 # React TypeScript Application
│   ├── 📁 public/              # Static files
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   ├── 📁 services/        # API services
│   │   ├── 📁 types/           # TypeScript definitions
│   │   ├── 📁 styles/          # CSS styles
│   │   ├── App.tsx             # Main application component
│   │   └── main.tsx            # Application entry point
│   ├── package.json            # Dependencies and scripts
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── tailwind.config.cjs     # Tailwind CSS configuration
│
├── 📁 backend/                  # Node.js TypeScript Server
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Route controllers
│   │   ├── 📁 services/        # Business logic
│   │   ├── 📁 routes/          # API routes
│   │   ├── 📁 middleware/      # Express middleware
│   │   ├── 📁 types/           # TypeScript definitions
│   │   ├── 📁 utils/           # Utility functions
│   │   └── server.ts           # Server entry point
│   ├── 📁 uploads/             # File upload directory
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   └── .env                    # Environment variables
│
├── 📁 python-server/            # Python Image Processing Server
│   ├── app.py                  # Flask application
│   ├── requirements.txt        # Python dependencies
│   ├── 📁 uploads/             # Processed images storage
│   └── README.md               # Python server documentation
│
└── 📄 README.md                # This file
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js 18+](https://nodejs.org/)
- [Python 3.9+](https://www.python.org/)
- [Git](https://git-scm.com/)

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/iamgaurav07/medtech-app.git
cd medtech-app
```

### Step 2: Backend Setup (Node.js)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
echo "PORT=5000
NODE_ENV=development
PYTHON_SERVER_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760" > .env

# Start development server
npm run dev
```

**Backend will run on:** `http://localhost:5000`

### Step 3: Python Server Setup

```bash
# Navigate to python-server directory
cd python-server

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Python server
python app.py
```

**Python server will run on:** `http://localhost:8000`

### Step 4: Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on:** `http://localhost:3000`

---

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env` file:

```env
PORT=5000
NODE_ENV=development
PYTHON_SERVER_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### Frontend Environment Variables

Create `frontend/.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PYTHON_SERVER_URL=http://localhost:8000
VITE_UPLOAD_MAX_SIZE=10485760
VITE_APP_NAME=MedTech Surgical Planning
```

---

## 🎯 Image Processing Details

### Arterial Phase Processing
- **Contrast Enhancement** - Subtle contrast increase using CLAHE (Contrast Limited Adaptive Histogram Equalization)
- **Brightness Adjustment** - Mild brightness enhancement
- **Medical-Grade** - Professional, non-destructive adjustments suitable for medical imaging

### Venous Phase Processing
- **Gaussian Smoothing** - Subtle blurring effect with adaptive kernel size
- **Noise Reduction** - Bilateral filtering to preserve edges
- **Contrast Adjustment** - Mild contrast reduction for venous appearance

---

## 🔧 API Documentation

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/process-image` | Process uploaded image with selected phase |
| `GET` | `/api/health` | Backend server health check |
| `GET` | `/api/python-status` | Python server connection status |

### Python Server Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/process` | Process image (for Node.js backend) |
| `POST` | `/process-base64` | Process image with base64 response (direct frontend) |
| `GET` | `/health` | Python server health check |
| `GET` | `/uploads/<filename>` | Serve processed images |

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # or 5000, 8000

# Kill process
kill -9 <PID>
```

#### Python Dependencies Issues

```bash
# Clear cache and reinstall
pip cache purge
pip install -r requirements.txt --force-reinstall
```

#### Node.js Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### CORS Errors

- Ensure all servers are running
- Check environment variables for correct URLs
- Verify CORS configuration in backend

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

---

## 🎮 How to Use

1. **Start all three servers** (Frontend, Backend, Python)
2. **Open frontend** at `http://localhost:3000`
3. **Upload a medical image** (JPG/PNG format)
4. **Select processing phase:**
   - **Arterial:** Increased contrast simulation
   - **Venous:** Gaussian smoothing simulation
5. **Click "Process Image"** to see results
6. **Compare images** side-by-side in the results section

---

## 📝 Development Notes

### For Developers
- All servers support hot reloading during development
- TypeScript provides type safety across the entire stack
- Error handling is implemented at all levels
- Comprehensive logging for debugging

### Image Processing Notes
- All image processing algorithms are optimized for medical imaging
- Processing parameters are configurable for different imaging modalities
- Output images maintain original resolution and bit depth

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Gaurav**
- GitHub: [@iamgaurav07](https://github.com/iamgaurav07)