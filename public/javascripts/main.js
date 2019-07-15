import Vector from './models/vector.js'
import HexMap from './models/hex/hexmap.js'
import CuttingPlane from './models/debruijn/cutting_plane.js'
import ColorPool from './models/color_pool.js'
import multigrid from './models/debruijn/multigrid.js'
import renderHex from './views/hex.js'
import renderTile from './views/tile.js'
import Tessellation from './views/tessellation.js'
import { WINDOW_HEIGHT } from './constants/hex/index.js'
import { DIMENSIONS, SCALE, LINE_WIDTH, LINE_COLOR } from './constants/debruijn/index.js'
import { WHITE, YELLOW, BLUE, GREEN, BLACK } from './constants/colors.js'

// Figure One: Regular hexagonal tessellation
async function renderFigureOne () {
  const element = document.querySelector('.figure.one canvas')
  const context = element.getContext('2d')
  const hexagons = HexMap.hexagon(Vector)
  const colors = new ColorPool({
    '#EDC9B7': 4, // white
    '#E99231': 2, // yellow
    '#643F7A': 2, // blue
    '#817A49': 1, // green
    '#4C0110': 4, // black
  })

  context.strokeStyle = LINE_COLOR
  context.lineWidth = 1

  hexagons.forEach((hex, index) => {
    if (Math.abs(hex[1]) > WINDOW_HEIGHT) return false

    const temporalOffset = hex.reduce((memo, value) => memo += Math.abs(value), 0) * 50
    setTimeout(() => renderHex({ element, context, hex, fill: colors.sample() }), temporalOffset)
  })
}

// Figure Two: Penrose tiling
async function renderFigureTwo () {
  const element = document.querySelector('.figure.two canvas')
  const context = element.getContext('2d')
  const cuttingPlane = new CuttingPlane(DIMENSIONS)
  const tiles = multigrid(cuttingPlane, {
    horizontal: element.width / 72 + Math.SQRT1_2,
    vertical: element.height / 72 + Math.SQRT1_2,
  })
  const colors = new ColorPool({
    [YELLOW]: 1,
    [BLUE]: 4,
    [GREEN]: 1,
    [BLACK]: 8,
  })

  context.translate(element.width / 2, element.height / 2)
  context.scale(SCALE, SCALE)
  context.strokeStyle = LINE_COLOR
  context.lineWidth = LINE_WIDTH
  context.lineJoin = 'bevel'

  tiles.forEach((tile, index) => {
    setTimeout(() => {
      renderTile({ context, tile, fill: tile.isKite ? WHITE : colors.sample() })
    }, tile.vertices[0].reduce((memo, pt) => memo + Math.abs(pt), 0) * 150)
  })
}

// Figure Three: Interactive explorer
async function renderFigureThree () {
  const element = document.querySelector('.figure.three canvas')
  const model = new CuttingPlane(DIMENSIONS)
  const view = new Tessellation({ element, model })

  view.render()
  view.setListeners()
}

renderFigureOne()
renderFigureTwo()
renderFigureThree()

