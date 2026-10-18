# Interaction design · 交互说明

Fog at Dusk turns a familiar gesture—breathing on a window and tracing its surface—into a small browser experience. The design intention is a quiet pause with no score, timer to beat or correct drawing. Stress relief is an intention, not an experimentally established effect.

## Input → response → feedback

| Action | System response | Visible feedback |
|---|---|---|
| Open the page | Start with a clear view | Garden preview and invitation to enter |
| Enable camera | Ask permission; process landmarks locally | Mirrored reflection and camera/tracking status. Keep your face and hand in frame; step back slightly if the cursor ring is missing. The camera status distinguishes tracking from preparation. |
| Open mouth | Compare lip opening with a configurable threshold | Soft mist grows near the mapped mouth position |
| Extend index finger and move | Map and interpolate its position onto the glass | A continuous clear trail with damp edges and small beads |
| Bend finger or leave the frame | Lift the virtual drawing point | New marks stop |
| Stay near one position for two seconds | Trigger one droplet until moving to a new position | Progress ring, then a falling drop and thin water trail |
| Press Soft music | Play or pause the local instrumental loop | Button shows whether music is on; it starts off |
| Hold this moment | Pause interaction and freeze the view | Held-state label and Let it flow control |
| Make a poster and type a note | Capture the glass; compose one warm-paper layout | Live preview and a 200-character counter |
| Keep / Export poster | Save a still and message locally; optionally download | Confirmation and a film frame in the collection |

When a different background is shown, face/hand inference pauses and resumes on return to the live camera view.

The poster flow is: choose a background → Hold this moment → Make a poster → type a note → Keep in film collection or Export poster. Warm solid colours make traces easier to read than busy paintings.

The opening of the mouth is a visual proxy for breath. The app does not measure air, touch, temperature or humidity. The camera view is mirrored, and landmarks use the same crop-and-scale mapping. Fingers are not required to physically touch the screen.

## A two-minute demonstration

1. Start the local server and open the page in desktop Chrome. Show that the glass begins clear.
2. Enable the camera. Move your head slightly, open your mouth, then close it. Point out that mist follows the mouth and stays local.
3. Extend one index finger and trace a circle. Bend it to lift, then extend it elsewhere to start a separate stroke.
4. Keep the finger still for about two seconds. Show the progress ring and falling droplet.
5. Choose a background first. Hold this moment, then select Make a poster. Type a note and choose Keep in film collection or Export poster. A warm solid colour makes traces easier to see.
6. Reopen the saved frame from the film collection.

Mouse alternative: hover over the glass and hold Space to create mist; the Breathe button also works while held; drag to wipe; stop while holding the mouse button to release a droplet. No camera is required for this route.

中文要点：先清晰，再局部起雾；伸指擦写、弯指停笔；停留滴水；最后定格、留言、导出。演示时不必展示个人房间或真实人像，可以切换纯色或莫奈背景。

## Code map

| File | Responsibility |
|---|---|
| `dist/index.html`, `dist/style.css` | Controls, English-first text, warm frosted appearance and responsive layout |
| `dist/app.js` | Moisture mask, WebGL glass, feathered traces, droplets, camera lifecycle and export |
| `dist/interaction.js` | Mirrored coordinates, mouth opening, index extension and dwell rule |
| `dist/tracking-worker.js` | Face and hand inference outside the interface thread |
| `dist/poster.js` | Frozen postcard composition, text limit, IndexedDB collection and downloads |
| `run.py` | Local static server using Python’s standard library |

The water rendering is an artistic approximation. A fixed two-second dwell is a legible interaction rule, not a fluid simulation. Opening the editor pauses drawing; closing it leaves the moment held until Let it flow is selected.
