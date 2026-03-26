// ========== ПОЛИФИЛЛЫ ДЛЯ СТАРЫХ БРАУЗЕРОВ ==========
(function() {
    // Полифилл для smooth scroll (для Safari, IE)
    if (!('scrollBehavior' in document.documentElement.style)) {
        var smoothScrollTo = function(element, duration) {
            duration = duration || 500;
            var targetPosition = element.getBoundingClientRect().top;
            var startPosition = window.pageYOffset;
            var distance = targetPosition - 80;
            var startTime = null;
            
            var easeInOutCubic = function(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            };
            
            var animation = function(currentTime) {
                if (startTime === null) startTime = currentTime;
                var timeElapsed = currentTime - startTime;
                var run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };
            
            requestAnimationFrame(animation);
        };
        
        window.smoothScrollToPolyfill = smoothScrollTo;
    }
    
    // Полифилл для Intersection Observer (для IE)
    if (!window.IntersectionObserver) {
        window.IntersectionObserver = function(callback) {
            this.callback = callback;
            this.elements = [];
            this.interval = null;
            
            this.observe = function(element) {
                this.elements.push(element);
                this.checkVisibility();
                if (!this.interval) {
                    var self = this;
                    this.interval = setInterval(function() { self.checkVisibility(); }, 100);
                }
            };
            
            this.unobserve = function(element) {
                var index = this.elements.indexOf(element);
                if (index > -1) {
                    this.elements.splice(index, 1);
                }
                if (this.elements.length === 0 && this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
            };
            
            this.checkVisibility = function() {
                var self = this;
                this.elements.forEach(function(element) {
                    var rect = element.getBoundingClientRect();
                    var isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible) {
                        self.callback([{ target: element, isIntersecting: true }]);
                        self.unobserve(element);
                    }
                });
            };
        };
    }
})();

// ========== Модуль управления навигацией ==========
var Navigation = (function() {
    var header = document.querySelector('.header');
    var mobileBtn = document.querySelector('.mobile-menu-btn');
    var navLinks = document.querySelector('.nav-links');
    var navItems = document.querySelectorAll('.nav-link');
    
    var updateActiveLink = function() {
        var scrollPosition = window.pageYOffset + 100;
        
        navItems.forEach(function(link) {
            var sectionId = link.getAttribute('href');
            if (!sectionId) return;
            
            var section = document.querySelector(sectionId);
            
            if (section) {
                var sectionTop = section.offsetTop;
                var sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    };
    
    var handleScroll = function() {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveLink();
    };
    
    var toggleMobileMenu = function() {
        if (!navLinks || !mobileBtn) return;
        
        navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('active');
        var isExpanded = navLinks.classList.contains('active');
        mobileBtn.setAttribute('aria-expanded', isExpanded);
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    };
    
    var closeMobileMenu = function() {
        if (!navLinks || !mobileBtn) return;
        
        navLinks.classList.remove('active');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };
    
    var smoothScrollTo = function(targetId) {
        if (!targetId) return;
        
        var targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            var headerOffset = 80;
            var elementPosition = targetSection.getBoundingClientRect().top;
            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
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
    
    var handleNavClick = function(event) {
        event.preventDefault();
        var link = event.currentTarget;
        var targetId = link.getAttribute('href');
        smoothScrollTo(targetId);
    };
    
    var init = function() {
        if (header) {
            window.addEventListener('scroll', handleScroll);
        }
        
        if (mobileBtn) {
            mobileBtn.addEventListener('click', toggleMobileMenu);
            mobileBtn.addEventListener('touchstart', toggleMobileMenu);
        }
        
        navItems.forEach(function(link) {
            link.addEventListener('click', handleNavClick);
            link.addEventListener('touchstart', handleNavClick);
        });
        
        document.addEventListener('click', function(e) {
            if (navLinks && navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && mobileBtn && !mobileBtn.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        handleScroll();
    };
    
    return { init: init };
})();

// ========== Модуль данных визионеров ==========
var VisionariesData = [
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
var Visionaries = (function() {
    var gridContainer = document.getElementById('visionariesGrid');
    
    var escapeHtml = function(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };
    
    var createCard = function(visionary) {
        var card = document.createElement('div');
        card.className = 'visionary-card';
        
        var img = document.createElement('img');
        img.src = visionary.img;
        img.alt = visionary.name;
        img.className = 'visionary-img';
        img.loading = 'lazy';
        
        var infoDiv = document.createElement('div');
        infoDiv.className = 'hover-card-info';
        infoDiv.innerHTML = [
            '<div class="visionary-name">', escapeHtml(visionary.name), '</div>',
            '<div class="visionary-company">', escapeHtml(visionary.company), '</div>',
            '<div class="visionary-role">', escapeHtml(visionary.position), '</div>',
            '<div class="visionary-desc">✨ Визионерство: ', escapeHtml(visionary.vision), '</div>'
        ].join('');
        
        card.appendChild(img);
        card.appendChild(infoDiv);
        
        return card;
    };
    
    var initTouchEvents = function() {
        var cards = document.querySelectorAll('.visionary-card');
        
        var resetTouched = function() {
            cards.forEach(function(card) { card.classList.remove('touched'); });
        };
        
        cards.forEach(function(card) {
            card.addEventListener('click', function(e) {
                e.stopPropagation();
                resetTouched();
                card.classList.add('touched');
            });
            card.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                resetTouched();
                card.classList.add('touched');
            });
        });
        
        document.body.addEventListener('click', function(e) {
            if (!e.target.closest('.visionary-card')) {
                resetTouched();
            }
        });
    };
    
    var render = function() {
        if (!gridContainer) return;
        
        gridContainer.innerHTML = '';
        VisionariesData.forEach(function(visionary) {
            gridContainer.appendChild(createCard(visionary));
        });
        
        initTouchEvents();
    };
    
    return { render: render };
})();

// ========== Модуль анимаций при скролле ==========
var ScrollAnimations = (function() {
    var init = function() {
        var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        var animatedElements = document.querySelectorAll(
            '.synopsis, .timeline-item, .visionary-card, .contact-card, .info-card, .premiere-card'
        );
        
        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };
    
    return { init: init };
})();

// ========== Модуль обработки скролла для логотипа ==========
var LogoScroll = (function() {
    var logo = document.querySelector('.logo');
    
    var init = function() {
        if (logo) {
            logo.addEventListener('click', function(e) {
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
    
    return { init: init };
})();

// ========== Модуль для мобильных устройств ==========
var TouchHandler = (function() {
    var init = function() {
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            var style = document.createElement('style');
            style.textContent = [
                '.touch-device .visionary-card:hover .visionary-img { filter: grayscale(0.4); }',
                '.touch-device .visionary-card:hover .hover-card-info { opacity: 0; }'
            ].join('');
            document.head.appendChild(style);
        }
    };
    
    return { init: init };
})();

// ========== Модуль фиксированного нижнего блока ==========
var StickyFooter = (function() {
    var stickyBar = document.querySelector('.sticky-footer-bar');
    var ticking = false;
    var isVisible = false;
    
    var handleScroll = function() {
        if (!stickyBar) return;
        
        var currentScrollY = window.pageYOffset;
        var scrollThreshold = 300;
        
        if (currentScrollY > scrollThreshold && !isVisible) {
            stickyBar.classList.remove('hide');
            isVisible = true;
        } else if (currentScrollY <= scrollThreshold && isVisible) {
            stickyBar.classList.add('hide');
            isVisible = false;
        }
        
        ticking = false;
    };
    
    var init = function() {
        if (!stickyBar) return;
        
        stickyBar.classList.add('hide');
        isVisible = false;
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
    };
    
    return { init: init };
})();

// ========== Инициализация приложения ==========
document.addEventListener('DOMContentLoaded', function() {
    Navigation.init();
    Visionaries.render();
    ScrollAnimations.init();
    LogoScroll.init();
    TouchHandler.init();
    StickyFooter.init();
    
    console.log('Лендинг успешно загружен');
});

// ========== Оптимизация производительности ==========
window.addEventListener('load', function() {
    var images = document.querySelectorAll('img[data-src]');
    images.forEach(function(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    });
});
