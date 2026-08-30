from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.interview_service import interview_service

router = APIRouter(prefix="/api/interview", tags=["Mock Interview"])

class StartInterviewRequest(BaseModel):
    role: str
    seniority: str
    mode: str
    resume_text: Optional[str] = ""

class SubmitAnswerRequest(BaseModel):
    session_id: str
    question_id: int
    answer: str

@router.post("/start")
async def start_mock_interview(payload: StartInterviewRequest):
    """Start an interactive mock interview session."""
    if not payload.role.strip():
        raise HTTPException(status_code=400, detail="Role must be specified.")
    
    try:
        session_data = await interview_service.create_session(
            role=payload.role.strip(),
            seniority=payload.seniority.strip(),
            mode=payload.mode.strip(),
            resume_text=payload.resume_text.strip()
        )
        return {
            "status": "success",
            "data": session_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initiate interview: {str(e)}")

@router.post("/answer")
async def submit_candidate_answer(payload: SubmitAnswerRequest):
    """Submit candidate's spoken or typed answer for STAR scoring and next question."""
    if not payload.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty.")
    
    try:
        result = await interview_service.submit_answer(
            session_id=payload.session_id,
            question_id=payload.question_id,
            answer_text=payload.answer.strip()
        )
        return {
            "status": "success",
            "data": result
        }
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate answer: {str(e)}")

@router.get("/session/{session_id}")
async def get_interview_session(session_id: str):
    """Get current interview session progress."""
    session = interview_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return {
        "status": "success",
        "data": session
    }
