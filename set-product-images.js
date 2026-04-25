
/**
 * set-product-images.js
 * Updates the `image` field for products MCI-01 through MCI-138
 * by mapping each product code to its file in /public/uploads.
 *
 * Run with: node set-product-images.js
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in .env.local");
  process.exit(1);
}

// Product code -> filename in public/uploads
// Actual files: MCI-01.png to MCI-09.png (zero-padded), MCI-10.png to MCI-138.png (no padding)
// Special case: MCI-124 file is named "MCI-124png.png" (typo - missing dot)
function codeToFilename(code) {
  const num = parseInt(code.replace("MCI-", ""), 10);
  if (num === 124) return "MCI-124png.png";
  const padded = num < 10 ? String(num).padStart(2, "0") : String(num);
  return "MCI-" + padded + ".png";
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB\n");

  // Minimal schema — strict:false lets us touch any field
  const Product = mongoose.model(
    "Product",
    new mongoose.Schema({ code: String, image: String }, { strict: false })
  );

  // Fetch all MCI products
  const products = await Product.find({ code: /^MCI-/ }).lean();
  console.log(`Total MCI products in DB: ${products.length}`);

  let updated = 0;
  let outOfRange = 0;

  for (const prod of products) {
    const num = parseInt(prod.code.replace("MCI-", ""), 10);

    // Only set images for MCI-1 through MCI-138
    if (isNaN(num) || num < 1 || num > 138) {
      outOfRange++;
      continue;
    }

    const filename  = codeToFilename(prod.code);
    const imagePath = `/uploads/${filename}`;

    await Product.updateOne({ _id: prod._id }, { $set: { image: imagePath } });
    console.log(`  ✓  ${prod.code.padEnd(10)} →  ${imagePath}`);
    updated++;
  }

  console.log(`\nUpdated : ${updated}`);
  console.log(`Skipped (>138 or no image): ${outOfRange}`);
  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
