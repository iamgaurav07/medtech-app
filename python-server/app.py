from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os
import base64
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_DIR = 'uploads'
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class MedicalImageProcessor:
    @staticmethod
    def process_arterial_phase(image_path: str) -> np.ndarray:
        """
        Simulate arterial phase with subtle contrast enhancement
        """
        try:
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not read image file")
            
            # Convert to RGB for processing
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Subtle contrast and brightness enhancement
            alpha = 1.3
            beta = 15
            
            contrasted = cv2.convertScaleAbs(image_rgb, alpha=alpha, beta=beta)
            
            # Apply CLAHE for medical images
            if len(contrasted.shape) == 3:
                lab = cv2.cvtColor(contrasted, cv2.COLOR_RGB2LAB)
                l, a, b = cv2.split(lab)
                clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
                l_clahe = clahe.apply(l)
                lab_clahe = cv2.merge([l_clahe, a, b])
                contrasted = cv2.cvtColor(lab_clahe, cv2.COLOR_LAB2RGB)
            
            return contrasted
            
        except Exception as e:
            logger.error(f"Error in arterial phase processing: {str(e)}")
            raise

    @staticmethod
    def process_venous_phase(image_path: str) -> np.ndarray:
        """
        Simulate venous phase with subtle Gaussian smoothing
        """
        try:
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not read image file")
            
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Apply subtle Gaussian blur
            kernel_size = 15
            smoothed = cv2.GaussianBlur(image_rgb, (kernel_size, kernel_size), 0)
            
            # Very slight adjustments
            alpha = 0.95
            beta = -5
            smoothed = cv2.convertScaleAbs(smoothed, alpha=alpha, beta=beta)
            
            return smoothed
            
        except Exception as e:
            logger.error(f"Error in venous phase processing: {str(e)}")
            raise

def image_to_base64(image_array: np.ndarray) -> str:
    """Convert numpy image array to base64 string"""
    try:
        # Convert back to BGR for encoding
        if len(image_array.shape) == 3:
            image_bgr = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
        else:
            image_bgr = image_array
            
        # Encode image to JPEG format
        success, encoded_image = cv2.imencode('.jpg', image_bgr, [cv2.IMWRITE_JPEG_QUALITY, 85])
        if not success:
            raise ValueError("Failed to encode image")
            
        # Convert to base64
        base64_string = base64.b64encode(encoded_image).decode('utf-8')
        return f"data:image/jpeg;base64,{base64_string}"
        
    except Exception as e:
        logger.error(f"Error converting image to base64: {str(e)}")
        raise

@app.route('/process-base64', methods=['POST'])
def process_image_base64():
    """
    Process image and return base64 encoded images
    """
    start_time = datetime.now()
    
    try:
        # Check if file was uploaded
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided',
                'status': 'error'
            }), 400
        
        file = request.files['image']
        phase = request.form.get('phase')
        
        if not phase or phase not in ['arterial', 'venous']:
            return jsonify({
                'error': 'Invalid phase. Must be "arterial" or "venous"',
                'status': 'error'
            }), 400

        if file.filename == '':
            return jsonify({
                'error': 'No file selected',
                'status': 'error'
            }), 400

        # Save uploaded file temporarily
        temp_filename = f"temp_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        temp_path = os.path.join(UPLOAD_DIR, temp_filename)
        file.save(temp_path)
        
        logger.info(f"Processing image: {file.filename} with phase: {phase}")

        # Process image
        processor = MedicalImageProcessor()
        if phase == 'arterial':
            processed_array = processor.process_arterial_phase(temp_path)
        else:
            processed_array = processor.process_venous_phase(temp_path)
        
        # Read original image for base64 conversion
        original_image = cv2.imread(temp_path)
        original_rgb = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)
        
        # Convert both images to base64
        original_base64 = image_to_base64(original_rgb)
        processed_base64 = image_to_base64(processed_array)
        
        # Clean up temporary file
        os.remove(temp_path)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        logger.info(f"Base64 processing completed in {processing_time:.2f}s")
        
        return jsonify({
            'originalImage': original_base64,
            'processedImage': processed_base64,
            'phase': phase,
            'status': 'success',
            'processing_time_seconds': processing_time,
            'message': f'Successfully processed with {phase} phase (base64)'
        })
        
    except Exception as e:
        logger.error(f"Unexpected error in base64 processing: {str(e)}")
        return jsonify({
            'error': f'Internal server error: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/process', methods=['POST'])
def process_image():
    """
    Original endpoint for file path processing (for Node.js backend)
    """
    start_time = datetime.now()
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No JSON data provided',
                'status': 'error'
            }), 400
        
        image_path = data.get('image_path')
        phase = data.get('phase')
        
        if not image_path or not phase:
            return jsonify({
                'error': 'Missing image_path or phase parameter',
                'status': 'error'
            }), 400

        if not os.path.exists(image_path):
            return jsonify({
                'error': f'Image file not found: {image_path}',
                'status': 'error'
            }), 404

        logger.info(f"Processing image: {image_path} with phase: {phase}")

        # Process image
        processor = MedicalImageProcessor()
        if phase == 'arterial':
            processed_array = processor.process_arterial_phase(image_path)
        else:
            processed_array = processor.process_venous_phase(image_path)
        
        # Save processed image
        filename = os.path.basename(image_path)
        processed_filename = f"{phase}_{filename}"
        processed_path = os.path.join(UPLOAD_DIR, processed_filename)
        
        # Convert back to BGR for saving
        processed_bgr = cv2.cvtColor(processed_array, cv2.COLOR_RGB2BGR)
        cv2.imwrite(processed_path, processed_bgr)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return jsonify({
            'processed_image_url': f"/uploads/{processed_filename}",
            'phase': phase,
            'status': 'success',
            'processing_time_seconds': processing_time
        })
        
    except Exception as e:
        logger.error(f"Unexpected error in process_image: {str(e)}")
        return jsonify({
            'error': f'Internal server error: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'Medical Image Processing Server is running',
        'timestamp': datetime.now().isoformat(),
        'version': '1.2.0',
        'features': 'Base64 image support added',
        'endpoints': {
            'process_base64': 'POST /process-base64 (direct frontend use)',
            'process': 'POST /process (for Node.js backend)',
            'health': 'GET /health'
        }
    })

if __name__ == '__main__':
    logger.info("Starting Medical Image Processing Server on http://localhost:8000")
    logger.info("Base64 endpoint: POST /process-base64")
    app.run(host='0.0.0.0', port=8000, debug=True)