import type { CulturalArtifact } from '@/types/catalog';

export const CULTURAL_ARTIFACTS: CulturalArtifact[] = [
  {
    id: 'lomekwi-stone-core',
    accessionNumber: 'ACC-A-001',
    type: 'artifact',
    name: 'Lomekwi 3 Basalt Anvil Core (LOM3-2011)',
    subtitle: 'Oldest Known Stone Tool Technology in the Archaeological Record',
    hook: 'Knapped 3.3 million years ago in Kenya, this heavy volcanic stone core proves hominins invented toolmaking half a million years before the genus Homo even existed.',
    story:
      'In 2011, an archaeological team led by Sonia Harmand took a wrong turn through the eroded badlands west of Lake Turkana, Kenya, and stumbled upon a discovery that rewrote human origins. Eroding out of 3.3-million-year-old volcanic sediments were massive basaltic cores, anvils, and razor-sharp flakes. Named the Lomekwian industry, these artifacts are 700,000 years older than the famous Oldowan tools and predate the earliest known fossils of the genus Homo. By smashing cobbles against stationary stone anvils, Pliocene hominins launched the technological trajectory that defines our species.',
    facts: [
      'Dated to 3.30 million years ago via paleomagnetic stratigraphy and Argon-Argon dated volcanic tuffs.',
      'Predates the earliest known fossil of the genus Homo (LD 350-1 at 2.8 Ma) by 500,000 years.',
      'Crafted using passive-hammer and bipolar anvil percussion rather than freehand knapping.',
      'Demonstrates that stone fracture mechanics were understood by Australopithecus or Kenyanthropus hominins.'
    ],
    whyItMatters:
      'Pushed the dawn of archaeology back by 700,000 years and decoupled the invention of technology from the origin of the genus Homo.',
    description:
      'Massive volcanic phonolite core knapped by bipolar percussion 3.3 million years ago—predating the earliest fossil evidence of the genus Homo.',
    curatorialEssay:
      'Excavated west of Lake Turkana in Kenya in 2011, the Lomekwi 3 assemblage pushed the origin of lithic technology back by 700,000 years before the Oldowan industry. Discrete percussion scars show that Pliocene hominins (likely Kenyanthropus platyops or Australopithecus afarensis) deliberately rotated cobbles against fixed stone anvils to detach sharp cutting flakes.',
    stageIds: ['cenozoic'],
    ageMa: 3.3,
    ageDisplay: '3.30 Ma',
    culture: 'Lomekwian Lithic Industry',
    archaeologicalPeriod: 'Pliocene / Pre-Oldowan Paleolithic',
    originRegion: 'West Turkana, Rift Valley, Kenya',
    material: 'Basaltic phonolite volcanic cobble',
    technique: 'Passive hammer & bipolar anvil percussion knapping',
    homininSpecies: 'Kenyanthropus platyops / Australopithecus afarensis',
    dimensions: '19.5 cm × 14.8 cm × 11.2 cm (Weight: 3.15 kg)',
    model: '/models/lomekwi-core.glb',
    modelPreset: 'lomekwi-core',
    source: 'Harmand et al. (2015), Nature 521, 310–315; National Museums of Kenya WT-LOM3.',
    sourceInstitution: 'National Museums of Kenya / Turkana Basin Institute',
    sourceUrl: 'https://doi.org/10.1038/nature14464',
    license: 'Public Scientific Record / Academic Citation',
    orbitCoordinates: { lat: 3.91, lon: 35.81 }
  },
  {
    id: 'acheulean-biface-handaxe',
    accessionNumber: 'ACC-A-002',
    type: 'artifact',
    name: 'Olduvai Gorge Acheulean Biface Handaxe',
    subtitle: 'Symmetrical Teardrop Stone Tool of Homo erectus',
    hook: 'The Swiss Army knife of the Paleolithic: a symmetrical teardrop stone axe whose design lasted over a million years across three continents.',
    story:
      'Around 1.76 million years ago in East Africa, Homo erectus stopped merely knocking sharp chips off river cobbles and began sculpting the stone core itself toward a mental blueprint. This Olduvai Gorge Bed II handaxe is a masterpiece of Acheulean bifacial engineering. Using heavy hammerstones for roughing out and softer bone or antler billets to thin the edges, the maker achieved striking bilateral symmetry across both planes. From butchering megafauna to digging tubers, the Acheulean handaxe remained humanity’s flagship technology for over 1.3 million years—the longest-running product design on Earth.',
    facts: [
      'Exhibits intentional three-dimensional bilateral symmetry requiring multi-step hierarchical planning.',
      'Brain imaging of modern knappers shows Acheulean biface production activates Broca’s language area.',
      'Carried by Homo erectus out of Africa across Eurasia, from South Africa to Boxgrove in Britain.',
      'Excavated from Bed II at Olduvai Gorge, Tanzania, following Mary Leakey’s stratigraphic typology.'
    ],
    whyItMatters:
      'Marks the cognitive emergence of an internal mental template, aesthetic symmetry, and high-fidelity cultural transmission across tens of thousands of generations.',
    description:
      'Bifacially flaked quartzite handaxe exhibiting bilateral symmetry, a mental template, and ergonomic cutting edges across a million-year tradition.',
    curatorialEssay:
      'Emerging around 1.76 million years ago, the Acheulean handaxe represents the longest-lasting technological design in human history. Unlike opportunistic Oldowan flakes, crafting a symmetrical teardrop biface required hierarchical planning, soft-hammer bone retouching, and a shared cultural aesthetic passed across thousands of generations.',
    stageIds: ['cenozoic'],
    ageMa: 1.4,
    ageDisplay: '1.40 Ma',
    culture: 'Acheulean Industry (Mode 2 Lithic)',
    archaeologicalPeriod: 'Lower Paleolithic (Early Stone Age)',
    originRegion: 'Olduvai Gorge (Bed II), Serengeti Plains, Tanzania',
    material: 'Coarse-grained metamorphic quartzite & phonolite',
    technique: 'Hard-hammer primary flaking with soft-hammer bifacial retouch',
    homininSpecies: 'Homo erectus / Homo ergaster',
    dimensions: '17.6 cm × 9.8 cm × 4.4 cm',
    model: '/models/acheulean-handaxe.glb',
    modelPreset: 'acheulean-handaxe',
    source: 'Leakey (1971), Olduvai Gorge Vol. 3; Smithsonian NMNH Anthropology Cast A412980.',
    sourceInstitution: 'Smithsonian National Museum of Natural History / British Museum',
    sourceUrl: 'https://humanorigins.si.edu/evidence/behavior/stone-tools',
    license: 'Smithsonian CC0 Open Access',
    featured: true,
    orbitCoordinates: { lat: -2.99, lon: 35.35 }
  },
  {
    id: 'blombos-engraved-ochre',
    accessionNumber: 'ACC-A-003',
    type: 'artifact',
    name: 'Blombos Cave Engraved Ochre Plaque (SAM-AA 8938)',
    subtitle: 'Earliest Abstract Geometric Symbolism by Homo sapiens',
    hook: 'Seventy-five thousand years ago on the South African coast, a human ground a crimson stone flat and carved the world’s oldest surviving geometric design.',
    story:
      'High in a limestone cliff overlooking the Indian Ocean at Blombos Cave, South Africa, archaeologists uncovered a palm-sized slab of deep red iron-oxide ochre sealed in 75,000-year-old hearth ash. First, an early Homo sapiens ground one edge flat against coarse quartzite to create a prepared canvas. Then, using a sharp stone point with steady, deliberate pressure, the maker incised two parallel horizontal lines intersected by a diagonal cross-hatched diamond lattice. Thirty-five millennia older than European cave paintings, this geometric engraving is the earliest unambiguous artifact of abstract symbolic thought.',
    facts: [
      'Dated to ~75,000–77,000 BP via optically stimulated luminescence (OSL) and thermoluminescence of burnt lithics.',
      'Microscopic groove analysis confirms the cross-hatched lattice was engraved in a single planned session.',
      'Found alongside perforated Nassarius kraussianus shell beads stained with red ochre pigment.',
      'Predates Upper Paleolithic European cave art (Chauvet, Lascaux) by more than 35,000 years.'
    ],
    whyItMatters:
      'Proves that abstract symbolic syntax, visual art, and behavioral modernity originated in Africa among Middle Stone Age Homo sapiens.',
    description:
      'Hematite red ochre slab intentionally ground flat and incised with a cross-hatched diamond lattice 75,000 years ago on the South African coast.',
    curatorialEssay:
      'Recovered from Middle Stone Age strata at Blombos Cave, this crimson iron-oxide block provides irrefutable proof that behavioral modernity and abstract symbolic syntax emerged in Africa tens of millennia before the Upper Paleolithic cave paintings of Europe. Microscopic analysis shows the bevel was ground smooth before a sharp lithic point engraved the parallel chevrons.',
    stageIds: ['cenozoic'],
    ageMa: 0.075,
    ageDisplay: '0.075 Ma (75,000 BP)',
    culture: 'Still Bay Middle Stone Age Tradition',
    archaeologicalPeriod: 'Middle Stone Age (Upper Pleistocene)',
    originRegion: 'Blombos Cave, Southern Cape Coastline, South Africa',
    material: 'Ferruginous hematite-rich red ochre siltstone',
    technique: 'Quartzite grinding abrasion & lithic burin cross-hatch engraving',
    homininSpecies: 'Anatomically Modern Homo sapiens',
    dimensions: '7.58 cm × 3.48 cm × 2.47 cm',
    model: '/models/blombos-ochre.glb',
    modelPreset: 'blombos-ochre',
    source: 'Henshilwood et al. (2002), Science 295(5558), 1278–1280; Iziko South African Museum SAM-AA 8938.',
    sourceInstitution: 'Iziko South African Museum / Smithsonian Human Origins Program',
    sourceUrl: 'https://doi.org/10.1038/science.1067575',
    license: 'Smithsonian CC0 Cast Reference',
    featured: true,
    orbitCoordinates: { lat: -34.41, lon: 21.22 }
  },
  {
    id: 'willendorf-paleolithic-figurine',
    accessionNumber: 'ACC-A-004',
    type: 'artifact',
    name: 'Gravettian Oolitic Limestone Figurine',
    subtitle: 'Upper Paleolithic Portable Sculptural Icon',
    hook: 'A palm-sized Ice Age limestone sculpture carried hundreds of kilometers across the Alps by mammoth-steppe hunter-gatherers 29,500 years ago.',
    story:
      'Excavated in 1908 from Paleolithic loess terraces above the Danube River in Lower Austria, this 11-centimeter figurine was carved with flint burins 29,500 years ago as Ice Age glaciers advanced across Europe. Instead of depicting facial features, the sculptor lavished attention on seven concentric rows of braided hair or woven fiber cap and coated the stone in crimson hematite ochre. In 2022, high-resolution micro-CT scans solved the mystery of its porous oolitic limestone: the rock contains Jurassic micro-shells matched to Lake Garda in northern Italy, proving Ice Age humans carried it across the Alps.',
    facts: [
      '2022 micro-CT tomography matched internal Jurassic oolite grains and brachiopod shell fragments to northern Italy.',
      'Demonstrates trans-Alpine mobility (>700 km) of Gravettian hunter-gatherers during the Last Glacial Period.',
      'Crown features seven concentric horizontal bands representing complex Paleolithic fiber weaving.',
      'Natural navel cavity was formed by a dissolved limonitic concretion intentionally centered by the artist.'
    ],
    whyItMatters:
      'Reveals continental-scale social networks, shared figurative iconography, and sophisticated textile traditions across Ice Age Europe.',
    description:
      'Carved non-local oolitic limestone statuette tinted with red ochre, exemplifying trans-European Ice Age artistic networks 29,500 years ago.',
    curatorialEssay:
      'Carved with flint burins during the Last Glacial Maximum, Upper Paleolithic portable figurines demonstrate long-distance material transport and shared cosmological iconography across mammoth-steppe hunter-gatherer bands. High-resolution micro-CT tomography revealed that the porous oolitic limestone originated hundreds of kilometers away from the Danube find-spot.',
    stageIds: ['cenozoic'],
    ageMa: 0.03,
    ageDisplay: '0.030 Ma (29,500 BP)',
    culture: 'Gravettian Upper Paleolithic Culture',
    archaeologicalPeriod: 'Upper Paleolithic (Late Pleistocene)',
    originRegion: 'Wachau Valley, Lower Austria, Central Europe',
    material: 'Oolitic limestone with hematite red ochre pigment traces',
    technique: 'Flint lithic carving, pecking, and ochre burnishing',
    homininSpecies: 'Homo sapiens',
    dimensions: '11.1 cm × 5.7 cm × 4.5 cm',
    model: '/models/venus-figurine.glb',
    modelPreset: 'venus-figurine',
    source: 'Weber et al. (2022), Scientific Reports 12, 2926; Naturhistorisches Museum Wien NHMW-Prae-44606.',
    sourceInstitution: 'Natural History Museum Vienna (NHMW)',
    sourceUrl: 'https://doi.org/10.1038/s41598-022-06799-z',
    license: 'CC-BY 4.0 / Public Scientific Archive',
    orbitCoordinates: { lat: 48.32, lon: 15.4 }
  },
  {
    id: 'jomon-flame-rimmed-vessel',
    accessionNumber: 'ACC-A-005',
    type: 'artifact',
    name: 'Jōmon Cord-Marked Ceramic Vessel (Kaen-Doki)',
    subtitle: 'Pre-Agricultural Hunter-Gatherer Pyrotechnology',
    hook: 'Baroque, flame-crowned earthenware created by Japanese forest and maritime hunter-gatherers millennia before intensive agriculture.',
    story:
      'Archaeology once taught that pottery was invented only after farming forced humans to settle down and store grain. Japan’s Jōmon tradition overturned that rule. Beginning over 16,000 years ago, affluent hunter-gatherers along Honshu’s rivers and coastlines used fire to transform soft wet clay into durable stone-like cooking vessels—unlocking calories from acorns, chestnuts, and marine shellfish. By the Middle Jōmon period in the snowy Shinano River basin, potters pushed coiled clay to breathtaking sculptural extremes, crowning their vessels with swirling "flame-style" (Kaen-Doki) cockscomb rims and twisted-cord impressions.',
    facts: [
      'Jōmon ("cord-marked") derives from pressing twisted plant-fiber cords into damp clay before open-pit firing.',
      'Lipid residue analysis of charred interior crusts confirms boiling of salmonids, marine mammals, and forest nuts.',
      'Constructed entirely by hand-coiling tempered clay without a potter’s wheel and fired at ~600–800°C.',
      'Demonstrates that sedentary villages and monumental ceramic art flourished without cereal agriculture.'
    ],
    whyItMatters:
      'Proves that ceramic pyrotechnology and complex sedentary society emerged among foraging communities long before the Neolithic agricultural transition.',
    description:
      'Sculptural earthenware cooking vessel featuring twisted-cord (jōmon) surface impressions and dramatic flame-like rim projections.',
    curatorialEssay:
      'The Jōmon archipelago produced the world’s earliest ceramic tradition (~14,500 BCE), proving that complex pyrotechnology and sedentary village storage emerged among maritime forest hunter-gatherers millennia before intensive cereal farming. By Middle Jōmon, potters transformed utilitarian cooking pots into baroque, three-dimensional ritual sculptures.',
    stageIds: ['cenozoic'],
    ageMa: 0.012,
    ageDisplay: '0.012 Ma (c. 10,000–3,000 BCE)',
    culture: 'Jōmon Culture (Shinano River Basin Tradition)',
    archaeologicalPeriod: 'Incipient to Middle Jōmon Period (Holocene)',
    originRegion: 'Niigata Prefecture, Honshu, Japan',
    material: 'Low-fired earthenware clay tempered with mica and plant fibers',
    technique: 'Coiled clay construction, cord-wrapped rolling, open-pit firing (~700°C)',
    homininSpecies: 'Homo sapiens',
    dimensions: '46.5 cm height × 38.0 cm rim diameter',
    model: '/models/jomon-vessel.glb',
    modelPreset: 'jomon-vessel',
    source: 'Habu (2004), Ancient Jomon of Japan; Tokyo National Museum / British Museum OA+.724.',
    sourceInstitution: 'Tokyo National Museum / Smithsonian Freer Gallery of Art',
    sourceUrl: 'https://www.tnm.jp/',
    license: 'CC0 Public Domain Cultural Heritage',
    orbitCoordinates: { lat: 37.42, lon: 138.85 }
  },
  {
    id: 'uruk-proto-cuneiform-tablet',
    accessionNumber: 'ACC-A-006',
    type: 'artifact',
    name: 'Uruk IV Administrative Cuneiform Tablet',
    subtitle: 'Inauguration of Recorded Human Writing & Accounting',
    hook: 'Pressed with a cut reed into wet Mesopotamian river clay 5,100 years ago, this barley ledger marks the exact boundary where prehistory ends and recorded history begins.',
    story:
      'Around 3100 BCE in the southern Mesopotamian metropolis of Uruk (modern Warka, Iraq), tens of thousands of citizens depended on temple granaries, herds, and breweries. Spoken memory could no longer track the flow of barley and labor. Scribes solved the bottleneck by smoothing a cushion of alluvial Euphrates clay and pressing the corner of a cut reed stylus into the surface: circular impressions recorded sexagesimal numbers, while incised pictograms denoted grain, beer jars, and officials. With this humble accounting ledger, humanity externalized memory outside the biological brain.',
    facts: [
      'Excavated from the Eanna temple precinct at Uruk (Level IV–III, c. 3100–3000 BCE).',
      'Uses a proto-sexagesimal (base-60) numerical system that still governs our 60-minute hour and 360-degree circle.',
      'Combines impressed numerical metrological marks with incised ideographs for barley (ŠE) and ration bowls (NINDA).',
      'Digitized by the Cuneiform Digital Library Initiative (CDLI) and The British Museum.'
    ],
    whyItMatters:
      'Inaugurated recorded human history by inventing writing—allowing knowledge, law, science, and memory to survive across millennia.',
    description:
      'Sun-baked alluvial clay tablet impressed with reed-stylus numerical bullae and wedge-shaped pictograms recording barley rations in ancient Sumer.',
    curatorialEssay:
      'When urban populations surged in the southern Mesopotamian floodplain around 3100 BCE, temple administrators outgrew human memory. By pressing a bevel-cut reed stylus into damp Tigris–Euphrates clay, scribes invented external information storage—marking the formal boundary between geological prehistory and documented human history.',
    stageIds: ['cenozoic'],
    ageMa: 0.005,
    ageDisplay: '0.005 Ma (c. 3100 BCE)',
    culture: 'Sumerian / Late Uruk Urban Civilization (Uruk III–IV)',
    archaeologicalPeriod: 'Chalcolithic to Early Bronze Age',
    originRegion: 'Uruk (Warka), Southern Mesopotamia (Modern Iraq)',
    material: 'Levigated alluvial Euphrates clay',
    technique: 'Cut-reed stylus impression and sun/kiln hardening',
    homininSpecies: 'Homo sapiens',
    dimensions: '9.4 cm × 6.8 cm × 2.3 cm',
    scaleMeters: 0.094,
    model: '/models/cuneiform-tablet.glb',
    modelPreset: 'cuneiform-tablet',
    source: 'Nissen, Damerow & Englund (1993), Archaic Bookkeeping; British Museum ME 116730 / CDLI P005312.',
    sourceInstitution: 'The British Museum / Cuneiform Digital Library Initiative (CDLI)',
    sourceUrl: 'https://cdli.mpiwg-berlin.mpg.de/',
    license: 'CC0 Open Access Archival Record',
    featured: true,
    orbitCoordinates: { lat: 31.32, lon: 45.64 }
  },
  {
    id: 'rosetta-stone-slab',
    accessionNumber: 'ACC-A-007',
    type: 'artifact',
    name: 'The Rosetta Stone (Memphis Decree of Ptolemy V)',
    subtitle: 'Trilingual Granodiorite Stele That Unlocked Egyptian Hieroglyphs',
    hook: 'Carved in three scripts—Hieroglyphic, Demotic, and Ancient Greek—this 760-kilogram dark granodiorite slab broke a 1,400-year silence of ancient Egyptian civilization.',
    story:
      'Issued at Memphis in 196 BCE on the first anniversary of the coronation of thirteen-year-old King Ptolemy V Epiphanes, this royal decree was inscribed in three scripts so that priests, administrative scribes, and Greek rulers could all read it. Rediscovered in July 1799 built into a medieval fort wall near the Nile Delta town of Rashid (Rosetta), its parallel texts allowed Thomas Young and Jean-François Champollion in 1822 to crack the phonetic code of royal cartouches—restoring three millennia of Egyptian history to human memory.',
    facts: [
      'Carved from dark grey-pinkish Middle Egypt granodiorite (not basalt), weighing 760 kilograms.',
      'Contains 14 lines of Hieroglyphs (top), 32 lines of Egyptian Demotic (middle), and 54 lines of Ancient Greek (bottom).',
      'Champollion proved in 1822 that hieroglyphs were a hybrid phonetic and ideographic script, not pure symbolism.',
      'Digitized at sub-millimeter photogrammetric fidelity by The British Museum (EA 24).'
    ],
    whyItMatters:
      'Serves as the foundational cryptographic key of modern archaeology, enabling the translation of three thousand years of Egyptian literature, astronomy, and statecraft.',
    description:
      'Broken granodiorite stele inscribed with a 196 BCE royal priestly decree in Egyptian Hieroglyphs, Demotic script, and Koine Greek.',
    curatorialEssay:
      'Displayed continuously in the British Museum since 1802, the Rosetta Stone transformed Egyptology from antiquarian speculation into a rigorous philological science.',
    stageIds: ['cenozoic'],
    ageMa: 0.0022,
    ageDisplay: '0.0022 Ma (196 BCE)',
    culture: 'Ptolemaic Kingdom of Egypt (Hellenistic Memphis Synod)',
    archaeologicalPeriod: 'Hellenistic / Ptolemaic Period',
    originRegion: 'Rashid (Rosetta), Nile Delta, Egypt (Originally Memphis)',
    material: 'Dark grey-pinkish porphyritic granodiorite',
    technique: 'Chiseled sunken relief and incised lapidary epigraphy',
    homininSpecies: 'Homo sapiens',
    dimensions: '112.3 cm × 75.7 cm × 28.4 cm (Weight: 760 kg)',
    scaleMeters: 1.123,
    model: '/models/rosetta-stone-slab.glb',
    modelPreset: 'rosetta-stone',
    source: 'Parkinson (1999), Cracking Codes: The Rosetta Stone; British Museum EA 24.',
    sourceInstitution: 'The British Museum (Department of Egypt and Sudan, EA 24)',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/Y_EA24',
    license: 'British Museum Open Access / CC BY-NC-SA 4.0 Reference',
    featured: true,
    orbitCoordinates: { lat: 31.4, lon: 30.42 }
  },
  {
    id: 'antikythera-mechanism',
    accessionNumber: 'ACC-A-008',
    type: 'artifact',
    name: 'The Antikythera Mechanism (Fragment A Gearwork)',
    subtitle: 'Ancient Greek Bronze Geared Astronomical Computer (c. 150–100 BCE)',
    hook: 'Thirty-seven interlocking bronze gears recovered from a Roman shipwreck that predicted solar eclipses, lunar phases, and the Olympic Games two millennia before modern clockwork.',
    story:
      'In 1901, sponge divers sheltering from a storm off the Greek island of Antikythera discovered a sunken first-century BCE Roman treasure ship. Among marble statues lay a corroded lump of green bronze split open to reveal precision-cut triangular gear teeth and tiny Greek astronomical inscriptions. Micro-focus X-ray computed tomography (CT) scans later revealed an astonishing mechanical cosmos: a hand-cranked analog computer housing at least 30 bronze gears—including an epicyclic pin-and-slot mechanism modeling the Moon’s elliptical orbit (Kepler’s first law anomaly) and spiral dials for the 19-year Metonic and 223-month Saros eclipse cycles.',
    facts: [
      'Contains at least 30 precision-cut bronze gears with 1.5 mm equilateral triangular teeth.',
      'Uses an epicyclic pin-and-slot differential gear train to model the Moon’s variable orbital velocity.',
      'Back spiral dials compute the 19-year (235-month) Metonic calendar and 223-lunar-month Saros eclipse cycle.',
      'Micro-CT X-ray tomography decoded over 3,400 hidden Greek characters forming an operational manual.'
    ],
    whyItMatters:
      'Rewrote the history of technology by proving that Hellenistic engineers mastered complex differential clockwork and mathematical gear trains 1,500 years before European astronomical clocks.',
    description:
      'Corroded Hellenistic bronze geared analog computer preserving main drive wheel b1, epicyclic lunar differential gears, and inscribed zodiac/calendar rings.',
    curatorialEssay:
      'Housed in the National Archaeological Museum of Athens (X 15087), the Antikythera Mechanism stands as the most sophisticated scientific instrument surviving from antiquity.',
    stageIds: ['cenozoic'],
    ageMa: 0.0021,
    ageDisplay: '0.0021 Ma (c. 120 BCE)',
    culture: 'Hellenistic Greek (Rhodes / Syracuse Posidonian School)',
    archaeologicalPeriod: 'Late Hellenistic Period',
    originRegion: 'Antikythera Shipwreck, Aegean Sea, Greece',
    material: 'Low-tin arsenical bronze plates and gear wheels in wooden frame',
    technique: 'Precision hand-filed gear cutting, pin-and-slot epicyclic assembly, micro-epigraphy',
    homininSpecies: 'Homo sapiens',
    dimensions: '34.0 cm × 18.0 cm × 9.0 cm (Reconstructed wooden/bronze case)',
    scaleMeters: 0.34,
    model: '/models/antikythera-mechanism.glb',
    modelPreset: 'antikythera-mechanism',
    source: 'Freeth et al. (2006), Nature 444, 587–591; Freeth et al. (2021), Scientific Reports 11.',
    sourceInstitution: 'National Archaeological Museum of Athens (X 15087)',
    sourceUrl: 'https://doi.org/10.1038/nature05357',
    license: 'Public Scientific Record / Antikythera Research Project',
    featured: true,
    orbitCoordinates: { lat: 35.86, lon: 23.31 }
  },
  {
    id: 'sutton-hoo-helmet',
    accessionNumber: 'ACC-A-009',
    type: 'artifact',
    name: 'The Sutton Hoo Anglo-Saxon Ship-Burial Helmet',
    subtitle: '7th-Century Regalia of King Rædwald of East Anglia',
    hook: 'Reassembled from over 500 corroded fragments, its gilt-bronze eyebrows, garnet eyes, and nose-guard form a soaring dragon across the warrior’s face.',
    story:
      'On the eve of World War II in summer 1939, self-taught archaeologist Basil Brown excavated Mound 1 at Sutton Hoo in Suffolk, England, uncovering the ghost impression of a 27-meter Anglo-Saxon warship. At the heart of the burial chamber lay a shattered ceremonial helmet of tinned iron, gilt bronze, silver wire, and blood-red Bohemian garnets. Look closely at the face mask: the eyebrows, nose, and mustache together form a spread-winged dragon flying upward to meet a second serpent arching along the iron crest—transforming the Early Medieval world once dismissed as the "Dark Ages" into a realm of dazzling goldsmithing and Beowulfian poetry.',
    facts: [
      'Reconstructed by British Museum conservator Nigel Williams from more than 500 iron and bronze fragments.',
      'Eyebrows are inlaid with silver wire and cloisonné garnets over gold foil, terminating in gilt-bronze boars’ heads.',
      'Left eyebrow lacks gold foil backings behind its garnets, appearing dark in dim firelight—an intentional allusion to the one-eyed god Woden (Odin).',
      'Repoussé die-stamped foil panels depict dancing twin-speared warriors and mounted combat.'
    ],
    whyItMatters:
      'Overturned the myth of a culturally barren post-Roman "Dark Age" in Britain and provided a tangible material counterpart to the epic poem Beowulf.',
    description:
      'Ceremonial Anglo-Saxon iron parade helmet adorned with tinned bronze repoussé panels, silver-inlaid dragon crest, and cloisonné garnet eyebrows.',
    curatorialEssay:
      'Likely buried with King Rædwald of East Anglia around 625 CE, the Sutton Hoo helmet synthesizes Scandinavian Vendel-style animal art with late Roman parade armor traditions.',
    stageIds: ['cenozoic'],
    ageMa: 0.0014,
    ageDisplay: '0.0014 Ma (c. 625 CE)',
    culture: 'Early Anglo-Saxon Kingdom of East Anglia (Wuffingas Dynasty)',
    archaeologicalPeriod: 'Early Medieval / Vendel-Insular Period',
    originRegion: 'Sutton Hoo, Woodbridge, Suffolk, England',
    material: 'Iron, tinned copper alloy, gilt bronze, silver, and almandine garnet',
    technique: 'Wrought iron smithing, pressblech die-stamping, and garnet cloisonné',
    homininSpecies: 'Homo sapiens',
    dimensions: '31.8 cm × 21.5 cm × 25.5 cm (Weight: 2.5 kg)',
    scaleMeters: 0.318,
    model: '/models/sutton-hoo-helmet.glb',
    modelPreset: 'sutton-hoo-helmet',
    source: 'Bruce-Mitford (1978), The Sutton Hoo Ship-Burial Vol. 2; British Museum 1939,1010.93.',
    sourceInstitution: 'The British Museum (1939,1010.93)',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/H_1939-1010-93',
    license: 'British Museum Open Access / CC BY-NC-SA 4.0',
    featured: true,
    orbitCoordinates: { lat: 52.09, lon: 1.34 }
  },
  {
    id: 'terracotta-warrior-general',
    accessionNumber: 'ACC-A-010',
    type: 'artifact',
    name: 'Qin Dynasty Terracotta Army Armored General',
    subtitle: 'Life-Sized Polychrome Ceramic Guardian of First Emperor Qin Shi Huang',
    hook: 'One of 8,000 individualized clay soldiers engineered on a modular assembly line in 210 BCE—and no two faces in the subterranean army are identical.',
    story:
      'When well-diggers outside Xi’an struck fired terracotta in March 1974, they uncovered a subterranean garrison built to guard China’s First Emperor, Qin Shi Huang, in the afterlife. Standing 1.96 meters tall, this high-ranking Armored General wears a double-tailed pheasant headdress, fish-scale lamellar cuirass tied with sculpted silk cords, and upturned square-toed shoes. Master artisans combined standardized kiln-fired body modules with hand-sculpted ears, mustaches, and facial expressions, then coated the figures in toxic purple and vermilion lacquer.',
    facts: [
      'Tallest rank in the underground pits (196 cm), distinguished by a double-layered robe and swallowtail cap.',
      'Manufactured via cellular workshop production (Gong-guan) with each artisan stamping their name for quality control.',
      'Originally painted in vibrant mineral pigments including synthetic barium-copper-silicate ("Han Purple").',
      'Preserved in Pit 1 of the Mausoleum of the First Qin Emperor, Lintong District, Shaanxi (c. 210 BCE).'
    ],
    whyItMatters:
      'Demonstrates the industrial standardization, bureaucratic logistics, and sculptural realism of the unified Qin Empire in the 3rd century BCE.',
    description:
      'Life-sized kiln-fired terracotta statue of a high-ranking Qin military general in overlapping lamellar armor and pheasant-tail cap.',
    curatorialEssay:
      'The Qin Terracotta Army represents the earliest known deployment of modular mass-production with individualized artisanal finishing in world history.',
    stageIds: ['cenozoic'],
    ageMa: 0.0022,
    ageDisplay: '0.0022 Ma (210 BCE)',
    culture: 'Imperial Qin Dynasty (Unification of China)',
    archaeologicalPeriod: 'Warring States to Qin Imperial Transition',
    originRegion: 'Lintong, Xi’an, Shaanxi Province, China',
    material: 'Loess-tempered gray terracotta clay with生漆 (qi) lacquer traces',
    technique: 'Coiled & molded modular assembly, kiln firing at 950–1050°C, polychrome lacquer',
    homininSpecies: 'Homo sapiens',
    dimensions: '196.0 cm × 68.0 cm × 48.0 cm (Weight: ~180 kg)',
    scaleMeters: 1.96,
    model: '/models/terracotta-warrior-general.glb',
    modelPreset: 'terracotta-warrior',
    source: 'Portal (2007), The First Emperor: China’s Terracotta Army; Emperor Qinshihuang’s Mausoleum Site Museum.',
    sourceInstitution: 'Emperor Qinshihuang’s Mausoleum Site Museum, Xi’an',
    sourceUrl: 'http://www.bmy.com.cn/',
    license: 'UNESCO World Heritage Cultural Record',
    orbitCoordinates: { lat: 34.38, lon: 109.27 }
  },
  {
    id: 'bust-of-nefertiti',
    accessionNumber: 'ACC-A-011',
    type: 'artifact',
    name: 'Polychrome Limestone Bust of Queen Nefertiti',
    subtitle: 'Sculptor Thutmose’s Masterpiece Model from Amarna (c. 1345 BCE)',
    hook: 'Carved from a limestone core layered with micro-sculpted gypsum stucco, this 3,370-year-old royal portrait still retains its original Egyptian Blue and red ochre pigments.',
    story:
      'Uncovered on December 6, 1912, in the workshop of royal court sculptor Thutmose at Tell el-Amarna, this life-sized portrait of Great Royal Wife Nefertiti served as the master reference model (kanon) for all other statues of the queen. CT scans inside the bust revealed a delicately carved limestone face beneath thin layers of gypsum stucco where Thutmose subtly softened the nasolabial folds and cheekbones. Her right eye is inlaid with rock crystal over black beeswax, while the left socket was never inlaid.',
    facts: [
      'Non-destructive CT scanning in 2006 revealed a second, more naturalistic wrinkled face carved in the inner limestone core.',
      'Pigments include synthetic calcium copper silicate (Egyptian Blue), iron oxide red ochre, and arsenic sulfide orpiment.',
      'Engineered so the heavy cantilevered blue crown balances perfectly over the slender limestone neck without tipping.',
      'Excavated from House P47.2 (Workshop of Thutmose) at Akhetaten (Tell el-Amarna).'
    ],
    whyItMatters:
      'Captures the radical artistic revolution of the Amarna Period (18th Dynasty) and preserves intact New Kingdom mineral pigments.',
    description:
      'Stucco-coated limestone portrait bust of Queen Nefertiti wearing the flat-topped Amarna royal blue crown and beaded floral collar.',
    curatorialEssay:
      'Created during the reign of Pharaoh Akhenaten (~1345 BCE), the bust exemplifies the naturalistic anatomical sensitivity and geometric balance of Amarna court workshops.',
    stageIds: ['cenozoic'],
    ageMa: 0.0033,
    ageDisplay: '0.0033 Ma (c. 1345 BCE)',
    culture: 'New Kingdom Egypt (18th Dynasty / Amarna Period)',
    archaeologicalPeriod: 'Late Bronze Age (Amarna Interlude)',
    originRegion: 'Tell el-Amarna (Akhetaten), Middle Egypt',
    material: 'Limestone core, gypsum anhydrite stucco, rock crystal eye inlay, mineral pigments',
    technique: 'Subtractive limestone carving with additive multi-layer gypsum modeling',
    homininSpecies: 'Homo sapiens',
    dimensions: '48.0 cm × 24.5 cm × 35.0 cm (Weight: 20 kg)',
    scaleMeters: 0.48,
    model: '/models/bust-of-nefertiti.glb',
    modelPreset: 'nefertiti-bust',
    source: 'Borchardt (1923), Porträtkopf der Königin Nofretete; Neues Museum Berlin ÄM 21300.',
    sourceInstitution: 'Ägyptisches Museum und Papyrussammlung, Neues Museum Berlin (ÄM 21300)',
    sourceUrl: 'https://www.smb.museum/',
    license: 'Public Domain 3D Cultural Heritage Scan',
    featured: true,
    orbitCoordinates: { lat: 27.64, lon: 30.9 }
  },
  {
    id: 'rapa-nui-moai',
    accessionNumber: 'ACC-A-012',
    type: 'artifact',
    name: 'Rapa Nui Volcanic Tuff Moai Monolith (Hoa Hakananai’a)',
    subtitle: 'Polynesian Ancestral Deified Monolith with Petroglyph Reliefs',
    hook: 'Carved from volcanic stone and "walked" upright with ropes across Easter Island to watch over coastal clan villages with living coral eyes.',
    story:
      'Between 1250 and 1500 CE, Rapa Nui master carvers (tangata maori anga moai) quarried nearly a thousand monolithic ancestor statues from the compressed volcanic ash of Rano Raraku crater. Far from being "just heads," Moai possess full torsos with stylized hands resting over the abdomen and sacred loincloth (maro) carvings on their backs. Once erected on coastal stone platforms (ahu), white coral and red scoria eyes were fitted into their sockets to awaken the ancestral mana.',
    facts: [
      'Back of Hoa Hakananai’a is carved in low relief with Tangata Manu (Birdman) ceremonial petroglyphs and Polynesian paddles.',
      'Experimental archaeology confirmed Moai were rocked side-to-side upright ("walked") using three hemp-rope teams.',
      'Cylindrical red scoria topknots (Pukao) weighing up to 11 tons were balanced on the head after erection on the ahu.',
      'Laser-scanned in sub-millimeter 3D to preserve eroding dorsal petroglyphs.'
    ],
    whyItMatters:
      'Demonstrates the monumental megalithic engineering and ecological resilience of Polynesia’s most isolated oceanic society.',
    description:
      'Monolithic volcanic basalt/tuff ancestor figure (aringa ora) featuring heavy brow ridges, elongated ears, and a cylindrical red scoria pukao.',
    curatorialEssay:
      'Representing deified ancestors ("the living face of the ancestors"), Moai stood with their backs to the Pacific Ocean to project protective mana inward over clan agricultural lands.',
    stageIds: ['cenozoic'],
    ageMa: 0.0007,
    ageDisplay: '0.0007 Ma (c. 1300 CE)',
    culture: 'Rapa Nui Polynesian Civilization (Orongo & Rano Raraku Traditions)',
    archaeologicalPeriod: 'ahu Moai Megalithic Phase / Birdman Transition',
    originRegion: 'Orongo / Rano Raraku, Rapa Nui (Easter Island), Polynesia',
    material: 'Flow-laminated trachytic basalt and Rano Raraku volcanic tuff',
    technique: 'Basalt pick (toki) pecking, pumice polishing, and bas-relief petroglyph carving',
    homininSpecies: 'Homo sapiens',
    dimensions: '242.0 cm × 96.0 cm × 47.0 cm (Weight: 4,200 kg)',
    scaleMeters: 2.42,
    model: '/models/rapa-nui-moai.glb',
    modelPreset: 'rapa-nui-moai',
    source: 'Van Tilburg (1994), Easter Island: Archaeology, Ecology and Culture; Pitts et al. (2014).',
    sourceInstitution: 'Museo Antropológico Padre Sebastián Englert / British Museum Am1869,1005.1',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/E_Am1869-1005-1',
    license: 'Open Heritage 3D Archive / CC BY-NC-SA 4.0',
    orbitCoordinates: { lat: -27.12, lon: -109.35 }
  },
  {
    id: 'babylonian-imago-mundi',
    accessionNumber: 'ACC-A-013',
    type: 'artifact',
    name: 'Babylonian Map of the World (Imago Mundi Tablet)',
    subtitle: 'Oldest Known Cartographic Diagram of the Known Cosmos (c. 600 BCE)',
    hook: 'Incised into clay at Sippar around 600 BCE, this circular schematic places Babylon at the center of the world encircled by the "Bitter River" and eight mythical outer islands.',
    story:
      'Long before Greek geographers drew spherical globes, a Neo-Babylonian scholar in southern Iraq inscribed both a cuneiform mythological treatise and a geometric map onto a palm-sized clay tablet. Two concentric circles mark the "Bitter River" (Marratu—the salt ocean encircling the flat earth), cut through the center by the parallel lines of the Euphrates flowing from the northern mountains into southern marshes. Radiating outward like points of a star are triangular regions (nagû) where "the winged bird cannot safely complete its flight" and heroic beasts dwell.',
    facts: [
      'Oldest surviving world map in human history, excavated by Hormuzd Rassam at Sippar (Abu Habba) in 1882.',
      'Combines real empirical Mesopotamian geography (Babylon, Assyria, Urartu, Susa) with cosmic mythology.',
      'Cuneiform text on the reverse references the Epic of Gilgamesh and the Babylonian flood hero Utnapishtim.',
      'Preserved in the British Museum Kouyunjik/Sippar Collection (BM 92687).'
    ],
    whyItMatters:
      'Marks humanity’s transition from local land-survey plans to a unified, bird’s-eye cartographic abstraction of the entire world.',
    description:
      'Cuneiform clay tablet incised with a circular compass-drawn world map surrounded by the cosmic salt ocean (Marratu) and triangular outer islands.',
    curatorialEssay:
      'By abstracting kingdoms, rivers, mountains, and cosmic horizons into a single geometric diagram, the Sippar Imago Mundi inaugurated global cartography.',
    stageIds: ['cenozoic'],
    ageMa: 0.0026,
    ageDisplay: '0.0026 Ma (c. 600 BCE)',
    culture: 'Neo-Babylonian Empire (Sippar Scribal Archive)',
    archaeologicalPeriod: 'Iron Age III / Neo-Babylonian Period',
    originRegion: 'Sippar (Tell Abu Habba), Baghdad Governorate, Iraq',
    material: 'Kiln-baked Mesopotamian alluvial clay',
    technique: 'Compass-incised cartography and reed-stylus cuneiform epigraphy',
    homininSpecies: 'Homo sapiens',
    dimensions: '12.2 cm × 8.2 cm × 2.5 cm',
    scaleMeters: 0.122,
    model: '/models/babylonian-imago-mundi.glb',
    modelPreset: 'babylonian-world-map',
    source: 'Horowitz (1998), Mesopotamian Cosmic Geography; British Museum BM 92687.',
    sourceInstitution: 'The British Museum (BM 92687)',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/W_1882-0714-509',
    license: 'British Museum Open Access / CC0 Archival Reference',
    orbitCoordinates: { lat: 33.06, lon: 44.25 }
  }
];

