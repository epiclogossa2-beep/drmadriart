# Dr Madri Art — Website

Static multi-page site (HTML, CSS, JS). Works on GitHub Pages with no build step.

## File structure

```
/ (repo root)
├── index.html
├── about.html
├── services.html
├── gallery.html
├── contact.html
├── styles.css
├── main.js
└── images/
    ├── logo.png      <- upload the logo here
    ├── madri.jpg     <- upload the client photo here
    └── (gallery images, studio photos, etc.)
```

Create an `images` folder and upload the logo as `logo.png` and the photo as `madri.jpg` (or change the names in the HTML).

## Publish on GitHub Pages

1. Create a repository and upload all files.
2. Go to Settings > Pages.
3. Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
4. Save. The site goes live at `https://USERNAME.github.io/REPO/` within a minute or two.
5. Custom domain: add it under Settings > Pages and add a `CNAME` file if prompted.

## Make the booking form work

GitHub Pages has no server, so use a free form service:

1. Sign up at https://formspree.io and create a form with the client's email.
2. Copy the form ID (the part after `/f/`).
3. In `contact.html`, replace `YOUR_FORM_ID` in the `data-endpoint` attribute.
4. Submit a test, then confirm the first email in Formspree.

(Alternatives: Web3Forms, Basin, Getform. Any service that accepts a POST works.)

## Placeholders to replace

Search the files for these:
- `[...]` square brackets: prices, durations, credentials, policies
- `hello@yourdomain.com`, `+27 00 000 0000`, address
- `Placeholder:` text on the About page (write in Dr Madri's voice)
- Sample testimonials on the home page (use real ones, with permission)
- Stats numbers (`data-count` attributes in `index.html`)
- Social links (`href="#"` in the footer)
- Every `.ph` image placeholder: replace
  `<div class="ph tall" data-label="..."></div>` with
  `<img class="cover" src="images/your-photo.jpg" alt="Describe the image">`

## Brand tokens

Edit in `:root` at the top of `styles.css`:
`--navy #194367`, `--amber #e18817`, `--crimson #8f0e1c`.

## Before launch checklist

- Add real alt text to all images
- Compress images (squoosh.app) for fast loading
- Add a privacy policy page (POPIA compliance, since the form collects personal data)
- Never publish client artwork without written consent
- Confirm professional registration details are displayed correctly
