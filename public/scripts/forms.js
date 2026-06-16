(function () {
  const UTM_FIELDS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ];

  const UTM_STORAGE_KEY = 'automation_portfolio_utm';

  const FORM_GOALS = {
    lead: 'short_form_submit',
    brief: 'brief_form_submit',
    lead_magnet: 'lead_magnet_submit',
  };

  function getSearchParams() {
    return new URLSearchParams(window.location.search);
  }

  function getUtmFromUrl() {
    const params = getSearchParams();
    const utm = {};

    UTM_FIELDS.forEach((fieldName) => {
      utm[fieldName] = params.get(fieldName) || '';
    });

    return utm;
  }

  function hasAnyUtm(utm) {
    return UTM_FIELDS.some((fieldName) => Boolean(utm[fieldName]));
  }

  function saveUtmToStorage(utm) {
    if (!hasAnyUtm(utm)) {
      return;
    }

    try {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    } catch (error) {
      console.info('[forms demo] Не удалось сохранить UTM', error);
    }
  }

  function getUtmFromStorage() {
    try {
      const raw = localStorage.getItem(UTM_STORAGE_KEY);

      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function getCurrentUtm() {
    const utmFromUrl = getUtmFromUrl();

    if (hasAnyUtm(utmFromUrl)) {
      saveUtmToStorage(utmFromUrl);
      return utmFromUrl;
    }

    const utmFromStorage = getUtmFromStorage();

    if (utmFromStorage) {
      return {
        utm_source: utmFromStorage.utm_source || '',
        utm_medium: utmFromStorage.utm_medium || '',
        utm_campaign: utmFromStorage.utm_campaign || '',
        utm_content: utmFromStorage.utm_content || '',
        utm_term: utmFromStorage.utm_term || '',
      };
    }

    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
    };
  }

  function fillUtmFields(form, utm) {
    UTM_FIELDS.forEach((fieldName) => {
      const input = form.querySelector(`input[name="${fieldName}"]`);

      if (!input) {
        return;
      }

      input.value = utm[fieldName] || '';
    });
  }

  function addFieldValue(fields, key, value) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      if (Array.isArray(fields[key])) {
        fields[key].push(value);
      } else {
        fields[key] = [fields[key], value];
      }

      return;
    }

    fields[key] = value;
  }

  function collectFields(form) {
    const formData = new FormData(form);
    const fields = {};

    formData.forEach((value, key) => {
      if (UTM_FIELDS.includes(key)) {
        return;
      }

      if (key === 'form_type') {
        return;
      }

      addFieldValue(fields, key, value);
    });

    return fields;
  }

  function getFormType(form) {
    const formTypeInput = form.querySelector('input[name="form_type"]');

    if (formTypeInput && formTypeInput.value) {
      return formTypeInput.value;
    }

    return 'unknown';
  }

  function buildPayload(form) {
    const formType = getFormType(form);
    const utm = getCurrentUtm();

    return {
      formType,
      pageUrl: window.location.href,
      pageTitle: document.title,
      utm,
      fields: collectFields(form),
      createdAt: new Date().toISOString(),
      clientId:
        window.siteAnalytics &&
        typeof window.siteAnalytics.getClientId === 'function'
          ? window.siteAnalytics.getClientId()
          : '',
      demoMode: true,
    };
  }

  function clearVisibleFields(form) {
    const fields = form.querySelectorAll('input, textarea, select');

    fields.forEach((field) => {
      if (field.type === 'hidden') {
        return;
      }

      if (field.type === 'checkbox' || field.type === 'radio') {
        field.checked = false;
        return;
      }

      if (field.tagName === 'SELECT') {
        field.selectedIndex = 0;
        return;
      }

      field.value = '';
    });
  }

  function showSuccess(form) {
    const successBlock = form.querySelector('[data-form-success]');

    if (!successBlock) {
      return;
    }

    successBlock.hidden = false;
  }

  function reachFormGoal(formType, payload) {
    const goal = FORM_GOALS[formType];

    if (!goal) {
      return;
    }

    if (
      window.siteAnalytics &&
      typeof window.siteAnalytics.reachGoal === 'function'
    ) {
      window.siteAnalytics.reachGoal(goal, {
        formType,
        page: window.location.pathname,
        leadMagnet: payload.fields.lead_magnet || '',
      });

      return;
    }

    window.__pendingAnalyticsGoals = window.__pendingAnalyticsGoals || [];
    window.__pendingAnalyticsGoals.push({
      goal,
      params: {
        formType,
        page: window.location.pathname,
      },
    });
  }

  function initDemoForms() {
    const forms = document.querySelectorAll('form[data-form="demo"]');

    if (!forms.length) {
      return;
    }

    const currentUtm = getCurrentUtm();

    forms.forEach((form) => {
      fillUtmFields(form, currentUtm);

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
          return;
        }

        const payload = buildPayload(form);

        console.info('[forms demo payload]', payload);

        // На следующем этапе здесь будет fetch() к backend API.

        reachFormGoal(payload.formType, payload);
        showSuccess(form);
        clearVisibleFields(form);
        fillUtmFields(form, getCurrentUtm());
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoForms);
  } else {
    initDemoForms();
  }
})();