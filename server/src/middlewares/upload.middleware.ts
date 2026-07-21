import multer from 'multer';

const storage = multer.memoryStorage();

const imageFileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
    return;
  }
  cb(new Error('Apenas arquivos de imagem são permitidos.'));
};

export const productImagesUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024,
  },
});
