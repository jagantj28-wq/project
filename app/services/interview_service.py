from typing import Dict, List, Any, Optional
import uuid
from app.services.ai_service import ai_service

# In-memory interview session registry
ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {}

class InterviewService:
    """Manages active mock interview sessions and aggregated candidate scorecards."""

    @classmethod
    async def create_session(cls, role: str, seniority: str, mode: str, resume_text: str = "") -> Dict[str, Any]:
        """Start a new interview session and generate questions."""
        session_id = str(uuid.uuid4())
        questions = await ai_service.generate_interview_questions(role, seniority, mode, resume_text)
        
        session = {
            "session_id": session_id,
            "role": role,
            "seniority": seniority,
            "mode": mode,
            "resume_text": resume_text,
            "questions": questions,
            "current_index": 0,
            "answers": [],
            "evaluations": [],
            "completed": False,
            "scorecard": None
        }
        ACTIVE_SESSIONS[session_id] = session
        
        return {
            "session_id": session_id,
            "role": role,
            "seniority": seniority,
            "mode": mode,
            "total_questions": len(questions),
            "first_question": questions[0] if questions else None
        }

    @classmethod
    def get_session(cls, session_id: str) -> Optional[Dict[str, Any]]:
        return ACTIVE_SESSIONS.get(session_id)

    @classmethod
    async def submit_answer(cls, session_id: str, question_id: int, answer_text: str) -> Dict[str, Any]:
        """Process candidate answer, evaluate via STAR, and determine next question or completion."""
        session = cls.get_session(session_id)
        if not session:
            raise ValueError("Interview session not found or expired.")

        # Find the question
        question_obj = next((q for q in session["questions"] if q["id"] == question_id), None)
        question_text = question_obj["question"] if question_obj else "Interview Question"

        # Evaluate answer
        eval_result = await ai_service.evaluate_candidate_answer(question_text, answer_text, session["role"])
        
        session["answers"].append({
            "question_id": question_id,
            "question": question_text,
            "answer": answer_text
        })
        session["evaluations"].append(eval_result)
        session["current_index"] += 1

        is_finished = session["current_index"] >= len(session["questions"])
        next_question = None
        scorecard = None

        if not is_finished:
            next_question = session["questions"][session["current_index"]]
        else:
            session["completed"] = True
            scorecard = cls.generate_final_scorecard(session)
            session["scorecard"] = scorecard

        return {
            "evaluation": eval_result,
            "is_finished": is_finished,
            "next_question": next_question,
            "scorecard": scorecard
        }

    @classmethod
    def generate_final_scorecard(cls, session: Dict[str, Any]) -> Dict[str, Any]:
        """Aggregate evaluations across all questions into a final scorecard."""
        evals = session["evaluations"]
        if not evals:
            return {"overall_readiness_score": 0, "readiness_level": "Needs Practice"}

        avg_star = int(sum(e.get("star_score", 0) for e in evals) / len(evals))
        avg_clarity = int(sum(e.get("clarity_score", 0) for e in evals) / len(evals))
        overall = int((avg_star * 0.65) + (avg_clarity * 0.35))

        if overall >= 85:
            level = "Strong Hire (Top 10%)"
        elif overall >= 75:
            level = "Interview Ready (Top 25%)"
        elif overall >= 60:
            level = "Competitive (Needs Minor Polish)"
        else:
            level = "Needs More Structured Practice"

        # Aggregate strengths & areas for growth
        all_strengths = []
        all_improvements = []
        for e in evals:
            all_strengths.extend(e.get("feedback", {}).get("strengths", []))
            all_improvements.extend(e.get("feedback", {}).get("areas_to_improve", []))

        # Unique top 3
        unique_strengths = list(dict.fromkeys(all_strengths))[:3]
        unique_improvements = list(dict.fromkeys(all_improvements))[:3]

        return {
            "overall_readiness_score": overall,
            "readiness_level": level,
            "metrics": {
                "star_structure_score": avg_star,
                "clarity_and_delivery": avg_clarity,
                "questions_completed": len(evals)
            },
            "key_strengths": unique_strengths or ["Consistent enthusiasm", "Clear personal ownership"],
            "growth_roadmap": unique_improvements or ["Focus on quantifying all metrics with concrete business value."],
            "role": session.get("role", "Candidate"),
            "seniority": session.get("seniority", "Mid")
        }

interview_service = InterviewService()
