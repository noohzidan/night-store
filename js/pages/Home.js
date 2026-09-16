import React from "react";
import { html } from "../html.js";
import { CONFIG } from "../config.js";
import { HeroSlideshow } from "../components/HeroSlideshow.js";
import { CategoryGrid } from "../components/CategoryGrid.js";
import { Carousel } from "../components/Carousel.js";
import { Reviews } from "../components/Reviews.js";
import { hasDiscount } from "../whatsapp.js";

const SLIDES = [
  {
    eyebrow: "New Season",
    title: CONFIG.brandName,
    tagline: CONFIG.brandTagline,
    image: "https://picsum.photos/seed/night-hero-1/1800/1000",
    ctaLabel: "Shop Now",
    ctaPath: "/shop",
  },
  {
    eyebrow: "Just Landed",
    title: "New Arrivals",
    tagline: "Fresh cuts, restocked staples, warm-weather essentials.",
    image: "https://picsum.photos/seed/night-hero-2/1800/1000",
    ctaLabel: "Shop New Arrivals",
    ctaPath: "/shop/new",
  },
  {
    eyebrow: "For a Limited Time",
    title: "Up to 40% Off",
    tagline: "Selected pieces marked down across Men, Women and Kids.",
    image: "https://picsum.photos/seed/night-hero-3/1800/1000",
    ctaLabel: "Shop Sale",
    ctaPath: "/shop/sale",
  },
];

export function Home({ products, navigate }) {
  const newArrivals = products.filter((p) => p.isNew).slice(0, 10);
  const onSale = products.filter(hasDiscount).slice(0, 10);

  return html`
    <div>
      <${HeroSlideshow} slides=${SLIDES} navigate=${navigate} />

      <section className="promo-strip">
        <div className="container promo-strip__inner">
          <span>Order via WhatsApp</span>
          <span>·</span>
          <span>Pay with Vodafone Cash / InstaPay</span>
          <span>·</span>
          <span>Nationwide Delivery</span>
        </div>
      </section>

      <section className="section">
        <div className="container section__head">
          <p className="section-eyebrow">Shop the Line</p>
          <h2>Collections</h2>
        </div>
        <${CategoryGrid} navigate=${navigate} />
      </section>

      <${Carousel} eyebrow="Fresh off the rack" title="New Arrivals" products=${newArrivals} navigate=${navigate} />
      <${Carousel} eyebrow="For a limited time" title="On Sale" products=${onSale} navigate=${navigate} />

      <${Reviews} />
    </div>
  `;
}
