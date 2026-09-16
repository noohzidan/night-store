import React from "react";
import { html } from "../html.js";
import { ProductGrid } from "../components/ProductGrid.js";
import { hasDiscount } from "../whatsapp.js";

const TABS = [
  { key: "all", label: "All Products" },
  { key: "men", label: "Men" },
  { key: "women", label: "Women" },
  { key: "kids", label: "Kids" },
  { key: "new", label: "New Arrivals" },
  { key: "sale", label: "Sale" },
];

function filterProducts(products, key) {
  switch (key) {
    case "men":
    case "women":
    case "kids":
      return products.filter((p) => p.category === key);
    case "new":
      return products.filter((p) => p.isNew);
    case "sale":
      return products.filter(hasDiscount);
    default:
      return products;
  }
}

const TITLES = {
  all: "All Products",
  men: "Men",
  women: "Women",
  kids: "Kids",
  new: "New Arrivals",
  sale: "Sale",
};

export function Shop({ products, navigate, route }) {
  const activeKey = TABS.some((t) => t.key === route[1]) ? route[1] : "all";
  const filtered = filterProducts(products, activeKey);

  const go = (key) => (e) => {
    e.preventDefault();
    navigate(key === "all" ? "/shop" : `/shop/${key}`);
  };

  return html`
    <div className="shop-page container">
      <div className="shop-page__head">
        <h1>${TITLES[activeKey]}</h1>
        <p className="shop-page__count">${filtered.length} item${filtered.length === 1 ? "" : "s"}</p>
      </div>
      <div className="shop-page__tabs">
        ${TABS.map(
          (tab) => html`
            <a
              key=${tab.key}
              href=${tab.key === "all" ? "#/shop" : `#/shop/${tab.key}`}
              className=${`shop-page__tab ${activeKey === tab.key ? "is-active" : ""}`}
              onClick=${go(tab.key)}
            >
              ${tab.label}
            </a>
          `
        )}
      </div>
      <${ProductGrid} products=${filtered} navigate=${navigate} emptyMessage="No products in this category yet — check back soon." />
    </div>
  `;
}
