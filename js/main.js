// ========== Модуль управления навигацией ==========
const Navigation = (() => {
    const header = document.querySelector('.header');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    // Функция для обновления активного состояния меню
    const updateActiveLink = () => {
        const scrollPosition = window.scrollY + 100; // Смещение для учета хедера
        
        navItems.forEach(link => {
            const sectionId = link.getAttribute('href');
            const section = document.querySelector(sectionId);
            
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    };
    
    // Обработка скролла для изменения прозрачности хедера и активного пункта
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        updateActiveLink();
    };
    
    // Открытие/закрытие мобильного меню
    const toggleMobileMenu = () => {
        navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        mobileBtn.setAttribute('aria-expanded', isExpanded);
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    };
    
    // Закрытие мобильного меню
    const closeMobileMenu = () => {
        navLinks.classList.remove('active');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };
    
    // Плавная прокрутка к секциям
    const smoothScrollTo = (targetId) => {
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Закрываем мобильное меню после клика
            closeMobileMenu();
        }
    };
    
    // Обработчик клика по ссылкам навигации
    const handleNavClick = (e) => {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        smoothScrollTo(targetId);
    };
    
    // Инициализация
    const init = () => {
        if (header) window.addEventListener('scroll', handleScroll);
        if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);
        
        navItems.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (navLinks && navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });
        
        // Закрытие меню при изменении размера окна (на случай, если меню открыто на десктопе)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Вызываем обработчик скролла для начальной установки активного пункта
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
    
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };
    
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

// ========== Модуль обработки скролла для логотипа ==========
const LogoScroll = (() => {
    const logo = document.querySelector('.logo');
    
    const init = () => {
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
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
    LogoScroll.init();
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
