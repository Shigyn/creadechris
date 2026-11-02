# Prepare les photos de l'apercu Créa de Chris (LocWeb, 2026-11-02).
# Toutes viennent d'Unsplash (licence libre), comme toujours avant paiement :
# ses propres photos sur Facebook n'existent qu'en vignettes et montrent des
# tissus sous licence (personnages de dessins animes), a ne pas publier.
# A remplacer par ses photos a la mise en ligne.
# Usage : python -I _source/photos.py <dossier des photos Unsplash HD>
import os, sys, json
from PIL import Image, ImageOps

SRC = sys.argv[1]
ICI = os.path.dirname(os.path.abspath(__file__))
DST = os.path.join(ICI, '..', 'photos')
os.makedirs(DST, exist_ok=True)

PHOTOS = {
    '1773511237767-0e324389922a': 'couture-machine-mains',
    '1765329104418-b16804330f90': 'enfant-sac-a-dos-allee',
    '1503919545889-aef636e10ad4': 'enfant-sac-a-dos-cire-jaune',
    '1765516833058-c322c800fee1': 'sac-a-dos-pose',
    '1762006496605-4a2647f542ac': 'doudous-lapins-panier',
    '1773747488340-b4a6181f10f5': 'doudou-elephant',
    '1768693602418-260d828b878d': 'linge-bebe-panier',
    '1771409046945-917ec1c2e25a': 'broderie-coeur',
    '1771479452306-6dad4a9fbec0': 'broderie-fleur',
    '1771098403216-ca0c3c2858c0': 'tissus-rouleaux',
    '1640746942093-cec8e647596d': 'tissus-plies',
    '1578353022142-09264fd64295': 'fils-et-ciseaux',
    '1644288054812-aa3ec742c419': 'couture-noir-et-blanc',
    '1623069485778-ca15fe447464': 'gigoteuses-suspendues',
}

dims = json.load(open(os.path.join(ICI, 'photos.json')))
for src, nom in PHOTOS.items():
    # Seules les photos presentes dans le dossier sont refaites.
    if not os.path.exists(os.path.join(SRC, src + '.jpg')): continue
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, src + '.jpg'))).convert('RGB')
    for larg in (1600, 800):
        c = im if im.width <= larg else im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
        c.save(os.path.join(DST, f'{nom}-{larg}.webp'), 'WEBP', quality=78, method=6)
    big = Image.open(os.path.join(DST, f'{nom}-1600.webp'))
    dims[nom] = {'l': big.width, 'h': big.height}
    print(f'{nom:30s} {im.width}x{im.height}')

# L'image de partage est faite par photos_elle.py, a partir de ses photos.
json.dump(dims, open(os.path.join(ICI, 'photos.json'), 'w'), indent=0)
