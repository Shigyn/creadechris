// Créa de Chris : en-tete, menu telephone, apparitions, apercu de broderie, demande de commande.
(function () {
  'use strict';
  var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var entete = document.querySelector('[data-entete]');
  var majEntete = function () {
    if (window.scrollY > 10) entete.setAttribute('data-ombre', '');
    else entete.removeAttribute('data-ombre');
  };
  window.addEventListener('scroll', majEntete, { passive: true });
  majEntete();

  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu-mobile');
  if (burger && menu) {
    var fermer = function () { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Ouvrir le menu'); };
    burger.addEventListener('click', function () {
      var ouvert = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!ouvert));
      burger.setAttribute('aria-label', ouvert ? 'Ouvrir le menu' : 'Fermer le menu');
      menu.hidden = ouvert;
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fermer(); });
  }

  var aReveler = document.querySelectorAll('.reveler');
  if ('IntersectionObserver' in window && !calme) {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        var freres = [].slice.call(e.target.parentNode.children).filter(function (x) { return x.classList.contains('reveler'); });
        e.target.style.transitionDelay = Math.min(freres.indexOf(e.target), 5) * 80 + 'ms';
        e.target.classList.add('vu');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    aReveler.forEach(function (el) { obs.observe(el); });
  } else {
    aReveler.forEach(function (el) { el.classList.add('vu'); });
  }

  /* L'apercu de broderie : le prenom, le tissu, le fil, l'ecriture. */
  var reglages = document.querySelector('[data-atelier]');
  var sac = document.querySelector('[data-sac]');
  var broderie = document.querySelector('[data-broderie]');
  var champPrenom = document.querySelector('[data-atelier-prenom]');
  var prenomAffiche = function () { return champPrenom.value.trim() || 'Son prénom'; };
  if (reglages && sac) {
    var maj = function () {
      broderie.textContent = prenomAffiche();
      broderie.style.fontSize = '';
      var f = new FormData(reglages);
      sac.setAttribute('data-tissu', f.get('tissu'));
      sac.setAttribute('data-fil', f.get('fil'));
      sac.setAttribute('data-ecriture', f.get('ecriture'));
      // Un prenom long reste dans le rabat.
      var rabat = broderie.parentNode;
      var taille = parseFloat(getComputedStyle(broderie).fontSize);
      while (broderie.scrollWidth > rabat.clientWidth * 0.86 && taille > 14) {
        taille -= 2;
        broderie.style.fontSize = taille + 'px';
      }
    };
    reglages.addEventListener('input', maj);
    reglages.addEventListener('change', maj);
    window.addEventListener('resize', maj);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(maj);
    maj();
  }

  /* Un marche passe disparait tout seul. */
  document.querySelectorAll('[data-jusquau]').forEach(function (li) {
    if (new Date(li.getAttribute('data-jusquau') + 'T23:59:59') < new Date()) li.hidden = true;
  });

  /* La commande : chaque bouton « Commander » ouvre la fenetre, deja
     remplie avec l'article choisi (et le prenom essaye plus haut). */
  var fenetre = document.querySelector('[data-fenetre]');
  var form = document.querySelector('[data-commande]');
  if (fenetre && form) {
    var choixModele = form.querySelector('[data-commande-modele]');
    var champCmdPrenom = form.querySelector('[data-commande-prenom]');
    var champDetails = form.querySelector('[data-commande-details]');

    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-commander]');
      if (!a || !fenetre.showModal) return;
      e.preventDefault();
      choixModele.value = a.getAttribute('data-commander');
      if (a.hasAttribute('data-depuis-atelier') && reglages) {
        var f = new FormData(reglages);
        var nomDe = function (nom) { var x = reglages.querySelector('input[name="' + nom + '"]:checked'); return x ? x.parentNode.querySelector('.nom').textContent : ''; };
        if (champPrenom.value.trim()) champCmdPrenom.value = champPrenom.value.trim();
        champDetails.value = 'Tissu ' + nomDe('tissu').toLowerCase() + ', fil ' + nomDe('fil').toLowerCase() + ', écriture ' + (f.get('ecriture') === 'baton' ? 'bâton' : 'attachée') + '.';
      }
      if (menu && !menu.hidden) burger.click();
      fenetre.showModal();
      (!choixModele.value ? choixModele : champCmdPrenom.value ? champDetails : champCmdPrenom).focus();
    });
    fenetre.querySelector('[data-fermer]').addEventListener('click', function () { fenetre.close(); });
    fenetre.addEventListener('click', function (e) { if (e.target === fenetre) fenetre.close(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var lignes = [
        'Bonjour Chris, je viens de votre site 🧵',
        'Je voudrais : ' + choixModele.options[choixModele.selectedIndex].text,
        f.get('prenom') ? 'Prénom à broder : ' + f.get('prenom') : '',
        f.get('quand') ? 'Pour : ' + f.get('quand') : '',
        f.get('details') ? 'Détails : ' + f.get('details') : '',
        f.get('premiere') ? 'C’est ma première commande (−5 %)' : '',
        f.get('nom') ? 'Merci ! ' + f.get('nom') : 'Merci !',
      ].filter(Boolean).join('\n');
      var numero = form.getAttribute('data-wa') || '';
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(lignes), '_blank', 'noopener');
      fenetre.close();
    });
  }
})();
