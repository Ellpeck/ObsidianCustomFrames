import { ItemView, WorkspaceLeaf, Platform, Menu } from "obsidian";
import { CustomFrame, CustomFramesSettings } from "./settings";

export class CustomFrameView extends ItemView {

    private static readonly actions: Action[] = [
        {
            name: "Return to original page",
            icon: "home",
            action: v => v.return()
        },
        {
            name: "Open dev tools",
            icon: "binary",
            action: v => v.toggleDevTools()
        },
        {
            name: "Copy link",
            icon: "link",
            action: v => v.copyLink()
        }, {
            name: "Refresh",
            icon: "refresh-cw",
            action: v => v.refresh()
        }, {
            name: "Go back",
            icon: "arrow-left",
            action: v => v.goBack()
        }, {
            name: "Go forward",
            icon: "arrow-right",
            action: v => v.goForward()
        }
    ];

    private readonly settings: CustomFramesSettings;
    private readonly data: CustomFrame;
    private readonly name: string;
    private frame: HTMLIFrameElement | any;

    constructor(leaf: WorkspaceLeaf, settings: CustomFramesSettings, data: CustomFrame, name: string) {
        super(leaf);
        this.settings = settings;
        this.data = data;
        this.name = name;

        for (let action of CustomFrameView.actions)
            this.addAction(action.icon, action.name, () => action.action(this));
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
        for (let action of CustomFrameView.actions) {
            menu.addItem(i => {
                i.setTitle(action.name);
                i.setIcon(action.icon);
                i.onClick(() => action.action(this));
            });
        }
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

    private goForward(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow.history.forward();
        }
        else {
            this.frame.goForward();
        }
    }

    private toggleDevTools(): void {
        if (!(this.frame instanceof HTMLIFrameElement)) {
            if (!this.frame.isDevToolsOpened()) {
                this.frame.openDevTools();
            }
            else {
                this.frame.closeDevTools();
            }
        }
    }

    private copyLink(): void {
        let link = this.frame instanceof HTMLIFrameElement ? this.frame.contentWindow.location.href : this.frame.getURL();
        navigator.clipboard.writeText(link);
    }
}

interface Action {
    name: string;
    icon: string;
    action: (view: CustomFrameView) => any;
}