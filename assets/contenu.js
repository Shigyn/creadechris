// Créa de Chris : ce qu'elle change depuis son espace (admin.locweb.fr) arrive ici.
// Textes et photos (contenu_site), articles et prix (produits), galerie (realisations).
// Le HTML garde tout en dur : si la base ne répond pas, le site reste complet.
(function () {
  'use strict';
  var C = window.LOCWEB_CONFIG;
  if (!C || !C.supabaseUrl || !C.clientId) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var lire = function (table, requete) {
    return fetch(C.supabaseUrl + '/rest/v1/' + table + '?client_id=eq.' + encodeURIComponent(C.clientId) + '&' + requete, {
      headers: { apikey: C.supabaseAnonKey, Authorization: 'Bearer ' + C.supabaseAnonKey },
    }).then(function (r) { if (!r.ok) throw new Error('Supabase ' + r.status); return r.json(); });
  };
  var euros = function (p) { return (Number.isInteger(p) ? String(p) : p.toFixed(2).replace('.', ',')) + '\u00a0€'; };

  /* Textes et photos. Une photo vide garde celle du site. */
  lire('contenu_site', 'select=cle_bloc,valeur').then(function (lignes) {
    var v = {};
    lignes.forEach(function (l) { v[l.cle_bloc] = l.valeur; });
    document.querySelectorAll('[data-editable-zone]').forEach(function (el) {
      var val = v[el.getAttribute('data-editable-zone')];
      if (!val) return;
      if (el.tagName === 'IMG') { el.removeAttribute('srcset'); el.removeAttribute('sizes'); el.src = val; } else el.textContent = val;
    });
    // Les marchés : une ligne vidée disparaît, une date passée aussi tant qu'elle n'a pas été changée.
    document.querySelectorAll('[data-marche]').forEach(function (li) {
      var n = li.getAttribute('data-marche'), quand = v['cdc_marche_' + n + '_quand'];
      if (quand === undefined) return;
      var perime = li.getAttribute('data-jusquau') && quand === li.getAttribute('data-texte') && new Date(li.getAttribute('data-jusquau') + 'T23:59:59') < new Date();
      li.hidden = !quand || perime;
    });
  }).catch(function (e) { console.warn('Contenu indisponible, le site garde le sien.', e); });

  /* Les articles : une carte par catégorie. Une catégorie sans article disparaît, une nouvelle s'ajoute. */
  var ligneArticle = function (p) {
    var a = p.prix > 0 ? '<span class="article-prix">' + euros(Number(p.prix)) + '</span>' : '<span class="article-prix article-prix-texte">Sur demande</span>';
    return '<li><a class="article" href="#contact" data-commander="' + esc(p.id) + '"><span class="article-nom">' + esc(p.nom) + '</span>' + a + '<span class="article-cmd">Commander</span></a></li>';
  };
  lire('produits', 'disponible=eq.true&select=id,nom,prix,categorie&order=prix.asc,nom.asc').then(function (liste) {
    // « Nouveau produit » : elle vient de toucher Ajouter et n'a pas encore écrit le nom.
    liste = liste.filter(function (p) { return p.nom && p.nom !== 'Nouveau produit'; });
    if (!liste.length) return;
    var parCat = {}, ordre = [];
    liste.forEach(function (p) {
      var c = (p.categorie || '').trim() || 'Autres créations';
      if (!parCat[c]) { parCat[c] = []; ordre.push(c); }
      parCat[c].push(p);
    });
    var AUSSI = 'Sur demande', cartes = document.querySelector('.carte');
    cartes.querySelectorAll('[data-categorie]').forEach(function (g) {
      var c = g.getAttribute('data-categorie');
      if (!parCat[c]) { g.hidden = true; return; }
      g.querySelector('ul').innerHTML = parCat[c].map(ligneArticle).join('');
    });
    ordre.forEach(function (c) {
      if (c === AUSSI || cartes.querySelector('[data-categorie="' + c.replace(/["\\]/g, '') + '"]')) return;
      var d = document.createElement('div');
      d.className = 'carte-groupe';
      d.innerHTML = '<h3>' + esc(c) + '</h3><ul>' + parCat[c].map(ligneArticle).join('') + '</ul>';
      cartes.appendChild(d);
    });
    var aussi = document.querySelector('.aussi');
    aussi.hidden = !parCat[AUSSI];
    if (parCat[AUSSI]) aussi.querySelector('.aussi-liste').innerHTML = parCat[AUSSI].map(function (p) { return '<a href="#contact" data-commander="' + esc(p.id) + '">' + esc(p.nom) + '</a>'; }).join('');
    // La même liste dans la fenêtre de commande (les retouches ne bougent pas).
    var choix = document.querySelector('[data-commande-modele]');
    choix.querySelectorAll('[data-produits]').forEach(function (o) { o.remove(); });
    var avant = choix.querySelector('optgroup');
    var dansLaPage = [].slice.call(cartes.querySelectorAll('[data-categorie]')).map(function (g) { return g.getAttribute('data-categorie'); });
    ordre.sort(function (a, b) {
      var rang = function (c) { var i = dansLaPage.indexOf(c); return c === AUSSI ? 1e3 : i < 0 ? 999 : i; };
      return rang(a) - rang(b);
    }).forEach(function (c) {
      var o = document.createElement('optgroup');
      o.label = c; o.setAttribute('data-produits', '');
      o.innerHTML = parCat[c].map(function (p) { return '<option value="' + esc(p.id) + '">' + esc(p.nom) + (p.prix > 0 ? ' (' + euros(Number(p.prix)) + ')' : '') + '</option>'; }).join('');
      choix.insertBefore(o, avant);
    });
  }).catch(function (e) { console.warn('Articles indisponibles, le site garde les siens.', e); });

  /* La galerie : ses photos, la plus récente d'abord. */
  lire('realisations', 'publiee=eq.true&select=titre,photo_apres&order=ordre.desc,cree_le.desc').then(function (liste) {
    liste = liste.filter(function (x) { return /^https:\/\//.test(x.photo_apres || ''); });
    if (!liste.length) return;
    document.querySelector('[data-galerie]').innerHTML = liste.map(function (x) {
      return '<figure><img src="' + esc(x.photo_apres) + '" alt="' + esc(x.titre || 'Une création de Chris') + '" loading="lazy" decoding="async">' + (x.titre ? '<figcaption>' + esc(x.titre) + '</figcaption>' : '') + '</figure>';
    }).join('');
  }).catch(function (e) { console.warn('Galerie indisponible, le site garde la sienne.', e); });
})();
