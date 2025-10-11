// تحسين app.js - إضافة معالجة الأخطاء
document.addEventListener("DOMContentLoaded", () => {
    // التحقق من توفر العناصر قبل استخدامها
    const safeQuerySelector = (selector) => {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Element not found: ${selector}`, error);
            return null;
        }
    };

    // العناصر مع التحقق من وجودها
    const elements = {
        body: document.body,
        preloader: document.getElementById("preloader"),
        navToggle: safeQuerySelector(".nav-toggle"),
        mobileMenu: document.getElementById("mobileMenu"),
        updateVitalsBtn: document.getElementById("updateVitalsBtn"),
        fingerCheckBtn: document.getElementById("fingerCheckBtn"),
        fingerDialog: document.getElementById("fingerDialog"),
        closeFingerDialog: document.getElementById("closeFingerDialog"),
        fingerResult: document.getElementById("fingerResult"),
        contactForm: document.getElementById("contactForm"),
        contactFeedback: document.getElementById("contactFeedback"),
        timeline: document.getElementById("insightsTimeline"),
        bpValue: document.getElementById("bpValue"),
        bpStatus: document.getElementById("bpStatus"),
        glucoseValue: document.getElementById("glucoseValue"),
        glucoseStatus: document.getElementById("glucoseStatus"),
        pulseValue: document.getElementById("pulseValue"),
        pulseStatus: document.getElementById("pulseStatus")
    };

    // التأكد من أن القيم الافتراضية موجودة
    const ensureDefaultValues = () => {
        if (elements.bpValue && !elements.bpValue.textContent) {
            elements.bpValue.textContent = "120/80";
        }
        if (elements.glucoseValue && !elements.glucoseValue.textContent) {
            elements.glucoseValue.textContent = "98 mg/dL";
        }
        if (elements.pulseValue && !elements.pulseValue.textContent) {
            elements.pulseValue.textContent = "72 bpm";
        }
    };

    const hideLoader = () => {
        if (!elements.body.classList.contains("loading")) return;
        elements.body.classList.remove("loading");
        elements.preloader?.classList.add("preloader--hidden");
        document.querySelectorAll(".page").forEach((page) => page.classList.add("is-visible"));
        
        ensureDefaultValues();
    };

    window.addEventListener("load", () => {
        setTimeout(hideLoader, 450);
    });

    // في حال عدم وصول حدث load لأي سبب، نخفي الـ Loader بعد ثانيتين ونصف
    setTimeout(hideLoader, 2500);

    if (elements.navToggle) {
        elements.navToggle.addEventListener("click", () => {
            const expanded = elements.navToggle.getAttribute("aria-expanded") === "true";
            elements.navToggle.setAttribute("aria-expanded", String(!expanded));
            if (elements.mobileMenu) {
                elements.mobileMenu.hidden = expanded;
            }
        });
    }

    elements.mobileMenu?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            elements.navToggle?.setAttribute("aria-expanded", "false");
            if (elements.mobileMenu) {
                elements.mobileMenu.hidden = true;
            }
        });
    });

    // Vital signs logic
    const evaluateStatus = (value, type) => {
        switch (type) {
            case "bp": {
                const [systolic, diastolic] = value;
                if (systolic > 140 || diastolic > 90) return { text: "مرتفع", color: "#b91c1c", bg: "rgba(239, 68, 68, 0.18)" };
                if (systolic < 90 || diastolic < 60) return { text: "منخفض", color: "#0369a1", bg: "rgba(14, 165, 233, 0.18)" };
                return { text: "طبيعي", color: "#047857", bg: "rgba(34, 197, 94, 0.16)" };
            }
            case "glucose":
                if (value > 140) return { text: "مرتفع", color: "#b91c1c", bg: "rgba(239, 68, 68, 0.18)" };
                if (value < 70) return { text: "منخفض", color: "#0369a1", bg: "rgba(14, 165, 233, 0.18)" };
                return { text: "طبيعي", color: "#047857", bg: "rgba(34, 197, 94, 0.16)" };
            case "pulse":
                if (value > 100) return { text: "مرتفع", color: "#b91c1c", bg: "rgba(239, 68, 68, 0.18)" };
                if (value < 60) return { text: "منخفض", color: "#0369a1", bg: "rgba(14, 165, 233, 0.18)" };
                return { text: "طبيعي", color: "#047857", bg: "rgba(34, 197, 94, 0.16)" };
            default:
                return { text: "غير معروف", color: "#0f172a", bg: "rgba(148, 163, 184, 0.2)" };
        }
    };

    const setChipStatus = (chip, status) => {
        if (!chip) return;
        chip.textContent = status.text;
        chip.style.color = status.color;
        chip.style.backgroundColor = status.bg;
    };

    elements.updateVitalsBtn?.addEventListener("click", () => {
        const systolic = Math.floor(Math.random() * 40) + 100;
        const diastolic = Math.floor(Math.random() * 30) + 60;
        const glucose = Math.floor(Math.random() * 90) + 70;
        const pulse = Math.floor(Math.random() * 60) + 55;

        if (elements.bpValue) {
            elements.bpValue.textContent = `${systolic}/${diastolic}`;
        }
        setChipStatus(elements.bpStatus, evaluateStatus([systolic, diastolic], "bp"));

        if (elements.glucoseValue) {
            elements.glucoseValue.textContent = `${glucose} mg/dL`;
        }
        setChipStatus(elements.glucoseStatus, evaluateStatus(glucose, "glucose"));

        if (elements.pulseValue) {
            elements.pulseValue.textContent = `${pulse} bpm`;
        }
        setChipStatus(elements.pulseStatus, evaluateStatus(pulse, "pulse"));

        appendTimelineItem("تم تحديث المؤشرات الحيوية بنجاح.");
    });

    const appendTimelineItem = (text) => {
        if (!elements.timeline) return;
        if (elements.timeline.querySelector(".timeline__item") && elements.timeline.children.length === 1 && elements.timeline.firstElementChild.textContent.includes("سيتم عرض")) {
            elements.timeline.innerHTML = "";
        }
        const li = document.createElement("li");
        li.className = "timeline__item";
        li.textContent = `${text} (${new Date().toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" })})`;
        elements.timeline.prepend(li);
    };

    // Finger scan modal
    elements.fingerCheckBtn?.addEventListener("click", () => {
        if (elements.fingerResult) {
            elements.fingerResult.textContent = "جاري قراءة البيانات الحيوية...";
        }
        const fingerScan = elements.fingerDialog?.querySelector(".finger-scan");
        if (elements.fingerDialog) {
            elements.fingerDialog.showModal();
        }
        requestAnimationFrame(() => {
            fingerScan?.classList.add("finger-scan--active");
        });
        setTimeout(() => {
            if (elements.fingerResult) {
                elements.fingerResult.textContent = "تم تحليل معدل النبض والأكسجين. النتائج ضمن الحدود الطبيعية.";
            }
            appendTimelineItem("اكتمل فحص البصمة بنجاح.");
        }, 2400);
    });

    elements.closeFingerDialog?.addEventListener("click", () => {
        const fingerScan = elements.fingerDialog?.querySelector(".finger-scan");
        if (elements.fingerDialog) {
            elements.fingerDialog.close();
        }
        fingerScan?.classList.remove("finger-scan--active");
    });

    elements.fingerDialog?.addEventListener("close", () => {
        const fingerScan = elements.fingerDialog?.querySelector(".finger-scan");
        fingerScan?.classList.remove("finger-scan--active");
    });

    // Contact form
    elements.contactForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("contactName")?.value.trim();
        const email = document.getElementById("contactEmail")?.value.trim();
        const message = document.getElementById("contactMessage")?.value.trim();

        if (!name || !email || !message) {
            if (elements.contactFeedback) {
                elements.contactFeedback.hidden = false;
                elements.contactFeedback.textContent = "يرجى تعبئة جميع الحقول قبل الإرسال.";
                elements.contactFeedback.style.backgroundColor = "rgba(239, 68, 68, 0.12)";
                elements.contactFeedback.style.color = "#b91c1c";
            }
            return;
        }

        if (elements.contactFeedback) {
            elements.contactFeedback.hidden = false;
            elements.contactFeedback.textContent = `شكرًا لك يا ${name}! سنعود إليك عبر البريد ${email} خلال ٢٤ ساعة.`;
            elements.contactFeedback.style.backgroundColor = "rgba(59, 130, 246, 0.12)";
            elements.contactFeedback.style.color = "var(--color-primary-dark)";
        }
        elements.contactForm?.reset();
        appendTimelineItem("تم إرسال نموذج التواصل بنجاح.");
    });

    // Accordion
    document.querySelectorAll(".accordion-toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            const panel = document.getElementById(toggle.getAttribute("aria-controls"));
            if (panel) {
                panel.hidden = expanded;
            }
        });
    });

    // Restore timeline from storage if available
    const storedTimeline = JSON.parse(localStorage.getItem("timelineEntries") || "[]");
    if (storedTimeline.length && elements.timeline) {
        elements.timeline.innerHTML = "";
        storedTimeline.forEach((entry) => {
            const li = document.createElement("li");
            li.className = "timeline__item";
            li.textContent = entry;
            elements.timeline.appendChild(li);
        });
    }

    const saveTimeline = () => {
        if (!elements.timeline) return;
        const items = Array.from(elements.timeline.querySelectorAll(".timeline__item")).map((item) => item.textContent);
        localStorage.setItem("timelineEntries", JSON.stringify(items.slice(0, 6)));
    };

    const observer = new MutationObserver(saveTimeline);
    if (elements.timeline) {
        observer.observe(elements.timeline, { childList: true });
    }
});

// Google Maps callback
let map;
let userMarker;
let infoWindow;

window.initMap = function () {
    const mapContainer = document.getElementById("mapCanvas");
    const statusEl = document.getElementById("mapStatus");
    if (!mapContainer) return;

    const benha = { lat: 30.466141, lng: 31.184769 };
    map = new google.maps.Map(mapContainer, {
        center: benha,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });

    infoWindow = new google.maps.InfoWindow();

    const hospitals = [
        {
            name: "مستشفى بنها الجامعي",
            position: { lat: 30.466611, lng: 31.177723 },
            address: "شارع كورنيش النيل، بنها"
        },
        {
            name: "مستشفى بنها التعليمي",
            position: { lat: 30.470851, lng: 31.188932 },
            address: "شارع الجيش، بنها"
        },
        {
            name: "مستشفى الراعي الصالح",
            position: { lat: 30.460148, lng: 31.191663 },
            address: "شارع فريد ندي، بنها"
        },
        {
            name: "مركز بنها الطبي المتخصص",
            position: { lat: 30.472942, lng: 31.182431 },
            address: "ميدان الإشارة، بنها"
        }
    ];

    hospitals.forEach((hospital) => {
        const marker = new google.maps.Marker({
            position: hospital.position,
            map,
            title: hospital.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#7c3aed",
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: "#5b21b6"
            }
        });

        marker.addListener("click", () => {
            infoWindow.setContent(`
                <div style="text-align:right; min-width:200px;">
                    <strong>${hospital.name}</strong>
                    <p style="margin:6px 0;">${hospital.address}</p>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${hospital.position.lat},${hospital.position.lng}" target="_blank" rel="noopener">عرض الاتجاهات</a>
                </div>
            `);
            infoWindow.open(map, marker);
        });
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (!userMarker) {
                    userMarker = new google.maps.Marker({
                        position: userLocation,
                        map,
                        title: "موقعك الحالي",
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: "#22c55e",
                            fillOpacity: 0.9,
                            strokeWeight: 3,
                            strokeColor: "#15803d"
                        }
                    });
                } else {
                    userMarker.setPosition(userLocation);
                }
                map.panTo(userLocation);
                if (statusEl) {
                    statusEl.textContent = "تم تحديد موقعك الحالي. يمكنك استكشاف المستشفيات حولك.";
                }
            },
            (error) => {
                console.warn("خطأ في تحديد الموقع:", error);
                if (statusEl) {
                    statusEl.textContent = "تعذر تحديد موقعك. يمكنك السماح بالوصول إلى الموقع أو البحث يدويًا.";
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        if (statusEl) {
            statusEl.textContent = "المتصفح لا يدعم التتبع الجغرافي.";
        }
    }
};