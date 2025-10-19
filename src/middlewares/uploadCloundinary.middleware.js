const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


// Cloundinary
cloudinary.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.CLOUND_KEY,
  api_secret: process.env.CLOUND_SECRET,
});
// End Cloundinary

module.exports.upload = async (req, res, next) => {
    try {
      if (!req.file) {
        console.log("⚠️ Không có file upload, bỏ qua upload Cloudinary");
        return next();
      }

      console.log("📤 Bắt đầu upload lên Cloudinary...");

      // Upload stream lên Cloudinary
      const uploadFromBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const result = await uploadFromBuffer(req.file.buffer);

      if (result) {
        console.log("✅ Upload thành công!");
        console.log("🌐 URL:", result.url);
        console.log("🔒 Secure URL:", result.secure_url);
      }

      // Gán URL ảnh mới vào body để controller xử lý
      req.body[req.file.fieldname] = result.secure_url;
      next();
    } catch (error) {
      console.error("❌ Lỗi upload Cloudinary:", error);
      res.status(500).send("Upload thất bại");
    }
  }