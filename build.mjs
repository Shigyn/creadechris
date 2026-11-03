// ===================================================================
//  Créa de Chris — generateur du site (LocWeb, 2026-11-02)
//     node build.mjs          -> apercu (noindex)
//     PROD=1 node build.mjs   -> mise en ligne
//  Articles et prix : sa carte (2026-11-02). Services, -5 %, « sur
//  rendez-vous » : ses flyers. Marches et articles sans prix : son message.
//  Son adresse figure sur ses flyers mais reste hors du site et du depot
//  tant qu'elle n'a pas dit oui : seulement la commune.
// ===================================================================
import fs from 'node:fs';
import path from 'node:path';

const ICI = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1');
const PROD = process.env.PROD === '1';
const URL_SITE = PROD ? 'https://www.creadechris.com/' : 'https://shigyn.github.io/creadechris/';
const PHOTOS = JSON.parse(fs.readFileSync(path.join(ICI, '_source', 'photos.json'), 'utf8'));
const V = '14';

const E = {
  nom: 'Créa de Chris',
  autreNom: 'Les Créas de Chris',
  devise: 'Fait main avec soin',
  activite: 'Retouches & Créations',
  prenom: 'Chris',
  dirigeante: 'Christelle Poupardin',
  siret: '793 899 568 00026',
  ville: 'Lançon-de-Provence',
  codePostal: '13680',
  departement: 'Bouches-du-Rhône',
  facebook: 'https://www.facebook.com/christelle.poupardin.5',
  messenger: 'https://m.me/christelle.poupardin.5',
  // Confirme par elle (ses flyers disent encore Les.creas_de_chris).
  instagram: 'https://www.instagram.com/creadechris/',
  telAffiche: '06 29 35 80 92',
  tel: '+33629358092',
  // Celui de son ancien site creadechris.fr, deja public.
  email: 'creadechris@gmail.com',
  // Confirme par elle.
  whatsapp: '33629358092',
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (ch) => URL_SITE + ch;
function img(r, nom, alt, { eager = false, sizes = '(min-width: 900px) 40vw, 100vw', cls = '', zone = '' } = {}) {
  const p = PHOTOS[nom];
  if (!p) throw new Error('photo inconnue : ' + nom);
  const srcset = p.l > 800 ? ` srcset="${r}photos/${nom}-800.webp 800w, ${r}photos/${nom}-1600.webp ${p.l}w" sizes="${sizes}"` : '';
  return `<img${zone ? ` data-editable-zone="${zone}"` : ''}${cls ? ` class="${cls}"` : ''} src="${r}photos/${nom}-800.webp"${srcset} alt="${esc(alt)}" width="${p.l}" height="${p.h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

const I = {
  fleche: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 5.3 19.9 12l-6.7 6.7-1.4-1.4 4.3-4.3H4v-2h12.1l-4.3-4.3z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.4V14h2.7v8z"/></svg>',
  msg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.5 2 2 6.1 2 11.3c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.2S17.5 2 12 2zm1 12.4-2.5-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
  insta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6zm0 2a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4zm4 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>',
  // Une aiguillee : le fil qui court entre les sections.
  fil: '<svg class="fil" viewBox="0 0 140 24" aria-hidden="true"><path d="M2 14c18-12 30 8 48-2s30-10 46 2 28 4 42-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="5 5"/></svg>',
};

/* Sa carte, puis les prix de son message du 2026-11-02. Prix null : pas encore donne. */
const CARTE = [
  {
    titre: 'Les indispensables', photo: ['sac-a-langer-foret', 'Sac à langer matelassé à motifs d’animaux de la forêt, fermeture rose'],
    articles: [['peignoir', 'Peignoir', 25], ['gigoteuse-ete', 'Gigoteuse été', 35], ['gigoteuse-hiver', 'Gigoteuse hiver', 45], ['nid-d-ange', 'Nid d’ange', 40], ['sac-a-langer', 'Sac à langer', 65], ['couverture', 'Couverture', 45]],
  },
  {
    titre: 'Idées cadeaux', photo: ['attaches-tetine-prenom', 'Attaches tétine en perles avec un prénom et anneaux de dentition assortis'],
    articles: [['doudou', 'Doudou', 22], ['kit-naissance', 'Kit naissance', 28], ['sortie-de-bain', 'Sortie de bain', 25], ['attache-tetine', 'Attache tétine', 15.5], ['protege-carnet', 'Protège carnet', 13.5]],
  },
  {
    titre: 'Pratique au quotidien', photo: ['lingettes-lavables', 'Lingettes lavables imprimées en éponge rose'],
    articles: [['lingettes', '10 lingettes + panier', 20], ['housse-matelas', 'Housse matelas à langer', 15], ['matelas-nomade', 'Matelas nomade', 20], ['bavoir', 'Bavoir', 7], ['anti-bavouille', 'Anti-bavouille (lot de 2)', 17]],
  },
  {
    titre: 'Dodo et crèche', photo: ['berceau-oursons', 'Berceau habillé d’un drap à motifs d’oursons, avec sa couverture et son doudou assortis'],
    articles: [['couette-bebe', 'Couette lit bébé', 45], ['couette-enfant', 'Couette lit enfant', 125], ['set-creche', 'Sac à dos avec doudou', 45], ['trousse', 'Trousse de toilette', 14], ['anneau', 'Anneau de dentition', 5]],
  },
  {
    titre: 'Gilet du berger', photo: ['gilet-berger-bouclette', 'Gilet du berger en bouclette camel, doublé d’un tissu à petits animaux'],
    articles: [['gilet-bebe', 'Gilet du berger bébé', 20], ['gilet-2-6', 'Gilet du berger 2 à 6 ans', 25], ['gilet-6-14', 'Gilet du berger 6 à 14 ans', 30], ['gilet-adulte', 'Gilet du berger adulte', 45]],
  },
  {
    titre: 'Noël et sacs', photo: ['boule-de-noel', 'Boule de Noël personnalisée « Joyeux Noël »'],
    articles: [['boule-noel', 'Boule de Noël personnalisée', 4.5], ['chaussettes-noel', 'Chaussette de Noël garnie', 16], ['sac-femme', 'Sac en jean et tissu', 75]],
  },
];
/* Cites dans son message, pas encore de prix. */
const AUSSI = [['pilou', 'Pilou pilou enfant'], ['vetements-ete', 'Vêtements d’été'], ['pinces', 'Pinces à cheveux'], ['chouchous', 'Chouchous'], ['bandeaux', 'Bandeaux'], ['snoods', 'Snoods']];
const GALERIE = [['g-gigoteuse', 'Gigoteuse oursons'], ['g-peignoir', 'Peignoir brodé au prénom'], ['g-sortie-de-bain', 'Sortie de bain brodée'], ['g-doudou', 'Doudou assorti'], ['g-sac-a-dos', 'Sac à dos d’enfant'], ['g-housse', 'Housse de matelas à langer'], ['g-gilet', 'Gilet du berger'], ['g-chouchous', 'Chouchous'], ['g-attaches-tetine', 'Attaches tétine au prénom'], ['g-lingettes', 'Lingettes lavables'], ['g-sac-a-langer', 'Sac à langer'], ['g-boule-de-noel', 'Boule de Noël personnalisée']];
const SERVICES = [
  ['retouche', 'Une retouche', 'Retouches du quotidien', 'Ourlets, fermetures, ajustements, transformations.'],
  ['sur-mesure', 'Une création sur mesure', 'Créations sur mesure', 'Vêtements, accessoires, décoration textile.'],
  ['flocage', 'Une broderie ou un flocage', 'Broderie et flocage', 'Textile, cadeaux, événements : la personnalisation pour toutes les occasions.'],
  ['deco', 'De la décoration textile', 'Décoration textile', 'Rideaux, coussins, panières, accessoires pour la maison.'],
];
/* Une date passee disparait toute seule (site.js). */
const MARCHES = [
  { quand: 'Le 8 novembre', ou: 'Salon-de-Provence, Fontaine Moussue', jusquau: '2026-11-08' },
  { quand: 'À partir de fin novembre', ou: 'Dans le Gard' },
];
const prix = (n) => (n === null ? 'Sur demande' : n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0 }) + ' €');
const WA = `https://wa.me/${E.whatsapp}`;
const TISSUS = [['rose', 'Rose poudré'], ['nuit', 'Bleu nuit'], ['lin', 'Lin naturel'], ['sauge', 'Vert sauge']];
const FILS = [['blanc', 'Blanc'], ['or', 'Doré'], ['rose', 'Rose'], ['nuit', 'Bleu nuit']];

/* ---------------- donnees structurees ---------------- */
const ENTITE = {
  '@type': 'LocalBusiness',
  '@id': URL_SITE + '#entreprise',
  name: E.nom,
  alternateName: E.autreNom,
  description: 'Articles bébé personnalisés et faits main à Lançon-de-Provence : gigoteuses, sacs à langer, doudous, bavoirs brodés au prénom. Retouches, créations sur mesure, broderie et flocage.',
  telephone: E.tel,
  slogan: E.devise,
  url: URL_SITE,
  image: URL_SITE + 'photos/partage.jpg',
  founder: { '@type': 'Person', name: E.dirigeante },
  address: { '@type': 'PostalAddress', addressLocality: E.ville, postalCode: E.codePostal, addressRegion: 'Provence-Alpes-Côte d’Azur', addressCountry: 'FR' },
  areaServed: ['Lançon-de-Provence', 'Salon-de-Provence', 'Pélissanne', 'La Fare-les-Oliviers', 'Rognac', 'Berre-l’Étang', 'Bouches-du-Rhône'].map((v) => ({ '@type': 'Place', name: v })),
  sameAs: [E.facebook, E.instagram],
  makesOffer: CARTE.flatMap((g) => g.articles).filter((a) => a[2] !== null).map(([, n, p]) => ({ '@type': 'Offer', price: p, priceCurrency: 'EUR', itemOffered: { '@type': 'Product', name: n } })),
};

/* ---------------- gabarit ---------------- */
const NAV = [['#articles', 'Articles et prix'], ['#creations', 'Mes créations'], ['#prenom', 'Son prénom brodé'], ['#retouches', 'Retouches'], ['#chris', 'Qui suis-je'], ['#contact', 'Me joindre']];

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
      <span class="marque-devise">${esc(E.activite)}</span>
    </a>
    <nav class="nav" aria-label="Navigation principale">
      ${NAV.map(([h, t]) => `<a href="${lien(h)}">${t}</a>`).join('\n      ')}
    </nav>
    <a class="bouton bouton-plein entete-cta" href="${lien('#contact')}" data-commander="">Commander</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu-mobile" aria-label="Ouvrir le menu"><span></span><span></span></button>
  </div>
  <div class="menu-mobile" id="menu-mobile" hidden>
    ${NAV.map(([h, t]) => `<a href="${lien(h)}">${t}</a>`).join('\n    ')}
    <a class="bouton bouton-plein" href="${lien('#contact')}" data-commander="">Commander</a>
  </div>
</header>

<main id="contenu">
${corps(r)}
</main>

<footer class="pied">
  <div class="cadre pied-haut">
    <div>
      <p class="pied-nom">Créa de Chris</p>
      <p>${esc(E.activite)}, ${esc(E.devise.toLowerCase())} à ${E.ville} (${E.departement}).</p>
    </div>
    <div>
      <h2 class="pied-titre">Me joindre</h2>
      <p><a href="tel:${E.tel}">${E.telAffiche}</a><br><a href="${WA}" target="_blank" rel="noopener">Par WhatsApp</a></p>
    </div>
    <div>
      <h2 class="pied-titre">Me suivre</h2>
      <p class="pied-reseaux"><a href="${E.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a> <a href="${E.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a></p>
    </div>
  </div>
  <div class="cadre pied-bas">
    <span>© ${new Date().getFullYear()} ${esc(E.nom)}</span>
    <span><a href="${r}mentions-legales/">Mentions légales</a> · <a href="${r}conditions-de-vente/">Conditions de vente</a> · <a href="${r}confidentialite/">Confidentialité</a>${PROD ? ' · <a class="lien-locweb" href="https://locweb.fr" target="_blank" rel="noopener">Site réalisé par LocWeb</a>' : ''}</span>
  </div>
</footer>

<a class="flottant" href="${lien('#contact')}" data-commander="" aria-label="Commander sur WhatsApp">${I.wa}<span>Commander</span></a>

<dialog class="fenetre" data-fenetre aria-labelledby="fenetre-titre">
  <form class="formulaire" data-commande data-wa="${E.whatsapp}">
    <button class="fenetre-fermer" type="button" data-fermer aria-label="Fermer">×</button>
    <p class="surtitre">${I.wa} Commander sur WhatsApp</p>
    <h2 id="fenetre-titre">Votre demande, <em>prête à envoyer</em></h2>
    <label class="champ"><span>Ce que vous voulez</span>
      <select name="modele" data-commande-modele required>
        <option value="">Choisissez…</option>
        ${CARTE.map((g) => `<optgroup data-produits label="${esc(g.titre)}">${g.articles.map(([v, t, p]) => `<option value="${v}">${esc(t)}${p === null ? '' : ` (${prix(p)})`}</option>`).join('')}</optgroup>`).join('')}
        <optgroup data-produits label="Sur demande">${AUSSI.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('')}</optgroup>
        <optgroup label="Retouches et sur mesure">${SERVICES.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('')}</optgroup>
        <option value="autre">Autre chose</option>
      </select>
    </label>
    <div class="deux">
      <label class="champ"><span>Prénom à broder</span><input type="text" name="prenom" maxlength="20" data-commande-prenom></label>
      <label class="champ"><span>Pour quand ?</span><input type="text" name="quand" placeholder="ex. Noël"></label>
    </div>
    <label class="champ"><span>Tissu, couleurs, votre idée…</span><textarea name="details" rows="3" data-commande-details></textarea></label>
    <label class="champ"><span>Votre prénom</span><input type="text" name="nom" autocomplete="given-name"></label>
    <label class="champ"><span>Pour la récupérer</span><select name="remise"><option>En main propre à ${E.ville}</option><option>En relais Pick Up</option></select></label>
    <label class="coche"><input type="checkbox" name="premiere"><span>C’est ma première commande (−5 %)</span></label>
    <button class="bouton bouton-wa" type="submit">${I.wa} Envoyer sur WhatsApp</button>
    <p class="fenetre-note">WhatsApp s’ouvre avec votre message déjà écrit : vous n’avez plus qu’à appuyer sur envoyer. Rien n’est engagé : je vous réponds pour les tissus et le délai.</p>
  </form>
</dialog>

<script>
  window.LOCWEB_CONFIG = {
    supabaseUrl: 'https://ibqawtgnucakzdldnitj.supabase.co',
    supabaseAnonKey: 'sb_publishable_rpLrUo4Cqnfl8zSohDqO0A_Q5Vkj2Hk',
    clientId: 'a7eb4483-8df3-46c5-8c00-0b18945eabc2',
    ga4Id: ''
  };
</script>
<script src="${r}mesure.js" defer></script>
<script src="${r}assets/site.js?v=${V}" defer></script>
<script src="${r}assets/contenu.js?v=${V}" defer></script>
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
  titre: 'Créa de Chris — Articles bébé personnalisés et retouches, Lançon-de-Provence',
  description: 'Gigoteuses, sacs à langer, doudous, bavoirs brodés au prénom : des articles bébé faits main à Lançon-de-Provence, près de Salon, avec tous les prix. Retouches et sur mesure.',
  schemas: [{ '@type': 'WebSite', url: URL_SITE, name: E.nom, inLanguage: 'fr-FR' }],
  classe: 'accueil',
  corps: (r) => `
<section class="hero">
  <div class="hero-photo">${img(r, 'chambre-table-a-langer', 'Chambre de bébé : table à langer habillée d’une housse à motifs d’oursons, doudous et mobile', { eager: true, sizes: '(min-width: 900px) 58vw, 100vw', zone: 'cdc_photo_hero' })}</div>
  <div class="cadre hero-in">
    <div class="hero-texte">
      <p class="surtitre hero-anim">${I.pin} ${esc(E.activite)} · ${E.ville}</p>
      <h1 class="hero-anim"><span data-editable-zone="cdc_hero_titre">Pour votre bébé,</span><br><em data-editable-zone="cdc_hero_accent">fait main à son prénom</em></h1>
      <p class="hero-chapo hero-anim" data-editable-zone="cdc_hero_chapo">Gigoteuse, sac à langer, doudou, bavoir… Vous choisissez le tissu, je brode son prénom. Et pour tout le reste, retouches et sur mesure : je m’adapte à vos projets.</p>
      <div class="actions hero-anim">
        <a class="bouton bouton-plein" href="#articles">Voir les articles et les prix</a>
        <a class="bouton bouton-ligne" href="#prenom">Essayer son prénom</a>
      </div>
    </div>
    <p class="etiquette hero-anim"><span><b>−5 %</b> sur votre première commande</span></p>
  </div>
</section>

<section class="section" id="articles">
  <div class="cadre">
    <div class="tete-section reveler">
      <p class="surtitre">${I.fil} Articles bébé personnalisables</p>
      <h2>Tous les prix, <em>d’un coup d’œil</em></h2>
      <p class="chapo" data-editable-zone="cdc_articles_chapo">Tous les tissus peuvent être choisis, avec énormément de choix à la demande. Touchez un article : votre message WhatsApp s’écrit tout seul.</p>
    </div>
    <div class="carte">
      ${CARTE.map((g, n) => `<div class="carte-groupe reveler" data-categorie="${esc(g.titre)}">
        <figure>${img(r, g.photo[0], g.photo[1], { sizes: '(min-width: 1100px) 30vw, (min-width: 720px) 45vw, 90vw', zone: `cdc_photo_groupe_${n + 1}` })}</figure>
        <h3>${g.titre}</h3>
        <ul>
          ${g.articles.map(([id, nom, p]) => `<li><a class="article" href="#contact" data-commander="${id}"><span class="article-nom">${esc(nom)}</span><span class="article-prix${p === null ? ' article-prix-texte' : ''}">${prix(p)}</span><span class="article-cmd">Commander</span></a></li>`).join('\n          ')}
        </ul>
      </div>`).join('\n      ')}
    </div>
    <div class="aussi reveler">
      <h3>Et bien d’autres créations, <em>prix sur demande</em></h3>
      <div class="aussi-liste">
        ${AUSSI.map(([id, nom]) => `<a href="#contact" data-commander="${id}">${esc(nom)}</a>`).join('\n        ')}
      </div>
    </div>
    <p class="carte-note reveler">Prix en euros, toutes taxes comprises, hors frais d’envoi. <a href="${r}conditions-de-vente/">Conditions de vente</a></p>
  </div>
</section>

<section class="section section-papier" id="creations">
  <div class="cadre">
    <div class="tete-section reveler">
      <p class="surtitre">${I.fil} Mes créations</p>
      <h2>Quelques pièces <em>sorties de l’atelier</em></h2>
    </div>
    <div class="galerie reveler" data-galerie>
      ${GALERIE.map(([nom, t]) => `<figure>${img(r, nom, t, { sizes: '(min-width: 900px) 25vw, 50vw' })}<figcaption>${esc(t)}</figcaption></figure>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section-poudre" id="prenom">
  <div class="cadre atelier">
    <div class="atelier-texte reveler">
      <p class="surtitre">${I.fil} Son prénom brodé</p>
      <h2>Tapez son prénom, <em>je le brode</em></h2>
      <p>Je brode le prénom sur tout ce qui peut l’être. Essayez ici le prénom, la couleur du tissu et celle du fil : l’aperçu vous donne l’idée, la vraie broderie, c’est moi qui la fais.</p>
    </div>
    <div class="atelier-rendu reveler" aria-live="polite">
      <div class="sac" data-sac data-tissu="rose" data-fil="blanc" data-ecriture="attachee">
        <span class="sac-anse" aria-hidden="true"></span>
        <div class="sac-corps">
          <div class="sac-rabat"><span class="broderie" data-broderie>Léna</span></div>
        </div>
      </div>
      <a class="bouton bouton-plein" href="#contact" data-commander="" data-depuis-atelier>${I.wa} Commander avec ce prénom</a>
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

<section class="section" id="retouches">
  <div class="cadre services">
    <figure class="services-photo reveler">${img(r, 'couture-machine-mains', 'Mains qui guident un tissu sous le pied de la machine à coudre', { sizes: '(min-width: 900px) 42vw, 90vw', zone: 'cdc_photo_atelier' })}</figure>
    <div class="reveler">
      <p class="surtitre">${I.fil} Retouches et sur mesure</p>
      <h2>Un projet, une envie ? <em>Je m’adapte</em></h2>
      <div class="services-liste">
        ${SERVICES.map(([id, , t, d]) => `<a class="service" href="#contact" data-commander="${id}"><b>${esc(t)}</b><span>${esc(d)}</span></a>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

<section class="section section-papier" id="comment">
  <div class="cadre">
    <div class="tete-section reveler">
      <p class="surtitre">${I.fil} Comment ça marche</p>
      <h2>De votre idée <em>à votre commande</em></h2>
    </div>
    <ol class="etapes">
      <li class="reveler"><b>Vous choisissez</b><span>L’article, et le prénom à broder si vous le souhaitez. Le message WhatsApp s’écrit tout seul.</span></li>
      <li class="reveler"><b>On en parle</b><span>Tissus, délai, rendez-vous : on fixe tout ensemble avant que je commence.</span></li>
      <li class="reveler"><b>Je couds</b><span>Chaque pièce est réalisée à la main, à ${E.ville}, avec soin et minutie.</span></li>
      <li class="reveler"><b>Vous récupérez</b><span>En main propre à ${E.ville}, ou par envoi en relais Pick Up.</span></li>
    </ol>
  </div>
</section>

<section class="section" id="chris">
  <div class="cadre chris">
    <figure class="chris-photo reveler">${img(r, 'peignoir-brode', 'Petit peignoir blanc en éponge, brodé d’un prénom en vert', { sizes: '(min-width: 900px) 34vw, 90vw', zone: 'cdc_photo_chris' })}</figure>
    <div class="chris-texte reveler">
      <p class="surtitre">${I.fil} Qui suis-je</p>
      <h2>Moi, c’est <em>Chris</em></h2>
      <p data-editable-zone="cdc_chris_texte_1">Je couds à ${E.ville}. Articles de naissance, cadeaux personnalisés, retouches : chaque pièce est réalisée avec soin, passion et minutie.</p>
      <p data-editable-zone="cdc_chris_texte_2">Chaque création est unique, pensée pour votre bébé et faite avec amour. Idéal pour un cadeau de naissance, un anniversaire, ou juste pour faire plaisir.</p>
      <p class="signature">Chris</p>
    </div>
  </div>
</section>

<section class="section section-nuit" id="contact">
  <div class="cadre commande">
    <div class="commande-texte reveler">
      <p class="surtitre">${I.fil} Me joindre</p>
      <h2>Une question, <em>une commande ?</em></h2>
      <p data-editable-zone="cdc_contact_texte">Prise de commande sur rendez-vous, à ${E.ville}. Le plus simple : un message sur WhatsApp, ou un appel.</p>
      <div class="actions">
        <a class="bouton bouton-wa" href="${WA}" target="_blank" rel="noopener">${I.wa} Écrire sur WhatsApp</a>
        <a class="bouton bouton-or" href="tel:${E.tel}">${I.tel} ${E.telAffiche}</a>
      </div>
      <p class="commande-aide">Vous préférez Messenger ? <a href="${E.messenger}" target="_blank" rel="noopener">Écrivez-moi ici</a>.</p>
    </div>
    <div class="marches reveler">
      <h3>Me retrouver <em>sur les marchés</em></h3>
      <ul>
        ${[...MARCHES, {}].map((m, i) => `<li data-marche="${i + 1}"${m.jusquau ? ` data-jusquau="${m.jusquau}" data-texte="${esc(m.quand)}"` : ''}${m.quand ? '' : ' hidden'}><b data-editable-zone="cdc_marche_${i + 1}_quand">${m.quand || ''}</b><span data-editable-zone="cdc_marche_${i + 1}_ou">${m.ou || ''}</span></li>`).join('\n        ')}
      </ul>
      <div data-horaires hidden>
        <h3>Mes <em>horaires</em></h3>
        <ul>
          ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((j) => `<li><b>${j}</b><span data-editable-zone="cdc_horaires_${j.toLowerCase()}">Fermé</span></li>`).join('\n          ')}
        </ul>
      </div>
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
  <p>${E.dirigeante} — entrepreneuse individuelle, nom commercial « ${E.nom} »<br>${E.ville} (${E.codePostal})<br>Téléphone : <a href="tel:${E.tel}">${E.telAffiche}</a><br>E-mail : <a href="mailto:${E.email}">${E.email}</a><br>SIRET : ${E.siret}</p>
  <p>Directrice de la publication : ${E.dirigeante}</p>
  <h2>Hébergement</h2><p>GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis. Les articles et les photos sont enregistrés chez Supabase, Inc. (serveurs dans l’Union européenne).</p>
  <h2>Crédits</h2><p>Photographies : Créa de Chris et Unsplash. Réalisation : <a href="https://locweb.fr" target="_blank" rel="noopener">LocWeb</a>.</p>
  <h2>Propriété</h2><p>Les textes et les photos de ce site appartiennent à ${E.nom}. Merci de ne pas les reprendre sans son accord.</p>
</div></section>`,
});

ajouter('conditions-de-vente/', {
  titre: 'Conditions de vente — Créa de Chris',
  description: `Conditions de vente des créations et retouches de ${E.nom} : commande, prix, envoi, rétractation et garanties.`,
  corps: () => `
<section class="section"><div class="cadre etroit texte-riche">
  <h1>Conditions de vente</h1>
  <p>Ces conditions s’appliquent aux créations et aux retouches de ${E.dirigeante} (${E.nom}), SIRET ${E.siret}.</p>
  <h2>Commande</h2><p>Le site présente les articles et leurs prix, mais on n’y paie pas et on n’y commande pas directement : il prépare un message. La commande est confirmée quand nous nous sommes mises d’accord sur l’article, le tissu, la personnalisation, le prix, le délai et la remise.</p>
  <h2>Prix</h2><p>Les prix sont en euros, toutes taxes comprises, hors frais d’envoi. Le prix qui s’applique est celui confirmé au moment de la commande. Les articles sur demande et les retouches font l’objet d’un prix donné avant de commencer.</p>
  <h2>Paiement</h2><p>Le moyen et le moment du paiement sont convenus au moment de la commande.</p>
  <h2>Remise et envoi</h2><p>En main propre à ${E.ville}, ou par envoi en relais Pick Up : les frais dépendent du poids, à partir de 5 €, et sont annoncés avant la commande. Les délais sont confirmés à la commande.</p>
  <h2>Droit de rétractation</h2><p>Pour un article commandé à distance, vous disposez de 14 jours après sa réception pour changer d’avis, sans avoir à vous justifier : prévenez-moi par écrit (WhatsApp, Messenger ou e-mail), puis renvoyez l’article sous 14 jours, à vos frais. Je vous rembourse dans les 14 jours, frais d’envoi initiaux compris, au tarif standard.</p>
  <p><b>Ce droit ne s’applique pas aux articles faits selon vos choix ou personnalisés</b>, par exemple brodés à un prénom ou réalisés dans un tissu choisi pour vous (article L221-28 du Code de la consommation), ni aux retouches.</p>
  <h2>Garanties</h2><p>Tous les articles bénéficient de la garantie légale de conformité (2 ans, articles L217-3 et suivants du Code de la consommation) et de la garantie des vices cachés (articles 1641 et suivants du Code civil). En cas de problème, contactez-moi : réparation, remplacement ou remboursement selon les cas prévus par la loi.</p>
  <h2>Réclamation et médiation</h2><p>Pour toute réclamation : <a href="tel:${E.tel}">${E.telAffiche}</a> ou <a href="mailto:${E.email}">${E.email}</a>. En cas de litige, vous pouvez recourir gratuitement à un médiateur de la consommation, dont les coordonnées vous sont communiquées sur simple demande.</p>
</div></section>`,
});

ajouter('confidentialite/', {
  titre: 'Politique de confidentialité — Créa de Chris',
  description: `Comment ${E.nom} traite les données transmises via son site.`,
  corps: () => `
<section class="section"><div class="cadre etroit texte-riche">
  <h1>Politique de confidentialité</h1>
  <h2>Responsable</h2><p>${E.dirigeante} (${E.nom}), ${E.ville} — <a href="mailto:${E.email}">${E.email}</a>.</p>
  <h2>Les données recueillies</h2><p>Le site n’a ni compte client ni base de clients. Le formulaire de commande ne fait que préparer un message WhatsApp : rien n’est enregistré par le site. Ce que vous m’envoyez ensuite (prénom, téléphone, adresse d’envoi, détails de la commande) sert uniquement à vous répondre et à traiter votre commande. Rien n’est vendu ni cédé, et rien ne sert à de la prospection.</p>
  <h2>Qui y a accès</h2><p>Moi seule, pour traiter votre commande, et le relais Pick Up en cas d’envoi. En écrivant par WhatsApp ou Messenger, vous utilisez le service de Meta, soumis à ses propres conditions. Pour faire fonctionner le site : LocWeb (réalisation et maintenance), GitHub (hébergement des pages) et Supabase (articles et photos, serveurs dans l’Union européenne), qui peuvent recevoir votre adresse IP dans leurs journaux techniques.</p>
  <h2>Conservation</h2><p>Les échanges liés à une commande sont gardés le temps nécessaire à son suivi et aux garanties, puis supprimés. Les factures sont conservées 10 ans, comme la loi le demande.</p>
  <h2>Cookies</h2><p>Le site ne dépose aucun cookie, ni publicitaire ni de mesure d’audience : aucun bandeau ne vous est donc demandé. Les polices de caractères sont fournies par Google Fonts, qui reçoit à cette occasion votre adresse IP.</p>
  <h2>Vos droits</h2><p>Vous pouvez demander l’accès, la rectification ou la suppression de vos données, ou vous opposer à leur traitement, en écrivant à <a href="mailto:${E.email}">${E.email}</a>. Si la réponse ne vous satisfait pas, vous pouvez saisir la CNIL (cnil.fr).</p>
</div></section>`,
});

for (const [ch, o] of PAGES) {
  fs.mkdirSync(path.join(ICI, ch), { recursive: true });
  fs.writeFileSync(path.join(ICI, ch, 'index.html'), page(ch, o));
}
// Son espace : le catalogue et les horaires (fonction cdc-espace). Jamais indexe.
fs.mkdirSync(path.join(ICI, 'espace'), { recursive: true });
fs.writeFileSync(path.join(ICI, 'espace', 'index.html'), `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Mon espace — Créa de Chris</title>
<meta name="theme-color" content="#fbf6f1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..600,100;1,9..144,400..600,100&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&family=Allura&family=Baloo+2:wght@600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/style.css?v=${V}"><link rel="stylesheet" href="../assets/espace.css?v=${V}">
</head><body>
<main class="espace" id="app"></main>
<script>window.LOCWEB_CONFIG = { supabaseUrl: 'https://ibqawtgnucakzdldnitj.supabase.co' };</script>
<script src="../assets/espace.js?v=${V}" defer></script>
</body></html>
`);
fs.writeFileSync(path.join(ICI, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${abs('')}</loc></url>\n</urlset>\n`);
fs.writeFileSync(path.join(ICI, 'robots.txt'), PROD ? `User-agent: *\nAllow: /\n\nSitemap: ${URL_SITE}sitemap.xml\n` : `# Apercu : pas d'indexation avant la mise en ligne.\nUser-agent: *\nDisallow: /\n`);
fs.writeFileSync(path.join(ICI, '.nojekyll'), '');
console.log(`${PAGES.length} pages — ${PROD ? 'PRODUCTION' : 'apercu (noindex)'}`);
