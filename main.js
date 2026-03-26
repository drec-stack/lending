// ========== Модуль управления навигацией ==========
const Navigation = (() => {
    const header = document.querySelector('.header');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Обработка скролла для изменения прозрачности хедера
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Открытие/закрытие мобильного меню
    const toggleMobileMenu = () => {
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    };

    // Закрытие мобильного меню при клике на ссылку
    const closeMobileMenu = () => {
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Плавная прокрутка к секциям
    const smoothScroll = (e) => {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            closeMobileMenu();
        }
    };

    const init = () => {
        if (header) window.addEventListener('scroll', handleScroll);
        if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);
        
        navItems.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (navLinks && navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });
        
        handleScroll();
    };

    return { init };
})();

// ========== Модуль данных визионеров ==========
const VisionariesData = [
    {
        name: "Алексей Воронов",
        company: "Росатом",
        position: "Директор по инновациям",
        vision: "Разработка технологий замкнутого ядерного цикла",
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
    },
    {
        name: "Марина Кольцова",
        company: "Сибур",
        position: "Главный технолог",
        vision: "Цифровизация полимерных производств",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
        name: "Дмитрий Сергеев",
        company: "Роснефть",
        position: "Руководитель направления геологоразведки",
        vision: "ИИ в прогнозировании месторождений",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
    },
    {
        name: "Елена Громова",
        company: "Норникель",
        position: "Вице-президент по устойчивому развитию",
        vision: "Экологическая трансформация металлургии",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
    },
    {
        name: "Иван Кузнецов",
        company: "Ростех",
        position: "Руководитель цифровых платформ",
        vision: "Промышленный интернет вещей",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
        name: "Татьяна Морозова",
        company: "Русская медная компания",
        position: "Директор по инжинирингу",
        vision: "Безотходные технологии переработки",
        img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop"
    }
];

// ========== Модуль рендеринга визионеров ==========
const Visionaries = (() => {
    const gridContainer = document.getElementById('visionariesGrid');
    
    const createCard = (visionary) => {
        const card = document.createElement('div');
        card.className = 'visionary-card';
        
        const img = document.createElement('img');
        img.src = visionary.img;
        img.alt = visionary.name;
        img.className = 'visionary-img';
        img.loading = 'lazy';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'hover-card-info';
        infoDiv.innerHTML = `
            <div class="visionary-name">${escapeHtml(visionary.name)}</div>
            <div class="visionary-company">${escapeHtml(visionary.company)}</div>
            <div class="visionary-role">${escapeHtml(visionary.position)}</div>
            <div class="visionary-desc">✨ Визионерство: ${escapeHtml(visionary.vision)}</div>
        `;
        
        card.appendChild(img);
        card.appendChild(infoDiv);
        
        return card;
    };
    
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };
    
    const initTouchEvents = () => {
        const cards = document.querySelectorAll('.visionary-card');
        
        const resetTouched = () => {
            cards.forEach(card => card.classList.remove('touched'));
        };
        
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                resetTouched();
                card.classList.add('touched');
            });
        });
        
        document.body.addEventListener('click', (e) => {
            if (!e.target.closest('.visionary-card')) {
                resetTouched();
            }
        });
    };
    
    const render = () => {
        if (!gridContainer) return;
        
        gridContainer.innerHTML = '';
        VisionariesData.forEach(visionary => {
            gridContainer.appendChild(createCard(visionary));
        });
        
        initTouchEvents();
    };
    
    return { render };
})();

// ========== Модуль анимаций при скролле ==========
const ScrollAnimations = (() => {
    const init = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const animatedElements = document.querySelectorAll(
            '.synopsis, .timeline-item, .visionary-card, .contact-card, .info-card'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };
    
    return { init };
})();

// ========== Модуль предотвращения конфликтов (Touch) ==========
const TouchHandler = (() => {
    const init = () => {
        // Предотвращаем залипание hover на мобильных устройствах
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    };
    
    return { init };
})();

// ========== Инициализация приложения ==========
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    Visionaries.render();
    ScrollAnimations.init();
    TouchHandler.init();
    
    console.log('Лендинг успешно загружен');
});

// ========== Оптимизация производительности ==========
window.addEventListener('load', () => {
    // Ленивая загрузка изображений уже встроена через loading="lazy"
    // Дополнительная оптимизация для больших изображений
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    });
});