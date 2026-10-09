# Process and AI assistance · 设计过程与工具说明

Design direction: Eating-Yuting. Implementation support: OpenAI Codex. This account records decisions from the project conversation and local implementation; it is not a claim that all code was written independently by the designer.

## Concept and direction

The designer proposed a virtual misted window for a quiet, expressive interaction: the mouth creates localized fog, the fingertip clears it, and a three-second pause releases a droplet. The requested aesthetic combines warm streetlamp colour, frosted controls and English headings with smaller Chinese support. Postcard-style messages and a filmstrip collection extend the moment beyond drawing.

## What was kept, changed and rejected

- **Kept:** actual hand-drawn trajectories, camera / solid / Monet backgrounds, local image export, warm frosted controls and the three-second droplet.
- **Changed:** the opening state to a clear window. The designer explicitly requested that mist emerge only around the mouth instead of covering the whole screen from the start.
- **Changed after feedback:** the designer described tracing as stiff and insufficiently watery. The implementation replaced repeated gradient creation with a cached feathered tip, removed the fixed 30 Hz display cap, interpolated hand targets, and added edge beads and thin sliding trails. Long mouse movements now connect continuously.
- **Added:** one portrait postcard layout, a message of up to 200 visible characters, local PNG/JPG exports, and a browser-local film collection. One template keeps the first version focused.
- **Rejected for this version:** mandatory accounts, paid generation APIs, automatic uploading and unnecessary image generation. They are not needed for the selected interaction.

## Role of AI

The designer supplied the concept, visual references, interaction rules and revisions, and tested the real-camera experience. Codex assisted with JavaScript/CSS/HTML/Python implementation, documentation, source lookup and Playwright checks. The shipped interface is built from code; the two background paintings are museum images with credited sources. MediaPipe provides pretrained landmark models; these models were not trained by the designer.

Reference screenshots informed broad qualities such as frosted surfaces, paper margins and film perforations. Those screenshots, advertisements, QR codes and unknown-source photos are not redistributed in the project. The resulting layout is implemented as a new composition.

## Evidence and limitations

Automated checks cover the interaction rules and export/storage behaviour. On 2026-10-09, the designer explicitly reported completing four real-camera checks successfully: mouth-position mist, a traced circle, bent-finger lift and the three-second droplet. No recording was requested or captured for that report, and device/browser/lighting details were not supplied. This is a functional self-test, not an independent multi-person study or a latency measurement.

Future evaluation should compare usability under varied lighting and with other people. Mouth opening remains a proxy for breath; the project makes no measured wellbeing claim. The designer confirmed that the teacher’s open-ended message is the current assignment brief. This project follows that brief; no additional marking criteria, tools or documentation requirements are invented.

中文摘要：构想、审美和修改方向由Eating-Yuting提出，代码与检查由 Codex 辅助；真人四项功能测试已由Eating-Yuting确认。没有伪造测试数据或开发历史。
