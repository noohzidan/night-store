// ---------------------------------------------------------------------------
// CLOUDINARY — handles product image uploads from the admin panel.
// Free tier, no credit card required (unlike Firebase Storage, which now
// needs a billing account even for free-tier usage).
//
// Setup (see README.md for full steps):
//   1. Create a free account at https://cloudinary.com
//   2. Copy your "Cloud name" from the dashboard.
//   3. Settings -> Upload -> Upload presets -> Add upload preset ->
//      Signing Mode: "Unsigned" -> Save. Copy the preset name.
//   4. Paste both values below.
// ---------------------------------------------------------------------------

const CLOUD_NAME = "jnrtbdft";
const UPLOAD_PRESET = "nighttttt";

export const CLOUDINARY_NOT_CONFIGURED =
  CLOUD_NAME === "YOUR_CLOUD_NAME" || UPLOAD_PRESET === "YOUR_UPLOAD_PRESET";

/** Uploads a File to Cloudinary and returns its public HTTPS URL. */
export async function uploadProductImage(file) {
  if (CLOUDINARY_NOT_CONFIGURED) {
    throw new Error(
      "Cloudinary isn't configured yet — add your cloud name and upload preset to js/cloudinary.js (see README.md)."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "night-products");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.secure_url;
}

/**
 * Removing an image from a product just drops it from that product's image
 * list in Firestore — the file itself stays in your Cloudinary library.
 * (Deleting from Cloudinary requires a signed, server-side request since it
 * needs your API secret, which can't safely live in browser code. Cloudinary's
 * free tier storage is generous enough that this is fine to leave as-is; you
 * can also delete unused images from the Cloudinary Media Library directly.)
 */
export async function deleteProductImageByUrl() {
  return Promise.resolve();
}
