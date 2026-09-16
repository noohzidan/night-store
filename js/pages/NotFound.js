import React from "react";
import { html } from "../html.js";

export function NotFound({ navigate }) {
  return html`
    <div className="container page-status">
      <h1>Page not found</h1>
      <a className="btn btn--primary" href="#/" onClick=${(e) => { e.preventDefault(); navigate("/"); }}>
        Back to Home
      </a>
    </div>
  `;
}
