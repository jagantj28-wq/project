import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file if present
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "PrepPulse AI"
    VERSION: str = "1.0.0"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    STATIC_DIR: Path = Path(__file__).resolve().parent / "static"
    TEMPLATES_DIR: Path = Path(__file__).resolve().parent / "templates"

settings = Settings()
