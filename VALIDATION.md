# Validation · 2026-10-09

Passed in desktop Chrome with synthetic camera input:
- Initially clear glass: mask value 0.
- Local breath raises moisture at its origin while a far corner stays 0.
- A drawn stroke changed the sampled fog value from 240 to 0.
- A stationary drawing position triggers a droplet at two seconds, not earlier.
- Pause, scene switching, PNG and JPG downloads, and clear reset passed.
- Local MediaPipe face/hand models loaded in a worker.
- Camera shutdown detached and stopped the stream.
- A 390px mobile viewport had no horizontal overflow.
- No uncaught page errors; no external network requests during application testing.

Desktop and mobile screenshots were inspected. Automated camera tests used synthetic input. Separately, I confirmed that four real-camera actions worked normally on 2026-10-09; see TESTING.md. Varied lighting and multi-person evaluation remain untested. The renderer is an artistic approximation, and no measured stress-reduction claim is made.

## Fluid traces and postcards · 2026-10-09

- Cached feathered brush; display follows requestAnimationFrame. Hand targets are interpolated between worker results, with stale-target expiry and lift handling.
- Wet-stroke check produced 48 edge beads. Small sliding beads leave thin wet trails; the two-second droplet behavior is described in the updated interaction logic, which has not been rechecked here.
- In the synthetic desktop garden scene, 89 sampled animation intervals had a median of 16.7 ms and a 95th percentile of 16.8 ms. This is a browser frame-cadence sample, not a guarantee for real camera tracking or every device.
- Poster capture stays frozen; text is limited to 200 grapheme clusters. The 1200 × 1800 PNG dimensions and JPG signature were checked.
- Explicit save/export persists a postcard locally; refreshing and reopening restores its message. Re-saving the same postcard does not duplicate it.
- Simulated unavailable browser storage still permits image download and displays a failure message for the collection.
- Desktop poster, filmstrip and 390px mobile previews inspected. No uncaught page errors or external requests in the browser checks.

Run `check.mjs` and `check-poster.mjs` with Node and an available Playwright installation. These tests launch an isolated Chrome profile; generated test images contain only public-domain art and synthetic marks. My four-action real-camera report is recorded separately in TESTING.md; it does not quantify latency or cover other users.

## Independent submission copy

The prepared repository was served independently using `python3 run.py --port 8771`. Both browser check scripts passed against that server after their local machine paths were replaced by portable Chrome-channel configuration. No page errors or external application requests were observed. The app source and original assets were byte-compared with the prototype I tested and match.

Reference-link checking returned 200 for the raw course sources, model downloads, package metadata and technical guides. The museum pages return 403 to the shell checker but were opened and read with the web tool; both explicitly identify their media as public domain. Two model-card URLs initially confused the checker because of literal parentheses; their parentheses were percent-encoded. The complete BlazeFace URL returned 200; the hand-card shell retry had an HTTP/2 transport error, while the complete hand-card PDF had already been opened and read successfully with the web tool.

The source directory was initialized as a local Git repository during preparation. Repository upload was subsequently authorized on 2026-10-09. No history was fabricated. Runtime-generated test images, local Git metadata and development cache files are excluded from the transport ZIP.
