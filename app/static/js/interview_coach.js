/**
 * PrepPulse AI - Interactive Voice & Text Mock Interview Coach
 */

let activeInterviewSession = null;
let currentQuestionData = null;
let interviewTimerInterval = null;
let interviewTimerSeconds = 0;

function initInterviewCoach() {
    const startInterviewBtn = document.getElementById('startInterviewBtn');
    const toggleMicBtn = document.getElementById('toggleMicBtn');
    const submitAnswerBtn = document.getElementById('submitAnswerBtn');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const replayAudioBtn = document.getElementById('replayAudioBtn');
    const restartInterviewBtn = document.getElementById('restartInterviewBtn');
    const ttsToggle = document.getElementById('ttsToggleCheckbox');

    if (startInterviewBtn) {
        startInterviewBtn.addEventListener('click', startNewInterviewSession);
    }

    if (toggleMicBtn) {
        toggleMicBtn.addEventListener('click', toggleVoiceRecording);
    }

    if (submitAnswerBtn) {
        submitAnswerBtn.addEventListener('click', submitCurrentAnswer);
    }

    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', proceedToNextQuestion);
    }

    if (replayAudioBtn) {
        replayAudioBtn.addEventListener('click', () => {
            if (currentQuestionData && currentQuestionData.question) {
                window.voiceEngine.speak(currentQuestionData.question);
            }
        });
    }

    if (restartInterviewBtn) {
        restartInterviewBtn.addEventListener('click', resetInterviewUI);
    }

    if (ttsToggle) {
        ttsToggle.addEventListener('change', (e) => {
            window.voiceEngine.toggleTTS(e.target.checked);
            window.showToast(`AI Spoken Questions ${e.target.checked ? 'Enabled' : 'Disabled'}`, 'info');
        });
    }
}

async function startNewInterviewSession() {
    const role = document.getElementById('interviewRoleSelect').value.trim();
    const seniority = document.getElementById('interviewSenioritySelect').value;
    const mode = document.getElementById('interviewModeSelect').value;
    const resumeText = document.getElementById('resumeText')?.value?.trim() || "";

    const startBtn = document.getElementById('startInterviewBtn');
    startBtn.disabled = true;
    startBtn.textContent = "Setting up interview room...";

    try {
        const res = await fetch('/api/interview/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, seniority, mode, resume_text: resumeText })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to start interview");

        activeInterviewSession = data.data;
        currentQuestionData = activeInterviewSession.first_question;

        // Switch Views
        document.getElementById('interviewSetupPanel').classList.add('hidden');
        document.getElementById('interviewArenaPanel').classList.remove('hidden');
        document.getElementById('interviewScorecardPanel').classList.add('hidden');

        displayQuestion(currentQuestionData, 1, activeInterviewSession.total_questions);
        window.showToast("Interview session started! Good luck.", "success");
    } catch (err) {
        console.error(err);
        window.showToast(err.message, "error");
    } finally {
        startBtn.disabled = false;
        startBtn.textContent = "Start Mock Interview";
    }
}

function displayQuestion(q, qNum, total) {
    currentQuestionData = q;
    document.getElementById('questionCounterBadge').textContent = `Question ${qNum} of ${total}`;
    document.getElementById('questionCategoryBadge').textContent = q.category || 'Interview Question';
    document.getElementById('questionPromptText').textContent = q.question;
    document.getElementById('questionTipText').textContent = q.context_or_tip || "Answer clearly using the STAR method.";

    // Reset Answer Arena
    document.getElementById('candidateAnswerInput').value = '';
    document.getElementById('feedbackContainer').classList.add('hidden');
    document.getElementById('answerControls').classList.remove('hidden');
    document.getElementById('submitAnswerBtn').classList.remove('hidden');
    document.getElementById('nextQuestionBtn').classList.add('hidden');

    // Start Timer
    startQuestionTimer();

    // Spoken Audio via SpeechSynthesis
    if (window.voiceEngine && window.voiceEngine.ttsEnabled) {
        window.voiceEngine.speak(q.question);
    }
}

function startQuestionTimer() {
    clearInterval(interviewTimerInterval);
    interviewTimerSeconds = 0;
    const timerDisplay = document.getElementById('interviewTimerDisplay');
    if (timerDisplay) timerDisplay.textContent = '00:00';

    interviewTimerInterval = setInterval(() => {
        interviewTimerSeconds++;
        const mins = String(Math.floor(interviewTimerSeconds / 60)).padStart(2, '0');
        const secs = String(interviewTimerSeconds % 60).padStart(2, '0');
        if (timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
}

function stopQuestionTimer() {
    clearInterval(interviewTimerInterval);
}

function toggleVoiceRecording() {
    const micBtn = document.getElementById('toggleMicBtn');
    const micIcon = document.getElementById('micIcon');
    const micStatus = document.getElementById('micStatusText');
    const waveform = document.getElementById('audioWaveform');
    const answerInput = document.getElementById('candidateAnswerInput');

    if (window.voiceEngine.isRecording) {
        window.voiceEngine.stopRecording();
        micBtn.classList.remove('bg-rose-500', 'pulse-recording');
        micBtn.classList.add('bg-indigo-600');
        micStatus.textContent = "Click to Speak Answer";
        waveform.classList.remove('waveform-active');
    } else {
        const started = window.voiceEngine.startRecording(
            (transcript, isFinal) => {
                // Append or set transcript
                answerInput.value = transcript;
            },
            (status) => {
                if (status === 'recording') {
                    micBtn.classList.remove('bg-indigo-600');
                    micBtn.classList.add('bg-rose-500', 'pulse-recording');
                    micStatus.textContent = "Listening... Click to Stop";
                    waveform.classList.add('waveform-active');
                } else {
                    micBtn.classList.remove('bg-rose-500', 'pulse-recording');
                    micBtn.classList.add('bg-indigo-600');
                    micStatus.textContent = "Click to Speak Answer";
                    waveform.classList.remove('waveform-active');
                }
            }
        );

        if (!started) {
            window.showToast("Microphone could not be started.", "warning");
        }
    }
}

async function submitCurrentAnswer() {
    const answer = document.getElementById('candidateAnswerInput').value.trim();
    if (!answer) {
        window.showToast("Please speak or type your answer before submitting.", "warning");
        return;
    }

    // Stop recording and timer
    if (window.voiceEngine.isRecording) {
        window.voiceEngine.stopRecording();
    }
    stopQuestionTimer();

    const submitBtn = document.getElementById('submitAnswerBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        AI Evaluating Answer...
    `;

    try {
        const res = await fetch('/api/interview/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: activeInterviewSession.session_id,
                question_id: currentQuestionData.id,
                answer: answer
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to evaluate answer");

        renderAnswerFeedback(data.data);
    } catch (err) {
        console.error(err);
        window.showToast(err.message, "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Submit Answer & Evaluate`;
    }
}

let pendingNextData = null;

function renderAnswerFeedback(evalData) {
    pendingNextData = evalData;
    const fb = evalData.evaluation;

    document.getElementById('feedbackContainer').classList.remove('hidden');
    document.getElementById('submitAnswerBtn').classList.add('hidden');
    document.getElementById('nextQuestionBtn').classList.remove('hidden');

    if (evalData.is_finished) {
        document.getElementById('nextQuestionBtn').textContent = "View Final Scorecard 🎉";
    } else {
        document.getElementById('nextQuestionBtn').textContent = "Next Question →";
    }

    // Set Scores
    document.getElementById('starScoreVal').textContent = `${fb.star_score}/100`;
    document.getElementById('clarityScoreVal').textContent = `${fb.clarity_score}/100`;

    // STAR Breakdown bars
    const bd = fb.breakdown;
    document.getElementById('starSBar').style.width = `${(bd.situation / 25) * 100}%`;
    document.getElementById('starTBar').style.width = `${(bd.task / 25) * 100}%`;
    document.getElementById('starABar').style.width = `${(bd.action / 25) * 100}%`;
    document.getElementById('starRBar').style.width = `${(bd.result / 25) * 100}%`;

    // Strengths & Improvements
    const strengthsList = document.getElementById('evalStrengthsList');
    const improveList = document.getElementById('evalImproveList');
    strengthsList.innerHTML = '';
    improveList.innerHTML = '';

    fb.feedback.strengths.forEach(s => {
        const li = document.createElement('li');
        li.className = 'text-xs text-slate-600 dark:text-slate-300 flex items-start';
        li.innerHTML = `<span class="text-emerald-500 mr-1.5 font-bold">✓</span> ${s}`;
        strengthsList.appendChild(li);
    });

    fb.feedback.areas_to_improve.forEach(i => {
        const li = document.createElement('li');
        li.className = 'text-xs text-slate-600 dark:text-slate-300 flex items-start';
        li.innerHTML = `<span class="text-amber-500 mr-1.5 font-bold">💡</span> ${i}`;
        improveList.appendChild(li);
    });

    // Model Answer
    document.getElementById('modelAnswerText').textContent = fb.model_answer || "Great STAR answers outline context, your concrete execution, and a measurable metric result.";

    if (window.lucide) lucide.createIcons();
    document.getElementById('feedbackContainer').scrollIntoView({ behavior: 'smooth' });
}

function proceedToNextQuestion() {
    if (!pendingNextData) return;

    if (pendingNextData.is_finished) {
        renderFinalScorecard(pendingNextData.scorecard);
    } else {
        const nextQ = pendingNextData.next_question;
        const currentQNum = parseInt(document.getElementById('questionCounterBadge').textContent.match(/\d+/)[0]) + 1;
        displayQuestion(nextQ, currentQNum, activeInterviewSession.total_questions);
    }
}

function renderFinalScorecard(scorecard) {
    document.getElementById('interviewArenaPanel').classList.add('hidden');
    document.getElementById('interviewScorecardPanel').classList.remove('hidden');

    const score = scorecard.overall_readiness_score;
    document.getElementById('finalReadinessScore').textContent = `${score}%`;
    document.getElementById('finalReadinessLevel').textContent = scorecard.readiness_level;

    // Metrics
    document.getElementById('scorecardStarScore').textContent = `${scorecard.metrics.star_structure_score}%`;
    document.getElementById('scorecardClarityScore').textContent = `${scorecard.metrics.clarity_and_delivery}%`;

    // Strengths
    const strengthsContainer = document.getElementById('finalStrengthsList');
    strengthsContainer.innerHTML = '';
    scorecard.key_strengths.forEach(s => {
        const div = document.createElement('div');
        div.className = 'p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center';
        div.innerHTML = `<span class="mr-2 text-base">⭐</span> ${s}`;
        strengthsContainer.appendChild(div);
    });

    // Roadmap
    const roadmapContainer = document.getElementById('finalRoadmapList');
    roadmapContainer.innerHTML = '';
    scorecard.growth_roadmap.forEach(r => {
        const div = document.createElement('div');
        div.className = 'p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-800 dark:text-indigo-300 flex items-center';
        div.innerHTML = `<span class="mr-2 text-base">🎯</span> ${r}`;
        roadmapContainer.appendChild(div);
    });

    window.showToast("Interview Completed! Check your final scorecard.", "success");
}

function resetInterviewUI() {
    stopQuestionTimer();
    if (window.voiceEngine.isRecording) window.voiceEngine.stopRecording();
    window.voiceEngine.stopSpeaking();

    activeInterviewSession = null;
    currentQuestionData = null;

    document.getElementById('interviewSetupPanel').classList.remove('hidden');
    document.getElementById('interviewArenaPanel').classList.add('hidden');
    document.getElementById('interviewScorecardPanel').classList.add('hidden');
}

window.initInterviewCoach = initInterviewCoach;
