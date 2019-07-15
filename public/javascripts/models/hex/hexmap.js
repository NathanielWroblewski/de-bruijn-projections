import { RADIUS } from '../../constants/hex/index.js'

class HexMap {
  static hexagon (Hex) {
    const hexes = []

    for (let q = -RADIUS; q <= RADIUS; q++) {
      const r1 = Math.max(-RADIUS, -q - RADIUS)
      const r2 = Math.min(RADIUS, -q + RADIUS)

      for (let r = r1; r <= r2; r++) {
        hexes.push(Hex.from([q, r, -q - r]))
      }
    }

    return hexes
  }
}

export default HexMap
