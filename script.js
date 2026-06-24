// ============================================
// MathStat - Clean Version JavaScript (REVISED)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // Navigation Logic for CTA Button
    // ============================================
    const ctaButton = document.querySelector('.cta-button');

    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            // Mencegah kedipan instan agar log di console sempat terbaca
            e.preventDefault(); 
            console.log('Mulai Belajar clicked! Mengalihkan ke halaman utama...');
            
            // Mengambil link target (home.html) dari atribut href HTML
            const targetPage = ctaButton.getAttribute('href');
            
            // Berpindah halaman secara aman via JavaScript
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    }

    // ============================================
    // Animate Stats Bars on Load
    // ============================================
    const statFills = document.querySelectorAll('.stat-fill');

    const animateStats = () => {
        statFills.forEach((fill, index) => {
            const targetWidth = fill.style.width;
            fill.style.width = '0';

            setTimeout(() => {
                fill.style.transition = 'width 1s ease';
                fill.style.width = targetWidth;
            }, 500 + index * 200);
        });
    };

    // Trigger animation
    setTimeout(animateStats, 800);

    // ============================================
    // Bar Chart Hover Effect
    // ============================================
    const bars = document.querySelectorAll('.bar');

    bars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.2)';
        });

        bar.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });

    // ============================================
    // Feature Items Hover Effect
    // ============================================
    const featureItems = document.querySelectorAll('.feature-item');

    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ============================================
    // Keyboard Navigation
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            console.log('Escape pressed');
        }
    });

    // ============================================
    // Performance: Reduce animations on low-end devices
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.math-symbol, .main-card, .pie-card, .equation-card, .icon-card, .bar').forEach(el => {
            el.style.animation = 'none';
        });
    }

    // ============================================
    // Console Welcome
    // ============================================
    console.log('%c MathStat ', 'background: linear-gradient(135deg, #00d4ff, #a855f7); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c Belajar Matematika & Statistika dengan Cara yang Lebih Menyenangkan! 🎓', 'color: #00d4ff; font-size: 14px;');
});