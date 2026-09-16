// Shared JSX-like template tag (no build step / no Babel required).
// Usage: html`<div className="foo">${bar}</div>`
import React from "react";
import htm from "htm";

export const html = htm.bind(React.createElement);
