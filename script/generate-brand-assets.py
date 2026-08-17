from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "client" / "public"
CAMPUS_PATH = PUBLIC / "dankook-campus-hero.png"
LOGO_PATH = ROOT / "attached_assets" / "image_1767877726952.png"
OG_PATH = PUBLIC / "opengraph.jpg"
FAVICON_PATH = PUBLIC / "favicon.png"


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_width, target_height = size
    scale = max(target_width / image.width, target_height / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = max((resized.width - target_width) // 2, 0)
    top = max((resized.height - target_height) // 2, 0)
    return resized.crop((left, top, left + target_width, top + target_height))


def build_opengraph() -> None:
    canvas = cover(Image.open(CAMPUS_PATH).convert("RGB"), (1200, 630)).convert("RGBA")
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    pixels = overlay.load()
    for x in range(overlay.width):
        strength = max(0.18, 0.91 - (x / overlay.width) * 0.78)
        for y in range(overlay.height):
            vertical = 0.08 * (y / overlay.height)
            pixels[x, y] = (5, 35, 72, round(255 * min(strength + vertical, 0.96)))
    canvas = Image.alpha_composite(canvas, overlay)

    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((70, 68, 470, 174), radius=18, fill=(255, 255, 255, 246))
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo.thumbnail((340, 74), Image.Resampling.LANCZOS)
    canvas.alpha_composite(logo, (100, 84))

    draw.rectangle((74, 238, 84, 475), fill=(244, 160, 0, 255))
    bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 45)
    regular = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    draw.text((112, 246), "GRADUATE SCHOOL", font=regular, fill=(191, 216, 247, 255))
    draw.multiline_text(
        (108, 294),
        "DATA KNOWLEDGE\nSERVICE ENGINEERING",
        font=bold,
        fill=(255, 255, 255, 255),
        spacing=12,
    )
    draw.text((108, 530), "DANKOOK UNIVERSITY", font=regular, fill=(213, 228, 246, 255))
    canvas.convert("RGB").save(OG_PATH, quality=92, optimize=True, progressive=True)


def build_favicon() -> None:
    logo = Image.open(LOGO_PATH).convert("RGBA")
    mark = logo.crop((0, 0, 118, 60))
    alpha_bbox = mark.getchannel("A").getbbox()
    if alpha_bbox:
        mark = mark.crop(alpha_bbox)

    canvas = Image.new("RGBA", (512, 512), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((18, 18, 494, 494), radius=92, fill=(255, 255, 255, 255), outline=(221, 229, 241, 255), width=10)
    mark.thumbnail((420, 300), Image.Resampling.LANCZOS)
    x = (canvas.width - mark.width) // 2
    y = (canvas.height - mark.height) // 2
    canvas.alpha_composite(mark, (x, y))
    canvas.save(FAVICON_PATH, optimize=True)


if __name__ == "__main__":
    PUBLIC.mkdir(parents=True, exist_ok=True)
    build_opengraph()
    build_favicon()
    print(f"Generated {OG_PATH.relative_to(ROOT)} and {FAVICON_PATH.relative_to(ROOT)}")
