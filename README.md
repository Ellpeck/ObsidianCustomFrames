# Obsidian Custom Frames
An Obsidian plugin that allows adding iframes with custom styling as editor tabs. Also comes with presets for Google Keep and more.

![A screenshot of the plugin in action](screenshot.png)

![A screenshot of the plugin's settings](settings.png)

## Usage
To use this plugin, simply go into its settings and add a new frame, either from a preset shipped with the plugin, or a custom one that you can edit yourself. Each frame's tab can be opened using the 'Custom Frames: Open' command.

Note that this plugin only works on Desktop right now.

## Presets
By default, Custom Frames comes with a few presets that allow you to get new tabs for popular sites up and running quickly.
- Google Keep, optimized for a narrow side tab

If you create a frame that you think other people would like, don't hesitate to create a pull request with [a new preset](https://github.com/Ellpeck/ObsidianCustomFrames/blob/master/main.ts#L8).

## Roadmap
- Allow setting a custom icon for each tab
- Possibly allow executing custom JavaScript in iframes (though security implications still need to be explored)