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

    // ===== ПЛАВНЫЙ СКРОЛЛ (чистый, без аналитики) =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Только preventDefault, больше ничего

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Простой нативный скролл
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

    // ===== АКТИВНЫЕ ССЫЛКИ В НАВИГАЦИИ =====
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
        const scrollPos = getScrollTop() + 150; // Отступ

        document.querySelectorAll('section').forEach(section => {
            const sectionTop = getSectionTop(section);
            const sectionHeight = section.clientHeight;
            const sectionId = section.id;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Удаляем active у всех
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });

                // Добавляем активному
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
