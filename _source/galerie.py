# La galerie « Mes créations » : ses photos sans texte ajouté, ni personnage sous licence.
# Sort les images du site (repli si la base ne répond pas) et, en 2e argument, un
# dossier avec les mêmes en JPEG, à déposer dans le stockage de l'espace pro.
# Usage : python -I _source/galerie.py [dossier des JPEG]
import os, sys, json
from PIL import Image, ImageOps

ICI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ICI, 'photos-elle')
DST = os.path.join(ICI, '..', 'photos')
dims = json.load(open(os.path.join(ICI, 'photos.json')))
JPEG = sys.argv[1] if len(sys.argv) > 1 else None

# nom : (original, quart de tour a gauche, part gardee en haut, part gardee en bas)
GALERIE = {
    'g-gigoteuse': ('p22', 0, 0, 1),
    'g-peignoir': ('p21', 0, 0, 1),
    'g-sortie-de-bain': ('p01', 0, 0, 1),
    'g-doudou': ('p02', 0, 0, 1),
    'g-sac-a-dos': ('p15', 0, 0, 1),
    'g-housse': ('p04', 0, .16, 1),
    'g-gilet': ('p19', 0, 0, 1),
    'g-chouchous': ('p24', 0, 0, .84),
    'g-attaches-tetine': ('p08', 0, 0, 1),
    'g-lingettes': ('p20', 1, 0, 1),
    'g-sac-a-langer': ('p17', 0, 0, 1),
    'g-boule-de-noel': ('p11', 0, 0, 1),
}

for nom, (src, tours, haut, bas) in GALERIE.items():
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, src + '.jpg'))).convert('RGB')
    if tours: im = im.rotate(90 * tours, expand=True)
    im = im.crop((0, round(im.height * haut), im.width, round(im.height * bas)))
    # Tuiles carrees sur le site : assez de pixels pour 2 tuiles de large sur grand ecran.
    c = im.copy(); c.thumbnail((800, 800))
    c.save(os.path.join(DST, nom + '-800.webp'), 'WEBP', quality=80, method=6)
    c = im.copy(); c.thumbnail((1200, 1200))
    c.save(os.path.join(DST, nom + '-1600.webp'), 'WEBP', quality=80, method=6)
    dims[nom] = {'l': c.width, 'h': c.height}
    if JPEG: c.save(os.path.join(JPEG, nom + '.jpg'), 'JPEG', quality=84)
    print(nom, c.size)
json.dump(dims, open(os.path.join(ICI, 'photos.json'), 'w'), indent=0)
