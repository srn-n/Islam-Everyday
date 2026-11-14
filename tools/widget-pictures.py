# Islam Everyday: the pictures behind the Android home-screen widgets (Settings -> Widgets), 13 Nov 2026.
# The seven source pictures were generated on 14 Nov 2026 with Picsart's AI image generator (AI Playground, GPT Image
# 2.5 Sunburst, 2K 16:9, in the owner's Picsart account; different scenes from the hero pictures), saved as PNG.
# (They replaced a first set made with Figma's AI image tool on 13 Nov.) This makes the one WebP size the
# app uses (the widget crops it to its own shape on the phone; Settings shows it as a preview):
#   python3 tools/widget-pictures.py <folder with lavender.png, bamboo.png, glacier.png, olive.png, aurora.png, valley.png, blossom.png>
import os, sys
from PIL import Image
src = sys.argv[1]; out = os.path.join(os.path.dirname(__file__), "..", "assets", "widgets-img"); os.makedirs(out, exist_ok=True)
for n in ["lavender", "bamboo", "glacier", "olive", "aurora", "valley", "blossom"]:
    im = Image.open(os.path.join(src, n + ".png")).convert("RGB")
    im.resize((960, round(im.height * 960 / im.width)), Image.LANCZOS).save(os.path.join(out, n + ".webp"), "WEBP", quality=76, method=6)
    print(n, "ok")
