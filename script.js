document.addEventListener('DOMContentLoaded', function() {
    const languageSwitcher = document.getElementById('language-switcher');
    const languageText = languageSwitcher.querySelector('.language-text');

    const ruElements = document.querySelectorAll('[data-lang="ru"]');
    const enElements = document.querySelectorAll('[data-lang="en"]');

    let currentLang = 'ru';

    function updateResumeLink() {
        const resumeBtn = document.getElementById('resume-btn');
        if (resumeBtn) {
            if (currentLang === 'ru') {
                resumeBtn.href = resumeBtn.getAttribute('data-href-ru');
            } else {
                resumeBtn.href = resumeBtn.getAttribute('data-href-en');
            }
        }
    }

    function setElementDisplay(el, isVisible) {
        if (el.tagName === 'A' && el.classList.contains('resume-btn')) {
            el.style.display = isVisible ? 'inline-flex' : 'none';
            return;
        }

        if (!isVisible) {
            el.style.display = 'none';
            return;
        }

        if (el.tagName === 'LI') {
            el.style.display = 'list-item';
            return;
        }

        el.style.display = 'block';
    }

    function updateLanguageSwitcher() {
        if (currentLang === 'ru') {
            languageText.textContent = 'EN';
            languageSwitcher.setAttribute('aria-label', 'Switch language to English');
            languageSwitcher.setAttribute('title', 'Switch language to English');
        } else {
            languageText.textContent = 'RU';
            languageSwitcher.setAttribute('aria-label', 'Переключить язык на русский');
            languageSwitcher.setAttribute('title', 'Переключить язык на русский');
        }
    }

    function switchLanguage() {
        if (currentLang === 'ru') {
            ruElements.forEach(el => setElementDisplay(el, false));
            enElements.forEach(el => setElementDisplay(el, true));
            document.documentElement.lang = 'en';
            currentLang = 'en';
        } else {
            enElements.forEach(el => setElementDisplay(el, false));
            ruElements.forEach(el => setElementDisplay(el, true));
            document.documentElement.lang = 'ru';
            currentLang = 'ru';
        }

        updateLanguageSwitcher();
        updateResumeLink();
        localStorage.setItem('portfolioLanguage', currentLang);
    }

    languageSwitcher.addEventListener('click', switchLanguage);

    const savedLang = localStorage.getItem('portfolioLanguage');
    if (savedLang && savedLang === 'en') {
        switchLanguage();
    } else {
        updateResumeLink();
        updateLanguageSwitcher();
    }

    const themeSwitcher = document.getElementById('theme-switcher');
    const themeIcon = themeSwitcher.querySelector('i');
    const themeStorageKey = 'theme';

    function applyTheme(theme) {
        const rootElement = document.documentElement;
        rootElement.classList.remove('theme-dark', 'theme-light');
        rootElement.classList.add(`theme-${theme}`);

        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-star');
            themeSwitcher.setAttribute('aria-label', 'Switch to dark theme');
            themeSwitcher.setAttribute('title', 'Switch to dark theme');
        } else {
            themeIcon.classList.remove('fa-star');
            themeIcon.classList.add('fa-moon');
            themeSwitcher.setAttribute('aria-label', 'Switch to light theme');
            themeSwitcher.setAttribute('title', 'Switch to light theme');
        }

        localStorage.setItem(themeStorageKey, theme);
    }

    function toggleTheme() {
        const isLight = document.documentElement.classList.contains('theme-light');
        applyTheme(isLight ? 'dark' : 'light');
    }

    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === 'dark' || savedTheme === 'light') {
        applyTheme(savedTheme);
    } else {
        applyTheme('light');
    }

    themeSwitcher.addEventListener('click', toggleTheme);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            this.classList.add('active');
        });
    });

    const scrollContainer = document.querySelector('.main-content');

    function getScrollTop() {
        if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
            return scrollContainer.scrollTop;
        }

        return window.scrollY;
    }

    function getSectionTop(section) {
        if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
            return section.offsetTop;
        }

        return section.getBoundingClientRect().top + window.scrollY;
    }

    function updateActiveNavLink() {
        const offset = 150;
        const scrollPos = getScrollTop();
        const adjustedScrollPos = scrollPos + offset;
        const isContainerScroll = scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight;
        const viewportHeight = isContainerScroll ? scrollContainer.clientHeight : window.innerHeight;
        const scrollHeight = isContainerScroll ? scrollContainer.scrollHeight : document.documentElement.scrollHeight;
        const nearBottom = scrollPos + viewportHeight >= scrollHeight - 5;

        if (nearBottom) {
            const lastSection = document.querySelector('section:last-of-type');
            if (lastSection) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });

                const lastLink = document.querySelector(`.nav-link[href="#${lastSection.id}"]`);
                if (lastLink) {
                    lastLink.classList.add('active');
                }
            }
            return;
        }

        document.querySelectorAll('section').forEach(section => {
            const sectionTop = getSectionTop(section);
            const sectionHeight = section.clientHeight;
            const sectionId = section.id;

            if (adjustedScrollPos >= sectionTop && adjustedScrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });

                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updateActiveNavLink);
    }
    window.addEventListener('resize', updateActiveNavLink);
    updateActiveNavLink();
});
