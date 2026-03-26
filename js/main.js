// ========== ПОЛИФИЛЛЫ ДЛЯ СТАРЫХ БРАУЗЕРОВ ==========
(function() {
    // Полифилл для smooth scroll
    if (!('scrollBehavior' in document.documentElement.style)) {
        const smoothScrollTo = (element, duration = 500) => {
            const targetPosition = element.getBoundingClientRect().top;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - 80;
            let startTime = null;
            
            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };
            
            const easeInOutCubic = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            };
            
            requestAnimationFrame(animation);
        };
        
        window.smoothScrollToPolyfill = smoothScrollTo;
    }
    
    // Полифилл для Intersection Observer
    if (!window.IntersectionObserver) {
        window.IntersectionObserver = class IntersectionObserver {
            constructor(callback) {
                this.callback = callback;
                this.elements = [];
                this.interval = null;
            }
            
            observe(element) {
                this.elements.push(element);
                this.checkVisibility();
                if (!this.interval) {
                    this.interval = setInterval(() => this.checkVisibility(), 100);
                }
            }
            
            unobserve(element) {
                const index = this.elements.indexOf(element);
                if (index > -1) {
                    this.elements.splice(index, 1);
                }
                if (this.elements.length === 0 && this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
            }
            
            checkVisibility() {
                this.elements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible) {
                        this.callback([{ target: element, isIntersecting: true }]);
                        this.unobserve(element);
                    }
                });
            }
        };
    }
})();

// ========== Модуль управления навигацией ==========
const Navigation = (() => {
    const header = document.querySelector('.header');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    const updateActiveLink = () => {
        const scrollPosition = window.pageYOffset + 100;
        
        navItems.forEach(link => {
            const sectionId = link.getAttribute('href');
            if (!sectionId) return;
            
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
    
    const handleScroll = () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveLink();
    };
    
    const toggleMobileMenu = () => {
        if (!navLinks || !mobileBtn) return;
        
        navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        mobileBtn.setAttribute('aria-expanded', isExpanded);
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    };
    
    const closeMobileMenu = () => {
        if (!navLinks || !mobileBtn) return;
        
        navLinks.classList.remove('active');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };
    
    const smoothScrollTo = (targetId) => {
        if (!targetId) return;
        
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else if (window.smoothScrollToPolyfill) {
                window.smoothScrollToPolyfill(targetSection, 500);
            } else {
                window.scrollTo(0, offsetPosition);
            }
            
            closeMobileMenu();
        }
    };
    
    const handleNavClick = (event) => {
        event.preventDefault();
        const link = event.currentTarget;
        const targetId = link.getAttribute('href');
        smoothScrollTo(targetId);
    };
    
    const init = () => {
        if (header) {
            window.addEventListener('scroll', handleScroll);
        }
        
        if (mobileBtn) {
            mobileBtn.addEventListener('click', toggleMobileMenu);
            mobileBtn.addEventListener('touchstart', toggleMobileMenu);
        }
        
        navItems.forEach(link => {
            link.addEventListener('click', handleNavClick);
            link.addEventListener('touchstart', handleNavClick);
        });
        
        document.addEventListener('click', (e) => {
            if (navLinks && navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && mobileBtn && !mobileBtn.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });
        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
                closeMobileMenu();
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
    
    const escapeHtml = (str) => {
        if (!str) return '';
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
            card.addEventListener('touchstart', (e) => {
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
            '.synopsis, .timeline-item, .visionary-card, .contact-card, .info-card, .premiere-card'
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
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    window.scrollTo(0, 0);
                }
            });
        }
    };
    
    return { init };
})();

// ========== Модуль для мобильных устройств ==========
const TouchHandler = (() => {
    const init = () => {
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            const style = document.createElement('style');
            style.textContent = `
                .touch-device .visionary-card:hover .visionary-img {
                    filter: grayscale(0.4);
                }
                .touch-device .visionary-card:hover .hover-card-info {
                    opacity: 0;
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    return { init };
})();

// ========== Модуль фиксированного нижнего блока ==========
const StickyFooter = (() => {
    const stickyCard = document.querySelector('.sticky-footer-card');
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    
    const handleScroll = () => {
        if (!stickyCard) return;
        
        const currentScrollY = window.pageYOffset;
        const scrollThreshold = 200;
        
        // Показываем блок после прокрутки на 200px
        if (currentScrollY > scrollThreshold) {
            stickyCard.classList.remove('hide');
        } else {
            stickyCard.classList.add('hide');
        }
        
        // Скрываем при скролле вниз, показываем при скролле вверх
        if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold + 100) {
            stickyCard.classList.add('hide');
        } else if (currentScrollY < lastScrollY && currentScrollY > scrollThreshold) {
            stickyCard.classList.remove('hide');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    };
    
    const init = () => {
        if (!stickyCard) return;
        
        stickyCard.classList.add('hide');
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
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
    StickyFooter.init();
    
    console.log('Лендинг успешно загружен');
});

// ========== Оптимизация производительности ==========
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    });
});
