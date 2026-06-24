// ============================================
// Statistika Dasar - Interactive JavaScript
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
    // DIAGRAM CANVAS
    // ============================================
    const canvas = document.getElementById('diagramCanvas');
    const ctx = canvas.getContext('2d');
    const inputData = document.getElementById('inputData');
    const inputLabels = document.getElementById('inputLabels');
    const diagramTitle = document.getElementById('diagramTitle');
    const canvasLegend = document.getElementById('canvasLegend');
    const infoCount = document.getElementById('infoCount');
    const infoTotal = document.getElementById('infoTotal');
    const infoMax = document.getElementById('infoMax');
    const infoMin = document.getElementById('infoMin');

    let currentTab = 'bar';
    let animationFrame = null;
    let animationProgress = 0;

    // Color palette for diagrams
    const colors = [
        '#00d4ff', '#a855f7', '#06b6d4', '#3b82f6',
        '#10b981', '#f59e0b', '#ec4899', '#ef4444',
        '#8b5cf6', '#14b8a6', '#f97316', '#0ea5e9'
    ];

    function resizeCanvas() {
        const wrapper = canvas.parentElement;
        canvas.width = wrapper.clientWidth - 60;
        canvas.height = 450;
        drawDiagram();
    }

    window.addEventListener('resize', resizeCanvas);

    // Parse input data
    function parseData() {
        const dataStr = inputData.value.trim();
        if (!dataStr) return [];
        
        return dataStr.split(',')
            .map(s => parseFloat(s.trim()))
            .filter(n => !isNaN(n));
    }

    function parseLabels(data) {
        const labelStr = inputLabels.value.trim();
        if (!labelStr) {
            return data.map((_, i) => `Data ${i + 1}`);
        }
        
        const labels = labelStr.split(',').map(s => s.trim());
        while (labels.length < data.length) {
            labels.push(`Data ${labels.length + 1}`);
        }
        return labels.slice(0, data.length);
    }

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;
            
            const titles = {
                'bar': 'Diagram Batang',
                'pie': 'Diagram Lingkaran',
                'line': 'Diagram Garis'
            };
            diagramTitle.textContent = titles[currentTab];
            
            drawDiagram();
        });
    });

    // Draw diagram based on current tab
    function drawDiagram() {
        const data = parseData();
        const labels = parseLabels(data);
        
        if (data.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
            ctx.font = 'bold 16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ Masukkan data yang valid', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Update info
        const total = data.reduce((a, b) => a + b, 0);
        const max = Math.max(...data);
        const min = Math.min(...data);
        
        infoCount.textContent = data.length;
        infoTotal.textContent = total.toFixed(2);
        infoMax.textContent = max.toFixed(2);
        infoMin.textContent = min.toFixed(2);

        // Update legend
        canvasLegend.innerHTML = labels.map((label, i) => `
            <div class="legend-item">
                <div class="legend-color" style="background: ${colors[i % colors.length]};"></div>
                <span>${label}</span>
            </div>
        `).join('');

        // Cancel previous animation
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        animationProgress = 0;

        const animate = () => {
            animationProgress += 0.03;
            if (animationProgress > 1) animationProgress = 1;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            switch (currentTab) {
                case 'bar':
                    drawBarChart(data, labels, animationProgress);
                    break;
                case 'pie':
                    drawPieChart(data, labels, animationProgress);
                    break;
                case 'line':
                    drawLineChart(data, labels, animationProgress);
                    break;
            }

            if (animationProgress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Draw Bar Chart
    function drawBarChart(data, labels, progress) {
        const width = canvas.width;
        const height = canvas.height;
        const padding = { top: 40, right: 40, bottom: 60, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const max = Math.max(...data);
        const barWidth = chartWidth / data.length * 0.7;
        const barGap = chartWidth / data.length * 0.3;

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            // Y-axis labels
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '11px Inter';
            ctx.textAlign = 'right';
            const value = max - (max / 5) * i;
            ctx.fillText(value.toFixed(1), padding.left - 10, y + 4);
        }

        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, height - padding.bottom);
        ctx.lineTo(width - padding.right, height - padding.bottom);
        ctx.stroke();

        // Draw bars
        data.forEach((value, i) => {
            const x = padding.left + (chartWidth / data.length) * i + barGap / 2;
            const barHeight = (value / max) * chartHeight * progress;
            const y = height - padding.bottom - barHeight;

            // Bar gradient
            const gradient = ctx.createLinearGradient(0, y, 0, height - padding.bottom);
            gradient.addColorStop(0, colors[i % colors.length]);
            gradient.addColorStop(1, colors[i % colors.length] + '80');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Bar glow
            ctx.shadowColor = colors[i % colors.length];
            ctx.shadowBlur = 10;
            ctx.fillRect(x, y, barWidth, barHeight);
            ctx.shadowBlur = 0;

            // Value on top
            if (progress > 0.8) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(value.toFixed(1), x + barWidth / 2, y - 8);
            }

            // X-axis label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], x + barWidth / 2, height - padding.bottom + 20);
        });
    }

    // Draw Pie Chart
    function drawPieChart(data, labels, progress) {
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2 - 100;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 80;

        const total = data.reduce((a, b) => a + b, 0);
        let currentAngle = -Math.PI / 2;

        data.forEach((value, i) => {
            const sliceAngle = (value / total) * Math.PI * 2 * progress;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();

            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, colors[i % colors.length]);
            gradient.addColorStop(1, colors[i % colors.length] + 'cc');
            ctx.fillStyle = gradient;
            ctx.fill();

            // Slice border
            ctx.strokeStyle = 'rgba(10, 22, 40, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Glow effect
            ctx.shadowColor = colors[i % colors.length];
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Label line and text
            if (progress > 0.8) {
                const midAngle = currentAngle + sliceAngle / 2;
                const labelRadius = radius + 20;
                const labelX = centerX + Math.cos(midAngle) * labelRadius;
                const labelY = centerY + Math.sin(midAngle) * labelRadius;
                const percentage = ((value / total) * 100).toFixed(1);

                // Line
                ctx.strokeStyle = colors[i % colors.length];
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius);
                ctx.lineTo(labelX, labelY);
                ctx.stroke();

                // Text
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = Math.cos(midAngle) > 0 ? 'left' : 'right';
                ctx.fillText(`${labels[i]}: ${percentage}%`, labelX + (Math.cos(midAngle) > 0 ? 5 : -5), labelY);
            }

            currentAngle += sliceAngle;
        });

        // Draw legend on the right
        if (progress > 0.8) {
            const legendX = width - 200;
            let legendY = 50;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'left';
            ctx.fillText('Legenda:', legendX, legendY);
            legendY += 25;

            data.forEach((value, i) => {
                const percentage = ((value / total) * 100).toFixed(1);
                
                // Color box
                ctx.fillStyle = colors[i % colors.length];
                ctx.fillRect(legendX, legendY - 10, 12, 12);

                // Text
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '11px Inter';
                ctx.fillText(`${labels[i]}: ${value} (${percentage}%)`, legendX + 20, legendY);
                legendY += 22;
            });
        }
    }

    // Draw Line Chart
    function drawLineChart(data, labels, progress) {
        const width = canvas.width;
        const height = canvas.height;
        const padding = { top: 40, right: 40, bottom: 60, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            // Y-axis labels
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '11px Inter';
            ctx.textAlign = 'right';
            const value = max - (range / 5) * i;
            ctx.fillText(value.toFixed(1), padding.left - 10, y + 4);
        }

        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, height - padding.bottom);
        ctx.lineTo(width - padding.right, height - padding.bottom);
        ctx.stroke();

        // Calculate points
        const points = data.map((value, i) => {
            const x = padding.left + (chartWidth / (data.length - 1 || 1)) * i;
            const y = padding.top + chartHeight - ((value - min) / range) * chartHeight;
            return { x, y, value };
        });

        // Draw area fill
        const areaGradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        areaGradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
        areaGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');

        ctx.fillStyle = areaGradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, height - padding.bottom);
        
        const drawCount = Math.floor(points.length * progress);
        for (let i = 0; i <= drawCount && i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        if (drawCount < points.length) {
            ctx.lineTo(points[drawCount].x, height - padding.bottom);
        } else {
            ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
        }
        ctx.closePath();
        ctx.fill();

        // Draw line
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        
        for (let i = 0; i <= drawCount && i < points.length; i++) {
            if (i === 0) {
                ctx.moveTo(points[i].x, points[i].y);
            } else {
                ctx.lineTo(points[i].x, points[i].y);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw points and labels
        for (let i = 0; i <= drawCount && i < points.length; i++) {
            const point = points[i];
            
            // Outer glow
            ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            ctx.fill();

            // Point
            ctx.fillStyle = '#00d4ff';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Inner white
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fill();

            // Value label
            if (progress > 0.8) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(point.value.toFixed(1), point.x, point.y - 15);
            }

            // X-axis label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], point.x, height - padding.bottom + 20);
        }
    }

    // Button handlers
    document.getElementById('btnDraw').addEventListener('click', () => {
        drawDiagram();
        const btn = document.getElementById('btnDraw');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    });

    document.getElementById('btnReset').addEventListener('click', () => {
        inputData.value = '5, 8, 12, 7, 9, 15, 10';
        inputLabels.value = 'Sen, Sel, Rab, Kam, Jum, Sab, Min';
        drawDiagram();
    });

    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            inputData.value = btn.dataset.data;
            inputLabels.value = btn.dataset.labels;
            drawDiagram();
        });
    });

    // ============================================
    // SOLVER SECTION - Mean, Median, Mode
    // ============================================
    const solverData = document.getElementById('solverData');
    const btnCalculate = document.getElementById('btnCalculate');
    const solverSteps = document.getElementById('solverSteps');
    const resultMean = document.getElementById('resultMean');
    const resultMedian = document.getElementById('resultMedian');
    const resultMode = document.getElementById('resultMode');

    btnCalculate.addEventListener('click', calculateStatistics);
    solverData.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateStatistics();
    });

    function calculateStatistics() {
        const dataStr = solverData.value.trim();
        if (!dataStr) {
            alert('Masukkan data terlebih dahulu!');
            return;
        }

        const data = dataStr.split(',')
            .map(s => parseFloat(s.trim()))
            .filter(n => !isNaN(n));

        if (data.length === 0) {
            alert('Data tidak valid!');
            return;
        }

        // Sort data
        const sorted = [...data].sort((a, b) => a - b);
        const n = data.length;
        const sum = data.reduce((a, b) => a + b, 0);

        // Calculate Mean
        const mean = sum / n;

        // Calculate Median
        let median;
        if (n % 2 === 1) {
            median = sorted[Math.floor(n / 2)];
        } else {
            median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        }

        // Calculate Mode
        const frequency = {};
        data.forEach(val => {
            frequency[val] = (frequency[val] || 0) + 1;
        });
        const maxFreq = Math.max(...Object.values(frequency));
        const modes = Object.keys(frequency)
            .filter(key => frequency[key] === maxFreq)
            .map(key => parseFloat(key));

        // Generate steps
        let stepsHTML = '';
        let stepNum = 1;

        // Step 1: Show data
        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">Data yang diberikan: <strong>${data.join(', ')}</strong></span>
            </div>
        `;

        // Step 2: Sort data
        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">Urutkan data: <strong>${sorted.join(', ')}</strong></span>
            </div>
        `;

        // Step 3: Count
        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">Banyak data (n) = <strong>${n}</strong></span>
            </div>
        `;

        // Step 4: Sum for mean
        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content">Jumlah data (Σx) = ${data.join(' + ')} = <strong>${sum.toFixed(2)}</strong></span>
            </div>
        `;

        // Step 5: Mean calculation
        stepsHTML += `
            <div class="solver-step">
                <span class="step-number">${stepNum++}</span>
                <span class="step-content"><strong>Mean</strong> = Σx / n = ${sum.toFixed(2)} / ${n} = <strong>${mean.toFixed(2)}</strong></span>
            </div>
        `;

        // Step 6: Median calculation
        if (n % 2 === 1) {
            const medianPos = Math.floor(n / 2) + 1;
            stepsHTML += `
                <div class="solver-step">
                    <span class="step-number">${stepNum++}</span>
                    <span class="step-content"><strong>Median</strong>: n = ${n} (ganjil), data ke-${medianPos} = <strong>${median}</strong></span>
                </div>
            `;
        } else {
            const pos1 = n / 2;
            const pos2 = n / 2 + 1;
            stepsHTML += `
                <div class="solver-step">
                    <span class="step-number">${stepNum++}</span>
                    <span class="step-content"><strong>Median</strong>: n = ${n} (genap), rata-rata data ke-${pos1} dan ke-${pos2}</span>
                </div>
            `;
            stepsHTML += `
                <div class="solver-step">
                    <span class="step-number">${stepNum++}</span>
                    <span class="step-content">Median = (${sorted[pos1 - 1]} + ${sorted[pos2 - 1]}) / 2 = <strong>${median}</strong></span>
                </div>
            `;
        }

        // Step 7: Mode calculation
        if (maxFreq === 1) {
            stepsHTML += `
                <div class="solver-step">
                    <span class="step-number">${stepNum++}</span>
                    <span class="step-content"><strong>Modus</strong>: Semua data muncul 1x, <strong>tidak ada modus</strong></span>
                </div>
            `;
        } else {
            stepsHTML += `
                <div class="solver-step">
                    <span class="step-number">${stepNum++}</span>
                    <span class="step-content"><strong>Modus</strong>: Data yang paling sering muncul (frekuensi = ${maxFreq})</span>
                </div>
            `;
            stepsHTML += `
                <div class="solver-step">
                    <span class="step-number">${stepNum++}</span>
                    <span class="step-content">Modus = <strong>${modes.join(', ')}</strong></span>
                </div>
            `;
        }

        solverSteps.innerHTML = stepsHTML;

        // Update results
        resultMean.textContent = mean.toFixed(2);
        resultMedian.textContent = median;
        resultMode.textContent = maxFreq === 1 ? 'Tidak ada' : modes.join(', ');
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

    console.log('%c Statistika Dasar - MathEdu ', 'background: linear-gradient(135deg, #00d4ff, #a855f7); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c Selamat belajar statistika! 📊', 'color: #00d4ff; font-size: 14px;');
});