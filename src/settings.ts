import Slyde from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class SettingTab extends PluginSettingTab {
    plugin: Slyde;

    constructor(app: App, plugin: Slyde) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName("Default Width")
            .setDesc("The default editor width in pixels")
            .addSlider(cb => {
                const { min, step } = this.plugin.settings;
                const max = window.screen.width;

                cb.setDynamicTooltip();
                cb.setLimits(min, max, step);
                cb.setValue(this.plugin.settings.defaultWidth);

                cb.onChange(value => {
                    this.plugin.settings.defaultWidth = value;
                    this.plugin.updateEditorWidth(value);
                    this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName("Persist Width")
            .setDesc("Keep the editor width fixed, even when the window is resized smaller")
            .addToggle(cb => {
                cb.setValue(this.plugin.settings.persistentWidth);

                cb.onChange(value => {
                    this.plugin.settings.persistentWidth = value;
                    this.plugin.saveSettings();
                });
            });
    }
}
