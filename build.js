// سكريبت لتحسين الملفات قبل الرفع
const fs = require('fs');
const path = require('path');

class BuildOptimizer {
    static minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // إزالة التعليقات
            .replace(/\s+/g, ' ') // تقليل المسافات
            .replace(/;\s*/g, ';') // تقليل المسافات حول ;
            .replace(/:\s+/g, ':') // تقليل المسافات حول :
            .replace(/\s*\{\s*/g, '{') // تقليل المسافات حول {
            .replace(/\s*\}\s*/g, '}') // تقليل المسافات حول }
            .trim();
    }

    static optimizeHTML(html) {
        return html
            .replace(/\s+/g, ' ') // تقليل المسافات
            .replace(/>\s+</g, '><') // إزالة المسافات بين الوسوم
            .trim();
    }
}

// استخدام (يمكن تشغيله عبر Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuildOptimizer;
}