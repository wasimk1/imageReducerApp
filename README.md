# Shrinkify

A responsive, frontend-only Angular application for private image compression and PDF optimization. All file processing happens locally. No API, backend, account, database, analytics, external fonts, or cloud storage.

## Run locally

Use Node.js 24.15 or later (24 LTS recommended), and npm.

```sh
npm ci
npm start
```

Open http://localhost:4200. Node is only a development/build tool; the deployed app is static.

```sh
npm test -- --watch=false
npm run build -- --base-href ./
```

## Project structure

```text
src/app/
  components/
    navbar/                 Navigation
    hero/                   Introduction
    file-upload/            Picker, drag/drop, file validation
    image-compressor/       Settings and image workflow
    pdf-compressor/         PDF settings and workflow
    compression-result/    Statistics, comparison, download
    footer/                 Links and privacy
  models/compression-result.model.ts
  services/
    image-compression.service.ts
    pdf-compression.service.ts
  app.ts / app.html         Signals, tabs, page composition
src/styles.css             Shared responsive styles
public/favicon.svg
.github/workflows/deploy.yml
```

Standalone components use signals, modern Angular control flow, and template-driven settings. Larger templates live in separate HTML files; small presentational components use inline templates. The only additional runtime package beyond Angular is `pdf-lib`, lazy-loaded on PDF selection.

## Images

Supports JPG/JPEG, PNG and WebP. Uses `createImageBitmap`, Canvas, `toBlob` and object URLs. Quality 10–100, JPG/PNG/WebP export, adjustable dimensions and aspect-ratio lock. PNG encoding is lossless and ignores the quality setting; resizing can reduce size. JPG/WebP quality settings are lossy, so visually compare the output. The headline expresses the quality goal, not a mathematical lossless guarantee.

JPEG flattens transparency onto white; animated images become a single frame. Canvas may strip metadata and change color profiles. Maximum file size: 50 MB; maximum image: 8192 pixels on either side and 32 million pixels. Memory limits still vary by device.

If re-encoding the same format and dimensions creates a larger file, the original is retained. Explicit format/resize requests are honored, with a warning for larger output. Object URLs are revoked on replacement/removal/destruction. Async results are ignored after component destruction or selection changes.

## PDFs

Uses [pdf-lib](https://pdf-lib.js.org/docs/api/classes/pdfdocument) to parse and serialize PDFs:

- Low: basic rewrite with object streams disabled.
- Medium: compressed object structures.
- High: Medium plus clearing standard title, author, subject, keywords, creator and producer fields. This is not complete metadata sanitization.

No rasterization or recompression of embedded images. Scanned and already optimized PDFs often yield little or no savings. If output is not smaller, the original is returned. Encrypted/password-protected or malformed PDFs are rejected. Rewriting can invalidate digital signatures; retain signed originals.

## GitHub Pages

1. Push this project to a GitHub repository on the `main` branch.
2. In repository Settings → Pages, select **GitHub Actions** as the source.
3. The included workflow installs dependencies, runs tests, builds and deploys the static output.
4. Open the deployment URL shown in the workflow.

The build uses `--base-href ./`, so lazy chunks, scripts, and favicon resolve inside a repository subdirectory as well as a root domain. Navigation uses same-page fragments instead of path routes; no server rewrite or 404 fallback is required. Angular Router is available in the starter but is not used for this single-page interface.

Manual static deployment: upload the contents of `dist/image_reducer_app/browser/`. Serve over HTTP(S), not `file://`.

The footer GitHub link currently points to the public image-compression topic. Replace it in `components/footer/footer.ts` with your repository URL when known.

## Validation

Unit tests cover mode switching, disabled empty-state actions, upload limits, PDF readability/page retention, non-increasing PDF output size, and invalid PDFs. A production build verifies Angular templates and TypeScript. Image encoding should also be checked in a real browser because DOM test environments do not implement Canvas encoding.
