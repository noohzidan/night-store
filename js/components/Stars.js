import React from "react";
import { html } from "../html.js";

export function Stars({ rating = 5, max = 5 }) {
  return html`
    <span className="stars" aria-label=${`${rating} out of ${max} stars`}>
      ${Array.from({ length: max }, (_, i) => html`<span key=${i} className=${`stars__star ${i < rating ? "is-filled" : ""}`}>★</span>`)}
    </span>
  `;
}
