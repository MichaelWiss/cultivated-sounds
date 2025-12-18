// Global helpers and Howler integration stub
// This file is included in theme.liquid header

// Helper to format money
// In a real theme, this often comes from a liquid object
window.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || '${{amount}}';

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

// Debounce helper
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Fetch configuration for Shopify Ajax API calls
function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': `application/${type}`
    }
  };
}

// Trap focus within an element (for accessibility)
function trapFocus(container, elementToFocus = container) {
  const elements = Array.from(
    container.querySelectorAll(
      'summary, a[href], button:enabled, [tabindex]:not([tabindex^="-"]), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe'
    )
  );
  const first = elements[0];
  const last = elements[elements.length - 1];

  removeTrapFocus();

  container.setAttribute('tabindex', '-1');
  elementToFocus.focus();

  function focusTrap(event) {
    if (event.code === 'Tab') {
      // Shift + Tab
      if (event.shiftKey) {
        if (event.target === first) {
          last.focus();
          event.preventDefault();
        }
      }
      // Tab
      else {
        if (event.target === last) {
          first.focus();
          event.preventDefault();
        }
      }
    }

    // Escape
    if (event.code === 'Escape') {
      container.focus();
    }
  }

  document.addEventListener('keydown', focusTrap);
  container.addEventListener('focusout', function() {
    setTimeout(function() {
      if (!container.contains(document.activeElement)) {
        elementToFocus.focus();
      }
    });
  });
}

// Remove focus trap
function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('keydown', trapFocus);
  if (elementToFocus) elementToFocus.focus();
}
