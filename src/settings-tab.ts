import { App, ButtonComponent, DropdownComponent, PluginSettingTab, Setting } from "obsidian";
import { defaultSettings, presets } from "./settings";
import CustomFramesPlugin from "./main";

export class CustomFramesSettingTab extends PluginSettingTab {

    plugin: CustomFramesPlugin;

    constructor(app: App, plugin: CustomFramesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        this.containerEl.empty();
        this.containerEl.createEl("h2", { text: "Custom Frames Settings" });
        this.containerEl.createEl("p", {
            text: "Please note that Obsidian has to be restarted or reloaded for most of these settings to take effect.",
            cls: "mod-warning"
        });

        new Setting(this.containerEl)
            .setName("Frame Padding")
            .setDesc("The padding that should be left around the inside of custom frame panes, in pixels.")
            .addText(t => {
                t.inputEl.type = "number";
                t.setValue(String(this.plugin.settings.padding));
                t.onChange(async v => {
                    this.plugin.settings.padding = v.length ? Number(v) : defaultSettings.padding;
                    await this.plugin.saveSettings();
                });
            });

        for (let frame of this.plugin.settings.frames) {
            let heading = this.containerEl.createEl("h3", { text: frame.displayName || "Unnamed Frame" });
            let toggle = new ButtonComponent(this.containerEl)
                .setButtonText("Show Settings")
                .setClass("custom-frames-show")
                .onClick(async () => {
                    content.hidden = !content.hidden;
                    toggle.setButtonText(content.hidden ? "Show Settings" : "Hide Settings");
                });
            let content = this.containerEl.createDiv();
            content.hidden = true;

            new Setting(content)
                .setName("Display Name")
                .setDesc("The display name that this frame should have.")
                .addText(t => {
                    t.setValue(frame.displayName);
                    t.onChange(async v => {
                        frame.displayName = v;
                        heading.setText(frame.displayName || "Unnamed Frame");
                        await this.plugin.saveSettings();
                    });
                });
            new Setting(content)
                .setName("Icon")
                .setDesc(createFragment(f => {
                    f.createSpan({ text: "The icon that this frame's pane should have. The names of any " });
                    f.createEl("a", { text: "Lucide icons", href: "https://lucide.dev/" });
                    f.createSpan({ text: " can be used." });
                }))
                .addText(t => {
                    t.setValue(frame.icon);
                    t.onChange(async v => {
                        frame.icon = v;
                        await this.plugin.saveSettings();
                    });
                });
            new Setting(content)
                .setName("URL")
                .setDesc("The URL that should be opened in this frame.")
                .addText(t => {
                    t.setValue(frame.url);
                    t.onChange(async v => {
                        frame.url = v;
                        await this.plugin.saveSettings();
                    });
                });
            new Setting(content)
                .setName("Disable on Mobile")
                .setDesc("Custom Frames is a lot more restricted on mobile devices and doesn't allow for the same types of content to be displayed. If a frame doesn't work as expected on mobile, it can be disabled.")
                .addToggle(t => {
                    t.setValue(frame.hideOnMobile);
                    t.onChange(async v => {
                        frame.hideOnMobile = v;
                        await this.plugin.saveSettings();
                    });
                });
            new Setting(content)
                .setName("Add Ribbon Icon")
                .setDesc("Whether a button to open this frame should be added to the ribbon.")
                .addToggle(t => {
                    t.setValue(frame.addRibbonIcon);
                    t.onChange(async v => {
                        frame.addRibbonIcon = v;
                        await this.plugin.saveSettings();
                    });
                });
            new Setting(content)
                .setName("Open in Center")
                .setDesc("Whether this frame should be opened in the unpinned center editor rather than one of the panes on the side. This is useful for sites that don't work well in a narrow view, or sites that don't require a note to be open when viewed.")
                .addToggle(t => {
                    t.setValue(frame.openInCenter);
                    t.onChange(async v => {
                        frame.openInCenter = v;
                        await this.plugin.saveSettings();
                    });
                });
            new Setting(content)
                .setName("Force iframe")
                .setDesc(createFragment(f => {
                    f.createSpan({ text: "Whether this frame should use iframes on desktop as opposed to Electron webviews." });
                    f.createEl("br");
                    f.createEl("em", { text: "Only enable this setting if the frame is causing issues or frequent crashes. This setting causes all Desktop-only settings to be ignored." });
                }))
                .addToggle(t => {
                    t.setValue(frame.forceIframe);
                    t.onChange(async v => {
                        frame.forceIframe = v;
                        await this.plugin.saveSettings();
                    });
                });
            new Setting(content)
                .setName("Page Zoom")
                .setDesc("The zoom that this frame's page should be displayed with, as a percentage.")
                .addText(t => {
                    t.inputEl.type = "number";
                    t.setValue(String(frame.zoomLevel * 100));
                    t.onChange(async v => {
                        frame.zoomLevel = v.length ? Number(v) / 100 : 1;
                        await this.plugin.saveSettings();
                    });
                });
            new Setting(content)
                .setName("Additional CSS")
                .setDesc(createFragment(f => {
                    f.createSpan({ text: "A snippet of additional CSS that should be applied to this frame." });
                    f.createEl("br");
                    f.createEl("em", { text: "Note that this is only applied on Desktop." });
                }))
                .addTextArea(t => {
                    t.inputEl.rows = 5;
                    t.inputEl.cols = 50;
                    t.setValue(frame.customCss);
                    t.onChange(async v => {
                        frame.customCss = v;
                        await this.plugin.saveSettings();
                    });
                });
            new Setting(content)
                .setName("Additional JavaScript")
                .setDesc(createFragment(f => {
                    f.createSpan({ text: "A snippet of additional JavaScript that should be applied to this frame." });
                    f.createEl("br");
                    f.createEl("em", { text: "Note that this is only applied on Desktop." });
                }))
                .addTextArea(t => {
                    t.inputEl.rows = 5;
                    t.inputEl.cols = 50;
                    t.setValue(frame.customJs);
                    t.onChange(async v => {
                        frame.customJs = v;
                        await this.plugin.saveSettings();
                    });
                });
            new ButtonComponent(content)
                .setButtonText("Remove Frame")
                .onClick(async () => {
                    this.plugin.settings.frames.remove(frame);
                    await this.plugin.saveSettings();
                    this.display();
                });
        }

        this.containerEl.createEl("hr");
        this.containerEl.createEl("p", { text: "Create a new frame, either from a preset shipped with the plugin, or a custom one that you can edit yourself. Each frame's pane can be opened using the \"Custom Frames: Open\" command." });

        let addDiv = this.containerEl.createDiv();
        let dropdown = new DropdownComponent(addDiv);
        dropdown.addOption("new", "Custom");
        for (let key of Object.keys(presets))
            dropdown.addOption(key, presets[key].displayName);
        new ButtonComponent(addDiv)
            .setButtonText("Add Frame")
            .setClass("custom-frames-add")
            .onClick(async () => {
                let option = dropdown.getValue();
                if (option == "new") {
                    this.plugin.settings.frames.push({
                        url: "",
                        displayName: "New Frame",
                        icon: "",
                        hideOnMobile: true,
                        addRibbonIcon: false,
                        openInCenter: false,
                        zoomLevel: 1,
                        forceIframe: false,
                        customCss: ""
                    });
                } else {
                    this.plugin.settings.frames.push(presets[option]);
                }
                await this.plugin.saveSettings();
                this.display();
            });

        let disclaimer = this.containerEl.createEl("p", { cls: "mod-warning" });
        disclaimer.createSpan({ text: "Please be advised that, when adding a site as a custom frame, you potentially expose personal information you enter to other plugins you have installed. For more information, see " });
        disclaimer.createEl("a", {
            text: "this discussion",
            href: "https://github.com/Ellpeck/ObsidianCustomFrames/issues/54#issuecomment-1210879685",
            cls: "mod-warning"
        });
        disclaimer.createSpan({ text: "." });

        this.containerEl.createEl("hr");
        this.containerEl.createEl("p", { text: "If you like this plugin and want to support its development, you can do so through my website by clicking this fancy image!" });
        this.containerEl.createEl("a", { href: "https://ellpeck.de/support" }).createEl("img", {
            attr: { src: "https://ellpeck.de/res/generalsupport.png" },
            cls: "custom-frames-support"
        });
    }
}
