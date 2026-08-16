# Signal

Static host for the Signal daily brief, a personal news feed generated each morning and
served as a progressive web app.

`data/` holds one JSON file per run, named by date. `baseline/` holds the reference set
each run is scored against. `index.html`, `sw.js` and `manifest.webmanifest` are the app
shell, which reads the newest file in `data/` and caches it for offline reading.

The generation pipeline runs as a scheduled task on a local machine and is not in this repo.
