// Lightning-fast, minimal deep-link attempts + safe fallbacks
const cashBtn = document.getElementById('cashBtn');
const zelleBtn = document.getElementById('zelleBtn');

const CASH_WEB = 'https://cash.app/$craigarmags';
const CASH_SCHEMES = [
  'cashapp://',      // common attempt (not guaranteed)
  'squarecash://',   // older variants
];

// attempt to open native app by using a custom scheme then fallback to web
function tryOpenApp(schemes, fallback){
  const now = Date.now();
  // try each scheme by creating a hidden iframe or assigning location
  let opened = false;

  // For iOS/modern browsers, setting window.location to scheme is common fallback
  // We'll try schemes in order; then set timeout to open fallback
  const tryScheme = (scheme) => {
    const timeout = setTimeout(() => {
      // if browser didn't switch away, we open fallback
      if (!opened && Date.now() - now > 500) window.location = fallback;
    }, 800);

    // Attempt to open
    window.location = scheme;
    // No reliable way to detect success, browser will change location if app opened
  };

  // start attempts (quick, sequential)
  for (let s of schemes) tryScheme(s);
  // final fallback after 900ms
  setTimeout(() => { window.location = fallback; }, 900);
}

cashBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // prefer universal web link but attempt native scheme first
  tryOpenApp(CASH_SCHEMES, CASH_WEB);
});

// Zelle: copy email to clipboard and notify user
zelleBtn.addEventListener('click', async () => {
  const email = 'craigarmags@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
    alert('Zelle email copied to clipboard: ' + email + '\nOpen your bank app and paste into Zelle send.');
    // Also open mailto as a convenience
    window.location = 'mailto:' + email + '?subject=Payment%20via%20Romper%20Room';
  } catch (err) {
    // fallback: show prompt to copy manually
    const ok = confirm('Copy failed automatically. Tap OK then copy the email manually: ' + email);
    if (ok) {
      // attempt to open mail app anyway
      window.location = 'mailto:' + email + '?subject=Payment%20via%20Romper%20Room';
    }
  }
});
