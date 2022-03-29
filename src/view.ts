import { ItemView, WorkspaceLeaf, Platform, Menu } from "obsidian";
import { CustomFrame, CustomFramesSettings } from "./settings";

export class CustomFrameView extends ItemView {

    private readonly settings: CustomFramesSettings;
    private readonly data: CustomFrame;
    private readonly name: string;
    private frame: HTMLIFrameElement | any;

    constructor(leaf: WorkspaceLeaf, settings: CustomFramesSettings, data: CustomFrame, name: string) {
        super(leaf);
        this.settings = settings;
        this.data = data;
        this.name = name;

        this.addAction("refresh-cw", "Refresh", () => this.refresh());
        this.addAction("home", "Return to original page", () => this.return());
        this.addAction("arrow-left", "Go back", () => this.goBack());
        this.addAction("arrow-right", "Go forward", () => this.goForward());
    }

    onload(): void {
        this.contentEl.empty();
        this.contentEl.addClass("custom-frames-view");

        if (Platform.isDesktopApp) {
            this.frame = document.createElement("webview");
            this.frame.setAttribute("allowpopups", "");
            this.frame.addEventListener("dom-ready", () => {
                this.frame.insertCSS(this.data.customCss);

                if (this.data.minimumWidth) {
                    let parent = this.contentEl.closest<HTMLElement>(".workspace-split.mod-horizontal");
                    if (parent) {
                        let minWidth = `${this.data.minimumWidth + 2 * this.settings.padding}px`;
                        if (parent.style.width < minWidth)
                            parent.style.width = minWidth;
                    }
                }
            });
        }
        else {
            this.frame = document.createElement("iframe");
            this.frame.setAttribute("sandbox", "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation");
            this.frame.setAttribute("allow", "encrypted-media; fullscreen; oversized-images; picture-in-picture; sync-xhr; geolocation;");
        }
        this.frame.addClass("custom-frames-frame");
        this.frame.setAttribute("style", `padding: ${this.settings.padding}px`);
        this.frame.setAttribute("src", this.data.url);
        this.contentEl.appendChild(this.frame);
    }

    onHeaderMenu(menu: Menu): void {
        super.onHeaderMenu(menu);
        menu.addItem(i => {
            i.setTitle("Refresh");
            i.setIcon("refresh-cw");
            i.onClick(() => this.refresh());
        });
        menu.addItem(i => {
            i.setTitle("Return to original page");
            i.setIcon("home");
            i.onClick(() => this.return());
        });
        menu.addItem(i => {
            i.setTitle("Go back");
            i.setIcon("arrow-left");
            i.onClick(() => this.goBack());
        });
        menu.addItem(i => {
            i.setTitle("Go forward");
            i.setIcon("arrow-right");
            i.onClick(() => this.goForward());
        });
    }

    getViewType(): string {
        return this.name;
    }

    getDisplayText(): string {
        return this.data.displayName;
    }

    getIcon(): string {
        return this.data.icon ? `lucide-${this.data.icon}` : "documents";
    }

    private refresh(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow.location.reload();
        } else {
            this.frame.reload();
        }
    }

    private return(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow.open(this.data.url);
        } else {
            this.frame.loadURL(this.data.url);
        }
    }

    private goBack(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow.history.back();
        }
        else {
            this.frame.goBack();
        }
    }

    private goForward() {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow.history.forward();
        }
        else {
            this.frame.goForward();
        }
    }
}