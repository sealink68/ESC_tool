# ESC_tool

Static web app for dormakaba technicians (security entrances / access control: sensor barriers, turnstiles,
revolving doors, interlocks). It saves a device's parameter file plus a bilingual (NL/FR) info PDF straight into
the OneDrive-synced folder `ESC-Share\projecten` on the Windows laptop.

Live (GitHub Pages): https://sealink68.github.io/ESC_tool/

## Requirements
- **Microsoft Edge or Google Chrome** (desktop). The app uses the File System Access API (`showDirectoryPicker`);
  Firefox and Safari get a clear NL/FR message.
- No backend, no accounts, no secrets, no network calls besides loading the app itself.

## Flow
1. First start: language (NL/FR), then the technician's first and last name (localStorage; change via ⚙).
2. Once: pick the folder `ESC-Share` (its `projecten` subfolder is used/created) or `projecten` directly.
   The handle is kept in IndexedDB. After a browser restart, click **Toegang tot map hernieuwen / Renouveler l'accès au dossier**.
3. Form: device family + sub-model (with *Ander… / Autre…* free text), Dossiernummer (ServiceMax), Serienummer,
   Ordernummer, the parameter file (click or drag & drop). Date/time are automatic.
4. **Opslaan / Enregistrer** writes into `projecten\<Family>\<Dossier>\`:
   - `<Family>_<Submodel>_<Dossier>_<YYYY-MM-DD_HHMM>.<ext>` – the parameter file (original extension kept);
   - max. **3** parameter files per dossier: the oldest beyond 3 is deleted (the user is warned first and the
     result screen names it). The newest is *actief bij laatste bezoek / actif lors de la dernière visite*;
   - `<Family>_<Submodel>_<Dossier>_info.pdf` – A4, NL/FR labels, product image, all values as selectable text;
   - `_esc_info.json` – metadata, used to offer prefill when the same family + dossier is entered again.
5. Result screen: folder, file names, deleted file; **Nieuw toestel / Nouvel appareil** and **Open PDF**.

Existing dossiers: the search is hidden by default; the 🔍 button **Bestaand dossier zoeken / Rechercher un dossier
existant** next to the form title opens it (click again, ✕ or Esc closes it). Picking a dossier fills the form.

The ? help also explains, in numbered steps, how to check the OneDrive folder (**Map controleren / Vérifier le dossier**)
and how to install the app (**App installeren / Installer l'app**).

## Desktop app (PWA)
`manifest.webmanifest` + `sw.js` make the site installable in Edge/Chrome (address-bar install icon, or Edge ⋯ > Apps >
*Deze site als app installeren*). The icon is the old grey Kaba wordmark (`icons/`, from Wikimedia Commons
*Kaba Group logo.svg*, recoloured grey). The service worker only caches the app shell: network-first for
HTML/JS/CSS/manifest, cache-first for images; it never handles File System Access or IndexedDB. Bump
`CACHE_VERSION` in `sw.js` when the shell file list changes.

Names are made Windows-safe: spaces and `\ / : * ? " < > |` become `_`, trailing dots/spaces are removed
(sub-models also collapse repeated `_`, e.g. `Argus 60` → `Argus_60`).

## Structure (no build step, classic scripts)
```
index.html
css/style.css
js/config.js       all NL/FR texts, PDF labels, help texts, settings
js/models.js       families / sub-models, image mapping, short descriptions
js/i18n.js         language + name sanitizing + date helpers
js/storage.js      localStorage state, IndexedDB (folder handle)
js/fsx.js          folder access, naming, retention, metadata
js/pdf.js          info PDF (jsPDF)
js/ui/common.js    header, logo fit, modal, per-screen help
js/ui/screens.js   screens: lang, tech, folder, form, result, settings
js/app.js          bootstrap + service worker registration
manifest.webmanifest, sw.js   PWA (install as desktop app)
icons/             PWA icons (192, 512, maskable 192/512, apple-touch-icon 180, kaba-logo.svg)
js/vendor/jspdf.umd.min.js  (vendored, MIT – see jspdf.LICENSE)
img/models/*.jpg   product images (dormakaba "Product Overview Security Gates" 02/2025 and dormakaba brochures)
img/logo-full.svg, img/logo-mark.svg
.github/workflows/pages.yml  GitHub Pages deploy on push to main
```
Texts: edit `js/config.js` only. Models: edit `js/models.js` (`example: true` = image of a sibling model of the
same family, shown as *Voorbeeldafbeelding familie / Image d'exemple de la famille*).

## Deploy
Push to `main`; the workflow publishes the repo root to Pages. If needed, set *Settings → Pages → Source: GitHub Actions*.
