// src/upload.ts
import multer from 'multer';
import path from 'path';

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `favicon_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filtro de arquivo para aceitar apenas imagens
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|ico/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Erro: Apenas arquivos de imagem são permitidos!'));
};

// Inicialização do upload com multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
