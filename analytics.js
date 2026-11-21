/* Google Analytics 4. Counts visits, CV downloads and outbound clicks (enhanced measurement),
   plus a few events sent from script.js. Skipped when the page is opened from disk,
   or when the visitor's browser sends Global Privacy Control. */
(function () {
  var ID = 'G-L77P42Y96L';
  if (!/^G-[A-Z0-9]+$/.test(ID)) return;
  if (location.protocol === 'file:' || navigator.globalPrivacyControl === true) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ID);
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);
})();
