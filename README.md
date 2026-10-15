# Dr Madri Art — Website

Static multi-page site (HTML, CSS, JS) for GitHub Pages. No build step.

## Structure
index.html, about.html, services.html, contact.html, privacy.html, 404.html,
styles.css, main.js, sitemap.xml, robots.txt
images/ (madri.png, madri_icon_1.png, madri_icon_2.png, art_image_1-6.jpg)
fonts/  (add the licensed Nourd files here)

## Nourd font (required)
Nourd is a commercial font and cannot be loaded from Google Fonts. Buy/licence it, convert to .woff2 and add:
fonts/Nourd-Regular.woff2, fonts/Nourd-Medium.woff2, fonts/Nourd-Bold.woff2
(@font-face rules are at the top of styles.css). Until then the site uses Outfit as a stand-in.

## Booking form
Create a free access key at web3forms.com (enter the practice email, then copy the key emailed to you). In contact.html replace YOUR_ACCESS_KEY with it. Send a test booking afterwards.

## Still to do before launch
- Add the cancellation policy and medical aid / payment FAQ items to contact.html (a comment marks the spot)
- Compress images (squoosh.app); keep file names and extensions exactly as referenced in the HTML
- If a custom domain is added later: update the URLs in sitemap.xml, robots.txt, the canonical/og tags and JSON-LD, and remove the <base> tag in 404.html
- Testimonials were removed on purpose; health practitioners should check HPCSA advertising rules before publishing any
