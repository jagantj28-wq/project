from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.ai_service import ai_service

router = APIRouter(prefix="/api/tools", tags=["Career Tools"])

class OptimizeBulletRequest(BaseModel):
    bullet: str
    role: Optional[str] = ""

class ElevatorPitchRequest(BaseModel):
    resume_summary: str
    target_role: str
    years_exp: Optional[str] = "3+"

CURATED_QUESTION_BANK = [
    {
        "category": "Behavioral (STAR)",
        "question": "Tell me about a time you faced an unexpected technical roadblock and how you resolved it.",
        "tip": "Use the STAR method. Emphasize analytical problem breakdown, stakeholder updates, and the permanent fix.",
        "difficulty": "Medium"
    },
    {
        "category": "Behavioral (STAR)",
        "question": "Describe a situation where you had to push back on a tight deadline or impossible product requirement.",
        "tip": "Show diplomacy, data-driven reasoning, and proposing pragmatic phase-1 tradeoffs without compromising quality.",
        "difficulty": "Hard"
    },
    {
        "category": "Technical & Architecture",
        "question": "How do you choose between SQL and NoSQL databases when designing a new high-throughput feature?",
        "tip": "Discuss schema flexibility, ACID compliance, read/write patterns, and horizontal vs vertical scaling limits.",
        "difficulty": "Medium"
    },
    {
        "category": "Technical & Architecture",
        "question": "Explain how you would prevent and troubleshoot a cascading failure in a distributed microservices environment.",
        "tip": "Mention circuit breakers, rate limiting, exponential backoff, health checks, and fallback degradation.",
        "difficulty": "Hard"
    },
    {
        "category": "Leadership & Ownership",
        "question": "How do you mentor junior engineers and foster a culture of high code quality and test coverage?",
        "tip": "Focus on constructive PR code reviews, pair programming, documentation, and establishing automated CI checks.",
        "difficulty": "Medium"
    },
    {
        "category": "Situational & Agile",
        "question": "If a critical production bug breaks checkout during a major marketing campaign, what are your first 3 steps?",
        "tip": "1) Triage & fast rollback/hotfix, 2) Clear communication channel, 3) Blameless post-mortem with automated prevention.",
        "difficulty": "Medium"
    }
]

@router.post("/optimize-bullet")
async def optimize_resume_bullet(payload: OptimizeBulletRequest):
    """Transform a weak bullet point into 3 STAR-quantified variations."""
    if not payload.bullet.strip():
        raise HTTPException(status_code=400, detail="Bullet point text cannot be empty.")
    
    try:
        variations = await ai_service.optimize_bullet_point(payload.bullet, payload.role or "")
        return {
            "status": "success",
            "original": payload.bullet,
            "variations": variations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to optimize bullet: {str(e)}")

@router.post("/elevator-pitch")
async def generate_pitch(payload: ElevatorPitchRequest):
    """Generate a structured 60-second elevator pitch."""
    if not payload.target_role.strip():
        raise HTTPException(status_code=400, detail="Target role is required.")
    
    try:
        pitch = await ai_service.generate_elevator_pitch(
            resume_summary=payload.resume_summary,
            target_role=payload.target_role,
            years_exp=payload.years_exp or "3+"
        )
        return {
            "status": "success",
            "pitch": pitch
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate pitch: {str(e)}")

@router.get("/question-bank")
async def get_question_bank():
    """Retrieve curated question bank and flashcards."""
    return {
        "status": "success",
        "total": len(CURATED_QUESTION_BANK),
        "questions": CURATED_QUESTION_BANK
    }
