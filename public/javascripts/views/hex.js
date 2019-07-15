import Point from '../models/hex/point.js'
import Layout from '../models/hex/layout.js'
import Orientation from '../models/hex/orientation.js'
import Vector from '../models/vector.js'

const renderHex = ({ element, context, hex, fill, stroke = '#666' }) => {
  const origin = Vector.from([element.width / 2, element.height / 2])
  const orientation = Orientation.pointy()
  const size = Vector.from([10, 10]) // 2, 57; 3, 38
  const layout = new Layout({ orientation, size, origin })
  const corners = Point.corners(layout, hex)
  const [head, ...tail] = corners

  context.fillStyle = fill

  context.beginPath()
  context.moveTo(head.x, head.y)
  tail.forEach(([x, y]) => context.lineTo(x, y))

  context.closePath()
  context.fill()
  context.stroke()
}

export default renderHex
