# \#PDFSearch
This is a cross platform application designed to search PDF files. This application will scan a set of selected folders for PDF files and search their content, looking for hashtags (e.g. \#posiHadron). It then complies a list of the discovered documents which can be filtering by the discovered hashtags.

It was originally designed for researchers who need to collate scientific papers. However, it has found many other users. If you want to help then please contact Jacob - jacob@kittley.com.

## Dependencies
This project was built using [electron-react-redux-boilerplate](https://github.com/jschr/electron-react-redux-boilerplate) and utilises the following tools:

* [React Router](https://reacttraining.com/react-router/)
* [Redux Thunk](https://github.com/gaearon/redux-thunk/)
* [Redux Actions](https://github.com/acdlite/redux-actions/)
* [Redux Local Storage](https://github.com/elgerlambert/redux-localstorage/)
* [Electron Packager](https://github.com/electron-userland/electron-packager)
* [Electron DevTools Installer](https://github.com/MarshallOfSound/electron-devtools-installer)
* [Electron Mocha](https://github.com/jprichardson/electron-mocha)
* [Browsersync](https://browsersync.io/)

## Quick start

Clone the repository
```bash
git clone --depth=1 https://github.com/jkittley/pdfsearch.git
```

Install dependencies
```bash
cd hastaglit
npm install
```

Development
```bash
npm run develop
```

## Packaging

Modify [electron-builder.yml](./electron-builder.yml) to edit package info.

For a full list of options see: https://github.com/electron-userland/electron-builder/wiki/Options.

Create a package for OSX, Windows and Linux
```
npm run pack
```

Or target a specific platform
```
npm run pack:mac
npm run pack:win
npm run pack:linux
```

## Tests

```
npm run test
```
