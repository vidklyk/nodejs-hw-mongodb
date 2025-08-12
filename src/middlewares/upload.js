import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const tempDir = path.resolve('temp');
await fs.mkdir(tempDir, { recursive: true });

const storage = multer.memoryStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
