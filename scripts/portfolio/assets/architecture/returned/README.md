# Current portfolio architecture images

The owner supplied these five transparent PNGs on 2026-09-07 after removing the
backgrounds in Photoroom. They are byte-for-byte copies of the returned files.
The PDF places each complete image at its original aspect ratio on the existing
paper color, with no crop, retouching, recoloring or extra background.

`manifest.json` records the source SHA-256, dimensions and destination page.
`verify_portfolio.py` checks those files, the PDF's decoded RGB image bytes,
the complete 8-bit alpha soft mask and the placement aspect ratio.

AQIS uses the owner's original diagram. Briefit, MRI, Alkkagi and Prompt Generator
use the reviewed Excalidraw-style diagrams subsequently returned by the owner.
The earlier sibling SVG/Excalidraw files are historical drafts and are not used
by the current PDF builder. THING remains the original black-background PNG on
page 5; its background removal is deferred at the owner's request.

Rebuild with the existing portfolio Python environment:

```text
python scripts/portfolio/build_portfolio.py
python scripts/portfolio/verify_portfolio.py
```

The PNGs retain raster labels. The adjacent PDF explanations and page titles
remain searchable text. The website build consumes only the reviewed public PDF.
