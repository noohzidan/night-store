import React from "react";
import { html } from "../html.js";
import { uploadProductImage, deleteProductImageByUrl } from "../cloudinary.js";

const { useState } = React;

const EMPTY = {
  name: "",
  category: "men",
  price: "",
  compareAtPrice: "",
  isNew: false,
  inStock: true,
  sizes: "",
  colors: "",
  images: [],
  description: "",
};

function productToFormState(product) {
  if (!product) return EMPTY;
  return {
    name: product.name || "",
    category: product.category || "men",
    price: product.price ?? "",
    compareAtPrice: product.compareAtPrice ?? "",
    isNew: !!product.isNew,
    inStock: product.inStock !== false,
    sizes: (product.sizes || []).join(", "),
    colors: (product.colors || []).join(", "),
    images: product.images || [],
    description: product.description || "",
  };
}

export function AdminProductForm({ product, onCancel, onSubmit, busy }) {
  const [form, setForm] = useState(productToFormState(product));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setChecked = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }));

  const removeImage = (idx) => {
    const url = form.images[idx];
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
    // Best-effort cleanup in Storage; harmless if it's an external URL.
    deleteProductImageByUrl(url);
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-selecting the same file later
    if (!files.length) return;
    setUploadError("");
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadProductImage(file)));
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch (err) {
      console.error(err);
      setUploadError(err.message || "Some images failed to upload. Check the console for details.");
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setUrlInput("");
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price) || 0,
      compareAtPrice: form.compareAtPrice === "" ? null : Number(form.compareAtPrice),
      isNew: !!form.isNew,
      inStock: !!form.inStock,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      images: form.images,
      description: form.description.trim(),
    };
    onSubmit(payload);
  };

  return html`
    <form className="admin-form" onSubmit=${submit}>
      <h2>${product ? "Edit Product" : "Add Product"}</h2>

      <label>
        Name
        <input type="text" value=${form.name} onChange=${set("name")} required />
      </label>

      <div className="admin-form__row">
        <label>
          Category
          <select value=${form.category} onChange=${set("category")}>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </label>
        <label className="admin-form__checkbox">
          <input type="checkbox" checked=${form.isNew} onChange=${setChecked("isNew")} />
          Mark as New Arrival
        </label>
        <label className="admin-form__checkbox">
          <input type="checkbox" checked=${form.inStock} onChange=${setChecked("inStock")} />
          In Stock
        </label>
      </div>

      <div className="admin-form__row">
        <label>
          Price (EGP)
          <input type="number" min="0" step="0.01" value=${form.price} onChange=${set("price")} required />
        </label>
        <label>
          Compare-at price (EGP, optional)
          <input
            type="number"
            min="0"
            step="0.01"
            value=${form.compareAtPrice}
            onChange=${set("compareAtPrice")}
            placeholder="original price, shown crossed out"
          />
        </label>
      </div>

      <div className="admin-form__row">
        <label>
          Sizes (comma separated)
          <input type="text" value=${form.sizes} onChange=${set("sizes")} placeholder="S, M, L, XL" />
        </label>
        <label>
          Colors (comma separated)
          <input type="text" value=${form.colors} onChange=${set("colors")} placeholder="Black, Cream" />
        </label>
      </div>

      <div className="admin-form__images">
        <span>Product Images</span>

        ${form.images.length > 0 &&
        html`
          <div className="admin-form__image-grid">
            ${form.images.map(
              (src, i) => html`
                <div className="admin-form__image-thumb" key=${src + i}>
                  <img src=${src} alt="" />
                  <button type="button" className="admin-form__image-remove" onClick=${() => removeImage(i)} aria-label="Remove image">
                    ×
                  </button>
                </div>
              `
            )}
          </div>
        `}

        <div className="admin-form__image-actions">
          <label className="admin-form__upload">
            <input type="file" accept="image/*" multiple onChange=${handleFiles} disabled=${uploading} />
            <span className="btn btn--ghost">${uploading ? "Uploading…" : "+ Upload image(s)"}</span>
          </label>
          <span className="admin-form__image-actions-or">or paste an image URL</span>
          <input
            type="url"
            className="admin-form__url-input"
            value=${urlInput}
            onChange=${(e) => setUrlInput(e.target.value)}
            onKeyDown=${(e) => { if (e.key === "Enter") { e.preventDefault(); addImageUrl(); } }}
            placeholder="https://…"
          />
          <button type="button" className="btn btn--ghost" onClick=${addImageUrl}>Add</button>
        </div>
        ${uploadError && html`<p className="form-error">${uploadError}</p>`}
      </div>

      <label>
        Description
        <textarea rows="4" value=${form.description} onChange=${set("description")}></textarea>
      </label>

      <div className="admin-form__actions">
        <button type="button" className="btn btn--ghost" onClick=${onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary" disabled=${busy || uploading}>
          ${busy ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  `;
}
