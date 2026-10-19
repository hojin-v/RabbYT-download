#!/usr/bin/env python3
"""Render README artwork from the existing landing page assets and phone mockups.

Setup: python -m pip install playwright && playwright install chromium
Run: python scripts/render_readme.py [--browser /path/to/chromium]
"""

import argparse
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "readme"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", help="Use an existing Chromium executable")
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        options = {"headless": True}
        if args.browser:
            options["executable_path"] = args.browser
        browser = playwright.chromium.launch(**options)
        page = browser.new_page(viewport={"width": 1600, "height": 900}, device_scale_factor=1)
        page.route("https://**/*", lambda route: route.abort())
        # File URLs keep this render independent of live release APIs and accounts.
        page.goto((ROOT / "index.html").as_uri(), wait_until="load")
        phones = page.locator(".hero-phone").evaluate_all("nodes => nodes.map(node => node.outerHTML)")
        assert len(phones) == 3
        page.evaluate("""({logo, phones}) => {
          document.querySelectorAll('script').forEach(node => node.remove());
          document.body.innerHTML = `
            <section class="readme-banner">
              <div class="readme-banner-copy">
                <div class="readme-wordmark">Rabb<span>YT</span></div>
                <h1>마음에 든 링크를 내 파일로.<br>저장한 음악을 내 플레이어로.</h1>
                <p>스트림 · 내 음악 · 영상·음원·사진 추출</p>
                <div class="readme-address">rabbyt.ive.codes <span>Android</span></div>
              </div>
              <img class="readme-logo" src="${logo}" alt="RabbYT 로고">
            </section>
            <section class="readme-screens">
              ${phones.map((phone, index) => `<div class="readme-screen">
                <div class="readme-screen-label">${['01 / STREAM', '02 / LIBRARY', '03 / EXTRACTOR'][index]}</div>
                ${phone}
              </div>`).join('')}
            </section>`;
        }""", {"logo": (ROOT / "assets" / "RabbYT_logo_embedded.svg").as_uri(), "phones": phones})
        page.add_style_tag(content="""
          *, *::before, *::after { animation: none !important; transition: none !important; }
          body { min-width: 0; background: #090a0d; }
          .readme-banner {
            width: 1600px; height: 560px; padding: 64px 88px;
            display: flex; align-items: center; justify-content: space-between;
            background: radial-gradient(ellipse at 90% 36%, #431116 0%, transparent 54%), #090a0d;
            border: 1px solid #25252c; border-radius: 28px; overflow: hidden;
          }
          .readme-wordmark { font-size: 64px; font-weight: 900; letter-spacing: -3px; }
          .readme-wordmark span { color: #ff2d35; }
          .readme-banner h1 {
            margin: 24px 0 22px; color: #fffaf3; font-size: 43px; line-height: 1.5;
            letter-spacing: -1.5px; font-weight: 750; text-shadow: none;
          }
          .readme-banner p { margin: 0; color: #aeb4c2; font-size: 23px; }
          .readme-address {
            margin-top: 38px; color: #e7eaf0; font-size: 21px;
            display: flex; align-items: center; gap: 18px;
          }
          .readme-address span {
            font-size: 14px; border: 1px solid #584149; padding: 6px 12px;
            border-radius: 30px; color: #ff969b;
          }
          .readme-logo { width: 400px; height: 400px; object-fit: contain; margin-right: 24px; }
          .readme-screens { width: 1160px; padding: 30px 20px; display: flex; gap: 26px; }
          .readme-screen { width: 356px; }
          .readme-screen-label {
            text-align: center; font-size: 14px; letter-spacing: 2px; color: #aeb4c2; margin-bottom: 20px;
          }
          .readme-screen .hero-phone {
            display: block; position: relative; top: auto; right: auto; transform: none;
            opacity: 1; width: 356px; min-width: 0; height: 684px; aspect-ratio: auto;
            padding: 14px; margin: 0; box-shadow: none;
          }
          .readme-screen .hero-phone .app-screen { height: 620px; }
          .readme-screen .hero-phone .nav-bar { bottom: 0; }
        """)
        page.evaluate("async () => { await document.fonts.ready; await Promise.all(Array.from(document.images).map(image => image.decode())); }")
        assert page.locator("img").evaluate_all("images => images.every(image => image.complete && image.naturalWidth > 0)")
        page.locator(".readme-banner").screenshot(path=str(OUTPUT / "rabbyt-banner.png"))
        for name, phone in zip(("stream", "library", "extractor"), page.locator(".readme-screen").all()):
            phone.screenshot(path=str(OUTPUT / f"{name}.png"))
        browser.close()
    print(f"README artwork rendered to {OUTPUT}")


if __name__ == "__main__":
    main()
