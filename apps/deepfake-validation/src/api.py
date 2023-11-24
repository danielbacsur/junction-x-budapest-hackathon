from flask import Flask, request, jsonify

from utils import *

app = Flask(__name__)

def analyze_video(url: str) -> int:
    video_path = download_video(url)
    frames, frame_rate = extract_frames(video_path)
    if len(frames) == 0:
        return jsonify({'error': 'no-frames'}), 400

    face_detector = DlibFaceDetector()
    
    print(f"Extracted {len(frames)} frames with frame rate {frame_rate}")

    # Check for frame inconsistencies
    frame_inconsistencies = check_frame_consistency(frames, frame_rate)
    if len(frame_inconsistencies) > 0:
        print("[❗] Found frame inconsistencies")
        print(frame_inconsistencies)
    else:
        print("[✅] No frame inconsistencies found")

    # Check for face count inconsistencies
    face_inconsistencies = check_face_consistency(frames, frame_rate, face_detector)
    if len(face_inconsistencies) > 0:
        print("[❗] Found face inconsistencies")
        print(face_inconsistencies)
    else:
        print("[✅] No face inconsistencies found")

    # Check for brightness and contrast inconsistencies
    brightness_contrast_inconsistencies = check_brightness_contrast_consistency(frames, frame_rate)
    if len(brightness_contrast_inconsistencies) > 0:
        print("[❗] Found brightness and contrast inconsistencies")
        print(brightness_contrast_inconsistencies)
    else:
        print("[✅] No brightness and contrast inconsistencies found")

    # Check for blinks
    blink_frames = detect_blinks(frames, frame_rate, face_detector)
    blink_error_type = "nominal"
    if len(blink_frames) == 0:
        print("[❗] No blinks found")
        blink_error_type = "no-blinks"
    elif len(blink_frames) > len(frames) / frame_rate * 1.5 and len(blink_frames) > 2:
        print("[❗] Too many blinks found")
        blink_error_type = "too-many-blinks"
    else:
        print("[✅] No blink inconsistencies found")
        blink_frames = []
    
    print("Blinks:", len(blink_frames))

    return jsonify([
        {
            "type": "frame_inconsistencies",
            "count": len(frame_inconsistencies),
            "frames": frame_inconsistencies,
        },
        {
            "type": "face_inconsistencies",
            "count": len(face_inconsistencies),
            "frames": face_inconsistencies,
        },
        {
            "type": "brightness_contrast_inconsistencies",
            "count": len(brightness_contrast_inconsistencies),
            "frames": brightness_contrast_inconsistencies,
        },
        {
            "type": "blinks",
            "count": len(blink_frames),
            "frames": blink_frames,
        },
        {
            "type": "blink_error_type",
            "value": blink_error_type
        }
    ])


@app.route('/validate', methods=['POST'])
def validate():
    url = request.json['url']

    if not url:
        return jsonify({'error': 'no-url'}), 400

    analysis = analyze_video(url)
    
    print(analysis)

    return analysis

if __name__ == '__main__':
    app.run()