// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Элементы для переключения языка
    const languageSwitcher = document.getElementById('language-switcher');
    const languageText = languageSwitcher.querySelector('.language-text');
    
    // Все элементы с атрибутами data-lang
    const ruElements = document.querySelectorAll('[data-lang="ru"]');
    const enElements = document.querySelectorAll('[data-lang="en"]');
    
    // Текущий язык (по умолчанию русский)
    let currentLang = 'ru';
    
    // Функция переключения языка
    function switchLanguage() {
        if (currentLang === 'ru') {
            // Переключаем на английский
            ruElements.forEach(el => el.style.display = 'none');
            enElements.forEach(el => el.style.display = 'block');
            languageText.textContent = 'RU';
            document.documentElement.lang = 'en';
            currentLang = 'en';
        } else {
            // Переключаем на русский
            enElements.forEach(el => el.style.display = 'none');
            ruElements.forEach(el => el.style.display = 'block');
            languageText.textContent = 'EN';
            document.documentElement.lang = 'ru';
            currentLang = 'ru';
        }
        
        // Сохраняем выбор в localStorage
        localStorage.setItem('portfolioLanguage', currentLang);
    }
    
    // Обработчик клика на кнопку переключения языка
    languageSwitcher.addEventListener('click', switchLanguage);
    
    // Проверяем сохранённый язык
    const savedLang = localStorage.getItem('portfolioLanguage');
    if (savedLang && savedLang === 'en') {
        switchLanguage(); // Устанавливаем английский, если был сохранён
    }
    
    // Плавный скролл для якорных ссылок
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
    
    // Добавляем активный класс к текущей секции в навигации
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
    
    // Обновляем активную ссылку при скролле
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Инициализация активной ссылки
    updateActiveNavLink();
});