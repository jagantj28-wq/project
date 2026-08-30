import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_root_index_html():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        assert "PrepPulse AI" in response.text
        assert "AI Resume &amp; ATS Optimization Engine" in response.text or "AI Resume & ATS Optimization Engine" in response.text

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "PrepPulse AI" in data["app"]

@pytest.mark.asyncio
async def test_analyze_resume_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "resume_text": "Alex Rivera\nSkills: Python, React, PostgreSQL, Docker\nExperience: Built microservices for 50k users.",
            "job_description": "We need a Python and React developer with PostgreSQL knowledge."
        }
        response = await client.post("/api/resume/analyze", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "analysis" in data
        assert data["analysis"]["ats_score"] > 0

@pytest.mark.asyncio
async def test_career_tools_endpoints():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Bullet optimizer
        bullet_res = await client.post("/api/tools/optimize-bullet", json={
            "bullet": "Created database tables and fixed bugs.",
            "role": "Backend Engineer"
        })
        assert bullet_res.status_code == 200
        bullet_data = bullet_res.json()
        assert len(bullet_data["variations"]) == 3

        # Elevator pitch
        pitch_res = await client.post("/api/tools/elevator-pitch", json={
            "resume_summary": "Full stack engineer passionate about clean code.",
            "target_role": "Software Engineer",
            "years_exp": "4+"
        })
        assert pitch_res.status_code == 200
        pitch_data = pitch_res.json()
        assert "headline" in pitch_data["pitch"]
        assert "script_60s" in pitch_data["pitch"]

        # Question bank
        qb_res = await client.get("/api/tools/question-bank")
        assert qb_res.status_code == 200
        assert qb_res.json()["total"] > 0
