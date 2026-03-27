# 🧠 Early Alzheimer Detection System

**AI-Powered Multimodal Speech Analysis for Early Detection of Alzheimer’s Disease**

![Status](https://img.shields.io/badge/Status-Demo%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Flask](https://img.shields.io/badge/Flask-3.0-black)

---

## 📖 Problem Statement

Alzheimer’s disease is often diagnosed late, when cognitive decline is already significant. Early detection is difficult because traditional methods are expensive, time-consuming, and not easily accessible.

This project aims to detect early signs of Alzheimer’s using speech patterns, which are **non-invasive and scalable**.

---

## 💡 Solution Overview

This full-stack web application analyzes **multimodal speech data**:

### 🎵 How you speak (Acoustic Features)
- MFCC (40 coefficients)
- Speech rate
- Pause duration
- Zero-crossing rate
- Spectral features

### 💬 What you say (Linguistic Features)
- Vocabulary diversity
- Word repetition patterns
- Hesitation markers
- Sentence complexity
- Memory-related phrases

These features are processed using a **Hybrid CNN-LSTM deep learning model** to classify users into:

1. ✅ **Normal** - Healthy cognitive function
2. ⚠️ **Early Cognitive Impairment (ECI)** - Mild concerns detected
3. 🚨 **High Alzheimer Risk** - Significant indicators present

---

## 🏗️ System Architecture

```
Frontend (React + Tailwind CSS)
           ↓
   API Layer (Flask REST API)
           ↓
   ┌─────────────────────────────────┐
   │     Processing Pipeline         │
   │                                 │
   │  1. Preprocessing Service       │
   │  2. Feature Extraction Service  │
   │  3. NLP Service                 │
   │  4. Model Service (CNN-LSTM)    │
   │  5. Prediction Service          │
   └─────────────────────────────────┘
           ↓
   Database Service (SQLite)
```

### Model Architecture

```
Acoustic Features (MFCC)    Linguistic Features (Text)
         ↓                            ↓
    Conv1D Layers              LSTM Layers
         ↓                            ↓
    Max Pooling                 Dropout
         ↓                            ↓
    Global Avg Pool             Dense Layer
         ↓                            ↓
         └────────→ Concatenate ←─────┘
                        ↓
                   Dense(128)
                        ↓
                   Dropout(0.5)
                        ↓
                   Dense(3) + Softmax
                        ↓
           [Normal, ECI, High Risk]
```

---

## 🛠️ Tech Stack

### Backend
- **Python 3.8+** - Core language
- **Flask 3.0** - REST API framework
- **Librosa** - Audio signal processing
- **NumPy & SciPy** - Numerical computing
- **SQLite** - Database

### Frontend
- **React 18.2** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Axios** - API client
- **React Router** - Navigation

---

## 📁 Project Structure

```
.
├── backend/
│   ├── app.py                          # Flask API server
│   ├── requirements.txt                # Python dependencies
│   ├── database/
│   │   └── db_service.py               # SQLite database service
│   └── services/
│       ├── preprocessing_service.py    # Audio preprocessing
│       ├── feature_extraction_service.py # Acoustic features
│       ├── nlp_service.py              # Linguistic analysis
│       ├── model_service.py            # Hybrid CNN-LSTM model
│       └── prediction_service.py       # Risk prediction
│
├── frontend/
│   ├── package.json                    # Node dependencies
│   ├── vite.config.js                  # Vite configuration
│   ├── tailwind.config.js              # Tailwind CSS config
│   └── src/
│       ├── App.jsx                     # Main app component
│       ├── components/
│       │   └── Layout.jsx              # App layout
│       ├── pages/
│       │   ├── Home.jsx                # Home page
│       │   ├── Upload.jsx              # Audio upload
│       │   ├── Processing.jsx          # Real-time processing
│       │   ├── Result.jsx              # Analysis results
│       │   ├── History.jsx             # Prediction history
│       │   └── Admin.jsx               # Model management
│       └── services/
│           └── api.js                  # API service
│
├── data/
│   └── audio/                          # Uploaded audio files
│
├── start-backend.bat                   # Windows backend launcher
├── start-backend.sh                    # Unix backend launcher
├── start-frontend.bat                  # Windows frontend launcher
├── start-frontend.sh                   # Unix frontend launcher
├── SETUP.md                            # Detailed setup guide
└── README.md                           # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

#### Option 1: Using Scripts (Recommended)

**Windows:**
```bash
# Terminal 1 - Backend
start-backend.bat

# Terminal 2 - Frontend
start-frontend.bat
```

**macOS/Linux:**
```bash
# Terminal 1 - Backend
chmod +x start-backend.sh
./start-backend.sh

# Terminal 2 - Frontend
chmod +x start-frontend.sh
./start-frontend.sh
```

#### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 📊 Features

### User Features
- ✅ Upload audio files (WAV, MP3, OGG, FLAC)
- ✅ Real-time processing visualization
- ✅ Comprehensive analysis results
- ✅ Risk classification with confidence scores
- ✅ Detailed acoustic & linguistic features
- ✅ Personalized recommendations
- ✅ Prediction history tracking

### Admin Features
- ✅ Model performance metrics
- ✅ Adjustable confidence threshold
- ✅ Model retraining (simulated)
- ✅ System statistics dashboard

### UI/UX
- 🎨 Professional medical-grade interface
- 🔵 Clean light blue & white theme
- 📱 Responsive design
- ⚡ Fast and intuitive

---

## 🎯 How It Works

1. **Upload Audio** - User uploads or records a speech sample (30-60s recommended)
2. **Preprocessing** - System removes noise, trims silence, normalizes audio
3. **Feature Extraction** - Extracts acoustic (MFCC, speech rate, pauses) and linguistic features
4. **NLP Analysis** - Analyzes vocabulary, repetition, hesitation, complexity
5. **Model Prediction** - Hybrid CNN-LSTM model processes features
6. **Results** - Display risk level, confidence, probabilities, and recommendations

---

## 📈 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/upload` | Upload audio file |
| POST | `/api/process/:audioId` | Process audio |
| GET | `/api/history` | Get prediction history |
| GET | `/api/model/info` | Get model information |
| POST | `/api/model/retrain` | Retrain model |
| POST | `/api/model/threshold` | Update threshold |
| GET | `/api/stats` | Get system statistics |

---

## ⚠️ Limitations

- **Prototype Status**: Demonstration system, not a medical device
- **Audio Quality**: Performance depends on clear audio input
- **Mock Components**: Uses simulated speech-to-text for demonstration
- **Single Language**: English only
- **Not Clinical**: Cannot replace professional medical evaluation

**⚠️ IMPORTANT DISCLAIMER:** This system is for research and educational purposes only. It is NOT a medical diagnostic tool and should not be used for clinical decision-making. Always consult qualified healthcare professionals for proper medical evaluation.

---

## 🔮 Future Improvements

- [ ] Real speech-to-text API integration (Whisper, Google Speech)
- [ ] Train actual CNN-LSTM model on clinical dataset
- [ ] Multi-language support
- [ ] Real-time audio recording in browser
- [ ] Mobile app (React Native)
- [ ] Integration with wearable devices
- [ ] Longitudinal tracking and trend analysis
- [ ] Explainable AI visualizations
- [ ] HIPAA compliance features
- [ ] Clinical trial integration

---

## 📚 Documentation

For detailed setup instructions, see **[SETUP.md](SETUP.md)**

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests for:
- Bug fixes
- Documentation improvements
- Feature enhancements
- Testing

---

## 📄 License

This project is created for educational and research purposes.

---

## 🙏 Acknowledgments

This project is inspired by research in:
- Speech analysis for cognitive decline detection
- Multimodal deep learning for healthcare
- Early Alzheimer’s disease biomarkers

---

## 📞 Contact & Support

For questions, issues, or suggestions:
- Create an issue on GitHub
- Check the [SETUP.md](SETUP.md) documentation
- Review the API documentation above

---

**Built with ❤️ for advancing early detection of Alzheimer’s disease**

*Empowering healthcare through AI and multimodal speech analysis*
