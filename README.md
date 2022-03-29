# Obsidian Custom Frames
An Obsidian plugin that turns web apps into panes using iframes with custom styling. Also comes with presets for Google Keep and more.

⚠️⚠️⚠️ **For header-heavy sites like Google Keep to work, this plugin requires Obsidian 0.14.3.** ⚠️⚠️⚠️

![A screenshot of the plugin in action](https://raw.githubusercontent.com/Ellpeck/ObsidianCustomFrames/master/screenshot.png)

![A screenshot of the plugin's settings](https://raw.githubusercontent.com/Ellpeck/ObsidianCustomFrames/master/settings.png)

## Usage
To use this plugin, simply go into its settings and add a new frame, either from a preset shipped with the plugin, or a custom one that you can edit yourself. Each frame's pane can be opened using the "Custom Frames: Open" command.

### On Obsidian Mobile
Unfortunately, Obsidian Mobile does not run on [Electron](https://www.electronjs.org/), which is what allows iframes and [webviews](https://www.electronjs.org/docs/latest/api/webview-tag) to be displayed with very few restrictions related to cookies, cross-origin resource sharing, and so on. This means that a lot of sites won't work there, especially ones that you have to log in to. However, when you create a frame, you can toggle the "Disable on Mobile" option to hide a Desktop-only frame in Obsidian mobile.

## Presets
By default, Custom Frames comes with a few presets that allow you to get new panes for popular sites up and running quickly.
- [Obsidian Forum](https://forum.obsidian.md/)
- [Google Keep](https://keep.google.com), optimized for a narrow pane on the side
- [Notion](https://www.notion.so/) (it's recommended to close Notion's sidebar if used as a side pane)
- [Twitter](https://twitter.com)

If you create a frame that you think other people would like, don't hesitate to create a pull request with [a new preset](https://github.com/Ellpeck/ObsidianCustomFrames/blob/master/src/settings.ts#L5).

## Roadmap
- ~~Allow setting a custom icon for each pane~~
- Allow displaying custom frames in Markdown code blocks
- Allow creating links that open in a custom frame rather than the browser
- Possibly allow executing custom JavaScript in iframes (though security implications still need to be explored)

## Acknowledgements
Thanks to [lishid](https://github.com/lishid) for their help with making iframes work in Obsidian for a purpose like this. Also thanks to them for *motivating* me to turn Obsidian Keep into a more versatile plugin, which is how Custom Frames was born.

If you like this plugin and want to support its development, you can do so through my website by clicking this fancy image!

[![Support me (if you want), via Patreon, Ko-fi or GitHub Sponsors](https://ellpeck.de/res/generalsupport.png)](https://ellpeck.de/support)