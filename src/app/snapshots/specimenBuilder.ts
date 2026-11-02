import * as THREE from 'three';

export interface ModelBuildOptions {
  renderMode?: 'pbr' | 'wireframe' | 'xray';
}

function applyRenderMode(group: THREE.Group, mode: 'pbr' | 'wireframe' | 'xray') {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (mode === 'wireframe') {
        obj.material = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          wireframe: true,
          transparent: true,
          opacity: 0.85,
        });
      } else if (mode === 'xray') {
        obj.material = new THREE.MeshPhysicalMaterial({
          color: 0x70d6ff,
          transparent: true,
          opacity: 0.35,
          roughness: 0.1,
          transmission: 0.9,
          thickness: 1.2,
          wireframe: false,
        });
      }
    }
  });
}

export function buildProceduralSpecimenGroup(
  modelId: string,
  options: ModelBuildOptions = { renderMode: 'pbr' }
): THREE.Group {
  const root = new THREE.Group();
  const mode = options.renderMode || 'pbr';

  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xe8e2d2,
    roughness: 0.45,
    metalness: 0.05,
  });

  const darkBoneMat = new THREE.MeshStandardMaterial({
    color: 0x2b2723,
    roughness: 0.65,
    metalness: 0.1,
  });

  const amberStoneMat = new THREE.MeshStandardMaterial({
    color: 0xb58a5c,
    roughness: 0.8,
    metalness: 0.15,
  });

  const flintMat = new THREE.MeshStandardMaterial({
    color: 0x3f3d3b,
    roughness: 0.3,
    metalness: 0.1,
  });

  const clayMat = new THREE.MeshStandardMaterial({
    color: 0xa46b4d,
    roughness: 0.9,
    metalness: 0.02,
  });

  const goldBrassMat = new THREE.MeshStandardMaterial({
    color: 0xdfaf37,
    roughness: 0.25,
    metalness: 0.85,
  });

  switch (modelId) {
    case 'trilobite': {
      // Cephalon (Head shield)
      const cephalonGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.5, 32, 1, false, -Math.PI / 2, Math.PI);
      const cephalon = new THREE.Mesh(cephalonGeo, darkBoneMat);
      cephalon.rotation.x = Math.PI / 2;
      cephalon.position.z = 1.0;
      root.add(cephalon);

      // Thorax segments
      for (let i = 0; i < 9; i++) {
        const segScale = 1.3 - i * 0.08;
        const segGeo = new THREE.BoxGeometry(segScale * 2, 0.18, 0.25);
        const seg = new THREE.Mesh(segGeo, darkBoneMat);
        seg.position.set(0, 0, 0.7 - i * 0.32);
        root.add(seg);

        // Pleural spines
        const spineL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.6, 6), darkBoneMat);
        spineL.rotation.z = Math.PI / 2.5;
        spineL.position.set(-segScale, 0, 0.7 - i * 0.32);
        const spineR = spineL.clone();
        spineR.rotation.z = -Math.PI / 2.5;
        spineR.position.set(segScale, 0, 0.7 - i * 0.32);
        root.add(spineL, spineR);
      }

      // Pygidium (Tail shield)
      const pygidiumGeo = new THREE.CylinderGeometry(0.6, 0.2, 0.35, 16, 1, false, -Math.PI / 2, Math.PI);
      const pygidium = new THREE.Mesh(pygidiumGeo, darkBoneMat);
      pygidium.rotation.x = Math.PI / 2;
      pygidium.rotation.z = Math.PI;
      pygidium.position.z = -2.2;
      root.add(pygidium);

      // Compound Eyes
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), amberStoneMat);
      eyeL.position.set(-0.7, 0.25, 0.9);
      const eyeR = eyeL.clone();
      eyeR.position.x = 0.7;
      root.add(eyeL, eyeR);
      break;
    }

    case 'ammonite': {
      // Golden Spiral Chambers
      const count = 38;
      for (let i = 0; i < count; i++) {
        const theta = i * 0.28;
        const r = 0.22 * Math.exp(0.17 * theta);
        const tubeR = 0.09 * Math.exp(0.16 * theta);
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);

        const chamberGeo = new THREE.TorusGeometry(tubeR, tubeR * 0.45, 16, 32);
        const chamber = new THREE.Mesh(chamberGeo, boneMat);
        chamber.position.set(x, y, 0);
        chamber.rotation.z = theta;
        root.add(chamber);
      }
      root.scale.set(0.65, 0.65, 0.65);
      break;
    }

    case 't-rex-skull': {
      // Massive Cretaceous Cranium
      const craniumGeo = new THREE.BoxGeometry(1.4, 1.2, 2.6);
      const cranium = new THREE.Mesh(craniumGeo, boneMat);
      cranium.position.set(0, 0.4, 0.3);
      root.add(cranium);

      // Snout / Maxilla
      const snoutGeo = new THREE.ConeGeometry(0.8, 2.4, 4);
      const snout = new THREE.Mesh(snoutGeo, boneMat);
      snout.rotation.x = Math.PI / 2;
      snout.position.set(0, 0.1, 1.8);
      root.add(snout);

      // Serrated Teeth Row
      for (let i = 0; i < 14; i++) {
        const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.5, 6), boneMat);
        tooth.rotation.x = Math.PI;
        tooth.position.set(i % 2 === 0 ? 0.45 : -0.45, -0.4, 0.8 + (i * 0.15));
        root.add(tooth);
      }

      // Lower Jaw (Mandible)
      const mandibleGeo = new THREE.BoxGeometry(1.2, 0.35, 2.8);
      const mandible = new THREE.Mesh(mandibleGeo, boneMat);
      mandible.position.set(0, -0.65, 0.8);
      root.add(mandible);
      break;
    }

    case 'australopithecus-skull': {
      // Hominin AL 288-1 Lucy Skull
      const cranium = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 24), boneMat);
      cranium.scale.set(1.0, 1.15, 1.25);
      cranium.position.set(0, 0.4, -0.1);
      root.add(cranium);

      // Heavy supraorbital torus (brow ridge)
      const brow = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.4, 16), boneMat);
      brow.rotation.z = Math.PI / 2;
      brow.position.set(0, 0.4, 1.05);
      root.add(brow);

      // Prognathic face / jaw
      const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 1.1), boneMat);
      jaw.position.set(0, -0.3, 0.65);
      root.add(jaw);
      break;
    }

    case 'stromatolite': {
      // Laminated cyanobacterial accretion mound
      for (let i = 0; i < 7; i++) {
        const radius = 1.6 - i * 0.18;
        const layer = new THREE.Mesh(
          new THREE.CylinderGeometry(radius * 0.9, radius, 0.28, 28),
          amberStoneMat
        );
        layer.position.y = -0.8 + i * 0.28;
        root.add(layer);
      }
      break;
    }

    case 'archaeopteryx': {
      // Solnhofen limestone slab
      const slab = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.2, 0.3), boneMat);
      slab.position.z = -0.15;
      root.add(slab);

      // Embedded skeleton impression
      const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 1.8, 12), darkBoneMat);
      spine.position.set(0, 0, 0.05);
      root.add(spine);

      // Left & Right Wings
      const wingL = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.4, 4), darkBoneMat);
      wingL.rotation.z = Math.PI / 3;
      wingL.position.set(-0.7, 0.2, 0.06);
      const wingR = wingL.clone();
      wingR.rotation.z = -Math.PI / 3;
      wingR.position.x = 0.7;
      root.add(wingL, wingR);
      break;
    }

    case 'tiktaalik': {
      // Flat crocodile-like skull
      const head = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.0, 4), boneMat);
      head.rotation.x = Math.PI / 2;
      head.scale.set(1.3, 0.4, 1.0);
      root.add(head);

      // Pectoral fin-lobes (wrist joint precursors)
      const finL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.45), boneMat);
      finL.rotation.y = Math.PI / 4;
      finL.position.set(-1.0, -0.1, -0.4);
      const finR = finL.clone();
      finR.rotation.y = -Math.PI / 4;
      finR.position.x = 1.0;
      root.add(finL, finR);
      break;
    }

    case 'mammoth-jaw': {
      // Heavy curved mandible with flat grinding molars
      const jawL = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.35, 12, 24, Math.PI * 0.8), boneMat);
      jawL.rotation.x = Math.PI / 2;
      jawL.rotation.z = Math.PI * 0.6;
      root.add(jawL);

      // Massive grinding molar
      const molar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 1.4), darkBoneMat);
      molar.position.set(0, 0.15, 0.2);
      root.add(molar);
      break;
    }

    case 'achulean-handaxe': {
      // Symmetrical teardrop biface
      const axe = new THREE.Mesh(new THREE.ConeGeometry(0.95, 2.4, 6), flintMat);
      axe.scale.set(1.0, 1.0, 0.32);
      root.add(axe);
      break;
    }

    case 'venus-figurine': {
      // Paleolithic volumetric fertility totem
      const torso = new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 20), clayMat);
      torso.scale.set(1.1, 1.3, 1.1);
      root.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), clayMat);
      head.position.y = 1.35;
      root.add(head);
      break;
    }

    case 'lascaux-tablet': {
      // Cave wall fragment with relief
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5, 1), amberStoneMat);
      rock.scale.set(1.4, 1.0, 0.35);
      root.add(rock);

      // Polychrome pigment symbol
      const symbol = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 12, 24), darkBoneMat);
      symbol.position.z = 0.5;
      root.add(symbol);
      break;
    }

    case 'sumerian-cuneiform': {
      // Kiln-baked clay tablet with stamped wedge impressions
      const tablet = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.6, 0.4), clayMat);
      root.add(tablet);

      // Wedge rows
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
          const wedge = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 3), flintMat);
          wedge.rotation.z = Math.PI / 4;
          wedge.position.set(-0.7 + c * 0.35, 0.9 - r * 0.35, 0.22);
          root.add(wedge);
        }
      }
      break;
    }

    // Specialized Scene Props
    case 'robot-guide': {
      // Docent Automaton Unit 01
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.8, 1.5, 24), goldBrassMat);
      root.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), boneMat);
      head.position.y = 1.15;
      root.add(head);

      const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.3, 16), flintMat);
      eye.rotation.x = Math.PI / 2;
      eye.position.set(0, 1.15, 0.45);
      root.add(eye);
      break;
    }

    case 'ticket-counter': {
      // Monolith reception desk
      const desk = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 1.4), darkBoneMat);
      root.add(desk);

      const scanner = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.8), goldBrassMat);
      scanner.position.set(0.8, 0.65, 0);
      root.add(scanner);
      break;
    }

    case 'physics-ticket': {
      // Museum Admission Holographic Pass
      const pass = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 0.05), goldBrassMat);
      root.add(pass);

      const foil = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.9), flintMat);
      foil.position.set(-0.7, 0, 0.035);
      root.add(foil);
      break;
    }

    case 'asteroid-impact': {
      // Chicxulub bolide
      const meteor = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 2), darkBoneMat);
      root.add(meteor);

      // Trailing shockwave plume
      const plume = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.5, 16), amberStoneMat);
      plume.rotation.x = -Math.PI / 3;
      plume.position.set(0, 0.8, -1.2);
      root.add(plume);
      break;
    }

    case 'continental-drift': {
      // Tectonic globe with fractured plates
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), amberStoneMat);
      root.add(sphere);

      // Ridge boundaries
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.05, 16, 64), flintMat);
      root.add(ring);
      break;
    }

    default: {
      const fallback = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), boneMat);
      root.add(fallback);
    }
  }

  applyRenderMode(root, mode);
  return root;
}
