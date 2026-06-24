// ============================================
// MathEdu Home - Interactive JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // PAGE TRANSITION
    // ============================================
    const pageOverlay = document.getElementById('pageOverlay');
    const body = document.body;
    
    setTimeout(() => {
        if (pageOverlay) {
            pageOverlay.classList.add('hide-active');
            body.classList.remove('page-loading');
            body.classList.add('page-loaded');
            
            setTimeout(() => {
                pageOverlay.style.display = 'none';
            }, 800);
        }
    }, 2000);

    // ============================================
    // PAGE EXIT TRANSITION
    // ============================================
    const transitionLinks = document.querySelectorAll('.nav-transition');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (!href || 
                href === '#' || 
                href.startsWith('http') || 
                href.startsWith('mailto:') ||
                href === window.location.pathname ||
                href === window.location.href) {
                return;
            }
            
            e.preventDefault();
            navigateWithTransition(href);
        });
    });

    function navigateWithTransition(url) {
        let overlay = document.getElementById('pageOverlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'page-overlay';
            overlay.id = 'pageOverlay';
            overlay.innerHTML = `
                <div class="overlay-particles">
                    <div class="overlay-particle"></div>
                    <div class="overlay-particle"></div>
                    <div class="overlay-particle"></div>
                    <div class="overlay-particle"></div>
                    <div class="overlay-particle"></div>
                    <div class="overlay-particle"></div>
                    <div class="overlay-particle"></div>
                    <div class="overlay-particle"></div>
                </div>
                <div class="overlay-glow"></div>
                <div class="overlay-content">
                    <div class="overlay-logo-wrapper">
                        <div class="logo-ring"></div>
                        <div class="logo-ring logo-ring-2"></div>
                        <div class="overlay-logo">
                            <img src="logo.png" alt="MathEdu Logo" class="logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="logo-fallback">
                                <svg viewBox="0 0 60 60" fill="none">
                                    <rect width="60" height="60" rx="16" fill="url(#logoGrad2)"/>
                                    <text x="10" y="42" font-family="Inter" font-weight="900" font-size="32" fill="white">√x</text>
                                    <defs>
                                        <linearGradient id="logoGrad2" x1="0" y1="0" x2="60" y2="60">
                                            <stop offset="0%" stop-color="#00d4ff"/>
                                            <stop offset="100%" stop-color="#0099cc"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="overlay-text-wrapper">
                        <div class="overlay-text">Memuat Halaman</div>
                        <div class="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        } else {
            overlay.style.display = 'flex';
        }
        
        overlay.classList.remove('hide-active');
        overlay.classList.add('exit-active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            window.location.href = url;
        }, 800);
    }

    // ============================================
    // CURSOR GLOW EFFECT
    // ============================================
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursorGlow = () => {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        if (cursorGlow) {
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
        }

        requestAnimationFrame(animateCursorGlow);
    };

    animateCursorGlow();

    // ============================================
    // FLOATING SYMBOLS PARALLAX
    // ============================================
    const floatingSymbols = document.querySelectorAll('.math-symbol');

    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (e.clientX - centerX) / centerX;
        const deltaY = (e.clientY - centerY) / centerY;

        floatingSymbols.forEach((symbol) => {
            const speed = parseFloat(symbol.dataset.speed) || 0.3;
            const moveX = deltaX * speed * 50;
            const moveY = deltaY * speed * 50;

            symbol.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    const particlesContainer = document.getElementById('particlesContainer');
    const particleCount = 20;

    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';

        const colors = ['#00d4ff', '#a855f7', '#06b6d4', '#3b82f6'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;

        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 20000);
    };

    for (let i = 0; i < particleCount; i++) {
        setTimeout(createParticle, i * 300);
    }

    setInterval(createParticle, 1500);

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ============================================
    // MOBILE MENU
    // ============================================
    const navHamburger = document.getElementById('navHamburger');
    const navMenu = document.getElementById('navMenu');

    if (navHamburger && navMenu) {
        navHamburger.addEventListener('click', () => {
            navHamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navHamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (e) => {
            if (!navHamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navHamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR CTA
    // ============================================
    const ctaButton = document.querySelector('.cta-button');

    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#modules');
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            const ripple = ctaButton.querySelector('.btn-ripple');
            ripple.classList.add('active');
            setTimeout(() => ripple.classList.remove('active'), 600);
        });
    }

    // ============================================
    // MAGNETIC BUTTON EFFECT
    // ============================================
    const magneticButtons = document.querySelectorAll('.magnetic-button');

    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });

    // ============================================
    // 3D TILT EFFECT FOR MODULE CARDS
    // ============================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });

        card.addEventListener('click', (e) => {
            const ripple = card.querySelector('.module-ripple');
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('active');

            setTimeout(() => ripple.classList.remove('active'), 800);
        });
    });

    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + '+';
                }
            };

            updateCounter();
        });

        statsAnimated = true;
    };

    // Trigger stats animation when hero card is in view
    const heroCard = document.getElementById('heroCard');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateStats, 800);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (heroCard) {
        statsObserver.observe(heroCard);
    }

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.module-card, .feature-card').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navHamburger && navMenu) {
                navHamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // ============================================
    // PERFORMANCE: REDUCE ANIMATIONS
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.bg-glow, .rocket-emoji, .math-symbol, .particle').forEach(el => {
            el.style.animation = 'none';
        });
        if (cursorGlow) cursorGlow.style.display = 'none';
    }

    // ============================================
    // CONSOLE WELCOME
    // ============================================
    console.log('%c MathEdu Home ', 'background: linear-gradient(135deg, #00d4ff, #a855f7); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c Selamat Datang Sahabat Edu! 🚀', 'color: #00d4ff; font-size: 14px;');
});