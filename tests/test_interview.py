import pytest
from app.services.interview_service import interview_service

@pytest.mark.asyncio
async def test_interview_lifecycle():
    # 1. Create Session
    session_data = await interview_service.create_session(
        role="Full-Stack Engineer",
        seniority="Mid-Level",
        mode="Behavioral (STAR Method)"
    )
    assert "session_id" in session_data
    assert session_data["total_questions"] >= 3
    assert session_data["first_question"] is not None

    session_id = session_data["session_id"]
    first_q_id = session_data["first_question"]["id"]

    # 2. Submit Answer
    answer_text = "In my previous project, we had a critical latency bottleneck in our database queries. I took the lead on profiling the slow queries, added indexes, and implemented a Redis caching layer. As a result, our API response time dropped by 50% and throughput doubled."
    
    result = await interview_service.submit_answer(
        session_id=session_id,
        question_id=first_q_id,
        answer_text=answer_text
    )

    assert "evaluation" in result
    assert result["evaluation"]["star_score"] >= 60
    assert result["evaluation"]["clarity_score"] >= 70
    assert "model_answer" in result["evaluation"]
    assert len(result["evaluation"]["feedback"]["strengths"]) > 0
