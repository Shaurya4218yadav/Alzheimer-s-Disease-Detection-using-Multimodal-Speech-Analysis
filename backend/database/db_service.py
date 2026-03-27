import sqlite3
import json
from datetime import datetime
import os

class DatabaseService:
    def __init__(self, db_path='database/alzheimer_detection.db'):
        self.db_path = db_path
        self.init_database()

    def get_connection(self):
        """Create database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_database(self):
        """Initialize database tables"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # User table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Audio record table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audio_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                filename TEXT NOT NULL,
                duration REAL,
                file_path TEXT,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')

        # Features table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS features (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                audio_id INTEGER,
                mfcc_mean TEXT,
                speech_rate REAL,
                pause_duration REAL,
                zcr REAL,
                chroma_mean TEXT,
                lexical_diversity REAL,
                repetition_score REAL,
                hesitation_count INTEGER,
                complexity_score REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (audio_id) REFERENCES audio_records(id)
            )
        ''')

        # Predictions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                audio_id INTEGER,
                feature_id INTEGER,
                risk_level TEXT NOT NULL,
                confidence REAL NOT NULL,
                probability_normal REAL,
                probability_eci REAL,
                probability_high_risk REAL,
                predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (audio_id) REFERENCES audio_records(id),
                FOREIGN KEY (feature_id) REFERENCES features(id)
            )
        ''')

        # Model metadata table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS model_metadata (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model_version TEXT,
                accuracy REAL,
                threshold REAL DEFAULT 0.7,
                last_trained TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.commit()
        conn.close()

        # Insert default model metadata if not exists
        self.init_model_metadata()

    def init_model_metadata(self):
        """Initialize default model metadata"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT COUNT(*) as count FROM model_metadata')
        count = cursor.fetchone()['count']

        if count == 0:
            cursor.execute('''
                INSERT INTO model_metadata (model_version, accuracy, threshold, last_trained)
                VALUES (?, ?, ?, ?)
            ''', ('v1.0.0', 0.87, 0.7, datetime.now()))
            conn.commit()

        conn.close()

    def create_user(self, name, age=None):
        """Create new user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (name, age) VALUES (?, ?)', (name, age))
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return user_id

    def create_audio_record(self, user_id, filename, duration, file_path):
        """Create audio record"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO audio_records (user_id, filename, duration, file_path)
            VALUES (?, ?, ?, ?)
        ''', (user_id, filename, duration, file_path))
        audio_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return audio_id

    def save_features(self, audio_id, features):
        """Save extracted features"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO features (
                audio_id, mfcc_mean, speech_rate, pause_duration,
                zcr, chroma_mean, lexical_diversity, repetition_score,
                hesitation_count, complexity_score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            audio_id,
            json.dumps(features.get('mfcc_mean', [])),
            features.get('speech_rate', 0),
            features.get('pause_duration', 0),
            features.get('zcr', 0),
            json.dumps(features.get('chroma_mean', [])),
            features.get('lexical_diversity', 0),
            features.get('repetition_score', 0),
            features.get('hesitation_count', 0),
            features.get('complexity_score', 0)
        ))
        feature_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return feature_id

    def save_prediction(self, audio_id, feature_id, prediction):
        """Save prediction results"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO predictions (
                audio_id, feature_id, risk_level, confidence,
                probability_normal, probability_eci, probability_high_risk
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            audio_id,
            feature_id,
            prediction['risk_level'],
            prediction['confidence'],
            prediction['probabilities']['Normal'],
            prediction['probabilities']['Early Cognitive Impairment'],
            prediction['probabilities']['High Alzheimer Risk']
        ))
        prediction_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return prediction_id

    def get_all_predictions(self, limit=50):
        """Get all predictions with details"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT
                p.id, p.risk_level, p.confidence, p.predicted_at,
                a.filename, a.duration,
                u.name as user_name
            FROM predictions p
            JOIN audio_records a ON p.audio_id = a.id
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY p.predicted_at DESC
            LIMIT ?
        ''', (limit,))
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

    def get_prediction_by_audio_id(self, audio_id):
        """Get prediction for specific audio"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM predictions
            WHERE audio_id = ?
            ORDER BY predicted_at DESC
            LIMIT 1
        ''', (audio_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    def get_model_metadata(self):
        """Get current model metadata"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM model_metadata ORDER BY id DESC LIMIT 1')
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    def update_model_metadata(self, accuracy=None, threshold=None):
        """Update model metadata"""
        conn = self.get_connection()
        cursor = conn.cursor()

        if accuracy is not None:
            cursor.execute('UPDATE model_metadata SET accuracy = ?, updated_at = ? WHERE id = 1',
                         (accuracy, datetime.now()))

        if threshold is not None:
            cursor.execute('UPDATE model_metadata SET threshold = ?, updated_at = ? WHERE id = 1',
                         (threshold, datetime.now()))

        conn.commit()
        conn.close()

    def reset_model(self):
        """Reset model to default state"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE model_metadata
            SET accuracy = 0.87, threshold = 0.7, last_trained = ?, updated_at = ?
            WHERE id = 1
        ''', (datetime.now(), datetime.now()))
        conn.commit()
        conn.close()
