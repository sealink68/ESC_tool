/* config.js – ALL fixed texts and labels (NL + FR) and settings.
   Change wording here; no other file contains user-facing text. */
"use strict";
var OE = window.OE = window.OE || {};
OE.CFG = {
  APP: "ESC_tool",
  SUBDIR: "projecten",          // working folder inside ESC-Share
  SHARE: "ESC-Share",
  KEEP: 3,                      // parameter files kept per dossier folder
  META: "_esc_info.json",
  OTHER: "__other__"
};

OE.T = {
  nl: {
    title: "ESC_tool", langNl: "Nederlands", langFr: "Français",
    other: "Ander…", otherPh: "Vrije tekst",
    techH: "Wie ben je?", techP: "Je naam komt in de PDF als technieker. Wordt enkel op deze laptop bewaard.",
    first: "Voornaam", last: "Achternaam", firstPh: "bv. Jan", lastPh: "bv. Peeters", needName: "Vul voor- en achternaam in.",
    techStart: "Verder", techSave: "Opslaan", back: "Terug",
    folderH: "Map kiezen", folderP: "Kies één keer de door OneDrive gesynchroniseerde map ‘ESC-Share’ (of rechtstreeks de submap ‘projecten’).",
    folderPick: "📁 Map kiezen", folderChange: "📁 Andere map kiezen", folderRenew: "🔓 Toegang tot map hernieuwen",
    folderRenewP: "De browser vraagt na een herstart opnieuw toestemming om in de map te schrijven.",
    folderNow: "Gekozen map", folderUse: "projecten-map", folderOk: "Verder naar formulier",
    folderDenied: "Geen toegang tot de map gekregen. Probeer opnieuw.",
    folderErr: "De map kon niet geopend worden: {e}",
    unsupH: "Browser niet ondersteund",
    unsupP: "Deze app heeft toegang nodig tot een map op je laptop (File System Access API). Dat werkt enkel in Microsoft Edge of Google Chrome. Open https://sealink68.github.io/ESC_tool/ in Edge of Chrome.",
    formH: "Toestelgegevens", family: "Toestelfamilie", sub: "Submodel", choose: "— kies —",
    dossier: "Dossiernummer (ServiceMax)", dossierPh: "bv. 00123456", serial: "Serienummer", order: "Ordernummer",
    dossierFolder: "Mapnaam", file: "Parameterbestand", fileDrop: "Sleep het bestand hierheen of klik om te kiezen",
    fileNone: "Geen bestand gekozen", dateNow: "Datum en tijd (automatisch)",
    exampleImg: "Voorbeeldafbeelding familie", noImg: "Geen afbeelding beschikbaar",
    save: "💾 Opslaan", saving: "Bezig met opslaan…",
    need: "Vul alle verplichte velden in: {f}.", needFile: "parameterbestand",
    existH: "Bestaand dossier gevonden", existP: "Voor {f} / {d} bestaan al gegevens (laatst bijgewerkt {t}).",
    existLoad: "Gegevens laden", loaded: "Gegevens geladen.",
    delConfirm: "Er worden max. 3 parameterbestanden bewaard. Het oudste bestand wordt verwijderd:\n{n}\n\nDoorgaan?",
    resH: "Opgeslagen", resFolder: "Map", resFile: "Parameterbestand", resPdf: "PDF", resMeta: "Gegevensbestand",
    resDel: "Verwijderd (oudste, max. 3)", resList: "Parameterbestanden in de map", active: "actief bij laatste bezoek",
    resOver: "Bestaand bestand met dezelfde naam werd overschreven.",
    newDev: "➕ Nieuw toestel", openPdf: "📄 Open PDF", saveErr: "Opslaan mislukt: {e}",
    settings: "⚙ Instellingen", setH: "Instellingen", setName: "Naam technieker", setFolder: "Map", setLang: "Taal",
    numInfo: "Waar vind ik het serienummer en ordernummer?",
    capPlate: "Nieuw typeplaatje: rood = serienummer (S/N), blauw = ordernummer",
    capProto: "Ouder Kaba-protocol: rood = serienummer (Fabrik-Nr.), blauw = ordernummer (Auftrags-Nr.)",
    enlarge: "Klik om te vergroten",
    edit: "Wijzigen", close: "Sluiten", yes: "Ja", no: "Nee", ok: "OK", cancel: "Annuleren", none: "—"
  },
  fr: {
    title: "ESC_tool", langNl: "Nederlands", langFr: "Français",
    other: "Autre…", otherPh: "Texte libre",
    techH: "Qui êtes-vous ?", techP: "Votre nom figure dans le PDF comme technicien. Il est conservé uniquement sur cet ordinateur.",
    first: "Prénom", last: "Nom", firstPh: "p. ex. Jean", lastPh: "p. ex. Dupont", needName: "Indiquez le prénom et le nom.",
    techStart: "Continuer", techSave: "Enregistrer", back: "Retour",
    folderH: "Choisir le dossier", folderP: "Choisissez une seule fois le dossier synchronisé par OneDrive « ESC-Share » (ou directement son sous-dossier « projecten »).",
    folderPick: "📁 Choisir le dossier", folderChange: "📁 Choisir un autre dossier", folderRenew: "🔓 Renouveler l'accès au dossier",
    folderRenewP: "Après un redémarrage, le navigateur redemande l'autorisation d'écrire dans le dossier.",
    folderNow: "Dossier choisi", folderUse: "dossier projecten", folderOk: "Continuer vers le formulaire",
    folderDenied: "L'accès au dossier n'a pas été accordé. Réessayez.",
    folderErr: "Impossible d'ouvrir le dossier : {e}",
    unsupH: "Navigateur non pris en charge",
    unsupP: "Cette application doit accéder à un dossier de votre ordinateur (File System Access API). Cela fonctionne uniquement dans Microsoft Edge ou Google Chrome. Ouvrez https://sealink68.github.io/ESC_tool/ dans Edge ou Chrome.",
    formH: "Données de l'appareil", family: "Famille d'appareil", sub: "Sous-modèle", choose: "— choisir —",
    dossier: "Numéro de dossier (ServiceMax)", dossierPh: "p. ex. 00123456", serial: "Numéro de série", order: "Numéro de commande",
    dossierFolder: "Nom du dossier", file: "Fichier de paramètres", fileDrop: "Glissez le fichier ici ou cliquez pour choisir",
    fileNone: "Aucun fichier choisi", dateNow: "Date et heure (automatique)",
    exampleImg: "Image d'exemple de la famille", noImg: "Pas d'image disponible",
    save: "💾 Enregistrer", saving: "Enregistrement…",
    need: "Complétez tous les champs obligatoires : {f}.", needFile: "fichier de paramètres",
    existH: "Dossier existant trouvé", existP: "Des données existent déjà pour {f} / {d} (dernière mise à jour {t}).",
    existLoad: "Charger les données", loaded: "Données chargées.",
    delConfirm: "Au maximum 3 fichiers de paramètres sont conservés. Le fichier le plus ancien sera supprimé :\n{n}\n\nContinuer ?",
    resH: "Enregistré", resFolder: "Dossier", resFile: "Fichier de paramètres", resPdf: "PDF", resMeta: "Fichier de données",
    resDel: "Supprimé (le plus ancien, max. 3)", resList: "Fichiers de paramètres dans le dossier", active: "actif lors de la dernière visite",
    resOver: "Un fichier existant portant le même nom a été remplacé.",
    newDev: "➕ Nouvel appareil", openPdf: "📄 Ouvrir le PDF", saveErr: "Échec de l'enregistrement : {e}",
    settings: "⚙ Paramètres", setH: "Paramètres", setName: "Nom du technicien", setFolder: "Dossier", setLang: "Langue",
    numInfo: "Où trouver le numéro de série et le numéro de commande ?",
    capPlate: "Nouvelle plaque signalétique : rouge = numéro de série (S/N), bleu = numéro de commande",
    capProto: "Ancien protocole Kaba : rouge = numéro de série (Fabrik-Nr.), bleu = numéro de commande (Auftrags-Nr.)",
    enlarge: "Cliquer pour agrandir",
    edit: "Modifier", close: "Fermer", yes: "Oui", no: "Non", ok: "OK", cancel: "Annuler", none: "—"
  }
};

/* Bilingual PDF labels (always NL / FR). */
OE.PDFT = {
  title: "ESC_tool – Toestelgegevens / Données de l'appareil",
  family: "Toestelfamilie / Famille d'appareil",
  sub: "Toestelmodel / Modèle",
  dossier: "Dossiernummer / Numéro de dossier",
  serial: "Serienummer / Numéro de série",
  order: "Ordernummer / Numéro de commande",
  tech: "Technieker / Technicien",
  updated: "Laatste update / Dernière mise à jour",
  files: "Parameterbestanden / Fichiers de paramètres (max. 3)",
  active: "ACTIEF bij laatste bezoek / ACTIF lors de la dernière visite",
  date: "Datum / Date",
  example: "Voorbeeldafbeelding familie / Image d'exemple de la famille",
  footer: "Gegenereerd met ESC_tool / Généré avec ESC_tool"
};

/* Per-screen help ("?" button). "• " lines become a bullet list. */
OE.HELP = {
  nl: {
    title: "Help", close: "Sluiten",
    lang: ["Kies de taal van de app. Je kan later altijd wisselen met NL / FR bovenaan."],
    tech: ["Vul je voor- en achternaam in.", "• Je naam verschijnt als technieker in de PDF.", "• Wordt enkel in deze browser bewaard; wijzigen kan via ⚙ Instellingen."],
    folder: ["De app schrijft rechtstreeks in de OneDrive-map ‘ESC-Share’ op je laptop.",
      "• Kies ‘ESC-Share’ of meteen de submap ‘projecten’. Bij ‘ESC-Share’ wordt ‘projecten’ gebruikt (en aangemaakt indien nodig).",
      "• Na een herstart van de browser vraagt die opnieuw toestemming: klik dan op ‘Toegang tot map hernieuwen’.",
      "• Werkt enkel in Microsoft Edge of Google Chrome."],
    form: ["Vul de gegevens van het toestel in en kies het parameterbestand.",
      "• Familie en submodel bepalen de mapnaam en de bestandsnaam. Staat het model er niet bij? Kies ‘Ander…’.",
      "• Het dossiernummer wordt de mapnaam: spaties en tekens \\ / : * ? \" < > | worden ‘_’.",
      "• Serienummer en ordernummer: op het typeplaatje van het toestel staat het serienummer na ‘S/N:’ en het ordernummer naast de datum. Op een ouder groen Kaba-protocol (Werkstattabnahmeprotokoll) is het serienummer de ‘Fabrik-Nr.’ en het ordernummer de ‘Auftrags-Nr.’. Zie het ⓘ-icoon naast de velden.",
      "• Bestaat het dossier al, dan kan je de gegevens laden.",
      "• Per dossier worden max. 3 parameterbestanden bewaard; het oudste wordt verwijderd (je krijgt eerst een melding).",
      "• Datum en tijd worden automatisch ingevuld."],
    result: ["Overzicht van wat er in de map werd opgeslagen.",
      "• ‘Open PDF’ toont de infofiche (ook opgeslagen in de map).",
      "• ‘Nieuw toestel’ maakt het formulier leeg; je naam blijft bewaard."],
    settings: ["Wijzig hier je naam, de gekozen map of de taal."]
  },
  fr: {
    title: "Aide", close: "Fermer",
    lang: ["Choisissez la langue de l'application. Vous pouvez toujours changer avec NL / FR en haut."],
    tech: ["Indiquez votre prénom et votre nom.", "• Votre nom figure comme technicien dans le PDF.", "• Conservé uniquement dans ce navigateur ; modifiable via ⚙ Paramètres."],
    folder: ["L'application écrit directement dans le dossier OneDrive « ESC-Share » de votre ordinateur.",
      "• Choisissez « ESC-Share » ou directement le sous-dossier « projecten ». Avec « ESC-Share », « projecten » est utilisé (et créé si nécessaire).",
      "• Après un redémarrage, le navigateur redemande l'autorisation : cliquez sur « Renouveler l'accès au dossier ».",
      "• Fonctionne uniquement dans Microsoft Edge ou Google Chrome."],
    form: ["Complétez les données de l'appareil et choisissez le fichier de paramètres.",
      "• La famille et le sous-modèle déterminent le nom du dossier et du fichier. Modèle absent ? Choisissez « Autre… ».",
      "• Le numéro de dossier devient le nom du dossier : les espaces et les caractères \\ / : * ? \" < > | deviennent « _ ».",
      "• Numéro de série et numéro de commande : sur la plaque signalétique de l'appareil, le numéro de série suit « S/N: » et le numéro de commande se trouve à côté de la date. Sur un ancien protocole Kaba vert (Werkstattabnahmeprotokoll), le numéro de série est le « Fabrik-Nr. » et le numéro de commande l'« Auftrags-Nr. ». Voir l'icône ⓘ à côté des champs.",
      "• Si le dossier existe déjà, vous pouvez charger ses données.",
      "• Au maximum 3 fichiers de paramètres sont conservés par dossier ; le plus ancien est supprimé (avec avertissement préalable).",
      "• La date et l'heure sont remplies automatiquement."],
    result: ["Aperçu de ce qui a été enregistré dans le dossier.",
      "• « Ouvrir le PDF » affiche la fiche (aussi enregistrée dans le dossier).",
      "• « Nouvel appareil » vide le formulaire ; votre nom est conservé."],
    settings: ["Modifiez ici votre nom, le dossier choisi ou la langue."]
  }
};
