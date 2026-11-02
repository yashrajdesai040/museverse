/**
 * Museverse Institutional Museum Provenance & Archival Registry
 * Maps physical entity repositories to verified official institutional portals and digital archives.
 */

export interface MuseumProvenance {
  institutionName: string;
  shortName: string;
  cityCountry: string;
  catalogId: string;
  officialUrl: string;
  archiveSection: string;
  curatorialTier: 'National Primary' | 'Global Reference' | 'Imperial Monolith' | 'Field Specimen';
}

const INSTITUTION_REGISTRY: { match: RegExp; info: Omit<MuseumProvenance, 'catalogId'> }[] = [
  {
    match: /western australian museum/i,
    info: {
      institutionName: 'Western Australian Museum',
      shortName: 'WA Museum Boola Bardip',
      cityCountry: 'Perth, Australia',
      officialUrl: 'https://visit.museum.wa.gov.au/',
      archiveSection: 'Earth & Planetary Sciences / Archean Geobiology',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /geological survey of western australia/i,
    info: {
      institutionName: 'Geological Survey of Western Australia',
      shortName: 'GSWA Perth',
      cityCountry: 'Perth, Australia',
      officialUrl: 'https://www.dmp.wa.gov.au/Geological-Survey/',
      archiveSection: 'Cratonic Lithology & Deep-Time Mineral Core',
      curatorialTier: 'Global Reference',
    },
  },
  {
    match: /natural history museum, london|nhmuk/i,
    info: {
      institutionName: 'Natural History Museum, London',
      shortName: 'NHM London',
      cityCountry: 'London, United Kingdom',
      officialUrl: 'https://www.nhm.ac.uk/',
      archiveSection: 'Department of Earth Sciences / Invertebrate Paleobiology',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /natural history museum of denmark/i,
    info: {
      institutionName: 'Natural History Museum of Denmark',
      shortName: 'Statens Naturhistoriske Museum',
      cityCountry: 'Copenhagen, Denmark',
      officialUrl: 'https://snm.ku.dk/english/',
      archiveSection: 'Paleontological Research Collections',
      curatorialTier: 'Global Reference',
    },
  },
  {
    match: /natural history museum collections worldwide/i,
    info: {
      institutionName: 'Natural History Museum Global Consortium',
      shortName: 'NHM Consortium',
      cityCountry: 'Global Curatorial Alliance',
      officialUrl: 'https://www.nhm.ac.uk/our-science/collections.html',
      archiveSection: 'Comparative Apex Marine Chondrichthyes Archive',
      curatorialTier: 'Global Reference',
    },
  },
  {
    match: /cleveland museum of natural history/i,
    info: {
      institutionName: 'Cleveland Museum of Natural History',
      shortName: 'Cleveland MNH',
      cityCountry: 'Cleveland, Ohio, USA',
      officialUrl: 'https://www.cmnh.org/',
      archiveSection: 'Vertebrate Paleontology & Paleoanthropology Vault',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /smithsonian/i,
    info: {
      institutionName: 'Smithsonian National Museum of Natural History',
      shortName: 'Smithsonian NMNH',
      cityCountry: 'Washington D.C., USA',
      officialUrl: 'https://naturalhistory.si.edu/',
      archiveSection: 'National Paleobiology & Ceratopsian Holotype Reserve',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /field museum/i,
    info: {
      institutionName: 'The Field Museum of Natural History',
      shortName: 'The Field Museum',
      cityCountry: 'Chicago, Illinois, USA',
      officialUrl: 'https://www.fieldmuseum.org/',
      archiveSection: 'Department of Geology & SUE Apex Theropod Hall',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /mongolian academy of sciences/i,
    info: {
      institutionName: 'Mongolian Academy of Sciences (Paleontology Institute)',
      shortName: 'MAS Paleontology',
      cityCountry: 'Ulaanbaatar, Mongolia',
      officialUrl: 'https://www.amnh.org/exhibitions/fighting-dinos',
      archiveSection: 'Central Asian Gobi Basin Cretaceous Expedition',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /national museum of ethiopia/i,
    info: {
      institutionName: 'National Museum of Ethiopia',
      shortName: 'NME Addis Ababa',
      cityCountry: 'Addis Ababa, Ethiopia',
      officialUrl: 'https://whc.unesco.org/en/list/10',
      archiveSection: 'Paleoanthropology & Early Hominid Origins Vault',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /shemanovsky/i,
    info: {
      institutionName: 'Shemanovsky Museum and Exhibition Center',
      shortName: 'Shemanovsky Museum',
      cityCountry: 'Salekhard, Yamalo-Nenets, Russia',
      officialUrl: 'https://mvk.yanao.ru/',
      archiveSection: 'Arctic Cryo-Preservation & Pleistocene Mammoth Lab',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /la brea/i,
    info: {
      institutionName: 'La Brea Tar Pits & George C. Page Museum',
      shortName: 'La Brea Tar Pits',
      cityCountry: 'Los Angeles, California, USA',
      officialUrl: 'https://tarpits.org/',
      archiveSection: 'Quaternary Asphalt Asphaltic Megafauna Repository',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /national museum of ireland/i,
    info: {
      institutionName: 'National Museum of Ireland – Natural History',
      shortName: 'NMI Dublin',
      cityCountry: 'Dublin, Ireland',
      officialUrl: 'https://www.museum.ie/',
      archiveSection: 'Irish Quaternary Bog Specimens & Cervid Osteology',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /naturhistorisches museum, vienna|nhm wien/i,
    info: {
      institutionName: 'Naturhistorisches Museum Wien',
      shortName: 'NHM Vienna',
      cityCountry: 'Vienna, Austria',
      officialUrl: 'https://www.nhm-wien.ac.at/',
      archiveSection: 'Department of Prehistory & Anthropological Sanctuary',
      curatorialTier: 'Imperial Monolith',
    },
  },
  {
    match: /south tyrol museum of archaeology/i,
    info: {
      institutionName: 'South Tyrol Museum of Archaeology',
      shortName: 'South Tyrol Museum (Ötzi)',
      cityCountry: 'Bolzano, South Tyrol, Italy',
      officialUrl: 'https://www.iceman.it/',
      archiveSection: 'Copper Age Glacial Cryo-Sanctuary & Alpine Technology',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /louvre/i,
    info: {
      institutionName: 'Musée du Louvre',
      shortName: 'The Louvre',
      cityCountry: 'Paris, France',
      officialUrl: 'https://www.louvre.fr/',
      archiveSection: 'Département des Antiquités Orientales (Mesopotamia)',
      curatorialTier: 'Imperial Monolith',
    },
  },
  {
    match: /egyptian museum, cairo/i,
    info: {
      institutionName: 'The Egyptian Museum in Tahrir',
      shortName: 'Egyptian Museum Cairo',
      cityCountry: 'Cairo, Egypt',
      officialUrl: 'https://egymonuments.gov.eg/museums/egyptian-museum/',
      archiveSection: '18th Dynasty Royal Funerary Gold Treasury',
      curatorialTier: 'Imperial Monolith',
    },
  },
  {
    match: /neues museum/i,
    info: {
      institutionName: 'Neues Museum Berlin (Staatliche Museen)',
      shortName: 'Neues Museum',
      cityCountry: 'Berlin, Germany',
      officialUrl: 'https://www.smb.museum/en/museums-institutions/neues-museum/home/',
      archiveSection: 'Ägyptisches Museum und Papyrussammlung / Amarna Room',
      curatorialTier: 'Imperial Monolith',
    },
  },
  {
    match: /qin shi huang|terracotta/i,
    info: {
      institutionName: "Emperor Qinshihuang's Mausoleum Site Museum",
      shortName: 'Terracotta Warriors Museum',
      cityCountry: "Xi'an, Shaanxi, China",
      officialUrl: 'http://www.bmy.com.cn/',
      archiveSection: 'Pit 1 Imperial Vanguard & Polychrome Ceramic Vault',
      curatorialTier: 'Imperial Monolith',
    },
  },
  {
    match: /british museum/i,
    info: {
      institutionName: 'The British Museum',
      shortName: 'British Museum',
      cityCountry: 'London, United Kingdom',
      officialUrl: 'https://www.britishmuseum.org/',
      archiveSection: 'Department of Ancient Egypt and Sudan (Rosetta Archive)',
      curatorialTier: 'Imperial Monolith',
    },
  },
  {
    match: /national archaeological museum, athens/i,
    info: {
      institutionName: 'National Archaeological Museum of Athens',
      shortName: 'NAM Athens',
      cityCountry: 'Athens, Greece',
      officialUrl: 'https://www.namuseum.gr/',
      archiveSection: 'Antikythera Shipwreck & Hellenistic Mechanical Collection',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /bayeux/i,
    info: {
      institutionName: 'Musée de la Tapisserie de Bayeux',
      shortName: 'Bayeux Museum',
      cityCountry: 'Bayeux, Normandy, France',
      officialUrl: 'https://www.bayeuxmuseum.com/en/the-bayeux-tapestry/',
      archiveSection: '11th-Century Norman Romanesque Textile Sanctuary',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /library of congress/i,
    info: {
      institutionName: 'Library of Congress',
      shortName: 'Library of Congress',
      cityCountry: 'Washington D.C., USA',
      officialUrl: 'https://www.loc.gov/exhibits/bibles/',
      archiveSection: 'Rare Book and Special Collections Division (Vellum Vault)',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /leicester museum/i,
    info: {
      institutionName: 'Leicester Museum & Art Gallery',
      shortName: 'Leicester Museum',
      cityCountry: 'Leicester, United Kingdom',
      officialUrl: 'https://www.leicestermuseums.org/leicester-museum-art-gallery/',
      archiveSection: 'Ediacaran Biota & Charnia Discovery Archive',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /south australian museum/i,
    info: {
      institutionName: 'South Australian Museum',
      shortName: 'SAM Adelaide',
      cityCountry: 'Adelaide, South Australia',
      officialUrl: 'https://www.samuseum.sa.gov.au/',
      archiveSection: 'Ediacara Member Geological Type Specimens',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /royal ontario museum/i,
    info: {
      institutionName: 'Royal Ontario Museum',
      shortName: 'ROM Toronto',
      cityCountry: 'Toronto, Ontario, Canada',
      officialUrl: 'https://www.rom.on.ca/',
      archiveSection: 'Burgess Shale Cambrian Paleobiology Department',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /royal tyrrell/i,
    info: {
      institutionName: 'Royal Tyrrell Museum of Palaeontology',
      shortName: 'Royal Tyrrell Museum',
      cityCountry: 'Drumheller, Alberta, Canada',
      officialUrl: 'https://tyrrellmuseum.com/',
      archiveSection: 'Mesozoic Dinosaur Research Laboratory & Borealopelta Vault',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /muséum national d histoire naturelle/i,
    info: {
      institutionName: "Muséum National d'Histoire Naturelle",
      shortName: 'MNHN Paris',
      cityCountry: 'Paris, France',
      officialUrl: 'https://www.mnhn.fr/',
      archiveSection: 'Galerie de Paléontologie et d’Anatomie Comparée',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /national museums of kenya/i,
    info: {
      institutionName: 'National Museums of Kenya',
      shortName: 'NMK Nairobi',
      cityCountry: 'Nairobi, Kenya',
      officialUrl: 'https://museums.or.ke/',
      archiveSection: 'Lake Turkana Hominin Fossil Heritage Division',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /iziko/i,
    info: {
      institutionName: 'Iziko South African Museum',
      shortName: 'Iziko Museum',
      cityCountry: 'Cape Town, South Africa',
      officialUrl: 'https://www.iziko.org.za/museums/south-african-museum/',
      archiveSection: 'Karoo Basin Permian Synapsid & Therapsid Archive',
      curatorialTier: 'National Primary',
    },
  },
  {
    match: /tokyo national museum/i,
    info: {
      institutionName: 'Tokyo National Museum',
      shortName: 'TNM Tokyo',
      cityCountry: 'Tokyo, Japan',
      officialUrl: 'https://www.tnm.jp/',
      archiveSection: 'Heiseikan Japanese Archaeological Gallery (Jomon Flame)',
      curatorialTier: 'Imperial Monolith',
    },
  },
  {
    match: /pergamonmuseum/i,
    info: {
      institutionName: 'Pergamonmuseum – Staatliche Museen zu Berlin',
      shortName: 'Pergamonmuseum',
      cityCountry: 'Berlin, Germany',
      officialUrl: 'https://www.smb.museum/en/museums-institutions/pergamonmuseum/home/',
      archiveSection: 'Vorderasiatisches Museum (Ishtar Gate & Babylon)',
      curatorialTier: 'Imperial Monolith',
    },
  },
];

/**
 * Resolve verified provenance metadata for any museum entity based on location and ID.
 */
export function getMuseumProvenance(currentLocation?: string, entityId?: string): MuseumProvenance {
  const loc = currentLocation || '';
  const matched = INSTITUTION_REGISTRY.find((entry) => entry.match.test(loc));

  const catalogId = entityId
    ? `MV-SPEC-${entityId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`
    : 'MV-SPEC-ARCHIVAL';

  if (matched) {
    return {
      ...matched.info,
      catalogId,
    };
  }

  // Fallback for general or worldwide collections
  return {
    institutionName: loc || 'International Museum Consortium',
    shortName: loc ? loc.split(',')[0].trim() : 'Curatorial Consortium',
    cityCountry: loc.includes(',') ? loc.split(',').slice(1).join(',').trim() : 'International Collection',
    catalogId,
    officialUrl: `https://www.google.com/search?q=${encodeURIComponent((loc || 'museum') + ' specimen collection')}`,
    archiveSection: 'Global Paleobiology & Cultural Heritage Consortium',
    curatorialTier: 'Global Reference',
  };
}
