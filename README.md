# Slyde

An [Obsidian](https://obsidian.md) plugin that lets you **dynamically adjust the readable line length** of your notes with a simple slider in the status bar.

## Features

* **Adjustable editor width** — use a slider in the status bar to set your preferred line length.
* **Persistent width** — optionally keep your chosen width even when the window is resized.
* **Default width setting** — configure a default width applied on startup.
* **One-click reset** — click the width label in the status bar to reset to your default width.
* **Customizable settings** — control min, max, step, and persistence behavior in plugin options.

## Overview

Slyde adds a **slider + width label** to the status bar:

* Drag the slider to adjust note width in real-time.

### Obsidian Note with 500px Width

![500px Width](images/500px%20Width.png)

### Obsidian Note with Max Width

![Max Width](images/Max%20Width.png)

* Click the label (e.g., `1000px`) to reset to your default width.

![Slider Up Close](images/Slider%20Up%20Close.png)

## Settings

Accessible from **Settings → Community Plugins → Slyde**:

* **Default Width**: The starting line length in pixels.
* **Persist Width**: Keep your editor width fixed, even when Obsidian is resized smaller.

## Installation

### From Obsidian Community Plugins (when published)

1. Open **Settings → Community Plugins → Browse**.
2. Search for **Slyde**.
3. Install and enable.

### Manual

1. Clone this repository.
2. Run `npm install` and then `npm run build`.
3. Copy the `main.js`, `manifest.json`, and `styles.css` files into your Obsidian vault’s `.obsidian/plugins/slyde` folder.
4. Enable the plugin from **Settings → Community Plugins**.


## License

This project is licensed under the [MIT License](./LICENSE).
