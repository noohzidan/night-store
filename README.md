# night — clothing store

A custom-coded storefront (plain HTML + React, no build step) with a
password-protected admin panel. Admin changes save to a live database
(Firebase Firestore), so every visitor sees updates immediately — not just
your own browser.

## What's here

```
index.html              entry point
css/styles.css           all styling (colors, layout, responsive)
js/config.js             brand name, WhatsApp/Vodafone/InstaPay numbers — EDIT THIS
js/firebase.js           Firebase project config + database/auth helpers — EDIT THIS
js/cloudinary.js         Cloudinary account details for admin image uploads — EDIT THIS
js/seed-data.js          sample products used by the "Seed sample products" admin button
js/App.js, router.js     app shell + simple hash router (#/, #/shop, #/product/:id, #/admin)
js/pages/                Home, Shop, Product, Admin, AdminLogin
js/components/           Header, Footer, ProductCard, Carousel, admin form, etc.
```

No `npm install`, no build tool. React, and Firebase are loaded straight from
their official CDNs as ES modules.

---

## 1. Fill in your business details

Open **`js/config.js`** and replace the placeholders:

- `whatsappNumber` — the number that receives orders, digits only with country
  code, no `+`, no spaces, no leading zero (e.g. Egyptian `010 1234 5678` →
  `"201012345678"`).
- `vodafoneCashNumber` — shown to customers as the Vodafone Cash payment number.
- `instapayHandle` — shown to customers as the InstaPay handle.
- `socials` — Instagram/TikTok links.

---

## 2. Set up Firebase (free) so admin edits go live for everyone

This is the piece that makes "admin changes update the live site for every
visitor" actually work, instead of only saving in your own browser.

1. Go to <https://console.firebase.google.com>, click **Add project**, give it
   any name (e.g. `night-store`), and finish creation (Google Analytics is
   optional — you can skip it).
2. In the project, click the **`</>`** (web) icon to register a web app. Give
   it a nickname, skip Firebase Hosting for now, click **Register app**.
3. Firebase shows you a `firebaseConfig` object. Copy it into
   **`js/firebase.js`**, replacing the placeholder object near the top of the
   file:
   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
   };
   ```
4. In the left sidebar, open **Build → Firestore Database → Create database**.
   Start in **production mode**, pick any region close to you.
5. Go to the **Rules** tab of Firestore and replace the rules with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /products/{productId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
   This lets anyone view products, but only a signed-in admin can create,
   edit, or delete them. Click **Publish**.
6. Open **Build → Authentication → Get started**. Under **Sign-in method**,
   enable **Email/Password**.
7. Go to the **Users** tab and click **Add user**. Enter the email and
   password you want to use to log into `/#admin` on the site. This is your
   admin login — there is no public sign-up, so this is the only account that
   can ever write to the store.

That's it — no server to run, no hosting bill. Firestore's real-time
listeners are what push every admin change to all open browser tabs instantly.

---

## 3. Set up Cloudinary (free, no card) for product image uploads

Firebase Storage now requires a billing account (Blaze plan) even for
free-tier usage, so image uploads use Cloudinary instead — genuinely free,
no credit card needed.

1. Create a free account at <https://cloudinary.com>.
2. On your Cloudinary dashboard, copy your **Cloud name** (shown near the top).
3. Go to **Settings** (gear icon) → **Upload** tab → scroll to **Upload
   presets** → **Add upload preset**.
4. Set **Signing Mode** to **Unsigned**, then **Save**. Copy the preset's name.
5. Open **`js/cloudinary.js`** and paste both values in:
   ```js
   const CLOUD_NAME = "your-cloud-name";
   const UPLOAD_PRESET = "your-preset-name";
   ```

If you skip this, the admin form still works — there's a "paste an image
URL" fallback next to the upload button, so you can host photos elsewhere
(e.g. Imgur) and link them in instead.

---

## 4. Run it locally

Browsers block ES module imports over `file://`, so serve the folder instead
of double-clicking `index.html`. Any static server works, for example:

```powershell
# Python (if installed)
python -m http.server 5500

# or Node's serve (if you install Node later)
npx serve .
```

Then open `http://localhost:5500`.

## 5. Deploy it

Since it's a static site, any static host works — pick one:

- **Firebase Hosting** (pairs nicely since you already have a Firebase
  project): `firebase init hosting` → `firebase deploy` (requires Node + the
  Firebase CLI).
- **Netlify** or **Vercel**: drag-and-drop the folder in their dashboard, or
  connect a GitHub repo.
- **GitHub Pages**: push this folder to a repo and enable Pages on it.

No environment variables or server config needed — the Firebase config in
`js/firebase.js` is safe to ship publicly (it's restricted by the Firestore
rules and Auth, not by secrecy).

---

## Using the admin panel

1. Go to `/#/admin` and sign in with the email/password you created in step
   2.7 above.
2. Click **Seed sample products** once to populate the store with 8 example
   items (safe to skip if you'd rather start empty).
3. **Add Product** / **Edit** / **Delete** as needed. Each product has:
   name, category (Men/Women/Kids), price, optional compare-at price (the
   original price, shown crossed out, when the product is discounted), "New
   Arrival" flag, in-stock toggle, sizes, colors, one or more photos, and a
   description.
4. **Images** — click **+ Upload image(s)** to upload directly from your
   device via Cloudinary, or use the "paste an image URL" field next to it
   if you'd rather link an already-hosted photo. Click the **×** on a
   thumbnail to remove it from the product.
5. Changes appear on the live site immediately for every visitor — no
   redeploy, no cache to clear.

## How ordering works

Each product page has an **Order via WhatsApp** button. It opens WhatsApp
with a pre-filled message containing the product name, selected size/color,
quantity, and price, sent to the number in `js/config.js`. Payment
instructions (Vodafone Cash + InstaPay) are shown on every product page and
in the footer.

## Notes / things you may want to change later

- Admin auth is a single hardcoded Firebase user — fine for one shop owner.
  If you want multiple admin accounts, just add more users in Firebase
  Authentication; the security rule already allows any signed-in user to
  write.
- The catalogue currently has categories Men/Women/Kids plus computed
  New Arrivals (`isNew` flag) and Sale (has a `compareAtPrice` higher than
  `price`) filters — add more categories by editing the `<select>` in
  `js/components/AdminProductForm.js` and the tab list in `js/pages/Shop.js`.
