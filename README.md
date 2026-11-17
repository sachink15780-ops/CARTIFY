# CARTIFY

A mobile-friendly shopping storefront with customer sign-in, Google sign-in, product categories, cart, checkout, customer order history and an admin dashboard.

## Current project status

The storefront files are in this repository. Live customer accounts, orders and admin functions require your Firebase project to be connected. Google Sheets export is optional and requires deployment of the included Apps Script. Do not accept real customer orders until setup and test orders are complete.

## 1. Connect Firebase (required)

1. Open https://console.firebase.google.com/ and create a project named **CARTIFY**.
2. Add a Web app. Copy its Firebase web configuration into `firebase-config.js`, replacing every `PASTE_...` value.
3. In Firebase Authentication, enable **Email/Password** and **Google** sign-in providers.
4. In Authentication > Settings > Authorized domains, make sure your GitHub Pages domain is listed.
5. Create a Firestore database.
6. Open Firestore Rules and publish the contents of `firestore.rules`.
7. In both `firestore.rules` and `app.js`, replace `YOUR_ADMIN_EMAIL@example.com` with the exact email address you will use as store admin.

Firebase web config is intended for browser apps; Firestore security rules protect the data. Never upload service-account JSON or Firebase Admin credentials.

## 2. Publish with GitHub Pages

1. Open this repository on GitHub.
2. Go to Settings > Pages.
3. Under Build and deployment, choose **Deploy from a branch**.
4. Select branch **main**, folder **/(root)**, then Save.
5. Wait for GitHub Pages to publish. The address will be https://sachink15780-ops.github.io/CARTIFY/

## 3. Google Sheets order export (optional)

1. Create a new Google Sheet.
2. Open Extensions > Apps Script and paste the code from `google-sheets/Code.gs`.
3. Deploy > New deployment > Web app. Execute as **Me** and set access to **Anyone**.
4. Copy the Web App URL into `SHEETS_WEB_APP_URL` in `app.js`.

The Sheet contains customer contact and delivery details. Restrict access to the Sheet and Apps Script deployment appropriately. The current browser-to-Sheets request is a convenience integration; verify every test row before relying on it for live orders.

## 4. Store configuration

- Set the admin email in both `app.js` and `firestore.rules`.
- Add your UPI ID in `app.js` before offering UPI. UPI orders remain **Pending** until you verify payment manually. No payment gateway is connected.
- Add/edit products from the admin dashboard after signing in as the configured admin.
- Admin dashboard shortcut: press **Ctrl + Alt + A** on a physical keyboard while signed in as the admin. On mobile, use a browser with a keyboard or add an admin shortcut later.

## Important limitations

- This starter does not connect to Meesho or place supplier orders automatically. You place supplier orders manually.
- COD is recorded as a requested payment method; courier COD collection is not integrated.
- No SMS OTP login, automatic courier tracking, shipping labels, GST invoices or refund gateway is connected.
- Product photos and sample prices are demo content. Replace them with images, prices, stock and product descriptions you have permission to use.
- Test sign-up, Google sign-in, customer isolation, checkout, admin access, order updates and Sheets export before inviting customers.
