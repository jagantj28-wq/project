from app.services.ats_scorer import ATSScorer

def test_extract_skills():
    text = "Proficient in Python, React, PostgreSQL, Docker, AWS, and Agile methodologies."
    skills = ATSScorer.extract_skills_from_text(text)
    assert "python" in skills["hard_skills"]
    assert "react" in skills["hard_skills"]
    assert "postgresql" in skills["hard_skills"]
    assert "docker" in skills["hard_skills"]
    assert "aws" in skills["hard_skills"]

def test_evaluate_sections():
    resume = """
    Jane Smith | jane@example.com
    SUMMARY
    Senior Engineer with 5 years experience.
    EXPERIENCE
    Worked at TechCorp.
    EDUCATION
    BS in Computer Science.
    SKILLS
    Python, Go, Kubernetes.
    """
    res = ATSScorer.evaluate_sections(resume)
    assert res["sections"]["contact_info"] is True
    assert res["sections"]["summary"] is True
    assert res["sections"]["experience"] is True
    assert res["sections"]["education"] is True
    assert res["sections"]["skills"] is True
    assert res["completeness_score"] >= 80

def test_ats_match_calculation():
    resume = """
    Alex Rivera - alex@email.com
    SUMMARY
    Experienced Full-Stack Developer with Python, React, PostgreSQL, Docker, and AWS.
    EXPERIENCE
    Senior Engineer: Architected distributed microservices boosting throughput by 45% across 100k users.
    EDUCATION
    BS Computer Science
    SKILLS
    Python, React, TypeScript, PostgreSQL, Docker, AWS, Git
    """
    job_desc = """
    Looking for a Full-Stack Engineer with experience in Python, React, PostgreSQL, and AWS.
    Must have strong problem solving and teamwork skills.
    """
    match = ATSScorer.calculate_ats_match(resume, job_desc)
    assert match["ats_score"] >= 65
    assert "python" in match["skills"]["matched_hard_skills"]
    assert "react" in match["skills"]["matched_hard_skills"]
    assert match["breakdown"]["skills_match"] > 70
    assert len(match["suggestions"]) > 0
