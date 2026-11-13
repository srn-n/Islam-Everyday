# Islam Everyday: the pictures behind the prayer (Settings -> Pictures), Nov 2026.
# The seven source pictures were generated with Figma's AI image tool (file "Islam Everyday - hero pictures" in the
# owner's Figma drafts) and exported as PNG. This turns them into the two WebP sizes the app uses:
#   python3 tools/hero-pictures.py <folder with mosque.png, dunes.png, lake.png, paddy.png, coast.png, pines.png, tea.png>
import os, sys
from PIL import Image
src = sys.argv[1]; out = os.path.join(os.path.dirname(__file__), "..", "assets", "heroes-img"); os.makedirs(out, exist_ok=True)
for n in ["mosque", "dunes", "lake", "paddy", "coast", "pines", "tea"]:
    im = Image.open(os.path.join(src, n + ".png")).convert("RGB")
    for w, suf in [(1200, ""), (720, "-s")]:
        im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(os.path.join(out, f"{n}{suf}.webp"), "WEBP", quality=78, method=6)
    print(n, "ok")
