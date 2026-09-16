import React from "react";
import { html } from "../html.js";
import { formatPrice, hasDiscount } from "../whatsapp.js";
import { SaleBadge, NewBadge, OutOfStockBadge } from "./Badge.js";

export function ProductCard({ product, navigate }) {
  const onSale = hasDiscount(product);
  const cover = product.images && product.images[0];

  const open = (e) => {
    e.preventDefault();
    navigate(`/product/${product.id}`);
  };

  return html`
    <a className="product-card" href=${`#/product/${product.id}`} onClick=${open}>
      <div className="product-card__image-wrap">
        ${cover
          ? html`<img className="product-card__image" src=${cover} alt=${product.name} loading="lazy" />`
          : html`<div className="product-card__image product-card__image--placeholder"></div>`}
        <div className="product-card__badges">
          ${!product.inStock && html`<${OutOfStockBadge} />`}
          ${onSale && html`<${SaleBadge} />`}
          ${product.isNew && html`<${NewBadge} />`}
        </div>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">${product.name}</h3>
        <div className="product-card__price">
          ${onSale
            ? html`
                <span className="product-card__price--sale">${formatPrice(product.price)}</span>
                <span className="product-card__price--original">${formatPrice(product.compareAtPrice)}</span>
              `
            : html`<span>${formatPrice(product.price)}</span>`}
        </div>
      </div>
    </a>
  `;
}
