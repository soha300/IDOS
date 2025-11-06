// enhancements.js - تحسينات إضافية للتطبيق

// نظام الإشعارات المحسن
class EnhancedNotifications {
  static show({ title, message, type = 'info', duration = 5000, actions = [] }) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `enhanced-notification notification--${type}`;
    
    // بناء HTML للإشعار
    let actionsHTML = '';
    if (actions && actions.length > 0) {
      actionsHTML = `
        <div class="notification-actions">
          ${actions.map(action => {
            // استخدام addEventListener بدلاً من onclick لأمان أفضل
            const actionId = 'action_' + Math.random().toString(36).substr(2, 9);
            return `
              <button class="btn btn-small ${action.primary ? 'btn-primary' : 'btn-ghost'}" 
                      id="${actionId}">
                ${this.escapeHtml(action.text)}
              </button>
            `;
          }).join('')}
        </div>
      `;
    }

    notification.innerHTML = `
      <div class="notification-header">
        <span class="notification-icon">${this.getIcon(type)}</span>
        <strong class="notification-title">${this.escapeHtml(title)}</strong>
        <button class="notification-close" aria-label="إغلاق الإشعار">×</button>
      </div>
      <div class="notification-body">${this.escapeHtml(message)}</div>
      ${actionsHTML}
    `;

    // تطبيق الأنماط
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      left: '20px',
      right: '20px',
      maxWidth: '400px',
      background: 'white',
      borderRadius: 'var(--radius-md, 8px)',
      boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
      zIndex: '10000',
      animation: 'slideInRight 0.3s ease',
      borderRight: `4px solid ${this.getColor(type)}`,
      padding: '16px',
      fontFamily: 'Cairo, sans-serif'
    });

    // إضافة إلى DOM
    document.body.appendChild(notification);

    // إعداد معالجات الأحداث
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.removeNotification(notification);
      });
    }

    // إعداد أزرار الإجراءات
    if (actions && actions.length > 0) {
      actions.forEach((action, index) => {
        const actionBtn = notification.querySelector(`#action_${action.id || index}`);
        if (actionBtn && action.handler) {
          actionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            action.handler();
            this.removeNotification(notification);
          });
        }
      });
    }

    // إغلاق تلقائي
    let timeoutId;
    if (duration > 0) {
      timeoutId = setTimeout(() => {
        this.removeNotification(notification);
      }, duration);
    }

    // تخزين معرف الوقت للإشارة إليه لاحقاً
    notification._timeoutId = timeoutId;

    return {
      element: notification,
      remove: () => this.removeNotification(notification)
    };
  }

  static removeNotification(notification) {
    if (notification._timeoutId) {
      clearTimeout(notification._timeoutId);
    }
    
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }

  static getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: '💡'
    };
    return icons[type] || icons.info;
  }

  static getColor(type) {
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f97316',
      info: '#3b82f6'
    };
    return colors[type] || colors.info;
  }

  static escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// نظام التحميل المحسن
class ProgressiveLoader {
  static async loadCriticalCSS() {
    // فقط إذا لم تكن الأنماط الحرجة مضغوطة مسبقاً
    if (document.querySelector('#critical-css')) return;

    const criticalCSS = `
      /* أنماط الحرجة للتطبيق */
      .loading-skeleton { 
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 4px;
      }
      
      .main-content { 
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .main-content.loaded {
        opacity: 1;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  static async lazyLoadComponents() {
    const components = [
      { selector: '.user-profile', component: 'user-profile' },
      { selector: '.diagnosis-history', component: 'diagnosis-history' },
      { selector: '.chat-interface', component: 'chat-interface' }
    ];

    for (const { selector, component } of components) {
      const element = document.querySelector(selector);
      if (element) {
        try {
          await this.loadComponent(component, element);
        } catch (error) {
          console.warn(`فشل تحميل المكون ${component}:`, error);
        }
      }
    }
  }

  static async loadComponent(componentName, container) {
    // محاكاة تحميل المكون
    return new Promise((resolve) => {
      setTimeout(() => {
        if (container) {
          container.innerHTML = `<div>تم تحميل ${componentName}</div>`;
          container.classList.add('component-loaded');
        }
        resolve();
      }, 500);
    });
  }

  static initPreload() {
    // تحميل مسبق للموارد المهمة
    const preloadLinks = [
      { href: 'styles.css', as: 'style' },
      { href: 'app.js', as: 'script' }
    ];

    // إضافة خطوط Google Fonts إذا لم تكن موجودة
    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
      preloadLinks.push({
        href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap',
        as: 'style'
      });
    }

    preloadLinks.forEach(link => {
      // التحقق من عدم وجود الرابط مسبقاً
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        const preload = document.createElement('link');
        preload.rel = link.as === 'style' ? 'preload' : 'preload';
        preload.href = link.href;
        preload.as = link.as;
        if (link.as === 'style') {
          preload.onload = () => {
            const fullLink = document.createElement('link');
            fullLink.rel = 'stylesheet';
            fullLink.href = link.href;
            document.head.appendChild(fullLink);
          };
        }
        document.head.appendChild(preload);
      }
    });
  }

  static markContentLoaded() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.add('loaded');
    }
    
    // إزالة هيكل التحميل
    const skeletons = document.querySelectorAll('.loading-skeleton');
    skeletons.forEach(skeleton => {
      skeleton.style.display = 'none';
    });
  }
}

// نظام التحسين للشبكة
class NetworkOptimizer {
  static async enableCompression() {
    // التحقق من دعم Network Information API
    if ('connection' in navigator && navigator.connection) {
      const connection = navigator.connection;
      
      if (connection.saveData) {
        this.applyDataSavingMode();
      }
      
      if (connection.effectiveType) {
        if (connection.effectiveType.includes('2g') || connection.effectiveType.includes('3g')) {
          this.applyLowBandwidthMode();
        }
      }

      // مراقبة تغييرات الشبكة
      connection.addEventListener('change', () => {
        this.handleNetworkChange(connection);
      });
    }
  }

  static handleNetworkChange(connection) {
    if (connection.effectiveType) {
      if (connection.effectiveType.includes('2g') || connection.effectiveType.includes('3g')) {
        this.applyLowBandwidthMode();
      } else {
        this.removeLowBandwidthMode();
      }
    }
    
    if (connection.saveData) {
      this.applyDataSavingMode();
    } else {
      this.removeDataSavingMode();
    }
  }

  static applyDataSavingMode() {
    // تعطيل الصور غير الضرورية
    document.querySelectorAll('img[data-save-data]').forEach(img => {
      const lowResSrc = img.getAttribute('data-low-res');
      if (lowResSrc && img.src !== lowResSrc) {
        img.src = lowResSrc;
      }
    });
    
    // إضافة صنف لتطبيق أنماط توفير البيانات
    document.documentElement.classList.add('data-saving-mode');
    
    // تعطيل بعض الميزات غير الضرورية
    if (window.appManager) {
      window.appManager.lowBandwidth = true;
    }
  }

  static removeDataSavingMode() {
    document.documentElement.classList.remove('data-saving-mode');
    if (window.appManager) {
      window.appManager.lowBandwidth = false;
    }
  }

  static applyLowBandwidthMode() {
    // إضافة صنف لوضعية النطاق الترددي المنخفض
    document.documentElement.classList.add('low-bandwidth-mode');
    
    // تعطيل الحركات المعقدة
    const style = document.createElement('style');
    style.id = 'low-bandwidth-styles';
    style.textContent = `
      .low-bandwidth-mode * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
    
    // تقليل حجم البيانات المرسلة
    if (window.appManager) {
      window.appManager.lowBandwidth = true;
    }
  }

  static removeLowBandwidthMode() {
    document.documentElement.classList.remove('low-bandwidth-mode');
    const styles = document.getElementById('low-bandwidth-styles');
    if (styles) {
      styles.remove();
    }
    if (window.appManager) {
      window.appManager.lowBandwidth = false;
    }
  }
}

// نظام مراقبة الأداء
class PerformanceMonitor {
  static init() {
    if (!('performance' in window)) return;

    // تتبع سرعة تحميل الصفحة
    window.addEventListener('load', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      if (navigationTiming) {
        const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
        this.trackMetric('PageLoad', loadTime);
      }
    });

    // تتبع Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            const lcp = lastEntry.renderTime || lastEntry.loadTime;
            this.trackMetric('LCP', lcp);
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP observation not supported');
      }

      // تتبع First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const fid = entry.processingStart - entry.startTime;
            this.trackMetric('FID', fid);
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.warn('FID observation not supported');
      }

      // تتبع Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          this.trackMetric('CLS', clsValue);
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('CLS observation not supported');
      }
    }
  }

  static trackMetric(metricName, value) {
    // إرسال البيانات إلى نظام التحليلات
    if (window.AnalyticsManager) {
      window.AnalyticsManager.trackEvent('Performance', metricName, `${Math.round(value)}ms`);
    }
    
    // تخزين محلي للإحصائيات
    const stats = JSON.parse(localStorage.getItem('performance_stats') || '{}');
    stats[metricName] = stats[metricName] || [];
    stats[metricName].push({
      value: Math.round(value),
      timestamp: new Date().toISOString()
    });
    
    // حفظ آخر 100 قياس فقط
    if (stats[metricName].length > 100) {
      stats[metricName] = stats[metricName].slice(-100);
    }
    
    try {
      localStorage.setItem('performance_stats', JSON.stringify(stats));
    } catch (e) {
      console.warn('Cannot save performance stats');
    }
  }

  static getPerformanceStats() {
    try {
      return JSON.parse(localStorage.getItem('performance_stats') || '{}');
    } catch (e) {
      return {};
    }
  }
}

// تهيئة كل التحسينات
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // تحميل الأنماط الحرجة أولاً
    await ProgressiveLoader.loadCriticalCSS();
    
    // تهيئة تحسينات الشبكة
    await NetworkOptimizer.enableCompression();
    
    // تحميل المكونات بشكل كسول بعد تحميل الصفحة الرئيسي
    if (document.readyState === 'complete') {
      ProgressiveLoader.lazyLoadComponents();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          ProgressiveLoader.lazyLoadComponents();
          ProgressiveLoader.markContentLoaded();
        }, 100);
      });
    }
    
    // تهيئة مراقبة الأداء
    PerformanceMonitor.init();
    
  } catch (error) {
    console.error('خطأ في تهيئة التحسينات:', error);
  }
});

// تهيئة إضافية بعد تحميل الصفحة بالكامل
window.addEventListener('load', () => {
  // تحميل مسبق للموارد
  ProgressiveLoader.initPreload();
  
  // إخفاء شاشة التحميل إذا كانت موجودة
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
});

// إضافة أنماط CSS للحركات إذا لم تكن موجودة
if (!document.querySelector('#notification-animations')) {
  const style = document.createElement('style');
  style.id = 'notification-animations';
  style.textContent = `
    @keyframes slideInRight {
      from { 
        transform: translateX(-100%); 
        opacity: 0; 
      }
      to { 
        transform: translateX(0); 
        opacity: 1; 
      }
    }
    
    @keyframes slideOutRight {
      from { 
        transform: translateX(0); 
        opacity: 1; 
      }
      to { 
        transform: translateX(-100%); 
        opacity: 0; 
      }
    }
    
    .data-saving-mode img:not([data-essential]) {
      opacity: 0.7;
      filter: blur(1px);
    }
    
    .low-bandwidth-mode video,
    .low-bandwidth-mode iframe {
      display: none;
    }
  `;
  document.head.appendChild(style);
}

// تصدير الوظائف للاستخدام العالمي
window.EnhancedNotifications = EnhancedNotifications;
window.ProgressiveLoader = ProgressiveLoader;
window.NetworkOptimizer = NetworkOptimizer;
window.PerformanceMonitor = PerformanceMonitor;

// تصدير للبيئات module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EnhancedNotifications,
    ProgressiveLoader,
    NetworkOptimizer,
    PerformanceMonitor
  };
}