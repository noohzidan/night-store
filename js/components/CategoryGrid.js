import React from "react";
import { html } from "../html.js";

const CATEGORIES = [
  {
    key: "new",
    label: "New Arrivals",
    caption: "Just landed",
    path: "/shop/new",
    image: "https://picsum.photos/seed/night-cat-new/1000/1200",
    area: "big",
  },
  {
    key: "men",
    label: "Men",
    path: "/shop/men",
    image: "https://picsum.photos/seed/night-cat-men/700/700",
    area: "men",
  },
  {
    key: "women",
    label: "Women",
    path: "/shop/women",
    image: "https://picsum.photos/seed/night-cat-women/700/700",
    area: "women",
  },
  {
    key: "kids",
    label: "Kids",
    path: "/shop/kids",
    image: "https://picsum.photos/seed/night-cat-kids/700/700",
    area: "kids",
  },
  {
    key: "sale",
    label: "Sale",
    caption: "Up to 40% off",
    path: "/shop/sale",
    image: "https://picsum.photos/seed/night-cat-sale/700/700",
    area: "sale",
  },
];

export function CategoryGrid({ navigate }) {
  const go = (path) => (e) => {
    e.preventDefault();
    navigate(path);
  };

  return html`
    <div className="category-bento container">
      ${CATEGORIES.map(
        (cat, i) => html`
          <a
            key=${cat.key}
            className=${`category-card category-card--${cat.area} ${cat.key === "sale" ? "category-card--sale" : ""}`}
            style=${{ gridArea: cat.area, backgroundImage: `url(${cat.image})` }}
            href=${`#${cat.path}`}
            onClick=${go(cat.path)}
          >
            <span className="category-card__index">0${i + 1}</span>
            <span className="category-card__text">
              ${cat.caption && html`<span className="category-card__caption">${cat.caption}</span>`}
              <span className="category-card__label">${cat.label}</span>
            </span>
          </a>
        `
      )}
    </div>
  `;
}
