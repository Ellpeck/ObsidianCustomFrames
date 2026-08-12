import {App, Platform} from "obsidian";
import {CustomFrameSettings, CustomFramesSettings, getId} from "./settings";
import {WebviewStub} from "./webview-stub";

export class CustomFrame {
    private readonly settings: CustomFramesSettings;
    private readonly data: CustomFrameSettings;
    private frame: HTMLIFrameElement | WebviewStub | undefined;

    constructor(settings: CustomFramesSettings, data: CustomFrameSettings) {
        this.settings = settings;
        this.data = data;
    }

    create(app: App, parent: HTMLElement, additionalStyle?: string, urlSuffix?: string): void {
        let style = `padding: ${this.settings.padding}px;`;
        if (additionalStyle)
            style += additionalStyle;
        if (Platform.isDesktopApp && !this.data.forceIframe) {
            let frameDoc = parent.doc;
            this.frame = parent.createEl("webview" as keyof HTMLElementTagNameMap) as WebviewStub;
            // @ts-ignore - share sessions with the built-in web viewer, see https://github.com/Ellpeck/ObsidianCustomFrames/issues/136#issuecomment-2584116803
            this.frame.partition = "persist:vault-" + app.appId;
            parent.appendChild(this.frame);
            this.frame.setAttribute("allowpopups", "");
            this.frame.addEventListener("dom-ready", () => {
                (this.frame as WebviewStub).setZoomFactor(this.data.zoomLevel);
                (this.frame as WebviewStub).insertCSS(this.data.customCss);
                (this.frame as WebviewStub).executeJavaScript(this.data.customJs);
            });
            this.frame.addEventListener("destroyed", () => {
                // recreate the webview if it was moved to a new window
                if (frameDoc != parent.doc) {
                    this.frame!.detach();
                    this.create(app, parent, additionalStyle, urlSuffix);
                }
            });
        } else {
            this.frame = parent.createEl("iframe");
            parent.appendChild(this.frame);
            this.frame.setAttribute("sandbox", "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads");
            this.frame.setAttribute("allow", "encrypted-media; fullscreen; oversized-images; picture-in-picture; sync-xhr; geolocation;");
            style += `transform: scale(${this.data.zoomLevel}); transform-origin: 0 0;`;
        }
        this.frame.addClass("custom-frames-frame");
        this.frame.addClass(`custom-frames-${getId(this.data)}`);
        this.frame.setAttribute("style", style);

        let srcUrl;
        try {
            srcUrl = new URL(this.data.url);
        } catch (e) {
            // fallback: concat url and suffix directly if base URL is invalid
            srcUrl = new URL(this.data.url + (urlSuffix || ""));
            urlSuffix = null;
        }

        if (urlSuffix) {
            const suffixUrl = new URL(urlSuffix, srcUrl.origin);

            suffixUrl.searchParams.forEach((value, key) => {
                srcUrl.searchParams.set(key, value);
            });

            if (suffixUrl.pathname !== "/") {
                srcUrl.pathname = srcUrl.pathname.replace(/\/$/, "") + suffixUrl.pathname;
            }

            if (suffixUrl.hash) {
                srcUrl.hash = suffixUrl.hash;
            }
        }
        this.frame.setAttribute("src", srcUrl.toString());
    }

    refresh(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow!.location.reload();
        } else {
            this.frame!.reload();
        }
    }

    return(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow!.open(this.data.url);
        } else {
            this.frame!.loadURL(this.data.url);
        }
    }

    goBack(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow!.history.back();
        } else {
            this.frame!.goBack();
        }
    }

    goForward(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow!.history.forward();
        } else {
            this.frame!.goForward();
        }
    }

    toggleDevTools(): void {
        if (!(this.frame instanceof HTMLIFrameElement)) {
            if (!this.frame!.isDevToolsOpened()) {
                this.frame!.openDevTools();
            } else {
                this.frame!.closeDevTools();
            }
        }
    }

    getCurrentUrl(): string {
        return this.frame instanceof HTMLIFrameElement ? this.frame.contentWindow!.location.href : this.frame!.getURL();
    }

    focus(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow!.focus();
        } else {
            this.frame!.focus();
        }
    }
}
