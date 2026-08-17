/**
 * Analyze the AI-generated art in docs/: estimate the background color from
 * the corners and report the subject bounding box (relative to a 120×120
 * layout) via a downscaled luminance/distance mask. Dev tool only.
 */
import { execSync } from 'node:child_process'
import { readdirSync } from 'node:fs'

const W = 96
const H = 96

function sample(file) {
  const raw = execSync(
    `ffmpeg -v error -i '${file}' -vf scale=${W}:${H} -frames:v 1 -f rawvideo -pix_fmt rgb24 -`,
    { encoding: null, maxBuffer: 64 * 1024 * 1024 },
  )
  const pixels = []
  for (let i = 0; i < W * H; i += 1) {
    pixels.push([raw[i * 3], raw[i * 3 + 1], raw[i * 3 + 2]])
  }
  return pixels
}

function cornerBackground(pixels) {
  const corners = [0, W - 1, (H - 1) * W, (H - 1) * W + W - 1]
  const sums = [0, 0, 0]
  for (const at of corners) {
    const p = pixels[at]
    for (let c = 0; c < 3; c += 1) sums[c] += p[c]
  }
  return sums.map(v => Math.round(v / corners.length))
}

function distance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

function analyze(file) {
  const pixels = sample(file)
  const bg = cornerBackground(pixels)
  const THRESHOLD = 40
  let minX = W, minY = H, maxX = -1, maxY = -1, count = 0
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const p = pixels[y * W + x]
      // Edge pixels are more trustworthy for background; interior pixels
      // close to bg are treated as background too (holes).
      if (distance(p, bg) < THRESHOLD) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
      count += 1
    }
  }
  const scale = 120 / W
  return {
    file,
    bg: `rgb(${bg.join(',')})`,
    subjectPixels: `${Math.round((count / (W * H)) * 100)}%`,
    bbox96: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 },
    bbox120: {
      x: Math.round(minX * scale), y: Math.round(minY * scale),
      w: Math.round((maxX - minX + 1) * scale), h: Math.round((maxY - minY + 1) * scale),
    },
  }
}

for (const character of ['cat', 'dog']) {
  for (const file of readdirSync(`docs/${character}`).filter(f => f.endsWith('.jpg')).sort()) {
    console.log(JSON.stringify(analyze(`docs/${character}/${file}`)))
  }
}
