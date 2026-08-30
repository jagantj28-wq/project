/**
 * PrepPulse AI - Resume Analyzer & ATS Scorer Controller
 */

const SAMPLE_RESUMES = {
    fullstack: `Alex Rivera
alex.rivera@email.com | (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexrivera | github.com/alexrivera

PROFESSIONAL SUMMARY
Results-driven Full-Stack Software Engineer with 4+ years of experience designing, scaling, and deploying web applications and distributed microservices. Proven expertise in React, TypeScript, Node.js, Python, and AWS cloud environments. Passionate about system performance, test-driven development, and agile team collaboration.

TECHNICAL SKILLS
- Programming: Python, TypeScript, JavaScript, SQL, Bash
- Frontend: React, Next.js, Tailwind CSS, Redux, HTML5, CSS3, Web Accessibility (a11y)
- Backend: Node.js, Express, FastAPI, Django, PostgreSQL, MongoDB, Redis, REST APIs, GraphQL
- Cloud & DevOps: AWS (Lambda, S3, ECS), Docker, Kubernetes, CI/CD, GitHub Actions, Linux
- Core Competencies: System Design, Agile/Scrum, Microservices, Performance Tuning

PROFESSIONAL EXPERIENCE
Senior Software Engineer | TechPulse Solutions | 2022 – Present
- Architected and delivered a multi-tenant SaaS analytics platform using React, FastAPI, and PostgreSQL, scaling system capacity to 120,000+ daily active users.
- Optimized database query bottlenecks and introduced Redis caching layer, reducing average API response times by 42%.
- Spearheaded migration of legacy monolith to microservices architecture deployed on AWS ECS with Docker, cutting server infrastructure costs by 28%.
- Mentored 4 junior engineers, led bi-weekly code reviews, and increased automated test coverage from 65% to 92%.

Full-Stack Developer | InnovateX Labs | 2020 – 2022
- Developed customer-facing web dashboard in React and Node.js/Express, increasing user checkout conversion rate by 18%.
- Implemented automated CI/CD pipeline using GitHub Actions, reducing deployment cycle times from 4 hours to 15 minutes.
- Integrated third-party payment processing (Stripe API) and WebSockets for real-time order tracking.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2016 – 2020`,

    frontend: `Sarah Chen
sarah.chen@email.com | Seattle, WA | github.com/sarahchen | linkedin.com/in/sarahchen

SUMMARY
Frontend Engineer with 3+ years of experience building modern, responsive, and accessible web user interfaces using React, Next.js, TypeScript, and Tailwind CSS.

SKILLS
- Languages: TypeScript, JavaScript, HTML5, CSS3
- Frameworks & Libraries: React, Next.js, Vue.js, Tailwind CSS, Redux, Zustand, Jest, Cypress
- Tools: Git, Webpack, Vite, Figma, REST APIs, GraphQL

EXPERIENCE
Frontend Developer | CloudWave Inc | 2021 – Present
- Built responsive design system and 30+ reusable UI components in React and TypeScript, boosting front-end development velocity across 3 teams by 35%.
- Improved Largest Contentful Paint (LCP) and Core Web Vitals score by 45% through lazy-loading, code-splitting, and asset compression.
- Conducted comprehensive accessibility audits (WCAG 2.1 AA compliant) ensuring full keyboard navigation and screen-reader support.

EDUCATION
B.S. in Software Engineering | University of Washington | 2017 – 2021`
};

const SAMPLE_JOB_DESCRIPTIONS = {
    fullstack: `Senior Full-Stack Engineer (React / Python / AWS)

About the Role:
We are seeking a talented Senior Full-Stack Engineer to architect and scale our next-generation cloud platform. You will build user-centric web applications and robust backend services.

Key Requirements:
- 3+ years of professional software engineering experience.
- Strong proficiency in modern JavaScript/TypeScript and React/Next.js.
- Strong backend experience with Python (FastAPI, Django) or Node.js.
- Experience with relational databases (PostgreSQL) and caching (Redis).
- Hands-on experience with AWS cloud services (Lambda, ECS, S3) and Docker containers.
- Familiarity with CI/CD pipelines, Git, and automated testing (unit/integration).
- Excellent communication, teamwork, problem solving, and leadership capabilities.`,

    frontend: `Senior Frontend Developer (React / TypeScript)

We are looking for a passionate Frontend Developer to craft extraordinary digital experiences.

Requirements:
- 3+ years of hands-on experience with React, Next.js, and TypeScript.
- Deep expertise in responsive design, CSS/Tailwind CSS, and web accessibility (a11y).
- Experience optimizing Core Web Vitals, page speed, and browser rendering performance.
- Proficiency in state management (Redux / Zustand) and REST/GraphQL APIs.
- Collaborative mindset, agile familiarity, and passion for UI/UX detail.`
};

let lastAnalysisResult = null;

function initResumeAnalyzer() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('resumeFileInput');
    const resumeTextarea = document.getElementById('resumeText');
    const jobTextarea = document.getElementById('jobDescription');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // Drag & Drop
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.add('border-indigo-500', 'bg-indigo-50/50', 'dark:bg-indigo-950/20');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-indigo-500', 'bg-indigo-50/50', 'dark:bg-indigo-950/20');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length) handleFileUpload(files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleFileUpload(e.target.files[0]);
        });
    }

    // Preload buttons
    const loadSampleBtn = document.getElementById('loadSampleResumeBtn');
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', () => {
            resumeTextarea.value = SAMPLE_RESUMES.fullstack;
            jobTextarea.value = SAMPLE_JOB_DESCRIPTIONS.fullstack;
            document.getElementById('fileNameDisplay').textContent = "Loaded: Full-Stack Engineer Sample";
            document.getElementById('fileNameDisplay').classList.remove('hidden');
            window.showToast("Sample resume & job description loaded!", "info");
        });
    }

    // Analyze Button
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', executeAnalysis);
    }

    // Export Buttons
    const exportMarkdownBtn = document.getElementById('exportMarkdownBtn');
    if (exportMarkdownBtn) {
        exportMarkdownBtn.addEventListener('click', exportAuditAsMarkdown);
    }
    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', () => window.print());
    }
}

async function handleFileUpload(file) {
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    fileNameDisplay.textContent = `Processing: ${file.name}...`;
    fileNameDisplay.classList.remove('hidden');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch('/api/resume/parse', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to parse file");

        document.getElementById('resumeText').value = data.text;
        fileNameDisplay.textContent = `✓ Uploaded: ${file.name} (${data.word_count} words extracted)`;
        window.showToast("Resume parsed successfully!", "success");
    } catch (err) {
        console.error(err);
        fileNameDisplay.textContent = `❌ Error: ${err.message}`;
        window.showToast(err.message, "error");
    }
}

async function executeAnalysis() {
    const resumeText = document.getElementById('resumeText').value.trim();
    const jobDescription = document.getElementById('jobDescription').value.trim();
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (!resumeText) {
        window.showToast("Please upload a resume or paste your resume text.", "warning");
        return;
    }
    if (!jobDescription) {
        window.showToast("Please paste the target job description to match against.", "warning");
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Analyzing ATS Match...
    `;

    try {
        const response = await fetch('/api/resume/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Analysis failed");

        lastAnalysisResult = data.analysis;
        renderAnalysisResults(data.analysis);
        document.getElementById('analysisResultsSection').classList.remove('hidden');
        document.getElementById('analysisResultsSection').scrollIntoView({ behavior: 'smooth' });
        window.showToast("ATS Audit Complete!", "success");
    } catch (err) {
        console.error(err);
        window.showToast(err.message, "error");
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `
            <i data-lucide="sparkles" class="w-5 h-5 inline mr-1.5"></i>
            Analyze ATS Match
        `;
        if (window.lucide) lucide.createIcons();
    }
}

function renderAnalysisResults(analysis) {
    const score = analysis.ats_score;

    // Set Radial Gauge
    const scoreCircle = document.getElementById('atsScoreCircle');
    const scoreText = document.getElementById('atsScoreValue');
    const scoreBadge = document.getElementById('atsScoreBadge');

    if (scoreCircle) {
        scoreCircle.setAttribute('stroke-dasharray', `${score}, 100`);
        let color = '#ef4444'; // Red
        let badgeClass = 'bg-red-500/10 text-red-500 border-red-500/20';
        let badgeText = 'Low Match';

        if (score >= 80) {
            color = '#10b981'; // Green
            badgeClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            badgeText = 'Excellent Match';
        } else if (score >= 65) {
            color = '#3b82f6'; // Blue
            badgeClass = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            badgeText = 'Strong Match';
        } else if (score >= 50) {
            color = '#f59e0b'; // Amber
            badgeClass = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            badgeText = 'Moderate Match';
        }

        scoreCircle.setAttribute('stroke', color);
        if (scoreText) scoreText.textContent = `${score}%`;
        if (scoreBadge) {
            scoreBadge.className = `px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`;
            scoreBadge.textContent = badgeText;
        }
    }

    // Sub-metric Bars
    const bd = analysis.breakdown;
    document.getElementById('skillMatchVal').textContent = `${bd.skills_match}%`;
    document.getElementById('skillMatchBar').style.width = `${bd.skills_match}%`;

    document.getElementById('sectionHealthVal').textContent = `${bd.section_completeness}%`;
    document.getElementById('sectionHealthBar').style.width = `${bd.section_completeness}%`;

    document.getElementById('impactMetricVal').textContent = `${bd.impact_and_metrics}%`;
    document.getElementById('impactMetricBar').style.width = `${bd.impact_and_metrics}%`;

    document.getElementById('keywordDensityVal').textContent = `${bd.keyword_density}%`;
    document.getElementById('keywordDensityBar').style.width = `${bd.keyword_density}%`;

    // Skills Matrix Badges
    const matchedContainer = document.getElementById('matchedSkillsContainer');
    const missingContainer = document.getElementById('missingSkillsContainer');

    matchedContainer.innerHTML = '';
    missingContainer.innerHTML = '';

    if (analysis.skills.matched_hard_skills.length) {
        analysis.skills.matched_hard_skills.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
            badge.innerHTML = `✓ ${skill}`;
            matchedContainer.appendChild(badge);
        });
    } else {
        matchedContainer.innerHTML = '<span class="text-xs text-slate-400">No overlapping hard skills detected.</span>';
    }

    if (analysis.skills.missing_hard_skills.length) {
        analysis.skills.missing_hard_skills.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
            badge.innerHTML = `+ ${skill}`;
            missingContainer.appendChild(badge);
        });
    } else {
        missingContainer.innerHTML = '<span class="text-xs text-emerald-500 font-medium">✓ All critical keywords matched!</span>';
    }

    // Section Health Badges
    const secList = document.getElementById('sectionStatusList');
    secList.innerHTML = '';
    const sectionNames = {
        contact_info: 'Contact Information',
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills Section',
        projects: 'Projects & Portfolio',
        certifications: 'Certifications'
    };

    Object.entries(analysis.sections).forEach(([key, present]) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50';
        item.innerHTML = `
            <span class="text-xs font-medium text-slate-700 dark:text-slate-300">${sectionNames[key] || key}</span>
            <span class="text-xs font-semibold ${present ? 'text-emerald-500' : 'text-slate-400'}">${present ? '✓ Present' : '○ Optional / Missing'}</span>
        `;
        secList.appendChild(item);
    });

    // Suggestions List
    const sugContainer = document.getElementById('suggestionsContainer');
    sugContainer.innerHTML = '';
    if (analysis.suggestions && analysis.suggestions.length) {
        analysis.suggestions.forEach(sug => {
            const el = document.createElement('div');
            el.className = 'p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-start space-x-3';
            el.innerHTML = `
                <div class="p-1 rounded-lg bg-indigo-500/10 text-indigo-500 mt-0.5">
                    <i data-lucide="lightbulb" class="w-4 h-4"></i>
                </div>
                <div>
                    <h5 class="text-sm font-semibold text-slate-800 dark:text-slate-100">${sug.title}</h5>
                    <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">${sug.description}</p>
                </div>
            `;
            sugContainer.appendChild(el);
        });
    }

    if (window.lucide) lucide.createIcons();
}

function exportAuditAsMarkdown() {
    if (!lastAnalysisResult) {
        window.showToast("No analysis result to export.", "warning");
        return;
    }

    const a = lastAnalysisResult;
    const md = `# PrepPulse AI - ATS Resume Audit Report
Generated: ${new Date().toLocaleDateString()}

## 🎯 Overall ATS Match Score: ${a.ats_score}%
- **Skills Match**: ${a.breakdown.skills_match}%
- **Section Completeness**: ${a.breakdown.section_completeness}%
- **Impact & Measurable Metrics**: ${a.breakdown.impact_and_metrics}%
- **Keyword Density**: ${a.breakdown.keyword_density}%

---

## 🛠️ Skills Analysis
### ✅ Matched Skills:
${a.skills.matched_hard_skills.map(s => `- ${s}`).join('\n') || '- None'}

### ⚠️ Missing Priority Skills:
${a.skills.missing_hard_skills.map(s => `- ${s}`).join('\n') || '- None'}

---

## 💡 Recommendations & Action Items:
${a.suggestions.map(s => `### ${s.title}\n${s.description}`).join('\n\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PrepPulse-ATS-Audit-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.showToast("Audit report exported as Markdown!", "success");
}

window.initResumeAnalyzer = initResumeAnalyzer;
