// تحديث الـ aiResponses لتصبح أكثر شمولية
const aiResponses = [
    {
        triggers: ["صداع", "وجع راس", "ألم راس", "مخي بيوجعني"],
        reply: "الصداع قد يكون بسبب الإرهاق، الجفاف، التوتر، أو مشاكل في النظر. جرب شرب الماء، أخذ قسط من الراحة، وتجنب الشاشات. إذا استمر أو كان شديدًا، راجع طبيب الأعصاب."
    },
    {
        triggers: ["كحة", "سعال", "كحه", "تعب تنفس", "ضيق نفس"],
        reply: "السعال المستمر يحتاج مراقبة. إذا صاحبه بلغم أو حرارة، قد يكون التهاب رئوي. تجنب المهيجات وراجع طبيب الصدر إذا استمر أكثر من أسبوع."
    },
    {
        triggers: ["حمى", "حرارة", "سخونة", "دفيان"],
        reply: "الحمى علامة دفاعية من الجسم. استخدم خافض حرارة، اشرب سوائل، وخذ قسطًا من الراحة. إذا تجاوزت 39° أو استمرت أكثر من 3 أيام، راجع الطبيب."
    },
    {
        triggers: ["معدة", "بطن", "مغص", "غثيان", "قيء"],
        reply: "آلام المعدة قد تكون بسبب عسر هضم أو تسمم غذائي. تجنب الأطعمة الدسمة واشرب كميات صغيرة من الماء. إذا استمر الألم أكثر من 6 ساعات، راجع الطبيب."
    },
    {
        triggers: ["دوخة", "دوار", "دوخان"],
        reply: "الدوخة قد تكون بسبب انخفاض الضغط، الجفاف، أو مشاكل في الأذن الداخلية. اجلس أو استلقِ فورًا، واشرب الماء. إذا تكررت، راجع الطبيب."
    }
];

// إضافة وظيفة جديدة لتحليل أكثر ذكاء
const getAdvancedAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // تحليل متعدد الكلمات المفتاحية
    const symptoms = {
        صداع: ["راس", "مخ", "رأس", "راسي"],
        كحة: ["سعال", "كح", "بلغم", "سعل"],
        حمى: ["حرارة", "سخونة", "دفيان", "سخن"],
        تعب: ["إرهاق", "خمول", "ضعف", "تعبان"],
        ألم: ["وجع", "مؤلم", "يتألم", "الام"]
    };
    
    let matchedSymptoms = [];
    
    for (const [symptom, keywords] of Object.entries(symptoms)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword)) || 
            lowerMessage.includes(symptom)) {
            matchedSymptoms.push(symptom);
        }
    }
    
    // ردود مخصصة بناء على مجموعة الأعراض
    if (matchedSymptoms.length >= 2) {
        if (matchedSymptoms.includes("حمى") && matchedSymptoms.includes("كحة")) {
            return "الأعراض تشير إلى عدوى تنفسية محتملة. الراحة وشرب السوائل الدافئة مهمة. إذا اشتدت الأعراض راجع الطبيب.";
        }
        if (matchedSymptoms.includes("صداع") && matchedSymptoms.includes("تعب")) {
            return "مزيج الصداع والتعب قد يشير إلى إرهاق أو جفاف. حاول أخذ قسط من الراحة وشرب الماء.";
        }
        if (matchedSymptoms.includes("معدة") && matchedSymptoms.includes("غثيان")) {
            return "آلام المعدة مع الغثيان قد تكون بسبب عسر هضم أو تسمم غذائي. تجنب الطعام لعدة ساعات ثم ابدأ بالسوائل الخفيفة.";
        }
    }
    
    // البحث في الردود العادية
    const matched = aiResponses.find((entry) =>
        entry.triggers.some((trigger) => lowerMessage.includes(trigger))
    );
    
    if (matched) return matched.reply;
    
    // رد ذكي افتراضي
    return `أفهم أنك تشعر بـ ${matchedSymptoms.length > 0 ? matchedSymptoms.join(' و') : 'بعض الأعراض'}. هل يمكنك وصف مزيد من التفاصيل مثل: منذ متى وهل هناك أعراض أخرى؟`;
};

// الدوال الرئيسية للدردشة
document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chatWindow");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const clearChatBtn = document.getElementById("clearChatBtn");

    // تحميل المحادثة من localStorage
    const loadChatHistory = () => {
        const savedChat = localStorage.getItem("chatHistory");
        if (savedChat && chatWindow) {
            chatWindow.innerHTML = savedChat;
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    };

    // حفظ المحادثة في localStorage
    const saveChatHistory = () => {
        if (chatWindow) {
            localStorage.setItem("chatHistory", chatWindow.innerHTML);
        }
    };

    // إضافة رسالة جديدة
    const addMessage = (message, isUser = false) => {
        if (!chatWindow) return;

        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${isUser ? 'chat-message--user' : 'chat-message--ai'}`;
        
        const time = new Date().toLocaleTimeString("ar-EG", { 
            hour: "numeric", 
            minute: "2-digit" 
        });

        messageDiv.innerHTML = `
            <div class="chat-avatar">${isUser ? '👤' : '🤖'}</div>
            <div class="chat-bubble">
                <span class="chat-name">${isUser ? 'أنت' : 'المساعد الذكي'}</span>
                <p>${message}</p>
                <time datetime="">${time}</time>
            </div>
        `;

        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        saveChatHistory();
    };

    // معالجة إرسال الرسالة
    chatForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;

        // إضافة رسالة المستخدم
        addMessage(message, true);
        chatInput.value = "";

        // محاكاة الكتابة
        const typingIndicator = document.createElement("div");
        typingIndicator.className = "chat-message chat-message--ai";
        typingIndicator.innerHTML = `
            <div class="chat-avatar">🤖</div>
            <div class="chat-bubble">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatWindow.appendChild(typingIndicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        // إجابة الذكاء الاصطناعي بعد تأخير
        setTimeout(() => {
            chatWindow.removeChild(typingIndicator);
            const aiResponse = getAdvancedAIResponse(message);
            addMessage(aiResponse, false);
        }, 1500);
    });

    // مسح المحادثة
    clearChatBtn?.addEventListener("click", () => {
        if (chatWindow && confirm("هل تريد مسح كل المحادثة؟")) {
            chatWindow.innerHTML = `
                <div class="chat-message chat-message--ai">
                    <div class="chat-avatar">🤖</div>
                    <div class="chat-bubble">
                        <span class="chat-name">المساعد الذكي</span>
                        <p>مرحبًا! أنا هنا لمساعدتك. أخبرني بما تشعر به لنبدأ.</p>
                        <time datetime="">الآن</time>
                    </div>
                </div>
            `;
            localStorage.removeItem("chatHistory");
        }
    });

    // تحميل سجل المحادثة عند البدء
    loadChatHistory();
});