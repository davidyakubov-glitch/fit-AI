import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// ─── Skeleton joint definitions ───────────────────────────────────────────────
// Each pose is a map of joint → [x, y, z] in local space
// y = up, origin = hip center

const JOINTS = [
  'hips', 'spine', 'chest', 'neck', 'head',
  'lShoulder', 'lElbow', 'lWrist',
  'rShoulder', 'rElbow', 'rWrist',
  'lHip', 'lKnee', 'lAnkle',
  'rHip', 'rKnee', 'rAnkle',
];

const BONES = [
  ['hips','spine'],['spine','chest'],['chest','neck'],['neck','head'],
  ['chest','lShoulder'],['lShoulder','lElbow'],['lElbow','lWrist'],
  ['chest','rShoulder'],['rShoulder','rElbow'],['rElbow','rWrist'],
  ['hips','lHip'],['lHip','lKnee'],['lKnee','lAnkle'],
  ['hips','rHip'],['rHip','rKnee'],['rKnee','rAnkle'],
];

// Joints that glow per exercise
const HIGHLIGHT_JOINTS = {
  squat:          ['lKnee','rKnee','lHip','rHip'],
  lunge:          ['lKnee','rKnee','lHip','rHip'],
  push_up:        ['lShoulder','rShoulder','lElbow','rElbow'],
  plank:          ['hips','spine','lShoulder','rShoulder'],
  bicep_curl:     ['lElbow','rElbow'],
  shoulder_press: ['lShoulder','rShoulder','lElbow','rElbow'],
  deadlift:       ['hips','lHip','rHip','spine'],
  barbell_squat:  ['lKnee','rKnee','lHip','rHip'],
  default:        [],
};

// ─── Keyframe poses per exercise ─────────────────────────────────────────────
// Format: { jointName: [x, y, z] }  (y = height, x = lateral, z = depth)

function standingPose() {
  return {
    hips:      [0,   0,    0],
    spine:     [0,   0.35, 0],
    chest:     [0,   0.65, 0],
    neck:      [0,   0.82, 0],
    head:      [0,   1.0,  0],
    lShoulder: [-0.22, 0.65, 0],
    lElbow:    [-0.38, 0.38, 0],
    lWrist:    [-0.38, 0.10, 0],
    rShoulder: [0.22,  0.65, 0],
    rElbow:    [0.38,  0.38, 0],
    rWrist:    [0.38,  0.10, 0],
    lHip:      [-0.12, 0,   0],
    lKnee:     [-0.12,-0.48, 0],
    lAnkle:    [-0.12,-0.95, 0],
    rHip:      [0.12,  0,   0],
    rKnee:     [0.12, -0.48, 0],
    rAnkle:    [0.12, -0.95, 0],
  };
}

const EXERCISE_KEYFRAMES = {
  squat: [
    // standing
    standingPose(),
    // quarter down
    {
      hips:      [0,  -0.18, 0.05],
      spine:     [0,   0.15, 0.05],
      chest:     [0,   0.44, 0.05],
      neck:      [0,   0.60, 0.02],
      head:      [0,   0.78, 0],
      lShoulder: [-0.22, 0.44, 0.02],
      lElbow:    [-0.30, 0.25, 0.05],
      lWrist:    [-0.28, 0.05, 0.05],
      rShoulder: [0.22,  0.44, 0.02],
      rElbow:    [0.30,  0.25, 0.05],
      rWrist:    [0.28,  0.05, 0.05],
      lHip:      [-0.14,-0.18, 0.03],
      lKnee:     [-0.17,-0.58, 0.12],
      lAnkle:    [-0.14,-0.92, 0],
      rHip:      [0.14, -0.18, 0.03],
      rKnee:     [0.17, -0.58, 0.12],
      rAnkle:    [0.14, -0.92, 0],
    },
    // deep squat
    {
      hips:      [0,  -0.40, 0.10],
      spine:     [0,  -0.05, 0.08],
      chest:     [0,   0.24, 0.06],
      neck:      [0,   0.40, 0.03],
      head:      [0,   0.58, 0],
      lShoulder: [-0.22, 0.24, 0.04],
      lElbow:    [-0.28, 0.08, 0.06],
      lWrist:    [-0.26,-0.10, 0.06],
      rShoulder: [0.22,  0.24, 0.04],
      rElbow:    [0.28,  0.08, 0.06],
      rWrist:    [0.26, -0.10, 0.06],
      lHip:      [-0.16,-0.40, 0.05],
      lKnee:     [-0.20,-0.68, 0.22],
      lAnkle:    [-0.14,-0.92, 0.02],
      rHip:      [0.16, -0.40, 0.05],
      rKnee:     [0.20, -0.68, 0.22],
      rAnkle:    [0.14, -0.92, 0.02],
    },
  ],

  push_up: [
    // top (arms extended)
    {
      hips:      [0,  -0.45, 0],
      spine:     [0,  -0.15, 0],
      chest:     [0,   0.15, 0],
      neck:      [0,   0.30, 0],
      head:      [0,   0.46,-0.05],
      lShoulder: [-0.22, 0.12, 0],
      lElbow:    [-0.22, 0.12, 0.42],
      lWrist:    [-0.22, 0.12, 0.72],
      rShoulder: [0.22,  0.12, 0],
      rElbow:    [0.22,  0.12, 0.42],
      rWrist:    [0.22,  0.12, 0.72],
      lHip:      [-0.10,-0.45, 0],
      lKnee:     [-0.10,-0.45, 0.55],
      lAnkle:    [-0.10,-0.45, 1.05],
      rHip:      [0.10, -0.45, 0],
      rKnee:     [0.10, -0.45, 0.55],
      rAnkle:    [0.10, -0.45, 1.05],
    },
    // bottom (chest near floor)
    {
      hips:      [0,  -0.45, 0],
      spine:     [0,  -0.16, 0],
      chest:     [0,   0.14, 0],
      neck:      [0,   0.28, 0],
      head:      [0,   0.43,-0.04],
      lShoulder: [-0.22, 0.10, 0],
      lElbow:    [-0.30, 0.08, 0.22],
      lWrist:    [-0.22, 0.10, 0.72],
      rShoulder: [0.22,  0.10, 0],
      rElbow:    [0.30,  0.08, 0.22],
      rWrist:    [0.22,  0.10, 0.72],
      lHip:      [-0.10,-0.45, 0],
      lKnee:     [-0.10,-0.45, 0.55],
      lAnkle:    [-0.10,-0.45, 1.05],
      rHip:      [0.10, -0.45, 0],
      rKnee:     [0.10, -0.45, 0.55],
      rAnkle:    [0.10, -0.45, 1.05],
    },
  ],

  plank: [
    {
      hips:      [0,  -0.44, 0],
      spine:     [0,  -0.15, 0],
      chest:     [0,   0.15, 0],
      neck:      [0,   0.29, 0],
      head:      [0,   0.44,-0.04],
      lShoulder: [-0.22, 0.12, 0],
      lElbow:    [-0.22,-0.05, 0.10],
      lWrist:    [-0.22,-0.05, 0.32],
      rShoulder: [0.22,  0.12, 0],
      rElbow:    [0.22, -0.05, 0.10],
      rWrist:    [0.22, -0.05, 0.32],
      lHip:      [-0.10,-0.44, 0],
      lKnee:     [-0.10,-0.44, 0.55],
      lAnkle:    [-0.10,-0.44, 1.05],
      rHip:      [0.10, -0.44, 0],
      rKnee:     [0.10, -0.44, 0.55],
      rAnkle:    [0.10, -0.44, 1.05],
    },
  ],

  lunge: [
    standingPose(),
    {
      hips:      [0,  -0.35, 0.15],
      spine:     [0,  -0.02, 0.08],
      chest:     [0,   0.28, 0.04],
      neck:      [0,   0.44, 0.02],
      head:      [0,   0.62, 0],
      lShoulder: [-0.22, 0.28, 0.03],
      lElbow:    [-0.34, 0.10, 0.03],
      lWrist:    [-0.34,-0.08, 0.03],
      rShoulder: [0.22,  0.28, 0.03],
      rElbow:    [0.34,  0.10, 0.03],
      rWrist:    [0.34, -0.08, 0.03],
      lHip:      [-0.12,-0.35, 0.10],
      lKnee:     [-0.15,-0.72, 0.38],
      lAnkle:    [-0.12,-0.92, 0.60],
      rHip:      [0.12, -0.35, 0.10],
      rKnee:     [0.12, -0.78,-0.05],
      rAnkle:    [0.12, -0.92,-0.35],
    },
  ],

  bicep_curl: [
    {
      ...standingPose(),
      lElbow: [-0.38, 0.38, 0],
      lWrist: [-0.38, 0.10, 0],
      rElbow: [0.38,  0.38, 0],
      rWrist: [0.38,  0.10, 0],
    },
    {
      ...standingPose(),
      lElbow: [-0.28, 0.40, 0.05],
      lWrist: [-0.22, 0.68, 0.06],
      rElbow: [0.28,  0.40, 0.05],
      rWrist: [0.22,  0.68, 0.06],
    },
  ],

  shoulder_press: [
    {
      ...standingPose(),
      lShoulder: [-0.22, 0.65, 0],
      lElbow:    [-0.38, 0.65, 0],
      lWrist:    [-0.38, 0.82, 0],
      rShoulder: [0.22,  0.65, 0],
      rElbow:    [0.38,  0.65, 0],
      rWrist:    [0.38,  0.82, 0],
    },
    {
      ...standingPose(),
      lShoulder: [-0.22, 0.65, 0],
      lElbow:    [-0.30, 0.80, 0],
      lWrist:    [-0.22, 1.12, 0],
      rShoulder: [0.22,  0.65, 0],
      rElbow:    [0.30,  0.80, 0],
      rWrist:    [0.22,  1.12, 0],
    },
  ],
};

// Fall back to squat for unrecognized exercises
function getKeyframes(exerciseId) {
  return EXERCISE_KEYFRAMES[exerciseId] || EXERCISE_KEYFRAMES.squat;
}

// ─── Lerp helpers ─────────────────────────────────────────────────────────────
function lerpPose(a, b, t) {
  const result = {};
  for (const key of JOINTS) {
    const pa = a[key] || [0,0,0];
    const pb = b[key] || [0,0,0];
    result[key] = pa.map((v, i) => v + (pb[i] - v) * t);
  }
  return result;
}

function easeSine(t) {
  return (1 - Math.cos(t * Math.PI)) / 2;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Exercise3DDemo({ exerciseId = 'squat', exerciseName = '' }) {
  const mountRef = useRef(null);
  const keyframes = useMemo(() => getKeyframes(exerciseId), [exerciseId]);
  const highlightSet = useMemo(
    () => new Set(HIGHLIGHT_JOINTS[exerciseId] || HIGHLIGHT_JOINTS.default),
    [exerciseId]
  );
  const isStatic = keyframes.length === 1; // plank-style hold

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const W = container.clientWidth;
    const H = container.clientHeight || 340;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f4f8);

    // Subtle floor grid
    const gridHelper = new THREE.GridHelper(4, 10, 0xcccccc, 0xe2e8f0);
    gridHelper.position.y = -1.05;
    scene.add(gridHelper);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 50);
    camera.position.set(1.8, 0.5, 2.8);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(3, 6, 4);
    dir.castShadow = true;
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xd0e8ff, 0.4);
    fill.position.set(-3, 2, -2);
    scene.add(fill);

    // Build joint spheres
    const jointMeshes = {};
    const normalMat   = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.4, metalness: 0.1 });
    const glowMat     = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.2, metalness: 0.2, emissive: 0xa855f7, emissiveIntensity: 0.35 });
    const headMat     = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.35, metalness: 0.1 });

    for (const name of JOINTS) {
      const r = name === 'head' ? 0.075 : name === 'neck' ? 0.045 : 0.038;
      const geo  = new THREE.SphereGeometry(r, 14, 14);
      const mat  = name === 'head' ? headMat : highlightSet.has(name) ? glowMat : normalMat;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      scene.add(mesh);
      jointMeshes[name] = mesh;
    }

    // Build bone cylinders
    const boneMeshes = [];
    const boneMat    = new THREE.MeshStandardMaterial({ color: 0x6d6af0, roughness: 0.5, metalness: 0.05 });

    for (const [a, b] of BONES) {
      const geo  = new THREE.CylinderGeometry(0.022, 0.022, 1, 10);
      const mesh = new THREE.Mesh(geo, boneMat);
      mesh.castShadow = true;
      scene.add(mesh);
      boneMeshes.push({ mesh, a, b });
    }

    // Glow point lights on highlight joints
    const glowLights = {};
    if (highlightSet.size > 0) {
      for (const j of highlightSet) {
        const light = new THREE.PointLight(0xa855f7, 0.5, 0.5);
        scene.add(light);
        glowLights[j] = light;
      }
    }

    // Shadow plane
    const planeGeo = new THREE.PlaneGeometry(6, 6);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const plane    = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1.05;
    plane.receiveShadow = true;
    scene.add(plane);

    // Animation loop
    let animId;
    const clock = new THREE.Clock();
    const LOOP_DURATION = isStatic ? 99999 : 3.5; // seconds per full cycle

    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();

    function updateSkeleton(pose) {
      for (const name of JOINTS) {
        const p = pose[name];
        if (!p) continue;
        jointMeshes[name].position.set(p[0], p[1], p[2]);
        if (glowLights[name]) glowLights[name].position.set(p[0], p[1], p[2]);
      }
      for (const { mesh, a, b } of boneMeshes) {
        const pa = pose[a], pb = pose[b];
        if (!pa || !pb) continue;
        v1.set(...pa);
        v2.set(...pb);
        const mid = v1.clone().lerp(v2, 0.5);
        mesh.position.copy(mid);
        const length = v1.distanceTo(v2);
        mesh.scale.y = length;
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          v2.clone().sub(v1).normalize()
        );
      }
    }

    // Slight camera orbit
    let camAngle = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera gentle orbit
      camAngle = elapsed * 0.18;
      camera.position.x = Math.sin(camAngle) * 2.0 + 1.0;
      camera.position.z = Math.cos(camAngle) * 2.4 + 1.0;
      camera.lookAt(0, 0, 0);

      // Pose interpolation
      if (keyframes.length === 1) {
        updateSkeleton(keyframes[0]);
      } else {
        const total  = keyframes.length;
        const t      = (elapsed % LOOP_DURATION) / LOOP_DURATION;
        const segT   = t * (total - 1 + 1); // bounce: 0→1→0
        // Ping-pong: go forward then reverse
        const pingPong = (elapsed % (LOOP_DURATION)) / (LOOP_DURATION / 2);
        const pp       = pingPong <= 1 ? pingPong : 2 - pingPong;
        const segCount = total - 1;
        const raw      = pp * segCount;
        const seg      = Math.min(Math.floor(raw), segCount - 1);
        const segFrac  = easeSine(raw - seg);
        const pose     = lerpPose(keyframes[seg], keyframes[seg + 1] || keyframes[seg], segFrac);
        updateSkeleton(pose);
      }

      // Glow pulse
      const pulse = 0.25 + 0.2 * Math.sin(elapsed * 3.5);
      for (const j of highlightSet) {
        if (glowLights[j]) glowLights[j].intensity = pulse;
        if (jointMeshes[j]) jointMeshes[j].material.emissiveIntensity = pulse;
      }

      renderer.render(scene, camera);
    }
    animate();

    // Resize
    const observer = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight || 340;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    observer.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [exerciseId]);

  return (
    <div className="rounded-xl overflow-hidden border border-purple-100 shadow-lg bg-slate-50"
         style={{ width: '100%', height: 340 }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}