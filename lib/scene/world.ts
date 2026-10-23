import * as THREE from "three";
import { createLabel, crashLabel, Label, LabelColors, randomLabel, recoveryLabel, Tone } from "./labels";

/**
 * The 3D backdrop: a camera that flies down a server-room corridor as the page scrolls. Racks blink and
 * now and then crash and recover, status codes, latencies and pings drift past, and each stretch of the
 * corridor holds one scene: request routing, a neural network, live charts, and a replicated database.
 */

type Role = Tone | "surface" | "grid";
type Palette = Record<Role | "bg", number>;

// Tailwind's zinc and emerald/sky/amber/red, matched to the page in each theme.
const PALETTES: Record<"light" | "dark", Palette> = {
  dark: {
    bg: 0x09090b,
    accent: 0x34d399,
    info: 0x38bdf8,
    warn: 0xfbbf24,
    error: 0xf87171,
    muted: 0x71717a,
    surface: 0x18181b,
    grid: 0x27272a,
  },
  light: {
    bg: 0xfafafa,
    accent: 0x059669,
    info: 0x0284c7,
    warn: 0xd97706,
    error: 0xdc2626,
    muted: 0x52525b,
    surface: 0xd4d4d8,
    grid: 0xa1a1aa,
  },
};

const Z_START = 10; // camera z at the top of the page
const Z_END = -128; // camera z at the bottom
const FLOOR = -1;

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];
const hex = (n: number) => `#${n.toString(16).padStart(6, "0")}`;
const isDark = () => document.documentElement.classList.contains("dark");

export interface WorldOptions {
  reducedMotion: boolean;
}

/** Builds the scene on `canvas` and starts it. Returns a function that stops it and frees the GPU. */
export const createWorld = (canvas: HTMLCanvasElement, { reducedMotion }: WorldOptions) => {
  const mobile = window.innerWidth < 720;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const fog = new THREE.Fog(0, 6, 44);
  scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 80);

  // ---------- theme ----------
  let pal = PALETTES[isDark() ? "dark" : "light"];
  const labelColors = (): LabelColors => ({
    accent: hex(pal.accent),
    info: hex(pal.info),
    warn: hex(pal.warn),
    error: hex(pal.error),
    muted: hex(pal.muted),
    bg: isDark() ? "rgba(9, 9, 11, 0.62)" : "rgba(250, 250, 250, 0.72)",
  });
  const tinted: [{ color: THREE.Color }, Role][] = [];
  const tint = <M extends THREE.Material & { color: THREE.Color }>(material: M, role: Role) => {
    tinted.push([material, role]);
    material.color.setHex(pal[role]);
    return material;
  };
  const surface = (role: Role, opacity = 1) =>
    tint(new THREE.MeshBasicMaterial({ transparent: opacity < 1, opacity }), role);
  const strokes = (role: Role, opacity: number) => tint(new THREE.LineBasicMaterial({ transparent: true, opacity }), role);
  const dots = (role: Role, size: number, opacity: number) =>
    tint(new THREE.PointsMaterial({ size, transparent: true, opacity, depthWrite: false }), role);

  const labels: Label[] = [];
  const staticLabel = (parent: THREE.Object3D, text: string, tone: Tone, x: number, y: number, z: number) => {
    const label = createLabel();
    label.set(text, tone, labelColors());
    label.sprite.position.set(x, y, z);
    label.sprite.material.opacity = 0.8;
    parent.add(label.sprite);
    labels.push(label);
    return label;
  };

  const applyTheme = () => {
    pal = PALETTES[isDark() ? "dark" : "light"];
    fog.color.setHex(pal.bg);
    tinted.forEach(([material, role]) => material.color.setHex(pal[role]));
    const colors = labelColors();
    labels.forEach((label) => label.paint(colors));
  };
  fog.color.setHex(pal.bg);

  // ---------- shared pieces ----------
  let now = 0;
  let camZ = Z_START;
  // Callbacks due at a scene time; run from the frame loop so nothing fires after dispose.
  const pending: [number, () => void][] = [];
  const later = (ms: number, fn: () => void) => pending.push([now + ms, fn]);
  const color = new THREE.Color();
  const dummy = new THREE.Object3D();

  interface Zone {
    group: THREE.Group;
    z: number;
    update?: (t: number, dt: number) => void;
  }
  const zones: Zone[] = [];
  const zone = (z: number): Zone => {
    const group = new THREE.Group();
    group.position.z = z;
    scene.add(group);
    const entry: Zone = { group, z };
    zones.push(entry);
    return entry;
  };

  /** Outlines a geometry, for the wireframe-over-surface look everything shares. */
  const outline = (geometry: THREE.BufferGeometry, role: Role, opacity = 0.7, threshold = 1) =>
    new THREE.LineSegments(new THREE.EdgesGeometry(geometry, threshold), strokes(role, opacity));

  // Expanding rings: pings, crashes, replication acks.
  const ringGeometry = new THREE.RingGeometry(0.9, 1, 48);
  const rings = Array.from({ length: 16 }, () => {
    const mesh = new THREE.Mesh(
      ringGeometry,
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    );
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, born: -Infinity, life: 1, role: "accent" as Role, size: 1 };
  });
  const pulse = (at: THREE.Vector3, role: Role, size = 1.2, life = 1200, flat = false) => {
    const ring = rings.reduce((oldest, r) => (r.born < oldest.born ? r : oldest));
    Object.assign(ring, { born: now, life, role, size });
    ring.mesh.position.copy(at);
    ring.mesh.rotation.set(flat ? -Math.PI / 2 : 0, 0, 0);
    ring.mesh.visible = true;
  };
  const updateRings = () =>
    rings.forEach((ring) => {
      if (!ring.mesh.visible) return;
      const age = (now - ring.born) / ring.life;
      if (age >= 1) {
        ring.mesh.visible = false;
        return;
      }
      ring.mesh.scale.setScalar(0.15 + age * ring.size);
      const material = ring.mesh.material;
      material.opacity = 0.75 * (1 - age);
      material.color.setHex(pal[ring.role]);
    });

  // Packets that travel along a polyline, e.g. a request hopping client → load balancer → service.
  const packetGeometry = new THREE.SphereGeometry(0.07, 10, 8);
  const createPackets = (parent: THREE.Object3D, count: number) => {
    const pool = Array.from({ length: count }, () => {
      const mesh = new THREE.Mesh(packetGeometry, new THREE.MeshBasicMaterial());
      mesh.visible = false;
      parent.add(mesh);
      return {
        mesh,
        path: [] as THREE.Vector3[],
        seg: 0,
        p: 0,
        speed: 1,
        role: "accent" as Role,
        onArrive: undefined as (() => void) | undefined,
        active: false,
      };
    });
    const launch = (path: THREE.Vector3[], role: Role, speed = 2.6, onArrive?: () => void) => {
      const packet = pool.find((p) => !p.active);
      if (!packet) return;
      Object.assign(packet, { path, seg: 0, p: 0, speed, role, onArrive, active: true });
      packet.mesh.position.copy(path[0]);
      packet.mesh.visible = true;
    };
    const update = (dt: number) =>
      pool.forEach((packet) => {
        if (!packet.active) return;
        const length = packet.path[packet.seg].distanceTo(packet.path[packet.seg + 1]) || 1;
        packet.p += (packet.speed * dt) / length;
        if (packet.p >= 1) {
          packet.p = 0;
          packet.seg++;
          if (packet.seg >= packet.path.length - 1) {
            packet.active = false;
            packet.mesh.visible = false;
            packet.onArrive?.();
            return;
          }
        }
        packet.mesh.position.lerpVectors(packet.path[packet.seg], packet.path[packet.seg + 1], packet.p);
        packet.mesh.material.color.setHex(pal[packet.role]);
      });
    return { launch, update };
  };

  // Labels that pop up over an event, then rise and fade.
  const events = Array.from({ length: 6 }, () => {
    const label = createLabel();
    scene.add(label.sprite);
    labels.push(label);
    return { label, born: -Infinity, life: 1, y: 0 };
  });
  const announce = (text: string, tone: Tone, at: THREE.Vector3, life = 2200) => {
    const event = events.reduce((oldest, e) => (e.born < oldest.born ? e : oldest));
    event.label.set(text, tone, labelColors());
    event.label.sprite.position.copy(at);
    Object.assign(event, { born: now, life, y: at.y });
  };
  const updateEvents = () =>
    events.forEach((event) => {
      const age = (now - event.born) / event.life;
      const sprite = event.label.sprite;
      if (age >= 1) {
        sprite.material.opacity = 0;
        return;
      }
      sprite.position.y = event.y + age * 0.6;
      sprite.material.opacity = Math.min(1, age / 0.08) * Math.min(1, (1 - age) / 0.3);
    });

  // ---------- the corridor: floor grid, dust, and two rows of racks on each side ----------
  {
    const extent = 26;
    const near = 16;
    const far = Z_END - 44;
    const points: number[] = [];
    for (let x = -extent; x <= extent; x += 2) points.push(x, FLOOR, near, x, FLOOR, far);
    for (let z = near; z >= far; z -= 2) points.push(-extent, FLOOR, z, extent, FLOOR, z);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    scene.add(new THREE.LineSegments(geometry, strokes("grid", 0.6)));
  }
  {
    const count = mobile ? 280 : 600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = rand(-14, 14);
      positions[i * 3 + 1] = rand(FLOOR, 8);
      positions[i * 3 + 2] = rand(Z_END - 40, 14);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(geometry, dots("muted", 0.045, 0.55)));
  }

  const RACK = { w: 1.3, h: 3.2, d: 1.7 };
  const LEDS_PER_RACK = 10;
  const racks: THREE.Vector3[] = [];
  for (let z = 8; z > Z_END - 30; z -= 6.5) {
    for (const side of [-1, 1]) {
      racks.push(new THREE.Vector3(side * 7.2, FLOOR + RACK.h / 2, z + (side > 0 ? 3.25 : 0)));
      racks.push(new THREE.Vector3(side * 11.5, FLOOR + RACK.h / 2 + 0.4, z + (side > 0 ? 0 : 3.25)));
    }
  }
  const rackGeometry = new THREE.BoxGeometry(RACK.w, RACK.h, RACK.d);
  const rackBodies = new THREE.InstancedMesh(rackGeometry, surface("surface", 0.92), racks.length);
  racks.forEach((p, i) => {
    dummy.position.copy(p);
    dummy.scale.set(1, p.y > FLOOR + RACK.h / 2 ? 1.25 : 1, 1);
    dummy.updateMatrix();
    rackBodies.setMatrixAt(i, dummy.matrix);
  });
  rackBodies.frustumCulled = false;
  scene.add(rackBodies);
  {
    // Every rack's edges merged into one draw call.
    const edges = new THREE.EdgesGeometry(rackGeometry).attributes.position.array;
    const merged = new Float32Array(edges.length * racks.length);
    racks.forEach((p, i) => {
      const tall = p.y > FLOOR + RACK.h / 2 ? 1.25 : 1;
      for (let k = 0; k < edges.length; k += 3) {
        merged[i * edges.length + k] = edges[k] + p.x;
        merged[i * edges.length + k + 1] = edges[k + 1] * tall + p.y;
        merged[i * edges.length + k + 2] = edges[k + 2] + p.z;
      }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(merged, 3));
    scene.add(new THREE.LineSegments(geometry, strokes("muted", 0.45)));
  }

  // LEDs on the face of each rack that looks into the corridor.
  const ledCount = racks.length * LEDS_PER_RACK;
  const leds = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.34, 0.07), new THREE.MeshBasicMaterial(), ledCount);
  const ledRole: Role[] = [];
  const ledPhase = new Float32Array(ledCount);
  const ledSpeed = new Float32Array(ledCount);
  racks.forEach((p, r) => {
    const side = Math.sign(p.x);
    for (let k = 0; k < LEDS_PER_RACK; k++) {
      const i = r * LEDS_PER_RACK + k;
      dummy.position.set(p.x - side * (RACK.w / 2 + 0.01), p.y - 1.2 + Math.floor(k / 2) * 0.6, p.z + (k % 2 ? 0.35 : -0.35));
      dummy.rotation.set(0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      leds.setMatrixAt(i, dummy.matrix);
      leds.setColorAt(i, color.setHex(pal.accent));
      ledRole.push(Math.random() < 0.7 ? "accent" : Math.random() < 0.7 ? "info" : "warn");
      ledPhase[i] = rand(0, Math.PI * 2);
      ledSpeed[i] = rand(0.6, 3);
    }
  });
  leds.frustumCulled = false;
  scene.add(leds);

  const crashedUntil = new Float64Array(racks.length);
  let nextCrash = 2500;
  const background = new THREE.Color();
  const updateRacks = (t: number) => {
    if (t > nextCrash) {
      nextCrash = t + rand(2600, 5200);
      const candidates = racks
        .map((p, i) => [p, i] as const)
        .filter(([p]) => Math.abs(p.x) < 9 && p.z < camZ - 7 && p.z > camZ - 30);
      if (candidates.length) {
        const [p, i] = pick(candidates);
        crashedUntil[i] = t + 1900;
        const face = new THREE.Vector3(p.x - Math.sign(p.x) * 1.2, p.y + RACK.h / 2 + 0.5, p.z);
        announce(crashLabel(), "error", face);
        pulse(face, "error", 2.2, 1400);
        later(2000, () => {
          announce(recoveryLabel(), "accent", face);
          pulse(face, "accent", 1.6, 1200);
        });
      }
    }
    background.setHex(pal.bg);
    for (let i = 0; i < ledCount; i++) {
      const rack = Math.floor(i / LEDS_PER_RACK);
      let level: number;
      if (crashedUntil[rack] > t) {
        color.setHex(pal.error);
        level = (Math.floor(t / 110) + i) % 2 ? 1 : 0.15;
      } else {
        color.setHex(pal[ledRole[i]]);
        level = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * 0.001 * ledSpeed[i] + ledPhase[i]));
      }
      leds.setColorAt(i, color.lerpColors(background, color, level));
    }
    leds.instanceColor!.needsUpdate = true;
  };

  // Chatter that drifts past: status codes, latencies, pings, tech names.
  const floaterCount = mobile ? 16 : 30;
  const floaters = Array.from({ length: floaterCount }, () => {
    const label = createLabel();
    scene.add(label.sprite);
    labels.push(label);
    return { label, born: 0, life: 1, drift: 0 };
  });
  const spawnFloater = (floater: (typeof floaters)[number], first: boolean) => {
    const [text, tone] = randomLabel();
    floater.label.set(text, tone, labelColors());
    const side = Math.random() < 0.5 ? -1 : 1;
    floater.label.sprite.position.set(side * rand(1.6, 7), rand(-0.3, 4.8), camZ - (first ? rand(8, 40) : rand(16, 40)));
    floater.life = rand(6000, 12000);
    // On the first pass, start labels part-way through their lives so they don't all fade in at once.
    floater.born = now - (first ? rand(0, floater.life * 0.6) : 0);
    floater.drift = rand(0.04, 0.12);
  };
  floaters.forEach((f) => spawnFloater(f, true));
  const updateFloaters = (dt: number) =>
    floaters.forEach((floater) => {
      const sprite = floater.label.sprite;
      const age = (now - floater.born) / floater.life;
      const distance = camZ - sprite.position.z;
      if (age >= 1 || distance < 3) {
        spawnFloater(floater, false);
        return;
      }
      sprite.position.y += floater.drift * dt;
      // Fade out as the camera closes in, so a label never fills the screen.
      const near = Math.min(1, Math.max(0, (distance - 3) / 7));
      sprite.material.opacity = 0.75 * near * Math.min(1, age / 0.15) * Math.min(1, (1 - age) / 0.2);
    });

  // ---------- scene 1: a request's path, client → load balancer → services → databases ----------
  {
    const topo = zone(-6);
    const g = topo.group;
    const clients = [0.4, 1.4, 2.4, 3.4].map((y, i) => new THREE.Vector3(-5.4, y, (i % 2) - 0.5));
    const lb = new THREE.Vector3(-2.2, 2, 0);
    const services = [0.9, 2, 3.1].map((y) => new THREE.Vector3(0.9, y, 0));
    const dbs = [new THREE.Vector3(3.9, 1.3, 0), new THREE.Vector3(3.9, 2.9, 0)];

    const clientGeometry = new THREE.SphereGeometry(0.13, 14, 10);
    clients.forEach((p) => {
      const mesh = new THREE.Mesh(clientGeometry, surface("info"));
      mesh.position.copy(p);
      g.add(mesh);
    });
    const lbGeometry = new THREE.OctahedronGeometry(0.42);
    const lbMesh = new THREE.Mesh(lbGeometry, surface("surface"));
    lbMesh.add(outline(lbGeometry, "accent", 0.9));
    lbMesh.position.copy(lb);
    g.add(lbMesh);
    const serviceGeometry = new THREE.BoxGeometry(0.7, 0.42, 0.42);
    services.forEach((p) => {
      const mesh = new THREE.Mesh(serviceGeometry, surface("surface"));
      mesh.add(outline(serviceGeometry, "accent", 0.8));
      mesh.position.copy(p);
      g.add(mesh);
    });
    const dbGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.6, 28);
    dbs.forEach((p, i) => {
      const mesh = new THREE.Mesh(dbGeometry, surface("surface"));
      mesh.add(outline(dbGeometry, i ? "warn" : "info", 0.85, 20));
      mesh.position.copy(p);
      g.add(mesh);
    });

    const links: THREE.Vector3[] = [];
    clients.forEach((c) => links.push(c, lb));
    services.forEach((s) => {
      links.push(lb, s);
      dbs.forEach((d) => links.push(s, d));
    });
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(links), strokes("muted", 0.35)));

    staticLabel(g, "clients", "muted", -5.4, 4.2, 0);
    staticLabel(g, "HAProxy", "accent", -2.2, 2.75, 0);
    staticLabel(g, "api · FastAPI / Go", "accent", 0.9, 3.75, 0);
    staticLabel(g, "PostgreSQL", "info", 3.9, 0.6, 0);
    staticLabel(g, "Redis", "warn", 3.9, 3.6, 0);

    const packets = createPackets(g, 18);
    const world = (v: THREE.Vector3) => g.localToWorld(v.clone());
    let nextRequest = 0;
    let nextPing = 600;
    let nextTimeout = 0;
    topo.update = (t, dt) => {
      if (t > nextRequest) {
        nextRequest = t + rand(160, 360);
        const client = pick(clients);
        const service = pick(services);
        if (Math.random() < 0.06) {
          // A request that times out at the service.
          packets.launch([client, lb, service], "warn", 2.6, () => {
            pulse(world(service), "error", 0.9, 900);
            if (now > nextTimeout) {
              nextTimeout = now + 4000;
              announce(pick(["504 Gateway Timeout", "503 Service Unavailable", "429 Too Many Requests"]), "error", world(service).add(new THREE.Vector3(0, 0.7, 0)), 1800);
            }
          });
        } else {
          const db = pick(dbs);
          packets.launch([client, lb, service, db], "accent", 3, () => packets.launch([db, service, lb, client], "info", 3.4));
        }
      }
      if (t > nextPing) {
        nextPing = t + 1500;
        pulse(world(lb), "accent", 1.4, 1100);
      }
      lbMesh.rotation.y += dt * 0.8;
      packets.update(dt);
    };
  }

  // ---------- scene 2: a neural network running forward passes, and an agent core above it ----------
  {
    const ai = zone(-36);
    const g = ai.group;
    const layerSizes = [5, 8, 8, 4];
    const nodes: THREE.Vector3[] = [];
    const layerOf: number[] = [];
    const layers: number[][] = layerSizes.map((size, l) =>
      Array.from({ length: size }, (_, k) => {
        nodes.push(new THREE.Vector3(-3.6 + l * 2.4, 2.1 + (k - (size - 1) / 2) * 0.55, Math.sin(k + l) * 0.3));
        layerOf.push(l);
        return nodes.length - 1;
      }),
    );

    const nodeMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshBasicMaterial(), nodes.length);
    nodes.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      nodeMesh.setMatrixAt(i, dummy.matrix);
      nodeMesh.setColorAt(i, color.setHex(pal.muted));
    });
    g.add(nodeMesh);
    const links: THREE.Vector3[] = [];
    for (let l = 0; l < layers.length - 1; l++)
      layers[l].forEach((a) => layers[l + 1].forEach((b) => links.push(nodes[a], nodes[b])));
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(links), strokes("muted", 0.16)));

    const core = new THREE.Group();
    core.position.set(0, 5.1, -3);
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), tint(new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.3 }), "accent"));
    const heartGeometry = new THREE.IcosahedronGeometry(0.5, 0);
    const heart = new THREE.Mesh(heartGeometry, surface("surface"));
    heart.add(outline(heartGeometry, "accent", 0.9));
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.012, 8, 90), tint(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.4 }), "info"));
    halo.rotation.x = 1.2;
    core.add(shell, heart, halo);
    g.add(core);

    staticLabel(g, "agent · plan → act → verify", "accent", 0, 3.6, -3);
    staticLabel(g, "embeddings", "info", -3.6, 0.2, 0);
    staticLabel(g, "tool_call", "accent", 3.6, 0.8, 0);
    staticLabel(g, "MCP · memory · code graph", "muted", 2.6, 5.6, -3);

    const charge = new Float32Array(nodes.length);
    const signals = createPackets(g, 26);
    const fire = (from: number) => {
      charge[from] = 1;
      const next = layers[layerOf[from] + 1];
      if (!next) return;
      const fanOut = Math.random() < 0.5 ? 1 : 2;
      for (let k = 0; k < fanOut; k++) {
        const to = pick(next);
        signals.launch([nodes[from], nodes[to]], "accent", 3.2, () => fire(to));
      }
    };
    let nextPass = 0;
    const lit = new THREE.Color();
    ai.update = (t, dt) => {
      if (t > nextPass) {
        nextPass = t + rand(500, 900);
        fire(pick(layers[0]));
      }
      for (let i = 0; i < nodes.length; i++) {
        charge[i] *= Math.exp(-dt * 2.2);
        nodeMesh.setColorAt(i, color.setHex(pal.muted).lerp(lit.setHex(pal.accent), charge[i]));
      }
      nodeMesh.instanceColor!.needsUpdate = true;
      shell.rotation.y += dt * 0.15;
      shell.rotation.x += dt * 0.05;
      heart.rotation.y -= dt * 0.5;
      halo.rotation.z += dt * 0.3;
      g.rotation.y = Math.sin(t * 0.0003) * 0.12;
      signals.update(dt);
    };
  }

  // ---------- scene 3: data analysis, a live histogram, candlesticks with an SMA, and a regression ----------
  {
    const data = zone(-70);
    const g = data.group;

    const COLS = 8;
    const ROWS = 5;
    const barGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    barGeometry.translate(0, 0.5, 0);
    const bars = new THREE.InstancedMesh(barGeometry, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85 }), COLS * ROWS);
    for (let i = 0; i < COLS * ROWS; i++) bars.setColorAt(i, color.setHex(pal.info));
    bars.frustumCulled = false;
    g.add(bars);
    staticLabel(g, "histogram · daily returns", "info", -4.9, 3.4, 0);

    const CANDLES = 22;
    const candleX = (i: number) => 1.2 + i * 0.24;
    const candles: { o: number; c: number; h: number; l: number }[] = [];
    let price = 1200;
    const nextCandle = () => {
      const o = price;
      price = Math.max(200, price + rand(-38, 40));
      return { o, c: price, h: Math.max(o, price) + rand(4, 22), l: Math.min(o, price) - rand(4, 22) };
    };
    for (let i = 0; i < CANDLES; i++) candles.push(nextCandle());
    const bodies = new THREE.InstancedMesh(new THREE.BoxGeometry(0.15, 1, 0.06), new THREE.MeshBasicMaterial(), CANDLES);
    for (let i = 0; i < CANDLES; i++) bodies.setColorAt(i, color.setHex(pal.accent));
    bodies.frustumCulled = false;
    g.add(bodies);
    const wickGeometry = new THREE.BufferGeometry();
    wickGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(CANDLES * 6), 3));
    const wicks = new THREE.LineSegments(wickGeometry, strokes("muted", 0.8));
    wicks.frustumCulled = false;
    g.add(wicks);
    const smaGeometry = new THREE.BufferGeometry();
    smaGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(CANDLES * 3), 3));
    const sma = new THREE.Line(smaGeometry, strokes("info", 0.9));
    sma.frustumCulled = false;
    g.add(sma);
    g.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(1, 0.4, 0), new THREE.Vector3(6.6, 0.4, 0),
          new THREE.Vector3(1, 0.4, 0), new THREE.Vector3(1, 4.1, 0),
        ]),
        strokes("muted", 0.6),
      ),
    );
    staticLabel(g, "NEPSE · OHLC 1d · SMA(5)", "accent", 3.8, 4.5, 0);

    const drawCandles = () => {
      const low = Math.min(...candles.map((c) => c.l));
      const high = Math.max(...candles.map((c) => c.h));
      const y = (v: number) => 0.6 + ((v - low) / (high - low || 1)) * 3.3;
      const wick = wickGeometry.attributes.position.array as Float32Array;
      const avg = smaGeometry.attributes.position.array as Float32Array;
      candles.forEach((candle, i) => {
        const top = y(Math.max(candle.o, candle.c));
        const bottom = y(Math.min(candle.o, candle.c));
        dummy.position.set(candleX(i), (top + bottom) / 2, 0);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, Math.max(0.03, top - bottom), 1);
        dummy.updateMatrix();
        bodies.setMatrixAt(i, dummy.matrix);
        bodies.setColorAt(i, color.setHex(candle.c >= candle.o ? pal.accent : pal.error));
        wick.set([candleX(i), y(candle.l), 0, candleX(i), y(candle.h), 0], i * 6);
        const window5 = candles.slice(Math.max(0, i - 4), i + 1);
        avg.set([candleX(i), y(window5.reduce((s, c) => s + c.c, 0) / window5.length), 0.05], i * 3);
      });
      bodies.instanceMatrix.needsUpdate = true;
      bodies.instanceColor!.needsUpdate = true;
      wickGeometry.attributes.position.needsUpdate = true;
      smaGeometry.attributes.position.needsUpdate = true;
    };
    drawCandles();

    const scatter = new THREE.Group();
    scatter.position.set(-0.6, 5.4, -5);
    {
      const count = 140;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const x = rand(-2, 2);
        positions.set([x, 0.6 * x + (Math.random() + Math.random() - 1) * 0.6, rand(-0.4, 0.4)], i * 3);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      scatter.add(new THREE.Points(geometry, dots("info", 0.08, 0.85)));
      scatter.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.3, -1.38, 0), new THREE.Vector3(2.3, 1.38, 0)]),
          strokes("accent", 0.9),
        ),
      );
    }
    g.add(scatter);
    staticLabel(g, "r = 0.82 · n = 140", "accent", -0.6, 3.6, -5);

    let nextTick = 0;
    const lit = new THREE.Color();
    data.update = (t) => {
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;
          const h = 0.2 + 2.3 * (0.5 + 0.5 * Math.sin(t * 0.0008 + c * 0.6 + r * 1.1)) * (0.65 + 0.35 * Math.sin(t * 0.0003 + c));
          dummy.position.set(-6.5 + c * 0.42, FLOOR, -1 + r * 0.42);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(1, h, 1);
          dummy.updateMatrix();
          bars.setMatrixAt(i, dummy.matrix);
          bars.setColorAt(i, color.setHex(pal.info).lerp(lit.setHex(pal.accent), h / 2.5));
        }
      bars.instanceMatrix.needsUpdate = true;
      bars.instanceColor!.needsUpdate = true;
      if (t > nextTick) {
        nextTick = t + 1000;
        candles.shift();
        candles.push(nextCandle());
        drawCandles();
      }
      scatter.rotation.y = Math.sin(t * 0.0004) * 0.6;
    };
  }

  // ---------- scene 4: a Postgres primary replicating to two replicas, with Redis in front ----------
  {
    const db = zone(-102);
    const g = db.group;
    const diskGeometry = new THREE.CylinderGeometry(1, 1, 0.42, 40);
    const database = (x: number, z: number, scale: number, role: Role, base = FLOOR) => {
      const stack = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const disk = new THREE.Mesh(diskGeometry, surface("surface", 0.92));
        disk.add(outline(diskGeometry, role, 0.8, 20));
        disk.position.y = 0.21 + i * 0.55;
        stack.add(disk);
      }
      stack.position.set(x, base, z);
      stack.scale.setScalar(scale);
      g.add(stack);
      return new THREE.Vector3(x, base + 1.7 * scale, z);
    };
    const primary = database(0, 0, 1, "accent");
    const replicas = [database(-4.4, -2.5, 0.7, "info"), database(4.4, -2.5, 0.7, "info")];
    const cache = database(0, -5.5, 0.55, "warn", 2.6);

    const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.012, 8, 90), tint(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.45 }), "accent"));
    orbit.rotation.x = Math.PI / 2;
    orbit.position.set(0, FLOOR + 0.9, 0);
    g.add(orbit);
    const links = [primary, replicas[0], primary, replicas[1], primary, cache];
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(links), strokes("muted", 0.35)));

    staticLabel(g, "postgres · primary", "accent", 0, 2.2, 0);
    staticLabel(g, "replica-1 · lag 0.4ms", "info", -4.4, 1.6, -2.5);
    staticLabel(g, "replica-2 · lag 0.6ms", "info", 4.4, 1.6, -2.5);
    staticLabel(g, "redis · hit 97%", "warn", 0, 4.1, -5.5);

    const packets = createPackets(g, 14);
    const world = (v: THREE.Vector3) => g.localToWorld(v.clone());
    let nextWal = 0;
    let nextCache = 300;
    db.update = (t, dt) => {
      if (t > nextWal) {
        nextWal = t + rand(400, 800);
        const replica = pick(replicas);
        packets.launch([primary, replica], "accent", 4, () => pulse(world(replica), "info", 0.8, 800));
      }
      if (t > nextCache) {
        nextCache = t + rand(600, 1100);
        packets.launch([cache, primary], "warn", 3.5);
      }
      orbit.rotation.z += dt * 0.4;
      packets.update(dt);
    };
  }

  // ---------- the end of the corridor: a health beacon ----------
  {
    const end = zone(Z_END - 12);
    const g = end.group;
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 11, 12, 1, true),
      tint(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }), "accent"),
    );
    beam.position.y = 4.5;
    g.add(beam);
    const count = mobile ? 120 : 240;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const r = rand(0.3, 2.6);
      positions.set([Math.cos(a) * r, rand(FLOOR, 9), Math.sin(a) * r], i * 3);
      speeds[i] = rand(0.3, 1.2);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.add(new THREE.Points(geometry, dots("accent", 0.07, 0.7)));
    staticLabel(g, "GET /health 200 OK · all systems operational", "accent", 0, 3.4, 1);

    const base = new THREE.Vector3(0, FLOOR + 0.05, Z_END - 12);
    let nextBeat = 0;
    end.update = (t, dt) => {
      if (t > nextBeat) {
        nextBeat = t + 1100;
        pulse(base, "accent", 4, 2600, true);
      }
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += speeds[i] * dt;
        if (positions[i * 3 + 1] > 9) positions[i * 3 + 1] = FLOOR;
      }
      geometry.attributes.position.needsUpdate = true;
      beam.material.opacity = 0.12 + 0.06 * Math.sin(t * 0.003);
    };
  }

  // ---------- camera flight ----------
  let scroll = 0;
  let pointerX = 0;
  let pointerY = 0;
  let camX = 0;
  let camY = 1.6;
  const readScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scroll = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  };
  readScroll();
  camZ = Z_START - scroll * (Z_START - Z_END);

  const placeCamera = (t: number, ease: number) => {
    const targetZ = Z_START - scroll * (Z_START - Z_END);
    const targetX = Math.sin(scroll * Math.PI * 2.2) * 1.3 + pointerX * 0.6;
    const targetY = 1.6 - pointerY * 0.35 + Math.sin(t * 0.0005) * 0.1;
    camZ += (targetZ - camZ) * ease;
    camX += (targetX - camX) * ease;
    camY += (targetY - camY) * ease;
    camera.position.set(camX, camY, camZ);
    camera.lookAt(camX * 0.3, 1.5, camZ - 10);
  };

  let last = 0;
  let frame = 0;
  const tick = (t: number) => {
    frame = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    now = t;
    placeCamera(t, 1 - Math.exp(-dt * 3.5));
    for (let i = pending.length - 1; i >= 0; i--) {
      if (pending[i][0] > t) continue;
      const [, fn] = pending.splice(i, 1)[0];
      fn();
    }
    zones.forEach((z) => {
      // Only scenes in front of the camera are drawn or animated; one it's about to fly through drops out
      // rather than filling the screen.
      const ahead = camZ - z.z;
      z.group.visible = ahead > 6 && ahead < 52;
      if (z.group.visible) z.update?.(t, dt);
    });
    updateRacks(t);
    updateFloaters(dt);
    updateEvents();
    updateRings();
    renderer.render(scene, camera);
  };

  const renderStill = () => {
    placeCamera(0, 1);
    floaters.forEach((f) => (f.label.sprite.material.opacity = 0.8));
    renderer.render(scene, camera);
  };

  const start = () => {
    cancelAnimationFrame(frame);
    if (document.hidden) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    if (reducedMotion) renderStill();
  };
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const themeObserver = new MutationObserver(() => {
    applyTheme();
    if (reducedMotion) renderStill();
  });
  themeObserver.observe(document.documentElement, { attributeFilter: ["class"] });
  window.addEventListener("resize", onResize);

  if (reducedMotion) {
    renderStill();
  } else {
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", start);
    start();
  }

  return () => {
    cancelAnimationFrame(frame);
    themeObserver.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("scroll", readScroll);
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("visibilitychange", start);
    labels.forEach((label) => label.dispose());
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Line || object instanceof THREE.Points) {
        object.geometry.dispose();
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((m: THREE.Material) => m.dispose());
      }
    });
    renderer.dispose();
  };
};
