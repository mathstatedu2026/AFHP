// ============================================
// Fungsi Kuadrat - Interactive JavaScript
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
    // GRAPH CANVAS - PARABOLA
    // ============================================
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const inputA = document.getElementById('inputA');
    const inputB = document.getElementById('inputB');
    const inputC = document.getElementById('inputC');
    const sliderA = document.getElementById('sliderA');
    const sliderB = document.getElementById('sliderB');
    const sliderC = document.getElementById('sliderC');
    const equationValue = document.getElementById('equationValue');
    const hintA = document.getElementById('hintA');
    const infoVertex = document.getElementById('infoVertex');
    const infoAxis = document.getElementById('infoAxis');
    const infoDiscriminant = document.getElementById('infoDiscriminant');
    const infoYIntercept = document.getElementById('infoYIntercept');
    const infoXIntercept = document.getElementById('infoXIntercept');
    const infoDirection = document.getElementById('infoDirection');

    function resizeCanvas() {
        const wrapper = canvas.parentElement;
        canvas.width = wrapper.clientWidth - 60;
        canvas.height = 500;
        drawGraph();
    }

    window.addEventListener('resize', resizeCanvas);

    const scale = 30; // pixels per unit (smaller for parabola visibility)

    function drawGraph() {
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        const a = parseFloat(inputA.value) || 0;
        const b = parseFloat(inputB.value) || 0;
        const c = parseFloat(inputC.value) || 0;

        // Handle a = 0 (not a quadratic)
        if (a === 0) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
            ctx.font = 'bold 16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ Nilai a tidak boleh 0 (bukan fungsi kuadrat)', centerX, 40);
        }

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

        for (let i = -15; i <= 15; i++) {
            if (i === 0) continue;
            const x = centerX + i * scale;
            if (x > 0 && x < width) {
                ctx.fillText(i.toString(), x, centerY + 20);
            }
        }

        ctx.textAlign = 'right';
        for (let i = -15; i <= 15; i++) {
            if (i === 0) continue;
            const y = centerY - i * scale;
            if (y > 0 && y < height) {
                ctx.fillText(i.toString(), centerX - 10, y + 4);
            }
        }

        // Draw axis of symmetry (if a != 0)
        if (a !== 0) {
            const axisX = -b / (2 * a);
            const axisScreenX = centerX + axisX * scale;

            if (axisScreenX > 0 && axisScreenX < width) {
                ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
                ctx.lineWidth = 2;
                ctx.setLineDash([8, 6]);
                ctx.beginPath();
                ctx.moveTo(axisScreenX, 0);
                ctx.lineTo(axisScreenX, height);
                ctx.stroke();
                ctx.setLineDash([]);

                // Label
                ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(`x = ${axisX.toFixed(2)}`, axisScreenX, 20);
            }
        }

        // Draw parabola
        if (a !== 0) {
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 10;

            ctx.beginPath();
            let firstPoint = true;

            for (let px = -width; px < width * 2; px++) {
                const x = (px - centerX) / scale;
                const y = a * x * x + b * x + c;
                const screenY = centerY - y * scale;

                if (screenY < -1000 || screenY > height + 1000) {
                    firstPoint = true;
                    continue;
                }

                if (firstPoint) {
                    ctx.moveTo(px, screenY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(px, screenY);
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw vertex
            const vertexX = -b / (2 * a);
            const vertexY = a * vertexX * vertexX + b * vertexX + c;
            const vertexScreenX = centerX + vertexX * scale;
            const vertexScreenY = centerY - vertexY * scale;

            if (vertexScreenX > 0 && vertexScreenX < width && 
                vertexScreenY > 0 && vertexScreenY < height) {
                // Vertex point
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(vertexScreenX, vertexScreenY, 8, 0, Math.PI * 2);
                ctx.fill();

                // Glow
                ctx.shadowColor = '#f59e0b';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(vertexScreenX, vertexScreenY, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Label
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = 'left';
                ctx.fillText(`V(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`, vertexScreenX + 12, vertexScreenY - 10);
            }

            // Draw Y-intercept (0, c)
            const yIntScreenX = centerX;
            const yIntScreenY = centerY - c * scale;

            if (yIntScreenY > 0 && yIntScreenY < height) {
                ctx.fillStyle = '#a855f7';
                ctx.beginPath();
                ctx.arc(yIntScreenX, yIntScreenY, 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = 'left';
                ctx.fillText(`(0, ${c})`, yIntScreenX + 10, yIntScreenY - 10);
            }

            // Draw X-intercepts (roots)
            const discriminant = b * b - 4 * a * c;
            
            if (discriminant >= 0) {
                const sqrtD = Math.sqrt(discriminant);
                const x1 = (-b + sqrtD) / (2 * a);
                const x2 = (-b - sqrtD) / (2 * a);

                const roots = discriminant === 0 ? [x1] : [x1, x2];

                roots.forEach((root, idx) => {
                    const rootScreenX = centerX + root * scale;
                    const rootScreenY = centerY;

                    if (rootScreenX > 0 && rootScreenX < width) {
                        ctx.fillStyle = '#10b981';
                        ctx.beginPath();
                        ctx.arc(rootScreenX, rootScreenY, 6, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 12px Inter';
                        ctx.textAlign = 'center';
                        ctx.fillText(`(${root.toFixed(2)}, 0)`, rootScreenX, rootScreenY + 20);
                    }
                });
            }
        }

        updateInfo(a, b, c);
    }

    function updateInfo(a, b, c) {
        // Update equation
        let equation = 'y = ';
        
        if (a === 0) {
            if (b === 0) {
                equation += c;
            } else {
                equation += b === 1 ? 'x' : b === -1 ? '-x' : `${b}x`;
                if (c > 0) equation += ` + ${c}`;
                else if (c < 0) equation += ` - ${Math.abs(c)}`;
            }
        } else {
            // ax² term
            if (a === 1) equation += 'x²';
            else if (a === -1) equation += '-x²';
            else equation += `${a}x²`;

            // bx term
            if (b !== 0) {
                if (b > 0) equation += ' + ';
                else equation += ' - ';
                
                const absB = Math.abs(b);
                if (absB === 1) equation += 'x';
                else equation += `${absB}x`;
            }

            // c term
            if (c !== 0) {
                if (c > 0) equation += ` + ${c}`;
                else equation += ` - ${Math.abs(c)}`;
            }
        }

        equationValue.textContent = equation;

        // Hint for a
        if (a > 0) {
            hintA.textContent = 'Parabola terbuka ke atas ↑ (nilai minimum)';
            hintA.style.color = 'var(--accent-green)';
        } else if (a < 0) {
            hintA.textContent = 'Parabola terbuka ke bawah ↓ (nilai maksimum)';
            hintA.style.color = 'var(--accent-orange)';
        } else {
            hintA.textContent = '⚠ Bukan fungsi kuadrat (a = 0)';
            hintA.style.color = '#ef4444';
        }

        if (a !== 0) {
            // Vertex
            const vertexX = -b / (2 * a);
            const vertexY = a * vertexX * vertexX + b * vertexX + c;
            infoVertex.textContent = `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`;

            // Axis of symmetry
            infoAxis.textContent = `x = ${vertexX.toFixed(2)}`;

            // Discriminant
            const discriminant = b * b - 4 * a * c;
            infoDiscriminant.textContent = discriminant.toFixed(2);
            
            if (discriminant > 0) {
                infoDiscriminant.style.color = 'var(--accent-green)';
            } else if (discriminant === 0) {
                infoDiscriminant.style.color = 'var(--accent-orange)';
            } else {
                infoDiscriminant.style.color = '#ef4444';
            }

            // Y-intercept
            infoYIntercept.textContent = `(0, ${c})`;

            // X-intercepts
            if (discriminant > 0) {
                const sqrtD = Math.sqrt(discriminant);
                const x1 = (-b + sqrtD) / (2 * a);
                const x2 = (-b - sqrtD) / (2 * a);
                infoXIntercept.textContent = `(${x1.toFixed(2)}, 0) & (${x2.toFixed(2)}, 0)`;
            } else if (discriminant === 0) {
                const x1 = -b / (2 * a);
                infoXIntercept.textContent = `(${x1.toFixed(2)}, 0)`;
            } else {
                infoXIntercept.textContent = 'Tidak ada (D < 0)';
            }

            // Direction
            infoDirection.textContent = a > 0 ? 'Terbuka ke atas ↑' : 'Terbuka ke bawah ↓';
        } else {
            infoVertex.textContent = '-';
            infoAxis.textContent = '-';
            infoDiscriminant.textContent = '-';
            infoYIntercept.textContent = `(0, ${c})`;
            infoXIntercept.textContent = b !== 0 ? `(${-c/b}.toFixed(2), 0)` : '-';
            infoDirection.textContent = 'Bukan kuadrat';
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
    syncInputs(inputC, sliderC);
    syncInputs(sliderC, inputC);

    document.querySelectorAll('.btn-adjust').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const value = parseFloat(btn.dataset.value);
            const target = document.getElementById(targetId);
            const slider = document.getElementById(targetId.replace('input', 'slider'));
            
            let newValue = parseFloat(target.value) + value;
            const min = parseFloat(target.min);
            const max = parseFloat(target.max);
            newValue = Math.max(min, Math.min(max, newValue));
            
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
        inputA.value = 1;
        inputB.value = 0;
        inputC.value = 0;
        sliderA.value = 1;
        sliderB.value = 0;
        sliderC.value = 0;
        drawGraph();
    });

    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const a = parseFloat(btn.dataset.a);
            const b = parseFloat(btn.dataset.b);
            const c = parseFloat(btn.dataset.c);
            
            inputA.value = a;
            inputB.value = b;
            inputC.value = c;
            sliderA.value = a;
            sliderB.value = b;
            sliderC.value = c;
            
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
        const c = parseFloat(inputC.value) || 0;

        if (isNaN(x)) {
            alert('Masukkan nilai x yang valid!');
            return;
        }

        const xSquared = x * x;
        const axSquared = a * xSquared;
        const bx = b * x;
        const y = axSquared + bx + c;

        let stepsHTML = '';
        let stepNum = 1;

        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">Diketahui persamaan: y = ${a}x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c}</span>
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
                <span class="step-content">y = ${a}(${x})² ${b >= 0 ? '+' : ''} ${b}(${x}) ${c >= 0 ? '+' : ''} ${c}</span>
            </div>
        `;

        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">y = ${a}(${xSquared}) ${b >= 0 ? '+' : ''} ${bx} ${c >= 0 ? '+' : ''} ${c}</span>
            </div>
        `;

        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">y = ${axSquared} ${bx >= 0 ? '+' : ''} ${bx} ${c >= 0 ? '+' : ''} ${c}</span>
            </div>
        `;

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
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.theory-card, .example-card, .formula-card').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // INITIALIZE
    // ============================================
    setTimeout(() => {
        resizeCanvas();
    }, 100);

    console.log('%c Fungsi Kuadrat - MathEdu ', 'background: linear-gradient(135deg, #00d4ff, #a855f7); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c Selamat belajar fungsi kuadrat! 📐', 'color: #00d4ff; font-size: 14px;');
});