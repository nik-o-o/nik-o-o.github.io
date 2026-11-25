/* Page-to-page transitions: tells the new page which way the metro is going.
   Pages are stations in nav order. Moving down the line adds the view transition
   type "forward", moving back adds "backward"; styles.css animates each.
   Loaded in <head> (not deferred) so the listener is in place before first paint. */
(function () {
  'use strict';
  var LINE = ['index', 'experience', 'projects', 'about', 'contact'];
  function station(url) {
    try {
      var m = new URL(url).pathname.match(/([\w-]+)\.html$/);
      return LINE.indexOf(m ? m[1] : 'index');
    } catch (e) { return -1; }
  }
  function quiet() {}
  window.addEventListener('pagereveal', function (e) {
    var vt = e.viewTransition;
    if (!vt) return;
    // A browser may still skip the transition (some embedded browsers do); keep that
    // out of the console instead of logging an uncaught promise rejection.
    if (vt.ready) vt.ready.catch(quiet);
    if (vt.finished) vt.finished.catch(quiet);
    if (vt.updateCallbackDone) vt.updateCallbackDone.catch(quiet);
    var nav = window.navigation, act = nav && nav.activation;
    if (!act || !act.from || !act.entry) return;
    var a = station(act.from.url), b = station(act.entry.url);
    if (a < 0 || b < 0 || a === b) return;
    vt.types.add(b > a ? 'forward' : 'backward');
  });
})();
