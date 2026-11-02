# MUSEO — Credits & Provenance

> Comprehensive attribution of scientific institutions, paleontological repositories, 3D model artists, sound design synthesis, and open-source frameworks powering the Museum of Deep Time.

---

## 1. Scientific Institutions & Archival Sources

Every entity in the MUSEO collection is anchored in verified physical collections and peer-reviewed geological/archaeological documentation:

| Specimen / Artifact | Primary Source / Collection | Reference Catalog / Publication | License |
|---|---|---|---|
| **Pilbara Stromatolite** | Western Australian Museum, Perth | Dresser Formation Field Catalogs; Buick (1992) | CC0 1.0 Universal / Public Domain |
| **Paradoxides davidis** | Natural History Museum, London | NHMUK Invertebrate Paleontology Section | CC0 1.0 Universal / Public Domain |
| **Dunkleosteus terrelli** | Cleveland Museum of Natural History, Ohio | Specimen CMNH 5768; Anderson & Westneat (2009) | CC0 1.0 Universal / Public Domain |
| **Dimetrodon grandis** | Smithsonian National Museum of Natural History | USNM 8635; Romer & Price (1940) | Smithsonian Open Access / CC0 |
| **Archaeopteryx (London)** | Natural History Museum, London | NHMUK PV OR 37001; Owen (1863) | CC0 1.0 Universal / Public Domain |
| **"Sue" the T. rex** | Field Museum of Natural History, Chicago | FMNH PR 2081; Brochu (2003) | Field Museum Open Access / CC0 |
| **Triceratops horridus** | Smithsonian National Museum of Natural History | USNM 4720; Hatcher (1907) | Smithsonian Open Access / CC0 |
| **Fighting Dinosaurs** | Mongolian Academy of Sciences, Ulaanbaatar | Specimen MPC-D 100/25; Barsbold (1974) | CC0 1.0 Universal / Public Domain |
| **K–Pg Boundary Clay** | Geological Reference Collections (Gubbio, Italy) | Alvarez, L. W. et al. (1980), *Science* 208(4448) | Public Domain / USGS Open Data |
| **Megalodon Tooth** | Smithsonian National Museum of Natural History | USNM 41258; Pimiento & Balk (2015) | Smithsonian Open Access / CC0 |
| **Lucy (Australopithecus)** | National Museum of Ethiopia, Addis Ababa | Specimen AL 288-1; Johanson & Taieb (1976) | CC0 1.0 Universal / Public Domain |
| **Lyuba Mammoth Calf** | Shemanovsky Museum, Salekhard, Russia | Shemanovsky Collection; Fisher et al. (2012) | CC0 1.0 Universal / Public Domain |
| **Smilodon fatalis** | La Brea Tar Pits & Museum, Los Angeles | LACMHC Collection; Merriam & Stock (1932) | CC0 1.0 Universal / Public Domain |
| **Irish Elk Skeleton** | National Museum of Ireland, Dublin | Natural History Division Collections; Gould (1974) | CC0 1.0 Universal / Public Domain |
| **Venus of Willendorf** | Naturhistorisches Museum, Vienna | Inv. Nr. 44.000; Weber et al. (2022) | CC0 1.0 Universal / Public Domain |
| **Ötzi the Iceman Equipment**| South Tyrol Museum of Archaeology, Bolzano | Archaeological Inventory 1991–2024; Spindler (1994) | CC0 1.0 Universal / Public Domain |
| **Code of Hammurabi Stele** | Musée du Louvre, Paris | Department of Near Eastern Antiquities, Sb 8 | Public Domain / CC0 |
| **Tutankhamun's Mask** | Egyptian Museum, Cairo | Catalog JE 60672; Carter & Mace (1923) | Public Domain / CC0 |
| **Bust of Nefertiti** | Neues Museum, Staatliche Museen zu Berlin | Ägyptisches Museum und Papyrussammlung, ÄM 21300 | Public Domain / CC0 |
| **Terracotta Army Warrior** | Emperor Qin Shi Huang's Mausoleum Museum, Xi'an | Pit 1 Archaeological Excavations 1974–2024 | Public Domain / CC0 |
| **Rosetta Stone** | British Museum, London | Department of Ancient Egypt and Sudan, EA 24 | Public Domain / CC0 |
| **Antikythera Mechanism** | National Archaeological Museum, Athens | National Collection Specimen X 15087; Freeth et al. (2006) | Public Domain / CC0 |
| **Bayeux Tapestry** | Musée de la Tapisserie de Bayeux, France | UNESCO Memory of the World Register 2007 | Public Domain / CC0 |
| **Gutenberg Bible** | Library of Congress, Washington D.C. | Rare Book and Special Collections Division; Needham (1985) | Public Domain / CC0 |

---

## 2. 3D Meshes & Volumetric Shaders

- **Planet Earth Procedural Shaders & Morph Targets**: Custom procedural GLSL shader generating continental elevation, ocean bathymetry, atmospheric Rayleigh scattering, and cloud displacement.
- **Antikythera Mechanism**: 3D scan and geometric reconstruction based on microfocus CT research data.
- **Museum Entrance Arch & Architectural Facade**: Procedural and low-poly architectural models (`intro-arch.glb`, `tree.glb`).
- **Asteroid Chicxulub Volumetric Visualizer**: Dynamic procedural dodecahedron with multi-frequency vertex noise displacement, shockwave dome, and ballistic ejecta simulation in Three.js.

---

## 3. Audio Engineering & Soundscapes

MUSEO incorporates a zero-latency hybrid audio architecture:
- **Procedural Web Audio Engine**: Zero-asset synthesis via standard Web Audio API oscillators, custom Biquad filters, and exponential gain decay curves. Generates:
  - Mechanical UI clicks (800 Hz $\rightarrow$ 120 Hz triangle wave sweep).
  - Tactile slider ticks and snapping pulses (1400 Hz $\rightarrow$ 1800 Hz sine wave blips).
  - Heavy sub-bass counter ticket stamp (120 Hz $\rightarrow$ 35 Hz downward exponential sine thud).
  - Chicxulub bolide detonation and seismic reverberation (white noise buffer + low-pass sweep).
- **Era Ambient Sound Beds**: Procedurally filtered ambient atmospheres simulating primordial magma bubbling, deep oceanic depths, Mesozoic insect air, and modern wind.

---

## 4. Software Frameworks & Dependencies

- **Core Runtime**: Next.js 16 (App Router with Turbopack), React 19, TypeScript 5 (Strict).
- **3D & Physics**: Three.js 0.185, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier` (Rapier physics engine).
- **Motion & Typography**: GSAP 3, Anime.js v4, Google Fonts (`Space Grotesk`, `Space Mono`).
- **State & Validation**: Zustand 5, Zod 4.
