document.addEventListener('DOMContentLoaded', function() {
    // ===== ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА =====
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

    function switchLanguage() {
        if (currentLang === 'ru') {
            // Переключаем на английский
            ruElements.forEach(el => {
                if (el.tagName !== 'A' || !el.classList.contains('resume-btn')) {
                    el.style.display = 'none';
                }
            });
            enElements.forEach(el => {
                if (el.tagName !== 'A' || !el.classList.contains('resume-btn')) {
                    el.style.display = 'block' || 'inline' || 'flex';
                } else {
                    el.style.display = 'inline-flex';
                }
            });
            languageText.textContent = 'RU';
            document.documentElement.lang = 'en';
            currentLang = 'en';
        } else {
            // Переключаем на русский
            enElements.forEach(el => {
                if (el.tagName !== 'A' || !el.classList.contains('resume-btn')) {
                    el.style.display = 'none';
                }
            });
            ruElements.forEach(el => {
                if (el.tagName !== 'A' || !el.classList.contains('resume-btn')) {
                    el.style.display = 'block' || 'inline' || 'flex';
                } else {
                    el.style.display = 'inline-flex';
                }
            });
            languageText.textContent = 'EN';
            document.documentElement.lang = 'ru';
            currentLang = 'ru';
        }

        updateResumeLink();
        localStorage.setItem('portfolioLanguage', currentLang);

    }

    languageSwitcher.addEventListener('click', switchLanguage);

    // Проверяем сохранённый язык
    const savedLang = localStorage.getItem('portfolioLanguage');
    if (savedLang && savedLang === 'en') {
        switchLanguage();
    } else {
        updateResumeLink(); // Обновляем ссылку даже для русского
    }

    // ===== АВТОМАТИЧЕСКИЙ РАСЧЁТ СТАЖА =====
    function calculateExperience(startDateStr, elementIdPrefix) {
        const startDate = new Date(startDateStr);
        const currentDate = new Date();

        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        if (currentDate.getDate() < startDate.getDate()) {
            months--;
            if (months < 0) {
                years--;
                months += 12;
            }
        }

        // Обновляем оба языковых варианта
        const ruElement = document.getElementById(elementIdPrefix + '-ru');
        const enElement = document.getElementById(elementIdPrefix + '-en');

        if (ruElement) {
            let ruText = '';
            if (years === 0 && months === 0) {
                ruText = 'менее месяца';
            } else if (years === 0) {
                ruText = `${months} ${getMonthText(months, 'ru')}`;
            } else if (months === 0) {
                ruText = `${years} ${getYearText(years, 'ru')}`;
            } else {
                ruText = `${years} ${getYearText(years, 'ru')} ${months} ${getMonthText(months, 'ru')}`;
            }
            ruElement.textContent = ruText;
        }

        if (enElement) {
            let enText = '';
            if (years === 0 && months === 0) {
                enText = 'less than a month';
            } else if (years === 0) {
                enText = `${months} ${getMonthText(months, 'en')}`;
            } else if (months === 0) {
                enText = `${years} ${getYearText(years, 'en')}`;
            } else {
                enText = `${years} ${getYearText(years, 'en')} ${months} ${getMonthText(months, 'en')}`;
            }
            enElement.textContent = enText;
        }
    }

    // Вспомогательные функции для склонения
    function getYearText(years, lang) {
        if (lang === 'ru') {
            if (years === 1) return 'год';
            if (years >= 2 && years <= 4) return 'года';
            return 'лет';
        } else {
            return years === 1 ? 'year' : 'years';
        }
    }

    function getMonthText(months, lang) {
        if (lang === 'ru') {
            if (months === 1) return 'месяц';
            if (months >= 2 && months <= 4) return 'месяца';
            return 'месяцев';
        } else {
            return months === 1 ? 'month' : 'months';
        }
    }

    function updateDurationsForLanguage(lang) {
    const durations = document.querySelectorAll('.experience-duration');

    durations.forEach(element => {
        const startDateStr = element.getAttribute('data-start-date');
        if (!startDateStr) return;

        const startDate = new Date(startDateStr);
        const currentDate = new Date();

        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        if (currentDate.getDate() < startDate.getDate()) {
            months--;
            if (months < 0) {
                years--;
                months += 12;
            }
        }

        let durationText = '';

        if (years === 0 && months === 0) {
            durationText = lang === 'ru' ? 'менее месяца' : 'less than a month';
        } else if (years === 0) {
            durationText = `${months} ${getMonthText(months, lang)}`;
        } else if (months === 0) {
            durationText = `${years} ${getYearText(years, lang)}`;
        } else {
            durationText = `${years} ${getYearText(years, lang)} ${months} ${getMonthText(months, lang)}`;
        }

        element.textContent = durationText;
    });
}

    // Функция для обновления стажа при смене языка
    function updateAllExperiences() {
        // Dunice
        calculateExperience('2023-03-01', 'dunice-experience-main');

        // Fastact
        calculateExperience('2025-09-01', 'fastact-experience-main');
    }

    // Вызываем при загрузке
    updateAllExperiences();

    // Обновляем при смене языка
    const originalSwitchLanguage = switchLanguage;
    switchLanguage = function() {
        originalSwitchLanguage();
        setTimeout(updateAllExperiences, 10);
    };

    // ===== ПЛАВНЫЙ СКРОЛЛ =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Проверяем, что это якорь на этой же странице
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();

                const targetId = href;
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Вычисляем позицию с учетом фиксированного сайдбара
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const headerOffset = 80; // Отступ сверху
                    const offsetPosition = targetPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Обновляем URL без перезагрузки
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // ===== АКТИВНЫЕ ССЫЛКИ В НАВИГАЦИИ =====
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
});