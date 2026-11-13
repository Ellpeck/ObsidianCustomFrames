export class WebviewStub extends HTMLElement {

    setZoomFactor(_value: number) {
    }

    insertCSS(_css: string) {
    }

    executeJavaScript(_js: string) {
    }

    reload() {
    }

    openDevTools() {
    }

    closeDevTools() {
    }

    isDevToolsOpened(): boolean {
        return false;
    }

    getURL(): string {
        return "";
    }

    goForward() {

    }

    goBack() {
    }

    loadURL(_url: string) {
    }
}

// we trick the linter using this stub due to an issue where the preferred Obsidian-specific function createEl uses the wrong
// parent document when creating an element, causing webviews to cause crashes when frames are popped out to a new window
// see https://github.com/Ellpeck/ObsidianCustomFrames/issues/163#issuecomment-6863090455
export class DomStub {
    createElement<K extends keyof HTMLElementTagNameMap>(_tagName: K, _options?: ElementCreationOptions): HTMLElementTagNameMap[K] {
        return undefined as unknown as HTMLElementTagNameMap[K];
    }
}
