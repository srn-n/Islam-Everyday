# Islam Everyday: the pictures behind the Android home-screen widgets (WG_SETS in assets/app.js).
# Each kind of widget has its own seven (16 Nov 2026), so two widgets on one home screen never show the same picture:
#   large  (Verse, large): lavender bamboo glacier olive aurora valley blossom   (generated 14 Nov 2026)
#   prayer (Prayer times): orchard fjord oasis heather terraces birch lagoon     (generated 16 Nov 2026)
#   verse  (Verse):        maple cliffs savanna tulips river bluebell starry     (generated 16 Nov 2026)
# All made with Picsart's AI image generator (AI Playground, GPT Image 2.5 Sunburst, 2K 16:9, in the owner's Picsart
# account; scenes other than the hero pictures), saved as PNG (2560 x 1440). They show no real place. (A first set made
# with Figma's AI image tool on 13 Nov was replaced on 14 Nov.)
# This makes the one WebP size the app uses (the widget crops it to its own shape on the phone):
#   python3 tools/widget-pictures.py <folder with <name>.png>   (converts every listed name found in the folder)
import os, sys
from PIL import Image
NAMES = ["lavender", "bamboo", "glacier", "olive", "aurora", "valley", "blossom",
         "orchard", "fjord", "oasis", "heather", "terraces", "birch", "lagoon",
         "maple", "cliffs", "savanna", "tulips", "river", "bluebell", "starry"]
src = sys.argv[1]; out = os.path.join(os.path.dirname(__file__), "..", "assets", "widgets-img"); os.makedirs(out, exist_ok=True)
for n in NAMES:
    f = os.path.join(src, n + ".png")
    if not os.path.exists(f): continue
    im = Image.open(f).convert("RGB")
    im = im.resize((960, round(im.height * 960 / im.width)), Image.LANCZOS); o = os.path.join(out, n + ".webp")
    for q in (76, 70, 64, 58, 52):  # very detailed scenes (a birch forest) are saved a little softer, to stay under 150 KB
        im.save(o, "WEBP", quality=q, method=6)
        if os.path.getsize(o) < 150e3: break
    print(n, "ok")
