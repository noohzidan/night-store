import React from "react";
import { html } from "../html.js";
import { Stars } from "./Stars.js";
import { REVIEWS } from "../reviews-data.js";

export function Reviews() {
  const avg = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1);

  return html`
    <section className="reviews">
      <div className="container reviews__head">
        <p className="section-eyebrow">Word on the street</p>
        <h2>What Customers Say</h2>
        <div className="reviews__summary">
          <${Stars} rating=${Math.round(avg)} />
          <span>${avg} average · ${REVIEWS.length}+ reviews</span>
        </div>
      </div>
      <div className="reviews__track">
        ${REVIEWS.map(
          (r, i) => html`
            <article className="review-card" key=${i}>
              <span className="review-card__mark">“</span>
              <${Stars} rating=${r.rating} />
              <p className="review-card__quote">${r.quote}</p>
              <div className="review-card__meta">
                <span className="review-card__name">${r.name}</span>
                <span className="review-card__location">${r.location}</span>
              </div>
            </article>
          `
        )}
      </div>
    </section>
  `;
}
