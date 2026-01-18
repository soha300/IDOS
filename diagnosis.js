document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const preloader = document.getElementById("preloader");
    const navToggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const pages = document.querySelectorAll(".page");

    const symptomForm = document.getElementById("symptomForm");
    const symptomInput = document.getElementById("symptomInput");
    const addSymptomBtn = document.getElementById("addSymptomBtn");
    const selectedSymptomsContainer = document.getElementById("selectedSymptoms");
    const suggestionChips = document.getElementById("suggestionChips");
    const clearSymptomsBtn = document.getElementById("clearSymptomsBtn");
    const resultsContainer = document.getElementById("diagnosisResults");
    const historyList = document.getElementById("historyList");

    let diseases = [];
    const selectedSymptoms = new Set();

    const hideLoader = () => {
        body.classList.remove("loading");
        preloader?.classList.add("preloader--hidden");
        pages.forEach((page) => page.classList.add("is-visible"));
    };

    window.addEventListener("load", () => {
        setTimeout(hideLoader, 450);
    });

    // في حال تعليق حدث load (مثلاً بسبب fetch) نضمن إخفاء الـ Loader بعد 3 ثوانٍ
    setTimeout(hideLoader, 3000);

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            const expanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!expanded));
            mobileMenu.hidden = expanded;
        });
    }

    mobileMenu?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navToggle?.setAttribute("aria-expanded", "false");
            mobileMenu.hidden = true;
        });
    });

    const loadDiseases = async () => {
        try {
            const response = await fetch("diseases.json");
            if (!response.ok) throw new Error("تعذر تحميل قاعدة البيانات");
            diseases = await response.json();
            renderSuggestions();
        } catch (error) {
            console.error(error);
            suggestionChips.innerHTML = `<span class="muted">حدث خطأ في تحميل البيانات. يرجى تشغيل الموقع عبر خادم محلي وإعادة المحاولة.</span>`;
        } finally {
            hideLoader();
        }
    };

    const getAllSymptoms = () => {
        const set = new Set();
        diseases.forEach((disease) => {
            disease.symptoms.forEach((symptom) => set.add(symptom));
        });
        return Array.from(set);
    };

    const renderSuggestions = () => {
        const all = getAllSymptoms().sort((a, b) => a.localeCompare(b, "ar"));
        suggestionChips.innerHTML = "";
        all.slice(0, 24).forEach((symptom) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip chip--light";
            chip.textContent = symptom;
            chip.addEventListener("click", () => addSymptom(symptom));
            suggestionChips.appendChild(chip);
        });
    };

    const renderSelectedSymptoms = () => {
        selectedSymptomsContainer.innerHTML = "";
        if (!selectedSymptoms.size) {
            const p = document.createElement("p");
            p.className = "muted";
            p.textContent = "لم يتم إضافة أعراض بعد.";
            selectedSymptomsContainer.appendChild(p);
            return;
        }
        selectedSymptoms.forEach((symptom) => {
            const chip = document.createElement("div");
            chip.className = "chip";
            chip.innerHTML = `
                <span>${symptom}</span>
                <button type="button" aria-label="إزالة ${symptom}">×</button>
            `;
            chip.querySelector("button").addEventListener("click", () => {
                selectedSymptoms.delete(symptom);
                renderSelectedSymptoms();
            });
            selectedSymptomsContainer.appendChild(chip);
        });
    };

    const addSymptom = (symptom) => {
        const clean = symptom.trim();
        if (!clean) return;
        if (selectedSymptoms.has(clean)) {
            symptomInput.value = "";
            return;
        }
        selectedSymptoms.add(clean);
        renderSelectedSymptoms();
        symptomInput.value = "";
        symptomInput.focus();
    };

    addSymptomBtn?.addEventListener("click", () => {
        addSymptom(symptomInput.value);
    });

    symptomInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addSymptom(symptomInput.value);
        }
    });

    clearSymptomsBtn?.addEventListener("click", () => {
        selectedSymptoms.clear();
        renderSelectedSymptoms();
        resultsContainer.innerHTML = `
            <div class="placeholder-card">
                <span>🔍</span>
                <p>قم بإدخال الأعراض ثم اضغط على "تشغيل التحليل الذكي" لعرض النتائج هنا.</p>
            </div>
        `;
    });

    const matchDiseases = () => {
        if (!selectedSymptoms.size) {
            return [];
        }
        const selectedLower = Array.from(selectedSymptoms).map((sym) => sym.toLowerCase());
        const departmentOverride = departmentSelect?.value;

        const matches = diseases
            .map((disease) => {
                const diseaseSymptomsLower = disease.symptoms.map((sym) => sym.toLowerCase());
                const matched = selectedLower.filter((sym) =>
                    diseaseSymptomsLower.some((ds) => ds.includes(sym))
                );
                return {
                    disease,
                    matchedSymptoms: matched,
                    score: matched.length / disease.symptoms.length,
                    department: departmentOverride || disease.department
                };
            })
            .filter((entry) => entry.matchedSymptoms.length > 0)
            .sort((a, b) => b.score - a.score);

        return matches.slice(0, 3);
    };

    const renderResults = (results) => {
        resultsContainer.innerHTML = "";
        if (!results.length) {
            resultsContainer.innerHTML = `
                <div class="placeholder-card">
                    <span>ℹ️</span>
                    <p>لم نجد تطابقًا مباشرًا. ننصح بالتواصل مع طبيب مختص لمزيد من الفحوصات.</p>
                </div>
            `;
            return;
        }

        results.forEach((result) => {
            const card = document.createElement("article");
            card.className = "result-card";
            card.innerHTML = `
                <div class="result-card__header">
                    <span class="result-card__icon">🩺</span>
                    <div>
                        <h3>${result.disease.name}</h3>
                        <span class="result-card__match">نسبة التطابق: ${(result.score * 100).toFixed(0)}%</span>
                    </div>
                </div>
                <p>${result.disease.advice}</p>
                <div>
                    <span class="result-card__department">القسم المقترح: ${result.department}</span>
                </div>
                <div>
                    <strong>الأعراض المتطابقة:</strong>
                    <ul>
                        ${result.matchedSymptoms.map((sym) => `<li>${sym}</li>`).join("")}
                    </ul>
                </div>
                <div class="result-card__footer">
                    هذه النتائج استرشادية وليست تشخيصًا نهائيًا. يرجى زيارة الطبيب المختص عند الضرورة.
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    };

    const HISTORY_KEY = "diagnosisHistory";

    const saveHistory = (entry) => {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        history.unshift(entry);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 6)));
    };

    const renderHistory = () => {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        historyList.innerHTML = "";
        if (!history.length) {
            historyList.innerHTML = `
                <div class="placeholder-card">
                    <span>🗂️</span>
                    <p>لا يوجد سجل بعد. سيتم حفظ النتائج الأخيرة تلقائيًا.</p>
                </div>
            `;
            return;
        }
        history.forEach((item) => {
            const card = document.createElement("article");
            card.className = "history-card";
            card.innerHTML = `
                <h4>${item.disease}</h4>
                <span class="muted">${item.timestamp}</span>
                <div><strong>القسم:</strong> ${item.department}</div>
                <ul>
                    ${item.symptoms.map((sym) => `<li>${sym}</li>`).join("")}
                </ul>
                <p>${item.advice}</p>
            `;
            historyList.appendChild(card);
        });
    };

    // ⭐ دالة جديدة للتمرير إلى قسم النتائج
    function scrollToResults() {
        setTimeout(() => {
            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection) {
                const yOffset = -80; // تعويض للهيدر الثابت
                const y = resultsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    symptomForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!selectedSymptoms.size) {
            renderResults([]);
            // التمرير حتى مع عدم وجود نتائج
            scrollToResults();
            return;
        }
        const matches = matchDiseases();
        renderResults(matches);

        if (matches.length) {
            const top = matches[0];
            const entry = {
                disease: top.disease.name,
                department: top.department,
                symptoms: Array.from(selectedSymptoms),
                advice: top.disease.advice,
                timestamp: new Date().toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" })
            };
            saveHistory(entry);
            renderHistory();
        }

        // ⭐ التمرير إلى النتائج بعد عرضها
        scrollToResults();
    });

    // تشغيل البداية
    loadDiseases().then(renderHistory);
});