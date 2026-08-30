/**
 * PrepPulse AI - Voice & Speech Recognition Engine
 */

class VoiceEngine {
    constructor() {
        this.synth = window.speechSynthesis;
        this.recognition = null;
        this.isRecording = false;
        this.isSpeaking = false;
        this.ttsEnabled = true;
        this.transcriptCallback = null;
        this.statusCallback = null;
        this.selectedVoice = null;

        this.initSpeechRecognition();
        this.initVoices();
    }

    initVoices() {
        if (!this.synth) return;
        const loadVoices = () => {
            const voices = this.synth.getVoices();
            // Pick a smooth natural English voice if available (e.g. Google US English or Microsoft Natural)
            this.selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        };

        loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }
    }

    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("[VoiceEngine] SpeechRecognition not supported in this browser. Fallback to typed text.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isRecording = true;
            if (this.statusCallback) this.statusCallback('recording');
        };

        this.recognition.onresult = (event) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    currentTranscript += transcript + ' ';
                } else {
                    currentTranscript += transcript;
                }
            }
            if (this.transcriptCallback && currentTranscript.trim()) {
                this.transcriptCallback(currentTranscript.trim(), event.results[event.results.length - 1].isFinal);
            }
        };

        this.recognition.onerror = (event) => {
            console.error("[VoiceEngine] Recognition error:", event.error);
            this.stopRecording();
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            if (this.statusCallback) this.statusCallback('idle');
        };
    }

    speak(text, onComplete = null) {
        if (!this.synth || !this.ttsEnabled) {
            if (onComplete) onComplete();
            return;
        }

        this.stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);
        if (this.selectedVoice) {
            utterance.voice = this.selectedVoice;
        }
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            this.isSpeaking = true;
            if (this.statusCallback) this.statusCallback('speaking');
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            if (this.statusCallback) this.statusCallback('idle');
            if (onComplete) onComplete();
        };

        utterance.onerror = (e) => {
            console.warn("[VoiceEngine] TTS error or interrupted:", e);
            this.isSpeaking = false;
            if (this.statusCallback) this.statusCallback('idle');
            if (onComplete) onComplete();
        };

        this.synth.speak(utterance);
    }

    stopSpeaking() {
        if (this.synth && this.synth.speaking) {
            this.synth.cancel();
            this.isSpeaking = false;
        }
    }

    startRecording(onTranscript, onStatusChange) {
        if (!this.recognition) {
            alert("Speech recognition is not supported in this browser. You can still type your answers directly!");
            return false;
        }

        this.transcriptCallback = onTranscript;
        this.statusCallback = onStatusChange;
        this.stopSpeaking();

        try {
            this.recognition.start();
            return true;
        } catch (e) {
            console.error("[VoiceEngine] Failed to start recognition:", e);
            return false;
        }
    }

    stopRecording() {
        if (this.recognition && this.isRecording) {
            try {
                this.recognition.stop();
            } catch (e) {
                console.error("[VoiceEngine] Error stopping recognition:", e);
            }
            this.isRecording = false;
        }
    }

    toggleTTS(enable) {
        this.ttsEnabled = enable;
        if (!enable) this.stopSpeaking();
    }
}

window.voiceEngine = new VoiceEngine();
