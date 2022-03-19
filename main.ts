import { ItemView, Plugin } from 'obsidian';
import { BrowserView, remote } from 'electron';

const viewName: string = "keep";
const padding: number = 5;

export default class MyPlugin extends Plugin {

	async onload(): Promise<void> {
		console.log('Loading obsidian-keep');

		this.registerView(viewName, l => new KeepView(l));
		this.addCommand({
			id: "open-keep",
			name: "Open Keep",
			checkCallback: (checking: boolean) => {
				if (checking)
					return !this.app.workspace.getLeavesOfType(viewName).length;
				this.openKeep();
			},
		});
		this.app.workspace.onLayoutReady(() => this.openKeep());
	}

	private openKeep(): void {
		if (!this.app.workspace.getLeavesOfType(viewName).length)
			this.app.workspace.getRightLeaf(false).setViewState({ type: viewName });
	}
}

export class KeepView extends ItemView {

	private keep: BrowserView;
	private visible: boolean;
	private open: boolean;
	private size: DOMRect;

	async onload(): Promise<void> {
		this.keep = new remote.BrowserView();
		await this.keep.webContents.loadURL('https://keep.google.com');
		this.keep.webContents.setZoomLevel(0);
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
			x: Math.floor(rect.x) + padding,
			y: Math.floor(rect.top) + padding,
			width: Math.floor(rect.width) - 2 * padding,
			height: Math.floor(rect.height) - 2 * padding
		});
	}

	private coveredByElement(): boolean {
		let nodes = document.body.querySelectorAll(".modal-bg, .menu");
		for (let i = 0; i < nodes.length; i++) {
			let rect = nodes[i].getBoundingClientRect();
			if (rect.left < this.size.right && this.size.left < rect.right && rect.top < this.size.bottom && this.size.top < rect.bottom)
				return true;
		}
		return false;
	}
}