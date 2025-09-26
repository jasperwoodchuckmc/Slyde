import { Plugin } from "obsidian";
import { SettingTab } from "./settings";

interface Settings {
	currentWidth: number;
	defaultWidth: number;
	persistentWidth: boolean;
	min: number;
	max: number;
	step: number;
}

export const DefaultSettings: Partial<Settings> = {
	defaultWidth: 700,
	persistentWidth: true,
	min: 500,
	max: window.screen.width,
	step: 10,
};

export default class Slyde extends Plugin {
	settings: Settings;
	resizeTimeout: number;

	async onload() {
		await this.loadSettings();

		if (this.settings.currentWidth == null) {
			this.settings.currentWidth = this.settings.defaultWidth;
		}

		this.addSettingTab(new SettingTab(this.app, this));

		if (!document.getElementById("slyde-css")) {
			const css = document.createElement("style");
			css.id = "slyde-css";
			document.head.appendChild(css);
		}

		this.updateEditorWidth(this.settings.currentWidth);

		this.app.workspace.onLayoutReady(() => {
			const content = this.getContent();

			this.addSliderToStatusBar();

			const slider = this.getSlider();
			const button = this.getButton();

			let rawMax = content.clientWidth - 64;
			slider.max = rawMax.toString();
			this.settings.max = rawMax;

			button.textContent = `${this.settings.currentWidth}px`;
			slider.value = String(this.settings.currentWidth);

			this.registerOnResize();
		});
	}

	getContent(): HTMLElement {
		const leaf = this.app.workspace.getLeaf();

		const container = (leaf.getContainer() as any).containerEl as HTMLElement | null;
		const content = container?.querySelector(".view-content") as HTMLElement | null;

		if (!content) throw new Error("No view-content found!");
		return content;
	}

	getSlider(): HTMLInputElement {
		const slider = document.getElementById("slyde-slider") as HTMLInputElement | null;
		if (!slider) throw new Error("No slyde-slider found!");
		return slider;
	}


	getButton(): HTMLDivElement {
		const button = document.getElementById("slyde-button") as HTMLDivElement | null;
		if (!button) throw new Error("No slyde-button found!");
		return button;
	}

	registerOnResize() {
		const content = this.getContent();
		const slider = this.getSlider();
		const button = this.getButton();

		let rawMax = content.clientWidth - 64;

		this.registerEvent(
			this.app.workspace.on("resize", () => {
				clearTimeout(this.resizeTimeout);
				this.resizeTimeout = window.setTimeout(() => {
					rawMax = content.clientWidth - 64;
					slider.max = rawMax.toString();

					if (this.settings.persistentWidth) {
						slider.value = String(this.settings.currentWidth);
						button.textContent = `${this.settings.currentWidth}px`;
						this.updateEditorWidth(this.settings.currentWidth);
						return;
					}

					if (this.settings.currentWidth > rawMax) {
						this.settings.currentWidth = rawMax;
						slider.value = String(rawMax);
						button.textContent = `${rawMax}px`;
						this.updateEditorWidth(rawMax);
						this.saveSettings();
					}
				}, 100);
			})
		);
	}

	onunload() {
		document.getElementById("slyde-css")?.remove();
	}

	async loadSettings() {
		this.settings = {
			...DefaultSettings,
			...await this.loadData()
		} as Settings;

	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	addSliderToStatusBar() {
		const { min, max, currentWidth, step } = this.settings;

		const statusBarEl = this.addStatusBarItem();
		statusBarEl.empty();

		const slider = document.createElement("input");
		slider.id = "slyde-slider";
		slider.type = "range";
		slider.min = String(min);
		slider.max = String(max);
		slider.value = String(currentWidth);
		slider.step = String(step);

		const button = document.createElement("div");
		button.id = "slyde-button";
		button.textContent = `${currentWidth}px`;

		statusBarEl.appendChild(slider);
		statusBarEl.appendChild(button);

		button.addEventListener("click", () => {
			const defaultWidth = this.settings.defaultWidth;

			this.settings.currentWidth = defaultWidth;
			slider.value = String(defaultWidth);
			button.textContent = `${defaultWidth}px`;
			this.updateEditorWidth(defaultWidth);
			this.saveSettings();
		});

		slider.addEventListener("input", (e) => {
			const val = Number((e.target as HTMLInputElement).value);
			button.textContent = `${val}px`;
			this.updateEditorWidth(val);
		});

		slider.addEventListener("change", () => {
			this.settings.currentWidth = Number(slider.value);
			this.saveSettings();
		});
	}

	updateEditorWidth(width: number) {
		const styleElement = document.getElementById("slyde-css");
		if (!styleElement) throw new Error("slyde-css element not found!");

		styleElement.innerText = `
            body {
                --line-width: ${width}px !important;
                --file-line-width: ${width}px !important;
            }
        `;
	}
}
