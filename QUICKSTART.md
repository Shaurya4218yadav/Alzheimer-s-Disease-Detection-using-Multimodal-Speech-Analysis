# 🚀 Quick Start Guide

## Early Alzheimer Detection System

### ⚡ Fastest Way to Start

#### Windows Users:

1. **Start Backend** (Terminal 1):
   ```cmd
   start-backend.bat
   ```

2. **Start Frontend** (Terminal 2):
   ```cmd
   start-frontend.bat
   ```

3. **Open Browser**:
   ```
   http://localhost:3000
   ```

#### macOS/Linux Users:

1. **Start Backend** (Terminal 1):
   ```bash
   ./start-backend.sh
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   ./start-frontend.sh
   ```

3. **Open Browser**:
   ```
   http://localhost:3000
   ```

---

## 📋 System Requirements

- **Python 3.8+** installed
- **Node.js 16+** installed
- **npm** or **yarn**
- **4GB RAM** minimum (8GB recommended)
- **1GB free disk space**

---

## 🎯 Demo Workflow

Follow this flow for a complete demonstration:

### 1. Home Page
- View system overview
- Check statistics (if any previous predictions)
- Click "Start Analysis"

### 2. Upload Page
- Click "Choose Audio File"
- Select an audio file (WAV, MP3, OGG, FLAC)
- Recommended: 30-60 second speech sample
- Click "Upload & Analyze"

### 3. Processing Page
- Watch real-time processing:
  - ✓ Preprocessing (noise reduction, normalization)
  - ✓ Feature Extraction (acoustic features)
  - ✓ NLP Analysis (linguistic patterns)
  - ✓ Model Prediction (CNN-LSTM model)
- Automatically redirects to results

### 4. Result Page
View comprehensive analysis:
- **Risk Classification** (Normal / ECI / High Risk)
- **Confidence Score** with visual probability bars
- **Risk Factors Analysis** with severity levels
- **Recommendations** based on results
- **Acoustic Features** (MFCC, speech rate, pauses, etc.)
- **Linguistic Features** (vocabulary, repetition, complexity)
- **Speech Transcript**
- **Model Architecture** diagram

### 5. History Page
- View all past predictions
- Compare results over time
- Filter and sort predictions
- Click any prediction to view detailed results

### 6. Admin Panel
- View model metrics
- Adjust confidence threshold (slider: 0.0 - 1.0)
- Retrain model (simulated)
- Reset model to defaults
- View system statistics

---

## 📊 Test Data

For testing, you can:
1. Use any audio recording of speech (30-60 seconds)
2. Record yourself describing your day
3. Use any WAV/MP3 file with clear speech

**Good test scenarios:**
- Normal conversation
- Reading a passage
- Describing a memory or story
- Answering questions

---

## 🎨 UI Theme

The application follows a medical-grade design with:
- **Primary Color:** Light blue (#4da6ff)
- **Background:** Light blue tint (#f5f9ff)
- **Panels:** White (#ffffff)
- **Text:** Black (#000000)
- **Accents:** Blue gradients

---

## 🔧 Troubleshooting

### Backend won't start?
```bash
cd backend
python --version  # Check Python 3.8+
pip install -r requirements.txt
python app.py
```

### Frontend won't start?
```bash
cd frontend
node --version  # Check Node 16+
npm install
npm run dev
```

### Port already in use?
- Backend: Change port in `backend/app.py` (line: `app.run(port=5000)`)
- Frontend: Change port in `frontend/vite.config.js`

### Database errors?
```bash
cd backend
rm -rf database/*.db  # Delete old database
python app.py  # Recreates database automatically
```

---

## 📡 API Testing

Test the backend API independently:

```bash
# Health check
curl http://localhost:5000/api/health

# Get model info
curl http://localhost:5000/api/model/info

# Get statistics
curl http://localhost:5000/api/stats
```

---

## 🎓 Understanding Results

### Risk Levels:
- **Normal (Green)**: No concerning patterns detected
- **Early Cognitive Impairment (Yellow)**: Some indicators present
- **High Alzheimer Risk (Red)**: Multiple risk factors detected

### Confidence Score:
- **85-100%**: Very High confidence
- **70-84%**: High confidence
- **55-69%**: Moderate confidence
- **Below 55%**: Low confidence (additional testing recommended)

### Key Features to Watch:
- **Low Lexical Diversity**: Limited vocabulary usage
- **High Repetition Score**: Frequent word repetition
- **Slow Speech Rate**: Slower than normal speech
- **Long Pauses**: Extended silences during speech
- **Memory Phrases**: "I forgot", "can't remember", etc.

---

## ⚠️ Important Notes

1. **Demo System**: This is a prototype for demonstration purposes
2. **Not Medical**: NOT approved for clinical diagnosis
3. **Mock Components**: Some features use simulated data
4. **Consultation Required**: Always consult healthcare professionals
5. **Privacy**: Uploaded files are stored locally only

---

## 📞 Need Help?

- Check **SETUP.md** for detailed instructions
- Review **README.md** for architecture details
- Create an issue on GitHub
- Check API documentation in README

---

## 🎉 Enjoy Your Demo!

The system is designed to showcase:
- Modern web application architecture
- Real-time processing pipelines
- AI/ML integration in healthcare
- Professional medical UI/UX
- Full-stack development skills

**Remember:** This is an educational prototype demonstrating the potential of AI in early Alzheimer's detection. Real clinical applications require extensive validation, regulatory approval, and professional medical oversight.

---

**Built with care for advancing early detection research** 💙
