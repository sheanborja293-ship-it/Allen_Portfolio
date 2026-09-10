# Allen Shean — Personal Portfolio

A responsive, five-page portfolio built with HTML, CSS, vanilla JavaScript, and a small Flask backend. Every page contains its own complete HTML document, navigation, content, and footer. There are no shared templates, `extends`, or `include` statements. The design pairs a charcoal background with soft mint accents, editorial typography, and lightweight local SVG illustrations.

Flask serves the pages and processes the contact form. Only `contact.html` uses a few Jinja expressions for the form security token, validation messages, and previously entered values. The rest of that page is written directly in HTML, too.

## Run locally

Requires Python 3.10 or newer.

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000. On macOS/Linux, activate the environment with `source .venv/bin/activate`.

## Features

- Home, About, Skills, Projects, Contact, and custom 404 pages.
- Responsive navigation with active links and a mobile menu.
- Persistent light/dark themes, page transitions, scroll reveals, typing animation, skill bar animation, and reduced-motion support.
- Six sample projects with category filters and accessible native detail dialogs.
- Server-side contact validation, CSRF protection, flash messages, and a bounded temporary inbox.
- SEO metadata, SVG favicon, local illustration assets, and lazy-loaded project previews.
- Google Fonts and Bootstrap Icons load from CDNs; system fonts remain available offline.

## Structure

```text
app.py
requirements.txt
templates/
  index.html
  about.html
  skills.html
  projects.html
  contact.html
  404.html
static/
  css/style.css
  js/theme.js
  js/script.js
  js/page-transitions.js
  images/profile.jpg
  images/favicon.svg
  images/project-images/*.svg
  files/.gitkeep
README.md
```

## Personalize

1. Edit your email, phone number, Facebook profile, and location directly in `templates/contact.html`. To add a social link, replace its `social-placeholder` span with an anchor containing your URL and the existing icon. Each page contains its own social icons and navigation, so update every page where the link appears.
2. Edit the introduction and education in `templates/index.html` and `templates/about.html`. Dates, college year, and years of experience are deliberately unfilled.
3. Your supplied portrait is saved unchanged at `static/images/profile.jpg` and used on Home, About, and in Open Graph metadata. Replace this file to update your photo; adjust image dimensions and alternative text in the templates if needed.
4. Add your real PDF at `static/files/resume.pdf`. The download route detects it automatically. Until then, the button leads to Contact with a helpful notice.
5. Edit the skill names, displayed percentages, and matching `progress` values directly in `templates/skills.html`. The existing percentages are sample learning levels, not verified measurements.
6. Adjust CSS variables at the top of `static/css/style.css` to change the palette.

## Add projects

Copy an existing `<article class="project-card reveal">` in `templates/projects.html`. Edit its title, description, image path, technology badges, and `data-categories`. Categories are `Web`, `Mobile`, `Database`, and `System`. Place its preview image in `static/images/project-images/`. Update the initial project count and All button count when adding or removing cards.

To feature the project on Home, edit or copy a card in `templates/index.html` as well. The JavaScript detail dialog reads the title, description, and technology badges directly from the clicked HTML card; there is no separate Python project list. Replace the disabled GitHub and Live demo buttons with anchors when you have real URLs.

The supplied projects and interface illustrations are sample concepts. Replace their descriptions and images with your actual work. GitHub and live-demo buttons are disabled until URLs are provided.

## Contact and deployment

The contact form opens the visitor's default email app with the recipient, subject, and message pre-filled for `sheanborja293@gmail.com`. No SMTP account, password, or third-party email service is needed. Visitors must still press Send in their email app. The Flask route remains as a non-JavaScript fallback and stores those submissions temporarily in memory (maximum 100 messages).

Set a stable random `SECRET_KEY` environment variable for deployments and use a production WSGI server with HTTPS and debug mode disabled. `python app.py` deliberately starts Flask's local development server with debug enabled. Multiple production workers need a shared delivery/storage service, not the development inbox.

## Verification

Flask test-client checks cover all five pages, missing routes, the résumé fallback, successful contact submission, empty fields, malformed email, field-length limits, CSRF rejection, and static assets. JavaScript syntax is checked with `node --check`.

The source code lives directly in its separate files: Flask routes and form processing in `app.py`, complete HTML pages in `templates/`, styles in `static/css/style.css`, and JavaScript in `static/js/`. Run the project with `python app.py` and view it through the local server so navigation, asset URLs, and contact submissions work.
