/**
 * PrepPulse AI - Career Accelerator Toolkit & Question Flashcards
 */

let allFlashcardQuestions = [];

function initCareerTools() {
    // Bullet Optimizer
    const optimizeBulletBtn = document.getElementById('optimizeBulletBtn');
    if (optimizeBulletBtn) {
        optimizeBulletBtn.addEventListener('click', handleOptimizeBullet);
    }

    // Sample bullets loader
    const sampleBulletBtn = document.getElementById('loadSampleBulletBtn');
    if (sampleBulletBtn) {
        sampleBulletBtn.addEventListener('click', () => {
            document.getElementById('inputBulletText').value = "Worked on fixing bugs and making website faster for users.";
            document.getElementById('bulletRoleContext').value = "Frontend Engineer";
        });
    }

    // Elevator Pitch Generator
    const generatePitchBtn = document.getElementById('generatePitchBtn');
    if (generatePitchBtn) {
        generatePitchBtn.addEventListener('click', handleGeneratePitch);
    }

    // Flashcards Loader
    loadQuestionBankFlashcards();
}

async function handleOptimizeBullet() {
    const bullet = document.getElementById('inputBulletText').value.trim();
    const role = document.getElementById('bulletRoleContext').value.trim();
    const btn = document.getElementById('optimizeBulletBtn');

    if (!bullet) {
        window.showToast("Please enter a bullet point to enhance.", "warning");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Enhancing Bullet...`;

    try {
        const res = await fetch('/api/tools/optimize-bullet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bullet, role })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to optimize bullet");

        renderOptimizedBullets(data.variations);
        window.showToast("STAR bullet variations generated!", "success");
    } catch (err) {
        console.error(err);
        window.showToast(err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4 mr-1.5 inline"></i> Transform to High-Impact STAR`;
        if (window.lucide) lucide.createIcons();
    }
}

function renderOptimizedBullets(variations) {
    const container = document.getElementById('optimizedBulletsContainer');
    container.innerHTML = '';
    document.getElementById('optimizedBulletsWrapper').classList.remove('hidden');

    variations.forEach(v => {
        const card = document.createElement('div');
        card.className = 'p-4 rounded-xl border border-indigo-500/20 bg-white/70 dark:bg-slate-800/80 shadow-sm relative group hover:border-indigo-500 transition-all';
        card.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">${v.type}</span>
                <button class="copy-bullet-btn text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-700/60 transition">
                    <i data-lucide="copy" class="w-3.5 h-3.5 mr-1"></i> Copy
                </button>
            </div>
            <p class="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">${v.text}</p>
        `;

        const copyBtn = card.querySelector('.copy-bullet-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(v.text);
            copyBtn.innerHTML = `✓ Copied!`;
            setTimeout(() => {
                copyBtn.innerHTML = `<i data-lucide="copy" class="w-3.5 h-3.5 mr-1"></i> Copy`;
                if (window.lucide) lucide.createIcons();
            }, 2000);
            window.showToast("Copied to clipboard!", "success");
        });

        container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
}

async function handleGeneratePitch() {
    const summary = document.getElementById('pitchSummaryInput').value.trim() || document.getElementById('resumeText')?.value?.trim() || "";
    const targetRole = document.getElementById('pitchRoleInput').value.trim();
    const yearsExp = document.getElementById('pitchExpInput').value.trim();
    const btn = document.getElementById('generatePitchBtn');

    if (!targetRole) {
        window.showToast("Please specify the target role title.", "warning");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating Pitch...`;

    try {
        const res = await fetch('/api/tools/elevator-pitch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resume_summary: summary, target_role: targetRole, years_exp: yearsExp })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to generate pitch");

        const pitch = data.pitch;
        document.getElementById('pitchHeadlineDisplay').textContent = pitch.headline;
        document.getElementById('pitchScriptDisplay').textContent = pitch.script_60s;

        const bulletList = document.getElementById('pitchKeyPointsList');
        bulletList.innerHTML = '';
        if (pitch.bullet_points) {
            pitch.bullet_points.forEach(bp => {
                const li = document.createElement('li');
                li.className = 'text-xs text-slate-700 dark:text-slate-300 flex items-start';
                li.innerHTML = `<span class="text-indigo-500 mr-2 font-bold">★</span> ${bp}`;
                bulletList.appendChild(li);
            });
        }

        document.getElementById('pitchResultsWrapper').classList.remove('hidden');

        // Copy pitch script button
        document.getElementById('copyPitchBtn').onclick = () => {
            navigator.clipboard.writeText(pitch.script_60s);
            window.showToast("Elevator pitch copied to clipboard!", "success");
        };

        // Listen to spoken pitch button
        document.getElementById('speakPitchBtn').onclick = () => {
            window.voiceEngine.speak(pitch.script_60s);
        };

        window.showToast("Elevator pitch generated!", "success");
    } catch (err) {
        console.error(err);
        window.showToast(err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4 mr-1.5 inline"></i> Generate 60-Sec Pitch`;
        if (window.lucide) lucide.createIcons();
    }
}

async function loadQuestionBankFlashcards() {
    try {
        const res = await fetch('/api/tools/question-bank');
        const data = await res.json();
        if (data.status === 'success') {
            allFlashcardQuestions = data.questions;
            renderFlashcards(allFlashcardQuestions);
        }
    } catch (err) {
        console.error("Failed to load flashcard questions:", err);
    }
}

function renderFlashcards(questions) {
    const container = document.getElementById('flashcardsGrid');
    if (!container) return;
    container.innerHTML = '';

    questions.forEach((q, idx) => {
        const card = document.createElement('div');
        card.className = 'flip-card cursor-pointer group';
        card.innerHTML = `
            <div class="flip-card-inner">
                <!-- Front -->
                <div class="flip-card-front p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">${q.category}</span>
                            <span class="text-[11px] font-medium text-slate-400">Card #${idx + 1}</span>
                        </div>
                        <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">${q.question}</h4>
                    </div>
                    <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-indigo-500 font-medium">
                        <span>Click to flip for STAR strategy</span>
                        <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
                    </div>
                </div>

                <!-- Back -->
                <div class="flip-card-back p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border border-indigo-700 shadow-md flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-semibold text-indigo-300">💡 Interviewer Insight & Tips</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">${q.difficulty}</span>
                        </div>
                        <p class="text-xs text-slate-200 leading-relaxed mt-2">${q.tip}</p>
                    </div>
                    <div class="mt-3 pt-2 border-t border-indigo-800/80 flex items-center justify-between text-[11px] text-indigo-300">
                        <span>Click to flip back</span>
                        <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });

        container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
}

window.initCareerTools = initCareerTools;
