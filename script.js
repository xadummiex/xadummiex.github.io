document.addEventListener('DOMContentLoaded', function () {

    // --- Language ---

    const languageSwitcher = document.getElementById('language-switcher');
    const languageText = languageSwitcher.querySelector('.language-text');
    let currentLang = 'ru';

    function updateResumeLink() {
        const resumeBtn = document.getElementById('resume-btn');
        if (resumeBtn) {
            resumeBtn.href = resumeBtn.getAttribute('data-href-' + currentLang);
        }
    }

    function applyLanguage(lang) {
        document.documentElement.classList.remove('lang-ru', 'lang-en');
        document.documentElement.classList.add('lang-' + lang);
        document.documentElement.lang = lang;
        languageText.textContent = lang === 'ru' ? 'EN' : 'RU';
        currentLang = lang;
        updateResumeLink();
        localStorage.setItem('portfolioLanguage', lang);
    }

    languageSwitcher.addEventListener('click', function () {
        applyLanguage(currentLang === 'ru' ? 'en' : 'ru');
    });

    const savedLang = localStorage.getItem('portfolioLanguage');
    applyLanguage(savedLang === 'en' ? 'en' : 'ru');

    // --- Dynamic durations ---

    function pluralizeRu(n, one, few, many) {
        const mod10 = n % 10;
        const mod100 = n % 100;
        if (mod100 >= 11 && mod100 <= 19) return many;
        if (mod10 === 1) return one;
        if (mod10 >= 2 && mod10 <= 4) return few;
        return many;
    }

    function formatDurationRu(totalMonths) {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        const parts = [];
        if (years > 0) parts.push(years + ' ' + pluralizeRu(years, 'год', 'года', 'лет'));
        if (months > 0) parts.push(months + ' ' + pluralizeRu(months, 'месяц', 'месяца', 'месяцев'));
        return parts.join(' ') || 'менее месяца';
    }

    function formatDurationEn(totalMonths) {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        const parts = [];
        if (years > 0) parts.push(years + ' ' + (years === 1 ? 'year' : 'years'));
        if (months > 0) parts.push(months + ' ' + (months === 1 ? 'month' : 'months'));
        return parts.join(' ') || 'less than a month';
    }

    function updateDurations() {
        const now = new Date();
        document.querySelectorAll('.experience-duration[data-start-date]').forEach(function (el) {
            const start = new Date(el.getAttribute('data-start-date'));
            const totalMonths =
                (now.getFullYear() - start.getFullYear()) * 12 +
                (now.getMonth() - start.getMonth());
            const lang = el.getAttribute('data-lang');
            el.textContent = lang === 'en' ? formatDurationEn(totalMonths) : formatDurationRu(totalMonths);
        });
    }

    updateDurations();

    // --- Theme ---

    const themeSwitcher = document.getElementById('theme-switcher');
    const themeIcon = themeSwitcher.querySelector('i');
    const themeStorageKey = 'theme';

    function applyTheme(theme) {
        document.documentElement.classList.remove('theme-dark', 'theme-light');
        document.documentElement.classList.add('theme-' + theme);

        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeSwitcher.setAttribute('aria-label', 'Switch to dark theme');
            themeSwitcher.setAttribute('title', 'Switch to dark theme');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeSwitcher.setAttribute('aria-label', 'Switch to light theme');
            themeSwitcher.setAttribute('title', 'Switch to light theme');
        }

        localStorage.setItem(themeStorageKey, theme);
    }

    themeSwitcher.addEventListener('click', function () {
        applyTheme(document.documentElement.classList.contains('theme-light') ? 'dark' : 'light');
    });

    var savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === 'dark' || savedTheme === 'light') {
        applyTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // --- Smooth scroll ---

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            document.querySelectorAll('.nav-link').forEach(function (link) {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // --- Active nav on scroll (rAF-throttled) ---

    var scrollContainer = document.querySelector('.main-content');

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
        var offset = 150;
        var scrollPos = getScrollTop();
        var adjustedScrollPos = scrollPos + offset;
        var isContainerScroll = scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight;
        var viewportHeight = isContainerScroll ? scrollContainer.clientHeight : window.innerHeight;
        var scrollHeight = isContainerScroll ? scrollContainer.scrollHeight : document.documentElement.scrollHeight;
        var nearBottom = scrollPos + viewportHeight >= scrollHeight - 5;
        var navLinks = document.querySelectorAll('.nav-link');

        if (nearBottom) {
            var lastSection = document.querySelector('section:last-of-type');
            if (lastSection) {
                navLinks.forEach(function (l) { l.classList.remove('active'); });
                var lastLink = document.querySelector('.nav-link[href="#' + lastSection.id + '"]');
                if (lastLink) lastLink.classList.add('active');
            }
            return;
        }

        document.querySelectorAll('section').forEach(function (section) {
            var sectionTop = getSectionTop(section);
            var sectionHeight = section.clientHeight;
            if (adjustedScrollPos >= sectionTop && adjustedScrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(function (l) { l.classList.remove('active'); });
                var activeLink = document.querySelector('.nav-link[href="#' + section.id + '"]');
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    var rafPending = false;

    function onScroll() {
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(function () {
                updateActiveNavLink();
                rafPending = false;
            });
        }
    }

    window.addEventListener('scroll', onScroll);
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', onScroll);
    }
    window.addEventListener('resize', updateActiveNavLink);
    updateActiveNavLink();
});
