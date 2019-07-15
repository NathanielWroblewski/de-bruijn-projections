import ColorPool from '../models/color_pool.js'

// Colors sampled from this tessellation in Marrakesh:
// https://en.wikipedia.org/wiki/File:Ceramic_Tile_Tessellations_in_Marrakech.jpg
// likely all the saving and restoring taking so long
const renderTile = ({ context, tile, fill }) => {
  const [head, ...tail] = tile.vertices

  context.fillStyle = fill

  context.beginPath()
  context.moveTo(head.x, head.y)
  tail.forEach(([x, y]) => context.lineTo(x, y))

  context.closePath()
  context.fill()
  context.stroke()
}

export default renderTile
