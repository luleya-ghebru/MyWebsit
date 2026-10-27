/* =========================================================
   forms.js - validation + processing for enquiry.html and
   contact.html. Each input has a data-validate="rule" attribute
   that links it to a rule in the `rules` object below.
   ========================================================= */

/* ---- Validation rules: return "" when valid, otherwise the error message ---- */
var rules = {
  name: function (v) {
    v = v.trim();
    if (!v) { return 'Please enter your full name.'; }
    if (!/^[A-Za-z\u00C0-\u017F' -]{2,60}$/.test(v)) { return 'Use 2-60 letters only (spaces, hyphens and apostrophes are allowed).'; }
    return '';
  },
  email: function (v) {
    v = v.trim();
    if (!v) { return 'Please enter your email address.'; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { return 'Enter a valid email address, for example name@example.co.za.'; }
    return '';
  },
  phone: function (v) { // required South African number: 10 digits starting with 0
    v = v.replace(/[\s-]/g, '');
    if (!v) { return 'Please enter your phone number.'; }
    if (!/^0\d{9}$/.test(v)) { return 'Enter a 10-digit number starting with 0, for example 0821234567.'; }
    return '';
  },
  phoneOptional: function (v) { // contact form: may be empty, but must be valid if typed
    v = v.replace(/[\s-]/g, '');
    if (!v) { return ''; }
    return /^0\d{9}$/.test(v) ? '' : 'Enter a 10-digit number starting with 0, for example 0821234567.';
  },
  select: function (v) {
    return v ? '' : 'Please choose an option from the list.';
  },
  message: function (v) {
    v = v.trim();
    if (!v) { return 'Please type your message.'; }
    if (v.length < 10) { return 'Your message is too short - please write at least 10 characters.'; }
    if (v.length > 500) { return 'Your message is too long - the limit is 500 characters.'; }
    return '';
  },
  consent: function (checked) {
    return checked ? '' : 'Please tick the box so we may use your details to reply.';
  },
  date: function (v, field) { // preferred date - compulsory only for installation/repair bookings
    var type = field.form.querySelector('#enquiry-type').value;
    if (!v) {
      return (type === 'installation' || type === 'repair') ? 'Please choose a preferred date for your booking.' : '';
    }
    var chosen = new Date(v + 'T00:00:00');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var limit = new Date(today); limit.setDate(limit.getDate() + 90);
    if (chosen < today) { return 'The date cannot be in the past.'; }
    if (chosen > limit) { return 'Please choose a date within the next 90 days.'; }
    if (chosen.getDay() === 0) { return 'We are closed on Sundays - please pick Monday to Saturday.'; }
    return '';
  }
};

/* ---- Validate one field and show/clear its error message ---- */
function validateField(field) {
  var value = field.type === 'checkbox' ? field.checked : field.value;
  var message = rules[field.dataset.validate](value, field);
  var errorBox = document.getElementById(field.id + '-error');

  errorBox.textContent = message;                       // shown in the aria-live span
  field.classList.toggle('invalid', message !== '');
  field.classList.toggle('valid', message === '' && field.type !== 'checkbox' && String(value).trim() !== '');
  field.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
  return message === '';
}

/* ---- Wire a form to the rules; callback runs only when every field is valid ---- */
function setupForm(form, onValid) {
  var fields = Array.prototype.slice.call(form.querySelectorAll('[data-validate]'));
  var summary = form.querySelector('.form-summary');

  fields.forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });   // check when leaving the field
    field.addEventListener('change', function () { validateField(field); });
    field.addEventListener('input', function () {                            // re-check live once an error is showing
      if (field.classList.contains('invalid')) { validateField(field); }
    });
  });

  // Live character counter for the message box
  var box = form.querySelector('textarea');
  var counter = form.querySelector('.char-count');
  if (box && counter) {
    box.addEventListener('input', function () { counter.textContent = box.value.length + ' / 500 characters'; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // stop the normal page reload - we process the form with JavaScript (AJAX-style)
    var firstBad = null;
    fields.forEach(function (field) {
      if (!validateField(field) && !firstBad) { firstBad = field; }
    });
    if (firstBad) {
      summary.textContent = 'Please fix the highlighted fields and try again.';
      firstBad.focus();
      return;
    }
    summary.textContent = '';
    onValid(new FormData(form), form);
  });

  form.addEventListener('reset', function () { // clear all messages and colours on reset
    fields.forEach(function (f) {
      document.getElementById(f.id + '-error').textContent = '';
      f.classList.remove('invalid', 'valid');
      f.removeAttribute('aria-invalid');
    });
    summary.textContent = '';
    if (counter) { counter.textContent = '0 / 500 characters'; }
    var out = document.querySelector('.form-response');
    if (out) { out.hidden = true; }
  });
}

/* Small helper: create <dt>/<dd> pair inside a <dl> using textContent (no raw HTML) */
function addRow(dl, label, text) {
  var dt = document.createElement('dt'); dt.textContent = label;
  var dd = document.createElement('dd'); dd.textContent = text;
  dl.appendChild(dt); dl.appendChild(dd);
}

/* =========================================================
   ENQUIRY FORM - processes the input and shows a response about
   cost and availability. Figures are illustrative: align them
   with the budget and services in your Part 1 proposal.
   ========================================================= */
var categoryInfo = {
  tv:     { name: 'Televisions',        from: 'R 6 999', install: 'R 450 (wall-mounting and set-up)' },
  fridge: { name: 'Fridges & Freezers', from: 'R 9 499', install: 'R 350 (delivery and installation)' },
  washer: { name: 'Washing Machines',   from: 'R 7 299', install: 'R 550 (plumbing connection)' },
  aircon: { name: 'Air Conditioning',   from: 'R 8 999', install: 'from R 2 800 (depends on the site visit)' },
  small:  { name: 'Small Appliances',   from: 'R 1 199', install: 'No installation needed' }
};

function buildEnquiryResponse(data) {
  var cat = categoryInfo[data.get('product-category')];
  var type = data.get('enquiry-type');
  var cost, availability;

  if (type === 'product-info') {
    cost = cat.name + ' start from ' + cat.from + '. A sales specialist will send an exact quote.';
    availability = 'Most models are in stock at both stores or can be delivered within 3-5 working days.';
  } else if (type === 'installation') {
    cost = 'Installation for ' + cat.name + ': ' + cat.install + '.';
    availability = 'The next available installation slot is within 3 working days of your preferred date.';
  } else if (type === 'repair') {
    cost = 'Call-out and diagnostic fee of R 450 (deducted from the repair if you go ahead). Parts are quoted after diagnosis.';
    availability = 'A technician can visit within 2-5 working days of your preferred date.';
  } else { // warranty
    cost = 'No charge for faults covered by the LG warranty. Please keep your proof of purchase.';
    availability = 'Your warranty claim will be assessed within 48 hours.';
  }
  return { cost: cost, availability: availability, category: cat.name };
}

function handleEnquiry(data) {
  var out = document.getElementById('enquiry-response');
  out.hidden = false;
  out.innerHTML = '';
  var wait = document.createElement('p');
  wait.textContent = 'Processing your enquiry...';
  out.appendChild(wait);
  out.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // setTimeout simulates the short wait of a server request (asynchronous update of the page)
  setTimeout(function () {
    var result = buildEnquiryResponse(data);
    var ref = 'LG-' + String(Date.now()).slice(-6);
    var labels = { 'product-info': 'Product information / pricing', installation: 'Installation booking',
                   repair: 'Repair / service booking', warranty: 'Warranty claim' };

    out.innerHTML = '';
    var h = document.createElement('h3');
    h.textContent = 'Thank you, ' + data.get('full-name').trim().split(' ')[0] + '!';
    var p = document.createElement('p');
    p.textContent = 'Your enquiry has been received. Reference number: ' + ref;
    var dl = document.createElement('dl');
    addRow(dl, 'Enquiry type', labels[data.get('enquiry-type')]);
    addRow(dl, 'Product category', result.category);
    addRow(dl, 'Cost', result.cost);
    addRow(dl, 'Availability', result.availability);
    addRow(dl, 'Next step', 'We will contact you by ' + data.get('contact-method') + ' on ' +
      (data.get('contact-method') === 'email' ? data.get('email') : data.get('phone')) + '.');
    out.appendChild(h); out.appendChild(p); out.appendChild(dl);
  }, 900);
}

/* =========================================================
   CONTACT FORM - compiles the details into an email addressed to
   the recipient below. mailto: links open the visitor's email
   app with the message ready to send (MDN Web Docs, n.d.c).
   ========================================================= */
var CONTACT_RECIPIENT = 'info@lgstore.co.za';

function handleContact(data) {
  var typeLabels = { general: 'General Enquiry', feedback: 'Feedback / Complaint', careers: 'Careers', other: 'Other' };
  var subject = '[' + typeLabels[data.get('subject')] + '] Message from ' + data.get('full-name').trim();
  var body =
    'Name: ' + data.get('full-name').trim() + '\n' +
    'Email: ' + data.get('email').trim() + '\n' +
    'Phone: ' + (data.get('phone').trim() || 'Not provided') + '\n' +
    'Message type: ' + typeLabels[data.get('subject')] + '\n\n' +
    'Message:\n' + data.get('message').trim();

  var mailto = 'mailto:' + CONTACT_RECIPIENT +
    '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

  var out = document.getElementById('contact-response');
  out.hidden = false;
  out.innerHTML = '';
  var h = document.createElement('h3'); h.textContent = 'Your email is ready to send';
  var p = document.createElement('p'); p.textContent = 'To: ' + CONTACT_RECIPIENT + ' | Subject: ' + subject;
  var preview = document.createElement('pre'); preview.className = 'email-preview'; preview.textContent = body;
  var send = document.createElement('a');
  send.className = 'btn btn-primary';
  send.href = mailto;                 // clicking opens the visitor's email app
  send.textContent = 'Send email now';
  out.appendChild(h); out.appendChild(p); out.appendChild(preview); out.appendChild(send);
  out.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---- Start-up: attach the right behaviour to whichever form is on this page ---- */
document.addEventListener('DOMContentLoaded', function () {
  var enquiry = document.getElementById('enquiry-form');
  if (enquiry) {
    setupForm(enquiry, handleEnquiry);

    // Prevent past dates in the date picker
    var dateInput = document.getElementById('preferred-date');
    dateInput.min = new Date().toISOString().split('T')[0];
    // Date rule depends on enquiry type, so re-check when the type changes
    document.getElementById('enquiry-type').addEventListener('change', function () { validateField(dateInput); });

    // Pre-select category when arriving from a product card (?category=tv&product=...)
    var params = new URLSearchParams(window.location.search);
    if (params.get('category') && categoryInfo[params.get('category')]) {
      document.getElementById('product-category').value = params.get('category');
    }
    if (params.get('product')) {
      document.getElementById('enquiry-type').value = 'product-info';
      document.getElementById('message').value = 'I would like more information about the ' + params.get('product') + '.';
    }
  }

  var contact = document.getElementById('contact-form');
  if (contact) { setupForm(contact, handleContact); }
});