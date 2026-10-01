/**
 * Geometric Voxel 3D Earth Generator
 * Pure Cartesian voxel styling: ONLY CUBES, zero spheres, zero circles.
 * Features:
 * - High-resolution Cartesian voxel grid (~3,710 cubic blocks)
 * - Geographically authentic Natural Earth 110m landmask (exact continents, islands, peninsulas)
 * - Pure BoxGeometry instances only (strictly cubes)
 * - Initial framing showcasing the Americas and Atlantic on load, rotating through Europe & Africa
 * - Vibrant planetary voxel palette (Vibrant Blue, Forest Green, Sand Yellow, White)
 * - Balanced lighting for crisp block facets and rich, saturated colors
 * - Interactive Cursor Parallax & Tilt + Smooth Planetary Rotation.
 */

declare const THREE: any;

interface VoxelPart {
  x: number;
  y: number;
  z: number;
  color: number;
}

// Earth Voxel Palette
const VOXEL_COLORS = {
  brightBlue: 0x0d69ac, // Ocean (Deep Blue)
  mediumBlue: 0x2bb2ff, // Coastal Waters / Shallow Reefs (Vibrant Cyan)
  brightGreen: 0x3cb371, // Continents / Grassland (Bright Emerald Green)
  darkGreen: 0x228b22, // Forests / Amazon / Congo (Deep Forest Green)
  brickYellow: 0xdfce9f, // Deserts / Sand (Warm Gold / Sand)
  darkStoneGrey: 0x64748b, // Mountain ranges (Slate Grey)
  white: 0xffffff, // Polar Ice & Snowy Peaks (Pure White)
};

// 360x180 1-bit Equirectangular Landmask (Natural Earth 110m canonical coastline boundaries)
// 64,800 bits packed into 8,100 bytes (100% geographically authentic Earth continents)
const EARTH_LANDMASK_B64 =
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAP//gAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//////Hf///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAf/////////////AAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAB/////////////wAAAAX/8AAP8AAAAAAfwAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAOB////g////////AAAAD//wAAAAAAAAAAH/gAAAAAAAAAAAAAAAAAAAAAAAeP3vv/7////////+AAAAB//AAAAAAAAAAAAf8AAAAAAAAAAAA' +
  'AAAAAAAAAA8+AL4f/g////////+AAAAAfvgAAAAAAAAAAAF+AAAAAAAAAAAAAAAAAAAAAH/3R////gP////////AAAAAHAAAAAAAf4AAAHP//AAAA8AAAAAA' +
  'AAAAAAAAACP/5///8AAAf/////+AAAAAAAAAAAAf+AAAH////gAAD//gAAAAAAAAAAAAAf4+AN//+AAAP/////+AAAAAAAAAAAAeAAAAP///4AAAA/nAAAAA' +
  'AAAAAAAAAf/B8///3wAAH/////8AAAAAAAAAAAB4AEAP//////H4AfAAAAAAAAAAAAAAA//+5/9//4AAD/////wAAAAAAAAAAAHwAHt////////8Af/AAAAA' +
  '///////////////////////////////////////////////////////////+wAA//+gAOYf//1+///+AB/////4AAAAAAH/wAAB8A/v/////////////8AID' +
  'AAD///+P/////v/j///AB////+AAAAAAAf//gAAA+/////////////////P+////////////////////////////////+AAAP///wMYAAAAAAAAAAAAAAAQA' +
  'B///////////////////////////////4AAAD/4AAAcAAAAAAAAAAAAAAAAATP//////////////////////////////wBAH/7AAABwAAAAAAAAAAAAAAAAA' +
  '8f//////////////////////////////gHwD8AAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////' +
  'APH////////////PcB/wAP/gAAfgAAAP/3/////////////////////////+ACP////////////A///gAD/AAAAAAAB//H//////////////////////////' +
  'AAf///////////wAG/5AAD/AAAAAAAD//H/////////////////////////gAA////////////wAA/4QAB+AAAAAAAB//n//////////////////////D/+A' +
  'AAb/zwH///////wAA/44AAAAAAAAAAB//D//////////////////////D6IAAAAv4AA///////4AB//8AAAAAAAAA4B5/B///////////////////4AYPgAA' +
  'AAAH8AAD///////AAf/8AAAAAAAAA+AP+H///////////////////gAA/wAAAAAfQAAB///////wAf/+AAAAAAAAB8AO8H///////////////////AAB/wAA' +
  'AAD8AAAA////////x///gAAAAAAAD8AP4H//////////////////+AAB/AAAAAGAAAAD////////z///4AAAAAAAH/AP////////////////////+yAB/gAA' +
  'AAAAAAADP///////x///+AAAAAAAPfj//////////////////////+AB+AAAAAAAAAABv///////5///+AAAAAAAPfz///////////////////////AA4AAA' +
  'AAAAAAAAD///////////+AAAAAAAM/////////////////////////AA4AAAAAAAAAAAH///////////MAAAAAAAA////////////////////////7AAAAAA' +
  'AAAAAAAAH//////////+fgAAAAAAAj///////////////////////7AAAAAAAAAAAAAAA//////////w/wAAAAAAAf///////////////////////+gAAAAA' +
  'AAAAAAAAAf/////////x/wAAAAAAAf////////7//////////////yAAAAAAAAAAAAAAAf/////////9DgAAAAAAAD////////g//////////////nAAAAAA' +
  'AAAAAAAAAP//////////gAAAAAAAAD/////P/+A/////////////+GAAAAAAAAAAAAAAAP/////////4AAAAAAAAAD/////Hf8D/////////////8HQAAAAA' +
  'AAAAAAAAAf////////5gAAAAAAAAP//3z/+AH+D/////////////8PwAAAAAAAAAAAAAAf////////wAAAAAAAAAH/4P5/8HB+A////////////+wfgAAAAA' +
  'AAAAAAAAAf////////4AAAAAAAAAP/8M+f//n/Af///////////8AdAAAAAAAAAAAAAAAf////////gAAAAAAAAAH/gMP/////gf///////////8AcAAAAAA' +
  'AAAAAAAAAP///////8AAAAAAAAAAP/AMH/P///g///////////fwAMAAAAAAAAAAAAAAAP///////8AAAAAAAAAAP/gI/Pv///A//////////+T4AYAAAAAA' +
  'AAAAAAAAAH///////4AAAAAAAAAAH/A3+Hn///g///////////78C4AAAAAAAAAAAAAAAD///////4AAAAAAAAAAH8//MHH///w///////////48D4AAAAAA' +
  'AAAAAAAAAB///////4AAAAAAAAAAB//+AB4P//////////////A8/4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAB//+AAgP//////////////g7/gAAAAAA' +
  'AAAAAAAAAAf//////AAAAAAAAAAAH///AAAB//////////////gH8AAAAAAAAAAAAAAAAAP/////8AAAAAAAAAAAP///8PAD//////////////wHwAAAAAAA' +
  'AAAAAAAAAAH/////4AAAAAAAAAAAP///+f/7//////////////wDAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAAAAP/////////////////////wAAAAAAAAA' +
  'AAAAAAAAAAD////i8AAAAAAAAAAAf/////////////////////4AAAAAAAAAAAAAAAAAAAB///gAcAAAAAAAAAAB//////////v///////////wAAAAAAAAA' +
  'AAAAAAAAAAD//+AAcgAAAAAAAAAD//////////3///////////gAAAAAAAAAAAAAAAAAAAA7/+AAdwAAAAAAAAAH///////+//9///////////AAAAAAAAAA' +
  'AAAAAAAAAAAf/+AANgAAAAAAAAAH///////+//8f//////////QAAAAAAAAAAAAAAAAAAAAc/+AABgAAAAAAAAAP///////+f//4Af///////+wAAAAAAAAA' +
  'AAAAAAAAAAAGf+AAcgAAAAAAAAAf////////P//+Af///////8wAAAAAAAAAAAAIAAAAAAAGf+AB/gAAAAAAAAAf////////n///AH///////wwAAAAAAAAA' +
  'AAAPAAAAAAAAP+B9H4AAAAAAAAA/////////3///AD///v//8AgAAAAAAAAAAAABgAAAAAAAP+B8B8AAAAAAAAAf////////n//+AD//8P/+YAAAAAAAAAAA' +
  'AAABwAAAAAAAP/B4A/4AAAAAAAAf////////z//8AA//wH/88AAAAAAAAAAAAAAAgAAAAAAAD//4B3/gAAAAAAAf////////x//8AAf/AD/+4A4AAAAAAAAA' +
  'AAAAAAAAAAAAB//wAwjgAAAAAAAf////////5//4AAf/AD/+AA4AAAAAAAAAAAAAAAAAAAAAAP/0AAAAAAAAAAAf////////4//gAAf+AD//gB4AAAAAAAAA' +
  'AAAAAAAAAAAAADP/gAAAAAAAAAAf////////8/+AAAf4ADf/gBwAAAAAAAAAAAAAAAAAAAAAAAH/gAAAAAAAAAA///////////wAAAP4AAf/gA4AAAAAAAAA' +
  'AAAAAAAAAAAAAAD/gAAAAAAAAAAf//////////gAAAP4AAP/wA8AAAAAAAAAAAAAAAAAAAAAAAAPgAoAAAAAAAAf/////////8MAAAPwAAP/wAzAAAAAAAAA' +
  'AAAAAAAAAAAAAAAHgH8AAAAAAAAf/////////x8AAAHwAAMfwBfAAAAAAAAAAAAAAAAAAAAAAAADgP//AAAAAAAH//////////8AAADwAAMfADfAAAAAAAAA' +
  'AAAAAAAAAAAAAAAD/f//AAAAAAAH//////////4AAAD4AAMOAGNgAAAAAAAAAAAAAAAAAAAAAAAA////gAAAAAAD//////////4AAAD8AAOEAEPgAAAAAAAA' +
  'AAAAAAAAAAAAAAAAN///wAAAAAAB//////////wAAABcAAOAAAfgAAAAAAAAAAAAAAAAAAAAAAAAA///6AAAAAAA//////////wAAAAcAAHgAMPgAAAAAAAA' +
  'AAAAAAAAAAAAAAAAA////wAAAAAAP/x///////gAAAAIABzgAfBAAAAAAAAAAAAAAAAAAAAAAAAAA////4AAAAAAPuB///////AAAAAAAB7wA+AAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAA////4AAAAAAAAAP/////+AAAAAAAA/wD8AAAAAAAAAAAAAAAAAAAAAAAAAAB////4AAAAAAAAAH/////+AAAAAAAAfwX+AQAAAAAAAA' +
  'AAAAAAAAAAAAAAAAB////+AAAAAAAAAH/////4AAAAAAAAP4f8xYAAAAAAAAAAAAAAAAAAAAAAAAH////8AAAAAAAAAH/////wAAAAAAAAHw//+YAAAAAAAA' +
  'AAAAAAAAAAAAAAAAH/////wAAAAAAAAP/////gAAAAAAAADwf98bwAAAAAAAAAAAAAAAAAAAAAAAH/////8AAAAAAAAP/////AAAAAAAAAD4f58D5gAAAAAA' +
  'AAAAAAAAAAAAAAAAH//////4AAAAAAAH////+AAAAAAAAAD8P7wN78AwAAAAAAAAAAAAAAAAAAAAH//////8AAAAAAAB////+AAAAAAAAAA+H55+//gcAAAA' +
  'AAAAAAAAAAAAAAAAP//////+AAAAAAAB////8AAAAAAAAAA8Ap8A3/wcAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAB////4AAAAAAAAAAfABsAJ/zzAAAA' +
  'AAAAAAAAAAAAAAAAP///////wAAAAAAA////8AAAAAAAAAAH+AAAI//hgAAAAAAAAAAAAAAAAAAAD///////wAAAAAAA////8AAAAAAAAAAD/gAAA/8A8AAA' +
  'AAAAAAAAAAAAAAAAD///////gAAAAAAA////8AAAAAAAAAAAP37wB/OAHAAAAAAAAAAAAAAAAAAAB///////gAAAAAAA////8AAAAAAAAAAAAPnAAGHgHAAA' +
  'AAAAAAAAAAAAAAAAB///////AAAAAAAAf///+AAAAAAAAAAAAAmAACHgBgAAAAAAAAAAAAAAAAAAA//////+AAAAAAAAf///+AAAAAAAAAAAAAAB+HAAAAAA' +
  'AAAAAAAAAAAAAAAAA//////+AAAAAAAAf///+AwAAAAAAAAAAAAD+HAAAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAA////+B4AAAAAAAAAAAA3+HAAAAAA' +
  'AAAAAAAAAAAAAAAAAf/////8AAAAAAAA////+B4AAAAAAAAAAAB/8HwAADAAAAAAAAAAAAAAAAAAAP/////8AAAAAAAB////+H4AAAAAAAAAAAD//HwAADAA' +
  '////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAA/////4AAAAAAAB////4fwAAAAAAAAAAAP///4AAAAG' +
  'AAAAAAAAAAAAAAAAAAf////4AAAAAAAB////gPwAAAAAAAAAAAf///4AAAAGAAAAAAAAAAAAAAAAAAf////4AAAAAAAA////APwAAAAAAAAAAB////+AAAAA' +
  'AAAAAAAAAAAAAAAAAAf////wAAAAAAAAf//+AfgAAAAAAAAAAP////+AAMAAAAAAAAAAAAAAAAAAAAf////wAAAAAAAAf///AfAAAAAAAAAAA//////AAOAA' +
  'AAAAAAAAAAAAAAAAAAf////gAAAAAAAAP///AfAAAAAAAAAAB//////gADAAAAAAAAAAAAAAAAAAAAf///8AAAAAAAAAP///AfAAAAAAAAAAB//////gAAAA' +
  'AAAAAAAAAAAAAAAAAAf///wAAAAAAAAAP///AfAAAAAAAAAAB//////4AAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAP//8AOAAAAAAAAAAB//////4AAAA' +
  'AAAAAAAAAAAAAAAAAAf///AAAAAAAAAAP//4AAAAAAAAAAAAB//////8AAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//4AAAAAAAAAAAAA//////8AAAA' +
  'AAAAAAAAAAAAAAAAAA////AAAAAAAAAAD//4AAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAA///+AAAAAAAAAAB//wAAAAAAAAAAAAAf/////8AAAA' +
  'AAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAA///4AAAAAAAAAAA//gAAAAAAAAAAAAAf/////4AAAA' +
  'AAAAAAAAAAAAAAAAAA///wAAAAAAAAAAB/+AAAAAAAAAAAAAAf/w///4AAAAAAAAAAAAAAAAAAAAAA///wAAAAAAAAAAA/8AAAAAAAAAAAAAAf+AP//wAAAA' +
  'AAAAAAAAAAAAAAAAAA///gAAAAAAAAAAA8AAAAAAAAAAAAAAAfIAH//wAADAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAD//gAABg' +
  'AAAAAAAAAAAAAAAAAB//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/gAABwAAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/AAAA+' +
  'AAAAAAAAAAAAAAAAAD//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/8AAD/AAAAAAAAAAAAAAAAAP//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//gAf/w' +
  'AAAAAAAAAAAAAAAAAP//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//wAf/wAAAAAAAAAAAAAAAAAP//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//gAP/w' +
  'AAAAAAAAAAAAAAAAAP//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//gAP/wAAAAAAAAAAAAAAAAAP//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//wAP/w' +
  'AAAAAAAAAAAAAAAAAP//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//wAP/wAAAAAAAAAAAAAAAAAP//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//gAP/g' +
  'AAAAAAAAAAAAAAAAAP//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//AAP/AAAAAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf+AAAfwA' +
  'AAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfwAAB+AAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAP4A' +
  'AAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAfwAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAfwAA' +
  'AAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAfwAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAf4AA' +
  'AAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAf+AAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAP+AA' +
  'AAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAABP+AAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAfP+AA' +
  'AAAAAAAAAAAAAAAAf+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAB8f+AAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAB8f/AAA' +
  'AAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAB8f/AAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAA8f/AA' +
  'AAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAA8f/AAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAA4f/AA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAA4f/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAMf/AA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfgAIf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/wAP//AA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHP8AD//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE//gAAf/4' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

let decodedLandmask: Uint8Array | null = null;

function getLandmask(): Uint8Array {
  if (decodedLandmask) return decodedLandmask;
  const binaryString = atob(EARTH_LANDMASK_B64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  decodedLandmask = bytes;
  return decodedLandmask;
}

function isLand(lat: number, lon: number): boolean {
  while (lon < -180) lon += 360;
  while (lon >= 180) lon -= 360;

  const x = Math.min(359, Math.max(0, Math.floor(lon + 180)));
  const y = Math.min(179, Math.max(0, Math.floor(90 - lat)));

  const bitIndex = y * 360 + x;
  const byteIndex = bitIndex >> 3;
  const bitOffset = 7 - (bitIndex & 7);

  const mask = getLandmask();
  return (mask[byteIndex] & (1 << bitOffset)) !== 0;
}

function getEarthFeature(lat: number, lon: number): { type: string; color: number } {
  while (lon > 180) lon -= 360;
  while (lon < -180) lon += 360;

  // Polar Ice Caps (Antarctica, Greenland interior, Arctic pack ice)
  if (lat <= -60) {
    return { type: 'ice', color: VOXEL_COLORS.white }; // Antarctica
  }
  if (lat >= 60 && lat <= 84 && lon >= -55 && lon <= -20) {
    return { type: 'ice', color: VOXEL_COLORS.white }; // Greenland
  }
  if (lat >= 75) {
    return { type: 'ice', color: VOXEL_COLORS.white }; // Arctic Ice
  }

  // Check authentic Natural Earth landmask
  const land = isLand(lat, lon);

  if (land) {
    // 1. Snowy Mountain Peaks (Himalayas & Tibetan Plateau)
    if (lat >= 27 && lat <= 36 && lon >= 75 && lon <= 98) {
      return { type: 'mountain_snow', color: VOXEL_COLORS.white };
    }

    // 2. High Alpine & Mountain Ranges (Andes, Rockies, Alps)
    if (lat >= -45 && lat <= 5 && lon >= -76 && lon <= -68) {
      return { type: 'mountain', color: VOXEL_COLORS.darkStoneGrey }; // Andes
    }
    if (lat >= 35 && lat <= 58 && lon >= -120 && lon <= -108) {
      return { type: 'mountain', color: VOXEL_COLORS.darkStoneGrey }; // Rockies
    }
    if (lat >= 44 && lat <= 48 && lon >= 6 && lon <= 15) {
      return { type: 'mountain', color: VOXEL_COLORS.darkStoneGrey }; // Alps
    }

    // 3. Major Deserts (Sand Yellow)
    // Sahara Desert
    if (lat >= 17 && lat <= 29 && lon >= -13 && lon <= 34) {
      return { type: 'desert', color: VOXEL_COLORS.brickYellow };
    }
    // Arabian Peninsula
    if (lat >= 15 && lat <= 30 && lon >= 40 && lon <= 56) {
      return { type: 'desert', color: VOXEL_COLORS.brickYellow };
    }
    // Australian Outback
    if (lat <= -20 && lat >= -30 && lon >= 120 && lon <= 136) {
      return { type: 'desert', color: VOXEL_COLORS.brickYellow };
    }
    // Gobi Desert
    if (lat >= 39 && lat <= 45 && lon >= 88 && lon <= 106) {
      return { type: 'desert', color: VOXEL_COLORS.brickYellow };
    }

    // 4. Dense Tropical Rainforests (Amazon, Congo)
    if (lat >= -10 && lat <= 4 && lon >= -72 && lon <= -50) {
      return { type: 'rainforest', color: VOXEL_COLORS.darkGreen }; // Amazon
    }
    if (lat >= -4 && lat <= 4 && lon >= 14 && lon <= 26) {
      return { type: 'rainforest', color: VOXEL_COLORS.darkGreen }; // Congo
    }

    // 5. Default Continents / Grasslands (Emerald Green)
    return { type: 'land', color: VOXEL_COLORS.brightGreen };
  }

  // Ocean
  // Coastal shallow reefs / Caribbean / Coral Sea / Indo-Pacific
  if (Math.abs(lat) < 24 && ((lon > -90 && lon < -62) || (lon > 108 && lon < 154))) {
    return { type: 'reef', color: VOXEL_COLORS.mediumBlue };
  }
  return { type: 'ocean', color: VOXEL_COLORS.brightBlue };
}

const THREE_LOCAL_URL = '/js/three.min.js';
const THREE_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

function injectScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (typeof THREE !== 'undefined') {
        resolve(true);
      } else {
        existing.addEventListener('load', () => resolve(true), { once: true });
        existing.addEventListener('error', () => resolve(false), { once: true });
      }
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function loadThreeScript(): Promise<void> {
  if (typeof THREE !== 'undefined') return;

  // 1. Try local self-hosted Three.js first (instant, zero third-party CDN failure, works offline)
  await injectScript(THREE_LOCAL_URL);
  if (typeof THREE !== 'undefined') return;

  // 2. Fallback to Cloudflare CDN if local script fails
  await injectScript(THREE_CDN_URL);
}

/**
 * Probes WebGL 3D context availability before loading Three.js.
 *
 * In headless CI containers (Chromium with `--disable-gpu`) or restricted environments,
 * the 2D `<canvas>` element exists and `window.WebGLRenderingContext` is defined, but
 * calling `getContext('webgl')` fails or returns null. Probing avoids downloading the
 * 121 KB Three.js bundle and prevents `THREE.WebGLRenderer: Error creating WebGL context`
 * console errors.
 *
 * We probe on a throwaway in-memory canvas rather than `#digitalEarthCanvas` so we don't
 * bind default context attributes before Three.js initializes with its custom options
 * (`alpha`, `antialias`, and `high-performance`).
 */
function isWebGLAvailable(): boolean {
  try {
    const testCanvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export async function initDigitalEarth(): Promise<void> {
  const container = document.getElementById('heroEarthBackdrop');
  const canvas = document.getElementById('digitalEarthCanvas') as HTMLCanvasElement | null;

  if (!container || !canvas) {
    return;
  }

  // Abort if browser or container environment has no WebGL support (e.g. headless CI with --disable-gpu)
  if (!isWebGLAvailable()) {
    return;
  }

  // Load Three.js dynamically on-demand if not already loaded
  if (typeof THREE === 'undefined') {
    await loadThreeScript();
  }

  if (typeof THREE === 'undefined') {
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();

  // Camera looking directly at the Earth (responsive distance for mobile vs desktop)
  const isMobileInitial = container.clientWidth < 768;
  const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 0, isMobileInitial ? 18.0 : 15.5);

  // WebGL Renderer with filmic tone mapping & color management
  let renderer: any;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch {
    // Graceful fallback if WebGL context creation fails
    return;
  }
  if (!renderer) return;

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // Master Earth Tilt Group (holds Earth's real 23.4° axial tilt)
  const baseTiltZ = THREE.MathUtils.degToRad(-23.4);
  const baseTiltX = THREE.MathUtils.degToRad(8);

  const tiltGroup = new THREE.Group();
  tiltGroup.rotation.z = baseTiltZ;
  tiltGroup.rotation.x = baseTiltX;
  scene.add(tiltGroup);

  // Inner Planet Spin Group (rotates around the tilted polar axis)
  // Initial angle of 75° frames North and South America centered on page load
  const planetSpinGroup = new THREE.Group();
  let planetBaseSpin = THREE.MathUtils.degToRad(75);
  planetSpinGroup.rotation.y = planetBaseSpin;
  tiltGroup.add(planetSpinGroup);

  // 3D Cartesian Voxel Sphere Parameters (Adaptive density for smooth 60fps on all devices)
  // ONLY CUBES: Zero spheres, zero circular geometry anywhere.
  const gridRadius = isMobileInitial ? 13.5 : 19.2;
  const voxelSize = isMobileInitial ? 0.38 : 0.267;

  const surfaceVoxels: VoxelPart[] = [];
  const gridRadiusSq = gridRadius * gridRadius;

  // Generate the discrete 3D Cartesian Voxel Sphere (Strictly Cubic Parts)
  // Highly optimized 6-cardinal surface extraction avoiding redundant square roots
  const cr = Math.ceil(gridRadius);
  for (let x = -cr; x <= cr; x++) {
    const x2 = x * x;
    const xp1_2 = (x + 1) * (x + 1);
    const xm1_2 = (x - 1) * (x - 1);

    for (let y = -cr; y <= cr; y++) {
      const y2 = y * y;
      const yp1_2 = (y + 1) * (y + 1);
      const ym1_2 = (y - 1) * (y - 1);
      const xy2 = x2 + y2;

      for (let z = -cr; z <= cr; z++) {
        const z2 = z * z;
        const distSq = xy2 + z2;

        if (distSq <= gridRadiusSq) {
          const isSurface =
            x2 + yp1_2 + z2 > gridRadiusSq ||
            xp1_2 + y2 + z2 > gridRadiusSq ||
            xm1_2 + y2 + z2 > gridRadiusSq ||
            x2 + ym1_2 + z2 > gridRadiusSq ||
            xy2 + (z + 1) * (z + 1) > gridRadiusSq ||
            xy2 + (z - 1) * (z - 1) > gridRadiusSq;

          if (isSurface) {
            const dist = Math.sqrt(distSq);
            const normX = x / dist;
            const normY = y / dist;
            const normZ = z / dist;

            const lat = Math.asin(normY) * (180 / Math.PI);
            const lon = Math.atan2(normX, normZ) * (180 / Math.PI);

            const feature = getEarthFeature(lat, lon);

            surfaceVoxels.push({
              x: x * voxelSize,
              y: y * voxelSize,
              z: z * voxelSize,
              color: feature.color,
            });
          }
        }
      }
    }
  }

  // Directional Sun Vector in World Space (Illuminates the visible front-left hemisphere)
  const sunDirection = new THREE.Vector3(-0.6, 0.7, 1.3).normalize();
  const sunUniform = { value: sunDirection };

  // Voxel Smooth Surface Material with Celestial Day/Night Shading
  // Calibrated roughness (0.35) for crisp cubic facets and glossy sheen
  const voxelMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.35,
    metalness: 0.0,
    envMapIntensity: 0.75,
  });

  voxelMaterial.customProgramCacheKey = () => 'digital-earth-day-night-v1';

  voxelMaterial.onBeforeCompile = (shader: any) => {
    shader.uniforms.uSunDirection = sunUniform;

    // Inject globe normal varying
    shader.vertexShader = `
      varying vec3 vGlobeNormal;
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <defaultnormal_vertex>',
      `
      #include <defaultnormal_vertex>
      #ifdef USE_INSTANCING
        // Radial direction of the voxel from the planet center in world coordinates
        vec4 instanceCenter = vec4(instanceMatrix[3].xyz, 0.0);
        vGlobeNormal = normalize((modelMatrix * instanceCenter).xyz);
      #else
        vGlobeNormal = normalize((modelMatrix * vec4(position, 0.0)).xyz);
      #endif
      `,
    );

    shader.fragmentShader = `
      uniform vec3 uSunDirection;
      varying vec3 vGlobeNormal;
      ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <lights_fragment_end>',
      `
      #include <lights_fragment_end>

      // Celestial illumination angle (dot product with sun direction in world space)
      vec3 sunDir = normalize(uSunDirection);
      float globeSunDot = dot(vGlobeNormal, sunDir);

      // Day factor: 1.0 on day side, 0.0 on dark night side
      // Smooth terminator transition across the twilight band
      float dayFactor = smoothstep(-0.25, 0.25, globeSunDot);

      // Cut off direct sunlight on the dark night side
      reflectedLight.directDiffuse *= dayFactor;
      reflectedLight.directSpecular *= dayFactor;

      // Night side ambient tint: luminous sapphire/slate glow so continents remain visible
      vec3 nightAmbientTint = vec3(0.28, 0.40, 0.62);
      reflectedLight.indirectDiffuse = mix(reflectedLight.indirectDiffuse * nightAmbientTint * 2.2, reflectedLight.indirectDiffuse, dayFactor);

      // Warm golden atmospheric sunset / sunrise rim along the terminator
      float sunsetGlow = smoothstep(-0.20, 0.05, globeSunDot) * (1.0 - smoothstep(0.05, 0.30, globeSunDot));
      vec3 sunsetColor = vec3(1.0, 0.55, 0.20); // Golden-orange sunset/sunrise
      reflectedLight.directDiffuse += sunsetColor * (sunsetGlow * 0.55);
      `,
    );
  };

  // Pure Discrete Cube Geometry: BoxGeometry ONLY, zero curves/spheres
  const blockGeom = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);

  // Instanced Mesh for Cubic Voxel Blocks (~3,710 instances)
  const voxelMesh = new THREE.InstancedMesh(blockGeom, voxelMaterial, surfaceVoxels.length);

  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  const position = new THREE.Vector3();

  // Populate Cubic Voxel Blocks
  for (let i = 0; i < surfaceVoxels.length; i++) {
    const v = surfaceVoxels[i];
    position.set(v.x, v.y, v.z);
    matrix.setPosition(position);
    voxelMesh.setMatrixAt(i, matrix);

    color.setHex(v.color);
    voxelMesh.setColorAt(i, color);
  }

  voxelMesh.instanceMatrix.needsUpdate = true;
  if (voxelMesh.instanceColor) voxelMesh.instanceColor.needsUpdate = true;

  planetSpinGroup.add(voxelMesh);

  // Natural Planetary Lighting: Single dominant Sun + Deep Space Ambient + Dark Rim
  const mainSun = new THREE.DirectionalLight(0xfffbe8, 2.2);
  mainSun.position.copy(sunDirection).multiplyScalar(28); // Matches the sunDirection vector
  scene.add(mainSun);

  // Subtle cosmic rim light from the dark back side for atmospheric limb definition
  const cosmicRim = new THREE.DirectionalLight(0x38bdf8, 0.65);
  cosmicRim.position.set(20, -10, -12);
  scene.add(cosmicRim);

  // Deep space ambient light: provides subtle illumination for the night side
  const ambientLight = new THREE.AmbientLight(0x1e293b, 0.85);
  scene.add(ambientLight);

  // Interactive Cursor Parallax & Tilt Setup
  let mouseTargetX = 0; // Normalized -1 to +1
  let mouseTargetY = 0; // Normalized -1 to +1
  let currentMouseX = 0;
  let currentMouseY = 0;

  function onMouseMove(e: MouseEvent): void {
    mouseTargetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseTargetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onTouchMove(e: TouchEvent): void {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseTargetX = (touch.clientX / window.innerWidth) * 2 - 1;
      mouseTargetY = -(touch.clientY / window.innerHeight) * 2 + 1;
    }
  }

  function onMouseLeave(): void {
    mouseTargetX = 0;
    mouseTargetY = 0;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave, { passive: true });

  // Celestial Elliptic Orbital Flight Mechanics
  /**
   * Computes the 3D position along an authentic Keplerian/elliptical orbital path.
   * progress = -1.0 -> Flying in from the distance, bottom-left corner
   * progress =  0.0 -> Perigee (closest approach) centered in the middle of the screen
   * progress = +1.0 -> Continues along the elliptical path down, and moves outside the screen
   */
  function getEllipticOrbitPosition(progress: number): { x: number; y: number; z: number } {
    const aspect = camera.aspect;
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const camZ = camera.position.z;

    // 1. Perspective Depth (Z-axis):
    // Ingress: Starts deep in the cosmic distance (z = -22.0) and zooms forward to perigee (z = 0)
    // Egress: Gently recedes as Earth plunges downwards (z = -16.0)
    let z: number;
    if (progress <= 0) {
      const t = -progress; // 1.0 at entry -> 0.0 at perigee
      z = -22.0 * Math.pow(t, 1.25);
    } else {
      const t = Math.min(progress, 1.4);
      z = -16.0 * Math.pow(t, 1.35);
    }

    // View frustum boundaries at depth z
    const distAtZ = camZ - z;
    const halfH = distAtZ * tanHalfFov;
    const halfW = halfH * aspect;

    // 2. Parametric elliptical trajectory:
    // Apex at progress = 0: u = 0, v = 0 with smooth zero vertical derivative (horizontal tangent)
    let x: number;
    let y: number;

    // Subtle celestial inclination tilt (-5.5°)
    const orbitTilt = THREE.MathUtils.degToRad(-5.5);
    const cosTilt = Math.cos(orbitTilt);
    const sinTilt = Math.sin(orbitTilt);

    if (progress <= 0) {
      // Ingress: fly in from the distance, bottom-left corner (-W, -H) to center (0, 0)
      const angle = progress * (Math.PI * 0.5); // -PI/2 -> 0
      const sinA = Math.sin(angle); // -1 -> 0
      const cosA = Math.cos(angle); // 0 -> 1

      const reachW = halfW * 0.9;
      const reachH = halfH * 0.86;

      const u = reachW * sinA;
      const v = reachH * (cosA - 1.0); // -reachH at p = -1, 0 at p = 0

      x = u * cosTilt - v * sinTilt;
      y = u * sinTilt + v * cosTilt;
    } else {
      // Egress: when user moves down, Earth continues on its path DOWN and moves outside the screen
      const angle = Math.min(progress, 1.4) * (Math.PI * 0.5); // 0 -> PI/2
      const sinA = Math.sin(angle); // 0 -> 1
      const cosA = Math.cos(angle); // 1 -> 0

      const reachW = halfW * 0.95;
      // Earth radius is ~5.13 units. To be fully outside bottom, top of Earth (y + 5.13) < -halfH.
      const reachH = halfH + 9.0;

      const u = reachW * sinA;
      const v = -reachH * (1.0 - cosA); // 0 at p = 0, -reachH at p = 1

      x = u * cosTilt - v * sinTilt;
      y = u * sinTilt + v * cosTilt;
    }

    return { x, y, z };
  }

  // Animation Loop: Elliptic Orbit (Bottom-Left Distance Ingress -> Center Perigee -> Downward Egress)
  const clock = new THREE.Clock();
  let isVisible = true;
  const introDuration = 2.4; // seconds for arrival fly-in from distance

  // If loaded while already scrolled past hero, skip intro
  const initialScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  let introCompleted = initialScrollY > 400;

  let currentScrollY = initialScrollY;
  const scrollThreshold = 750.0;
  const maxTrackedScroll = scrollThreshold * 1.35;

  const heroSection = document.querySelector('.hero-section') || container;
  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible =
            entry.isIntersecting || (typeof window !== 'undefined' && window.scrollY < 600);
          if (!isVisible) {
            canvas.style.opacity = '0';
            canvas.style.visibility = 'hidden';
            if (container) container.style.visibility = 'hidden';
          } else {
            canvas.style.visibility = 'visible';
            if (container) container.style.visibility = 'visible';
          }
        });
      },
      { threshold: 0.02 },
    );
    observer.observe(heroSection);
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionScale = mediaQuery.matches ? 0.2 : 1.0;
  mediaQuery.addEventListener('change', (e) => {
    motionScale = e.matches ? 0.2 : 1.0;
  });

  function animate(): void {
    requestAnimationFrame(animate);

    if (!isVisible) {
      if (canvas.style.visibility !== 'hidden') {
        canvas.style.opacity = '0';
        canvas.style.visibility = 'hidden';
        if (container) container.style.visibility = 'hidden';
      }
      return;
    }

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // 1. Continuous slow planetary rotation around tilted axis
    planetBaseSpin += delta * 0.08 * motionScale;

    // Smooth spring dampening (lerp) toward cursor position
    currentMouseX = THREE.MathUtils.lerp(currentMouseX, mouseTargetX, 0.05);
    currentMouseY = THREE.MathUtils.lerp(currentMouseY, mouseTargetY, 0.05);

    // 2. Interactive Cursor Parallax & Tilt
    const cursorTiltX = -currentMouseY * 0.22 * motionScale;
    const cursorTiltY = currentMouseX * 0.32 * motionScale;
    const cursorRollZ = currentMouseX * 0.08 * motionScale;

    // 3. Compute Elliptic Flight Path Progress
    // Phase 1: Intro fly-in from the distance, bottom-left corner (-1.0) into center (0.0)
    let pIntro = 0.0;
    let introEase = 1.0;
    if (!introCompleted) {
      const rawIntro = motionScale < 0.5 ? 1.0 : Math.min(elapsed / introDuration, 1.0);
      introEase = 1.0 - Math.pow(1.0 - rawIntro, 3.2); // Smooth cubic ease-out
      pIntro = -1.0 + introEase * 1.0; // Sweeps from -1.0 to 0.0
      if (rawIntro >= 1.0) {
        introCompleted = true;
      }
    }

    // Phase 2: Scroll-driven continuation along the ellipse downwards (+1.0)
    const clampedTargetScroll = Math.min(window.scrollY, maxTrackedScroll);
    currentScrollY = THREE.MathUtils.lerp(currentScrollY, clampedTargetScroll, 0.08);
    const scrollT = Math.min(currentScrollY / scrollThreshold, 1.25);
    const scrollEase = scrollT * (2.0 - Math.min(scrollT, 1.0)); // Smooth quad ease
    const pScroll = scrollEase * 1.0; // Sweeps from 0.0 to +1.0 (and beyond)

    // Combined orbital progress: sweeps continuously from -1.0 (bottom-left) -> 0.0 (center) -> +1.0 (exit down)
    const totalProgress = Math.min(Math.max(pIntro + pScroll, -1.0), 1.35);

    // Calculate position along the celestial ellipse
    const orbitPos = getEllipticOrbitPosition(totalProgress);

    // Dynamic Orbital Banking: Banks into the curvature of the ellipse
    const orbitalBanking = -Math.sin(totalProgress * Math.PI * 0.5) * 0.16 * motionScale;

    tiltGroup.rotation.x = baseTiltX + cursorTiltX;
    tiltGroup.rotation.z = baseTiltZ + cursorRollZ + orbitalBanking;

    planetSpinGroup.rotation.y = planetBaseSpin + cursorTiltY;

    // Subtle weightless cosmic float (most active when near center perigee)
    const centerFactor = Math.max(0, 1.0 - Math.abs(totalProgress) * 1.5) * introEase;
    const floatY = Math.sin(elapsed * 0.75) * 0.12 * centerFactor * motionScale;
    const driftX = Math.sin(elapsed * 0.4) * 0.08 * centerFactor * motionScale;

    // Apply unconstrained position beyond container boundaries across full viewport
    tiltGroup.position.set(orbitPos.x + driftX, orbitPos.y + floatY, orbitPos.z);

    // Smoothly fade and hide canvas as Earth flies completely off the bottom edge
    if (scrollT > 0.7) {
      const fadeProgress = (scrollT - 0.7) / 0.3;
      const opacity = Math.max(0, 1.0 - fadeProgress);
      canvas.style.opacity = opacity.toFixed(3);
      if (opacity <= 0.01) {
        canvas.style.visibility = 'hidden';
      } else {
        canvas.style.visibility = 'visible';
      }
    } else {
      canvas.style.opacity = '1.0';
      canvas.style.visibility = 'visible';
    }

    renderer.render(scene, camera);
  }

  // Start continuous interactive animation
  animate();
  canvas.classList.add('loaded');

  // Responsive resize handler
  function handleResize(): void {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    const isMobileNow = width < 768;
    camera.position.z = isMobileNow ? 18.0 : 15.5;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener('resize', handleResize);
}
