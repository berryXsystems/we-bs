"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

// ─── SHARED SCROLL STATE (module-level ref, avoids prop drilling) ───
// This is the key architectural fix: module-level ref that all components read
const scrollRef = { current: 0 };
const rawScrollRef = { current: 0 };

// ─── HELPERS ─────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function invlerp(a, b, v) { return b === a ? 0 : clamp((v - a) / (b - a), 0, 1); }
// Maps value from one range to another
function remap(v, inA, inB, outA, outB) { return lerp(outA, outB, invlerp(inA, inB, v)); }

// ─── SCROLL REMAPPING ─────────────────────────────────────────────────
// Maps raw 10-scene scroll progress to the old 8-scene range.
// This preserves all existing component timing without changing any hardcoded values.
// Scenes 1-5 (raw 0-0.50) → old 0-0.62 (seed, roots, tree, panel1, panel2)
// Scenes 4c-4d (raw 0.50-0.70) → hold at old 0.62 (tree stays visible, frozen in grown state)
// Scenes 5-7 (raw 0.70-1.0) → old 0.62-1.0 (berry, fall, rebirth)
function mapScroll(rawP) {
  if (rawP <= 0.50) return rawP * 1.24;
  if (rawP <= 0.70) return 0.62;
  return 0.62 + (rawP - 0.70) * 1.2667;
}

// ─── ATMOSPHERIC PARTICLES ───────────────────────────────────────────
function Particles() {
  const ref = useRef();
  const COUNT = 900;
  
  const { positions, speeds } = useMemo(() => {
    const positions = [];
    const speeds = [];
    for (let i = 0; i < COUNT; i++) {
      positions.push(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 12
      );
      speeds.push(Math.random() * 0.6 + 0.2);
    }
    return { positions: new Float32Array(positions), speeds };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const geo = ref.current.geometry;
    const pos = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += Math.sin(t * 0.3 + speeds[i] * 10) * 0.001 * speeds[i];
      if (pos[i * 3 + 1] > 10) pos[i * 3 + 1] = -10;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#c8843a"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── SEED ─────────────────────────────────────────────────────────────
function Seed() {
  const groupRef    = useRef();
  const glowRef     = useRef();
  const innerLightRef = useRef();
  const bodyMatRef  = useRef(); // animated emissive

  useFrame(({ clock }) => {
    const p = scrollRef.current;
    const t = clock.getElapsedTime();

    const visible = p < 0.30;
    if (!visible && groupRef.current) { groupRef.current.visible = false; return; }
    if (groupRef.current) groupRef.current.visible = true;

    const fadeIn  = remap(p, 0.0, 0.04, 0, 1);
    const fadeOut = remap(p, 0.20, 0.30, 1, 0);
    const opacity = fadeIn * fadeOut;

    // ✨ Activation phase (p=0.07→0.12): seed senses the soil, pulses faster & hotter
    const activating = remap(p, 0.06, 0.12, 0, 1);        // 0 = dormant, 1 = fully activating
    const breakthrough = remap(p, 0.10, 0.14, 0, 1);       // roots breakthrough moment

    // Heartbeat frequency accelerates as seed activates (1 beat/s → 3 beats/s)
    const beatFreq  = lerp(2.2, 5.5, clamp(activating, 0, 1));
    const beatAmp   = lerp(0.04, 0.12, clamp(activating, 0, 1));
    const pulse = 1 + Math.sin(t * beatFreq) * beatAmp;

    // Rotation speeds up during activation
    const rotSpeed = lerp(0.15, 0.55, clamp(activating, 0, 1));

    if (groupRef.current) {
      groupRef.current.scale.setScalar(pulse * opacity);
      groupRef.current.rotation.y = t * rotSpeed;
      groupRef.current.rotation.x = Math.sin(t * 0.4) * clamp(activating, 0, 1) * 0.08;
    }

    if (glowRef.current) {
      // Glow sphere expands and brightens during activation
      const glowScale = lerp(1.0, 1.8, clamp(activating, 0, 1));
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = opacity * lerp(0.2, 0.55, clamp(activating, 0, 1));
    }

    if (bodyMatRef.current) {
      // Emissive intensity flares at the breakthrough moment
      const baseEmissive = lerp(0.8, 2.5, clamp(activating, 0, 1));
      const breakthroughFlash = clamp(breakthrough, 0, 1) * 2.0 * Math.pow(1 - clamp(breakthrough, 0, 1), 2);
      bodyMatRef.current.emissiveIntensity = baseEmissive + breakthroughFlash;
      // Hue shifts from amber to hot white at peak
      const heat = clamp(activating, 0, 1);
      bodyMatRef.current.emissive.setHSL(lerp(0.08, 0.1, heat), lerp(0.9, 0.5, heat), lerp(0.18, 0.5, heat));
    }

    if (innerLightRef.current) {
      const lightBoost = lerp(3.5, 9.0, clamp(activating, 0, 1));
      innerLightRef.current.intensity = opacity * (lightBoost + Math.sin(t * beatFreq * 0.5) * 1.5);
      innerLightRef.current.distance  = lerp(2.5, 4.5, clamp(activating, 0, 1));
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.8, 0]}>
      {/* Outer glow sphere — expands during activation */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshBasicMaterial color="#d4893a" transparent opacity={0.12} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      {/* Seed body */}
      <mesh>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial ref={bodyMatRef} color="#1a1108" roughness={0.55} metalness={0.3} emissive="#5a3010" emissiveIntensity={0.8} />
      </mesh>
      {/* Internal glow light */}
      <pointLight ref={innerLightRef} color="#d4893a" intensity={3.5} distance={2.5} decay={2} />
    </group>
  );
}

// ─── SEED RINGS ─────────────────────────────────────────────────────────────
// 3 concentric pulse rings that expand outward from the seed at ground level
function SeedRings() {
  const ringsRef = useRef([null, null, null]);

  useFrame(({ clock }) => {
    const p = scrollRef.current;
    const t = clock.getElapsedTime();

    // Active during seed activation phase: 0.05 → 0.26
    const activating = clamp(remap(p, 0.05, 0.12, 0, 1), 0, 1);
    const fadeOut    = clamp(remap(p, 0.20, 0.28, 1, 0), 0, 1);
    const vis = activating * fadeOut;

    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      ring.visible = vis > 0.01;
      if (!ring.visible) return;

      // Each ring cycles on a staggered loop: 0→1 over ~1.4 seconds
      const cycleSpeed = 0.72;
      const phase = ((t * cycleSpeed + i * 0.33) % 1.0); // 0→1 cycling

      // Ring expands from near-zero to 2.0× radius and fades
      const ringScale = lerp(0.05, 2.0, phase);
      ring.scale.set(ringScale, 1, ringScale);
      ring.material.opacity = (1 - phase) * vis * 0.6;
    });
  });

  // Flat on the ground at the seed's Y position, horizontal
  return (
    <group position={[0, -0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {[0, 1, 2].map(i => (
        <mesh key={i} ref={el => ringsRef.current[i] = el}>
          <ringGeometry args={[0.88, 0.96, 56]} />
          <meshBasicMaterial color="#d4893a" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// ─── ROOTS ─────────────────────────────────────────────────────────────
function Roots() {
  const groupRef = useRef();
  const matsRef = useRef([]);

  const rootData = useMemo(() => {
    const curves = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,-0.9,0),
        new THREE.Vector3(-0.5,-1.6,0.3),
        new THREE.Vector3(-1.2,-2.5,0.6),
        new THREE.Vector3(-2.0,-3.6,1.1),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,-0.9,0),
        new THREE.Vector3(0.6,-1.7,-0.3),
        new THREE.Vector3(1.4,-2.8,-0.7),
        new THREE.Vector3(2.2,-3.9,-1.2),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,-0.9,0),
        new THREE.Vector3(-0.3,-1.5,-0.5),
        new THREE.Vector3(-0.7,-2.4,-1.0),
        new THREE.Vector3(-1.1,-3.5,-1.5),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,-0.9,0),
        new THREE.Vector3(0.3,-1.8,0.6),
        new THREE.Vector3(0.8,-3.0,1.1),
        new THREE.Vector3(1.3,-4.2,1.7),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,-0.9,0),
        new THREE.Vector3(-0.8,-1.9,-0.1),
        new THREE.Vector3(-1.8,-2.9,-0.3),
        new THREE.Vector3(-2.8,-3.9,-0.5),
      ]),
    ];
    return curves.map(curve => ({ curve, geo: new THREE.TubeGeometry(curve, 40, 0.018, 6, false) }));
  }, []);

  useFrame(({ clock }) => {
    const p = scrollRef.current;
    const t = clock.getElapsedTime();

    // Scene 2: roots grow (0.12 → 0.30), visible until 0.50
    const growStart = 0.12, growEnd = 0.30;
    const grow = remap(p, growStart, growEnd, 0, 1);
    const fadeOut = remap(p, 0.42, 0.52, 1, 0);
    const vis = grow * fadeOut;

    if (groupRef.current) {
      groupRef.current.visible = vis > 0.01;
    }

    matsRef.current.forEach((mat, i) => {
      if (!mat) return;
      // Stagger each root's start
      const stagger = i * 0.08;
      const localGrow = remap(p, growStart + stagger, growEnd + stagger * 0.5, 0, 1);
      // Use drawRange to reveal geometry progressively
      const geo = rootData[i].geo;
      const totalVerts = geo.attributes.position.count;
      const visibleVerts = Math.floor(clamp(localGrow, 0, 1) * totalVerts);
      geo.setDrawRange(0, visibleVerts * 3); // triangulated

      mat.opacity = clamp(localGrow, 0, 1) * fadeOut;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 2.5 + i) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {rootData.map(({ geo }, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial
            ref={el => matsRef.current[i] = el}
            color="#3d2208"
            emissive="#c8843a"
            emissiveIntensity={0.6}
            roughness={0.8}
            metalness={0.1}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── ROOT TIPS ─────────────────────────────────────────────────────────────
// Hot-orange glowing spheres that race along each root path as the root grows
function RootTips() {
  const tipsRef = useRef([null, null, null, null, null]);
  // Mirror the exact root endpoint positions from Roots component
  const TIP_POSITIONS = [
    new THREE.Vector3(-2.0, -3.6,  1.1),
    new THREE.Vector3( 2.2, -3.9, -1.2),
    new THREE.Vector3(-1.1, -3.5, -1.5),
    new THREE.Vector3( 1.3, -4.2,  1.7),
    new THREE.Vector3(-2.8, -3.9, -0.5),
  ];
  // Root start point (all roots emerge from the seed)
  const ROOT_ORIGIN = new THREE.Vector3(0, -0.9, 0);

  useFrame(({ clock }) => {
    const p = scrollRef.current;
    const t = clock.getElapsedTime();

    const growStart = 0.12, growEnd = 0.38;
    const fadeOut   = clamp(remap(p, 0.40, 0.50, 1, 0), 0, 1);

    tipsRef.current.forEach((tip, i) => {
      if (!tip) return;
      const stagger  = i * 0.06;
      const localT   = clamp(remap(p, growStart + stagger, growEnd + stagger * 0.5, 0, 1), 0, 1);

      tip.visible = localT > 0.02 && fadeOut > 0.02;
      if (!tip.visible) return;

      // Tip travels from origin to endpoint following localT
      const pos = new THREE.Vector3().lerpVectors(ROOT_ORIGIN, TIP_POSITIONS[i], localT);
      tip.position.copy(pos);

      // Scale: grows in at the front, then shrinks as root is complete
      const frontEdge = clamp((localT - 0.0) * 4, 0, 1);   // fast grow-in
      const tailFade  = clamp((localT - 0.8) * 5, 0, 1);    // shrink at end
      const sc = frontEdge * (1 - tailFade) * fadeOut;
      tip.scale.setScalar(Math.max(0.001, sc * 0.07));

      // Rapid emissive pulse — looks like electrical energy surging
      tip.material.emissiveIntensity = 2.5 + Math.sin(t * 12 + i * 2.1) * 1.2;
      tip.material.opacity = sc * 0.95;
    });
  });

  return (
    <group>
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} ref={el => tipsRef.current[i] = el}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color="#fff5d0"
            emissive="#ffba5a"
            emissiveIntensity={3}
            roughness={0.1}
            metalness={0}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── TREE ──────────────────────────────────────────────────────────────
function Tree() {
  const groupRef = useRef();
  const trunkMatRef = useRef();
  const branchMatsRef = useRef([]);
  const leafRef = useRef();
  const leafMatRef = useRef();

  const branchData = useMemo(() => {
    const curves = [
      new THREE.CatmullRomCurve3([new THREE.Vector3(0,1.8,0), new THREE.Vector3(-0.9,2.4,0.4), new THREE.Vector3(-2.2,3.0,0.9), new THREE.Vector3(-3.4,3.4,1.5)]),
      new THREE.CatmullRomCurve3([new THREE.Vector3(0,2.8,0), new THREE.Vector3(0.9,3.3,-0.4), new THREE.Vector3(2.1,3.8,-0.8), new THREE.Vector3(3.2,4.1,-1.4)]),
      new THREE.CatmullRomCurve3([new THREE.Vector3(0,4.2,0), new THREE.Vector3(-0.7,4.6,-0.3), new THREE.Vector3(-1.6,5.1,-0.7), new THREE.Vector3(-2.5,5.4,-1.1)]),
      new THREE.CatmullRomCurve3([new THREE.Vector3(0,5.5,0), new THREE.Vector3(0.5,5.9,0.3), new THREE.Vector3(1.1,6.3,0.6), new THREE.Vector3(1.6,6.7,1.0)]),
    ];
    return curves.map(c => ({ curve: c, geo: new THREE.TubeGeometry(c, 40, 0.03, 8, false) }));
  }, []);

  // Leaf cloud around branch tips
  const leafData = useMemo(() => {
    const tips = [
      new THREE.Vector3(-3.4,3.4,1.5),
      new THREE.Vector3(3.2,4.1,-1.4),
      new THREE.Vector3(-2.5,5.4,-1.1),
      new THREE.Vector3(1.6,6.7,1.0),
    ];
    const COUNT = 180;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const tip = tips[i % 4];
      const spread = 1.1;
      pos[i*3+0] = tip.x + (Math.random()-0.5)*spread;
      pos[i*3+1] = tip.y + (Math.random()-0.5)*spread;
      pos[i*3+2] = tip.z + (Math.random()-0.5)*spread;

      const r = Math.random();
      const c = new THREE.Color(
        r < 0.5 ? "#2d5c38" : r < 0.8 ? "#4a8860" : "#c8843a"
      );
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    return { pos, col, COUNT };
  }, []);

  useFrame(({ clock }) => {
    const p = scrollRef.current;
    const t = clock.getElapsedTime();

    // Scene 3 grows (0.28→0.55), stays through scene 4, fades out 0.78→0.88
    const growIn  = remap(p, 0.28, 0.55, 0, 1);
    const fadeOut = remap(p, 0.78, 0.88, 1, 0);
    const treeVis = clamp(growIn, 0, 1) * clamp(fadeOut, 0, 1);

    if (groupRef.current) {
      groupRef.current.visible = treeVis > 0.005;
      groupRef.current.scale.y = treeVis;
      groupRef.current.scale.x = clamp(growIn, 0, 1);
      groupRef.current.scale.z = clamp(growIn, 0, 1);
      // 🌬️ Cinematic wind sway — whole tree rocks gently like a living organism
      const windStrength = clamp(growIn, 0, 1) * 0.038;
      groupRef.current.rotation.z = Math.sin(t * 0.55) * windStrength + Math.sin(t * 1.1) * windStrength * 0.4;
      groupRef.current.rotation.x = Math.sin(t * 0.38) * windStrength * 0.5;
    }

    if (trunkMatRef.current) {
      trunkMatRef.current.opacity = treeVis;
    }

    branchMatsRef.current.forEach((mat, i) => {
      if (!mat) return;
      const stagger = i * 0.06;
      const localGrow = remap(p, 0.30 + stagger, 0.50 + stagger, 0, 1);
      mat.opacity = clamp(localGrow, 0, 1) * clamp(fadeOut, 0, 1);
      // 💡 Stronger, staggered energy pulse along each branch — like sap flowing
      mat.emissiveIntensity = 0.35 + Math.sin(t * 2.2 + i * 1.8) * 0.55;
      // Subtle color temperature shift — branches breathe warm to cool
      const hue = 0.37 + Math.sin(t * 0.6 + i) * 0.04;
      mat.emissive.setHSL(hue, 0.7, 0.3);
    });

    if (leafMatRef.current) {
      leafMatRef.current.opacity = clamp(growIn * 1.5 - 0.5, 0, 1) * clamp(fadeOut, 0, 1) * 0.85;
      // Leaves pulse size as they flutter
      leafMatRef.current.size = 0.16 + Math.sin(t * 1.8) * 0.04;
    }
    if (leafRef.current) {
      // 🍃 Dynamic wind scatter — leaves drift in X and Y with staggered phases
      const pos = leafRef.current.geometry.attributes.position.array;
      for (let i = 0; i < leafData.COUNT; i++) {
        pos[i*3+0] += Math.sin(t * 0.65 + i * 0.5) * 0.0012;
        pos[i*3+1] += Math.sin(t * 0.42 + i * 0.7) * 0.0016;
        pos[i*3+2] += Math.cos(t * 0.5  + i * 0.4) * 0.001;
      }
      leafRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Trunk */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.08, 0.18, 8.5, 10, 1]} />
        <meshStandardMaterial
          ref={trunkMatRef}
          color="#131a12"
          roughness={0.92}
          metalness={0.05}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Branches */}
      {branchData.map(({ geo }, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial
            ref={el => branchMatsRef.current[i] = el}
            color="#1a2618"
            emissive="#4a8860"
            emissiveIntensity={0.5}
            roughness={0.85}
            metalness={0.05}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Leaf cloud */}
      <points ref={leafRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={leafData.COUNT} array={leafData.pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={leafData.COUNT} array={leafData.col} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          ref={leafMatRef}
          size={0.18}
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ─── BERRY ─────────────────────────────────────────────────────────────
// Builds drupelet instance matrices for a blackberry/mulberry cluster
function buildBerryDrupelets() {
  // Fibonacci sphere distribution — evenly space N points on a sphere surface
  function fibonacciSphere(n, radius) {
    const points = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5°
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;           // -1 to +1
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      points.push(new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      ));
    }
    return points;
  }

  // Outer shell drupelets (larger, form the visible bumpy skin)
  const outerPts  = fibonacciSphere(48, 0.38);
  // Inner fill drupelets (smaller, pack the interior for fullness)
  const innerPts  = fibonacciSphere(14, 0.22);
  const all = [...outerPts, ...innerPts];

  const matrices = all.map((pos, i) => {
    const mat = new THREE.Matrix4();
    // Outer drupelets are slightly larger than inner ones
    const isOuter = i < outerPts.length;
    // Add slight random size variation per drupelet for organic feel
    const baseSize = isOuter ? 0.108 : 0.085;
    const sizeJitter = 1 + (Math.sin(i * 7.3) * 0.15); // deterministic, not random
    mat.makeScale(baseSize * sizeJitter, baseSize * sizeJitter, baseSize * sizeJitter);
    mat.setPosition(pos);
    return mat;
  });

  return { matrices, count: all.length };
}

function Berry() {
  const groupRef = useRef();
  const instanceRef = useRef();   // InstancedMesh for drupelets
  const innerGlowRef = useRef();  // inner soft-glow sphere
  const lightRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();      // third outer ring added for richer orbit

  // Pre-compute drupelet data once
  const { matrices: drupeletMatrices, count: drupeletCount } = useMemo(buildBerryDrupelets, []);

  // Apply matrices to InstancedMesh after mount
  useEffect(() => {
    if (!instanceRef.current) return;
    drupeletMatrices.forEach((mat, i) => {
      instanceRef.current.setMatrixAt(i, mat);
    });
    instanceRef.current.instanceMatrix.needsUpdate = true;
  }, [drupeletMatrices]);

  // Separate ref for the material so we can animate emissiveIntensity
  const berryMatRef = instanceRef; // reuse pattern — we animate via the mesh's material directly
  const drupeMatRef = useRef();

  // Berry starts at top of tree (Y=7.2), falls to ground (Y=-4)
  const START_Y = 7.2;
  const END_Y = -4.0;

  useFrame(({ clock }) => {
    const p = scrollRef.current;
    const t = clock.getElapsedTime();

    const appearIn  = remap(p, 0.62, 0.70, 0, 1);
    const fallT     = remap(p, 0.78, 0.90, 0, 1);
    const dissolve  = remap(p, 0.90, 0.95, 1, 0);
    const isFalling = p >= 0.78;
    const isResting = p >= 0.62 && p < 0.78; // Scene 5 — at crown of tree

    let berryY = START_Y;
    let baseScale = clamp(appearIn, 0, 1);
    let opacity = clamp(appearIn, 0, 1) * clamp(dissolve, 0, 1);

    if (isFalling) {
      berryY = lerp(START_Y, END_Y, clamp(fallT, 0, 1));
    }

    if (groupRef.current) {
      groupRef.current.visible = opacity > 0.005;
      groupRef.current.position.y = berryY;

      // 💓 Heartbeat breathing when resting at the crown (Scene 5)
      const heartbeat = isResting
        ? 1 + Math.sin(t * 4.5) * 0.045 + Math.sin(t * 9.0) * 0.018  // double-thump
        : 1.0;

      // 🌀 Rotation: slow + majestic at crown, SPINS fast and wobbles during fall
      const rotY = isFalling
        ? t * 0.2 + clamp(fallT, 0, 1) * Math.PI * 4.0  // 2 full rotations during fall
        : t * 0.22;
      const rotZ = isFalling
        ? Math.sin(t * 2.8) * 0.18 * clamp(fallT, 0, 1) // tumble wobble during fall
        : Math.sin(t * 0.55) * 0.05;
      const rotX = isFalling
        ? Math.cos(t * 2.1) * 0.12 * clamp(fallT, 0, 1)
        : Math.sin(t * 0.3) * 0.02;

      groupRef.current.scale.setScalar(baseScale * opacity * heartbeat);
      groupRef.current.rotation.y = rotY;
      groupRef.current.rotation.z = rotZ;
      groupRef.current.rotation.x = rotX;
    }

    if (drupeMatRef.current) {
      // More intense pulse — drupelets glow hotter when falling
      const fallBoost = isFalling ? clamp(fallT, 0, 1) * 0.6 : 0;
      drupeMatRef.current.emissiveIntensity = 0.5 + Math.sin(t * 3.8) * 0.35 + fallBoost;
      // Hue shift — warms from deep red toward orange as it falls
      const warmth = isFalling ? clamp(fallT, 0, 1) * 0.04 : 0;
      drupeMatRef.current.emissive.setHSL(0.97 - warmth, 0.85, 0.25);
    }
    if (innerGlowRef.current) {
      const glowBase = opacity * 0.22 + Math.sin(t * 2.5) * 0.05;
      const fallFlare = isFalling ? clamp(fallT, 0, 1) * 0.18 : 0;
      innerGlowRef.current.material.opacity = glowBase + fallFlare;
      // Scale the inner glow larger during fall — comet-core effect
      const glowScale = isFalling ? 1 + clamp(fallT, 0, 1) * 0.5 : 1;
      innerGlowRef.current.scale.setScalar(glowScale);
    }

    if (lightRef.current) {
      const fallFlare = isFalling ? clamp(fallT, 0, 1) * 5 : 0;
      lightRef.current.intensity = opacity * (4.5 + Math.sin(t * 4.2) * 1.2 + fallFlare);
      lightRef.current.distance = isFalling ? 4 + clamp(fallT, 0, 1) * 4 : 4;
    }

    // 💫 Rings: counter-rotate at different speeds, tilt changes during fall
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = t * 1.2;
      ring1Ref.current.rotation.z = t * 0.7;
      const r1tilt = isFalling ? lerp(Math.PI/3, Math.PI/2, clamp(fallT,0,1)) : Math.PI/3;
      ring1Ref.current.rotation.x = r1tilt + Math.sin(t * 0.8) * 0.1;
      ring1Ref.current.material.opacity = opacity * (0.55 + Math.sin(t * 2) * 0.15);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.9;
      ring2Ref.current.rotation.z = -t * 0.5;
      ring2Ref.current.material.opacity = opacity * (0.45 + Math.sin(t * 1.5 + 1) * 0.12);
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.6;
      ring3Ref.current.rotation.z = t * 0.3;
      ring3Ref.current.material.opacity = opacity * (0.3 + Math.sin(t * 3 + 2) * 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, START_Y, 0]}>
      {/* ── Real Berry: Blackberry/Mulberry drupelet cluster ── */}
      {/* Each drupelet is a small glossy sphere; together they form the
          characteristic bumpy, lobed surface of a real berry */}
      <instancedMesh
        ref={instanceRef}
        args={[null, null, drupeletCount]}
        castShadow={false}
      >
        {/* Shared geometry — one small sphere reused for every drupelet */}
        <sphereGeometry args={[1, 14, 14]} />
        {/* Rich deep-red/mulberry with slight wetness sheen */}
        <meshStandardMaterial
          ref={drupeMatRef}
          color="#2a0810"
          roughness={0.35}
          metalness={0.25}
          emissive="#7a1a28"
          emissiveIntensity={0.55}
        />
      </instancedMesh>

      {/* Subtle inner volumetric glow — sphere slightly smaller than cluster
          gives the berry a sense of translucent depth from within */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[0.30, 24, 24]} />
        <meshBasicMaterial
          color="#c0203a"
          transparent
          opacity={0.18}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbiting ring 1 — amber, equatorial tilt */}
      <mesh ref={ring1Ref} rotation={[Math.PI/3, 0, 0]}>
        <ringGeometry args={[0.64, 0.67, 64]} />
        <meshBasicMaterial color="#d4893a" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Orbiting ring 2 — sage green, polar tilt */}
      <mesh ref={ring2Ref} rotation={[-Math.PI/4, Math.PI/6, 0]}>
        <ringGeometry args={[0.82, 0.845, 64]} />
        <meshBasicMaterial color="#4a8860" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Orbiting ring 3 — wide crimson halo, diagonal tilt */}
      <mesh ref={ring3Ref} rotation={[Math.PI/6, Math.PI/3, 0]}>
        <ringGeometry args={[1.05, 1.075, 64]} />
        <meshBasicMaterial color="#9b1c2e" transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <pointLight ref={lightRef} color="#e8923a" intensity={4} distance={4} decay={2} />
    </group>
  );
}

// ─── REBIRTH PARTICLES ──────────────────────────────────────────────────
// Two-wave burst: inner fast particles + outer slow drifting spores
function RebirthBurst() {
  const innerRef = useRef();
  const outerRef = useRef();
  const INNER = 400;   // fast hot core particles
  const OUTER = 250;   // slow drifting pollen spores
  const IMPACT_Y = -4.0;

  const innerData = useMemo(() => {
    const basePos  = new Float32Array(INNER * 3);
    const vels     = new Float32Array(INNER * 3);
    for (let i = 0; i < INNER; i++) {
      basePos[i*3] = 0; basePos[i*3+1] = IMPACT_Y; basePos[i*3+2] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const speed = 1.2 + Math.random() * 2.8;  // fast
      vels[i*3]   = Math.sin(phi) * Math.cos(theta) * speed;
      vels[i*3+1] = Math.abs(Math.cos(phi)) * speed * 0.9 + 0.5;
      vels[i*3+2] = Math.sin(phi) * Math.sin(theta) * speed;
    }
    return { basePos, vels, work: new Float32Array(INNER * 3) };
  }, []);

  const outerData = useMemo(() => {
    const basePos  = new Float32Array(OUTER * 3);
    const vels     = new Float32Array(OUTER * 3);
    for (let i = 0; i < OUTER; i++) {
      basePos[i*3] = 0; basePos[i*3+1] = IMPACT_Y; basePos[i*3+2] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const speed = 0.3 + Math.random() * 0.9;  // slow drifters
      vels[i*3]   = Math.sin(phi) * Math.cos(theta) * speed;
      vels[i*3+1] = Math.abs(Math.cos(phi)) * speed * 0.5 + 0.8;  // drift upward
      vels[i*3+2] = Math.sin(phi) * Math.sin(theta) * speed;
    }
    return { basePos, vels, work: new Float32Array(OUTER * 3) };
  }, []);

  useFrame(() => {
    const p = scrollRef.current;
    const burstT = remap(p, 0.90, 1.0, 0, 1);
    const visible = burstT > 0;

    if (innerRef.current) innerRef.current.visible = visible;
    if (outerRef.current) outerRef.current.visible = visible;
    if (!visible) return;

    // Inner burst: snappy smoothstep — fast expansion then decay
    const innerEased = Math.pow(burstT, 0.45);  // fast at start
    const gravity = -3.5 * innerEased * innerEased;
    for (let i = 0; i < INNER; i++) {
      innerData.work[i*3]   = innerData.basePos[i*3]   + innerData.vels[i*3]   * innerEased * 6;
      innerData.work[i*3+1] = innerData.basePos[i*3+1] + innerData.vels[i*3+1] * innerEased * 6 + gravity;
      innerData.work[i*3+2] = innerData.basePos[i*3+2] + innerData.vels[i*3+2] * innerEased * 6;
    }
    if (innerRef.current) {
      innerRef.current.geometry.attributes.position.array.set(innerData.work);
      innerRef.current.geometry.attributes.position.needsUpdate = true;
      innerRef.current.material.opacity = Math.pow(1 - burstT, 1.5) * 0.9;
    }

    // Outer spores: slow leisurely drift upward, stay visible longer
    const outerEased = burstT * burstT * (3 - 2 * burstT); // smoothstep — delayed
    for (let i = 0; i < OUTER; i++) {
      outerData.work[i*3]   = outerData.basePos[i*3]   + outerData.vels[i*3]   * outerEased * 5;
      outerData.work[i*3+1] = outerData.basePos[i*3+1] + outerData.vels[i*3+1] * outerEased * 4.5;
      outerData.work[i*3+2] = outerData.basePos[i*3+2] + outerData.vels[i*3+2] * outerEased * 5;
    }
    if (outerRef.current) {
      outerRef.current.geometry.attributes.position.array.set(outerData.work);
      outerRef.current.geometry.attributes.position.needsUpdate = true;
      outerRef.current.material.opacity = (1 - burstT) * 0.55;
    }
  });

  return (
    <>
      {/* Inner hot burst — bright amber */}
      <points ref={innerRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={INNER} array={innerData.work} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.055} color="#ffba5a" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
      {/* Outer spores — soft golden pollen drift */}
      <points ref={outerRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={OUTER} array={outerData.work} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#d4893a" transparent opacity={0} blending={THREE.NormalBlending} depthWrite={false} sizeAttenuation />
      </points>
    </>
  );
}

// ─── SHOCKWAVE RING ───────────────────────────────────────────────────────
// An expanding flat ring on impact that fades out — cinematic ground hit
function ShockwaveRing() {
  const ringRef = useRef();
  const IMPACT_Y = -4.0;

  useFrame(() => {
    const p = scrollRef.current;
    // Active in early Scene 7
    const shockT = remap(p, 0.90, 0.96, 0, 1);
    const visible = shockT > 0 && shockT < 1;

    if (!ringRef.current) return;
    ringRef.current.visible = visible;
    if (!visible) return;

    // Expand outward fast, fade quickly
    const eased = 1 - Math.pow(1 - shockT, 3);  // ease-out cubic — fast start
    const ringScale = 0.1 + eased * 4.5;
    ringRef.current.scale.set(ringScale, 1, ringScale);
    ringRef.current.material.opacity = (1 - shockT) * 0.65;
  });

  return (
    <mesh ref={ringRef} position={[0, IMPACT_Y + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1.0, 64]} />
      <meshBasicMaterial color="#d4893a" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── BERRY COMET TRAIL ─────────────────────────────────────────────────────
// Streaking hot particles that follow the falling berry downward
function BerryTrail() {
  const ref = useRef();
  const COUNT = 120;
  const START_Y = 7.2;
  const END_Y = -4.0;

  const work = useMemo(() => new Float32Array(COUNT * 3), []);
  const ages = useMemo(() => {
    const a = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) a[i] = i / COUNT; // stagger ages 0→1
    return a;
  }, []);

  useFrame(({ clock }) => {
    const p = scrollRef.current;
    const t = clock.getElapsedTime();

    // Only active during fall: 0.78→0.90
    const fallT  = remap(p, 0.78, 0.90, 0, 1);
    const active = fallT > 0.05 && fallT < 1.0;

    if (!ref.current) return;
    ref.current.visible = active;
    if (!active) return;

    const berryY = lerp(START_Y, END_Y, clamp(fallT, 0, 1));

    // Each particle trails behind the berry at a different age offset
    for (let i = 0; i < COUNT; i++) {
      const age = ages[i];  // 0=near berry, 1=far behind
      const trailT = clamp(fallT - age * 0.12, 0, 1);
      const trailY = lerp(START_Y, END_Y, trailT);

      // Slight random spread around the trail axis
      const spread = age * 0.3;
      work[i*3+0] = Math.sin(age * 18.7 + t * 0.5) * spread * 0.4;
      work[i*3+1] = trailY + age * 0.5;  // trail extends upward from berry
      work[i*3+2] = Math.cos(age * 14.3 + t * 0.4) * spread * 0.4;
    }

    ref.current.geometry.attributes.position.array.set(work);
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.material.opacity = clamp(fallT * 2, 0, 1) * 0.6;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={work} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#ffba5a"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── ENERGY VORTEX ────────────────────────────────────────────────────
// DNA double-helix spiral of particles swirling around the tree trunk
function EnergyVortex() {
  const ref = useRef();
  const COUNT = 200;

  const data = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const helixSides = new Float32Array(COUNT); // 0 or 1 for which helix strand
    for (let i = 0; i < COUNT; i++) {
      phases[i] = (i / COUNT) * Math.PI * 6; // 3 full rotations
      helixSides[i] = i % 2; // alternating strands
    }
    return { pos, phases, helixSides, work: new Float32Array(COUNT * 3) };
  }, []);

  useFrame(({ clock }) => {
    const p = rawScrollRef.current;
    const t = clock.getElapsedTime();

    // Active during tree growth and panel scenes: rawP 0.24 → 0.58
    const fadeIn = clamp(remap(p, 0.24, 0.30, 0, 1), 0, 1);
    const fadeOut = clamp(remap(p, 0.52, 0.58, 1, 0), 0, 1);
    const vis = fadeIn * fadeOut;

    if (!ref.current) return;
    ref.current.visible = vis > 0.01;
    if (!ref.current.visible) return;

    const radius = 0.6;
    const heightRange = 7.0; // from near roots to near top
    const baseY = -0.5;

    for (let i = 0; i < COUNT; i++) {
      const phase = data.phases[i] + t * 1.2; // rotate over time
      const strand = data.helixSides[i];
      const offset = strand * Math.PI; // offset second strand by 180°

      const heightT = (i / COUNT);
      const y = baseY + heightT * heightRange;
      const r = radius + Math.sin(heightT * Math.PI * 2) * 0.15; // slight radius wobble

      data.work[i * 3 + 0] = Math.cos(phase + offset) * r;
      data.work[i * 3 + 1] = y;
      data.work[i * 3 + 2] = Math.sin(phase + offset) * r;
    }

    ref.current.geometry.attributes.position.array.set(data.work);
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.material.opacity = vis * 0.45;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={data.work} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#d4893a"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── DATA STREAMS ─────────────────────────────────────────────────────
// Vertical light beams flowing upward through the tree like neural data
function DataStreams() {
  const beamsRef = useRef([]);
  const BEAM_COUNT = 8;

  useFrame(({ clock }) => {
    const p = rawScrollRef.current;
    const t = clock.getElapsedTime();

    // Active during panel scenes: rawP 0.30 → 0.62
    const fadeIn = clamp(remap(p, 0.30, 0.36, 0, 1), 0, 1);
    const fadeOut = clamp(remap(p, 0.56, 0.62, 1, 0), 0, 1);
    const vis = fadeIn * fadeOut;

    beamsRef.current.forEach((beam, i) => {
      if (!beam) return;
      beam.visible = vis > 0.01;
      if (!beam.visible) return;

      // Each beam pulses with staggered timing
      const stagger = i * 0.4;
      const pulse = (Math.sin(t * 2.5 + stagger) + 1) * 0.5; // 0-1
      const yOffset = ((t * 0.8 + stagger) % 3.0) - 0.5; // scrolling upward

      beam.position.y = yOffset;
      beam.material.opacity = vis * pulse * 0.12;
      beam.scale.y = 1 + pulse * 0.3;
    });
  });

  // 8 beams arranged in a circle around the trunk
  const beamPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < BEAM_COUNT; i++) {
      const angle = (i / BEAM_COUNT) * Math.PI * 2;
      const r = 0.25 + (i % 2) * 0.15;
      positions.push([Math.cos(angle) * r, 2.5, Math.sin(angle) * r]);
    }
    return positions;
  }, []);

  return (
    <group>
      {beamPositions.map((pos, i) => (
        <mesh key={i} ref={el => beamsRef.current[i] = el} position={pos}>
          <cylinderGeometry args={[0.008, 0.008, 6, 4]} />
          <meshBasicMaterial
            color="#d4893a"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── BERRY AURA ───────────────────────────────────────────────────────
// Pulsing concentric rings radiating outward from the berry — broadcast effect
function BerryAura() {
  const ringsRef = useRef([null, null, null, null]);
  const RING_COUNT = 4;
  const RADII = [0.9, 1.3, 1.7, 2.2];

  useFrame(({ clock }) => {
    const p = rawScrollRef.current;
    const t = clock.getElapsedTime();

    // Active during berry at crown: rawP 0.66 → 0.78
    const fadeIn = clamp(remap(p, 0.66, 0.70, 0, 1), 0, 1);
    const fadeOut = clamp(remap(p, 0.74, 0.78, 1, 0), 0, 1);
    const vis = fadeIn * fadeOut;

    // Berry Y position (mapped progress) — use the mapped scrollRef for consistency
    const mappedP = scrollRef.current;
    const berryY = mappedP >= 0.62 && mappedP < 0.78 ? 7.2 : lerp(7.2, -4.0, clamp(remap(mappedP, 0.78, 0.90, 0, 1), 0, 1));

    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      ring.visible = vis > 0.01;
      if (!ring.visible) return;

      // Each ring pulses at a different frequency
      const phase = t * 1.5 + i * 0.8;
      const pulse = (Math.sin(phase) + 1) * 0.5;

      ring.position.y = berryY;
      ring.material.opacity = vis * pulse * 0.25;

      // Slight scale breathing
      const breathe = 1 + Math.sin(t * 0.8 + i) * 0.05;
      ring.scale.setScalar(breathe);
    });
  });

  return (
    <group>
      {RADII.map((r, i) => (
        <mesh key={i} ref={el => ringsRef.current[i] = el} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.02, r, 64]} />
          <meshBasicMaterial
            color="#d4893a"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── BERRY ORBIT ──────────────────────────────────────────────────────
// 6 small glowing orbs orbiting the berry at the crown like planets
// Active during berry's resting phase (Scene 5): rawP 0.65 → 0.78
function BerryOrbit() {
  const orbRefs = useRef([null, null, null, null, null, null]);
  const ORBIT_COUNT = 6;

  const orbitData = useMemo(() => {
    return Array.from({ length: ORBIT_COUNT }, (_, i) => ({
      radius: 0.55 + (i % 3) * 0.28,
      speed:  0.8  + (i % 4) * 0.35,
      tiltX:  (i * 0.52) % Math.PI,
      tiltZ:  (i * 0.91) % Math.PI,
      phase:  (i / ORBIT_COUNT) * Math.PI * 2,
      scale:  0.012 + (i % 3) * 0.005,
      colorHex: i % 3 === 0 ? "#d4893a" : i % 3 === 1 ? "#4a8860" : "#9b1c2e",
    }));
  }, []);

  useFrame(({ clock }) => {
    const p = rawScrollRef.current;
    const t = clock.getElapsedTime();

    const fadeIn  = clamp(remap(p, 0.65, 0.70, 0, 1), 0, 1);
    const fadeOut = clamp(remap(p, 0.75, 0.78, 1, 0), 0, 1);
    const vis = fadeIn * fadeOut;

    const BERRY_Y = 7.2;

    orbRefs.current.forEach((orb, i) => {
      if (!orb) return;
      orb.visible = vis > 0.01;
      if (!orb.visible) return;

      const od = orbitData[i];
      const angle = t * od.speed + od.phase;

      const x = Math.cos(angle) * od.radius;
      const y = BERRY_Y + Math.sin(angle) * od.radius * Math.sin(od.tiltX);
      const z = Math.sin(angle) * od.radius * Math.cos(od.tiltZ);
      orb.position.set(x, y, z);

      const pulseFactor = 1 + Math.sin(t * 3.5 + i) * 0.2;
      orb.scale.setScalar(od.scale * pulseFactor * vis);

      if (orb.material) {
        orb.material.emissiveIntensity = 1.8 + Math.sin(t * 4.0 + i * 0.7) * 0.8;
        orb.material.opacity = vis;
      }
    });
  });

  return (
    <>
      {orbitData.map((od, i) => (
        <mesh key={i} ref={el => orbRefs.current[i] = el}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={od.colorHex}
            emissive={od.colorHex}
            emissiveIntensity={1.8}
            roughness={0.3}
            metalness={0.4}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── BERRY CONSTELLATION ──────────────────────────────────────────────
// 300 slow-rotating particles in a loose sphere around the berry crown
// Active: rawP 0.64 → 0.80
function BerryConstellation() {
  const ref = useRef();
  const COUNT = 300;
  const BERRY_Y = 7.2;

  const data = useMemo(() => {
    const pos    = new Float32Array(COUNT * 3);
    const radii  = new Float32Array(COUNT);
    const thetas = new Float32Array(COUNT);
    const phis   = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const r = 1.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      radii[i]  = r;
      thetas[i] = theta;
      phis[i]   = phi;
      speeds[i] = 0.06 + Math.random() * 0.10;

      pos[i*3+0] = Math.sin(phi) * Math.cos(theta) * r;
      pos[i*3+1] = BERRY_Y + Math.cos(phi) * r;
      pos[i*3+2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    return { radii, thetas, phis, speeds, work: new Float32Array(COUNT * 3) };
  }, []);

  useFrame(({ clock }) => {
    const p = rawScrollRef.current;
    const t = clock.getElapsedTime();

    const fadeIn  = clamp(remap(p, 0.64, 0.69, 0, 1), 0, 1);
    const fadeOut = clamp(remap(p, 0.76, 0.80, 1, 0), 0, 1);
    const vis = fadeIn * fadeOut;

    if (!ref.current) return;
    ref.current.visible = vis > 0.01;
    if (!ref.current.visible) return;

    for (let i = 0; i < COUNT; i++) {
      const theta = data.thetas[i] + t * data.speeds[i];
      const phi   = data.phis[i]   + t * data.speeds[i] * 0.3;
      const r     = data.radii[i];
      data.work[i*3+0] = Math.sin(phi) * Math.cos(theta) * r;
      data.work[i*3+1] = BERRY_Y + Math.cos(phi) * r;
      data.work[i*3+2] = Math.sin(phi) * Math.sin(theta) * r;
    }

    ref.current.geometry.attributes.position.array.set(data.work);
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.material.opacity = vis * 0.55;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={data.work} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        color="#d4893a"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── GROUND MIST ──────────────────────────────────────────────────────
// Atmospheric low-lying fog during seed and root scenes
function GroundMist() {

  const ref = useRef();
  const COUNT = 300;

  const data = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = -0.9 + Math.random() * 0.4; // just above/below ground
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return { pos, work: new Float32Array(COUNT * 3) };
  }, []);

  useFrame(({ clock }) => {
    const p = rawScrollRef.current;
    const t = clock.getElapsedTime();

    // Active during seed/root scenes: rawP 0.00 → 0.24
    const fadeIn = clamp(remap(p, 0.0, 0.03, 0, 1), 0, 1);
    const fadeOut = clamp(remap(p, 0.18, 0.24, 1, 0), 0, 1);
    const vis = fadeIn * fadeOut;

    if (!ref.current) return;
    ref.current.visible = vis > 0.01;
    if (!ref.current.visible) return;

    // Gentle drift
    for (let i = 0; i < COUNT; i++) {
      data.work[i * 3 + 0] = data.pos[i * 3 + 0] + Math.sin(t * 0.15 + i * 0.3) * 0.3;
      data.work[i * 3 + 1] = data.pos[i * 3 + 1] + Math.sin(t * 0.2 + i * 0.5) * 0.05;
      data.work[i * 3 + 2] = data.pos[i * 3 + 2] + Math.cos(t * 0.12 + i * 0.2) * 0.2;
    }

    ref.current.geometry.attributes.position.array.set(data.work);
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.material.opacity = vis * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={data.work} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        color="#2a3a2e"
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── BERRY SHATTER ─────────────────────────────────────────────────────
// 44 low-poly angular fragments that fly apart when the berry bursts
function BerryShatter() {
  const meshRef = useRef();
  const COUNT = 44;
  const IMPACT_Y = -4.0;

  // Pre-calculate velocities, rotation speeds, initial scales, and base positions
  const frags = useMemo(() => {
    const vels = [];
    const rotSpeeds = [];
    const scales = [];
    const basePos = [];

    for (let i = 0; i < COUNT; i++) {
      // Random velocity vector biased upward
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI / 2); // 0 to 90 degrees (upward hemisphere)
      const speed = 1.5 + Math.random() * 3.5;
      
      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = Math.cos(phi) * speed + 0.5; // upward bias
      const vz = Math.sin(phi) * Math.sin(theta) * speed;
      vels.push(new THREE.Vector3(vx, vy, vz));

      // Random rotation speed for each axis
      rotSpeeds.push(new THREE.Vector3(
        (Math.random() - 0.5) * 8.0,
        (Math.random() - 0.5) * 8.0,
        (Math.random() - 0.5) * 8.0
      ));

      // Random scale (0.045 to 0.11)
      scales.push(0.045 + Math.random() * 0.065);

      // Random tiny offset around center
      basePos.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        IMPACT_Y + (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      ));
    }

    return { vels, rotSpeeds, scales, basePos };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const p = scrollRef.current;
    const t = clock.getElapsedTime();

    // Shatter starts at p = 0.90 to p = 1.0
    const burstT = remap(p, 0.90, 1.0, 0, 1);
    const visible = burstT > 0;

    if (!meshRef.current) return;
    meshRef.current.visible = visible;
    if (!visible) return;

    // Cubic ease-out for progression (fast expansion then slowing)
    const eased = 1 - Math.pow(1 - burstT, 3);
    const gravity = -4.5 * eased * eased; // gravity pulls downward over time

    for (let i = 0; i < COUNT; i++) {
      // Calculate position
      const pos = frags.basePos[i].clone()
        .addScaledVector(frags.vels[i], eased * 0.8)
        .add(new THREE.Vector3(0, gravity, 0));

      // Shrink fragments to near-zero as they fade
      const scaleVal = frags.scales[i] * (1 - burstT * 0.88);

      // Calculate rotation
      const rot = frags.rotSpeeds[i].clone().multiplyScalar(eased);

      dummy.position.copy(pos);
      dummy.rotation.set(rot.x, rot.y, rot.z);
      dummy.scale.setScalar(scaleVal);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Material properties
    if (meshRef.current.material) {
      // Fade out
      meshRef.current.material.opacity = Math.pow(1 - burstT, 1.5);
      // Emissive rockets up from 1.5 to 6.0 as they burn
      meshRef.current.material.emissiveIntensity = 1.5 + burstT * 4.5;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <icosahedronGeometry args={[1, 0]} /> {/* Low-poly fragment */}
      <meshStandardMaterial
        color="#3d2208"
        emissive="#ffba5a"
        emissiveIntensity={1.5}
        roughness={0.4}
        metalness={0.2}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ─── NEW SEEDS ─────────────────────────────────────────────────────────────
// 5 small glowing seeds rising from the impact crater to restart the cycle
// Emerge from p=0.94 to 1.0.
function NewSeeds() {
  const meshRef = useRef();
  const COUNT = 5;
  const IMPACT_Y = -4.0;

  // Pre-calculate randomized positions/rotation axes for 5 seeds
  const seedData = useMemo(() => {
    const data = [];
    for (let i = 0; i < COUNT; i++) {
      // Staggered layout around crater
      const angle = (i / COUNT) * Math.PI * 2 + 0.2;
      const radius = 0.2 + Math.random() * 0.25;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      data.push({
        offset: new THREE.Vector3(x, 0, z),
        rotAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize(),
        rotSpeed: 0.8 + Math.random() * 0.8,
        scale: 0.14 + Math.random() * 0.06
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const p = scrollRef.current;
    const t = clock.getElapsedTime();

    const startP = 0.93;
    const active = p >= startP;

    if (!meshRef.current) return;
    meshRef.current.visible = active;
    if (!active) return;

    for (let i = 0; i < COUNT; i++) {
      const data = seedData[i];
      // Stagger each seed's emergence progress:
      // Seed i starts at startP + i * 0.012, grows over a range of 0.038
      const localStart = startP + i * 0.012;
      const localEnd = Math.min(1.0, localStart + 0.038);
      const localT = remap(p, localStart, localEnd, 0, 1);
      
      if (localT <= 0) {
        // Hide until start
        dummy.position.set(0, -999, 0);
        dummy.scale.setScalar(0.001);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      // Cubic ease-out for emergence
      const eased = 1 - Math.pow(1 - localT, 3);
      
      // Rise from slightly underground: IMPACT_Y - 0.25 to IMPACT_Y + 0.35
      const y = lerp(IMPACT_Y - 0.25, IMPACT_Y + 0.35, eased);
      const pos = data.offset.clone();
      pos.y = y;

      // Heartbeat pulse once emerged
      const beatFreq = 3.5;
      const beatAmp = 0.08;
      const pulse = 1.0 + Math.sin(t * beatFreq + i * 1.5) * beatAmp;
      
      // Grow from scale 0 to final size
      const currentScale = eased * data.scale * pulse;

      // Rotation around its custom axis
      const angle = t * data.rotSpeed;
      const q = new THREE.Quaternion().setFromAxisAngle(data.rotAxis, angle);

      dummy.position.copy(pos);
      dummy.quaternion.copy(q);
      dummy.scale.setScalar(currentScale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Pulse the emissive glow
    if (meshRef.current.material) {
      meshRef.current.material.emissiveIntensity = 2.0 + Math.sin(t * 4.0) * 0.6;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#1a1108"
        emissive="#d4893a"
        emissiveIntensity={2.0}
        roughness={0.5}
        metalness={0.2}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}

// ─── SCENE LIGHTS ──────────────────────────────────────────────────────

function SceneLights() {
  const keyRef = useRef();
  const fillRef = useRef();

  useFrame(({ clock }) => {
    const p = rawScrollRef.current;
    const t = clock.getElapsedTime();

    // Key light slowly warms up as tree grows
    if (keyRef.current) {
      keyRef.current.intensity = 0.3 + remap(p, 0.22, 0.55, 0, 1.4);
      keyRef.current.color.setHSL(0.09, 0.6, 0.7 + Math.sin(t*0.3)*0.05);
    }
    if (fillRef.current) {
      fillRef.current.intensity = 0.15 + remap(p, 0.22, 0.55, 0, 0.4);
    }
  });

  return (
    <>
      <ambientLight intensity={0.18} color="#121a12" />
      <directionalLight
        ref={keyRef}
        position={[5, 10, 4]}
        intensity={0.3}
        color="#ffe0a0"
        castShadow={false}
      />
      <directionalLight
        ref={fillRef}
        position={[-4, 2, -3]}
        intensity={0.15}
        color="#4a8860"
      />
      <pointLight position={[0, -1, 3]} intensity={0.8} color="#c8843a" distance={8} decay={2} />
    </>
  );
}

// ─── CINEMATIC CAMERA ──────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const camTarget = useRef(new THREE.Vector3(0, 0.5, 4.5));

  useFrame(() => {
    const p = rawScrollRef.current;

    let cx = 0, cy = 0.5, cz = 4.5;
    let lx = 0, ly = -0.8, lz = 0;

    if (p < 0.10) {
      // Scene 1 — close on seed
      const t = remap(p, 0, 0.10, 0, 1);
      cx = 0; cy = lerp(0.5, -0.4, t); cz = lerp(4.5, 3.0, t);
      lx = 0; ly = lerp(-0.8, -0.8, t); lz = 0;

    } else if (p < 0.20) {
      // Scene 2 — camera descends following roots
      const t = remap(p, 0.10, 0.20, 0, 1);
      cx = lerp(0, 0.6, t); cy = lerp(-0.4, -3.5, t); cz = lerp(3.0, 4.2, t);
      lx = lerp(0, 0.3, t); ly = lerp(-0.8, -3.8, t); lz = 0;

    } else if (p < 0.34) {
      // Scene 3 — crane up as tree grows
      const t = remap(p, 0.20, 0.34, 0, 1);
      cx = lerp(0.6, -1.0, t); cy = lerp(-3.5, 3.2, t); cz = lerp(4.2, 6.5, t);
      lx = lerp(0.3, 0, t); ly = lerp(-3.8, 2.5, t); lz = 0;

    } else if (p < 0.42) {
      // Scene 4a — Autonomous Intelligence (left branch)
      const t = remap(p, 0.34, 0.42, 0, 1);
      cx = lerp(-1.0, -3.8, t); cy = lerp(3.2, 3.4, t); cz = lerp(6.5, 4.5, t);
      lx = lerp(0, -2.5, t); ly = lerp(2.5, 3.4, t); lz = lerp(0, 0.8, t);

    } else if (p < 0.50) {
      // Scene 4b — AI Product Engineering (right branch)
      const t = remap(p, 0.42, 0.50, 0, 1);
      cx = lerp(-3.8, 4.2, t); cy = lerp(3.4, 4.0, t); cz = lerp(4.5, 4.0, t);
      lx = lerp(-2.5, 3.0, t); ly = lerp(3.4, 4.0, t); lz = lerp(0.8, -0.8, t);

    } else if (p < 0.58) {
      // Scene 4c — Cognitive Analytics (centered wide view of tree)
      const t = remap(p, 0.50, 0.58, 0, 1);
      cx = lerp(4.2, 0, t); cy = lerp(4.0, 3.5, t); cz = lerp(4.0, 6.0, t);
      lx = lerp(3.0, 0, t); ly = lerp(4.0, 3.5, t); lz = lerp(-0.8, 0, t);

    } else if (p < 0.65) {
      // Scene 4d — AI Consultancy (gentle orbit, pull-back)
      const t = remap(p, 0.58, 0.65, 0, 1);
      cx = lerp(0, 1.5, t); cy = lerp(3.5, 4.5, t); cz = lerp(6.0, 5.5, t);
      lx = lerp(0, 0.5, t); ly = lerp(3.5, 5.0, t); lz = lerp(0, 0.3, t);

    } else if (p < 0.78) {
      // Scene 5 — orbit around berry
      const t = remap(p, 0.65, 0.78, 0, 1);
      const orbitAngle = t * Math.PI * 0.6;
      const startX = lerp(1.5, 0, remap(p, 0.65, 0.72, 0, 1));
      cx = startX + Math.sin(orbitAngle) * 3.0;
      cy = lerp(4.5, 7.5, remap(p, 0.65, 0.72, 0, 1));
      cz = Math.cos(orbitAngle) * 3.0;
      lx = 0; ly = 7.2; lz = 0;

    } else if (p < 0.88) {
      // Scene 6 — follow berry falling
      const t = remap(p, 0.78, 0.88, 0, 1);
      const berryY = lerp(7.2, -4.0, t);
      cx = lerp(0, 0.8, t);
      cy = berryY + 1.0;
      cz = lerp(3.0, 3.5, t);
      lx = 0; ly = berryY; lz = 0;

    } else {
      // Scene 7 — pull back wide for rebirth
      const t = remap(p, 0.88, 1.0, 0, 1);
      cx = lerp(0.8, 0, t); cy = lerp(-3.0, -2.0, t); cz = lerp(3.5, 5.5, t);
      lx = 0; ly = lerp(-4, -3.5, t); lz = 0;
    }

    camTarget.current.set(cx, cy, cz);
    lookAtTarget.current.set(lx, ly, lz);

    camera.position.lerp(camTarget.current, 0.055);

    const tmpLook = new THREE.Vector3();
    tmpLook.lerp(lookAtTarget.current, 1);
    const currentLook = new THREE.Vector3();
    currentLook.copy(camera.position);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}

// ─── SCENE FOG ─────────────────────────────────────────────────────────
function SceneFog() {
  const { scene } = useThree();
  
  useEffect(() => {
    scene.fog = new THREE.FogExp2("#070907", 0.055);
    scene.background = new THREE.Color("#070907");
    return () => { scene.fog = null; };
  }, [scene]);

  useFrame(() => {
    const p = rawScrollRef.current;
    if (!scene.fog) return;
    // Lighter fog during tree/berry scenes for more visibility
    let targetDensity = 0.055;
    if (p > 0.22 && p < 0.72) targetDensity = 0.035;
    if (p > 0.80) targetDensity = 0.07;
    scene.fog.density = lerp(scene.fog.density, targetDensity, 0.03);
  });

  return null;
}

// ─── CANVAS CONSUMER (reads external ref) ──────────────────────────────
function ScrollConsumer({ progressRef }) {
  useFrame(() => {
    rawScrollRef.current = progressRef.current;
    scrollRef.current = mapScroll(progressRef.current);
  });
  return null;
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────
export default function Canvas3D({ progressRef }) {
  return (
    <div
      className="canvas-wrapper"
      style={{
        position: "fixed", inset: 0, zIndex: 0,
        // Ensure canvas is behind scrollable content but receives no pointer events
        pointerEvents: "none"
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 4.5], fov: 55, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ScrollConsumer progressRef={progressRef} />
        <SceneFog />
        <SceneLights />
        <CameraRig />
        <Particles />
        <Seed />
        <SeedRings />
        <GroundMist />
        <Roots />
        <RootTips />
        <Tree />
        <EnergyVortex />
        <DataStreams />
        <Berry />
        <BerryAura />
        <BerryOrbit />
        <BerryConstellation />
        <RebirthBurst />
        <ShockwaveRing />
        <BerryTrail />
        <BerryShatter />
        <NewSeeds />
      </Canvas>
    </div>
  );
}
