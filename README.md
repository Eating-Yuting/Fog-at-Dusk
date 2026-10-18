# Fog at Dusk · 傍晚的大雾天

I designed Fog at Dusk as a browser-based glass experience with localized breath mist, fingertip traces and slowly falling droplets. OpenAI Codex helped me implement it. I made it for SD5913 Assignment 3, whose current brief asks for a web experience that responds to human interaction and is submitted as a repository.

![Fog at Dusk: local mist and fingertip traces](images/experience.png)

## Play online / 在线试玩

**[Open Fog at Dusk →](https://eating-yuting.github.io/Fog-at-Dusk/)**

Use a recent desktop Chrome, press **Enable camera**, and allow camera access. The first camera start loads bundled tracking models and may take a moment. Wait for “Face found · Hand found”; if the cursor ring is missing, keep your face and hand in frame and step back slightly. Switching to another background pauses landmark inference; returning to the live camera resumes it. You can also use the mouse without a camera. No installation or API key is needed.

Camera processing stays in your browser. Optional background music is bundled locally and plays only after you turn it on. Postcards are saved in this browser on this website; collections from a localhost address do not transfer automatically. Download PNG/JPG copies to keep them elsewhere.

Compatibility: The assignment brief does not specify a required device or browser. I recommend recent desktop Chrome with WebGL. Camera access needs HTTPS or localhost and your permission. I have not tested every browser or device; mouse and keyboard work without a camera, and touch input is supported.

中文：作业没有指定设备或浏览器。我建议使用较新的桌面版 Chrome；摄像头需在 HTTPS 或 localhost 下并获准使用。其他浏览器和设备尚未全面测试；不开摄像头也能用鼠标、键盘或触屏。

## Run locally / 本地打开

Requirements: Python 3.9+ and a recent desktop Google Chrome with WebGL. No Node.js, package installation or AI account is needed to play. Unzip the project, open its folder in VS Code, then open Terminal → New Terminal. From the project root:

```sh
python3 run.py
```

On Windows, use `py -3 run.py` if `python3` is unavailable. Keep the terminal open while playing. Do not double-click `dist/index.html`; the app needs a local web server.

Open http://127.0.0.1:8769 in a recent desktop Chrome. Use localhost or HTTPS for camera access. The application and its tracking models are included locally; it does not need a course API key, paid service, account or model-generation server. To stop the local server, press Ctrl+C in its terminal.

## Experience / 体验

- **Start clear.** The garden preview stays clear until you add mist. Enabling the camera replaces the background with a mirrored live image.
- **Breathe.** Open your mouth: mist appears near the corresponding mouth position. Close it to stop adding mist. A sensitivity control adjusts the opening threshold. Alternatively, hold the mist button, or hover over the glass and hold Space.
- **Trace.** Extend an index finger and move it in view. Keep your face and hand in frame; step back slightly if the cursor ring is missing. The Fine trace width is the starting setting. Bend the finger or move the hand out of view to lift. Mouse dragging and touch also draw directly from the user's trajectory. A cached feathered brush preserves the hand-drawn path, with small beads along damp edges and thin trickles. No handwriting recognition, automatic lettering or generated strokes are used.
- **Stay.** Hold a drawing position within a small tolerance for two seconds. One droplet forms and slides down; move to another position to repeat. Optional music is off until you press Soft music.
- **Keep.** Freeze the composition, select the live camera, a solid colour, either Monet painting or the GPT-generated Hong Kong harbour scene, then export the rendered glass to PNG or JPG. A warm solid colour makes mist and water trails easier to see than a detailed painting. UI controls are excluded. The exported dimensions match the drawing surface, capped for browser performance; this is not a print-resolution exporter.
- **Make a poster.** Choose a background, hold the moment, then choose Make a poster. Add a message up to 200 visible characters (emoji clusters count as one), then keep the postcard in the film collection or export a 1200 × 1800 PNG/JPG. The captured glass is fitted without cropping; adding pixels does not add camera detail. If there are too many manual line breaks to fit, the poster flows them into paragraphs.
- **Film collection.** Keep or export explicitly to store the postcard in this browser's IndexedDB. Reopen a film frame to edit or download it. Re-saving the same postcard updates it. Clearing site data, switching browser/profile, or changing localhost port will affect access; download copies for durable storage. This is an in-app collection, not an automatically created operating-system folder.
- **Clear.** Clear glass removes all mist, marks and droplets. Let mist fade controls slow natural dissipation.

中文：清晰玻璃开始；张嘴在嘴部镜像位置起雾；伸食指擦写、弯曲抬笔；同处停留两秒滴水；轻柔音乐需手动开启；可定格、换背景并保存。不开镜头也能用鼠标或触屏。

## User direction and implementation choices

**User direction:** a calming experience, mouth- and fingertip-tracked interaction, handmade marks, two-second droplets, optional music, camera / solid / Monet / GPT-generated Hong Kong harbour backgrounds, local PNG/JPG output, frosted controls, English primary with smaller Chinese descriptions, and warm streetlamp colours. The user clarified that the initial glass must be clear and mist must appear only locally.

**Implementation choices:** MediaPipe Face and Hand Landmarker, entirely on the device; a WebGL glass renderer driven by a 2D moisture mask; index extension as a virtual contact gesture; camera and landmark positions share the same mirrored cover transform; worker inference avoids blocking drawing. The display follows requestAnimationFrame rather than a fixed 30 Hz cap; hand inference is requested at up to 20 Hz when the worker is free, with a short time-based interpolation between results. Brief tracking loss lifts the drawing point; stale targets expire after 250 ms. Actual rates depend on the device. The scene uses a restrained amber light tint and frosted controls. Monet is a preview until camera permission is granted.

**Not yet established:** relief or stress reduction is a design intention, not a measured clinical or user-study result. On 2026-10-09, I tested four real-camera actions: localized mouth mist, tracing a circle, bending my finger to stop, and holding to release a droplet. This was my own functional check, not a measured usability study. This prototype uses mouth opening as a proxy; a normal camera does not measure real exhalation, humidity, temperature, or physical finger-to-screen contact. Two seconds is a designed feedback threshold.

## Privacy and lifecycle

Camera permission is requested only after clicking Enable camera. No microphone is requested. Frames are processed locally in a worker; no camera frames, landmarks or exported images are sent to a server. No analytics, external fonts, course API keys or cookies are included. Only an explicit Keep / Export poster action stores a captured still and its message in this browser; it does not store video or tracking landmarks. Previewing a poster alone does not persist it. Turn camera off stops all stream tracks and terminates the worker. Export saves locally only when requested. Anyone whom you explicitly give the exported image can see whatever background it contains.

## Physical reference and artistic simplification

Condensation forms when a surface is below the dew point of adjacent air [1]. The visual treatment uses localized mist, fine irregular refraction, transparent wiped trails and rounded drops. It is a designed visual approximation: droplet optics, airflow, surface tension, temperature and wetting are not numerically simulated.

Face and hand landmarks are supported by the MediaPipe browser APIs [2–3]. Their output provides the positions used by this interaction, not proof of actual breathing or contact.

## Artwork provenance

Both artwork pages explicitly describe their media as public domain [4–5]. Local images came from the museum's download endpoints; source URLs and titles are retained in `dist/assets/artworks.json`.

- Claude Monet, *The Japanese Footbridge*, 1899, National Gallery of Art.
- Claude Monet, *Waterloo Bridge, Gray Day*, 1903, National Gallery of Art.

## Checks and remaining limits

`check-poster.mjs` additionally checks wet-edge beads, poster freezing, the 200-character limit, downloads, collection persistence and mobile layout. `check.mjs` contains checks for cover-coordinate mirroring, the two-second threshold, initial transparency, localized fog, clearing by strokes, droplet release, pause, scene switching, PNG/JPG export, local tracking initialization, camera shutdown and narrow-screen layout. Browser tests use synthetic camera input; they do not access the user's actual camera. I tested the camera myself, and one anonymized classmate also tried it. Their observations and my first response are recorded in PROCESS.md. The camera-return change and updated framing guidance still need a follow-up trial. Quantitative latency, other people beyond this one classmate, low light and other browsers have not been comprehensively validated. In low light or during occlusion, use mouse/touch or improve illumination.

The app is buildless. This repository contains its source and assets. GitHub Pages publishes only `dist` through `.github/workflows/pages.yml`; pushing changes to `dist` on `main` redeploys the website. Camera permission may be unavailable inside some embedded previews; open the website directly in Chrome in that case. If tracking models cannot load, mouse/keyboard interaction remains available to experience mist, wiping and the droplet response.

## Project guide / 文件导航

- [INTERACTION.md](INTERACTION.md): the input → response → feedback sequence, demo walkthrough and code map.
- [PROCESS.md](PROCESS.md): design decisions, iteration and AI assistance disclosure.
- [TESTING.md](TESTING.md): automatic checks, my real-camera report, and remaining limits.
- [SOURCES.md](SOURCES.md): artwork, dependencies, model sources and licences.
- [SUBMISSION-CHECKLIST.md](SUBMISSION-CHECKLIST.md): confirmed requirements and remaining hand-in questions.

## Troubleshooting / 常见情况

| Situation | What to do |
|---|---|
| Port 8769 already in use | Keep using the existing app, or run `python3 run.py --port 8770`. A new port has a separate local collection. |
| Camera permission declined | Re-enable the camera in the browser’s site permissions, then press Enable camera; mouse/touch still works. |
| Tracking does not start | Wait for models to load locally, use desktop Chrome, improve front lighting, and keep one hand and face visible. |
| Canvas is clear and strokes seem invisible | Add local mist first by holding Breathe / Space or opening your mouth. |
| Drawing is paused | Press Let it flow after closing the poster or collection. |
| A saved postcard is missing | Return to the same browser profile and URL/port; download images for storage outside the browser. |

## Reproduce the automated checks

Only developers running checks need Node.js 20+ and Playwright. Install the pinned development dependency with `npm install`, start `python3 run.py` in one terminal, then run `npm test` in another. The checks use the installed Google Chrome, an isolated browser profile and a synthetic camera. They create test images; these are ignored by Git. `TEST_URL` can point the checks to a different local port. These are project checks, not the course’s official A3 checker.

## References

[1] MET OFFICE. Dew[EB/OL]. [2026-10-09]. https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/temperature/dew

[2] GOOGLE. Face landmark detection guide for Web[EB/OL]. [2026-10-09]. https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js

[3] GOOGLE. Hand landmarks detection guide for Web[EB/OL]. [2026-10-09]. https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/web_js

[4] NATIONAL GALLERY OF ART. The Japanese Footbridge[EB/OL]. [2026-10-09]. https://www.nga.gov/artworks/74796-japanese-footbridge

[5] NATIONAL GALLERY OF ART. Waterloo Bridge, Gray Day[EB/OL]. [2026-10-09]. https://www.nga.gov/artworks/46658-waterloo-bridge-gray-day
