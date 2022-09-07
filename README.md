# Welcome to my THREE.js tech demo!
## File Structure:
```
THREE-name/
├─ assets/
│  ├─ all of my 3d letters
│  ├─ grass texture
├─ images/
│  ├─ all of my images
├─ node-modules/
├─ src/
│  ├─ api/
│  │  ├─ gltfLoader
│  │  ├─ loadLetter
│  │  ├─ pixelShader
│  ├─ lib/
│  │  ├─ Math
│  │  ├─ SceneInit
│  ├─ App.css
│  ├─ App.jsx
│  ├─ index.css
│  ├─ main.jsx
├─ .gitignore
├─ index.html
├─ whatever packages
├─ vite.config
└─ README!
```

## Versions:
**Version 0.2**
- Added a pan up
- Added spacebar bind to enable/disable pixel shader


Version 0.15
- Added grass!
- Fixed bug where shader resolution wouldn't update on screen resize
- Cleaned up code to have App.jsx cleaner

Version 0.14
- Added a justLoaded checker in SceneInit
- Added some math and stuff to have a spiral effect on load

Version 0.13
- Adjusted some camera settings
- NOTE: I really need to stop spamming updates and take some time in between

Version 0.12
- Fixed issue with letters not showing
- Cleaned up old files that weren't being used

Version 0.11
- Minor directory tweaks
- Finally changed my glft typo
- Updated README

Version 0.1
- Added a pixel shader
- Added a random letter model loader
- Cleaned up some code