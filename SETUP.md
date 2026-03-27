# Early Alzheimer Detection System using Multimodal Speech Analysis

🧠 **AI-Powered Early Detection System for Alzheimer's Disease**

A full-stack web application prototype that uses multimodal speech analysis (acoustic + linguistic features) with a hybrid CNN-LSTM deep learning model to detect early signs of Alzheimer's disease from speech patterns.

![System Status](https://img.shields.io/badge/Status-Demo%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Flask](https://img.shields.io/badge/Flask-3.0-000000)

---

## 📋 Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## ✨ Features

### Core Functionality
- ✅ **Audio Upload & Processing** - Upload WAV, MP3, OGG, FLAC files
- ✅ **Real-time Processing Pipeline** - Step-by-step visual feedback
- ✅ **Acoustic Feature Extraction** - MFCC, speech rate, pause duration, ZCR, chroma
- ✅ **Linguistic Analysis** - Vocabulary, repetition, hesitation, complexity
- ✅ **Hybrid CNN-LSTM Model** - Multimodal deep learning architecture
- ✅ **Risk Classification** - Normal, Early Cognitive Impairment, High Alzheimer Risk
- ✅ **Confidence Scoring** - Probability distribution for all classes
- ✅ **Prediction History** - Complete audit trail of all analyses
- ✅ **Admin Panel** - Model management and threshold configuration

### UI/UX Features
- 🎨 Professional medical-grade interface
- 🔵 Light blue and white theme
- 📊 Real-time processing status updates
- 📈 Visual probability charts
- 🔍 Detailed feature breakdown
- 📱 Responsive design
- ⚡ Fast, intuitive navigation

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  Home │ Upload │ Processing │ Result │ History │ Admin  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   API Layer (Flask)                      │
│  /upload │ /process │ /history │ /model/* │ /stats      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────┐ │
│  │ Preprocessing│  │   Feature   │  │      NLP       │ │
│  │   Service    │→ │ Extraction  │→ │    Service     │ │
│  └──────────────┘  └─────────────┘  └────────────────┘ │
│                            │                             │
│                            ▼                             │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────┐ │
│  │    Model     │  │ Prediction  │  │   Database     │ │
│  │   Service    │→ │  Service    │→ │    Service     │ │
│  └──────────────┘  └─────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  SQLite Database │
                   └─────────────────┘
```

### Hybrid CNN-LSTM Model Architecture

```
Acoustic Features              Linguistic Features
     (MFCC)                      (Word Embeddings)
        │                               │
        ▼                               ▼
┌──────────────┐              ┌──────────────┐
│   Conv1D(64) │              │ Embedding    │
│   + ReLU     │              │   (128)      │
└──────┬───────┘              └──────┬───────┘
       │                             │
       ▼                             ▼
┌──────────────┐              ┌──────────────┐
│ MaxPooling1D │              │  LSTM(128)   │
└──────┬───────┘              │  + Dropout   │
       │                      └──────┬───────┘
       ▼                             │
┌──────────────┐                     ▼
│ Conv1D(128)  │              ┌──────────────┐
└──────┬───────┘              │  LSTM(64)    │
       │                      └──────┬───────┘
       ▼                             │
┌──────────────┐                     │
│ Conv1D(256)  │                     │
└──────┬───────┘                     │
       │                             │
       └─────────┬───────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │   Concatenate   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │   Dense(128)    │
        │   + ReLU        │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  Dropout(0.5)   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │   Dense(3)      │
        │   + Softmax     │
        └────────┬────────┘
                 │
                 ▼
        3 Classes Output
```

---

## 🛠️ Tech Stack

### Backend
- **Python 3.8+**
- **Flask 3.0** - REST API
- **Librosa** - Audio processing
- **NumPy & SciPy** - Numerical computing
- **SQLite** - Database

### Frontend
- **React 18.2** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

---

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/Alzheimer-s-Disease-Detection-using-Multimodal-Speech-Analysis.git
cd Alzheimer-s-Disease-Detection-using-Multimodal-Speech-Analysis
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask API
python app.py
```

Backend will run on **http://localhost:5000**

### Step 3: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:3000**

---

## 💡 Usage

### 1. Open the Application
Navigate to **http://localhost:3000** in your browser

### 2. Upload Audio Sample
- Click "Upload Audio" from the sidebar
- Select an audio file (WAV, MP3, OGG, or FLAC)
- Click "Upload & Analyze"

### 3. View Processing
Watch the real-time processing pipeline:
- Preprocessing
- Feature Extraction
- NLP Analysis
- Model Prediction

### 4. Review Results
- Risk classification (Normal / ECI / High Risk)
- Confidence scores
- Acoustic and linguistic features
- Detailed recommendations

### 5. Access History
- View all past predictions
- Compare results over time
- Track confidence trends

### 6. Admin Panel
- View model metrics
- Adjust confidence threshold
- Retrain model (simulated)
- Reset to defaults

---

## 📁 Project Structure

```
.
├── backend/
│   ├── app.py                    # Flask API main file
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables
│   ├── database/
│   │   └── db_service.py         # Database service
│   ├── services/
│   │   ├── preprocessing_service.py
│   │   ├── feature_extraction_service.py
│   │   ├── nlp_service.py
│   │   ├── model_service.py
│   │   └── prediction_service.py
│   └── models/                   # Model files
│
├── frontend/
│   ├── package.json              # Node dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   └── Layout.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Upload.jsx
│       │   ├── Processing.jsx
│       │   ├── Result.jsx
│       │   ├── History.jsx
│       │   └── Admin.jsx
│       └── services/
│           └── api.js
│
├── data/
│   ├── audio/                    # Uploaded audio files
│   └── mock_data/                # Sample data
│
└── README.md
```

---

## 📡 API Documentation

### Endpoints

#### Health Check
```http
GET /api/health
```

#### Upload Audio
```http
POST /api/upload
Content-Type: multipart/form-data

Body: { audio: <file> }
```

#### Process Audio
```http
POST /api/process/:audioId
```

#### Get History
```http
GET /api/history?limit=50
```

#### Get Model Info
```http
GET /api/model/info
```

#### Retrain Model
```http
POST /api/model/retrain
```

#### Update Threshold
```http
POST /api/model/threshold
Body: { threshold: 0.7 }
```

---

## 🎯 Key Features Explained

### 1. Acoustic Feature Extraction
- **MFCC (40 coefficients)**: Captures spectral characteristics
- **Speech Rate**: Segments per second
- **Pause Duration**: Average silence length
- **Zero Crossing Rate**: Voice quality indicator
- **Spectral Features**: Centroid and rolloff

### 2. Linguistic Analysis
- **Lexical Diversity**: Unique words / Total words
- **Repetition Score**: Word reuse patterns
- **Hesitation Count**: Um, uh, you know, etc.
- **Complexity Score**: Average words per sentence
- **Memory Phrases**: Forget, can't remember, etc.

### 3. Risk Classification
- **Normal**: Low risk, healthy cognitive function
- **Early Cognitive Impairment (ECI)**: Mild concerns detected
- **High Alzheimer Risk**: Significant indicators present

---

## ⚠️ Limitations

1. **Prototype Status**: This is a demonstration system, not a medical device
2. **Audio Quality**: Depends on clear audio input
3. **Mock Components**: Some features use simulated data for demonstration
4. **Single Language**: English only
5. **Small Dataset**: Not trained on large-scale clinical data
6. **No Diagnosis**: Cannot replace clinical evaluation

**IMPORTANT**: This system is for research and educational purposes only. It should NOT be used for clinical diagnosis or medical decision-making.

---

## 🔮 Future Improvements

- [ ] Real speech-to-text integration (Whisper API, Google Speech)
- [ ] Actual CNN-LSTM model training with clinical data
- [ ] Multi-language support
- [ ] Real-time audio recording
- [ ] Mobile app (React Native)
- [ ] Integration with wearable devices
- [ ] Longitudinal tracking dashboard
- [ ] Explainable AI visualizations
- [ ] Clinical trial integration
- [ ] HIPAA compliance features

---

## 📊 Demo Flow

1. **Home** → Overview and statistics
2. **Upload** → Select audio file
3. **Processing** → Watch pipeline execution
4. **Result** → View comprehensive analysis
5. **History** → Track all predictions
6. **Admin** → Manage model settings

---

## 🤝 Contributing

This is an academic/research project. Contributions are welcome for:
- Bug fixes
- Documentation improvements
- Feature enhancements
- Testing

---

## 📄 License

This project is created for educational and research purposes.

---

## 👥 Authors

Created as a demonstration of multimodal AI for healthcare applications.

---

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Check documentation
- Review API endpoints

---

## 🙏 Acknowledgments

- Based on research in speech analysis for Alzheimer's detection
- Inspired by clinical studies on cognitive decline markers
- Built with modern web technologies

---

## ⚡ Quick Start Commands

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# Open browser
http://localhost:3000
```

---

## 📈 System Requirements

### Minimum
- Python 3.8+
- Node.js 16+
- 4GB RAM
- 1GB free disk space

### Recommended
- Python 3.10+
- Node.js 18+
- 8GB RAM
- 2GB free disk space

---

**Built with ❤️ for advancing early detection of Alzheimer's disease**
