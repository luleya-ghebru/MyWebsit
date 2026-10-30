/* =========================================================
   forms.js - validation for the enquiry and contact forms
   - Checks every field and shows red error messages
   - Enquiry form: builds a cost / availability response
   - Contact form: builds an email to the store
   ========================================================= */
(function () {
  'use strict';

  /* ===== YOUR DETAILS - change these two lines ===== */
  const STORE_EMAIL = 'ST10523298@rcconnect.edu.za';      // the email address that receives messages
  const WHATSAPP_NUMBER = '27814186421';         // your WhatsApp number: country code + number, no + or spaces (082 123 4567 becomes 27821234567)
  /* ================================================== */

  /* Optional AJAX: paste a Formspree (or similar) endpoint here to send the
     form in the background. Leave it empty to use the built-in response / email. */
  const FORM_ENDPOINT = '';

  const CATEGORY_BY_VALUE = {
    'tv': 'Televisions',
    'fridge': 'Fridges & Freezers',
    'washer': 'Washing Machines',
    'aircon': 'Air Conditioning',
    'small-appliance': 'Small Appliances'
  };
  const INSTALL_FEE = { 'tv': 650, 'fridge': 450, 'washer': 750, 'aircon': 3500, 'small-appliance': 0 };
  const CALL_OUT_FEE = 450;

  const rands = n => 'R ' + n.toLocaleString('en-ZA');

  /* ---------- Validation rules: each returns an error message, or "" when the value is fine ---------- */
  const rules = {
    name: v => !v ? 'Please enter your full name.'
      : /^[A-Za-zÀ-ÿ'’ -]{2,60}$/.test(v) ? '' : 'Use 2 to 60 letters, spaces, hyphens or apostrophes.',
    email: v => !v ? 'Please enter your email address.'
      : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address, for example name@example.com.',
    phone: v => /^(?:0|\+27)[1-9][0-9]{8}$/.test(v.replace(/[\s()-]/g, ''))
      ? '' : 'Enter a valid South African number, for example 0821234567.',
    requiredPhone: v => !v ? 'Please enter your phone number.' : rules.phone(v),
    optionalPhone: v => !v ? '' : rules.phone(v),
    select: label => v => v ? '' : 'Please select ' + label + '.',
    quantity: v => (v !== '' && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 50)
      ? '' : 'Enter a whole number between 1 and 50.',
    message: v => v.length < 10 ? 'Please enter a message of at least 10 characters.'
      : v.length > 500 ? 'Your message must be 500 characters or fewer.' : ''
  };

  function setError(field, message) {
    const out = document.getElementById(field.id + '-error');
    if (out) out.textContent = message;                       // red text (styled in CSS)
    field.classList.toggle('invalid', Boolean(message));      // red border
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function checkField(field, rule) {
    const message = rule(field.value.trim());
    setError(field, message);
    return !message;
  }

  /* Connects the rules to a form. Returns a function that checks every field at once. */
  function setupValidation(definitions) {
    const fields = definitions.map(d => ({ el: document.getElementById(d[0]), rule: d[1], touched: false }));
    fields.forEach(f => {
      const recheck = () => { f.touched = true; checkField(f.el, f.rule); };
      f.el.addEventListener('blur', recheck);
      f.el.addEventListener('change', recheck);
      f.el.addEventListener('input', () => { if (f.touched) checkField(f.el, f.rule); });
    });
    return function validateAll() {
      let firstBad = null;
      fields.forEach(f => {
        f.touched = true;
        if (!checkField(f.el, f.rule) && !firstBad) firstBad = f.el;
      });
      if (firstBad) firstBad.focus();                         // moves the visitor to the first problem
      return !firstBad;
    };
  }

  function setupCounter(textarea, counter) {
    const update = () => { counter.textContent = textarea.value.length + ' / 500'; };
    textarea.addEventListener('input', update);
    update();
  }

  /* Optional background (AJAX) submission - skipped when FORM_ENDPOINT is empty */
  async function sendToEndpoint(payload) {
    if (!FORM_ENDPOINT) return { skipped: true };
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { ok: response.ok };
    } catch (error) {
      return { ok: false };
    }
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function showBox(box, nodes) {
    box.replaceChildren(...nodes);
    box.classList.add('show');
    box.focus();
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* Adds "Send by email" and "Send by WhatsApp" buttons that open with the message already typed */
  function addSendLinks(subject, body, nodes) {
    const mail = el('a', 'btn', 'Send by email');
    mail.href = 'mailto:' + STORE_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    const wa = el('a', 'btn', 'Send by WhatsApp');
    wa.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(subject + '\n\n' + body);
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    nodes.push(mail, wa);
  }

  function addWorkingDays(days) {
    const d = new Date();
    while (days > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) days--;
    }
    return d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  /* =======================================================
     ENQUIRY FORM
     ======================================================= */
  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) {
    const validate = setupValidation([
      ['full-name', rules.name],
      ['email', rules.email],
      ['phone', rules.requiredPhone],
      ['enquiry-type', rules.select('an enquiry type')],
      ['product-category', rules.select('a product category')],
      ['quantity', rules.quantity],
      ['message', rules.message]
    ]);
    setupCounter(document.getElementById('message'), document.getElementById('message-count'));

    /* Pre-fill from a link such as enquiry.html?category=Televisions&product=... (quick-view modal) */
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get('category');
    Object.keys(CATEGORY_BY_VALUE).forEach(value => {
      if (CATEGORY_BY_VALUE[value] === wanted) document.getElementById('product-category').value = value;
    });
    if (params.get('product')) {
      document.getElementById('enquiry-type').value = 'product-info';
      document.getElementById('message').value = 'I would like pricing and availability for: ' + params.get('product') + '.';
      document.getElementById('message').dispatchEvent(new Event('input'));
    }

    function buildEnquiryResponse(data) {
      const category = CATEGORY_BY_VALUE[data['product-category']];
      const quantity = Number(data.quantity);
      const lines = [];
      let heading = '';

      /* Pricing and stock come from the product list in products.js */
      const items = typeof PRODUCTS !== 'undefined' ? PRODUCTS.filter(p => p.category === category) : [];
      const inStock = items.filter(p => p.stock > 0);
      const cheapest = items.length ? Math.min.apply(null, items.map(p => p.price)) : 0;

      if (data['enquiry-type'] === 'product-info') {
        heading = 'Pricing and availability: ' + category;
        if (items.length) {
          lines.push(category + ' start from ' + rands(cheapest) + ' each.');
          lines.push('Estimated total for ' + quantity + ' unit' + (quantity > 1 ? 's' : '') + ': from ' + rands(cheapest * quantity) + '.');
          lines.push(inStock.length
            ? inStock.length + ' of ' + items.length + ' models are in stock now.'
            : 'These models are available on order (7 to 10 working days).');
        }
        lines.push('Delivery takes 2 to 5 working days. A consultant will confirm exact prices.');
      } else if (data['enquiry-type'] === 'installation') {
        const fee = INSTALL_FEE[data['product-category']];
        heading = 'Installation booking: ' + category;
        lines.push(fee ? 'Installation fee: ' + rands(fee) + ' per unit, ' + rands(fee * quantity) + ' for ' + quantity + '.'
                       : 'Installation is free for small appliances bought from us.');
        lines.push('Earliest installation slot: ' + addWorkingDays(3) + '.');
      } else if (data['enquiry-type'] === 'repair') {
        heading = 'Repair booking: ' + category;
        lines.push('Call-out fee: ' + rands(CALL_OUT_FEE) + '. Repair labour and parts are quoted after the technician diagnoses the fault.');
        lines.push('Earliest technician visit: ' + addWorkingDays(2) + '.');
      } else {
        heading = 'Warranty claim: ' + category;
        lines.push('There is no charge to assess a product that is still under warranty.');
        lines.push('Please keep your proof of purchase ready. We will contact you within 1 working day.');
      }
      return { heading: heading, lines: lines };
    }

    enquiryForm.addEventListener('submit', async function (event) {
      event.preventDefault();                                  // stop the page reloading
      if (!validate()) return;                                 // red messages are already showing

      const data = Object.fromEntries(new FormData(enquiryForm).entries());
      const button = enquiryForm.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'Sending...';
      const net = await sendToEndpoint({ form: 'enquiry', data: data });
      button.disabled = false;
      button.textContent = 'Submit Enquiry';

      const reply = buildEnquiryResponse(data);
      const reference = 'ENQ-' + Date.now().toString(36).toUpperCase();
      const nodes = [
        el('h3', '', 'Thank you, ' + data['full-name'].split(' ')[0] + '!'),
        el('p', '', 'Reference: ' + reference),
        el('h4', '', reply.heading)
      ];
      const list = el('ul', 'response-list');
      reply.lines.forEach(line => list.appendChild(el('li', '', line)));
      nodes.push(list);
      nodes.push(el('p', '', 'We will contact you by ' + data['contact-method'] + '.'));
      const typeText = document.getElementById('enquiry-type').selectedOptions[0].text;
      const enquiryText = 'Reference: ' + reference + '\nName: ' + data['full-name'] + '\nEmail: ' + data.email +
        '\nPhone: ' + data.phone + '\nEnquiry type: ' + typeText + '\nCategory: ' + CATEGORY_BY_VALUE[data['product-category']] +
        '\nQuantity: ' + data.quantity + '\nPreferred contact: ' + data['contact-method'] + '\n\n' + data.message;
      nodes.push(el('p', '', 'Send your enquiry to our team:'));
      addSendLinks('Enquiry ' + reference, enquiryText, nodes);
      if (net.ok === false) nodes.push(el('p', '', 'Note: we could not send this to our team automatically. Please also call us.'));
      showBox(document.getElementById('enquiry-response'), nodes);
      enquiryForm.reset();
      document.getElementById('message-count').textContent = '0 / 500';
    });
  }

  /* =======================================================
     CONTACT FORM
     ======================================================= */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const validate = setupValidation([
      ['c-full-name', rules.name],
      ['c-email', rules.email],
      ['c-phone', rules.optionalPhone],
      ['c-subject', rules.select('a message type')],
      ['c-message', rules.message]
    ]);
    setupCounter(document.getElementById('c-message'), document.getElementById('c-message-count'));

    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();                                  // stops the form jumping straight to the email app
      if (!validate()) return;                                 // red messages are already showing

      const name = document.getElementById('c-full-name').value.trim();
      const email = document.getElementById('c-email').value.trim();
      const phone = document.getElementById('c-phone').value.trim();
      const subject = document.getElementById('c-subject').value;
      const message = document.getElementById('c-message').value.trim();

      /* Compile the email */
      const emailSubject = '[Website] ' + subject + ' from ' + name;
      const emailBody = 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (phone || 'Not given') +
        '\nMessage type: ' + subject + '\n\n' + message;

      const button = contactForm.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'Sending...';
      const net = await sendToEndpoint({ form: 'contact', name: name, email: email, phone: phone, subject: subject, message: message });
      button.disabled = false;
      button.textContent = 'Send Message';

      const nodes = [];
      if (net.ok) {
        nodes.push(el('h3', '', 'Message sent'));
        nodes.push(el('p', '', 'Thank you, ' + name.split(' ')[0] + '. Our team will reply to ' + email + '.'));
      } else {
        nodes.push(el('h3', '', 'Your email is ready'));
        nodes.push(el('p', '', 'Choose how to send it to us: by email (' + STORE_EMAIL + ') or by WhatsApp.'));
        nodes.push(el('pre', 'email-preview', 'To: ' + STORE_EMAIL + '\nSubject: ' + emailSubject + '\n\n' + emailBody));
        addSendLinks(emailSubject, emailBody, nodes);
        const copy = el('button', 'btn', 'Copy message');
        copy.type = 'button';
        copy.addEventListener('click', () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(emailBody).then(() => { copy.textContent = 'Copied'; });
          }
        });
        nodes.push(copy);
      }
      showBox(document.getElementById('contact-response'), nodes);
    });
  }
})();