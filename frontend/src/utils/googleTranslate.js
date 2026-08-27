/**
 * Programmatically switch language using Google Translate Engine
 * @param {string} langCode - 'en' | 'hi'
 */
export const changeGoogleLanguage = (langCode) => {
  try {
    const targetLang = langCode === 'hi' ? 'hi' : 'en';

    // 1. Set Google Translate Cookie across domains and paths
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/en/${targetLang}; path=/;`;
    document.cookie = `googtrans=/en/${targetLang}; domain=${hostname}; path=/;`;
    if (hostname.includes('.')) {
      document.cookie = `googtrans=/en/${targetLang}; domain=.${hostname}; path=/;`;
    }

    // 2. Change Google Translate combo dropdown if initialized in DOM
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event('change'));
      // Trigger input event as well for broad browser compatibility
      select.dispatchEvent(new Event('input'));
    } else {
      // If combo not ready yet, reload so the cookie takes effect on initialization
      window.location.reload();
    }
  } catch (err) {
    console.warn('[Google Translate Engine Error]:', err);
  }
};

export default changeGoogleLanguage;
