import re
from typing import Dict, List, Set, Any

COMMON_HARD_SKILLS = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "c", "go", "golang", "rust",
    "ruby", "php", "swift", "kotlin", "scala", "dart", "r", "sql", "html", "css", "bash", "shell",
    
    # Frontend & Mobile
    "react", "react.js", "react native", "next.js", "nextjs", "vue", "vue.js", "angular", "svelte",
    "tailwind", "tailwind css", "bootstrap", "sass", "redux", "graphql", "rest api", "webpack", "vite",
    "flutter", "ios", "android", "responsive design", "ui/ux", "web accessibility", "a11y",
    
    # Backend & Frameworks
    "node.js", "nodejs", "express", "express.js", "fastapi", "django", "flask", "spring boot", "spring",
    ".net", "asp.net", "rails", "ruby on rails", "nest.js", "nestjs", "gin", "microservices", "restful apis",
    "grpc", "websockets", "celery",
    
    # Databases & Caching
    "postgresql", "postgres", "mysql", "mongodb", "sqlite", "redis", "elasticsearch", "dynamodb",
    "cassandra", "neo4j", "supabase", "firebase", "firestore", "prisma", "sqlalchemy",
    
    # Cloud, DevOps & Infrastructure
    "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s",
    "terraform", "ansible", "jenkins", "github actions", "gitlab ci", "ci/cd", "linux", "nginx",
    "serverless", "lambda", "prometheus", "grafana", "kafka", "rabbitmq",
    
    # AI / ML & Data
    "machine learning", "deep learning", "ai", "artificial intelligence", "nlp", "llm", "generative ai",
    "langchain", "pytorch", "tensorflow", "keras", "scikit-learn", "pandas", "numpy", "opencv",
    "spark", "pyspark", "hadoop", "airflow", "databricks", "snowflake", "bigquery", "tableau", "power bi",
    
    # Architecture & Tools
    "git", "github", "gitlab", "jira", "confluence", "agile", "scrum", "kanban", "tdd", "system design",
    "object oriented programming", "oop", "functional programming", "design patterns"
}

COMMON_SOFT_SKILLS = {
    "leadership", "communication", "teamwork", "collaboration", "problem solving", "critical thinking",
    "adaptability", "time management", "conflict resolution", "mentorship", "emotional intelligence",
    "creativity", "presentation", "cross-functional collaboration", "stakeholder management",
    "decision making", "ownership", "curiosity", "negotiation", "work ethic", "attention to detail"
}

ACTION_VERBS = {
    "accelerated", "achieved", "administered", "architected", "automated", "built", "championed",
    "collaborated", "constructed", "created", "decreased", "delivered", "deployed", "designed",
    "developed", "devised", "directed", "doubled", "drove", "engineered", "enhanced", "established",
    "executed", "expanded", "expedited", "formulated", "founded", "generated", "guided", "implemented",
    "improved", "increased", "initiated", "innovated", "installed", "instituted", "integrated",
    "launched", "led", "managed", "maximized", "mentored", "minimized", "modernized", "negotiated",
    "optimized", "orchestrated", "overhauled", "pioneered", "reduced", "refactored", "resolved",
    "restructured", "scaled", "simplified", "spearheaded", "standardized", "streamlined", "transformed"
}

class ATSScorer:
    """Intelligent ATS resume scoring and keyword matching engine."""

    @staticmethod
    def extract_words(text: str) -> List[str]:
        """Tokenize text into clean lowercased words."""
        return re.findall(r'\b[a-zA-Z0-9#\+\.\-]+\b', text.lower())

    @classmethod
    def extract_skills_from_text(cls, text: str) -> Dict[str, Set[str]]:
        """Extract hard and soft skills found in text."""
        text_lower = text.lower()
        matched_hard = set()
        matched_soft = set()

        for skill in COMMON_HARD_SKILLS:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                matched_hard.add(skill)

        for skill in COMMON_SOFT_SKILLS:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                matched_soft.add(skill)

        return {
            "hard_skills": matched_hard,
            "soft_skills": matched_soft
        }

    @classmethod
    def evaluate_sections(cls, resume_text: str) -> Dict[str, Any]:
        """Detect and rate essential resume sections."""
        text_lower = resume_text.lower()
        sections = {
            "contact_info": bool(re.search(r'(@|phone|\bemail\b|\blinkedin\b|\bgithub\b)', text_lower)),
            "summary": bool(re.search(r'\b(summary|objective|profile|about me)\b', text_lower)),
            "experience": bool(re.search(r'\b(experience|employment|work history|career|professional experience)\b', text_lower)),
            "education": bool(re.search(r'\b(education|academic|degree|university|college|bachelor|master|phd|b\.s|m\.s)\b', text_lower)),
            "skills": bool(re.search(r'\b(skills|technical skills|technologies|proficiencies|core competencies)\b', text_lower)),
            "projects": bool(re.search(r'\b(projects|portfolio|personal projects|key achievements)\b', text_lower)),
            "certifications": bool(re.search(r'\b(certifications|certificates|licenses|courses)\b', text_lower)),
        }

        # Calculate section completeness score out of 100
        weights = {
            "contact_info": 15,
            "experience": 30,
            "skills": 25,
            "education": 15,
            "summary": 10,
            "projects": 5
        }
        score = sum(weights[k] for k, present in sections.items() if present and k in weights)

        return {
            "sections": sections,
            "completeness_score": min(score, 100)
        }

    @classmethod
    def evaluate_action_verbs_and_metrics(cls, resume_text: str) -> Dict[str, Any]:
        """Analyze usage of action verbs and quantifiable metrics."""
        text_lower = resume_text.lower()
        found_verbs = set()
        for verb in ACTION_VERBS:
            if re.search(r'\b' + re.escape(verb) + r'\b', text_lower):
                found_verbs.add(verb)

        # Check for numbers, percentages, dollar signs, multipliers (e.g. 25%, $100k, 2x, 50+)
        metric_matches = re.findall(r'(\b\d+[\.,]?\d*[%kKmMbBxX\+]?|\$\d+[\.,]?\d*[kKmMbB]?)', resume_text)
        # Filter out common years like 2020-2024
        filtered_metrics = [m for m in metric_matches if not re.match(r'^(19|20)\d{2}$', m)]

        verb_score = min(len(found_verbs) * 8, 50)
        metric_score = min(len(filtered_metrics) * 5, 50)
        impact_score = verb_score + metric_score

        return {
            "found_verbs": list(found_verbs),
            "metrics_count": len(filtered_metrics),
            "impact_score": impact_score
        }

    @classmethod
    def calculate_ats_match(cls, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Calculate complete ATS score and match analysis."""
        resume_skills = cls.extract_skills_from_text(resume_text)
        job_skills = cls.extract_skills_from_text(job_description)

        res_hard = resume_skills["hard_skills"]
        job_hard = job_skills["hard_skills"]
        res_soft = resume_skills["soft_skills"]
        job_soft = job_skills["soft_skills"]

        # If job description didn't match hard skills, extract high frequency keywords
        if not job_hard:
            job_words = cls.extract_words(job_description)
            common_words = {"the", "and", "to", "of", "a", "in", "for", "is", "on", "that", "by", "this", "with", "i", "you", "it", "not", "or", "be", "are", "from", "at", "as", "your", "all", "have", "new", "more", "an", "was", "we", "will", "home", "can", "us", "about", "if", "my", "has", "but", "our", "one", "other", "do", "no", "they", "he", "she", "his", "her", "so", "how", "when", "which", "their", "what", "up", "out", "who", "get", "them", "would", "just", "him", "into", "year", "some", "could", "them", "than", "now", "other", "its", "then", "over", "also", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"}
            freq = {}
            for w in job_words:
                if len(w) > 3 and w not in common_words:
                    freq[w] = freq.get(w, 0) + 1
            top_words = sorted(freq.keys(), key=lambda x: freq[x], reverse=True)[:15]
            job_hard = set(top_words)

        matched_hard = res_hard.intersection(job_hard)
        missing_hard = job_hard.difference(res_hard)

        matched_soft = res_soft.intersection(job_soft)
        missing_soft = job_soft.difference(res_soft)

        # Skill match score calculation
        if job_hard:
            skill_score = int((len(matched_hard) / len(job_hard)) * 100)
        else:
            skill_score = 80

        # General text similarity (Jaccard on filtered words)
        res_tokens = set(cls.extract_words(resume_text))
        job_tokens = set(cls.extract_words(job_description))
        jaccard = len(res_tokens.intersection(job_tokens)) / max(len(res_tokens.union(job_tokens)), 1)
        keyword_density_score = min(int(jaccard * 250), 100)

        # Section and impact evaluation
        sections_eval = cls.evaluate_sections(resume_text)
        impact_eval = cls.evaluate_action_verbs_and_metrics(resume_text)

        # Overall composite ATS Score (0 - 100)
        # Weights: 45% Hard skills match, 20% Section structure, 20% Impact/Quant metrics, 15% General keyword density
        composite_score = int(
            (skill_score * 0.45) +
            (sections_eval["completeness_score"] * 0.20) +
            (impact_eval["impact_score"] * 0.20) +
            (keyword_density_score * 0.15)
        )
        composite_score = max(min(composite_score, 98), 20)  # Bound reasonably

        # Generate actionable suggestions
        suggestions = []
        if missing_hard:
            suggestions.append({
                "type": "warning",
                "title": "Missing High-Priority Technical Keywords",
                "description": f"Consider adding relevant experience with: {', '.join(sorted(list(missing_hard))[:6])}."
            })
        if impact_eval["metrics_count"] < 3:
            suggestions.append({
                "type": "improvement",
                "title": "Quantify Achievements with Metrics",
                "description": "Add specific metrics, percentages, revenue impact, or speed enhancements (e.g., 'Boosted efficiency by 30%')."
            })
        if not sections_eval["sections"]["summary"]:
            suggestions.append({
                "type": "tip",
                "title": "Add a Professional Summary",
                "description": "Include a 2-3 sentence executive summary tailored to this specific job title at the top of your resume."
            })
        if len(impact_eval["found_verbs"]) < 5:
            suggestions.append({
                "type": "improvement",
                "title": "Strengthen Action Verbs",
                "description": "Start bullet points with strong power verbs like 'Architected', 'Spearheaded', 'Optimized', and 'Delivered'."
            })

        return {
            "ats_score": composite_score,
            "breakdown": {
                "skills_match": skill_score,
                "section_completeness": sections_eval["completeness_score"],
                "impact_and_metrics": impact_eval["impact_score"],
                "keyword_density": keyword_density_score
            },
            "skills": {
                "matched_hard_skills": sorted(list(matched_hard)),
                "missing_hard_skills": sorted(list(missing_hard)),
                "matched_soft_skills": sorted(list(matched_soft)),
                "missing_soft_skills": sorted(list(missing_soft)),
                "all_resume_hard_skills": sorted(list(res_hard)),
            },
            "sections": sections_eval["sections"],
            "impact_metrics": {
                "metrics_found_count": impact_eval["metrics_count"],
                "action_verbs_count": len(impact_eval["found_verbs"]),
                "sample_verbs": sorted(list(impact_eval["found_verbs"]))[:8]
            },
            "suggestions": suggestions
        }
