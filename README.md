# ObsidianKeep
An Obsidian plugin that displays Google Keep in the app.

Since Google Keep doesn't allow the use of iframes, this plugin gets creative by adding a [BrowserView](https://www.electronjs.org/docs/latest/api/browser-view) for the Google Keep view. However, since they render on top of everything else, the view has to be hidden whenever a modal or menu is open. It's a compromise.

When the official [Google Keep API](https://developers.google.com/keep) is farther along and has an official JavaScript API, this plugin will start using that instead, probably.