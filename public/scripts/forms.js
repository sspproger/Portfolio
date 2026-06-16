(function () {
  const UTM_FIELDS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ];

  function getSearchParams() {
    return new URLSearchParams(window.location.search);
  }

  function fillUtmFields(form) {
    const params = getSearchParams();

    UTM_FIELDS.forEach((fieldName) => {
      const input = form.querySelector(`input[name="${fieldName}"]`);

      if (!input) {
        return;
      }

      input.value = params.get(fieldName) || '';
    });
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

  function initDemoForms() {
    const forms = document.querySelectorAll('form[data-form="demo"]');

    if (!forms.length) {
      return;
    }

    forms.forEach((form) => {
      fillUtmFields(form);

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
          return;
        }

        showSuccess(form);
        clearVisibleFields(form);
        fillUtmFields(form);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoForms);
  } else {
    initDemoForms();
  }
})();