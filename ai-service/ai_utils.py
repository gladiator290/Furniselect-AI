from typing import List


def rgb_to_hex(color):

    return "#{:02x}{:02x}{:02x}".format(
        int(color[0]),
        int(color[1]),
        int(color[2])
    )


def extract_palette(colors) -> List[str]:

    return [
        rgb_to_hex(color)
        for color in colors
    ]


def detect_tone(warmth):

    if warmth > 15:
        return "Warm"

    elif warmth < -15:
        return "Cool"

    return "Neutral"


def detect_mood(
    brightness,
    warmth,
    contrast
):

    if brightness > 180:

        return "Fresh"

    elif warmth > 40:

        return "Cozy"

    elif contrast > 70:

        return "Bold"

    elif brightness < 90:

        return "Elegant"

    return "Balanced"


def detect_room_style(
    brightness,
    warmth,
    contrast
):

    if brightness > 190:

        return "Minimal Bright"

    elif brightness > 150 and warmth > 20:

        return "Scandinavian"

    elif warmth > 40:

        return "Warm Luxury"

    elif brightness < 90:

        return "Dark Elegant"

    elif contrast > 60:

        return "Industrial"

    return "Modern Contemporary"


def get_recommendations(
    room_style
):

    recommendations = {

        "Minimal Bright": [
            "White Coffee Table",
            "Cream Sofa",
            "Minimal Floor Lamp",
        ],

        "Scandinavian": [
            "Light Oak Dining Table",
            "Wooden Accent Chair",
            "Beige Fabric Sofa",
        ],

        "Warm Luxury": [
            "Walnut Wooden Sofa",
            "Golden Floor Lamp",
            "Premium TV Unit",
        ],

        "Dark Elegant": [
            "Black Marble Coffee Table",
            "Dark Grey Sofa",
            "Luxury Floor Lamp",
        ],

        "Industrial": [
            "Metal Coffee Table",
            "Industrial Shelf",
            "Loft Style Chair",
        ],

        "Modern Contemporary": [
            "Grey Sofa",
            "Minimal TV Unit",
            "Contemporary Lamp",
        ],
    }

    return recommendations[
        room_style
    ]