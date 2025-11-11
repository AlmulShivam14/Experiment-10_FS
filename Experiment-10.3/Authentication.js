// JWT-based authentication routes (signup, login)
const jwt = require('jsonwebtoken');

// Secure image uploads with multer + AWS S3
const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/posts', verifyToken, upload.single('image'), async (req, res) => {
  // Upload image to S3, create post
});
