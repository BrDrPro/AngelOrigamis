import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

// SVG é intencionalmente excluído: pode conter script embutido, risco de XSS
// caso a imagem seja renderizada inline em algum lugar.
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

const imageFileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype.startsWith('image/') && ALLOWED_EXTENSIONS.has(ext)) {
    cb(null, true);
    return;
  }
  cb(new Error('Apenas arquivos de imagem (jpg, png, gif, webp) são permitidos.'));
};

export const productImagesUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024,
  },
});

// Imagens de conteúdo editável do site (ex: página Sobre) - poucos arquivos
// por requisição, mesmas regras de tipo/tamanho dos produtos.
export const siteContentImageUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    files: 2,
    fileSize: 5 * 1024 * 1024,
  },
});
