import os
import json
import re
from typing import Dict, List, Any, Optional
from app.config import settings

class AIService:
    """Intelligent AI generation service using Gemini API with standalone heuristic fallbacks."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[AIService] Note: Gemini client init notice: {e}. Standalone engine active.")

    def is_gemini_active(self) -> bool:
        return self.client is not None and bool(self.api_key)

    async def optimize_bullet_point(self, bullet: str, role: str = "") -> List[Dict[str, str]]:
        """Transform a weak bullet point into 3 STAR-quantified bullet options."""
        if self.is_gemini_active():
            prompt = f"""
            You are an elite Tech Career Coach and Resume Strategist.
            Rewrite the following resume bullet point using the STAR (Situation, Task, Action, Result) methodology.
            Role context: {role or 'Professional'}
            Original bullet: "{bullet}"

            Generate exactly 3 distinct, high-impact versions:
            1. Metric-Driven (focuses on measurable business & performance metrics, e.g. % increase, latency decrease, cost savings)
            2. Leadership & Architecture (focuses on technical design, ownership, team mentorship, and scale)
            3. Efficiency & Streamlining (focuses on automation, speed, eliminating bottlenecks, and workflow optimization)

            Return strictly a JSON array with objects containing 'type' and 'text'.
            Example format:
            [
              {{"type": "Metric-Driven", "text": "Spearheaded..."}},
              {{"type": "Leadership & Architecture", "text": "Architected..."}},
              {{"type": "Efficiency & Streamlining", "text": "Automated..."}}
            ]
            """
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config={'response_mime_type': 'application/json'}
                )
                if response.text:
                    parsed = json.loads(response.text)
                    if isinstance(parsed, list) and len(parsed) > 0:
                        return parsed
            except Exception as e:
                print(f"[AIService] Gemini fallback triggered: {e}")

        # High quality heuristic generator
        clean = bullet.strip().rstrip('.')
        action_verb = "Architected and delivered" if "lead" in clean.lower() or "design" in clean.lower() else "Spearheaded development of"
        
        return [
            {
                "type": "Metric-Driven (High Impact)",
                "text": f"{action_verb} {clean.lower()}, boosting team delivery throughput by 35% and cutting processing latency across 150K+ daily transactions."
            },
            {
                "type": "Leadership & Architecture",
                "text": f"Orchestrated end-to-end architecture and implementation for {clean.lower()}, enforcing robust CI/CD standards and mentoring 4 junior engineers."
            },
            {
                "type": "Efficiency & Optimization",
                "text": f"Automated and streamlined {clean.lower()}, eliminating 12 hours of weekly manual bottlenecks and improving system reliability to 99.9% uptime."
            }
        ]

    async def generate_elevator_pitch(self, resume_summary: str, target_role: str, years_exp: str = "3+") -> Dict[str, str]:
        """Generate a 60-second elevator pitch script for interviews."""
        if self.is_gemini_active():
            prompt = f"""
            Create a powerful, 60-second 'Tell me about yourself' elevator pitch for a candidate applying for '{target_role}'.
            Candidate Background Summary: {resume_summary[:500]}
            Years of Experience: {years_exp}

            Structure:
            1. Present: Who they are and their core technical specialty.
            2. Past: High-impact accomplishment or milestone.
            3. Future: Why they are excited for this exact role and what unique value they bring.

            Return JSON:
            {{
               "headline": "Short 1-line power intro",
               "script_60s": "Complete spoken paragraph (around 120-140 words)",
               "bullet_points": ["Key talking point 1", "Key talking point 2", "Key talking point 3"]
            }}
            """
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config={'response_mime_type': 'application/json'}
                )
                if response.text:
                    return json.loads(response.text)
            except Exception as e:
                print(f"[AIService] Gemini pitch fallback triggered: {e}")

        # Standalone pitch generator
        role_title = target_role or "Full-Stack Software Engineer"
        return {
            "headline": f"Dynamic {role_title} passionate about scalable architecture and high-performance solutions.",
            "script_60s": (
                f"I'm a {role_title} with over {years_exp} years of experience engineering resilient, user-focused applications. "
                "In my recent work, I focused on designing modular systems, optimizing critical workflows, and shipping high-impact features that directly elevated user engagement and team delivery speed. "
                "I thrive in collaborative, fast-paced environments where I can leverage modern engineering practices and clean architecture. "
                f"What really excites me about this {role_title} opportunity is the chance to solve challenging technical problems at scale and deliver real business impact with your team."
            ),
            "bullet_points": [
                f"Proven track record in building and scaling solutions for {role_title} domains.",
                "Deep focus on performance optimization, clean code, and reliable system design.",
                "Collaborative communicator with strong problem-solving agility."
            ]
        }

    async def generate_interview_questions(self, role: str, seniority: str, mode: str, resume_text: str = "") -> List[Dict[str, Any]]:
        """Generate role-tailored interview questions."""
        if self.is_gemini_active():
            prompt = f"""
            You are a Principal Hiring Manager conducting a top-tier interview for a {seniority} {role} position.
            Interview Mode: {mode} (Behavioral, Technical, or Resume-Based)
            Candidate Resume Context: {resume_text[:1200]}

            Generate 5 structured interview questions.
            For each question provide:
            - "id": number 1 to 5
            - "question": The exact interview question spoken by the interviewer
            - "category": "Behavioral", "Technical", "System Design", or "Project Deep Dive"
            - "context_or_tip": What the interviewer is evaluating in the response (e.g. STAR methodology, trade-off analysis)
            - "sample_star_points": Key elements a great answer must cover

            Return strictly a JSON array of 5 question objects.
            """
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config={'response_mime_type': 'application/json'}
                )
                if response.text:
                    parsed = json.loads(response.text)
                    if isinstance(parsed, list) and len(parsed) >= 3:
                        return parsed
            except Exception as e:
                print(f"[AIService] Gemini question gen fallback: {e}")

        # Standalone question banks
        questions_pool = {
            "behavioral": [
                {
                    "id": 1,
                    "question": f"Tell me about a challenging situation you encountered as a {role} and how you navigated through it using the STAR method.",
                    "category": "Behavioral (STAR)",
                    "context_or_tip": "Focus on personal ownership, conflict or technical hurdle resolution, and the measurable outcome.",
                    "sample_star_points": ["Specific situation context", "Your distinct role/task", "Concrete action taken", "Quantified resolution"]
                },
                {
                    "id": 2,
                    "question": "Describe a time when you disagreed with a teammate or stakeholder on a technical or product decision. How did you handle it?",
                    "category": "Collaboration & Conflict",
                    "context_or_tip": "Demonstrates emotional intelligence, active listening, and finding data-driven win-win solutions.",
                    "sample_star_points": ["Root cause of disagreement", "Objective data used", "Respectful communication", "Final consensus"]
                },
                {
                    "id": 3,
                    "question": "Can you give an example of a project where requirements changed abruptly mid-sprint or right before launch?",
                    "category": "Adaptability",
                    "context_or_tip": "Assesses agility, prioritization under pressure, and clear stakeholder updates.",
                    "sample_star_points": ["Scope shift impact", "Re-prioritization plan", "Execution pivots", "Successful on-time delivery"]
                }
            ],
            "technical": [
                {
                    "id": 1,
                    "question": f"How do you approach designing a scalable, highly-available architecture for a core service in a {role} project?",
                    "category": "System Design",
                    "context_or_tip": "Evaluates understanding of caching, database indexing, horizontal scaling, and failure isolation.",
                    "sample_star_points": ["Bottleneck identification", "State management & caching", "Resilience & load balancing", "Monitoring"]
                },
                {
                    "id": 2,
                    "question": "Walk me through how you identify and resolve a critical performance bottleneck or memory leak in production.",
                    "category": "Debugging & Performance",
                    "context_or_tip": "Highlights root-cause analysis, profiling tools, and regression testing prevention.",
                    "sample_star_points": ["Observation & telemetry", "Profiling steps", "Root fix applied", "Preventative automated tests"]
                },
                {
                    "id": 3,
                    "question": "What principles do you apply to ensure code maintainability, test coverage, and smooth CI/CD deployments?",
                    "category": "Engineering Excellence",
                    "context_or_tip": "Tests automated testing philosophy, modular design patterns, and deployment safety.",
                    "sample_star_points": ["Clean architecture & SOLID", "Unit/integration testing strategy", "Automated deployment checks"]
                }
            ]
        }

        mode_key = "technical" if "tech" in mode.lower() else "behavioral"
        return questions_pool.get(mode_key, questions_pool["behavioral"])

    async def evaluate_candidate_answer(self, question: str, answer: str, role: str = "") -> Dict[str, Any]:
        """Evaluate candidate's answer using STAR methodology & communication scoring."""
        if self.is_gemini_active():
            prompt = f"""
            You are an expert interviewer evaluating a candidate's answer for a {role or 'Professional'} position.
            Interview Question: "{question}"
            Candidate Answer: "{answer}"

            Evaluate thoroughly and provide:
            1. star_score: integer 0-100 based on STAR structure (Situation, Task, Action, Result).
            2. clarity_score: integer 0-100 on communication clarity, conciseness, and confidence.
            3. breakdown: object with "situation", "task", "action", "result" ratings (each 0-25).
            4. feedback:
               - strengths: List of 2 positive things in the response
               - areas_to_improve: List of 2 constructive suggestions
            5. model_answer: A polished, ideal 3-sentence STAR model answer for this question.

            Return strictly JSON format:
            {{
               "star_score": 85,
               "clarity_score": 90,
               "overall_score": 88,
               "breakdown": {{
                  "situation": 20,
                  "task": 22,
                  "action": 24,
                  "result": 22
               }},
               "feedback": {{
                  "strengths": ["Clear explanation of technical action taken", "Good positive tone"],
                  "areas_to_improve": ["Quantify the final result with concrete metrics", "Shorten the setup"]
               }},
               "model_answer": "In my previous project, we faced... I led the effort to... By doing this, we achieved..."
            }}
            """
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config={'response_mime_type': 'application/json'}
                )
                if response.text:
                    return json.loads(response.text)
            except Exception as e:
                print(f"[AIService] Gemini answer eval fallback: {e}")

        # Standalone STAR evaluation heuristics
        words = answer.strip().split()
        word_count = len(words)
        ans_lower = answer.lower()

        has_situation = any(k in ans_lower for k in ["when", "project", "client", "company", "team", "working on", "time when", "situation"])
        has_task = any(k in ans_lower for k in ["task", "needed to", "goal", "responsible for", "objective", "problem was", "challenge"])
        has_action = any(k in ans_lower for k in ["i decided", "i implemented", "i built", "i led", "i analyzed", "i designed", "i created", "i took", "i resolved"])
        has_result = any(k in ans_lower for k in ["result", "outcome", "increased", "reduced", "improved", "delivered", "successfully", "impact", "%", "achieved"])

        s_score = 22 if has_situation else 14
        t_score = 22 if has_task else 13
        a_score = 25 if has_action else 16
        r_score = 24 if has_result else 12

        # Length penalty or bonus
        if word_count < 25:
            s_score = max(s_score - 8, 8)
            t_score = max(t_score - 8, 8)
            a_score = max(a_score - 8, 8)
            r_score = max(r_score - 8, 8)

        star_total = s_score + t_score + a_score + r_score
        clarity = 85 if 40 <= word_count <= 250 else (65 if word_count < 40 else 75)
        overall = int((star_total * 0.7) + (clarity * 0.3))

        strengths = []
        improvements = []

        if has_action:
            strengths.append("Clearly highlighted your specific individual contributions and technical steps.")
        else:
            improvements.append("Use first-person action verbs ('I built', 'I coordinated') rather than passive team references ('we did').")

        if has_result:
            strengths.append("Articulated the final resolution and impact.")
        else:
            improvements.append("Conclude your answer with measurable business or technical outcomes (e.g. % improvement or delivery timeline).")

        if word_count < 40:
            improvements.append("Elaborate with more concrete context using the STAR framework to showcase technical depth.")
        elif word_count > 300:
            improvements.append("Keep the response concise and focused under 2 minutes (approx. 150-200 words).")
        else:
            strengths.append("Well-paced response length suitable for live interview timing.")

        return {
            "star_score": star_total,
            "clarity_score": clarity,
            "overall_score": overall,
            "breakdown": {
                "situation": s_score,
                "task": t_score,
                "action": a_score,
                "result": r_score
            },
            "feedback": {
                "strengths": strengths or ["Good direct communication style."],
                "areas_to_improve": improvements or ["Include additional quantified metrics to solidify impact."]
            },
            "model_answer": f"In a recent key initiative, our team needed to resolve a critical scalability challenge. I took charge of profiling the system architecture, refactored the underlying data pipeline, and introduced targeted caching. As a direct result, system response times improved by 40% and zero downtime incidents occurred."
        }

ai_service = AIService()
