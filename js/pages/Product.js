import React from "react";
import { html } from "../html.js";
import { ImageGallery } from "../components/ImageGallery.js";
import { PaymentInfo } from "../components/PaymentInfo.js";
import { SaleBadge, NewBadge, OutOfStockBadge } from "../components/Badge.js";
import { formatPrice, hasDiscount, buildOrderLink } from "../whatsapp.js";

const { useState, useMemo } = React;

export function Product({ products, navigate, route, loading }) {
  const id = route[1];
  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);

  if (loading) {
    return html`<div className="container page-status">Loading…</div>`;
  }

  if (!product) {
    return html`
      <div className="container page-status">
        <p>We couldn't find that product. It may have been removed.</p>
        <a className="btn btn--primary" href="#/shop" onClick=${(e) => { e.preventDefault(); navigate("/shop"); }}>
          Back to Shop
        </a>
      </div>
    `;
  }

  const onSale = hasDiscount(product);
  const needsSize = product.sizes && product.sizes.length > 0;
  const needsColor = product.colors && product.colors.length > 0;
  const canOrder = product.inStock && (!needsSize || size) && (!needsColor || color);

  const orderLink = buildOrderLink(product, { size, color, qty });

  return html`
    <div className="container product-page">
      <div className="product-page__gallery">
        <${ImageGallery} images=${product.images} alt=${product.name} />
      </div>
      <div className="product-page__info">
        <div className="product-page__badges">
          ${!product.inStock && html`<${OutOfStockBadge} />`}
          ${onSale && html`<${SaleBadge} />`}
          ${product.isNew && html`<${NewBadge} />`}
        </div>
        <h1 className="product-page__name">${product.name}</h1>
        <div className="product-page__price">
          ${onSale
            ? html`
                <span className="product-page__price--sale">${formatPrice(product.price)}</span>
                <span className="product-page__price--original">${formatPrice(product.compareAtPrice)}</span>
              `
            : html`<span>${formatPrice(product.price)}</span>`}
        </div>

        ${product.description && html`<p className="product-page__description">${product.description}</p>`}

        ${needsSize &&
        html`
          <div className="option-group">
            <span className="option-group__label">Size</span>
            <div className="option-group__options">
              ${product.sizes.map(
                (s) => html`
                  <button
                    key=${s}
                    className=${`option-chip ${size === s ? "is-selected" : ""}`}
                    onClick=${() => setSize(s)}
                  >
                    ${s}
                  </button>
                `
              )}
            </div>
          </div>
        `}

        ${needsColor &&
        html`
          <div className="option-group">
            <span className="option-group__label">Color</span>
            <div className="option-group__options">
              ${product.colors.map(
                (c) => html`
                  <button
                    key=${c}
                    className=${`option-chip ${color === c ? "is-selected" : ""}`}
                    onClick=${() => setColor(c)}
                  >
                    ${c}
                  </button>
                `
              )}
            </div>
          </div>
        `}

        <div className="option-group">
          <span className="option-group__label">Quantity</span>
          <div className="qty-stepper">
            <button onClick=${() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span>${qty}</span>
            <button onClick=${() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
          </div>
        </div>

        <a
          className=${`btn btn--primary btn--whatsapp ${canOrder ? "" : "btn--disabled"}`}
          href=${canOrder ? orderLink : undefined}
          target=${canOrder ? "_blank" : undefined}
          rel="noreferrer"
          onClick=${(e) => { if (!canOrder) e.preventDefault(); }}
          aria-disabled=${!canOrder}
        >
          ${product.inStock ? "Order via WhatsApp" : "Out of Stock"}
        </a>
        ${product.inStock && !canOrder &&
        html`<p className="product-page__hint">Please select ${needsSize && !size ? "a size" : ""}${needsSize && !size && needsColor && !color ? " and " : ""}${needsColor && !color ? "a color" : ""} to order.</p>`}

        <div className="product-page__payment">
          <h4>Payment</h4>
          <${PaymentInfo} />
        </div>
      </div>
    </div>
  `;
}
