// Créa de Chris : son espace. Le catalogue (ajouter, modifier, supprimer) et les horaires.
(function () {
  'use strict';
  var FN = window.LOCWEB_CONFIG.supabaseUrl + '/functions/v1/cdc-espace';
  var CLE = 'cdc-espace-jeton';
  // L'ordre de la page d'accueil ; une nouvelle catégorie passe après, « Sur demande » en dernier.
  var ORDRE = ['Les indispensables', 'Idées cadeaux', 'Pratique au quotidien', 'Dodo et crèche', 'Gilet du berger', 'Noël et sacs'];
  var AUSSI = 'Sur demande';
  var JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  var app = document.getElementById('app');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var euros = function (p) { p = Number(p); return p > 0 ? (Number.isInteger(p) ? String(p) : p.toFixed(2).replace('.', ',')) + ' €' : 'Sur demande'; };
  var prixChamp = function (p) { p = Number(p); return p > 0 ? (Number.isInteger(p) ? String(p) : p.toFixed(2).replace('.', ',')) : ''; };
  var majuscule = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };

  var jeton = null;
  try { jeton = localStorage.getItem(CLE); } catch (e) {}
  var donnees = { produits: [], horaires: {} };
  var edition = null; // l'id de l'article ouvert, ou 'nouveau'
  var vue = 'catalogue'; // le menu : catalogue ou horaires
  var categorie = null; // le sous-menu du catalogue

  function appel(action, extra) {
    return fetch(FN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ action: action, jeton: jeton }, extra || {})) })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.status === 401 && action !== 'connexion') { sortir(); throw new Error(j.refus || 'Reconnectez-vous.'); }
          if (!r.ok) throw new Error(j.refus || 'Le serveur ne répond pas. Réessayez dans un instant.');
          return j;
        });
      });
  }
  function sortir() { jeton = null; try { localStorage.removeItem(CLE); } catch (e) {} ecranCode(); }

  var minuteur;
  function bulle(t, erreur) {
    var b = document.querySelector('[data-bulle]');
    b.textContent = t; b.classList.toggle('es-erreur', !!erreur); b.hidden = false;
    clearTimeout(minuteur); minuteur = setTimeout(function () { b.hidden = true; }, erreur ? 5000 : 2200);
  }

  /* ---------------- le code ---------------- */
  function ecranCode(msg) {
    app.innerHTML = '<form class="es-code" data-code><p class="es-marque">Créa de Chris</p><h1>Mon espace</h1><p>Tapez votre code à 8 chiffres.</p>' +
      '<input data-champ inputmode="numeric" maxlength="8" autocomplete="off" aria-label="Code" placeholder="••••••••">' +
      '<button class="bouton bouton-plein" type="submit">Entrer</button><p class="es-alerte" data-err>' + esc(msg || '') + '</p></form>';
    var champ = app.querySelector('[data-champ]'), err = app.querySelector('[data-err]');
    champ.focus();
    app.querySelector('[data-code]').addEventListener('submit', function (e) {
      e.preventDefault();
      if (champ.value.replace(/\D/g, '').length !== 8) { err.textContent = 'Le code fait 8 chiffres.'; return; }
      err.textContent = 'Vérification…';
      appel('connexion', { code: champ.value }).then(function (j) {
        jeton = j.jeton;
        try { localStorage.setItem(CLE, jeton); } catch (x) {}
        charger();
      }).catch(function (x) { err.textContent = x.message; champ.select(); });
    });
  }

  /* ---------------- l'espace ---------------- */
  function charger() {
    app.innerHTML = '<p class="es-attente">Chargement…</p>';
    appel('lire').then(function (j) { donnees = j; edition = null; dessiner(); })
      .catch(function (x) { if (jeton) app.innerHTML = '<p class="es-attente">' + esc(x.message) + '</p><p class="es-attente"><button class="bouton bouton-ligne" type="button" data-relancer>Réessayer</button></p>'; });
  }
  function categories() {
    var vues = {};
    donnees.produits.forEach(function (p) { if (p.categorie) vues[p.categorie] = 1; });
    var autres = Object.keys(vues).filter(function (c) { return ORDRE.indexOf(c) < 0 && c !== AUSSI; }).sort();
    return ORDRE.concat(autres, [AUSSI]);
  }
  function formulaire(p) {
    var cat = p ? p.categorie : categorie;
    var liste = categories();
    return '<form class="es-form" data-form="' + (p ? esc(p.id) : 'nouveau') + '">' +
      '<label class="es-champ"><span>Nom de l’article</span><input name="nom" maxlength="80" required value="' + esc(p ? p.nom : '') + '"></label>' +
      '<label class="es-champ"><span>Prix en euros <small>(vide = sur demande)</small></span><input name="prix" inputmode="decimal" placeholder="ex. 15,50" value="' + esc(p ? prixChamp(p.prix) : '') + '"></label>' +
      '<label class="es-champ"><span>Catégorie</span><select name="categorie" data-cat>' +
      liste.map(function (c) { return '<option' + (c === cat ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') +
      '<option value="__nouvelle">+ Nouvelle catégorie…</option></select></label>' +
      '<label class="es-champ" data-cat-nouvelle hidden><span>Nom de la catégorie</span><input name="nouvelle" maxlength="40"></label>' +
      '<div class="es-actions"><button class="bouton bouton-plein" type="submit">Enregistrer</button><button class="bouton bouton-ligne" type="button" data-annuler>Annuler</button>' +
      (p ? '<button class="es-supprimer" type="button" data-supprimer="' + esc(p.id) + '">Supprimer</button>' : '') + '</div></form>';
  }
  function dessiner() {
    var parCat = {};
    donnees.produits.forEach(function (p) { (parCat[p.categorie || 'Sans catégorie'] = parCat[p.categorie || 'Sans catégorie'] || []).push(p); });
    var liste = categories();
    if (parCat['Sans catégorie']) liste = liste.concat(['Sans catégorie']);
    // Les categories qui ont des articles, plus celle ou l'on vient d'en vider une.
    var pleines = liste.filter(function (c) { return parCat[c]; });
    if (!categorie || (!parCat[categorie] && edition !== 'nouveau')) categorie = pleines[0] || liste[0];

    var bloc = vue === 'horaires'
      ? '<section class="es-bloc"><h2>Mes horaires</h2><p class="es-aide">Écrivez comme vous voulez : « 9h – 12h », « Sur rendez-vous ». Un jour vide s’affiche « Fermé ». Si tous les jours sont vides, les horaires n’apparaissent pas sur le site.</p>' +
        '<form class="es-horaires" data-horaires>' + JOURS.map(function (j) {
          return '<label class="es-champ"><span>' + majuscule(j) + '</span><input name="' + j + '" maxlength="60" value="' + esc(donnees.horaires[j]) + '"></label>';
        }).join('') + '<button class="bouton bouton-plein" type="submit">Enregistrer les horaires</button></form></section>'
      : '<nav class="es-sous-menu" aria-label="Catégories">' + pleines.map(function (c) {
          return '<button type="button" data-categorie="' + esc(c) + '"' + (c === categorie ? ' class="on" aria-current="true"' : '') + '>' + esc(c) + ' <small>' + parCat[c].length + '</small></button>';
        }).join('') + '</nav>' +
        '<section class="es-bloc"><div class="es-bloc-tete"><h2>' + esc(categorie) + '</h2><button class="bouton bouton-plein" type="button" data-ajouter>+ Ajouter un article</button></div>' +
        '<p class="es-aide">Touchez un article pour le modifier ou le supprimer. Ce que vous changez est sur votre site tout de suite.</p>' +
        (edition === 'nouveau' ? formulaire(null) : '') +
        '<ul class="es-liste">' + (parCat[categorie] || []).map(function (p) {
          return edition === p.id ? '<li>' + formulaire(p) + '</li>'
            : '<li><button type="button" class="es-article" data-ouvrir="' + esc(p.id) + '"><span>' + esc(p.nom) + '</span><b>' + esc(euros(p.prix)) + '</b></button></li>';
        }).join('') + '</ul></section>';

    app.innerHTML =
      '<header class="es-tete"><div><p class="es-marque">Créa de Chris</p><h1>Mon espace</h1></div>' +
      '<div class="es-liens"><a href="../" target="_blank" rel="noopener">Voir mon site</a><button type="button" data-sortir>Se déconnecter</button></div></header>' +
      '<nav class="es-menu" aria-label="Menu">' + [['catalogue', 'Catalogue'], ['horaires', 'Horaires']].map(function (m) {
        return '<button type="button" data-vue="' + m[0] + '"' + (vue === m[0] ? ' class="on" aria-current="page"' : '') + '>' + m[1] + '</button>';
      }).join('') + '</nav>' + bloc +
      '<p class="es-bulle" data-bulle role="status" aria-live="polite" hidden></p>';
    var f = app.querySelector('[data-form] input');
    if (f) { f.focus(); f.closest('form').scrollIntoView({ block: 'center' }); }
  }

  /* ---------------- les gestes ---------------- */
  app.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-sortir]')) { sortir(); return; }
    if (t.closest('[data-relancer]')) { charger(); return; }
    var m = t.closest('[data-vue]');
    if (m) { vue = m.getAttribute('data-vue'); edition = null; dessiner(); return; }
    var sm = t.closest('[data-categorie]');
    if (sm) { categorie = sm.getAttribute('data-categorie'); edition = null; dessiner(); return; }
    if (t.closest('[data-ajouter]')) { edition = 'nouveau'; dessiner(); return; }
    if (t.closest('[data-annuler]')) { edition = null; dessiner(); return; }
    var o = t.closest('[data-ouvrir]');
    if (o) { edition = o.getAttribute('data-ouvrir'); dessiner(); return; }
    var s = t.closest('[data-supprimer]');
    if (s) {
      var id = s.getAttribute('data-supprimer');
      var p = donnees.produits.filter(function (x) { return x.id === id; })[0];
      if (!p || !confirm('Supprimer « ' + p.nom + ' » de votre site ?')) return;
      s.disabled = true;
      appel('supprimer', { id: id }).then(function () {
        donnees.produits = donnees.produits.filter(function (x) { return x.id !== id; });
        edition = null; dessiner(); bulle('Article supprimé');
      }).catch(function (x) { s.disabled = false; bulle(x.message, true); });
    }
  });
  app.addEventListener('change', function (e) {
    if (!e.target.matches('[data-cat]')) return;
    var bloc = e.target.closest('form').querySelector('[data-cat-nouvelle]');
    bloc.hidden = e.target.value !== '__nouvelle';
    if (!bloc.hidden) bloc.querySelector('input').focus();
  });
  app.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.matches('[data-form]')) {
      e.preventDefault();
      var id = form.getAttribute('data-form'), nouveau = id === 'nouveau';
      var cat = form.categorie.value === '__nouvelle' ? form.nouvelle.value : form.categorie.value;
      var b = form.querySelector('[type=submit]'); b.disabled = true;
      appel(nouveau ? 'ajouter' : 'modifier', { id: nouveau ? undefined : id, nom: form.nom.value, prix: form.prix.value, categorie: cat }).then(function (j) {
        if (nouveau) donnees.produits.push(j.produit);
        else donnees.produits = donnees.produits.map(function (x) { return x.id === id ? j.produit : x; });
        donnees.produits.sort(function (a, c) { return Number(a.prix) - Number(c.prix) || String(a.nom).localeCompare(c.nom, 'fr'); });
        edition = null; categorie = j.produit.categorie; dessiner(); bulle(nouveau ? 'Article ajouté' : 'Article enregistré');
      }).catch(function (x) { b.disabled = false; bulle(x.message, true); });
      return;
    }
    if (form.matches('[data-horaires]')) {
      e.preventDefault();
      var h = {};
      JOURS.forEach(function (j) { h[j] = form[j].value; });
      var bt = form.querySelector('[type=submit]'); bt.disabled = true;
      appel('horaires', { horaires: h }).then(function () { donnees.horaires = h; bt.disabled = false; bulle('Horaires enregistrés'); })
        .catch(function (x) { bt.disabled = false; bulle(x.message, true); });
    }
  });

  if (jeton) charger(); else ecranCode();
})();
