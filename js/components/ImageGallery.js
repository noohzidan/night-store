import React from "react";
import { html } from "../html.js";

const { useState } = React;

export function ImageGallery({ images = [], alt }) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return html`<div className="image-gallery__main image-gallery__main--placeholder"></div>`;
  }

  return html`
    <div className="image-gallery">
      <div className="image-gallery__main">
        <img src=${images[active]} alt=${alt} />
      </div>
      ${images.length > 1 &&
      html`
        <div className="image-gallery__thumbs">
          ${images.map(
            (src, i) => html`
              <button
                key=${i}
                className=${`image-gallery__thumb ${i === active ? "is-active" : ""}`}
                onClick=${() => setActive(i)}
                aria-label=${`View image ${i + 1}`}
              >
                <img src=${src} alt="" />
              </button>
            `
          )}
        </div>
      `}
    </div>
  `;
}
