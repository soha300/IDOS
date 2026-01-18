document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const preloader = document.getElementById("preloader");
    const navToggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const pages = document.querySelectorAll(".page");

    const chatWindow = document.getElementById("chatWindow");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const clearChatBtn = document.getElementById("clearChatBtn");

    const STORAGE_KEY = "aiChatHistory";

    window.addEventListener("load", () => {
        setTimeout(() => {
            body.classList.remove("loading");
            preloader?.classList.add("preloader--hidden");
            pages.forEach((page) => page.classList.add("is-visible"));
        }, 450);
    });

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

    const aiResponses = [
        {
            triggers: ["صداع", "وجع راس", "ألم راس"],
            reply: "قد يكون الصداع مرتبطًا بالإرهاق أو الجفاف أو ضعف النظر. هل تشعر بارتفاع في الحرارة أو دوخة؟"
        },
        {
            triggers: ["كحة", "سعال", "كحه", "تعب تنفس", "ضيق"],
            reply: "السعال المستمر قد يشير إلى التهاب تنفسي أو حساسية. راقب الأعراض، وإذا صاحبها ضيق تنفس أو حرارة مرتفعة قم بمراجعة طبيب الصدر."
        },
        {
            triggers: ["حمى", "حرارة", "سخونة"],
            reply: "الحمى علامة على وجود عدوى. احرص على شرب السوائل وخذ قسطًا من الراحة. إذا استمرت أكثر من ٤٨ ساعة أو تجاوزت ٣٩° تواصل مع الطبيب."
        },
        {
            triggers: ["قلقان", "توتر", "مش بنام", "أرق", "قلق"],
            reply: "يبدو أنك تمر بتوتر نفسي. حاول ممارسة تمارين التنفس العميق قبل النوم وتجنب المنبهات. إن استمر الأرق، استشر أخصائي صحة نفسية."
        },
        {
            triggers: ["مغص", "بطن", "إسهال", "اسهال", "غثيان"],
            reply: "آلام البطن قد ترتبط بعسر الهضم أو عدوى بسيطة. تناول أطعمة خفيفة واشرب ماء بكثرة. إذا ظهر قيء أو استمر الألم، تواصل مع طبيب باطنة."
        },
        {
            triggers: ["ضغط", "ارتفاع الضغط"],
            reply: "ارتفاع الضغط يحتاج مراقبة دقيقة. تأكد من قياس الضغط أكثر من مرة وتجنب الملح. إذا كان الارتفاع مستمرًا راجع طبيب القلب أو الباطنة."
        }
    ];

    const fallbackResponses = [
        "أحتاج لمعلومات إضافية عن الأعراض التي تشعر بها. هل يمكنك التوضيح أكثر؟",
        "أخبرني منذ متى بدأت الأعراض وهل هناك أعراض مصاحبة أخرى؟",
        "أفهمك. تذكر أن النتائج هنا استرشادية ولا تغني عن زيارة الطبيب عند الحاجة."
    ];

    const appendMessage = (author, message) => {
        const wrapper = document.createElement("div");
        wrapper.className = `chat-message chat-message--${author}`;
        wrapper.innerHTML = `
            <div class="chat-avatar">${author === "user" ? "🙂" : "🤖"}</div>
            <div class="chat-bubble">
                <span class="chat-name">${author === "user" ? "أنت" : "المساعد الذكي"}</span>
                <p>${message}</p>
                <time>${new Date().toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" })}</time>
            </div>
        `;
        chatWindow.appendChild(wrapper);
        chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: "smooth" });
    };

    const showTypingIndicator = () => {
        const indicator = document.createElement("div");
        indicator.className = "chat-message chat-message--ai";
        indicator.id = "typingIndicator";
        indicator.innerHTML = `
            <div class="chat-avatar">🤖</div>
            <div class="chat-bubble">
                <span class="chat-name">المساعد الذكي</span>
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatWindow.appendChild(indicator);
        chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: "smooth" });
    };

    const removeTypingIndicator = () => {
        const indicator = document.getElementById("typingIndicator");
        if (indicator) {
            chatWindow.removeChild(indicator);
        }
    };

    const getAIResponse = (message) => {
        const lowerMessage = message.toLowerCase();
        const matched = aiResponses.find((entry) =>
            entry.triggers.some((trigger) => lowerMessage.includes(trigger))
        );
        if (matched) return matched.reply;
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    };

    const loadHistory = () => {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        stored.forEach(({ author, message, timestamp }) => {
            const wrapper = document.createElement("div");
            wrapper.className = `chat-message chat-message--${author}`;
            wrapper.innerHTML = `
                <div class="chat-avatar">${author === "user" ? "🙂" : "🤖"}</div>
                <div class="chat-bubble">
                    <span class="chat-name">${author === "user" ? "أنت" : "المساعد الذكي"}</span>
                    <p>${message}</p>
                    <time>${timestamp}</time>
                </div>
            `;
            chatWindow.appendChild(wrapper);
        });
        if (stored.length) {
            chatWindow.scrollTo({ top: chatWindow.scrollHeight });
        }
    };

    const saveMessage = (author, message) => {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        history.push({
            author,
            message,
            timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" })
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-40)));
    };

    chatForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;
        appendMessage("user", message);
        saveMessage("user", message);
        chatInput.value = "";
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const reply = getAIResponse(message);
            appendMessage("ai", reply);
            saveMessage("ai", reply);
        }, 700 + Math.random() * 600);
    });

    clearChatBtn?.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEY);
        chatWindow.innerHTML = "";
        appendMessage("ai", "تم مسح السجل السابق. أنا جاهز لمساعدتك من جديد!");
    });

    loadHistory();
});