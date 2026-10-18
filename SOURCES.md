# Sources and third-party notices · 素材来源

Checked: 2026-10-18. Asset integrity hashes are recorded in `ASSET-MANIFEST.json`. The third-party JavaScript, WASM, model weights and museum images are bundled locally and are not fetched during normal use.

## Paintings

| Local file | Artist and work | Source and credit |
|---|---|---|
| `dist/assets/monet-water-lilies.jpg` | Claude Monet, *The Japanese Footbridge*, 1899 | National Gallery of Art; Gift of Victoria Nebeker Coberly, in memory of her son John W. Mudd, and Walter H. and Leonore Annenberg [1] |
| `dist/assets/monet-bridge.jpg` | Claude Monet, *Waterloo Bridge, Gray Day*, 1903 | National Gallery of Art; Chester Dale Collection [2] |

Both museum object pages identify their media as public domain. These are reduced-resolution museum downloads, not AI-generated paintings. The first filename is legacy naming; its title is *The Japanese Footbridge*, not *Water Lilies*. The experience crops the selected painting to fill its glass viewport and applies its warm light/mist effect. Poster export fits the already-composed glass image without additional cropping.

Original image download endpoints:

- https://api.nga.gov/iiif/0b9cefb5-1ee4-401a-8154-8d4039191a28/full/1600,/0/default.jpg
- https://api.nga.gov/iiif/5f0f2f71-1428-4fc7-a951-0fab4fe39ffd/full/1600,/0/default.jpg

## City background

| Local file | Image | Source and rights |
|---|---|---|
| dist/assets/hong-kong-dusk.png | Hong Kong harbour at dusk | GPT-generated image supplied by the designer; the darker, warmer version in this project was also made with GPT image editing. No third-party source is indicated; this asset is not labelled CC0. |

## Tracking software and models

| Asset | Upstream version/source | Licence evidence |
|---|---|---|
| `vision_bundle.mjs` and four `wasm/vision_wasm*` files | `@mediapipe/tasks-vision` 0.10.14, unchanged local copies [3] | Package declares Apache-2.0; upstream licence is included as `dist/assets/LICENSE-mediapipe.txt` [4] |
| `models/face.task` | Google MediaPipe Face Landmarker float16, version 1 [5] | Face detector, FaceMesh V2 and blendshape model cards each state Apache 2.0 [7–9] |
| `models/hand.task` | Google MediaPipe Hand Landmarker float16, version 1 [6] | Hand tracking model card states Apache 2.0 [10] |

Model download endpoints:

- https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task
- https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task

The original upstream licence text is preserved verbatim, including its own standard appendix and additional notices. Its template fields are part of that licence, not unfinished coursework. This notice does not apply a new licence to the designer’s original work.

## Music

| Local file | Track | Source and licence |
|---|---|---|
| `dist/assets/forget-me-not-loop.ogg` | *Forget Me Not* by Kistol; looped OGG version | OpenGameArt; marked CC0, attribution optional [11] |

The track is bundled locally and plays only when the user turns it on. The author and source are recorded here even though CC0 does not require attribution.

## Other visual material and tools

Glass, water highlights, paper texture, layout and film perforations are rendered in original project code with AI implementation assistance. System fonts are requested through CSS/canvas; no font files are redistributed. Designer-supplied reference screenshots informed the visual direction but are excluded from the package because their original sources were not established. Images in `images/` are application screenshots using credited museum backgrounds and synthetic marks, not camera portraits or third-party reference screenshots.

Playwright is used only for developer checks; its version is pinned in `package.json`. No Playwright binaries, Node modules, private user data, course keys, Stable Diffusion weights or API-generated media are included in this submission package.

中文：画作来自 NGA 公共领域图像；追踪使用 Google MediaPipe，附上游许可。参考图不作为素材打包，程序不需要课程密钥。

## References

[1] NATIONAL GALLERY OF ART. The Japanese Footbridge[EB/OL]. [2026-10-09]. https://www.nga.gov/artworks/74796-japanese-footbridge

[2] NATIONAL GALLERY OF ART. Waterloo Bridge, Gray Day[EB/OL]. [2026-10-09]. https://www.nga.gov/artworks/46658-waterloo-bridge-gray-day

[3] GOOGLE. MediaPipe Tasks Vision 0.10.14: package metadata[EB/OL]. [2026-10-09]. https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/package.json

[4] GOOGLE. MediaPipe v0.10.14: licence[EB/OL]. [2026-10-09]. https://raw.githubusercontent.com/google-ai-edge/mediapipe/v0.10.14/LICENSE

[5] GOOGLE. Face landmark detection guide[EB/OL]. [2026-10-09]. https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker

[6] GOOGLE. Hand landmarks detection guide[EB/OL]. [2026-10-09]. https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker

[7] GOOGLE. MediaPipe BlazeFace Model Card (Short Range)[EB/OL]. [2026-10-09]. https://storage.googleapis.com/mediapipe-assets/MediaPipe%20BlazeFace%20Model%20Card%20%28Short%20Range%29.pdf

[8] GOOGLE. Model Card: MediaPipe Face Mesh V2[EB/OL]. [2026-10-09]. https://storage.googleapis.com/mediapipe-assets/Model%20Card%20MediaPipe%20Face%20Mesh%20V2.pdf

[9] GOOGLE. Model Card: Blendshape V2[EB/OL]. [2026-10-09]. https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Blendshape%20V2.pdf

[10] GOOGLE. Model Card: Hand Tracking (Lite/Full) with Fairness[EB/OL]. [2026-10-09]. https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Hand%20Tracking%20%28Lite_Full%29%20with%20Fairness%20Oct%202021.pdf

[11] KISTOL. Forget Me Not[EB/OL]. [2026-10-18]. https://opengameart.org/content/forget-me-not
