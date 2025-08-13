#!/usr/bin/env python3
import argparse
from pathlib import Path
from typing import Tuple

import io
import numpy as np
from PIL import Image, ImageFilter, ImageOps
import cv2 as cv


def load_image(path: Path) -> Image.Image:
	return Image.open(path).convert("RGBA")


def save_jpeg(image: Image.Image, path: Path, quality: int = 90) -> None:
	if image.mode in ("RGBA", "LA"):
		background = Image.new("RGB", image.size, (245, 245, 245))
		image = Image.alpha_composite(background.convert("RGBA"), image).convert("RGB")
	else:
		image = image.convert("RGB")
	path.parent.mkdir(parents=True, exist_ok=True)
	image.save(path, format="JPEG", quality=quality, optimize=True, progressive=True)


def generate_studio_background(size: Tuple[int, int]) -> Image.Image:
	width, height = size
	top_color = np.array([250, 249, 248], dtype=np.float32)
	bottom_color = np.array([240, 239, 238], dtype=np.float32)
	grad = np.linspace(0.0, 1.0, height, dtype=np.float32)[:, None]
	bg = (top_color * (1.0 - grad) + bottom_color * grad).astype(np.uint8)
	bg = np.repeat(bg, width, axis=1).transpose(1, 0, 2)
	bg_img = Image.fromarray(bg, mode="RGB")
	vignette = Image.new("L", size, 0)
	radius = int(min(width, height) * 0.55)
	vignette = Image.new("L", size, 255).filter(ImageFilter.GaussianBlur(radius=radius))
	vignette = ImageOps.invert(vignette)
	vignette = ImageOps.colorize(vignette, black=(0, 0, 0), white=(255, 255, 255))
	vignette = vignette.convert("RGBA")
	bg_img = bg_img.convert("RGBA")
	bg_img = Image.alpha_composite(bg_img, (vignette.putalpha(40) or vignette))
	return bg_img.convert("RGBA")


def chroma_key_rgba(rgba: Image.Image) -> Image.Image:
	# Convert to OpenCV format
	bgr = cv.cvtColor(np.array(rgba.convert("RGB")), cv.COLOR_RGB2BGR)
	hsv = cv.cvtColor(bgr, cv.COLOR_BGR2HSV)
	# Green range (tune if needed)
	lower = np.array([35, 35, 35])
	upper = np.array([85, 255, 255])
	mask = cv.inRange(hsv, lower, upper)
	# Clean mask
	kernel = np.ones((5, 5), np.uint8)
	mask = cv.morphologyEx(mask, cv.MORPH_OPEN, kernel, iterations=1)
	mask = cv.morphologyEx(mask, cv.MORPH_DILATE, kernel, iterations=1)
	# Soft edges
	mask_blur = cv.GaussianBlur(mask, (0, 0), sigmaX=2, sigmaY=2)
	alpha = 255 - mask_blur
	rgb = np.array(rgba.convert("RGB"))
	out = np.dstack([rgb, alpha])
	return Image.fromarray(out, mode="RGBA")


def green_despill(rgba: Image.Image) -> Image.Image:
	arr = np.array(rgba).astype(np.float32)
	r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
	edge = (a > 0) & (a < 255)
	green_dominant = (g > r + 6) & (g > b + 6)
	mask = edge & green_dominant
	if np.any(mask):
		avg_rb = (r + b) / 2
		g[mask] = np.minimum(g[mask] * 0.88, avg_rb[mask] * 0.96)
		for ch in (r, g, b):
			ch[edge] = ch[edge] * 0.985 + 120 * 0.015
	arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3] = r, g, b, a
	return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), mode="RGBA")


def add_contact_shadow(canvas: Image.Image, subject_bbox: Tuple[int, int, int, int]) -> Image.Image:
	x0, y0, x1, y1 = subject_bbox
	w = x1 - x0
	shadow_width = int(w * 0.7)
	shadow_height = max(8, int(w * 0.08))
	ellipse = Image.new("L", (shadow_width, shadow_height), 0)
	ellipse_pixels = np.array(ellipse)
	pad = int(shadow_height * 0.15)
	ellipse_pixels[pad:shadow_height - pad, pad:shadow_width - pad] = 200
	ellipse = Image.fromarray(ellipse_pixels, mode="L").filter(ImageFilter.GaussianBlur(radius=int(shadow_height * 0.9)))
	shadow_rgba = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
	shadow_x = x0 + (w - shadow_width) // 2
	shadow_y = y1 - int(shadow_height * 0.35)
	shadow_colored = Image.new("RGBA", (shadow_width, shadow_height), (0, 0, 0, 160))
	shadow_colored.putalpha(ellipse)
	shadow_rgba.alpha_composite(shadow_colored, (shadow_x, shadow_y))
	return Image.alpha_composite(canvas, shadow_rgba)


def fit_subject_on_canvas(subject: Image.Image, canvas_size: Tuple[int, int]) -> Tuple[Image.Image, Tuple[int, int, int, int]]:
	canvas_w, canvas_h = canvas_size
	max_w, max_h = int(canvas_w * 0.8), int(canvas_h * 0.8)
	subj_w, subj_h = subject.size
	scale = min(max_w / subj_w, max_h / subj_h)
	scaled = subject.resize((max(1, int(subj_w * scale)), max(1, int(subj_h * scale))), Image.LANCZOS)
	offset_x = (canvas_w - scaled.width) // 2
	offset_y = int((canvas_h - scaled.height) * 0.48)
	bbox = (offset_x, offset_y, offset_x + scaled.width, offset_y + scaled.height)
	return scaled, bbox


def process_image(path: Path, output_dir: Path, canvas_size: int = 2048) -> None:
	orig = load_image(path)
	cut = chroma_key_rgba(orig)
	cut = green_despill(cut)
	canvas = generate_studio_background((canvas_size, canvas_size))
	subject_fitted, bbox = fit_subject_on_canvas(cut, (canvas_size, canvas_size))
	composed = canvas.copy()
	composed.alpha_composite(subject_fitted, (bbox[0], bbox[1]))
	composed = add_contact_shadow(composed, bbox)
	grain = np.random.normal(loc=0.0, scale=2.0, size=(canvas_size, canvas_size, 1)).astype(np.float32)
	base = np.array(composed).astype(np.float32)
	base[..., :3] = np.clip(base[..., :3] + grain, 0, 255)
	composed = Image.fromarray(base.astype(np.uint8), mode="RGBA")
	out_path = output_dir / (path.stem + ".jpg")
	save_jpeg(composed, out_path)
	print(f"Saved: {out_path}")


def main():
	parser = argparse.ArgumentParser(description="Batch green screen removal and realistic studio composite for Vinted images.")
	parser.add_argument("--input", required=True, help="Input directory with images")
	parser.add_argument("--output", required=True, help="Output directory for JPEGs")
	parser.add_argument("--size", type=int, default=2048, help="Canvas size (square)")
	args = parser.parse_args()

	inp = Path(args.input)
	out = Path(args.output)
	out.mkdir(parents=True, exist_ok=True)

	images = [p for p in inp.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"}]
	if not images:
		print(f"No images found in {inp}. Place your files there and run again.")
		return

	for p in images:
		try:
			process_image(p, out, canvas_size=args.size)
		except Exception as e:
			print(f"Failed {p.name}: {e}")


if __name__ == "__main__":
	main()