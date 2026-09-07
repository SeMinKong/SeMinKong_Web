> Current PDF assets: see [returned/README.md](returned/README.md). The owner-returned transparent PNGs supersede the historical vector diagrams below. THING remains unchanged.

# Editable software architectures

Four code-reviewed diagrams accompany the 2026.09.07 static portfolio:

- `briefit`: the owner's 2025 collection, KoBART training/inference and evaluation scripts.
- `mri`: independent YOLO11 classification/segmentation and local result composition.
- `alkkagi`: React clients, Socket.IO, authoritative server physics and memory state.
- `prompt`: browser, FastAPI memory sessions, six-domain conversations and Solar Pro.

Open each `.excalidraw` with Excalidraw's **Open** action. Boxes, arrows and text are
editable; technology logos are embedded transparent SVG images. No external asset
fetch is needed. Matching `.svg` files have transparent backgrounds and embedded
logo data. THING and AQIS retain the owner's original PNG drawings in the PDF;
these four new scenes do not claim to be editable versions of those originals.

The scene source is `../../architecture_diagrams.py`. It draws native vector logos,
lines and searchable text into the PDF and exports these editable files. SVG and
Excalidraw typography can vary slightly with the editor's installed fonts.

## Regeneration

The existing PDF Python environment needs `svglib==2.2.0` in addition to Pillow,
ReportLab, pypdf and pdfplumber. The portfolio uses the existing NanumGothic fonts
and local private portrait; the web build only needs the reviewed public PDF.

From the repository root:

```text
node scripts/portfolio/export_architecture_icons.mjs
python scripts/portfolio/architecture_diagrams.py
python scripts/portfolio/build_portfolio.py
python scripts/portfolio/verify_portfolio.py
```

After rendering and visually reviewing the full PDF, run the builder with
`--publish`, update the download metadata/hash contracts, and run `npm.cmd run verify`.
Only the reviewed PDF is copied to the public website, not these working sources.

Icons are exact Simple Icons 16.28.0 vector paths (CC0-1.0); upstream source URLs
are recorded in `icons-source.json`. Hugging Face uses a darker gold for legibility
on the light PDF paper. Shapes and labels are original project-specific diagrams.
