/**
 * PrepPulse AI - Main Application Router & UI Shell
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigationTabs();
    initToastSystem();

    // Initialize Submodules
    if (window.initResumeAnalyzer) window.initResumeAnalyzer();
    if (window.initInterviewCoach) window.initInterviewCoach();
    if (window.initCareerTools) window.initCareerTools();

    // Lucide Icons initialization
    if (window.lucide) {
        lucide.createIcons();
    }
});

function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isCurrentlyDark = document.documentElement.classList.contains('dark');
            if (isCurrentlyDark) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
}

function initNavigationTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-target-tab');

            tabButtons.forEach(b => {
                b.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'border-indigo-600', 'dark:border-indigo-400', 'font-semibold');
                b.classList.add('text-slate-600', 'dark:text-slate-400', 'border-transparent');
            });

            btn.classList.add('text-indigo-600', 'dark:text-indigo-400', 'border-indigo-600', 'dark:border-indigo-400', 'font-semibold');
            btn.classList.remove('text-slate-600', 'dark:text-slate-400', 'border-transparent');

            tabPanels.forEach(panel => {
                if (panel.id === targetTab) {
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            });
        });
    });
}

function initToastSystem() {
    window.showToast = (message, type = 'info') => {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        const colorClasses = {
            success: 'bg-emerald-600 text-white',
            error: 'bg-rose-600 text-white',
            warning: 'bg-amber-600 text-white',
            info: 'bg-indigo-600 text-white'
        }[type] || 'bg-slate-800 text-white';

        toast.className = `px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium ${colorClasses} transform transition-all duration-300 translate-y-2 opacity-0 flex items-center space-x-2`;
        toast.innerHTML = `
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Animate In
        setTimeout(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        }, 10);

        // Animate Out & Remove
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };
}
