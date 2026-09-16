import { CONFIG } from "./config.js";

export function formatPrice(n) {
  return `${Number(n).toLocaleString("en-US")} ${CONFIG.currency}`;
}

/** True when the product has a compare-at price higher than its actual price (i.e. it's discounted). */
export function hasDiscount(product) {
  return (
    product.compareAtPrice != null &&
    product.compareAtPrice !== "" &&
    Number(product.compareAtPrice) > Number(product.price)
  );
}

/** Builds a wa.me link pre-filled with the order details. */
export function buildOrderLink(product, { size, color, qty = 1 } = {}) {
  const price = Number(product.price);
  const lines = [
    `Hi ${CONFIG.brandName}! I'd like to order:`,
    `• Product: ${product.name}`,
    size ? `• Size: ${size}` : null,
    color ? `• Color: ${color}` : null,
    `• Qty: ${qty}`,
    `• Price: ${formatPrice(price * qty)}`,
    "",
    "Is this available?",
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}
