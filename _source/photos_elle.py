# Ses vraies photos (envoyees par Messenger le 2026-11-02), recadrees pour le site.
# Les originaux restent dans _source/photos-elle/, hors du depot : on y trouve son
# flyer avec son adresse et des tissus sous licence, a ne jamais publier.
# Usage : python -I _source/photos_elle.py
import os, json
from PIL import Image, ImageOps

ICI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ICI, 'photos-elle')
DST = os.path.join(ICI, '..', 'photos')
dims = json.load(open(os.path.join(ICI, 'photos.json')))

# nom : (original, quart de tour a gauche, format largeur/hauteur, centre vertical du cadre)
PHOTOS = {
    'chambre-table-a-langer': ('p10', 0, 4 / 3, .72),
    'berceau-oursons': ('p07', 0, 16 / 9, .5),
    'peignoir-brode': ('p21', 0, 4 / 5, .45),
    'sac-a-langer-foret': ('p17', 0, 16 / 9, .5),
    'attaches-tetine-prenom': ('p08', 0, 16 / 9, .42),
    'lingettes-lavables': ('p20', 1, 16 / 9, .5),
    'gilet-berger-bouclette': ('p19', 0, 16 / 9, .3),
    'boule-de-noel': ('p11', 0, 16 / 9, .68),
}

def cadre(im, f, cy):
    h = min(im.height, round(im.width / f)); l = min(im.width, round(h * f))
    x = (im.width - l) // 2; y = min(im.height - h, max(0, round(im.height * cy - h / 2)))
    return im.crop((x, y, x + l, y + h))

for nom, (src, tours, f, cy) in PHOTOS.items():
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, src + '.jpg'))).convert('RGB')
    if tours: im = im.rotate(90 * tours, expand=True)
    im = cadre(im, f, cy)
    for larg in (1600, 800):
        c = im if im.width <= larg else im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
        c.save(os.path.join(DST, f'{nom}-{larg}.webp'), 'WEBP', quality=82, method=6)
    dims[nom] = {'l': min(im.width, 1600), 'h': round(im.height * min(im.width, 1600) / im.width)}
    print(nom, im.size)

# Image de partage 1200x630 : la chambre.
im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, 'p10.jpg'))).convert('RGB')
cadre(im, 1200 / 630, .72).resize((1200, 630), Image.LANCZOS).save(os.path.join(DST, 'partage.jpg'), quality=84)
json.dump(dims, open(os.path.join(ICI, 'photos.json'), 'w'), indent=0)
