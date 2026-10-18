/* fsx.js – File System Access: folder handle, permission, dossier folders, naming, retention, metadata. */
"use strict";
(function (OE) {
  var C = OE.CFG, F = OE.fs = { root: null, picked: null, state: "none" }; // state: unsupported|none|prompt|granted
  F.supported = function () { return typeof window.showDirectoryPicker === "function"; };
  function perm(h, ask) {
    if (!h.queryPermission) return Promise.resolve("granted"); // e.g. OPFS handles
    var o = { mode: "readwrite" };
    return h.queryPermission(o).then(function (p) { return p === "granted" || !ask ? p : h.requestPermission(o); });
  }
  /* ESC-Share -> its "projecten" subfolder (created if missing); a folder already named "projecten" is used as is. */
  function useHandle(h) {
    F.picked = h;
    var p = h.name.toLowerCase() === C.SUBDIR ? Promise.resolve(h) : h.getDirectoryHandle(C.SUBDIR, { create: true });
    return p.then(function (r) { F.root = r; F.state = "granted"; return r; });
  }
  F.init = function () {
    if (!F.supported()) { F.state = "unsupported"; return Promise.resolve(F.state); }
    return OE.idbGet("dir").then(function (h) {
      if (!h) { F.state = "none"; return F.state; }
      F.picked = h;
      return perm(h, false).then(function (p) {
        if (p === "granted") return useHandle(h).then(function () { return F.state; });
        F.state = "prompt"; return F.state;
      });
    }).catch(function () { F.state = "none"; return F.state; });
  };
  F.pick = function () { // must run inside a user gesture
    return window.showDirectoryPicker({ id: "esc-share", mode: "readwrite" }).then(function (h) {
      return perm(h, true).then(function (p) {
        if (p !== "granted") throw new Error("denied");
        return OE.idbSet("dir", h).catch(function () {}).then(function () { return useHandle(h); });
      });
    });
  };
  F.renew = function () { // user gesture
    return perm(F.picked, true).then(function (p) { if (p !== "granted") throw new Error("denied"); return useHandle(F.picked); });
  };
  F.ensure = function () { // before a write: still allowed?
    if (!F.picked) return Promise.resolve(false);
    return perm(F.picked, false).then(function (p) { if (p !== "granted") F.state = "prompt"; return p === "granted"; });
  };
  F.label = function () {
    if (!F.picked) return "";
    return F.picked.name.toLowerCase() === C.SUBDIR ? F.picked.name : F.picked.name + "\\" + C.SUBDIR;
  };

  /* ---- naming ---- */
  F.base = function (fam, sub, dos) { return OE.safeName(fam, true) + "_" + OE.safeName(sub, true) + "_" + OE.safeName(dos); };
  F.ext = function (name) { var m = /\.([^.\\/]+)$/.exec(name || ""); return m ? "." + m[1] : ""; };
  F.paramName = function (fam, sub, dos, date, orig) { return F.base(fam, sub, dos) + "_" + OE.stamp(date) + F.ext(orig); };
  F.pdfName = function (fam, sub, dos) { return F.base(fam, sub, dos) + "_info.pdf"; };
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  /* Parameter files of this dossier: <Family>_<anything>_<Dossier>_<YYYY-MM-DD_HHMM>[.ext]; the sub-model part is free
     so files saved under an earlier sub-model choice of the same dossier also count. Newest first. */
  /* Retention groups: extension, case-insensitive (".XML" == ".xml"); no extension = own group "". */
  F.extKey = function (name) { return F.ext(name).toLowerCase(); };
  /* [{ext, files:[newest first]}], groups ordered by their newest file. */
  F.groups = function (files) {
    var g = {}, order = [];
    (files || []).forEach(function (f) { var k = f.ext != null ? f.ext : F.extKey(f.name); if (!g[k]) { g[k] = []; order.push(k); } g[k].push(f); });
    return order.map(function (k) { return { ext: k, files: g[k] }; });
  };
  /* Keep max KEEP per extension group; returns {keep, drop} (input newest first). */
  F.retain = function (files) {
    var n = {}, keep = [], drop = [];
    files.forEach(function (f) { var k = F.extKey(f.name); n[k] = (n[k] || 0) + 1; (n[k] > C.KEEP ? drop : keep).push(f); });
    return { keep: keep, drop: drop };
  };
  F.listParams = function (dir, fam, dos) {
    var re = new RegExp("^" + reEsc(OE.safeName(fam, true)) + "_.+_" + reEsc(OE.safeName(dos)) + "_(\\d{4}-\\d\\d-\\d\\d_\\d{4})(\\.[^.]+)?$");
    var out = [];
    return (async function () {
      for await (var e of dir.values()) { if (e.kind === "file") { var m = re.exec(e.name); if (m) out.push({ name: e.name, stamp: m[1], ext: F.extKey(e.name) }); } }
      out.sort(function (a, b) { return a.stamp < b.stamp ? 1 : a.stamp > b.stamp ? -1 : (a.name < b.name ? 1 : -1); });
      return out;
    })();
  };
  F.dossierDir = function (fam, dos, create) {
    var o = { create: !!create };
    return F.root.getDirectoryHandle(OE.safeName(fam, true), o).then(function (d) { return d.getDirectoryHandle(OE.safeName(dos), o); });
  };
  F.exists = function (dir, name) { return dir.getFileHandle(name).then(function () { return true; }, function () { return false; }); };
  F.write = function (dir, name, data) {
    return dir.getFileHandle(name, { create: true }).then(function (fh) {
      return fh.createWritable().then(function (w) { return w.write(data).then(function () { return w.close(); }); });
    });
  };
  F.readMeta = function (fam, dos) {
    if (!F.root || !fam || !OE.safeName(dos)) return Promise.resolve(null);
    return F.dossierDir(fam, dos, false).then(function (d) { return d.getFileHandle(C.META); })
      .then(function (fh) { return fh.getFile(); }).then(function (f) { return f.text(); }).then(JSON.parse)
      .catch(function () { return null; });
  };
  /* All existing dossiers: projecten/<Family>/<Dossier>/ -> _esc_info.json if present, else folder name + newest
     parameter file. Newest first. */
  F.scan = function () {
    var out = [], STAMP = /_(\d{4}-\d\d-\d\d_\d{4})(\.[^.]+)?$/;
    function toIso(st) { var m = /^(\d{4})-(\d\d)-(\d\d)_(\d\d)(\d\d)$/.exec(st || ""); return m ? new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5]).toISOString() : ""; }
    return (async function () {
      for await (var fd of F.root.values()) {
        if (fd.kind !== "directory") continue;
        for await (var dd of fd.values()) {
          if (dd.kind !== "directory") continue;
          var meta = null, files = [];
          try { meta = JSON.parse(await (await (await dd.getFileHandle(C.META)).getFile()).text()); } catch (e) { meta = null; }
          try { files = await F.listParams(dd, fd.name, dd.name); } catch (e) { files = []; }
          if (!files.length) { // fall back: any file with a timestamp in the name
            for await (var e of dd.values()) { var m = e.kind === "file" && STAMP.exec(e.name); if (m) files.push({ name: e.name, stamp: m[1], ext: F.extKey(e.name) }); }
            files.sort(function (a, b) { return a.stamp < b.stamp ? 1 : -1; });
          }
          var m2 = meta || {};
          out.push({ family: fd.name, folder: dd.name, dossier: m2.dossierInput || m2.dossier || dd.name, sub: m2.submodel || "", serial: m2.serial || "", order: m2.order || "",
            updated: m2.updated || toIso(files[0] && files[0].stamp), files: F.retain(files).keep, meta: !!meta });
        }
      }
      out.sort(function (a, b) { return a.updated < b.updated ? 1 : a.updated > b.updated ? -1 : 0; });
      return out;
    })();
  };
  /* Which file(s) would be removed if a new one named `name` is added. */
  F.wouldDelete = function (fam, dos, name) {
    return F.dossierDir(fam, dos, false).then(function (d) { return F.listParams(d, fam, dos); }, function () { return []; }).then(function (l) {
      var st = /_(\d{4}-\d\d-\d\d_\d{4})(\.[^.]+)?$/.exec(name)[1];
      var all = l.filter(function (f) { return f.name !== name; }).concat([{ name: name, stamp: st }]);
      all.sort(function (a, b) { return a.stamp < b.stamp ? 1 : a.stamp > b.stamp ? -1 : (a.name < b.name ? 1 : -1); });
      return F.retain(all).drop.map(function (f) { return f.name; });
    });
  };
})(window.OE);
