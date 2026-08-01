from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image
import numpy as np
import io
from sklearn.cluster import KMeans
from fastapi.middleware.cors import CORSMiddleware


from ai_utils import (
    extract_palette,
    detect_tone,
    detect_mood,
    detect_room_style,
    get_recommendations
)

from room_detector import detect_room

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://furniselect-ai.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():

    return {
        "message": "AI Service Running 😎"
    }

@app.post("/analyze-product")
async def analyze_product(
    image: UploadFile = File(...)
):

    contents = await image.read()

    img = Image.open(
        io.BytesIO(contents)
    ).convert("RGB")

    img = img.resize((150, 150))

    img_array = np.array(img)

    pixels = img_array.reshape(-1, 3)

    kmeans = KMeans(
        n_clusters=3,
        n_init=10,
        random_state=42
    )

    kmeans.fit(pixels)

    colors = kmeans.cluster_centers_

    counts = np.bincount(
        kmeans.labels_
    )

    dominant_index = np.argmax(
        counts
    )

    dominant_color = colors[
        dominant_index
    ]

    r, g, b = dominant_color

    brightness = (
        r + g + b
    ) / 3

    warmth = r - b

    contrast = (
        max(r, g, b)
        - min(r, g, b)
    )

    # Tone

    if warmth > 15:

        tone = "Warm"

    elif warmth < -15:

        tone = "Cool"

    else:

        tone = "Neutral"

    # Material

    if warmth > 30:

        material = "Wooden"

    elif contrast > 70:

        material = "Metal"

    else:

        material = "Fabric"

    # Product Style

    if brightness > 190:

        style = "Minimal"

    elif warmth > 40:

        style = "Luxury"

    else:

        style = "Modern"

    tags = [

        style,

        material,

        tone
    ]

    return {

        "style": style,

        "material": material,

        "tone": tone,

        "brightness": int(
            brightness
        ),

        "contrast": int(
            contrast
        ),

        "warmth": int(
            warmth
        ),

        "tags": tags
    }
@app.post("/analyze-room")
async def analyze_room(
    image: UploadFile = File(...)
):

    contents = await image.read()

    img = Image.open(
        io.BytesIO(contents)
    ).convert("RGB")

    room_check = detect_room(img)

    if not room_check["is_room"]:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "NOT_A_ROOM",
                "message": room_check["reason"],
                "room_type": "Not a room",
            },
        )

    room_type = room_check["room_type"]

    img = img.resize((150, 150))

    img_array = np.array(img)

    pixels = img_array.reshape(-1, 3)

    kmeans = KMeans(
        n_clusters=3,
        n_init=10,
        random_state=42
    )

    kmeans.fit(pixels)

    colors = kmeans.cluster_centers_

    counts = np.bincount(
        kmeans.labels_
    )

    dominant_index = np.argmax(
        counts
    )

    dominant_color = colors[
        dominant_index
    ]

    r, g, b = dominant_color

    brightness = (
        r + g + b
    ) / 3

    warmth = r - b

    contrast = (
        max(r, g, b)
        - min(r, g, b)
    )

    tone = detect_tone(
        warmth
    )

    room_style = detect_room_style(
        brightness,
        warmth,
        contrast
    )

    mood = detect_mood(
        brightness,
        warmth,
        contrast
    )

    palette = extract_palette(
        colors
    )

    recommendations = (
        get_recommendations(
            room_style
        )
    )

    confidence = room_check["confidence"]

    return {

        "style": room_style,

        "tone": tone,

        "mood": mood,

        "room_type": room_type,

        "room_detected": True,

        "confidence": confidence,

        "brightness": int(
            brightness
        ),

        "contrast": int(
            contrast
        ),

        "warmth": int(
            warmth
        ),

        "palette": palette,

        "dominant_color": {

            "r": int(r),

            "g": int(g),

            "b": int(b)
        },

        "tags": [
            room_style,
            tone,
            mood
        ],

        "recommendations":
            recommendations,

        "detection": room_check.get("signals", {}),
    }
