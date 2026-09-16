import React from "react";
import { html } from "../html.js";
import { ProductCard } from "./ProductCard.js";

export function ProductGrid({ products, navigate, emptyMessage = "No products found." }) {
  if (!products.length) {
    return html`<div className="empty-state">${emptyMessage}</div>`;
  }
  return html`
    <div className="product-grid">
      ${products.map((p) => html`<${ProductCard} key=${p.id} product=${p} navigate=${navigate} />`)}
    </div>
  `;
}
