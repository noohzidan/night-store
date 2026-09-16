import React from "react";
import { html } from "../html.js";
import { createProduct, updateProduct, deleteProduct, adminLogout } from "../firebase.js";
import { AdminProductForm } from "../components/AdminProductForm.js";
import { formatPrice, hasDiscount } from "../whatsapp.js";
import { SEED_PRODUCTS } from "../seed-data.js";

const { useState, useMemo } = React;

const CATEGORY_FILTERS = [
  { value: "all", label: "All Categories" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
];

export function Admin({ products, user }) {
  const [editing, setEditing] = useState(null); // null = list view, "new" = create, product = edit
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const handleSubmit = async (payload) => {
    setBusy(true);
    try {
      if (editing && editing !== "new") {
        await updateProduct(editing.id, payload);
        setNotice(`"${payload.name}" updated — live for all visitors.`);
      } else {
        await createProduct(payload);
        setNotice(`"${payload.name}" published — live for all visitors.`);
      }
      setEditing(null);
    } catch (err) {
      console.error(err);
      setNotice("Something went wrong saving that product. Check the console for details.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await deleteProduct(product.id);
      setNotice(`"${product.name}" deleted.`);
    } catch (err) {
      console.error(err);
      setNotice("Couldn't delete that product. Check the console for details.");
    }
  };

  const handleSeed = async () => {
    if (!window.confirm(`Add ${SEED_PRODUCTS.length} sample products to the live store?`)) return;
    setSeeding(true);
    try {
      for (const p of SEED_PRODUCTS) {
        await createProduct(p);
      }
      setNotice("Sample products added.");
    } catch (err) {
      console.error(err);
      setNotice("Couldn't seed sample products. Check the console for details.");
    } finally {
      setSeeding(false);
    }
  };

  if (editing) {
    return html`
      <div className="container admin-page">
        <${AdminProductForm}
          product=${editing === "new" ? null : editing}
          busy=${busy}
          onCancel=${() => setEditing(null)}
          onSubmit=${handleSubmit}
        />
      </div>
    `;
  }

  return html`
    <div className="container admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Admin — Products</h1>
          <p className="admin-page__signed-in">Signed in as ${user.email}</p>
        </div>
        <div className="admin-page__head-actions">
          <button className="btn btn--ghost" onClick=${handleSeed} disabled=${seeding}>
            ${seeding ? "Seeding…" : "Seed sample products"}
          </button>
          <button className="btn btn--primary" onClick=${() => setEditing("new")}>+ Add Product</button>
          <button className="btn btn--ghost" onClick=${() => adminLogout()}>Log Out</button>
        </div>
      </div>

      ${notice && html`<div className="admin-notice">${notice}</div>`}

      <div className="admin-page__filters">
        <input
          type="search"
          className="admin-page__search"
          placeholder="Search products by name or description…"
          value=${search}
          onChange=${(e) => setSearch(e.target.value)}
        />
        <select value=${categoryFilter} onChange=${(e) => setCategoryFilter(e.target.value)}>
          ${CATEGORY_FILTERS.map((c) => html`<option key=${c.value} value=${c.value}>${c.label}</option>`)}
        </select>
        <span className="admin-page__filter-count">
          ${filteredProducts.length} of ${products.length} product${products.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="admin-table">
        <div className="admin-table__row admin-table__row--head">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span></span>
        </div>
        ${products.length === 0 && html`<div className="empty-state">No products yet — add one or seed samples.</div>`}
        ${products.length > 0 && filteredProducts.length === 0 &&
        html`<div className="empty-state">No products match your search.</div>`}
        ${filteredProducts.map(
          (p) => html`
            <div className="admin-table__row" key=${p.id}>
              <span className="admin-table__product">
                ${p.images && p.images[0] && html`<img src=${p.images[0]} alt="" />`}
                <span>${p.name}</span>
              </span>
              <span className="admin-table__category">${p.category}</span>
              <span>
                ${hasDiscount(p)
                  ? html`${formatPrice(p.price)} <s>${formatPrice(p.compareAtPrice)}</s>`
                  : formatPrice(p.price)}
              </span>
              <span className=${p.inStock ? "in-stock" : "out-of-stock"}>${p.inStock ? "In Stock" : "Out of Stock"}</span>
              <span className="admin-table__actions">
                <button className="btn btn--ghost" onClick=${() => setEditing(p)}>Edit</button>
                <button className="btn btn--ghost btn--danger" onClick=${() => handleDelete(p)}>Delete</button>
              </span>
            </div>
          `
        )}
      </div>
    </div>
  `;
}
