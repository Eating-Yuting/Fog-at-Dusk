# Process and AI assistance · 设计过程与工具说明

Design direction: Eating-Yuting. Implementation support: OpenAI Codex. This account records decisions from the project conversation and local implementation; it is not a claim that all code was written independently by the designer.

## Concept and direction

The designer proposed a virtual misted window for a quiet, expressive interaction: the mouth creates localized fog, the fingertip clears it, and a three-second pause releases a droplet. The requested aesthetic combines warm streetlamp colour, frosted controls and English headings with smaller Chinese support. Postcard-style messages and a filmstrip collection extend the moment beyond drawing.

## What was kept, changed and rejected

- **Kept:** actual hand-drawn trajectories, camera / solid / Monet backgrounds, local image export, warm frosted controls and the two-second droplet after B’s feedback.
- **Changed:** the opening state to a clear window. The designer explicitly requested that mist emerge only around the mouth instead of covering the whole screen from the start.
- **Changed after feedback:** the designer described tracing as stiff and insufficiently watery. The implementation replaced repeated gradient creation with a cached feathered tip, removed the fixed 30 Hz display cap, interpolated hand targets, and added edge beads and thin sliding trails. Long mouse movements now connect continuously.
- **Added:** one portrait postcard layout, a message of up to 200 visible characters, local PNG/JPG exports, and a browser-local film collection. One template keeps the first version focused.
- **Rejected for this version:** mandatory accounts, paid generation APIs, automatic uploading and unnecessary image generation. They are not needed for the selected interaction.

## Classmate trial and response

On 2026-10-18, one classmate (A) tried the public experience. Their identity is not recorded here; no camera recording was provided or needed for this review. Their first camera start felt slow; refreshing the page made the next start smoother. They initially thought they should move closer, then stepped back until the on-screen cursor ring appeared. They said the guide helped, but asked whether the poster sequence was: hold the scene, make a poster, then write a note. They found traces and droplets easier to see on a solid colour than over either painting, preferred the Fine trace width, and described the first drops as pearl-like. After leaving another background on for a while, returning to the camera view appeared to freeze; refreshing recovered it. Network delay was the classmate’s hypothesis, not an established cause.

In response, camera landmark inference now pauses while a non-camera background is shown and resumes on return, reducing unnecessary work while the scene is hidden. The default trace width is Fine, and the large droplet’s highlight and proportions are softened to reduce its pearl-like look. The guide now explains camera framing, the circle cue and the poster sequence, and recommends a solid background when the marks need more contrast. These changes are a first response to one trial; the affected interactions still need another user check.

On 2026-10-18, a second classmate (B) said the breath interaction was unclear: several attempts produced no visible mist until they adjusted sensitivity or found the manual mist control. They suggested shortening the droplet wait and adding soothing instrumental music. The interface now labels the manual control as “Hold to mist” and explains how to adjust sensitivity; the droplet dwell is two seconds. The designer selected a gentle piano loop from OpenGameArt; it is bundled as a local asset with CC0 evidence in SOURCES.md. Playback is optional, starts only after a click, and is off by default. The breathing and droplet changes have not been user-tested.

## Role of AI

The designer supplied the concept, visual references, interaction rules and revisions, and tested the real-camera experience. Codex assisted with JavaScript/CSS/HTML/Python implementation, documentation, source lookup and Playwright checks. The project notes the adopted implementation choice—locally bundled face/hand landmarks with a mouse fallback—and a design direction changed after review: replacing an all-over foggy opening with clear glass and localized mouth mist. Before hand-in, the designer should add one specific AI suggestion she kept and one she changed or rejected, in her own words; the available record does not establish a precise example pair, so none is invented here. The shipped interface is built from code; the two background paintings are museum images with credited sources. MediaPipe provides pretrained landmark models; these models were not trained by the designer.

Reference screenshots informed broad qualities such as frosted surfaces, paper margins and film perforations. Those screenshots, advertisements, QR codes and unknown-source photos are not redistributed in the project. The resulting layout is implemented as a new composition.

## Evidence and limitations

Automated checks cover the interaction rules and export/storage behaviour. On 2026-10-09, the designer explicitly reported completing four real-camera checks successfully: mouth-position mist, a traced circle, bent-finger lift and the three-second droplet. No recording was requested or captured for that report, and device/browser/lighting details were not supplied. This is a functional self-test, not an independent multi-person study or a latency measurement.

Future evaluation should compare usability under varied lighting and with other people. Mouth opening remains a proxy for breath; the project makes no measured wellbeing claim. The designer later supplied the full Canvas Assignment 3 brief and marking criteria. This project review follows that version.

中文摘要：构想、审美和修改方向由Eating-Yuting提出，代码与检查由 Codex 辅助；真人四项功能测试已由Eating-Yuting确认。没有伪造测试数据或开发历史。
