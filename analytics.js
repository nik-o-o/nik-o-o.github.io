/* Analytics, loaded on every page. Skipped when the page is opened from disk,
   or when the visitor's browser sends Global Privacy Control.

   Google Analytics 4 counts visits, CV downloads and outbound clicks (enhanced measurement),
   plus a few events sent from script.js.

   Microsoft Clarity adds heatmaps and session recordings. Text typed into the message form
   is masked by Clarity before it leaves the browser. For visitors from the EEA, UK and
   Switzerland, Clarity's consent mode keeps it from setting cookies. */
(function () {
  if (location.protocol === 'file:' || navigator.globalPrivacyControl === true) return;

  var GA_ID = 'G-L77P42Y96L';
  if (/^G-[A-Z0-9]+$/.test(GA_ID)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(g);
  }

  var CLARITY_ID = 'zj3vyq9ifh';
  if (/^[a-z0-9]{6,16}$/.test(CLARITY_ID)) {
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    var c = document.createElement('script');
    c.async = true;
    c.src = 'https://www.clarity.ms/tag/' + CLARITY_ID;
    document.head.appendChild(c);
  }
})();
