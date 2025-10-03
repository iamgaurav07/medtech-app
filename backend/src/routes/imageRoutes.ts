import { Router } from 'express';
import { imageController } from '../controllers/imageController';
import { upload } from '../utils/fileUpload';

const router = Router();

router.post(
  '/process-image',
  upload.single('image'),
  (req, res, next) => {
    imageController.processImage(req, res).catch(next);
  }
);

router.get('/python-status', imageController.getPythonServerStatus);

export const imageRoutes = router;