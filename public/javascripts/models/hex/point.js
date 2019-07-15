import Vector from '../vector.js'
import { TAU, TOTAL_CORNERS } from '../../constants/hex/index.js'

class Point extends Vector {
  static axial (hex) {
    return hex.slice(0, 2)
  }

  static hexToPixel (layout, hex) {
    const { orientation, size, origin } = layout
    const [x, y] = orientation.f.map(row => this.axial(hex).dot(row))

    return Point.from([x, y]).multiply(size).add(origin)
  }

  static hexCornerOffset (layout, corner) {
    const { size, orientation } = layout
    const angle = TAU * (orientation.angle + corner) / TOTAL_CORNERS

    return Point.from(size.multiply([Math.cos(angle), Math.sin(angle)]))
  }

  static corners (layout, hex) {
    const center = this.hexToPixel(layout, hex)
    const collection = []

    for (let i = 0; i < TOTAL_CORNERS; i++) {
      const offset = this.hexCornerOffset(layout, i)

      collection.push(Point.from(center.add(offset)))
    }

    return collection
  }
}

export default Point
