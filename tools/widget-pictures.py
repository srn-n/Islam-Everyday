# Islam Everyday: the pictures behind the Android home-screen widgets (Settings -> Widgets), 13 Nov 2026.
# The seven source pictures were generated with Figma's AI image tool (file "Islam Everyday - widget pictures" in the
# owner's Figma drafts; different scenes from the hero pictures) and exported as PNG. This makes the one WebP size the
# app uses (the widget crops it to its own shape on the phone; Settings shows it as a preview):
#   python3 tools/widget-pictures.py <folder with waterfall.png, river.png, snow.png, wheat.png, garden.png, stars.png, autumn.png>
import os, sys
from PIL import Image
src = sys.argv[1]; out = os.path.join(os.path.dirname(__file__), "..", "assets", "widgets-img"); os.makedirs(out, exist_ok=True)
for n in ["waterfall", "river", "snow", "wheat", "garden", "stars", "autumn"]:
    im = Image.open(os.path.join(src, n + ".png")).convert("RGB")
    im.resize((960, round(im.height * 960 / im.width)), Image.LANCZOS).save(os.path.join(out, n + ".webp"), "WEBP", quality=76, method=6)
    print(n, "ok")
