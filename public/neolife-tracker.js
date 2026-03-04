// Neolife Analytics Tracker v1.0.0
// Vanilla JS, no dependencies, Beacon API
(function() {
  'use strict';

  var ENDPOINT = (document.currentScript && document.currentScript.getAttribute('data-endpoint'))
    || window.location.origin + '/api/track';
  var HEARTBEAT_MS = 30000;
  var DEBOUNCE_MS = 2000;
  var SCROLL_MARKS = [25, 50, 75, 100];

  // --- Helpers ---
  function uid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function fingerprint() {
    var parts = [
      navigator.userAgent, navigator.language,
      screen.width + 'x' + screen.height, screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0, navigator.platform
    ];
    try {
      var c = document.createElement('canvas');
      var ctx = c.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('neo-fp', 2, 2);
      parts.push(c.toDataURL().slice(-50));
    } catch(e) {}
    var s = parts.join('|');
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return 'v_' + Math.abs(h).toString(36);
  }

  function utmParams() {
    var p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get('utm_source'),
      utm_medium: p.get('utm_medium'),
      utm_campaign: p.get('utm_campaign'),
      utm_term: p.get('utm_term'),
      utm_content: p.get('utm_content')
    };
  }

  function deviceInfo() {
    var ua = navigator.userAgent;
    var mob = /Mobi|Android|iPhone/i.test(ua);
    var tab = /iPad|Tablet/i.test(ua);
    var br = 'Other';
    if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) br = 'Chrome';
    else if (/Firefox/i.test(ua)) br = 'Firefox';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) br = 'Safari';
    else if (/Edg/i.test(ua)) br = 'Edge';
    var os = 'Other';
    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iOS/i.test(ua)) os = 'iOS';
    return {
      device_type: tab ? 'tablet' : (mob ? 'mobile' : 'desktop'),
      browser: br, os: os,
      screen_width: screen.width, screen_height: screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  // --- State ---
  var fp = fingerprint();
  var vid = localStorage.getItem('neo_vid') || uid();
  var sid = sessionStorage.getItem('neo_sid') || uid();
  var utm = utmParams();
  var dev = deviceInfo();
  var maxScroll = 0;
  var scrollHit = {};
  var ghostData = {};
  var ghostSent = false;
  var debounceTimers = {};

  localStorage.setItem('neo_vid', vid);
  sessionStorage.setItem('neo_sid', sid);

  if (utm.utm_source) sessionStorage.setItem('neo_utm', JSON.stringify(utm));
  else { var su = sessionStorage.getItem('neo_utm'); if (su) utm = JSON.parse(su); }

  // --- Send ---
  function send(type, data) {
    var payload = JSON.stringify({
      visitor_id: vid, session_id: sid, fingerprint: fp,
      event_type: type, event_data: data || {},
      page_url: window.location.href,
      referrer: document.referrer || null,
      timestamp: new Date().toISOString(),
      device: dev, utm: utm, tracker_version: '1.0.0'
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }));
    } else {
      var x = new XMLHttpRequest();
      x.open('POST', ENDPOINT, true);
      x.setRequestHeader('Content-Type', 'application/json');
      x.send(payload);
    }
  }

  // --- Pageview ---
  send('pageview', { title: document.title });

  // --- Scroll ---
  window.addEventListener('scroll', function() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var dh = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
    var pct = dh > 0 ? Math.round((st / dh) * 100) : 0;
    if (pct > maxScroll) {
      maxScroll = pct;
      SCROLL_MARKS.forEach(function(m) {
        if (pct >= m && !scrollHit[m]) { scrollHit[m] = true; send('scroll', { depth: m }); }
      });
    }
  }, { passive: true });

  // --- Section Visibility ---
  if ('IntersectionObserver' in window) {
    var sectionTimers = {};
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        var id = e.target.id || e.target.getAttribute('data-section');
        if (!id) return;
        if (e.isIntersecting) {
          sectionTimers[id] = Date.now();
          send('section_view', { section: id, action: 'enter' });
        } else if (sectionTimers[id]) {
          var dur = Math.round((Date.now() - sectionTimers[id]) / 1000);
          send('section_view', { section: id, action: 'exit', duration_s: dur });
          delete sectionTimers[id];
        }
      });
    }, { threshold: 0.3 });

    function observeSections() {
      ['hero', 'metodo', 'logistica', 'seguranca', 'casos', 'avaliacao'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) obs.observe(el);
      });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observeSections);
    else observeSections();
  }

  // --- Click Tracking ---
  document.addEventListener('click', function(e) {
    var t = e.target.closest('a, button');
    if (!t) return;
    var href = t.getAttribute('href') || '';
    var text = (t.textContent || '').trim().substring(0, 80);
    var isContact = href.startsWith('tel:') || href.startsWith('mailto:') || href.includes('wa.me') || href.includes('whatsapp');
    if (isContact) send('contact_click', { type: href.split(':')[0], text: text, href: href });
    else if (t.tagName === 'BUTTON' || href.startsWith('#')) send('cta_click', { text: text, href: href });
  }, true);

  // --- Ghost Lead Tracking ---
  function setupGhostLeads() {
    var form = document.querySelector('#avaliacao form') || document.querySelector('form');
    if (!form) return;
    var inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(function(inp) {
      var fn = inp.name || '';
      if (!fn) {
        var lbl = inp.closest('.space-y-2');
        if (lbl) {
          var lt = lbl.querySelector('label');
          if (lt) {
            var t = lt.textContent.toLowerCase();
            if (t.includes('nome')) fn = 'name';
            else if (t.includes('email')) fn = 'email';
            else if (t.includes('whatsapp') || t.includes('telefone')) fn = 'phone';
            else if (t.includes('cidade')) fn = 'location';
            else if (t.includes('queixa') || t.includes('objetivo')) fn = 'goal';
            else if (t.includes('previsão') || t.includes('início')) fn = 'timeframe';
          }
        }
      }
      if (!fn) return;

      inp.addEventListener('focus', function() { send('form_focus', { field: fn }); });

      inp.addEventListener('blur', function() {
        var val = inp.value.trim();
        if (val) {
          ghostData[fn] = val;
          clearTimeout(debounceTimers[fn]);
          debounceTimers[fn] = setTimeout(function() { sendGhostUpdate(fn); }, DEBOUNCE_MS);
        }
      });

      inp.addEventListener('input', function() {
        var val = inp.value.trim();
        if (val.length >= 3) {
          ghostData[fn] = val;
          clearTimeout(debounceTimers[fn]);
          debounceTimers[fn] = setTimeout(function() { sendGhostUpdate(fn); }, DEBOUNCE_MS);
        }
      });
    });
  }

  function sendGhostUpdate(field) {
    var filled = Object.keys(ghostData).length;
    var cls = 'cold';
    if (filled >= 3 || ghostData.phone) cls = 'hot';
    else if (filled >= 1) cls = 'warm';
    send('ghost_lead', {
      field: field, fields_filled: filled,
      classification: cls, partial_data: ghostData, is_update: ghostSent
    });
    ghostSent = true;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function() { setTimeout(setupGhostLeads, 1000); });
  else setTimeout(setupGhostLeads, 1000);

  // --- Heartbeat ---
  setInterval(function() {
    send('heartbeat', { max_scroll: maxScroll, time_on_page: Math.round(performance.now() / 1000) });
  }, HEARTBEAT_MS);

  // --- Page Hide ---
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      send('page_hide', { max_scroll: maxScroll, time_on_page: Math.round(performance.now() / 1000) });
    }
  });

  // --- Public API ---
  window.__neoTracker = {
    visitorId: vid, sessionId: sid,
    trackFormSubmit: function(formData) {
      send('form_submit', { form_data: formData, fields_filled: Object.keys(formData).length, classification: 'converted' });
    }
  };
})();
