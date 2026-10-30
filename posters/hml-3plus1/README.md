# HML 3+1 poster

A3 print poster for the 3+1 programme, laid out after the Chupa Chups "It's Chupa time" poster: giant cropped
**3 + 1** in a Z down the page, the real *Essential English* book as the glossy hero product, a golden diagonal
plane, the Higher Mind Learning logo top right (without the "Daily English" line), a stacked headline with an
outlined middle word, the offer, both phone numbers and a round stamp.

## Files

- `out/HML_3plus1_A3.png`: the print master, A3 at 300 dpi (3508 x 4960 px).
- `out/HML_3plus1_A3.pdf`: the same, as an A3 page for the printer (RGB).
- `out/HML_3plus1_share.jpg`: 1600 px wide, for messages and posts.
- `index.html`: the layout (every size in vw, so it renders at any width); `book.js`: the 3D book.

## The book

`book.js` builds the paperback in millimetres: A4, 237 pages (119 leaves at 0.1 mm) in 0.35 mm laminated covers,
12.6 mm thick. The printed faces are the PDF's own pages (page 1 and page 237 at 350 dpi) shown at their exact
colours; the gloss and falloff are two films laid on the cover. The spine continues the cover's bands, measured
from the PDF (orange 0 to 13.9 mm, dark navy to 19.5 mm; dark navy from 278 mm, orange from 283 mm). The pose,
lights and gloss are query parameters (see the defaults at the end of `index.html`), for example `?ry=30&sheen=0.4`.

## Rebuild

From this folder, with the Lemo-Opuscar library at `~/lemo-opuscar` (or `LIB=<path>`):

```sh
node render.mjs --out out/HML_3plus1_A3.png
python tools/export.py out/HML_3plus1_A3.png out
```

`tools/make_assets.py <book.pdf> <logo.png> assets` remakes the textures and the logo cut (white keyed to alpha);
`tools/localfonts.py` fetched Montserrat (OFL) from Google Fonts; `tools/merge_overlaps.py` made
`Montserrat-Black-outline.woff2`, a static Black with its overlapping contours merged, so the outlined word
shows only the outer shapes. The tools need `pymupdf pillow numpy fonttools skia-pathops brotli`.
