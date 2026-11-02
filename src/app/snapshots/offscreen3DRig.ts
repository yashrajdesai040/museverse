import * as THREE from 'three';
import { buildProceduralSpecimenGroup } from './specimenBuilder';
import { buildPlanetaryStageGroup } from './planetaryBuilder';

export class Offscreen3DRig {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private width: number;
  private height: number;

  constructor(width = 800, height = 800) {
    this.width = width;
    this.height = height;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(2.8, 2.2, 4.0);
    this.camera.lookAt(0, 0, 0);

    this.setupLighting();
  }

  private setupLighting() {
    // Curatorial Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(5, 8, 6);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb4d4ff, 1.2);
    fillLight.position.set(-6, 2, -4);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd400, 1.4);
    rimLight.position.set(0, -5, -4);
    this.scene.add(rimLight);
  }

  private getRenderer(): THREE.WebGLRenderer {
    if (!this.renderer) {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(2); // High DPI
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;
      this.renderer.setClearColor(0x0a0a0c, 1);
    }
    return this.renderer;
  }

  public async renderModelToDataUrl(
    modelId: string,
    renderMode: 'pbr' | 'wireframe' | 'xray' = 'pbr'
  ): Promise<string> {
    const renderer = this.getRenderer();

    // Clear previous objects
    const toRemove: THREE.Object3D[] = [];
    this.scene.children.forEach((c) => {
      if (c instanceof THREE.Group) toRemove.push(c);
    });
    toRemove.forEach((c) => this.scene.remove(c));

    // Build model or stage
    let objectGroup: THREE.Group;
    if (modelId.startsWith('stage-')) {
      objectGroup = buildPlanetaryStageGroup(modelId);
      this.camera.position.set(0, 0.5, 4.4);
      this.camera.lookAt(0, 0, 0);
    } else {
      const baseKey = modelId.replace('model-', '').replace('scene-', '');
      objectGroup = buildProceduralSpecimenGroup(baseKey, { renderMode });
      this.camera.position.set(2.8, 2.0, 3.8);
      this.camera.lookAt(0, 0, 0);
    }

    // Slight angle tilt for museum aesthetic
    objectGroup.rotation.y = 0.45;
    objectGroup.rotation.x = 0.15;
    this.scene.add(objectGroup);

    // Render 2 frames to settle
    renderer.render(this.scene, this.camera);
    await new Promise((res) => requestAnimationFrame(res));
    renderer.render(this.scene, this.camera);

    const dataUrl = renderer.domElement.toDataURL('image/png');
    return dataUrl;
  }

  public dispose() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
