document.addEventListener('DOMContentLoaded', function() {
    // ===== ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА =====
    const languageSwitcher = document.getElementById('language-switcher');
    const languageText = languageSwitcher.querySelector('.language-text');

    const ruElements = document.querySelectorAll('[data-lang="ru"]');
    const enElements = document.querySelectorAll('[data-lang="en"]');

    let currentLang = 'ru';

    function switchLanguage() {
        if (currentLang === 'ru') {
            // Переключаем на английский
            ruElements.forEach(el => el.style.display = 'none');
            enElements.forEach(el => el.style.display = 'block' || 'inline');
            languageText.textContent = 'RU';
            document.documentElement.lang = 'en';
            currentLang = 'en';
        } else {
            // Переключаем на русский
            enElements.forEach(el => el.style.display = 'none');
            ruElements.forEach(el => el.style.display = 'block' || 'inline');
            languageText.textContent = 'EN';
            document.documentElement.lang = 'ru';
            currentLang = 'ru';
        }

        // Сохраняем выбор в localStorage
        localStorage.setItem('portfolioLanguage', currentLang);
    }

    languageSwitcher.addEventListener('click', switchLanguage);

    // Проверяем сохранённый язык
    const savedLang = localStorage.getItem('portfolioLanguage');
    if (savedLang && savedLang === 'en') {
        switchLanguage();
    }

    // ===== АВТОМАТИЧЕСКИЙ РАСЧЁТ СТАЖА =====
    function calculateExperience(startDateStr, elementId) {
        const startDate = new Date(startDateStr);
        const currentDate = new Date();

        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();

        // Корректировка, если текущий месяц меньше начального
        if (months < 0) {
            years--;
            months += 12;
        }

        // Если начальный день месяца больше текущего дня, вычитаем месяц
        if (currentDate.getDate() < startDate.getDate()) {
            months--;
            if (months < 0) {
                years--;
                months += 12;
            }
        }

        // Форматирование текста
        let experienceText = '';

        if (years === 0 && months === 0) {
            experienceText = 'менее месяца';
        } else if (years === 0) {
            experienceText = `${months} ${getMonthText(months, currentLang)}`;
        } else if (months === 0) {
            experienceText = `${years} ${getYearText(years, currentLang)}`;
        } else {
            experienceText = `${years} ${getYearText(years, currentLang)} ${months} ${getMonthText(months, currentLang)}`;
        }

        // Обновляем текст в элементе
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = experienceText;
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

    // Функция для обновления стажа при смене языка
    function updateAllExperiences() {
        // Dunice: начало 03/2023
        calculateExperience('2023-03-01', 'dunice-experience');

        // Fastact: начало 09/2025
        calculateExperience('2025-09-01', 'fastact-experience');
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
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: 'smooth'
                });
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