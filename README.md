# monishkk.github.io

Personal portfolio — Monish Krishnakumar. Aerospace Engineering, University of Washington.

**Live:** https://monishkk.github.io

## Design

Technical-drawing theme on beige drafting paper: graph-paper grid, drafting rules and
registration marks, sheet-indexed sections, balloon callouts, and a title block in the footer.
A single accent (drafting red) is used for emphasis. The side rail's **Invert** control flips
the page to a dark sepia negative; the choice is stored in `localStorage`.

## Stack

Static HTML, CSS, and vanilla JS — no build step, no dependencies. Served directly by GitHub Pages.

```
index.html          all content
assets/style.css    theme, layout, print styles
assets/main.js      scroll-spy, reveal-on-scroll, theme toggle
assets/favicon.svg
```

Type: IBM Plex Sans + IBM Plex Mono (Google Fonts).

## Local preview

Any static server works:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Editing

Content lives entirely in `index.html`, grouped by sheet number (`00`–`06`). To add a section,
copy a `<section class="sec">` block and add a matching entry to the `.rail__list` in the header —
the scroll-spy and reveal animations pick it up automatically.
