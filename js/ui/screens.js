/* ui/screens.js – one function per screen. Flow: lang -> tech (once) -> folder (once / renew) -> form -> result. settings via ⚙. */
"use strict";
(function (OE) {
  var $ = OE.$, esc = OE.esc, SC = OE.screens, C = OE.CFG, mem = OE.mem;
  function blank() { return { fam: "", famOther: "", sub: "", subOther: "", dossier: "", serial: "", order: "", file: null }; }
  mem.form = blank();

  /* ---------- language ---------- */
  SC.lang = function () {
    $("card").innerHTML = '<div class="start"><h2>Kies je taal</h2><p>Choisissez votre langue</p>' +
      '<button class="btn pri big" data-l="nl">Nederlands<small>NL</small></button>' +
      '<button class="btn sec big" data-l="fr">Français<small>FR</small></button></div>';
    [].forEach.call($("card").querySelectorAll("[data-l]"), function (b) {
      b.onclick = function () { OE.S.lang = b.dataset.l; OE.go(OE.S.tech.first && OE.S.tech.last ? "form" : "tech"); };
    });
  };

  /* ---------- technician name ---------- */
  SC.tech = function () {
    var S = OE.S, x = OE.t(), first = !(S.tech.first && S.tech.last);
    $("card").innerHTML = '<div class="narrow"><h2 class="q">' + x.techH + '</h2><p class="hint" style="margin-top:-8px">' + x.techP + "</p>" +
      '<label class="lbl" for="fn">' + x.first + '</label><input id="fn" autocomplete="given-name" placeholder="' + esc(x.firstPh) + '">' +
      '<label class="lbl" for="lnm">' + x.last + '</label><input id="lnm" autocomplete="family-name" placeholder="' + esc(x.lastPh) + '">' +
      '<div id="err"></div><div class="btns">' + (first ? "" : '<button class="btn sec" id="bk">‹ ' + x.back + "</button>") +
      '<button class="btn pri" id="go">' + (first ? x.techStart : x.techSave) + "</button></div></div>";
    $("fn").value = S.tech.first; $("lnm").value = S.tech.last;
    $("lnm").onkeydown = function (e) { if (e.key === "Enter") $("go").click(); };
    OE.bind("bk", function () { OE.go("settings", -1); });
    OE.bind("go", function () {
      var f = $("fn").value.replace(/\s+/g, " ").trim(), l = $("lnm").value.replace(/\s+/g, " ").trim();
      if (!f || !l) { OE.err(x.needName); return; }
      S.tech = { first: f, last: l }; OE.save(); OE.go(first ? "folder" : "settings");
    });
  };

  /* ---------- folder setup / renew ---------- */
  SC.folder = function () {
    var x = OE.t(), F = OE.fs, st = F.state, h = "";
    if (st === "unsupported") {
      h = '<div class="narrow"><h2 class="q">⚠️ ' + x.unsupH + '</h2><div class="err" id="unsup">' + esc(x.unsupP) + "</div></div>";
      $("card").innerHTML = h; return;
    }
    h = '<div class="narrow"><h2 class="q">' + x.folderH + '</h2><p class="hint" style="margin-top:-8px">' + x.folderP + "</p>";
    if (F.picked) h += '<div class="wosel"><div><small>' + x.folderNow + '</small><b id="fname">📁 ' + esc(F.picked.name) + "</b>" +
      (st === "granted" ? "<small>→ " + x.folderUse + ": " + esc(F.label()) + "</small>" : "") + "</div></div>";
    if (st === "prompt") h += '<p class="hint">' + x.folderRenewP + '</p><button class="btn pri big" id="renew">' + x.folderRenew + "</button>";
    if (st === "granted") h += '<button class="btn ok big" id="cont">' + x.folderOk + " ›</button>";
    h += '<button class="btn ' + (st === "none" ? "pri" : "sec") + ' big" id="pick">' + (F.picked ? x.folderChange : x.folderPick) + '</button><div id="err"></div></div>';
    $("card").innerHTML = h;
    function fail(e) { if (e && e.name === "AbortError") return; OE.err(e && e.message === "denied" ? x.folderDenied : OE.fmt(x.folderErr, { e: (e && e.message) || e })); }
    OE.bind("pick", function () { F.pick().then(function () { OE.go("form"); }, fail); });
    OE.bind("renew", function () { F.renew().then(function () { OE.go("form"); }, fail); });
    OE.bind("cont", function () { OE.go("form"); });
  };

  /* ---------- settings ---------- */
  SC.settings = function () {
    var x = OE.t(), S = OE.S;
    $("card").innerHTML = '<div class="narrow"><h2 class="q">' + x.setH + '</h2><ul class="list">' +
      "<li><span><b>" + x.setName + "</b>" + esc(S.tech.first + " " + S.tech.last) + '</span><button class="edit" id="eName">' + x.edit + "</button></li>" +
      "<li><span><b>" + x.setFolder + "</b>" + esc(OE.fs.label() || x.none) + '</span><button class="edit" id="eDir">' + x.edit + "</button></li>" +
      "<li><span><b>" + x.setLang + "</b>" + (S.lang === "fr" ? "Français" : "Nederlands") + '</span><button class="edit" id="eLang">' + x.edit + "</button></li></ul>" +
      '<div class="btns"><button class="btn pri" id="bk">‹ ' + x.back + "</button></div></div>";
    OE.bind("eName", function () { OE.go("tech"); });
    OE.bind("eDir", function () { OE.go("folder"); });
    OE.bind("eLang", function () { S.lang = S.lang === "fr" ? "nl" : "fr"; OE.save(); OE.render(1); });
    OE.bind("bk", function () { OE.go("form", -1); });
  };

  /* ---------- main form ---------- */
  function famName(f) { return f.fam === C.OTHER ? f.famOther.trim() : f.fam; }
  function subName(f) { return f.sub === C.OTHER ? f.subOther.trim() : f.sub; }
  function subInfo(f) { var l = OE.MODELS[f.fam] || []; for (var i = 0; i < l.length; i++) if (l[i].id === f.sub) return l[i]; return null; }
  function descOf(m) { var d = m.desc || {}; return typeof d === "string" ? d : (d[OE.S.lang] || d.nl || d.en || ""); }
  function exampleFor(fam) { var l = OE.MODELS[fam] || []; for (var i = 0; i < l.length; i++) if (l[i].img && !l[i].example) return l[i].img; return null; }

  SC.form = function () {
    var x = OE.t(), f = mem.form, fams = Object.keys(OE.MODELS);
    var famOpts = '<option value="">' + x.choose + "</option>" + fams.map(function (k) { return '<option value="' + esc(k) + '">' + esc(k) + "</option>"; }).join("") + '<option value="' + C.OTHER + '">' + x.other + "</option>";
    $("card").innerHTML = '<h2 class="q">' + x.formH + '</h2><div class="grid"><div class="col">' +
      '<label class="lbl" for="fam">' + x.family + ' *</label><select id="fam">' + famOpts + '</select><input id="famO" class="oth" placeholder="' + esc(x.otherPh) + '" hidden>' +
      '<label class="lbl" for="sub">' + x.sub + ' *</label><select id="sub"></select><input id="subO" class="oth" placeholder="' + esc(x.otherPh) + '" hidden>' +
      '<label class="lbl" for="dos">' + x.dossier + ' *</label><input id="dos" autocomplete="off" spellcheck="false" placeholder="' + esc(x.dossierPh) + '"><p class="hint" id="dosN"></p>' +
      '<div id="exist"></div>' +
      '<div class="two"><div><label class="lbl" for="ser">' + x.serial + ' *</label><input id="ser" autocomplete="off" spellcheck="false"></div>' +
      '<div><label class="lbl" for="ord">' + x.order + ' *</label><input id="ord" autocomplete="off" spellcheck="false"></div></div>' +
      '<label class="lbl" for="file">' + x.file + ' *</label><label class="drop" id="drop"><input type="file" id="file"><span id="fileT"></span></label>' +
      '<label class="lbl">' + x.dateNow + '</label><div class="now" id="now"></div>' +
      '</div><div class="col side"><figure class="prod" id="prod"></figure><p class="hint" id="pathP"></p></div></div>' +
      '<div id="err"></div><div class="btns"><button class="btn pri" id="save">' + x.save + "</button></div>";
    var fam = $("fam"), sub = $("sub");
    function fillSubs() {
      var l = OE.MODELS[f.fam] || [];
      sub.innerHTML = '<option value="">' + x.choose + "</option>" + l.map(function (m) { return '<option value="' + esc(m.id) + '">' + esc(m.id) + "</option>"; }).join("") + '<option value="' + C.OTHER + '">' + x.other + "</option>";
      sub.disabled = !f.fam; if (f.sub && (f.sub === C.OTHER || subInfo(f))) sub.value = f.sub; else { f.sub = ""; sub.value = ""; }
    }
    function upd() {
      $("famO").hidden = f.fam !== C.OTHER; $("subO").hidden = f.sub !== C.OTHER;
      var d = OE.safeName(f.dossier);
      $("dosN").innerHTML = f.dossier ? x.dossierFolder + ": <code>" + esc(d) + "</code>" : "";
      // product image
      var info = subInfo(f), img = info && info.img, ex = info && info.example, cap = "";
      if (!info && f.fam && OE.MODELS[f.fam]) { img = exampleFor(f.fam); ex = true; }
      if (img) cap = (info ? esc(info.id) : esc(f.fam)) + (ex ? ' <em class="ex">' + x.exampleImg + "</em>" : "");
      $("prod").innerHTML = img ? '<img id="prodImg" src="img/models/' + esc(img) + '.jpg" alt="' + esc(info ? info.id : f.fam) + '"><figcaption>' + cap + (info && info.desc ? '<small class="desc" id="prodDesc">' + esc(descOf(info)) + "</small>" : "") + "</figcaption>"
        : '<div class="noimg">' + (f.fam ? x.noImg : "") + "</div>";
      var fn = famName(f), sn = subName(f);
      $("pathP").innerHTML = fn && d ? "📁 " + esc(OE.fs.label() + "\\" + OE.safeName(fn, true) + "\\" + d) + (sn && f.file ? "<br>📄 " + esc(OE.fs.paramName(fn, sn, f.dossier, new Date(), f.file.name)) : "") : "";
      $("fileT").innerHTML = f.file ? "📎 <b>" + esc(f.file.name) + "</b> (" + Math.max(1, Math.round(f.file.size / 1024)) + " kB)" : x.fileDrop;
    }
    var chk = 0;
    function checkExisting() {
      var fn = famName(f), k = fn + "\u0000" + OE.safeName(f.dossier);
      if (k === mem.lastCheck && $("exist").innerHTML) return; // same dossier: keep the offer (avoids losing the click on blur)
      mem.lastCheck = k; var my = ++chk; $("exist").innerHTML = "";
      OE.fs.readMeta(fn, f.dossier).then(function (m) {
        if (my !== chk || !m || OE.S.screen !== "form") return;
        $("exist").innerHTML = '<div class="okmsg found" id="found"><b>' + x.existH + "</b><br>" + esc(OE.fmt(x.existP, { f: fn, d: OE.safeName(f.dossier), t: m.updatedHuman || "" })) +
          '<div class="btns"><button class="btn ok" id="load">' + x.existLoad + "</button></div></div>";
        OE.bind("load", function () {
          f.serial = m.serial || ""; f.order = m.order || ""; $("ser").value = f.serial; $("ord").value = f.order;
          if (m.submodel) { var l = OE.MODELS[f.fam] || []; if (l.some(function (s) { return s.id === m.submodel; })) f.sub = m.submodel; else { f.sub = C.OTHER; f.subOther = m.submodel; $("subO").value = f.subOther; } sub.value = f.sub; }
          $("exist").innerHTML = '<div class="okmsg" id="loaded">✓ ' + x.loaded + "</div>"; upd();
        });
      });
    }
    mem.lastCheck = null; fam.value = f.fam; fillSubs();
    $("famO").value = f.famOther; $("subO").value = f.subOther; $("dos").value = f.dossier; $("ser").value = f.serial; $("ord").value = f.order;
    fam.onchange = function () { f.fam = fam.value; f.sub = ""; fillSubs(); upd(); checkExisting(); };
    sub.onchange = function () { f.sub = sub.value; upd(); };
    $("famO").oninput = function () { f.famOther = this.value; upd(); };
    $("famO").onchange = checkExisting;
    $("subO").oninput = function () { f.subOther = this.value; upd(); };
    $("dos").oninput = function () { f.dossier = this.value; upd(); };
    $("dos").onchange = checkExisting;
    $("ser").oninput = function () { f.serial = this.value; };
    $("ord").oninput = function () { f.order = this.value; };
    $("file").onchange = function () { if (this.files[0]) { f.file = this.files[0]; upd(); } };
    var dr = $("drop");
    dr.ondragover = function (e) { e.preventDefault(); dr.classList.add("over"); };
    dr.ondragleave = function () { dr.classList.remove("over"); };
    dr.ondrop = function (e) { e.preventDefault(); dr.classList.remove("over"); var fl = e.dataTransfer.files; if (fl && fl[0]) { f.file = fl[0]; upd(); } };
    function tick() { if ($("now")) $("now").textContent = OE.human(new Date()); }
    tick(); clearInterval(mem.tick); mem.tick = setInterval(tick, 15000);
    upd(); if (f.dossier && f.fam) checkExisting();
    OE.bind("save", function () { save(x, f); });
  };

  /* ---------- save ---------- */
  function save(x, f) {
    var fn = famName(f), sn = subName(f), F = OE.fs, missing = [];
    [[fn, x.family], [sn, x.sub], [OE.safeName(f.dossier), x.dossier], [f.serial.trim(), x.serial], [f.order.trim(), x.order], [f.file, x.needFile]]
      .forEach(function (p) { if (!p[0]) missing.push(p[1]); });
    if (missing.length) { OE.err(OE.fmt(x.need, { f: missing.join(", ") })); return; }
    OE.err("");
    var now = new Date(), pname = F.paramName(fn, sn, f.dossier, now, f.file.name);
    F.ensure().then(function (ok) {
      if (!ok) { OE.go("folder"); return; }
      return F.wouldDelete(fn, f.dossier, pname).then(function (del) {
        if (del.length) OE.confirmModal(OE.fmt(x.delConfirm, { n: del.join("\n") }), function () { doSave(x, f, fn, sn, now, pname); });
        else doSave(x, f, fn, sn, now, pname);
      });
    }).catch(function (e) { OE.err(OE.fmt(x.saveErr, { e: e.message || e })); });
  }
  function doSave(x, f, fn, sn, now, pname) {
    var F = OE.fs, b = $("save"), S = OE.S, r = { pname: pname, deleted: [], overwrote: false }, dir;
    b.disabled = true; b.textContent = x.saving;
    var info = subInfo(f), img = info && info.img, example = !!(info && info.example);
    if (!info && OE.MODELS[f.fam]) { img = exampleFor(f.fam); example = true; }
    F.dossierDir(fn, f.dossier, true).then(function (d) { dir = d; return F.exists(dir, pname); })
      .then(function (ex) { r.overwrote = ex; return F.write(dir, pname, f.file); })
      .then(function () { return F.listParams(dir, fn, f.dossier); })
      .then(function (list) {
        var old = list.slice(C.KEEP); r.deleted = old.map(function (o) { return o.name; });
        return old.reduce(function (p, o) { return p.then(function () { return dir.removeEntry(o.name); }); }, Promise.resolve()).then(function () { return list.slice(0, C.KEEP); });
      })
      .then(function (files) {
        r.files = files; r.pdfName = F.pdfName(fn, sn, f.dossier);
        var meta = { app: C.APP, family: fn, submodel: sn, dossier: OE.safeName(f.dossier), dossierInput: f.dossier, serial: f.serial.trim(), order: f.order.trim(),
          technician: S.tech.first + " " + S.tech.last, updated: now.toISOString(), updatedHuman: OE.human(now), pdf: r.pdfName, files: files };
        return (img ? OE.loadImage("img/models/" + img + ".jpg").catch(function () { return null; }) : Promise.resolve(null)).then(function (im) {
          var blob = OE.buildPdf({ family: fn, sub: sn, dossier: OE.safeName(f.dossier), serial: meta.serial, order: meta.order, tech: meta.technician, updated: now, files: files, img: im, example: example });
          mem.pdfBlob = blob;
          return F.write(dir, r.pdfName, blob).then(function () { return F.write(dir, C.META, new Blob([JSON.stringify(meta, null, 2)], { type: "application/json" })); });
        });
      })
      .then(function () { r.folder = F.label() + "\\" + OE.safeName(fn, true) + "\\" + OE.safeName(f.dossier); mem.result = r; OE.go("result"); })
      .catch(function (e) { b.disabled = false; b.textContent = x.save; OE.err(OE.fmt(x.saveErr, { e: e.message || e })); });
  }

  /* ---------- result ---------- */
  SC.result = function () {
    var x = OE.t(), r = mem.result;
    if (!r) { OE.go("form"); return; }
    var h = '<div class="check">✓</div><h2 class="q center">' + x.resH + '</h2><ul class="list" id="res">' +
      "<li><span><b>" + x.resFolder + "</b>📁 " + esc(r.folder) + "</span></li>" +
      "<li><span><b>" + x.resFile + '</b><span id="rFile">' + esc(r.pname) + "</span>" + (r.overwrote ? '<em class="hint">' + x.resOver + "</em>" : "") + "</span></li>" +
      "<li><span><b>" + x.resPdf + '</b><span id="rPdf">' + esc(r.pdfName) + "</span></span></li>" +
      "<li><span><b>" + x.resMeta + "</b>" + esc(C.META) + "</span></li>" +
      (r.deleted.length ? '<li class="del"><span><b>' + x.resDel + '</b><span id="rDel">🗑 ' + r.deleted.map(esc).join("<br>🗑 ") + "</span></span></li>" : "") +
      "</ul><h3 class=\"sub\">" + x.resList + '</h3><ul class="res" id="rList">' +
      r.files.map(function (f, i) { return "<li>" + (i === 0 ? '<span class="badge g">' + x.active + "</span> " : "") + "<b>" + esc(f.name) + "</b><em>" + OE.stampHuman(f.stamp) + "</em></li>"; }).join("") +
      '</ul><div class="btns"><button class="btn sec" id="newD">' + x.newDev + '</button><button class="btn pri" id="openP">' + x.openPdf + "</button></div>";
    $("card").innerHTML = h;
    OE.bind("newD", function () { mem.form = blank(); mem.result = null; OE.go("form", -1); });
    OE.bind("openP", function () { if (!mem.pdfBlob) return; var u = URL.createObjectURL(mem.pdfBlob); window.open(u, "_blank"); setTimeout(function () { URL.revokeObjectURL(u); }, 60000); });
  };
})(window.OE);
