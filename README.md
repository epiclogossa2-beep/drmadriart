# Dr Madri Art — Website

Static multi-page site (HTML, CSS, JS) for GitHub Pages. No build step.

## Structure
index.html, about.html, art-therapy.html, services.html, contact.html, privacy.html, 404.html,
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

## Booking form (updated)
- Visitors choose "Book a session" or "Request more information" (also reachable via contact.html?type=info).
- Reply preference: Email / WhatsApp messages only / Either. Email or number is required accordingly.
- The open date picker was replaced by preferred days. Calendly is now live: contact.html has a "See live availability" section (#pick-a-time) that loads the Calendly widget only when the visitor clicks. The event link is https://calendly.com/drmadriart/30min (set once in the script at the bottom of contact.html). If the event link is renamed in Calendly, update it in the script and in the fallback link in that section.
- Calendly settings (free plan): one active event type, Tue/Wed/Thu 09:00-17:00 SAST, 60 and 90 minute durations, locations: in person + Google Meet.
- Facebook link is currently https://www.facebook.com/me/ - replace with the practice's public page URL.

## Email (madri@drmadriart.co.za)
Listed in the footer, contact page, call-to-action bands and structured data. Until the mailbox exists, mail sent to it will bounce, so set up forwarding or the mailbox first. Web3Forms needs a working inbox to issue the access key: use any inbox you can read now, then create a new key for the practice email later and replace it in contact.html.

## Tools (run once, locally)
- python3 tools/selfhost_fonts.py   - downloads the Google fonts into fonts/, writes fonts.css, updates every page and removes the Google Fonts line from privacy.html
- python3 tools/optimise_images.py  - needs `pip install pillow`; creates .webp copies and wraps images in <picture> with the original as fallback
Commit the generated fonts/, fonts.css and images/*.webp.

## Features added
- Hero "make your mark" trail (main.js; off for reduced-motion and touch devices)
- "Who is this for?" guide on the home page (#start)
