// وظائف إضافية للتطبيق
class MainApp {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.initMap();
            this.setupAnimations();
        });
    }

    initMap() {
        // تهيئة الخريطة (ستحتاج إلى مفتاح Google Maps API)
        const mapCanvas = document.getElementById('mapCanvas');
        const mapStatus = document.getElementById('mapStatus');
        
        if (!mapCanvas) return;

        // محاكاة تحميل الخريطة
        setTimeout(() => {
            mapStatus.textContent = 'تم تحميل الخريطة بنجاح';
            mapCanvas.innerHTML = `
                <div style="padding: 2rem; text-align: center; background: #f8fafc; border-radius: 12px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
                    <h3 style="margin: 0 0 1rem 0; color: var(--color-secondary);">خريطة المستشفيات</h3>
                    <p style="color: var(--color-muted); margin: 0;">لتفعيل الخريطة التفاعلية، يرجى إضافة مفتاح Google Maps API</p>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: var(--shadow-sm);">
                            <strong>مستشفى بنها العام</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: var(--color-muted);">2 كم - مفتوح 24/7</p>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: var(--shadow-sm);">
                            <strong>مستشفى الطوارئ</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: var(--color-muted);">3.5 كم - خدمة طوارئ</p>
                        </div>
                    </div>
                </div>
            `;
        }, 2000);
    }

    setupAnimations() {
        // إعداد Animations للعناصر
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // مراقبة العناصر لإضافة Animations
        document.querySelectorAll('.feature, .panel, .result-card').forEach(el => {
            observer.observe(el);
        });
    }
}

// تهيئة التطبيق الرئيسي
new MainApp();