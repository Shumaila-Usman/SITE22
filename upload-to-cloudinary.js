
/**
 * upload-to-cloudinary.js
 * Uploads all MCI product images from public/uploads/ to Cloudinary
 * then updates the image field in MongoDB with the Cloudinary URL.
 *
 * Run: node upload-to-cloudinary.js
 */

require("dotenv").config({ path: ".env.local" });
const fs        = require("fs");
const path      = require("path");
const mongoose  = require("mongoose");
const cloudinary = require("cloudinary").v2;

// ── Config ────────────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
const UPLOADS_DIR = path.join(__dirname, "public", "uploads");

if (!MONGODB_URI) { console.error("MONGODB_URI missing"); process.exit(1); }
if (!process.env.CLOUDINARY_CLOUD_NAME) { console.error("CLOUDINARY_* env vars missing"); process.exit(1); }

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function codeToFilename(code) {
  const num = parseInt(code.replace("MCI-", ""), 10);
  if (num === 124) return "MCI-124.png"; // renamed from MCI-124png.png
  return num < 10 ? "MCI-0" + num + ".png" : "MCI-" + num + ".png";
}

async function uploadFile(filePath, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder: "megacore/products", public_id: publicId, overwrite: true, resource_type: "image" },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    );
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB\n");

  const Product = mongoose.model(
    "Product",
    new mongoose.Schema({ code: String, image: String }, { strict: false })
  );

  const products = await Product.find({ code: /^MCI-/ }).lean();
  console.log("Total MCI products:", products.length, "\n");

  let uploaded = 0, skipped = 0, failed = 0;

  for (const prod of products) {
    const num = parseInt(prod.code.replace("MCI-", ""), 10);
    if (isNaN(num) || num < 1 || num > 138) { skipped++; continue; }

    const filename = codeToFilename(prod.code);
    const filePath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      console.log("  ✗  " + prod.code + " — file not found: " + filename);
      failed++;
      continue;
    }

    try {
      const publicId = "MCI-" + num; // clean public_id in Cloudinary
      const url = await uploadFile(filePath, publicId);
      await Product.updateOne({ _id: prod._id }, { $set: { image: url } });
      console.log("  ✓  " + prod.code.padEnd(10) + " → " + url);
      uploaded++;
    } catch (err) {
      console.log("  ✗  " + prod.code + " — upload failed: " + err.message);
      failed++;
    }
  }

  console.log("\nUploaded : " + uploaded);
  console.log("Skipped  : " + skipped);
  console.log("Failed   : " + failed);
  await mongoose.disconnect();
  console.log("Done.");
}

run().catch(err => { console.error(err.message); process.exit(1); });
