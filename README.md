# ObsidianKeep
An Obsidian plugin that displays Google Keep in the app.

Since Google Keep doesn't allow the use of iframes, this plugin gets creative by adding a [BrowserView](https://www.electronjs.org/docs/latest/api/browser-view) for the Google Keep view. However, since they render on top of everything else, the view has to be hidden whenever a modal or menu is open. It's a compromise.

When the official [Google Keep API](https://developers.google.com/keep) is farther along and has an official JavaScript API, this plugin will start using that instead, probably.

## Installation
This plugin isn't on the official list of community plugins, so you'll have to install it manually.
- Go to the [latest release](https://github.com/Ellpeck/ObsidianKeep/releases) here on GitHub
- Download `obsidian-keep.zip`
- Extract `obsidian-keep.zip` into your vault's `.obsidian/plugins` folder so that the resulting `obsidian-keep` folder contains the `main.js` and `manifest.json` files
- Go into Obsidian and enable the plugin in the Community Plugins section