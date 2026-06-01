from ultralytics import YOLO
import tempfile

model = YOLO("yolov8n.pt")


def detect_room_type(image):

    with tempfile.NamedTemporaryFile(
        suffix=".jpg",
        delete=False
    ) as temp:

        image.save(temp.name)

        results = model(temp.name)

    objects = []

    for result in results:

        for box in result.boxes:

            cls = int(box.cls[0])

            label = result.names[cls]

            objects.append(label)

    if "bed" in objects:

        return "Bedroom"

    if (
        "couch" in objects
        or "sofa" in objects
    ):

        return "Living Room"

    if (
        "laptop" in objects
        or "keyboard" in objects
        or "monitor" in objects
    ):

        return "Office"

    if "dining table" in objects:

        return "Dining Room"

    return "Unknown"