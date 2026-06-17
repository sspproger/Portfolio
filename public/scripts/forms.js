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

  function getApiBaseUrl() {
    return String(window.__PUBLIC_API_BASE_URL__ || '').replace(/\/$/, '');
  }

  function getEndpointByFormType(formType) {
    if (formType === 'lead') return '/lead';
    if (formType === 'brief') return '/brief';
    if (formType === 'lead_magnet') return '/lead-magnet';
    return '/lead';
  }

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
      console.info('[forms] Не удалось сохранить UTM', error);
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
      demoMode: !getApiBaseUrl(),
    };
  }

  async function sendPayload(payload) {
    const apiBaseUrl = getApiBaseUrl();

    if (!apiBaseUrl) {
      console.info('[forms demo fallback payload]', payload);

      return {
        ok: true,
        demoMode: true,
        message: 'Форма работает в демо-режиме',
        requestId: `demo_${Date.now()}`,
      };
    }

    const endpoint = getEndpointByFormType(payload.formType);
    const url = `${apiBaseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        demoMode: false,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Не удалось отправить форму');
    }

    return data;
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

    if (successBlock) {
      successBlock.hidden = false;
    }

    const errorBlock = form.querySelector('[data-form-error]');

    if (errorBlock) {
      errorBlock.hidden = true;
    }
  }

  function showError(form, message) {
    let errorBlock = form.querySelector('[data-form-error]');

    if (!errorBlock) {
      errorBlock = document.createElement('div');
      errorBlock.setAttribute('data-form-error', '');
      errorBlock.className =
        'mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-slate-700';
      form.appendChild(errorBlock);
    }

    errorBlock.textContent =
      message ||
      'Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.';
    errorBlock.hidden = false;

    const successBlock = form.querySelector('[data-form-success]');

    if (successBlock) {
      successBlock.hidden = true;
    }
  }

  function setSubmitting(form, isSubmitting) {
    const submitButton = form.querySelector('button[type="submit"]');

    if (!submitButton) {
      return;
    }

    submitButton.disabled = isSubmitting;
    submitButton.dataset.originalText =
      submitButton.dataset.originalText || submitButton.textContent;

    submitButton.textContent = isSubmitting
      ? 'Отправка...'
      : submitButton.dataset.originalText;
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

  function initForms() {
    const forms = document.querySelectorAll('form[data-form="demo"]');

    if (!forms.length) {
      return;
    }

    const currentUtm = getCurrentUtm();

    forms.forEach((form) => {
      fillUtmFields(form, currentUtm);

      form.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
          return;
        }

        const payload = buildPayload(form);

        try {
          setSubmitting(form, true);

          const result = await sendPayload(payload);

          console.info('[forms result]', result);

          showSuccess(form);
          clearVisibleFields(form);
          fillUtmFields(form, getCurrentUtm());
          reachFormGoal(payload.formType, payload);
        } catch (error) {
          console.error('[forms error]', error);
          showError(form, error.message);
        } finally {
          setSubmitting(form, false);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
})();