/**
 * Скрипт для управления куки-баннером и куки файлами
 */

// Функция для установки куки
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

// Функция для получения значения куки
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Функция для удаления куки
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Функции для управления баннером куки
function showCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        cookieBanner.classList.add('active');
    }
}

function hideCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        cookieBanner.classList.remove('active');
    }
}

// Отправка предпочтений на сервер
function saveCookiePreferencesToServer(preferences) {
    fetch('/save-cookie-preferences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
    })
    .then(response => {
        if (!response.ok) {
            console.error('Ошибка при сохранении предпочтений cookie');
        }
    })
    .catch(error => {
        console.error('Ошибка при отправке запроса:', error);
    });
}

// Принять все куки
function acceptAllCookies() {
    setCookie('cookie_essential', 'true', 365);
    setCookie('cookie_analytics', 'true', 365);
    setCookie('cookie_marketing', 'true', 365);
    setCookie('cookie_preferences_saved', 'true', 365);
    
    // Сохранить на сервере
    saveCookiePreferencesToServer({
        essential: true,
        analytics: true,
        marketing: true
    });
    
    hideCookieBanner();
    
    // Если на странице есть аналитика или маркетинговые скрипты, загрузить их
    loadAnalyticsScripts();
    loadMarketingScripts();
}

// Принять только необходимые куки
function acceptEssentialCookies() {
    setCookie('cookie_essential', 'true', 365);
    setCookie('cookie_analytics', 'false', 365);
    setCookie('cookie_marketing', 'false', 365);
    setCookie('cookie_preferences_saved', 'true', 365);
    
    // Сохранить на сервере
    saveCookiePreferencesToServer({
        essential: true,
        analytics: false,
        marketing: false
    });
    
    hideCookieBanner();
}

// Сохранить настройки куки
function saveCookiePreferences() {
    const analyticsCookies = document.getElementById('analytics-cookies').checked;
    const marketingCookies = document.getElementById('marketing-cookies').checked;
    
    setCookie('cookie_essential', 'true', 365);
    setCookie('cookie_analytics', analyticsCookies.toString(), 365);
    setCookie('cookie_marketing', marketingCookies.toString(), 365);
    setCookie('cookie_preferences_saved', 'true', 365);
    
    // Сохранить на сервере
    saveCookiePreferencesToServer({
        essential: true,
        analytics: analyticsCookies,
        marketing: marketingCookies
    });
    
    hideCookieBanner();
    
    // Загрузить скрипты на основе выбора
    if (analyticsCookies) loadAnalyticsScripts();
    if (marketingCookies) loadMarketingScripts();
}

// Показать настройки куки
function showCookieSettings() {
    const cookieBannerContent = document.querySelector('.cookie-banner-content');
    const cookieSettings = document.querySelector('.cookie-settings');
    
    if (cookieBannerContent && cookieSettings) {
        cookieBannerContent.style.display = 'none';
        cookieSettings.classList.add('active');
    }
}

// Скрыть настройки куки
function hideCookieSettings() {
    const cookieBannerContent = document.querySelector('.cookie-banner-content');
    const cookieSettings = document.querySelector('.cookie-settings');
    
    if (cookieBannerContent && cookieSettings) {
        cookieBannerContent.style.display = 'block';
        cookieSettings.classList.remove('active');
    }
}

// Загрузка аналитических скриптов
function loadAnalyticsScripts() {
    // Здесь можно загрузить Google Analytics или другие аналитические скрипты
    console.log('Аналитические скрипты загружены');
}

// Загрузка маркетинговых скриптов
function loadMarketingScripts() {
    // Здесь можно загрузить маркетинговые скрипты
    console.log('Маркетинговые скрипты загружены');
}

// Проверка при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const preferencesSaved = getCookie('cookie_preferences_saved');
    
    if (!preferencesSaved) {
        showCookieBanner();
    } else {
        // Загрузить скрипты на основе сохраненных предпочтений
        if (getCookie('cookie_analytics') === 'true') loadAnalyticsScripts();
        if (getCookie('cookie_marketing') === 'true') loadMarketingScripts();
    }
    
    // Устанавливаем начальные значения для чекбоксов в настройках
    const analyticsCookiesCheckbox = document.getElementById('analytics-cookies');
    const marketingCookiesCheckbox = document.getElementById('marketing-cookies');
    
    if (analyticsCookiesCheckbox && getCookie('cookie_analytics')) {
        analyticsCookiesCheckbox.checked = getCookie('cookie_analytics') === 'true';
    }
    
    if (marketingCookiesCheckbox && getCookie('cookie_marketing')) {
        marketingCookiesCheckbox.checked = getCookie('cookie_marketing') === 'true';
    }
}); 