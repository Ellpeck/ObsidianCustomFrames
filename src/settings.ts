export const defaultSettings: CustomFramesSettings = {
    frames: [],
    padding: 5
};
export const presets: Record<string, CustomFrameSettings> = {
    "obsidian": {
        url: "https://forum.obsidian.md/",
        displayName: "Obsidian Forum",
        icon: "edit",
        hideOnMobile: true,
        addRibbonIcon: true,
        openInCenter: true,
        zoomLevel: 1,
        forceIframe: false,
        customCss: ""
    },
    "detexify": {
        url: "https://detexify.kirelabs.org/classify.html",
        displayName: "Detexify",
        icon: "type",
        hideOnMobile: true,
        addRibbonIcon: true,
        openInCenter: false,
        zoomLevel: .95,
        forceIframe: false,
        customCss: `/* hide info clutter and ad banner */
#classify--info-area,
.adsbygoogle {
	display: none !important
}`
    },
    "calendar": {
        url: "https://calendar.google.com/calendar",
        displayName: "Google Calendar",
        icon: "calendar",
        hideOnMobile: true,
        addRibbonIcon: true,
        openInCenter: true,
        zoomLevel: 1,
        forceIframe: false,
        customCss: `/* hide the menu bar, "Keep" text, and logo */
html > body > div:nth-child(2) > div:nth-child(2) > div:first-child[class*=" "],
html > body > div:first-child > header:first-child > div > div:first-child > div > div:first-child,
html > body > div:nth-child(2) > div:nth-child(2) > div:first-child > div:first-child {
display: none !important;
}`
    },
    "keep": {
        url: "https://keep.google.com",
        displayName: "Google Keep",
        icon: "files",
        hideOnMobile: true,
        addRibbonIcon: false,
        openInCenter: false,
        zoomLevel: 1,
        forceIframe: false,
        customCss: `/* hide the menu bar and the "Keep" text */
html > body > div:nth-child(2) > div:nth-child(2) > div:first-child,
html > body > div:first-child > header:first-child > div > div:first-child > div > div:first-child > a:first-child > span {
	display: none !important;
}`
    },
    "todoist": {
        url: "https://todoist.com",
        displayName: "Todoist",
        icon: "list-checks",
        hideOnMobile: true,
        addRibbonIcon: false,
        openInCenter: false,
        zoomLevel: 1,
        forceIframe: false,
        customCss: `/* hide the help, home, search, and productivity overview buttons, create extra space, and prevent toast pop-up from acting weird */
[aria-label="Go to Home view"], #quick_find, [aria-label="Productivity"], [aria-label="Help & Feedback"] {
	display: none !important;
}

.view_content {
	padding-left: 15px;
}

.view_header {
	padding-left: 15px;
	padding-top: 10px;
}

.undo_toast {
	width: 95%;
}`
    },
    "notion": {
        url: "https://www.notion.so/",
        displayName: "Notion",
        icon: "box",
        hideOnMobile: true,
        addRibbonIcon: true,
        openInCenter: true,
        zoomLevel: 1,
        forceIframe: false,
        customCss: ""
    },
    "twitter": {
        url: "https://twitter.com",
        displayName: "Twitter",
        icon: "twitter",
        hideOnMobile: true,
        addRibbonIcon: false,
        openInCenter: false,
        zoomLevel: 1,
        forceIframe: false,
        customCss: ""
    },
    'google task': {
        url: 'https://tasks.google.com/embed/?origin=https://calendar.google.com&fullWidth=1',
        displayName: 'Google Task',
        icon: 'list-checks',
        hideOnMobile: true,
        addRibbonIcon: false,
        openInCenter: false,
        zoomLevel: 1,
        forceIframe: false,
        customCss: ''
      }
};

export interface CustomFramesSettings {
    frames: CustomFrameSettings[];
    padding: number;
}

export interface CustomFrameSettings {
    url: string;
    displayName: string;
    icon: string;
    hideOnMobile: boolean;
    addRibbonIcon: boolean;
    openInCenter: boolean;
    zoomLevel: number;
    forceIframe: boolean;
    customCss: string;
}

export function getIcon(settings: CustomFrameSettings) {
    return settings.icon ? `lucide-${settings.icon}` : "documents";
}

export function getId(settings: CustomFrameSettings) {
    return settings.displayName.toLowerCase().replace(/\s/g, "-");
}
