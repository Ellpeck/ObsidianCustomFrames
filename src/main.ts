import { Plugin, Platform, WorkspaceLeaf } from "obsidian";
import { CustomFrame } from "./frame";
import { CustomFramesSettings, defaultSettings, getIcon, getId } from "./settings";
import { CustomFramesSettingTab } from "./settings-tab";
import { CustomFrameView } from "./view";

export default class CustomFramesPlugin extends Plugin {

	settings: CustomFramesSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		for (let frame of this.settings.frames) {
			if (!frame.url || !frame.displayName)
				continue;
			let name = `custom-frames-${getId(frame)}`;
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
					callback: () => this.openLeaf(name, frame.openInCenter, false),
				});

				if (frame.addRibbonIcon)
					this.addRibbonIcon(getIcon(frame), `Open ${frame.displayName}`,
						e => this.openLeaf(name, frame.openInCenter, Platform.isMacOS ? e.metaKey : e.ctrlKey));
			} catch {
				console.error(`Couldn't register frame ${name}, is there already one with the same name?`);
			}
		}

		this.addSettingTab(new CustomFramesSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor("custom-frames", (s, e) => {
			e.empty();
			e.addClass("custom-frames-view-file");

			let frameMatch = /frame:([^\n]+)/gi.exec(s);
			let frameName = frameMatch && frameMatch[1].trim();
			if (!frameName) {
				e.createSpan({ text: "Couldn't parse frame name" });
				return;
			}
			let data = this.settings.frames.find(f => f.displayName == frameName);
			if (!data) {
				e.createSpan({ text: `Couldn't find a frame with name ${frameName}` });
				return;
			}
			if (Platform.isMobileApp && data.hideOnMobile) {
				e.createSpan({ text: `${frameName} is hidden on mobile` });
				return;
			}

			let styleMatch = /style:([^\n]+)/gi.exec(s);
			let style = styleMatch && styleMatch[1].trim();
			style ||= "height: 600px;";

			let urlSuffixMatch = /urlsuffix:([^\n]+)/gi.exec(s);
			let urlSuffix = urlSuffixMatch && urlSuffixMatch[1].trim();
			urlSuffix ||= "";

			let frame = new CustomFrame(this.settings, data);
			frame.create(e, style, urlSuffix);
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, defaultSettings, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async openLeaf(name: string, center: boolean, split: boolean): Promise<void> {
		let leaf: WorkspaceLeaf;
		if (center) {
			leaf = this.app.workspace.getLeaf(split);
			await leaf.setViewState({ type: name, active: true });
		} else {
			if (!this.app.workspace.getLeavesOfType(name).length)
				await this.app.workspace.getRightLeaf(false).setViewState({ type: name, active: true });
			leaf = this.app.workspace.getLeavesOfType(name)[0];
			this.app.workspace.revealLeaf(leaf);
		}
		if (leaf.view instanceof CustomFrameView)
			leaf.view.focus();
	}
}
