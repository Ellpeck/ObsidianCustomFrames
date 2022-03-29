export const defaultSettings: CustomFramesSettings = {
    frames: [],
    padding: 5
};
export const presets: Record<string, CustomFrame> = {
    "obsidian": {
        url: "https://forum.obsidian.md/",
        displayName: "Obsidian Forum",
        icon: "edit",
        hideOnMobile: true,
        minimumWidth: 367,
        customCss: ""
    },
    "keep": {
        url: "https://keep.google.com",
        displayName: "Google Keep",
        icon: "files",
        hideOnMobile: true,
        minimumWidth: 370,
        customCss: `/* hide the menu bar and the "Keep" text */
.PvRhvb-qAWA2, .gb_2d.gb_Zc { 
	display: none !important; 
}`
    },
    "notion": {
        url: "https://www.notion.so/",
        displayName: "Notion",
        icon: "box",
        hideOnMobile: true,
        minimumWidth: 400,
        customCss: ""
    }
};

export interface CustomFramesSettings {
    frames: CustomFrame[];
    padding: number;
}

export interface CustomFrame {
    url: string;
    displayName: string;
    icon: string;
    hideOnMobile: boolean;
    minimumWidth: number;
    customCss: string;
}