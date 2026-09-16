import React from "react";
import { html } from "../html.js";
import { CONFIG } from "../config.js";

export function PaymentInfo({ compact = false }) {
  return html`
    <div className=${`payment-info ${compact ? "payment-info--compact" : ""}`}>
      <div className="payment-info__methods">
        <div className="payment-info__method">
          <span className="payment-info__label">Vodafone Cash</span>
          <span className="payment-info__value">${CONFIG.vodafoneCashNumber}</span>
        </div>
        <div className="payment-info__method">
          <span className="payment-info__label">InstaPay</span>
          <span className="payment-info__value">${CONFIG.instapayHandle}</span>
        </div>
      </div>
      ${!compact &&
      html`
        <ol className="payment-info__steps">
          ${CONFIG.paymentInstructions.map((step, i) => html`<li key=${i}>${step}</li>`)}
        </ol>
      `}
    </div>
  `;
}
