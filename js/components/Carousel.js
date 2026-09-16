import React from "react";
import { html } from "../html.js";
import { ProductCard } from "./ProductCard.js";

const { useRef } = React;

/** Horizontal scroll-snap carousel of featured products. */
export function Carousel({ products, navigate, title, eyebrow }) {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: "smooth" });
  };

  if (!products.length) return null;

  return html`
    <section className="carousel-section">
      <div className="container carousel-section__head">
        <div>
          ${eyebrow && html`<p className="section-eyebrow">${eyebrow}</p>`}
          <h2>${title}</h2>
        </div>
        <div className="carousel-section__controls">
          <button aria-label="Scroll left" onClick=${() => scrollBy(-1)}>‹</button>
          <button aria-label="Scroll right" onClick=${() => scrollBy(1)}>›</button>
        </div>
      </div>
      <div className="carousel-track" ref=${trackRef}>
        ${products.map(
          (p) => html`
            <div className="carousel-track__item" key=${p.id}>
              <${ProductCard} product=${p} navigate=${navigate} />
            </div>
          `
        )}
      </div>
    </section>
  `;
}
