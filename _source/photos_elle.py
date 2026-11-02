# Ses vraies photos, decoupees dans ses flyers (seule source pour l'instant, 2026-11-02).
# Petites : agrandies x2. A remplacer par les originaux des qu'elle les envoie.
# Usage : python -I _source/photos_elle.py
import os, json
from PIL import Image, ImageFilter

ICI = os.path.dirname(os.path.abspath(__file__))
DST = os.path.join(ICI, '..', 'photos')
dims = json.load(open(os.path.join(ICI, 'photos.json')))

for nom in ('table-a-langer', 'berceau', 'housse-matelas'):
    im = Image.open(os.path.join(ICI, 'elle', nom + '.png')).convert('RGB')
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 2))
    for larg in (1600, 800):
        c = im if im.width <= larg else im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
        c.save(os.path.join(DST, f'{nom}-{larg}.webp'), 'WEBP', quality=82, method=6)
    dims[nom] = {'l': im.width, 'h': im.height}
    print(nom, im.size)

# Image de partage 1200x630 : sa table a langer.
im = Image.open(os.path.join(ICI, 'elle', 'table-a-langer.png')).convert('RGB')
h = round(im.width * 630 / 1200); y = max(0, round(im.height * 0.4 - h / 2))
im.crop((0, y, im.width, y + h)).resize((1200, 630), Image.LANCZOS).save(os.path.join(DST, 'partage.jpg'), quality=84)
json.dump(dims, open(os.path.join(ICI, 'photos.json'), 'w'), indent=0)
