<div align="center">

# ⚡ PrepPulse AI
### *AI-Powered Resume Analyzer & Voice/Text Mock Interview Coach*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**PrepPulse AI** is an end-to-end career acceleration suite that analyzes resumes against target job descriptions, evaluates ATS compatibility, transforms weak bullet points using the STAR methodology, and runs interactive, real-time voice and text mock interview simulations.

[Features](#-key-features) • [Quick Start](#-quick-start) • [Architecture](#-system-architecture) • [Usage Guide](#-usage-guide) • [Contributing](#-contributing)

---

</div>

## 🌟 Key Features

### 1. 📄 Advanced ATS Resume Analyzer
- **Multi-Format Extraction**: Ingest resumes directly from **PDF**, **DOCX**, **TXT**, or plain text.
- **ATS Match Score Algorithm**: In-depth keyword & semantical matching against target job descriptions.
- **Skills Gap Matrix**: Visual breakdown of **Matched Hard Skills**, **Missing Critical Skills**, and **Soft Skills**.
- **Section-by-Section Health Audit**: Actionable recommendations for Summary, Work Experience, Education, and Formatting.
- **1-Click Audit Report**: Export comprehensive audit reports in PDF or Markdown format.

### 2. 🎙️ Interactive Voice & Text Mock Interview Simulator
- **Dynamic Role-Specific Questions**: Tailored questions for Software Engineering, Product Management, Data Science, DevOps, UI/UX, and Custom roles.
- **Resume-Tailored Deep Dive**: Automatically parses projects, tech stacks, and experiences from your uploaded resume to ask personalized situational questions.
- **Speech Recognition (STT) & Speech Synthesis (TTS)**: Real-time voice answers with microphone input and animated waveform visualization, paired with spoken AI interviewer prompts.
- **Instant Per-Answer STAR Evaluation**: Real-time breakdown of **Situation**, **Task**, **Action**, and **Result**, accompanied by clarity ratings and suggested model answers.
- **Final Interview Scorecard**: Aggregate readiness percentile, communication ratings, core strengths, and improvement roadmap.

### 3. 🛠️ Career Accelerator Toolkit
- **STAR Bullet Re-writer**: Transform generic statements (*"Built website features"*) into quantified, high-impact bullets (*"Spearheaded redesign of checkout microservice, slashing page load times by 42% and boosting conversions by 18%"*).
- **60-Second Elevator Pitch Generator**: Create a tailored "Tell me about yourself" script aligned to your target role.
- **Top 50 Curated Question Flashcards**: Interactive flashcard study mode for rapid technical and behavioral preparation.

---

## 🏗️ System Architecture

```
                       ┌───────────────────────────────────────┐
                       │          Modern Browser UI            │
                       │  (Tailwind CSS + Web Speech API)      │
                       └──────────────────┬────────────────────┘
                                          │  REST & JSON APIs
                                          ▼
                       ┌───────────────────────────────────────┐
                       │         FastAPI Web Server            │
                       │   (Async Routing & Static Servicing)  │
                       └───────────┬──────────────┬────────────┘
                                   │              │
                    ┌──────────────▼────┐   ┌─────▼─────────────┐
                    │ Parser & Scorer   │   │ Interview Coach   │
                    │ - PDF / DOCX      │   │ - STAR Evaluator  │
                    │ - ATS Scorer      │   │ - Question Engine │
                    │ - Skills Extractor│   │ - Final Scorecard │
                    └──────────────┬────┘   └─────┬─────────────┘
                                   │              │
                                   └───────┬──────┘
                                           ▼
                       ┌───────────────────────────────────────┐
                       │          AI Intelligence Engine       │
                       │  (Gemini API + Standalone Heuristics) │
                       └───────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10 or higher
- [uv](https://github.com/astral-sh/uv) (recommended) or standard `pip`

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/preppulse-ai.git
cd preppulse-ai
```

### 2. Install Dependencies
Using **uv** (ultra-fast):
```bash
uv sync
```
Or using standard **pip**:
```bash
pip install -r requirements.txt
```

### 3. (Optional) Set up Environment Variables
Create a `.env` file from the template:
```bash
cp .env.example .env
```
Add your Google Gemini API key if desired (the application also features built-in offline heuristic analysis modes if no API key is provided).

### 4. Launch Application
```bash
python run.py
```
Open your browser and navigate to **`http://localhost:8000`**.

---

## 📖 Usage Guide

1. **Resume & Job Match**:
   - Go to the **Resume Analyzer** tab.
   - Upload your resume (PDF/DOCX/TXT) and paste the target job description.
   - Click **Analyze Match** to get instant ATS scores, missing keywords, and section reviews.
2. **Interactive Mock Interview**:
   - Go to the **Mock Interview** tab.
   - Select your target role, seniority level, and question mode (Behavioral, Technical, or Resume-Based).
   - Click **Start Interview**.
   - Listen to the question or read on screen, then toggle your **Microphone** or type your answer.
   - Receive instant STAR scores and coaching after each question.
3. **Optimize Resume Bullets**:
   - Go to the **Career Toolkit** tab.
   - Paste any bullet from your resume to generate 3 high-impact quantified variations.

---

## 🧪 Running Automated Tests

Run the test suite with `pytest`:
```bash
uv run pytest
# or
pytest
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more details.
