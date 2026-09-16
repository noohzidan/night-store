// ---------------------------------------------------------------------------
// SITE CONFIG — edit the placeholder values below, then reload the site.
// ---------------------------------------------------------------------------

export const CONFIG = {
  brandName: "night",
  brandTagline: "wear the dark hours",
  currency: "EGP",

  // WhatsApp number that receives orders.
  // Digits only, with country code, NO "+", NO spaces, NO leading zero after
  // the country code stripped. Example for an Egyptian number 010 1234 5678:
  //   -> "201012345678"
  whatsappNumber: "201000000000", // TODO: replace with your real WhatsApp number

  // Vodafone Cash number customers send payment to.
  vodafoneCashNumber: "01000000000", // TODO: replace with your real Vodafone Cash number

  // InstaPay handle / mobile number customers send payment to.
  instapayHandle: "@night.store", // TODO: replace with your real InstaPay handle

  // Shown on the payment-instructions block.
  paymentInstructions: [
    "Tap \"Order via WhatsApp\" on the product you want and confirm size, color and quantity.",
    "Pay the total via Vodafone Cash or InstaPay using the details shown.",
    "Send a screenshot of the payment to the same WhatsApp chat to confirm your order.",
    "We'll confirm and ship within 2–4 business days.",
  ],

  socials: {
    instagram: "https://instagram.com/night.store", // TODO
    tiktok: "https://tiktok.com/@night.store", // TODO
  },
};
