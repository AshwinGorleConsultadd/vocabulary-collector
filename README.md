# Vocabulary Collector Backend

A robust Node.js backend and React frontend to collect, translate, and generate sentences for vocabulary words.

## Project Structure

- `backend`: Express server with MongoDB and Gemini AI integration.
- `frontend`: React app (Vite) for a clean and modern display.

## Features

- **Modern Dashboard**: View all your stored vocabulary in a beautiful, responsive table.
- **Hindi Translation**: Automatically gets the Hindi meaning using the MyMemory API.
- **Audio Pronunciation**: Click to hear the word pronunciation (Google TTS).
- **Sentence Generation**: Uses Gemini 3 Flash to generate beginner-friendly sentences.
- **MongoDB Storage**: Stores word, meaning, audio, sentences, and timestamps.


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) (Atlas or local instance)
- [Google Gemini API Key](https://aistudio.google.com/)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the App

- For development (with nodemon):
  ```bash
  npm run dev
  ```
- For production:
  ```bash
  npm start
  ```

## API Usage

### Store Vocabulary

**Endpoint**: `/api/store-vocabulary`
**Method**: `GET`
**Query Parameters**:
- `word`: The word to process (required).
- `sentence`: A reference sentence for the word (optional, used as fallback).

**Example Request**:
```
http://localhost:3000/api/store-vocabulary?word=endurance&sentence=He%20showed%20great%20endurance.
```

**Response**:
```json
{
  "message": "Vocabulary stored successfully!",
  "data": {
    "word": "endurance",
    "meaning": "धैर्य",
    "pronunciationAudio": "https://translate.google.com/translate_tts?ie=UTF-8&q=endurance&tl=en&client=tw-ob",
    "sentences": [
      "Running a marathon requires a lot of endurance.",
      "The soldiers showed great endurance during the march.",
      "Swimming across the lake is a true test of endurance."
    ],
    "createdAt": "2026-04-05T20:15:00.000Z"
  }
}
```

### Get All Vocabulary

**Endpoint**: `/api/get-all-vocabulary`
**Method**: `GET`

**Example Request**:
```
http://localhost:3000/api/get-all-vocabulary
```

**Response**:
A JSON array of all vocabulary objects stored in the database, sorted from newest to oldest.

