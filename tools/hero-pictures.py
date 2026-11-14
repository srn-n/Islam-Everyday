# Islam Everyday: the pictures behind the prayer (Settings -> Pictures), Nov 2026.
# The first seven source pictures were generated with Figma's AI image tool (file "Islam Everyday - hero pictures" in
# the owner's Figma drafts) and exported as PNG. The last five (14 Nov 2026) were generated in Picsart's AI Playground
# (GPT Image 2.5 Sunburst, 2K, 16:9) on the owner's account and downloaded as PNG (2560 x 1440). This turns them into
# the two WebP sizes the app uses (pictures missing from the folder are skipped, so one batch can be redone alone):
#   python3 tools/hero-pictures.py <folder with <name>.png for the names below>
import os, sys
from PIL import Image
src = sys.argv[1]; out = os.path.join(os.path.dirname(__file__), "..", "assets", "heroes-img"); os.makedirs(out, exist_ok=True)
for n in ["mosque", "dunes", "lake", "paddy", "coast", "pines", "tea", "canyon", "meadow", "mangrove", "village", "falls"]:
    if not os.path.exists(os.path.join(src, n + ".png")): continue
    im = Image.open(os.path.join(src, n + ".png")).convert("RGB")
    for w, suf in [(1200, ""), (720, "-s")]:
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS); f = os.path.join(out, f"{n}{suf}.webp")
        for q in range(78, 25, -4):  # detailed pictures step down in quality until the file stays under 105 KB
            r.save(f, "WEBP", quality=q, method=6)
            if os.path.getsize(f) < 105e3: break
    print(n, "ok")
