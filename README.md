# Downtown Provo Inc. Website

A simple, static, fast-loading website for Downtown Provo Inc. (DPI).

## Overview

This site serves as a hub for people to find:
- Live updates (Instagram)
- Events (calendar)
- Email newsletter signup
- Useful maps
- DPI membership form

## Tech Stack

- Plain HTML5
- CSS3 (single `styles.css` file)
- Vanilla JavaScript (single `main.js` file)
- No frameworks or build tools required
- Designed to work as a pure static site on GitHub Pages or Vercel

## File Structure

```
/
├── index.html              # Main landing page
├── maps.html               # Maps page with GIS embeds
├── styles.css              # Global stylesheet
├── main.js                 # JavaScript logic
├── data/
│   └── video-config.json   # Video embed URL configuration
├── imgs/                   # Image assets
└── README.md               # This file
```

## Configuration

### Video Embed URL

The hero video on the home page is configured via `data/video-config.json`. Edit this file to update the video:

```json
{
	"embedUrl": "https://www.youtube.com/embed/YOUR_VIDEO_ID"
}
```

The JavaScript will automatically load this configuration on page load. If the file cannot be loaded, it will fall back to a default URL.

### Maps Iframe

Edit `maps.html` to update the GIS maps iframe `src` attribute directly in the HTML.

## Brand Color

The site uses DPI's brand color: `#65BEB8` (teal), defined as a CSS custom property `--dpi-teal`.

## Deployment

This site can be deployed to:
- **GitHub Pages**: Simply push to your repository and enable Pages in settings
- **Vercel**: Connect your repository for automatic deployments
- Any static hosting service

No build step is required—just upload the files as-is.

## Maintenance

All content is easily editable:
- HTML files can be updated directly
- Links and text in cards are in plain HTML
- Video URL is in `data/video-config.json`
- Maps iframe URL is in `maps.html`

## Development

1. Clone the repository
2. Open `index.html` in a browser (or use a local server)
3. Edit files as needed
4. No installation or build process required

## Notes

- The site uses tabs for indentation (not spaces)
- All paths are root-relative for compatibility with GitHub Pages
- The site is mobile-first and responsive

