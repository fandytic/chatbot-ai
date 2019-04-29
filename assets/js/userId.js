(function() {
  const USER_ID_KEY = 'userId';
  const USER_ID_EXPIRATION_TIME_IN_DAYS = 7;
  const COOKIE_DOMAIN = 'rasa.com';

  window.dataLayer = window.dataLayer || [];

  if (!window.Cookies) throw new Error("js.cookies not loaded. Please include the library in a script tag.");

  let userId = Cookies.get(USER_ID_KEY);
  if (!userId) {
    // The userId is either expired or was never set, assign a new one
    userId =
      Math.random().toString(36).substring(2)
        + new Date().getTime().toString(36);
    Cookies.set(USER_ID_KEY, userId, { expires: USER_ID_EXPIRATION_TIME_IN_DAYS, domain: COOKIE_DOMAIN });
  }

  dataLayer.push({ [USER_ID_KEY]: userId });
})();