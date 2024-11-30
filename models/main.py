from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import json
from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import Dict, List
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Audio Processing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:3000","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client using environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

prompt = """Please analyze the provided text and generate a comprehensive todo list following these requirements:

Extract all tasks mentioned in the text and provide them in both English and Nepali

Format the output as a JSON object with the following structure:

{
  "transcriptEnglish": "Original text in English",
  "transcriptNepali": "Original text in Nepali",
  "todosEnglish": [
    {
      "task": "Task description",
      "time": "Time in 12-hour format (e.g., 8:00 AM)",
      "category": "One of: Work, Personal, Health, Shopping, Daily Routine, Education, Social, Household",
      "priority": "One of: High, Medium, Low",
      "completed": false
    }
  ],
  "todosNepali": [
    {
      "task": "कार्य विवरण",
      "time": "समय नेपाली फर्म्याटमा (जस्तै: बिहान ८ बजे)",
      "category": "एक: काम, व्यक्तिगत, स्वास्थ्य, किनमेल, दैनिकी, शिक्षा, सामाजिक, घरायसी",
      "priority": "एक: उच्च, मध्यम, न्यून",
      "completed": "false"
    }
  ]
}"""

def generate_todo_list(text: str) -> Dict:
    """
    Generate a bilingual todo list with detailed task information.
    
    Args:
        text (str): Input text to process
        
    Returns:
        Dict: Structured todo list in both English and Nepali
    """
    gpt_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system", 
                "content": "You are a bilingual assistant that creates structured todo lists in both English and Nepali. " + prompt
            },
            {
                "role": "user", 
                "content": f"Please analyze this text and create a todo list:\n\n{text}"
            }
        ]
    )
    
    try:
        return json.loads(gpt_response.choices[0].message.content.strip())
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse GPT response: {str(e)}")

def perform_sentiment_analysis(text: str) -> Dict[str, str]:
    """
    Perform sentiment analysis on the given text.
    
    Args:
        text (str): Input text
    
    Returns:
        Dict with sentiment analysis results
    """
    sentiment_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system", 
                "content": "You are a sentiment analysis expert. Analyze the sentiment of the given text and provide a detailed breakdown in numbers and mood and provide that in json format."
            },
            {
                "role": "user", 
                "content": f"Perform a comprehensive sentiment analysis on the following text:\n\n{text}"
            }
        ]
    )
    
    return {
        "sentiment": sentiment_response.choices[0].message.content.strip(),
        "overall_tone": "positive" if "positive" in sentiment_response.choices[0].message.content.lower() else 
                       "negative" if "negative" in sentiment_response.choices[0].message.content.lower() else 
                       "neutral"
    }

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: str = "ne"):
    """
    Transcribe audio file.
    
    Args:
        file (UploadFile): Audio file to transcribe
        language (str): Language code for transcription
    
    Returns:
        JSONResponse with transcription
    """
    try:
        # Save uploaded file temporarily
        with open(file.filename, "wb") as buffer:
            buffer.write(await file.read())
        
        # Transcribe audio
        with open(file.filename, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file,
                language=language
            )
        
        # Clean up temporary file
        os.remove(file.filename)
        
        return JSONResponse(content={
            "transcript": transcription.text
        })
    
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"error": str(e)}
        )

@app.post("/generate-todos")
async def generate_todos(text: str):
    """
    Generate bilingual todo list from text.
    
    Args:
        text (str): Input text
    
    Returns:
        JSONResponse with structured todo list in English and Nepali
    """
    try:
        todo_list = generate_todo_list(text)
        return JSONResponse(content=todo_list)
    
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"error": str(e)}
        )

@app.post("/sentiment-analysis")
async def analyze_sentiment(text: str):
    """
    Perform sentiment analysis on text.
    
    Args:
        text (str): Input text to analyze
    
    Returns:
        JSONResponse with sentiment analysis results
    """
    try:
        sentiment_result = perform_sentiment_analysis(text)
        return JSONResponse(content=sentiment_result)
    
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"error": str(e)}
        )

# Optional: Health check endpoint
@app.get("/")
async def health_check():
    """Basic health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)