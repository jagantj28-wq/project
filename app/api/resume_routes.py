from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.parser_service import DocumentParserService
from app.services.ats_scorer import ATSScorer

router = APIRouter(prefix="/api/resume", tags=["Resume & ATS"])

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str
    target_role: Optional[str] = ""

@router.post("/parse")
async def parse_resume_file(file: UploadFile = File(...)):
    """Upload and extract text from PDF, DOCX, or TXT resume files."""
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
        extracted_text = DocumentParserService.parse_file(file.filename or "resume.txt", content)
        if not extracted_text:
            raise HTTPException(status_code=400, detail="Could not extract any readable text from this file.")
            
        return {
            "filename": file.filename,
            "text": extracted_text,
            "char_count": len(extracted_text),
            "word_count": len(extracted_text.split())
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing file: {str(e)}")

@router.post("/analyze")
async def analyze_resume_match(payload: ResumeAnalyzeRequest):
    """Analyze resume against target job description and return comprehensive ATS audit."""
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    try:
        analysis = ATSScorer.calculate_ats_match(payload.resume_text, payload.job_description)
        return {
            "status": "success",
            "target_role": payload.target_role,
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(e)}")
