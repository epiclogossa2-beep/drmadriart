# Dr Madri Art — Website

Static multi-page site (HTML, CSS, JS) for GitHub Pages. No build step.

## Structure
index.html, about.html, services.html, contact.html, styles.css, main.js
images/ (madri.png, madri_icon_1.png, madri_icon_2.png, art_image_1-6.jpg)
fonts/  (add the licensed Nourd files here)

## Nourd font (required)
Nourd is a commercial font and cannot be loaded from Google Fonts. Buy/licence it, convert to .woff2 and add:
fonts/Nourd-Regular.woff2, fonts/Nourd-Medium.woff2, fonts/Nourd-Bold.woff2
(@font-face rules are at the top of styles.css). Until then the site uses Outfit as a stand-in.

## Booking form
Create a form at formspree.io, then replace YOUR_FORM_ID in the data-endpoint attribute in contact.html.

## Still to replace before launch
- Sample testimonials on the home page (use real ones, with permission)
- Social links (href="#" in the footer)
- Cancellation / medical aid answers on contact.html
- Add a POPIA privacy policy page (the form collects personal data)
- Compress images (squoosh.app); art images are 612px stock photos
