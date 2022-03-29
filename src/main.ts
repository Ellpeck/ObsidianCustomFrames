import { Plugin, Platform } from "obsidian";
import { CustomFramesSettings, defaultSettings } from "./settings";
import { CustomFramesSettingTab } from "./settings-tab";
import { CustomFrameView } from "./view";

export default class CustomFramesPlugin extends Plugin {

	settings: CustomFramesSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		for (let frame of this.settings.frames) {
			if (!frame.url || !frame.displayName)
				continue;
			let name = `custom-frames-${frame.displayName.toLowerCase().replace(/\s/g, "-")}`;
			if (Platform.isMobileApp && frame.hideOnMobile) {
				console.log(`Skipping frame ${name} which is hidden on mobile`);
				continue;
			}
			try {
				console.log(`Registering frame ${name} for URL ${frame.url}`);

				this.registerView(name, l => new CustomFrameView(l, this.settings, frame, name));
				this.addCommand({
					id: `open-${name}`,
					name: `Open ${frame.displayName}`,
					callback: () => this.openLeaf(name),
				});
			} catch {
				console.error(`Couldn't register frame ${name}, is there already one with the same name?`);
			}
		}

		this.addSettingTab(new CustomFramesSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, defaultSettings, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async openLeaf(name: string): Promise<void> {
		if (!this.app.workspace.getLeavesOfType(name).length)
			await this.app.workspace.getRightLeaf(false).setViewState({ type: name });
		this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(name)[0]);
	}
}