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
	"calendar": {
        url: "https://calendar.google.com/calendar/u/0/r/day",
        displayName: "Google Calendar",
        icon: "calendar",
        hideOnMobile: true,
        minimumWidth: 490,
        customCss: `/* hide right-side menu, and some buttons */
div.d6McF,
div.pw6cBb,
div.gb_Td.gb_Va.gb_Id,
div.Kk7lMc-QWPxkf-LgbsSe-haAclf,
div.h8Aqhb,
div.gboEAb,
div.dwlvNd {
    display: none !important;
}`
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
    },
    "twitter": {
        url: "https://twitter.com",
        displayName: "Twitter",
        icon: "twitter",
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
