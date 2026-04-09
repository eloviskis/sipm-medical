import multer from 'multer';
import { storage } from '../services/uploadService';

const upload = multer({ storage });

export default upload;
