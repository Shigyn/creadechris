// ===================================================================
//  Créa de Chris — generateur du site (LocWeb, 2026-11-02)
//     node build.mjs          -> apercu (noindex)
//     PROD=1 node build.mjs   -> mise en ligne
//  Apercu spontane : ce qu'on sait d'elle vient de sa page Facebook
//  (vignettes : sacs a dos brodes au prenom, ensembles creche/maternelle
//  sac + doudou + snood, logo « 100 % fait main et avec amour ») et du
//  registre des entreprises. Rien d'invente : pas de prix, pas d'adresse
//  (729 chemin Notre-Dame = domicile probable), seulement la commune.
// ===================================================================
import fs from 'node:fs';
import path from 'node:path';

const ICI = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1');
const PROD = process.env.PROD === '1';
const URL_SITE = PROD ? 'https://www.creadechris.fr/' : 'https://shigyn.github.io/creadechris/';
const PHOTOS = JSON.parse(fs.readFileSync(path.join(ICI, '_source', 'photos.json'), 'utf8'));
const V = '4';

const E = {
  nom: 'Créa de Chris',
  autreNom: 'Les Créas de Chris',
  devise: '100 % fait main et avec amour',
  prenom: 'Chris',
  dirigeante: 'Christelle Poupardin',
  siret: '793 899 568 00026',
  ville: 'Lançon-de-Provence',
  codePostal: '13680',
  departement: 'Bouches-du-Rhône',
  facebook: 'https://www.facebook.com/christelle.poupardin.5',
  messenger: 'https://m.me/christelle.poupardin.5',
  // Son numero WhatsApp, format international sans + (ex. 33612345678).
  // Vide tant qu'on ne l'a pas : WhatsApp s'ouvre et le client choisit le contact.
  whatsapp: '',
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (ch) => URL_SITE + ch;
function img(r, nom, alt, { eager = false, sizes = '(min-width: 900px) 40vw, 100vw', cls = '' } = {}) {
  const p = PHOTOS[nom];
  if (!p) throw new Error('photo inconnue : ' + nom);
  const srcset = p.l > 800 ? ` srcset="${r}photos/${nom}-800.webp 800w, ${r}photos/${nom}-1600.webp ${p.l}w" sizes="${sizes}"` : '';
  return `<img${cls ? ` class="${cls}"` : ''} src="${r}photos/${nom}-800.webp"${srcset} alt="${esc(alt)}" width="${p.l}" height="${p.h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

const I = {
  fleche: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 5.3 19.9 12l-6.7 6.7-1.4-1.4 4.3-4.3H4v-2h12.1l-4.3-4.3z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.4V14h2.7v8z"/></svg>',
  msg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.5 2 2 6.1 2 11.3c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.2S17.5 2 12 2zm1 12.4-2.5-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  ok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 16.6 4.9 12l-1.4 1.4 6 6 11-11-1.4-1.4z"/></svg>',
  // Une aiguillee : le fil qui court entre les sections.
  fil: '<svg class="fil" viewBox="0 0 140 24" aria-hidden="true"><path d="M2 14c18-12 30 8 48-2s30-10 46 2 28 4 42-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="5 5"/></svg>',
};

/* Ce qu'elle coud, d'apres ses publications. Pas de prix : elle les donne
   a la demande (a lui faire confirmer avant la mise en ligne). */
const CREATIONS = [
  {
    id: 'sac', nom: 'Un sac à dos à son prénom', eti: 'Le plus demandé',
    photos: [['enfant-sac-a-dos-allee', 'Enfant de dos avec son petit sac à dos'], ['enfant-sac-a-dos-cire-jaune', 'Enfant en ciré jaune avec son sac à dos']],
    titre: 'Le sac à dos <em>à son prénom</em>',
    texte: 'Le petit sac pour la crèche ou l’école, avec son rabat brodé au prénom de l’enfant. Il le reconnaît du premier coup d’œil, et il ne se perd plus.',
    points: ['Rabat brodé au prénom', 'Taille pensée pour les petits dos', 'Tissu au choix : ses héros, des motifs, des unis'],
  },
  {
    id: 'ensemble', nom: 'L’ensemble crèche & maternelle (sac, doudou, snood)', eti: 'Pour la rentrée',
    photos: [['sac-a-dos-pose', 'Petit sac à dos posé sur une table'], ['doudou-elephant', 'Doudou éléphant en tissu'], ['tissus-plies', 'Tissus colorés pliés']],
    titre: 'L’ensemble <em>crèche &amp; maternelle</em>',
    texte: 'Le sac à dos, son doudou et son snood, cousus dans le même tissu : tout ce qu’il faut pour la crèche ou l’entrée en maternelle, assorti et prêt à partir.',
    points: ['Sac à dos brodé au prénom', 'Doudou et snood assortis', 'Les trois dans le même tissu'],
  },
  {
    id: 'doudou', nom: 'Un doudou', eti: 'Le compagnon',
    photos: [['doudous-lapins-panier', 'Doudous lapins en tissu dans un panier'], ['linge-bebe-panier', 'Linge doux pour bébé dans un panier']],
    titre: 'Le doudou <em>tout doux</em>',
    texte: 'Fait pour être serré fort et traîner partout. Dans le tissu de votre choix, assorti à son sac si vous le souhaitez.',
    points: ['Cousu main, pièce unique', 'Tissu au choix', 'Assorti au sac sur demande'],
  },
];
const WA = `https://wa.me/${E.whatsapp}`;
const NOMS_MODELES =[...CREATIONS.map((c) => [c.id, c.nom]), ['autre', 'Autre chose']];
const TISSUS = [['rose', 'Rose poudré'], ['nuit', 'Bleu nuit'], ['lin', 'Lin naturel'], ['sauge', 'Vert sauge']];
const FILS = [['blanc', 'Blanc'], ['or', 'Doré'], ['rose', 'Rose'], ['nuit', 'Bleu nuit']];

/* ---------------- donnees structurees ---------------- */
const ENTITE = {
  '@type': 'LocalBusiness',
  '@id': URL_SITE + '#entreprise',
  name: E.nom,
  alternateName: E.autreNom,
  description: 'Couture pour enfants faite main à Lançon-de-Provence : sacs à dos brodés au prénom, ensembles crèche et maternelle (sac, doudou, snood), doudous.',
  slogan: E.devise,
  url: URL_SITE,
  image: URL_SITE + 'photos/partage.jpg',
  founder: { '@type': 'Person', name: E.dirigeante },
  address: { '@type': 'PostalAddress', addressLocality: E.ville, postalCode: E.codePostal, addressRegion: 'Provence-Alpes-Côte d’Azur', addressCountry: 'FR' },
  areaServed: ['Lançon-de-Provence', 'Salon-de-Provence', 'Pélissanne', 'La Fare-les-Oliviers', 'Rognac', 'Berre-l’Étang', 'Bouches-du-Rhône'].map((v) => ({ '@type': 'Place', name: v })),
  sameAs: [E.facebook],
  makesOffer: ['Sac à dos enfant brodé au prénom', 'Ensemble crèche et maternelle', 'Doudou fait main', 'Snood enfant'].map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Product', name: n } })),
};

/* ---------------- gabarit ---------------- */
const NAV = [['#creations', 'Créations'], ['#prenom', 'Son prénom brodé'], ['#comment', 'Comment ça marche'], ['#chris', 'Qui suis-je'], ['#commander', 'Commander']];

function page(chemin, { titre, description, corps, schemas = [], classe = '' }) {
  const r = '../'.repeat(chemin.split('/').filter(Boolean).length);
  const accueil = r || './';
  const lien = (h) => (chemin === '' ? h : accueil + h);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>document.documentElement.classList.add('js')</script>
<title>${esc(titre)}</title>
<meta name="description" content="${esc(description)}">
${PROD ? '' : '<meta name="robots" content="noindex,nofollow">\n'}<link rel="canonical" href="${abs(chemin)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="${esc(E.nom)}">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${URL_SITE}photos/partage.jpg">
<meta name="theme-color" content="#fbf6f4">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='15' fill='%23f3d9d7' stroke='%23b48a3e' stroke-width='1.5' stroke-dasharray='3 2'/%3E%3Ctext x='16' y='22' font-size='16' text-anchor='middle' fill='%232e2b3f' font-family='Georgia' font-style='italic'%3EC%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..600,100;1,9..144,400..600,100&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&family=Allura&family=Baloo+2:wght@600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/style.css?v=${V}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [ENTITE, ...schemas] })}</script>
</head>
<body class="${classe}">
<a class="evitement" href="#contenu">Aller au contenu</a>

<header class="entete" data-entete>
  <div class="entete-in">
    <a class="marque" href="${accueil}" aria-label="${esc(E.nom)}, accueil">
      <span class="marque-nom">Créa de Chris</span>
      <span class="marque-devise">${esc(E.devise)}</span>
    </a>
    <nav class="nav" aria-label="Navigation principale">
      ${NAV.map(([h, t]) => `<a href="${lien(h)}">${t}</a>`).join('\n      ')}
    </nav>
    <a class="bouton bouton-plein entete-cta" href="${lien('#commander')}" data-commander="">Passer commande</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu-mobile" aria-label="Ouvrir le menu"><span></span><span></span></button>
  </div>
  <div class="menu-mobile" id="menu-mobile" hidden>
    ${NAV.map(([h, t]) => `<a href="${lien(h)}">${t}</a>`).join('\n    ')}
    <a class="bouton bouton-plein" href="${lien('#commander')}" data-commander="">Passer commande</a>
  </div>
</header>

<main id="contenu">
${corps(r)}
</main>

<footer class="pied">
  <div class="cadre pied-haut">
    <div>
      <p class="pied-nom">Créa de Chris</p>
      <p>Couture pour enfants, faite main à ${E.ville} (${E.departement}).</p>
    </div>
    <div>
      <h2 class="pied-titre">Me joindre</h2>
      <p><a href="${WA}" target="_blank" rel="noopener">Par WhatsApp</a><br><a href="${E.messenger}" target="_blank" rel="noopener">Par Messenger</a></p>
    </div>
    <div>
      <h2 class="pied-titre">Me suivre</h2>
      <p class="pied-reseaux"><a href="${E.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a></p>
    </div>
  </div>
  <div class="cadre pied-bas">
    <span>© ${new Date().getFullYear()} ${esc(E.nom)}</span>
    <span><a href="${r}mentions-legales/">Mentions légales</a> · <a href="${r}confidentialite/">Confidentialité</a>${PROD ? ' · <a class="lien-locweb" href="https://locweb.fr" target="_blank" rel="noopener">Site réalisé par LocWeb</a>' : ''}</span>
  </div>
</footer>

<a class="flottant" href="${lien('#commander')}" data-commander="" aria-label="Commander sur WhatsApp">${I.wa}<span>Commander</span></a>

<dialog class="fenetre" data-fenetre aria-labelledby="fenetre-titre">
  <form class="formulaire" data-commande data-wa="${E.whatsapp}" novalidate>
    <button class="fenetre-fermer" type="button" data-fermer aria-label="Fermer">×</button>
    <p class="surtitre">${I.wa} Commander sur WhatsApp</p>
    <h2 id="fenetre-titre">Votre demande, <em>prête à envoyer</em></h2>
    <label class="champ"><span>Ce que vous voulez</span>
      <select name="modele" data-commande-modele>
        ${NOMS_MODELES.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('')}
      </select>
    </label>
    <div class="deux">
      <label class="champ"><span>Son prénom à broder</span><input type="text" name="prenom" maxlength="20" data-commande-prenom></label>
      <label class="champ"><span>Pour quand ?</span><input type="text" name="quand" placeholder="ex. la rentrée de janvier"></label>
    </div>
    <label class="champ"><span>Tissu, couleurs, ses héros préférés…</span><textarea name="details" rows="3" data-commande-details></textarea></label>
    <label class="champ"><span>Votre prénom</span><input type="text" name="nom" autocomplete="given-name"></label>
    <button class="bouton bouton-wa" type="submit">${I.wa} Envoyer sur WhatsApp</button>
    <p class="fenetre-note">WhatsApp s’ouvre avec votre message déjà écrit : vous n’avez plus qu’à appuyer sur envoyer. Rien n’est engagé, je vous réponds avec le prix et le délai.</p>
  </form>
</dialog>

<script>
  window.LOCWEB_CONFIG = {
    supabaseUrl: 'https://ibqawtgnucakzdldnitj.supabase.co',
    supabaseAnonKey: 'sb_publishable_rpLrUo4Cqnfl8zSohDqO0A_Q5Vkj2Hk',
    clientId: '',
    ga4Id: ''
  };
</script>
<script src="${r}mesure.js" defer></script>
<script src="${r}assets/site.js?v=${V}" defer></script>
</body>
</html>
`;
}

/* ===================================================================
   PAGES
   =================================================================== */
const PAGES = [];
const ajouter = (ch, o) => PAGES.push([ch, o]);

ajouter('', {
  titre: 'Créa de Chris — Sacs à dos brodés au prénom et couture enfant, Lançon-de-Provence',
  description: 'Sacs à dos brodés au prénom, ensembles crèche et maternelle, doudous : la couture pour enfants de Chris, 100 % faite main à Lançon-de-Provence, près de Salon.',
  schemas: [{ '@type': 'WebSite', url: URL_SITE, name: E.nom, inLanguage: 'fr-FR' }],
  classe: 'accueil',
  corps: (r) => `
<section class="hero">
  <div class="hero-photo">${img(r, 'couture-machine-mains', 'Mains qui guident un tissu sous le pied de la machine à coudre', { eager: true, sizes: '(min-width: 900px) 58vw, 100vw' })}</div>
  <div class="cadre hero-in">
    <div class="hero-texte">
      <p class="surtitre hero-anim">${I.pin} Couture pour enfants · ${E.ville}</p>
      <h1 class="hero-anim">Cousu main,<br><em>brodé à son prénom</em></h1>
      <p class="hero-chapo hero-anim">Sacs à dos pour la crèche et l’école, doudous, ensembles assortis : des pièces uniques, cousues une à une pour un enfant en particulier. Le vôtre.</p>
      <div class="actions hero-anim">
        <a class="bouton bouton-plein" href="#prenom">Essayer avec son prénom</a>
        <a class="bouton bouton-ligne" href="#creations">Voir les créations</a>
      </div>
    </div>
    <p class="etiquette hero-anim" aria-hidden="true"><span>${esc(E.devise)}</span></p>
  </div>
</section>

<section class="section" id="creations">
  <div class="cadre">
    <div class="tete-section reveler">
      <p class="surtitre">${I.fil} Les créations</p>
      <h2>Pour les petits, <em>en un seul exemplaire</em></h2>
      <p class="chapo">Chaque pièce est cousue à la commande, dans le tissu que vous choisissez : leurs héros préférés, des motifs tout doux ou des unis.</p>
    </div>
    <div class="creations">
      ${CREATIONS.map((c, n) => `<article class="creation creation-${c.id}${n % 2 ? ' creation-inverse' : ''}">
        <div class="creation-photos photos-${c.photos.length} reveler">
          ${c.photos.map(([p, alt], k) => `<figure class="cp cp${k + 1}">${img(r, p, alt, { sizes: k ? '(min-width: 900px) 22vw, 45vw' : '(min-width: 900px) 40vw, 90vw' })}</figure>`).join('\n          ')}
        </div>
        <div class="creation-texte reveler">
          <p class="creation-eti">${c.eti}</p>
          <h3>${c.titre}</h3>
          <p>${c.texte}</p>
          <ul class="creation-points">${c.points.map((t) => `<li>${I.ok}<span>${t}</span></li>`).join('')}</ul>
          <a class="bouton bouton-plein" href="#commander" data-commander="${c.id}">${I.wa} Commander</a>
        </div>
      </article>`).join('\n      ')}
    </div>
    <p class="note-sur-mesure reveler">Une autre idée en tête ? Trousse, sac de change, cadeau de naissance… <a href="#commander" data-commander="autre">Demandez-moi</a>, on en parle.</p>
  </div>
</section>

<section class="section section-poudre" id="prenom">
  <div class="cadre atelier">
    <div class="atelier-texte reveler">
      <p class="surtitre">${I.fil} Son prénom brodé</p>
      <h2>Tapez son prénom, <em>je le brode</em></h2>
      <p>C’est le détail qui change tout : à la crèche, chacun reconnaît son sac. Essayez ici le prénom, la couleur du tissu et celle du fil. L’aperçu vous donne l’idée ; la vraie broderie, c’est moi qui la fais.</p>
    </div>
    <div class="atelier-rendu reveler" aria-live="polite">
      <div class="sac" data-sac data-tissu="rose" data-fil="blanc" data-ecriture="attachee">
        <span class="sac-anse" aria-hidden="true"></span>
        <div class="sac-corps">
          <div class="sac-rabat"><span class="broderie" data-broderie>Léna</span></div>
        </div>
      </div>
      <a class="bouton bouton-plein" href="#commander" data-commander="sac" data-depuis-atelier>${I.wa} Commander avec ce prénom</a>
    </div>
      <form class="atelier-reglages reveler" data-atelier onsubmit="return false">
        <label class="champ"><span>Son prénom</span><input type="text" name="prenom" maxlength="12" value="Léna" autocomplete="off" spellcheck="false" data-atelier-prenom></label>
        <fieldset class="pastilles"><legend>Le tissu</legend>
          ${TISSUS.map(([v, t], i) => `<label class="pastille tissu-${v}"><input type="radio" name="tissu" value="${v}"${i === 0 ? ' checked' : ''}><span class="visuel"></span><span class="nom">${t}</span></label>`).join('')}
        </fieldset>
        <fieldset class="pastilles"><legend>Le fil</legend>
          ${FILS.map(([v, t], i) => `<label class="pastille fil-${v}"><input type="radio" name="fil" value="${v}"${i === 0 ? ' checked' : ''}><span class="visuel"></span><span class="nom">${t}</span></label>`).join('')}
        </fieldset>
        <fieldset class="pastilles pastilles-texte"><legend>L’écriture</legend>
          <label class="pastille"><input type="radio" name="ecriture" value="attachee" checked><span class="nom ecriture-attachee">Attachée</span></label>
          <label class="pastille"><input type="radio" name="ecriture" value="baton"><span class="nom ecriture-baton">Bâton</span></label>
        </fieldset>
      </form>
  </div>
</section>

<section class="section" id="comment">
  <div class="cadre">
    <div class="tete-section reveler">
      <p class="surtitre">${I.fil} Comment ça marche</p>
      <h2>De votre idée <em>à son sac</em></h2>
    </div>
    <ol class="etapes">
      <li class="reveler"><b>Vous choisissez</b><span>Le modèle, le tissu et le prénom. Envoyez-moi votre demande, même si vous hésitez encore : on décide ensemble.</span></li>
      <li class="reveler"><b>Je vous réponds</b><span>Je vous confirme le prix, les tissus disponibles et le délai avant de commencer.</span></li>
      <li class="reveler"><b>Je couds</b><span>Coupe, couture, broderie : tout est fait main, à ${E.ville}.</span></li>
      <li class="reveler"><b>Vous le récupérez</b><span>En main propre autour de Lançon, ou envoyé par la poste.</span></li>
    </ol>
  </div>
</section>

<section class="section section-papier" id="chris">
  <div class="cadre chris">
    <figure class="chris-photo reveler">${img(r, 'broderie-coeur', 'Tambour à broder avec un cœur brodé au fil rouge', { sizes: '(min-width: 900px) 34vw, 90vw' })}</figure>
    <div class="chris-texte reveler">
      <p class="surtitre">${I.fil} Qui suis-je</p>
      <h2>Moi, c’est <em>Chris</em></h2>
      <p>Je couds depuis ${E.ville}, entre Salon et l’étang de Berre. Créa de Chris est née d’une envie simple : faire des choses que les enfants gardent, qu’ils reconnaissent et qu’ils aiment, et que les parents ne trouvent pas en magasin.</p>
      <p>Pas de série, pas de stock : chaque sac, chaque doudou est cousu pour un enfant en particulier. Ma devise tient en quelques mots : <b>${esc(E.devise)}</b>.</p>
      <p class="signature">Chris</p>
    </div>
  </div>
</section>

<section class="section section-nuit" id="commander">
  <div class="cadre commande">
    <div class="commande-texte reveler">
      <p class="surtitre">${I.fil} Commander</p>
      <h2>Votre demande, <em>en une minute</em></h2>
      <p>Choisissez votre création : le message WhatsApp s’écrit tout seul, vous n’avez plus qu’à l’envoyer. Je vous réponds avec le prix et le délai, et rien n’est engagé tant que vous n’avez pas dit oui.</p>
      <p class="commande-aide">Vous préférez Messenger ? <a href="${E.messenger}" target="_blank" rel="noopener">Écrivez-moi ici</a>.</p>
    </div>
    <div class="commande-choix reveler">
      ${NOMS_MODELES.map(([v, t]) => `<a href="#commander" data-commander="${v}"><span>${esc(t)}</span>${I.wa}</a>`).join('\n      ')}
    </div>
  </div>
</section>`,
});

ajouter('mentions-legales/', {
  titre: 'Mentions légales — Créa de Chris',
  description: `Mentions légales du site ${E.nom}.`,
  corps: () => `
<section class="section"><div class="cadre etroit texte-riche">
  <h1>Mentions légales</h1>
  <h2>Éditrice du site</h2>
  <p>${E.dirigeante} — entrepreneuse individuelle, nom commercial « ${E.nom} »<br>${E.ville} (${E.codePostal})<br>SIRET : ${E.siret}</p>
  <p>Directrice de la publication : ${E.dirigeante}</p>
  <h2>Hébergement</h2><p>[À compléter à la mise en ligne]</p>
  <h2>Crédits</h2><p>Photographies : Unsplash, en attendant les photos des créations. Réalisation : LocWeb.</p>
</div></section>`,
});

ajouter('confidentialite/', {
  titre: 'Politique de confidentialité — Créa de Chris',
  description: `Comment ${E.nom} traite les données transmises via son site.`,
  corps: () => `
<section class="section"><div class="cadre etroit texte-riche">
  <h1>Politique de confidentialité</h1>
  <h2>Les données recueillies</h2><p>Le formulaire de commande ne fait que préparer un message WhatsApp : rien n’est enregistré par le site. Ce que vous m’envoyez ensuite sert uniquement à vous répondre et à traiter votre commande.</p>
  <h2>Mesure d’audience</h2><p>Le site utilise Google Analytics pour mesurer sa fréquentation de façon anonymisée.</p>
  <h2>Vos droits</h2><p>Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à ${E.nom} par Messenger. Aucune donnée n’est vendue ni cédée.</p>
</div></section>`,
});

for (const [ch, o] of PAGES) {
  fs.mkdirSync(path.join(ICI, ch), { recursive: true });
  fs.writeFileSync(path.join(ICI, ch, 'index.html'), page(ch, o));
}
fs.writeFileSync(path.join(ICI, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${abs('')}</loc></url>\n</urlset>\n`);
fs.writeFileSync(path.join(ICI, 'robots.txt'), PROD ? `User-agent: *\nAllow: /\n\nSitemap: ${URL_SITE}sitemap.xml\n` : `# Apercu : pas d'indexation avant la mise en ligne.\nUser-agent: *\nDisallow: /\n`);
fs.writeFileSync(path.join(ICI, '.nojekyll'), '');
console.log(`${PAGES.length} pages — ${PROD ? 'PRODUCTION' : 'apercu (noindex)'}`);
