# Test record · 测试记录

Date: 2026-10-09. Two kinds of evidence are kept separate.

## My real-camera check

I confirmed: “已经实测，四项都正常” (I tested all four; they worked normally).

| Task | Reported result |
|---|---|
| Open the mouth; verify mist appears at its corresponding position | Passed, my report |
| Extend the index finger and draw a circle; check for obvious lag or broken tracing | Passed, my report; no measured latency |
| Bend the index finger to stop drawing | Passed, my report |
| Stay near one position for about two seconds; verify a falling drop | Passed, my report |

This was my own functional check. Codex did not observe or record my camera feed. Browser version, hardware, lighting and repetition count were not collected. Generalization to other people and devices is not established.

## Automated browser checks

`check.mjs` checks initial transparency, local mist, fast continuous wiping, the two-second trigger, hold/resume, background changes, PNG/JPG downloads, model initialization, camera shutdown and 390px layout.

`check-poster.mjs` checks edge beads, a frozen snapshot, 200-grapheme text limiting, 1200 × 1800 PNG and JPG output, collection persistence, re-opening messages, no duplicate frame on re-save, mobile layout and download fallback when storage is unavailable.

The checks run in isolated Chrome profiles. Camera testing uses a synthetic video source. They assert no uncaught page errors and no application requests to external hosts. Browser camera permissions are not a recording or upload feature.

Earlier synthetic garden-scene sampling recorded 16.7 ms median and 16.8 ms 95th-percentile animation intervals. These are animation callback intervals under that test setup, not real-camera response latency or a universal 60 fps guarantee. Detailed results are in [VALIDATION.md](VALIDATION.md).

## Optional follow-up checks

On 2026-10-18, one classmate tried the public site; their observations are recorded in PROCESS.md. The camera-return change and new guidance still need follow-up testing. The optional local music control has not been checked. Also test front light versus dim light, hand briefly leaving the frame, denied camera permission and repeated camera start/stop. Do not mark them passed without testing. Test images shipped in `images/` use public-domain paintings and synthetic marks, not private camera imagery.

中文：真人四项通过来自Eating-Yuting反馈；自动检查另有记录。弱光、更多参与者及不同浏览器尚未全面验证；摄像头切回和新版提示等待复测。
