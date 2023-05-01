import multer from "multer";

const imageUpload = multer({
  limits: 1024 * 1024 * 5,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' ) 
      cb(null, true)

    cb(null, false)
  }
});

export { imageUpload };
