"""Lightweight room-scene validation for the free-tier AI service.

This intentionally uses only Pillow and NumPy so the Render service stays
small and fast. It looks for scene-level signals (spatial variation, a
wall/floor brightness split, and broad texture) instead of accepting every
uploaded image as a room.
"""

import numpy as np


def _scene_features(image):
    sample = image.convert("RGB").resize((192, 192))
    pixels = np.asarray(sample, dtype=np.float32) / 255.0
    gray = pixels.mean(axis=2)

    # Compare neighbouring pixels: rooms have edges from furniture, windows,
    # door frames and floor lines, while flat screenshots usually do not.
    edge_energy = float(
        (np.abs(np.diff(gray, axis=0)).mean() + np.abs(np.diff(gray, axis=1)).mean()) / 2
    )

    blocks = gray.reshape(8, 24, 8, 24).mean(axis=(1, 3))
    block_spread = float(blocks.std())
    top_brightness = float(gray[:64].mean())
    bottom_brightness = float(gray[-64:].mean())
    vertical_split = abs(top_brightness - bottom_brightness)
    color_spread = float(pixels.reshape(-1, 3).std(axis=0).mean())

    # Marketing creatives and portraits often have a large skin-tone region.
    # A room photo may contain a person, but a dominant face/person is not a
    # useful basis for furniture matching, so treat it as a non-room upload.
    red, green, blue = pixels[:, :, 0], pixels[:, :, 1], pixels[:, :, 2]
    skin_mask = (
        (red > 0.34)
        & (green > 0.18)
        & (blue > 0.10)
        & (red > green * 1.12)
        & (green > blue * 1.08)
    )
    skin_ratio = float(skin_mask.mean())
    upper_skin_ratio = float(skin_mask[:96].mean())
    lower_skin_ratio = float(skin_mask[96:].mean())

    return edge_energy, block_spread, vertical_split, color_spread, skin_ratio, upper_skin_ratio, lower_skin_ratio


def detect_room(image):
    width, height = image.size
    if width < 240 or height < 180:
        return {"is_room": False, "room_type": "Not a room", "confidence": 0, "reason": "Image is too small"}

    (
        edge_energy,
        block_spread,
        vertical_split,
        color_spread,
        skin_ratio,
        upper_skin_ratio,
        lower_skin_ratio,
    ) = _scene_features(image)

    portrait_signal = (
        skin_ratio >= 0.065
        and upper_skin_ratio >= 0.045
        and upper_skin_ratio > lower_skin_ratio * 1.25
    )

    if portrait_signal:
        return {
            "is_room": False,
            "room_type": "Not a room",
            "confidence": 94,
            "reason": "This looks like a portrait or promotional graphic. Please upload a clear photo of the room interior.",
        }

    # Scene-level score. The thresholds are deliberately conservative enough
    # to reject blank images, screenshots and close-up objects without adding
    # a heavy ML runtime to the Render free tier.
    score = 0
    if edge_energy >= 0.045:
        score += 1
    if block_spread >= 0.075:
        score += 1
    if vertical_split >= 0.055:
        score += 1
    if color_spread >= 0.09:
        score += 1

    is_room = score >= 3
    confidence = min(96, 52 + score * 11 + int(min(vertical_split, 0.2) * 45)) if is_room else max(12, score * 16)

    if not is_room:
        return {
            "is_room": False,
            "room_type": "Not a room",
            "confidence": confidence,
            "reason": "Please upload a clear photo showing a complete room or interior space",
        }

    # Room type remains intentionally explainable and lightweight. The visual
    # model can be upgraded later without changing the API contract.
    lower = image.convert("RGB").resize((96, 96)).crop((0, 48, 96, 96))
    lower_pixels = np.asarray(lower, dtype=np.float32).mean(axis=2)
    if lower_pixels.mean() < 0.42 and edge_energy > 0.065:
        room_type = "Living Room"
    elif vertical_split > 0.12:
        room_type = "Living Room"
    else:
        room_type = "Interior Space"

    return {
        "is_room": True,
        "room_type": room_type,
        "confidence": confidence,
        "signals": {
            "scene_detail": round(edge_energy, 3),
            "spatial_variation": round(block_spread, 3),
            "layout_split": round(vertical_split, 3),
            "human_presence": round(skin_ratio, 3),
        },
    }


def detect_room_type(image):
    """Backward-compatible helper used by older callers."""
    return detect_room(image)["room_type"]
