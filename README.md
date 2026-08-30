<div align="center">

# ⚡ PrepPulse AI
### *100% Free & Open-Source AI Resume Analyzer & Voice/Text Mock Interview Coach*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

**PrepPulse AI** is a **100% free, community-accessible career accelerator** designed to help job seekers worldwide optimize resumes for ATS screeners and master high-stakes technical & behavioral interviews with live voice practice.

[Live Demo & Deploy](#-free-public-deployment-guide) • [Key Features](#-key-features) • [Quick Start](#-quick-start) • [Architecture](#-system-architecture)

---

</div>

## 🌐 100% Free Public Deployment (Make it Live Online)

You can host and share PrepPulse AI with anyone on the internet completely for **free** with **zero server costs**.

### 🌟 Option 1: Deploy on Render.com (Recommended & Easiest)
1. Fork or push this repository to your **GitHub** account.
2. Sign in to [Render.com](https://render.com) (free).
3. Click **New +** → **Web Service**.
4. Select your **`preppulse-ai`** repository.
5. Render will automatically detect the settings from `render.yaml` or use:
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free**
6. Click **Create Web Service**. Within 2 minutes, you will get a permanent public link:
   👉 `https://your-app-name.onrender.com`

---

### 🌟 Option 2: Deploy on Hugging Face Spaces (100% Free & Unlimited)
1. Go to [Hugging Face Spaces](https://huggingface.co/spaces) and click **Create new Space**.
2. Select **Docker** or **Gradio/FastAPI** as the Space SDK.
3. Link your GitHub repo or push this codebase directly.
4. Your free public web app is instantly live for the world!

---

### 🌟 Option 3: Deploy on Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Your app is live on `https://your-project.vercel.app`!

---

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

## 🚀 Quick Local Start

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/preppulse-ai.git
cd preppulse-ai
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
# or with uv
uv sync
```

### 3. Run Locally
```bash
python run.py
```
Open **`http://localhost:8000`** in your browser.

---

## 🧪 Running Automated Tests

```bash
pytest
```

---

## 👨‍💻 Author & Copyright

**PrepPulse AI** is conceptualized, designed, and developed by:
* **Author**: [Jagan T. Jiju](https://github.com/jagantj28-wq)
* **Email**: [jagantj28@gmail.com](mailto:jagantj28@gmail.com)
* **Repository**: [https://github.com/jagantj28-wq/project](https://github.com/jagantj28-wq/project)

Copyright © 2026 **Jagan T. Jiju**. All rights reserved.

---

## 📄 License

Distributed under the **MIT License** (100% Free & Open-Source Software). See [`LICENSE`](LICENSE) for more details.

