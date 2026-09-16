import React from "react";
import { html } from "./html.js";
import { useHashRoute } from "./router.js";
import { subscribeProducts, subscribeAuth, FIREBASE_NOT_CONFIGURED } from "./firebase.js";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { Home } from "./pages/Home.js";
import { Shop } from "./pages/Shop.js";
import { Product } from "./pages/Product.js";
import { AdminLogin } from "./pages/AdminLogin.js";
import { Admin } from "./pages/Admin.js";
import { NotFound } from "./pages/NotFound.js";

const { useState, useEffect } = React;

export function App() {
  const [route, navigate] = useHashRoute();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [user, setUser] = useState(undefined); // undefined = auth state unknown yet

  useEffect(() => {
    const unsub = subscribeProducts((list) => {
      setProducts(list);
      setLoadingProducts(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = subscribeAuth((u) => setUser(u));
    return unsub;
  }, []);

  const page = route[0];
  let content;

  if (page === "home" || route.length === 0) {
    content = html`<${Home} products=${products} navigate=${navigate} />`;
  } else if (page === "shop") {
    content = html`<${Shop} products=${products} navigate=${navigate} route=${route} />`;
  } else if (page === "product") {
    content = html`<${Product} products=${products} navigate=${navigate} route=${route} loading=${loadingProducts} />`;
  } else if (page === "admin") {
    if (FIREBASE_NOT_CONFIGURED || user === null) {
      content = html`<${AdminLogin} />`;
    } else if (user === undefined) {
      content = html`<div className="container page-status">Checking session…</div>`;
    } else {
      content = html`<${Admin} products=${products} user=${user} />`;
    }
  } else {
    content = html`<${NotFound} navigate=${navigate} />`;
  }

  return html`
    <div className="app-shell">
      ${FIREBASE_NOT_CONFIGURED &&
      html`
        <div className="demo-banner">
          Demo mode — showing sample products. Connect Firebase (see README.md) to make admin
          changes go live for real visitors.
        </div>
      `}
      <${Header} route=${route} navigate=${navigate} />
      <main className="app-main">${content}</main>
      <${Footer} navigate=${navigate} />
    </div>
  `;
}
