import base64
import cv2
from deepface import DeepFace
import numpy as np
import os
from ultralytics import YOLO
import time

yolo_model_path = './model/eye_best.onnx'
video_source = './mufid2.mp4'
counting_time = 1000 * 60  # 1 minute

def data_uri_to_cv2_img(uri):
    encoded_data = uri.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    # old (python 2 version):
    # nparr = np.fromstring(encoded_data.decode('base64'), np.uint8)

    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

# Load face cascade classifier
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

have_verified = False
verified_name = ''
face_db = []

print('loading face db...')
for file in os.listdir('./face_db'):
    if file.endswith(".jpg"):
        name = file.split(".")[0]
        name = name.replace("_", " ")
        img = cv2.imread('./face_db/' + file)
        face_db.append({'name': name, 'img': img})
        print('loaded ' + name)

yolo_model = YOLO(yolo_model_path)

yolo_classes = ['closed eye', 'open eye']
EYE_OPEN = 0
EYE_CLOSED = 1

closed_eyes_count = 0
last_eye_state = -1

# Start capturing video
print('start capturing...')
cap = cv2.VideoCapture(video_source)

start_time = time.time()

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    # Convert frame to grayscale
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Convert grayscale frame to RGB format
    rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)

    # Detect faces in the frame
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        # Extract the face ROI (Region of Interest)
        face_roi = rgb_frame[y:y + h, x:x + w]
        
        try:
            margin_y = int(h * 0.25)
            margin_x = int(w * 0.25)
            face_roi_wide = rgb_frame[(y - margin_y):(y + h + margin_y), (x - margin_x):(x + w + margin_x)]
            # save the image to live.jpg
            # cv2.imwrite('live.jpg', face_roi_wide)
            try:
                if have_verified == False:
                    for face in face_db:
                        result = DeepFace.verify(face_roi_wide, face['img'])
                        if result['verified'] == True:
                            print('verified')
                            have_verified = True
                            verified_name = face['name']
            except:
                print('error verify image')
        except:
            print('error save image')

        # Draw rectangle around face and label with predicted emotion
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
        if have_verified:
            cv2.putText(frame, 'Driver: '+verified_name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
            yolo_result = yolo_model.predict(source=face_roi, conf=0.5, imgsz=320)
            for result in yolo_result:
                for box in result.boxes:
                    x1, y1, x2, y2 = box.xyxy[0]
                    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                    frame_x1, frame_y1, frame_x2, frame_y2 = x + x1, y + y1, x + x2, y + y2
                    cv2.rectangle(frame, (frame_x1, frame_y1), (frame_x2, frame_y2), (0, 255, 0), 2)
                    box_class = int(box.cls[0])
                    cv2.putText(frame, yolo_classes[box_class], (frame_x1, frame_y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                    if last_eye_state != box_class:
                        if box_class == EYE_CLOSED:
                            closed_eyes_count += 1
                        last_eye_state = box_class
            cv2.putText(frame, 'closed eye count: '+str(closed_eyes_count), (5, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
        else:
            cv2.putText(frame, 'recognizing...', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

    current_time = time.time()
    elapsed_time = current_time - start_time
    if elapsed_time >= counting_time:
        closed_eyes_count = 0
        
    # Display the resulting frame
    cv2.imshow('Face Detection', frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture and close all windows
cap.release()
cv2.destroyAllWindows()
