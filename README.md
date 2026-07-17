# Markdown Pro

An installable, offline-capable markdown forecast calculator designed for a mobile browser.

## What it calculates

- **Current damage dollars** = WTD sales x current damaged %
- **Damage target dollars** = (WTD sales + today's plan + forecast adjustment) x 0.83%
- **Damage room** = damage target dollars - current damage dollars
- **Current store markdown dollars** = WTD sales x current store total markdown %
- **Forecast store markdown dollars** = current store markdown dollars + any damage dollars needed to reach the 0.83% target
- **Store markdown budget** = forecast sales x editable markdown budget %
- **Budget room** = store markdown budget - forecast store markdown dollars

Positive room means the store is under the respective target; a negative value means it is over. If damage is already over target, the forecast does not subtract markdown dollars.

## Use

1. Open `index.html` in a browser, or deploy the folder to GitHub Pages.
2. Enter WTD sales, today's sales plan, current damaged %, current store total markdown %, and the desired budget %.
3. Move the slider to forecast a finish from $50,000 under plan to $50,000 over plan.
4. On iPhone, visit the hosted site in Safari and choose **Share > Add to Home Screen**.

Values are saved only in the current browser on the current device. The app works offline after its first successful hosted load.

## GitHub Pages

Create a public repository, upload the contents of this folder to its root, then go to **Settings > Pages** and deploy the `main` branch from `/ (root)`. Open the resulting URL in Safari.

## Important

This is a forecast calculator and does not replace official reporting or store policy.
