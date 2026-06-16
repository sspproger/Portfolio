(function () {
  const METRIKA_ID = Number(window.__YANDEX_METRIKA_ID__ || 0);
  const CLIENT_ID_KEY = 'automation_portfolio_client_id';

  function generateClientId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    return `client_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function getClientId() {
    try {
      const existingClientId = localStorage.getItem(CLIENT_ID_KEY);

      if (existingClientId) {
        return existingClientId;
      }

      const newClientId = generateClientId();
      localStorage.setItem(CLIENT_ID_KEY, newClientId);

      return newClientId;
    } catch (error) {
      return generateClientId();
    }
  }

  function isMetrikaAvailable() {
    return Boolean(
      METRIKA_ID &&
        METRIKA_ID > 0 &&
        typeof window.ym === 'function'
    );
  }

  function reachGoal(goal, params) {
    const goalParams = {
      ...(params || {}),
      clientId: getClientId(),
      page: window.location.pathname,
      url: window.location.href,
    };

    window.__lastAnalyticsGoal = {
      goal,
      params: goalParams,
      createdAt: new Date().toISOString(),
    };

    if (isMetrikaAvailable()) {
      window.ym(METRIKA_ID, 'reachGoal', goal, goalParams);
      return;
    }

    console.info('[analytics demo]', goal, goalParams);
  }

  function initGoalClicks() {
    const elements = document.querySelectorAll('[data-goal]');

    elements.forEach((element) => {
      element.addEventListener('click', function () {
        const goal = element.getAttribute('data-goal');

        if (!goal) {
          return;
        }

        const label = element.getAttribute('data-goal-label') || '';
        const value = element.getAttribute('data-goal-value') || '';

        reachGoal(goal, {
          label,
          value,
          text: element.textContent ? element.textContent.trim() : '',
          href: element.getAttribute('href') || '',
        });
      });
    });
  }

  function flushPendingGoals() {
    const pendingGoals = window.__pendingAnalyticsGoals || [];

    if (!Array.isArray(pendingGoals) || !pendingGoals.length) {
      return;
    }

    pendingGoals.forEach((item) => {
      if (!item || !item.goal) {
        return;
      }

      reachGoal(item.goal, item.params || {});
    });

    window.__pendingAnalyticsGoals = [];
  }

  window.siteAnalytics = {
    reachGoal,
    getClientId,
    isMetrikaAvailable,
  };

  function initAnalytics() {
    initGoalClicks();
    flushPendingGoals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
})();