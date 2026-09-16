import React from "react";
import { html } from "../html.js";
import { CONFIG } from "../config.js";

const { useState } = React;

const NAV_LINKS = [
  { label: "All Products", path: "/shop" },
  { label: "Men", path: "/shop/men" },
  { label: "Women", path: "/shop/women" },
  { label: "Kids", path: "/shop/kids" },
  { label: "New Arrivals", path: "/shop/new" },
  { label: "Sale", path: "/shop/sale" },
];

export function Header({ navigate, route }) {
  const [open, setOpen] = useState(false);

  const isActive = (path) => {
    const current = `/${route.join("/")}`;
    return current === path || (path !== "/shop" && current.startsWith(path));
  };

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return html`
    <header className="site-header">
      <div className="site-header__bar container">
        <button
          className="hamburger"
          aria-label="Toggle menu"
          onClick=${() => setOpen((o) => !o)}
        >
          <span></span><span></span><span></span>
        </button>
        <a className="brand-mark" href="#/" onClick=${(e) => { e.preventDefault(); go("/"); }}>
          ${CONFIG.brandName}
        </a>
        <nav className="site-header__actions">
          <a
            className="site-header__admin-link"
            href="#/admin"
            onClick=${(e) => { e.preventDefault(); go("/admin"); }}
          >
            Admin
          </a>
        </nav>
      </div>
      <nav className=${`site-header__nav ${open ? "site-header__nav--open" : ""}`}>
        ${NAV_LINKS.map(
          (link) => html`
            <a
              key=${link.path}
              href=${`#${link.path}`}
              className=${`site-header__link ${isActive(link.path) ? "is-active" : ""}`}
              onClick=${(e) => { e.preventDefault(); go(link.path); }}
            >
              ${link.label}
            </a>
          `
        )}
      </nav>
    </header>
  `;
}
