/* app.js – bootstrap: load state, wire header, check folder access, render. */
"use strict";
(function (OE) {
  OE.S = OE.loadState();
  [].forEach.call(document.querySelectorAll("#seg button"), function (b) {
    b.onclick = function () { OE.S.lang = b.dataset.l; OE.save(); OE.render(1); };
  });
  OE.$("help").onclick = OE.showHelp;
  OE.$("set").onclick = function () { OE.go("settings"); };
  /* Logo files missing (img/logo-full.svg, img/logo-mark.svg) -> clearly marked placeholder slot. */
  var lg = OE.$("brand-logo");
  function noLogo() { OE.$("brand").classList.add("logo-missing"); }
  lg.addEventListener("error", noLogo); if (lg.complete && !lg.naturalWidth) noLogo();
  window.addEventListener("load", OE.fitBrand);
  OE.fs.init().then(function () { OE.render(1); });
})(window.OE);
