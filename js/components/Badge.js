import React from "react";
import { html } from "../html.js";

export function SaleBadge() {
  return html`<span className="badge badge--sale">Sale</span>`;
}

export function NewBadge() {
  return html`<span className="badge badge--new">New</span>`;
}

export function OutOfStockBadge() {
  return html`<span className="badge badge--out">Out of Stock</span>`;
}
