const fs = require('fs');

const patches = [
  // ThreeUI color encoding patches
  {
    file: './node_modules/@designcodeio/threeui/lib-dist/shaders/gallery/Gallery.js',
    from: 'S.sRGBEncoding',
    to: '(S["sRGBEncoding"] || 3001)',
  },
  {
    file: './node_modules/@designcodeio/threeui/lib-dist/shaders/skeuomorphic-toggle/glassToggleScene.js',
    from: 't.sRGBEncoding',
    to: '(t["sRGBEncoding"] || 3001)',
  },
  {
    file: './node_modules/@designcodeio/threeui/lib-dist/shaders/temple-night/templeNightRenderer.js',
    from: 'o.LinearEncoding',
    to: '(o["LinearEncoding"] || 3000)',
  },
  {
    file: './node_modules/@designcodeio/threeui/lib-dist/shaders/temple-night/templeNightRenderer.js',
    from: 'o.sRGBEncoding',
    to: '(o["sRGBEncoding"] || 3001)',
  },

  // React-Three-Fiber React 19 unmount / null event target patches
  {
    file: './node_modules/@react-three/fiber/dist/events-583399dd.cjs.prod.js',
    from: 'if (events.handlers) {\n        for (const name in events.handlers) {\n          const event = events.handlers[name];\n          const [eventName, passive] = DOM_EVENTS[name];\n          target.addEventListener(eventName, event, {\n            passive\n          });',
    to: 'if (target && events.handlers) {\n        for (const name in events.handlers) {\n          const event = events.handlers[name];\n          const [eventName, passive] = DOM_EVENTS[name];\n          target.addEventListener(eventName, event, {\n            passive\n          });',
  },
  {
    file: './node_modules/@react-three/fiber/dist/events-583399dd.cjs.prod.js',
    from: 'if (!store.getState().events.connected) state.events.connect == null ? void 0 : state.events.connect(rootElement);',
    to: 'if (rootElement && !store.getState().events.connected) state.events.connect == null ? void 0 : state.events.connect(rootElement);',
  },
  {
    file: './node_modules/@react-three/fiber/dist/events-b389eeca.esm.js',
    from: 'if (events.handlers) {\n        for (const name in events.handlers) {\n          const event = events.handlers[name];\n          const [eventName, passive] = DOM_EVENTS[name];\n          target.addEventListener(eventName, event, {\n            passive\n          });',
    to: 'if (target && events.handlers) {\n        for (const name in events.handlers) {\n          const event = events.handlers[name];\n          const [eventName, passive] = DOM_EVENTS[name];\n          target.addEventListener(eventName, event, {\n            passive\n          });',
  },
  {
    file: './node_modules/@react-three/fiber/dist/events-b389eeca.esm.js',
    from: 'if (!store.getState().events.connected) state.events.connect == null ? void 0 : state.events.connect(rootElement);',
    to: 'if (rootElement && !store.getState().events.connected) state.events.connect == null ? void 0 : state.events.connect(rootElement);',
  },
  {
    file: './node_modules/@react-three/fiber/dist/events-f19bcc32.cjs.dev.js',
    from: 'if (events.handlers) {\n        for (const name in events.handlers) {\n          const event = events.handlers[name];\n          const [eventName, passive] = DOM_EVENTS[name];\n          target.addEventListener(eventName, event, {\n            passive\n          });',
    to: 'if (target && events.handlers) {\n        for (const name in events.handlers) {\n          const event = events.handlers[name];\n          const [eventName, passive] = DOM_EVENTS[name];\n          target.addEventListener(eventName, event, {\n            passive\n          });',
  },
  {
    file: './node_modules/@react-three/fiber/dist/events-f19bcc32.cjs.dev.js',
    from: 'if (!store.getState().events.connected) state.events.connect == null ? void 0 : state.events.connect(rootElement);',
    to: 'if (rootElement && !store.getState().events.connected) state.events.connect == null ? void 0 : state.events.connect(rootElement);',
  },
];

for (const p of patches) {
  if (fs.existsSync(p.file)) {
    let content = fs.readFileSync(p.file, 'utf8');
    if (content.includes(p.from)) {
      content = content.replaceAll(p.from, p.to);
      fs.writeFileSync(p.file, content, 'utf8');
      console.log('Successfully patched all occurrences in:', p.file);
    } else {
      console.log('Pattern not found or already patched in:', p.file);
    }
  } else {
    console.warn('File not found:', p.file);
  }
}
console.log('Postinstall patch complete.');
