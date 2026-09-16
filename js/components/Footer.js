import React from "react";
import { html } from "../html.js";
import { CONFIG } from "../config.js";
import { PaymentInfo } from "./PaymentInfo.js";

export function Footer({ navigate }) {
  const year = new Date().getFullYear();
  const go = (path) => (e) => {
    e.preventDefault();
    navigate(path);
  };

  return html`
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__col">
          <div className="brand-mark brand-mark--footer">${CONFIG.brandName}</div>
          <p className="site-footer__tagline">${CONFIG.brandTagline}</p>
          <div className="site-footer__socials">
            <a href=${CONFIG.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href=${CONFIG.socials.tiktok} target="_blank" rel="noreferrer">TikTok</a>
          </div>
        </div>
        <div className="site-footer__col">
          <h4>Shop</h4>
          <a href="#/shop/men" onClick=${go("/shop/men")}>Men</a>
          <a href="#/shop/women" onClick=${go("/shop/women")}>Women</a>
          <a href="#/shop/kids" onClick=${go("/shop/kids")}>Kids</a>
          <a href="#/shop/new" onClick=${go("/shop/new")}>New Arrivals</a>
          <a href="#/shop/sale" onClick=${go("/shop/sale")}>Sale</a>
        </div>
        <div className="site-footer__col site-footer__col--payment">
          <h4>How to Pay</h4>
          <${PaymentInfo} compact=${true} />
        </div>
      </div>
      <div className="site-footer__bottom container">
        <span>© ${year} ${CONFIG.brandName}. All rights reserved.</span>
      </div>
    </footer>
  `;
}
