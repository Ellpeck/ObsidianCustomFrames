import { App, ItemView, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { BrowserView, remote } from 'electron';

const viewName: string = "keep";
const defaultSettings: KeepSettings = {
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
}

interface KeepSettings {
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
	private keep: BrowserView;
	private visible: boolean;
	private open: boolean;
	private size: DOMRect;

	constructor(leaf: WorkspaceLeaf, settings: KeepSettings) {
		super(leaf);
		this.settings = settings;
	}

	async onload(): Promise<void> {
		this.keep = new remote.BrowserView();
		await this.keep.webContents.loadURL('https://keep.google.com');
		await this.keep.webContents.insertCSS(this.settings.css);
		this.registerInterval(window.setInterval(() => this.update(), 33.33));
	}

	onunload(): void {
		this.hide();
	}

	onResize(): void {
		this.resizeIfNecessary();
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

	update() {
		if (this.open) {
			let covered = this.coveredByElement();
			if (this.visible && covered) {
				this.hide();
			} else if (!this.visible && !covered) {
				this.show();
			}

			if (this.visible)
				this.resizeIfNecessary();
		}
	}

	hide() {
		if (this.visible) {
			remote.BrowserWindow.getFocusedWindow().removeBrowserView(this.keep);
			this.visible = false;
		}
	}

	show() {
		if (!this.visible) {
			remote.BrowserWindow.getFocusedWindow().addBrowserView(this.keep);
			this.visible = true;
		}
	}

	protected async onOpen(): Promise<void> {
		this.show();
		this.resizeIfNecessary();
		this.open = true;
	}

	protected async onClose(): Promise<void> {
		this.hide();
		this.open = false;
	}

	private resizeIfNecessary(): void {
		let rect = this.contentEl.getBoundingClientRect();
		if (this.size && rect.x == this.size.x && rect.y == this.size.y && rect.width == this.size.width && rect.height == this.size.height)
			return;
		this.size = rect;
		this.keep.setBounds({
			x: Math.floor(rect.x) + this.settings.padding,
			y: Math.floor(rect.top) + this.settings.padding,
			width: Math.floor(rect.width) - 2 * this.settings.padding,
			height: Math.floor(rect.height) - 2 * this.settings.padding
		});
	}

	private coveredByElement(): boolean {
		let nodes = document.body.querySelectorAll(".modal-bg, .menu, .notice");
		for (let i = 0; i < nodes.length; i++) {
			let rect = nodes[i].getBoundingClientRect();
			if (rect.left < this.size.right && this.size.left < rect.right && rect.top < this.size.bottom && this.size.top < rect.bottom)
				return true;
		}
		return false;
	}
}

class KeepSettingTab extends PluginSettingTab {

	settings: KeepSettings;

	constructor(app: App, plugin: KeepPlugin) {
		super(app, plugin);
		this.settings = plugin.settings;
	}

	display(): void {
		this.containerEl.empty();
		this.containerEl.createEl('h2', { text: 'Obsidian Keep Settings' });

		new Setting(this.containerEl)
			.setName('Padding')
			.setDesc('The padding that should be left around the inside of the Google Keep view, in pixels.')
			.addText(t => {
				t.inputEl.type = "number";
				t.setValue(String(this.settings.padding));
				t.onChange(async v => this.settings.padding = Number(v));
			});

		new Setting(this.containerEl)
			.setName("Additional CSS")
			.setDesc("A snippet of additional CSS that should be applied to the Google Keep embed. By default, this hides a lot of unnecessary information to make the embed take up less horizontal space.")
			.addTextArea(t => {
				t.inputEl.rows = 10;
				t.inputEl.cols = 50;
				t.setValue(this.settings.css);
				t.onChange(async v => this.settings.css = v);
			});
	}
}