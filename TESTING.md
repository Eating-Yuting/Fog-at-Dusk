# Test record · 测试记录

Date: 2026-10-09. Two kinds of evidence are kept separate.

## Real-camera check — designer report

The designer explicitly confirmed: “已经实测，四项都正常” (already tested; all four work normally).

| Task | Reported result |
|---|---|
| Open the mouth; verify mist appears at its corresponding position | Passed, designer report |
| Extend the index finger and draw a circle; check for obvious lag or broken tracing | Passed, designer report; no measured latency |
| Bend the index finger to stop drawing | Passed, designer report |
| Stay near one position for about three seconds; verify a falling drop | Passed, designer report |

This was one designer’s functional check. The assistant did not observe or record the camera feed. Browser version, hardware, lighting and repetition count were not collected. Generalization to other people and devices is not established.

## Automated browser checks

`check.mjs` checks initial transparency, local mist, fast continuous wiping, the three-second trigger, hold/resume, background changes, PNG/JPG downloads, model initialization, camera shutdown and 390px layout.

`check-poster.mjs` checks edge beads, a frozen snapshot, 200-grapheme text limiting, 1200 × 1800 PNG and JPG output, collection persistence, re-opening messages, no duplicate frame on re-save, mobile layout and download fallback when storage is unavailable.

The checks run in isolated Chrome profiles. Camera testing uses a synthetic video source. They assert no uncaught page errors and no application requests to external hosts. Browser camera permissions are not a recording or upload feature.

Earlier synthetic garden-scene sampling recorded 16.7 ms median and 16.8 ms 95th-percentile animation intervals. These are animation callback intervals under that test setup, not real-camera response latency or a universal 60 fps guarantee. Detailed results are in [VALIDATION.md](VALIDATION.md).

## Optional follow-up checks

These are suggested quality checks, not claimed course requirements: try a second person; front light versus dim light; hand briefly leaving the frame; camera permission denied; and repeated camera start/stop. Do not mark them passed without testing. Test images shipped in `images/` use public-domain paintings and synthetic marks, not private camera imagery.

中文：真人四项通过来自糯糯反馈；自动检查另有记录。弱光、其他人及不同浏览器未做全面验证。
