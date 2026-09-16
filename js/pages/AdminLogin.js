import React from "react";
import { html } from "../html.js";
import { adminLogin, FIREBASE_NOT_CONFIGURED } from "../firebase.js";

const { useState } = React;

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await adminLogin(email, password);
    } catch (err) {
      setError("Login failed. Check the email and password and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (FIREBASE_NOT_CONFIGURED) {
    return html`
      <div className="container page-status admin-setup-notice">
        <h2>Firebase isn't configured yet</h2>
        <p>
          The admin panel needs a Firebase project to store products and log you in.
          Open <code>js/firebase.js</code> and paste your project's config, then
          create an admin user in Firebase Authentication. Full steps are in
          <code>README.md</code>.
        </p>
      </div>
    `;
  }

  return html`
    <div className="container admin-login">
      <form className="admin-login__card" onSubmit=${submit}>
        <h1>Admin Login</h1>
        <label>
          Email
          <input type="email" value=${email} onChange=${(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value=${password} onChange=${(e) => setPassword(e.target.value)} required />
        </label>
        ${error && html`<p className="form-error">${error}</p>`}
        <button className="btn btn--primary" type="submit" disabled=${busy}>
          ${busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  `;
}
