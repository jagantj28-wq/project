import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from app.config import settings
from app.api.resume_routes import router as resume_router
from app.api.interview_routes import router as interview_router
from app.api.tools_routes import router as tools_router

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent AI Resume Analyzer & Voice/Text Mock Interview Prep Coach"
)

# CORS middleware for development flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup directories
STATIC_DIR = settings.STATIC_DIR
TEMPLATES_DIR = settings.TEMPLATES_DIR
STATIC_DIR.mkdir(parents=True, exist_ok=True)
TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)

# Mount Static Files & Templates
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# Include API Routers
app.include_router(resume_router)
app.include_router(interview_router)
app.include_router(tools_router)

@app.get("/", response_class=HTMLResponse)
async def serve_index(request: Request):
    """Serve the main application interface."""
    return templates.TemplateResponse("index.html", {"request": request, "app_name": settings.PROJECT_NAME})

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "gemini_active": bool(settings.GEMINI_API_KEY)
    }
