// ============================================
// Fungsi Linier - Interactive JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // PAGE TRANSITION - LOGO.PNG VERSION
    // ============================================
    const pageOverlay = document.getElementById('pageOverlay');
    const body = document.body;
    
    // Phase 1: Loading screen (2 detik)
    // Progress bar otomatis berjalan 2 detik via CSS
    
    // Phase 2: Hide overlay dengan animasi setelah 2 detik
    setTimeout(() => {
        if (pageOverlay) {
            pageOverlay.classList.add('hide-active');
            body.classList.remove('page-loading');
            body.classList.add('page-loaded');
            
            // Remove overlay dari DOM setelah animasi selesai
            setTimeout(() => {
                pageOverlay.style.display = 'none';
            }, 800);
        }
    }, 2000);

    // ============================================
    // PAGE EXIT TRANSITION - INTERCEPT ALL NAVIGATION LINKS
    // ============================================
    const transitionLinks = document.querySelectorAll('.nav-transition');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip jika:
            // - href kosong atau '#'
            // - link external (http/https)
            // - link anchor (#section)
            // - link ke halaman yang sama
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
        // Buat overlay baru jika sudah dihapus
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
        
        // Trigger exit animation
        overlay.classList.remove('hide-active');
        overlay.classList.add('exit-active');
        
        // Disable scroll
        document.body.style.overflow = 'hidden';
        
        // Navigate after animation
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
    }

    // ============================================
    // GRAPH CANVAS
    // ============================================
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const inputA = document.getElementById('inputA');
    const inputB = document.getElementById('inputB');
    const sliderA = document.getElementById('sliderA');
    const sliderB = document.getElementById('sliderB');
    const equationValue = document.getElementById('equationValue');
    const infoGradient = document.getElementById('infoGradient');
    const infoIntercept = document.getElementById('infoIntercept');
    const infoXIntercept = document.getElementById('infoXIntercept');

    function resizeCanvas() {
        const wrapper = canvas.parentElement;
        canvas.width = wrapper.clientWidth - 60;
        canvas.height = 500;
        drawGraph();
    }

    window.addEventListener('resize', resizeCanvas);

    const scale = 40;

    function drawGraph() {
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        const a = parseFloat(inputA.value) || 0;
        const b = parseFloat(inputB.value) || 0;

        // Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        for (let x = centerX % scale; x < width; x += scale) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = centerY % scale; y < height; y += scale) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        // Labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';

        for (let i = -10; i <= 10; i++) {
            if (i === 0) continue;
            const x = centerX + i * scale;
            if (x > 0 && x < width) {
                ctx.fillText(i.toString(), x, centerY + 20);
            }
        }

        ctx.textAlign = 'right';
        for (let i = -10; i <= 10; i++) {
            if (i === 0) continue;
            const y = centerY - i * scale;
            if (y > 0 && y < height) {
                ctx.fillText(i.toString(), centerX - 10, y + 4);
            }
        }

        // Line
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;

        const startX = -width;
        const endX = width * 2;

        const startY = centerY - (a * (startX - centerX) / scale + b) * scale;
        const endY = centerY - (a * (endX - centerX) / scale + b) * scale;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Y-intercept
        const yInterceptX = centerX;
        const yInterceptY = centerY - b * scale;

        if (yInterceptY > 0 && yInterceptY < height) {
            ctx.fillStyle = '#a855f7';
            ctx.beginPath();
            ctx.arc(yInterceptX, yInterceptY, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'left';
            ctx.fillText(`(0, ${b})`, yInterceptX + 10, yInterceptY - 10);
        }

        // X-intercept
        if (a !== 0) {
            const xIntercept = -b / a;
            const xInterceptX = centerX + xIntercept * scale;
            const xInterceptY = centerY;

            if (xInterceptX > 0 && xInterceptX < width) {
                ctx.fillStyle = '#06b6d4';
                ctx.beginPath();
                ctx.arc(xInterceptX, xInterceptY, 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(`(${xIntercept.toFixed(1)}, 0)`, xInterceptX, xInterceptY + 20);
            }
        }

        updateInfo(a, b);
    }

    function updateInfo(a, b) {
        let equation = 'y = ';
        if (a === 1) equation += 'x';
        else if (a === -1) equation += '-x';
        else if (a === 0) equation += '0';
        else equation += `${a}x`;

        if (a !== 0) {
            if (b > 0) equation += ` + ${b}`;
            else if (b < 0) equation += ` - ${Math.abs(b)}`;
        } else {
            equation = `y = ${b}`;
        }

        equationValue.textContent = equation;
        infoGradient.textContent = a;
        infoIntercept.textContent = `(0, ${b})`;

        if (a !== 0) {
            const xIntercept = -b / a;
            infoXIntercept.textContent = `(${xIntercept.toFixed(2)}, 0)`;
        } else {
            infoXIntercept.textContent = b === 0 ? 'Seluruh sumbu X' : 'Tidak ada';
        }
    }

    function syncInputs(source, target) {
        source.addEventListener('input', () => {
            target.value = source.value;
            drawGraph();
        });
    }

    syncInputs(inputA, sliderA);
    syncInputs(sliderA, inputA);
    syncInputs(inputB, sliderB);
    syncInputs(sliderB, inputB);

    document.querySelectorAll('.btn-adjust').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const value = parseFloat(btn.dataset.value);
            const target = document.getElementById(targetId);
            const slider = targetId === 'inputA' ? sliderA : sliderB;
            
            let newValue = parseFloat(target.value) + value;
            newValue = Math.max(-10, Math.min(10, newValue));
            
            target.value = newValue;
            slider.value = newValue;
            drawGraph();
        });
    });

    document.getElementById('btnDraw').addEventListener('click', () => {
        drawGraph();
        const btn = document.getElementById('btnDraw');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    });

    document.getElementById('btnReset').addEventListener('click', () => {
        inputA.value = 2;
        inputB.value = 1;
        sliderA.value = 2;
        sliderB.value = 1;
        drawGraph();
    });

    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const a = parseFloat(btn.dataset.a);
            const b = parseFloat(btn.dataset.b);
            
            inputA.value = a;
            inputB.value = b;
            sliderA.value = a;
            sliderB.value = b;
            
            drawGraph();
        });
    });

    // ============================================
    // SOLVER SECTION
    // ============================================
    const inputX = document.getElementById('inputX');
    const btnCalculate = document.getElementById('btnCalculate');
    const solverSteps = document.getElementById('solverSteps');
    const solverResult = document.getElementById('solverResult');

    btnCalculate.addEventListener('click', calculate);
    inputX.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculate();
    });

    function calculate() {
        const x = parseFloat(inputX.value);
        const a = parseFloat(inputA.value) || 0;
        const b = parseFloat(inputB.value) || 0;

        if (isNaN(x)) {
            alert('Masukkan nilai x yang valid!');
            return;
        }

        const y = a * x + b;

        let stepsHTML = '';
        let stepNum = 1;

        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">Diketahui persamaan: y = ${a}x ${b >= 0 ? '+' : ''} ${b}</span>
            </div>
        `;

        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">Substitusi x = ${x} ke dalam persamaan</span>
            </div>
        `;

        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">y = ${a}(${x}) ${b >= 0 ? '+' : ''} ${b}</span>
            </div>
        `;

        if (a !== 0) {
            stepsHTML += `
                <div class="solver-step">
                    <span class="step-number">${stepNum++}</span>
                    <span class="step-content">y = ${a * x} ${b >= 0 ? '+' : ''} ${b}</span>
                </div>
            `;
        }

        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">y = ${y}</span>
            </div>
        `;

        solverSteps.innerHTML = stepsHTML;

        solverResult.innerHTML = `
            <div class="result-card">
                <div class="result-label">Hasil:</div>
                <div class="result-value">y = ${y}</div>
                <div class="result-coordinate">Koordinat: (${x}, ${y})</div>
            </div>
        `;

        solverResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ============================================
    // INTERSECTION OBSERVER
    // ============================================
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

    document.querySelectorAll('.theory-card, .example-card, .formula-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // ============================================
    // INITIALIZE
    // ============================================
    setTimeout(() => {
        resizeCanvas();
    }, 100);

    console.log('%c Fungsi Linier - MathEdu ', 'background: linear-gradient(135deg, #00d4ff, #a855f7); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c Selamat belajar fungsi linier! 📐', 'color: #00d4ff; font-size: 14px;');
});