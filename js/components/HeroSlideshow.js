import React from "react";
import { html } from "../html.js";

const { useState, useEffect, useRef, useCallback } = React;

const AUTO_ADVANCE_MS = 6000;

export function HeroSlideshow({ slides, navigate }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (i) => setActive(((i % slides.length) + slides.length) % slides.length),
    [slides.length]
  );
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused || slides.length <= 1) return undefined;
    timerRef.current = setTimeout(next, AUTO_ADVANCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [active, paused, next, slides.length]);

  const go = (path) => (e) => {
    e.preventDefault();
    navigate(path);
  };

  return html`
    <section
      className="hero-slideshow"
      onMouseEnter=${() => setPaused(true)}
      onMouseLeave=${() => setPaused(false)}
    >
      <span className="hero-slideshow__frame-mark hero-slideshow__frame-mark--tl"></span>
      <span className="hero-slideshow__frame-mark hero-slideshow__frame-mark--br"></span>

      ${slides.map(
        (slide, i) => html`
          <div
            key=${i}
            className=${`hero-slide ${i === active ? "is-active" : ""}`}
            style=${{ backgroundImage: `url(${slide.image})` }}
            aria-hidden=${i !== active}
          >
            <div className="hero-slide__scrim"></div>
            <div className="hero-slide__content container">
              <p className="hero-slide__eyebrow">${slide.eyebrow}</p>
              <h1 className="hero-slide__title">${slide.title}</h1>
              <p className="hero-slide__tagline">${slide.tagline}</p>
              <a href=${`#${slide.ctaPath}`} className="btn btn--primary" onClick=${go(slide.ctaPath)}>
                ${slide.ctaLabel}
              </a>
            </div>
          </div>
        `
      )}

      ${slides.length > 1 &&
      html`
        <div className="hero-slideshow__controls container">
          <button className="hero-slideshow__arrow" aria-label="Previous slide" onClick=${prev}>‹</button>
          <div className="hero-slideshow__dots">
            ${slides.map(
              (_, i) => html`
                <button
                  key=${i}
                  className=${`hero-slideshow__dot ${i === active ? "is-active" : ""}`}
                  aria-label=${`Go to slide ${i + 1}`}
                  onClick=${() => goTo(i)}
                ></button>
              `
            )}
          </div>
          <button className="hero-slideshow__arrow" aria-label="Next slide" onClick=${next}>›</button>
        </div>
      `}
    </section>
  `;
}
