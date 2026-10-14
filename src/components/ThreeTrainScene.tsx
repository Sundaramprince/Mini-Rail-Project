import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sun, Moon, Lightbulb, Play, Pause, Camera, Eye, Sparkles } from 'lucide-react';

interface ThreeTrainSceneProps {
  className?: string;
  isHero?: boolean;
}

export const ThreeTrainScene: React.FC<ThreeTrainSceneProps> = ({ className = '', isHero = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Floating dock controls state
  const [speed, setSpeed] = useState<number>(90);
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [isNight, setIsNight] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'front' | 'trackside'>('orbit');

  // Internal mutable refs to avoid re-mounting three.js on state changes
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const headlightsRef = useRef(headlightsOn);
  headlightsRef.current = headlightsOn;

  const isNightRef = useRef(isNight);
  isNightRef.current = isNight;

  const cameraModeRef = useRef(cameraMode);
  cameraModeRef.current = cameraMode;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE & RENDERER SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightRef.current ? 0x050c18 : 0x0f2e5a);
    scene.fog = new THREE.FogExp2(isNightRef.current ? 0x050c18 : 0x0f2e5a, 0.025);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(10, 4.5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. STUDIO PBR LIGHTING
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    dirLight.position.set(15, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Trackside amber accent light
    const tracksideLight = new THREE.PointLight(0xf97316, 0.6, 25);
    tracksideLight.position.set(-6, 3, 2);
    scene.add(tracksideLight);

    // 3. PROCEDURAL PROCEDURAL TEXTURES (Zero external URLs)
    const createStripedTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 128, 128);
      // Navy & Orange Livery Band
      ctx.fillStyle = '#0f2e5a';
      ctx.fillRect(0, 40, 128, 20);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(0, 60, 128, 10);
      return new THREE.CanvasTexture(canvas);
    };

    const liveryTexture = createStripedTexture();
    liveryTexture.wrapS = THREE.RepeatWrapping;
    liveryTexture.wrapT = THREE.RepeatWrapping;

    // 4. COMPOSITE PROCEDURAL MODEL: INDIAN RAILWAYS VANDE BHARAT (12+ Distinct Parts)
    const trainGroup = new THREE.Group();

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.15,
      map: liveryTexture,
    });

    const navyMat = new THREE.MeshStandardMaterial({
      color: 0x0f2e5a,
      roughness: 0.3,
      metalness: 0.4,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
    });

    const metalDarkMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.8,
    });

    const metalSteelMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.3,
      metalness: 0.9,
    });

    const orangeAccentMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.3,
      metalness: 0.2,
    });

    const headlightGlowMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
    });

    // Part 1: Main Passenger Carriage Body
    const bodyGeo = new THREE.BoxGeometry(2.4, 2.2, 11);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.set(0, 1.8, -1);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    trainGroup.add(bodyMesh);

    // Part 2: Aerodynamic Tapered Nose (Front Wedge)
    const noseGeo = new THREE.CylinderGeometry(0.5, 1.25, 3.2, 16, 1, false, 0, Math.PI);
    const noseMesh = new THREE.Mesh(noseGeo, bodyMat);
    noseMesh.rotation.z = Math.PI / 2;
    noseMesh.rotation.y = Math.PI / 2;
    noseMesh.position.set(0, 1.6, 5.6);
    noseMesh.scale.set(1.4, 1, 0.9);
    noseMesh.castShadow = true;
    trainGroup.add(noseMesh);

    // Part 3: Driver Cockpit Windshield (Curved glass)
    const windshieldGeo = new THREE.BoxGeometry(2.0, 0.8, 1.2);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0, 2.2, 4.9);
    windshield.rotation.x = -0.38;
    trainGroup.add(windshield);

    // Part 4: Side Windows (Tinted panoramic strips)
    const windowStripGeo = new THREE.BoxGeometry(0.08, 0.65, 9.2);
    const leftWindows = new THREE.Mesh(windowStripGeo, glassMat);
    leftWindows.position.set(-1.21, 2.05, -1.2);
    trainGroup.add(leftWindows);

    const rightWindows = new THREE.Mesh(windowStripGeo, glassMat);
    rightWindows.position.set(1.21, 2.05, -1.2);
    trainGroup.add(rightWindows);

    // Part 5: Roof AC Units and Aerodynamic Shrouds
    const acUnitGeo = new THREE.BoxGeometry(1.6, 0.28, 2.2);
    const acUnit1 = new THREE.Mesh(acUnitGeo, metalDarkMat);
    acUnit1.position.set(0, 2.95, -3.2);
    trainGroup.add(acUnit1);

    const acUnit2 = new THREE.Mesh(acUnitGeo, metalDarkMat);
    acUnit2.position.set(0, 2.95, 1.5);
    trainGroup.add(acUnit2);

    // Part 6: Articulated High-Voltage Pantograph
    const pantographGroup = new THREE.Group();
    const pantoBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.4), metalDarkMat);
    pantographGroup.add(pantoBase);

    const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1);
    const arm1 = new THREE.Mesh(armGeo, orangeAccentMat);
    arm1.position.set(0.3, 0.5, 0);
    arm1.rotation.z = -0.35;
    pantographGroup.add(arm1);

    const arm2 = new THREE.Mesh(armGeo, orangeAccentMat);
    arm2.position.set(-0.3, 0.5, 0);
    arm2.rotation.z = 0.35;
    pantographGroup.add(arm2);

    const collectorBar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.15), metalSteelMat);
    collectorBar.position.set(0, 1.0, 0);
    pantographGroup.add(collectorBar);

    pantographGroup.position.set(0, 2.95, -1);
    trainGroup.add(pantographGroup);

    // Part 7: Dual High-Power LED Headlights
    const headlightGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 16);
    const leftHeadlight = new THREE.Mesh(headlightGeo, headlightGlowMat);
    leftHeadlight.rotation.x = Math.PI / 2;
    leftHeadlight.position.set(-0.65, 1.25, 6.7);
    trainGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeo, headlightGlowMat);
    rightHeadlight.rotation.x = Math.PI / 2;
    rightHeadlight.position.set(0.65, 1.25, 6.7);
    trainGroup.add(rightHeadlight);

    // Actual SpotLight cast onto tracks
    const trainSpotLight = new THREE.SpotLight(0xfef08a, 4.5, 30, Math.PI / 6, 0.4, 1.2);
    trainSpotLight.position.set(0, 1.3, 6.8);
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0, 25);
    scene.add(spotTarget);
    trainSpotLight.target = spotTarget;
    trainSpotLight.castShadow = true;
    scene.add(trainSpotLight);

    // Part 8: Undercarriage Skirts & Battery Equipment
    const undercarriageGeo = new THREE.BoxGeometry(2.1, 0.5, 9.8);
    const undercarriage = new THREE.Mesh(undercarriageGeo, metalDarkMat);
    undercarriage.position.set(0, 0.55, -0.8);
    trainGroup.add(undercarriage);

    // Part 9: Rotating Wheels and Bogies (4 Bogies, 8 Wheels)
    const wheelsList: THREE.Mesh[] = [];
    const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.14, 20);
    const wheelMat = metalSteelMat;

    const bogieZPositions = [-4.5, -2.5, 1.8, 3.8];
    bogieZPositions.forEach(z => {
      // Left wheel
      const wL = new THREE.Mesh(wheelGeo, wheelMat);
      wL.rotation.z = Math.PI / 2;
      wL.position.set(-0.95, 0.42, z);
      wL.castShadow = true;
      trainGroup.add(wL);
      wheelsList.push(wL);

      // Right wheel
      const wR = new THREE.Mesh(wheelGeo, wheelMat);
      wR.rotation.z = Math.PI / 2;
      wR.position.set(0.95, 0.42, z);
      wR.castShadow = true;
      trainGroup.add(wR);
      wheelsList.push(wR);

      // Axle bar
      const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8), metalDarkMat);
      axle.rotation.z = Math.PI / 2;
      axle.position.set(0, 0.42, z);
      trainGroup.add(axle);
    });

    // Part 10: Soft Radial Contact Shadow under train
    const shadowGeo = new THREE.PlaneGeometry(3.2, 16);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.02, 0.5);
    trainGroup.add(shadowMesh);

    scene.add(trainGroup);

    // 5. RAILWAY TRACKS & BALLAST GROUND (Moving under train to create motion)
    const trackGroup = new THREE.Group();

    // Ballast bed ground
    const ballastGeo = new THREE.PlaneGeometry(8, 80);
    const ballastMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ballast = new THREE.Mesh(ballastGeo, ballastMat);
    ballast.rotation.x = -Math.PI / 2;
    ballast.position.set(0, 0, 0);
    ballast.receiveShadow = true;
    trackGroup.add(ballast);

    // Parallel Steel Rails
    const railGeo = new THREE.BoxGeometry(0.08, 0.15, 80);
    const railMat = metalSteelMat;

    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(-0.85, 0.15, 0);
    trackGroup.add(leftRail);

    const rightRail = new THREE.Mesh(railGeo, railMat);
    rightRail.position.set(0.85, 0.15, 0);
    trackGroup.add(rightRail);

    // Sleepers (Cross ties)
    const sleeperGeo = new THREE.BoxGeometry(2.4, 0.1, 0.4);
    const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
    const sleeperGroup = new THREE.Group();

    for (let i = -38; i <= 38; i += 1.4) {
      const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper.position.set(0, 0.06, i);
      sleeper.receiveShadow = true;
      sleeperGroup.add(sleeper);
    }
    trackGroup.add(sleeperGroup);

    // Overhead Electric Catenary Wire & Poles
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.5);
    const poleMat = metalDarkMat;
    const catenaryGroup = new THREE.Group();

    for (let i = -30; i <= 30; i += 15) {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(-2.8, 2.75, i);
      catenaryGroup.add(pole);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.08), poleMat);
      arm.position.set(-1.8, 4.8, i);
      catenaryGroup.add(arm);
    }
    trackGroup.add(catenaryGroup);

    // Overhead traction wire
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 80), metalSteelMat);
    wire.rotation.x = Math.PI / 2;
    wire.position.set(0, 4.0, 0);
    trackGroup.add(wire);

    // Indian Railways Signal Post
    const signalGroup = new THREE.Group();
    const sPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.5), metalDarkMat);
    sPole.position.set(2.8, 2.25, 12);
    signalGroup.add(sPole);

    const sBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.4), metalDarkMat);
    sBox.position.set(2.8, 3.8, 12);
    signalGroup.add(sBox);

    const greenLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    greenLens.position.set(2.8, 3.5, 11.8);
    signalGroup.add(greenLens);

    const greenLight = new THREE.PointLight(0x22c55e, 1.2, 10);
    greenLight.position.set(2.8, 3.5, 11.5);
    signalGroup.add(greenLight);

    trackGroup.add(signalGroup);
    scene.add(trackGroup);

    // 6. SPEED PARTICLE SYSTEM (Sparks / Steam streaks)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 6;
      particlePositions[i + 1] = Math.random() * 2.5 + 0.1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. INTERACTIVE DAMPED CAMERA & MOUSE DRAG
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetAzimuth = 0.6;
    let targetElevation = 0.35;
    let targetDistance = 14;

    let currentAzimuth = targetAzimuth;
    let currentElevation = targetElevation;
    let currentDistance = targetDistance;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetAzimuth -= dx * 0.008;
      targetElevation = Math.max(0.08, Math.min(Math.PI / 2.3, targetElevation + dy * 0.008));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      targetDistance = Math.max(7, Math.min(26, targetDistance + e.deltaY * 0.015));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: true });

    // Touch support
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        targetAzimuth -= dx * 0.01;
        targetElevation = Math.max(0.08, Math.min(Math.PI / 2.3, targetElevation + dy * 0.01));
      }
    };
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });

    // 8. ANIMATION LOOP WITH LOSSLESS 60FPS & EXPONENTIAL DAMPING
    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const currentSpeed = speedRef.current;
      const velocity = currentSpeed * 0.08;

      // Rotate wheels based on speed
      wheelsList.forEach(w => {
        w.rotation.x += velocity * dt * 4;
      });

      // Subtle locomotive suspension vibration
      if (currentSpeed > 0) {
        trainGroup.position.y = Math.sin(time * 0.015) * 0.015;
        trainGroup.rotation.z = Math.sin(time * 0.008) * 0.004;
      }

      // Move tracks and sleepers backwards to simulate train forward motion
      trackGroup.position.z -= velocity * dt * 8;
      if (trackGroup.position.z < -14) {
        trackGroup.position.z = 0;
      }

      // Move particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 2; i < arr.length; i += 3) {
        arr[i] -= velocity * dt * 16;
        if (arr[i] < -20) {
          arr[i] = 20;
        }
      }
      posAttr.needsUpdate = true;

      // Update Headlight Intensity
      const hlOn = headlightsRef.current;
      trainSpotLight.intensity = hlOn ? (isNightRef.current ? 7.0 : 3.5) : 0;
      leftHeadlight.visible = hlOn;
      rightHeadlight.visible = hlOn;

      // Update Day / Night lighting
      const night = isNightRef.current;
      scene.background = new THREE.Color(night ? 0x050c18 : 0x0f2e5a);
      (scene.fog as THREE.FogExp2).color.set(night ? 0x050c18 : 0x0f2e5a);
      dirLight.intensity = night ? 0.3 : 1.8;
      dirLight.color.set(night ? 0x93c5fd : 0xfff7ed);
      hemiLight.intensity = night ? 0.3 : 0.8;

      // Damped Camera Positioning (1 - Math.exp(-k * dt))
      const damp = 1 - Math.exp(-8 * dt);
      const mode = cameraModeRef.current;

      if (mode === 'orbit') {
        currentAzimuth += (targetAzimuth - currentAzimuth) * damp;
        currentElevation += (targetElevation - currentElevation) * damp;
        currentDistance += (targetDistance - currentDistance) * damp;

        camera.position.x = currentDistance * Math.cos(currentElevation) * Math.sin(currentAzimuth);
        camera.position.y = currentDistance * Math.sin(currentElevation) + 1.2;
        camera.position.z = currentDistance * Math.cos(currentElevation) * Math.cos(currentAzimuth);
        camera.lookAt(0, 1.8, 1.5);
      } else if (mode === 'front') {
        camera.position.lerp(new THREE.Vector3(0, 2.2, 11), damp);
        camera.lookAt(0, 1.6, 2);
      } else {
        // Trackside view
        camera.position.lerp(new THREE.Vector3(-4.5, 0.8, -2), damp);
        camera.lookAt(0, 1.8, 4);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[360px] overflow-hidden ${className}`}>
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Viewport-First Controls Dock (<= 15% viewport footprint) */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-slate-900/90 text-white p-3 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        {/* Speed slider */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSpeed(speed === 0 ? 110 : 0)}
            className="p-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition"
            title={speed === 0 ? 'Start Train' : 'Halt Train'}
          >
            {speed === 0 ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Vande Bharat Throttle</div>
            <div className="font-mono font-bold text-orange-400 text-xs">{speed} km/h</div>
          </div>
          <input
            type="range"
            min={0}
            max={160}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-20 sm:w-24 accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5">
          {/* Headlights toggle */}
          <button
            type="button"
            onClick={() => setHeadlightsOn(!headlightsOn)}
            className={`p-1.5 rounded-lg border transition ${
              headlightsOn
                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title="Toggle Train LED Headlights"
          >
            <Lightbulb className="w-3.5 h-3.5" />
          </button>

          {/* Day / Night toggle */}
          <button
            type="button"
            onClick={() => setIsNight(!isNight)}
            className={`p-1.5 rounded-lg border transition ${
              isNight
                ? 'bg-indigo-500/30 border-indigo-400 text-indigo-300'
                : 'bg-amber-500/20 border-amber-400 text-amber-300'
            }`}
            title="Toggle Day / Night Ambience"
          >
            {isNight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Camera View Mode */}
          <button
            type="button"
            onClick={() => {
              const modes: ('orbit' | 'front' | 'trackside')[] = ['orbit', 'front', 'trackside'];
              const next = modes[(modes.indexOf(cameraMode) + 1) % modes.length];
              setCameraMode(next);
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 text-[11px] font-semibold border border-white/15"
            title="Cycle Camera Angles"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="capitalize">{cameraMode}</span>
          </button>
        </div>
      </div>

      {/* Subtle Hint Overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/60 text-white/80 text-[10px] px-2.5 py-1 rounded-full border border-white/10 pointer-events-none backdrop-blur-xs flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-orange-400" />
        <span>3D Indian Railways Engine &middot; Drag to orbit / Scroll to zoom</span>
      </div>
    </div>
  );
};
