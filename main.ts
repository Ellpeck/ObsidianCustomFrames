import { App, ItemView, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { remote, webContents } from 'electron';

const viewName: string = "keep";
const defaultSettings: KeepSettings = {
	minimumWidth: 360,
	padding: 5,
	css: `/* hide the menu bar and the "Keep" logo and text */
.PvRhvb-qAWA2, .gb_qc { 
	display: none !important; 
}

/* remove the margin around each note so that less horizontal space is taken up */
.kPTQic-nUpftc .ma6Yeb-r8s4j-gkA7Yd .IZ65Hb-n0tgWb { 
	margin: 0px !important; 
}
.kPTQic-nUpftc .h1U9Be-xhiy4 {
    margin: 16px 0px 8px 0px !important;
}`
};

interface KeepSettings {
	minimumWidth: number;
	padding: number;
	css: string;
}

export default class KeepPlugin extends Plugin {

	settings: KeepSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerView(viewName, l => new KeepView(l, this.settings));
		this.addCommand({
			id: "open-keep",
			name: "Open Keep",
			checkCallback: (checking: boolean) => {
				if (checking)
					return !this.app.workspace.getLeavesOfType(viewName).length;
				this.openKeep();
			},
		});
		this.addSettingTab(new KeepSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(() => this.openKeep());
	}

	private openKeep(): void {
		if (!this.app.workspace.getLeavesOfType(viewName).length)
			this.app.workspace.getRightLeaf(false).setViewState({ type: viewName });
	}

	async loadSettings() {
		this.settings = Object.assign({}, defaultSettings, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class KeepView extends ItemView {

	private settings: KeepSettings;

	constructor(leaf: WorkspaceLeaf, settings: KeepSettings) {
		super(leaf);
		this.settings = settings;
	}

	onload(): void {
		this.contentEl.empty();
		this.contentEl.addClass("obsidian-keep-view");

		let frame = this.contentEl.createEl("iframe");
		frame.setAttribute("style", `padding: ${this.settings.padding}px`);
		frame.addClass("obsidian-keep-frame");
		frame.onload = () => {
			for (let other of remote.getCurrentWebContents().mainFrame.frames) {
				if (frame.src.contains(new URL(other.url).host)) {
					other.executeJavaScript(`
						let style = document.createElement("style");
						style.textContent = \`${this.settings.css}\`;
						document.head.appendChild(style);
					`);
				}
			}

			if (this.settings.minimumWidth) {
				let parent = this.contentEl.closest<HTMLElement>(".workspace-split.mod-horizontal");
				if (parent) {
					let minWidth = `${this.settings.minimumWidth + 2 * this.settings.padding}px`;
					if (parent.style.width < minWidth)
						parent.style.width = minWidth;
				}
			}
		};
		frame.src = "https://keep.google.com";
	}

	getViewType(): string {
		return viewName;
	}

	getDisplayText(): string {
		return "Google Keep";
	}

	getIcon(): string {
		return "documents";
	}
}

class KeepSettingTab extends PluginSettingTab {

	plugin: KeepPlugin;

	constructor(app: App, plugin: KeepPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();
		this.containerEl.createEl('h2', { text: 'Obsidian Keep Settings' });

		new Setting(this.containerEl)
			.setName("Minimum View Width")
			.setDesc("The width that the Google Keep view should be adjusted to automatically if it is lower. Set to 0 to disable.")
			.addText(t => {
				t.inputEl.type = "number";
				t.setValue(String(this.plugin.settings.minimumWidth));
				t.onChange(async v => {
					this.plugin.settings.minimumWidth = v.length ? Number(v) : defaultSettings.minimumWidth;
					await this.plugin.saveSettings();
				});
			});
		new Setting(this.containerEl)
			.setName("View Padding")
			.setDesc("The padding that should be left around the inside of the Google Keep view, in pixels.")
			.addText(t => {
				t.inputEl.type = "number";
				t.setValue(String(this.plugin.settings.padding));
				t.onChange(async v => {
					this.plugin.settings.padding = v.length ? Number(v) : defaultSettings.padding;
					await this.plugin.saveSettings();
				});
			});
		new Setting(this.containerEl)
			.setName("Additional CSS")
			.setDesc("A snippet of additional CSS that should be applied to the Google Keep embed. By default, this hides a lot of unnecessary information to make the embed take up less horizontal space.")
			.addTextArea(t => {
				t.inputEl.rows = 10;
				t.inputEl.cols = 50;
				t.setValue(this.plugin.settings.css);
				t.onChange(async v => {
					this.plugin.settings.css = v.length ? v : defaultSettings.css;
					await this.plugin.saveSettings();
				});
			});
	}
}