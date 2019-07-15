import multigrid from '../models/debruijn/multigrid.js'
import renderTile from './tile.js'

const LIGHT = '#6494F3'
const DARK = '#76BDFA'
const LINE_COLOR = '#fff'

const SCALE = 20
const LINE_WIDTH = 1 / (2 * SCALE)
const BOUND = 43

class Tessellation {
  constructor ({ element, model }) {
    this.element = element
    this.context = element.getContext('2d')
    this.model = model

    this.context.translate(element.width / 2, element.height / 2)
    this.context.scale(SCALE, SCALE)
    this.context.strokeStyle = LINE_COLOR
    this.context.lineWidth = LINE_WIDTH
    this.context.lineJoin = 'bevel'
  }

  setListeners () {
    this.element.addEventListener('mousedown', e => this.handleTranslationStart(e))
    this.element.addEventListener('mousemove', e => this.handleTranslation(e))
    this.element.addEventListener('mouseup', () => this.handleTranslationEnd())
    this.model.on('change', () => this.render())
  }

  handleTranslationStart ({ offsetX, offsetY }) {
    this._translation = { x: offsetX, y: offsetY }
  }

  handleTranslation ({ offsetX, offsetY }) {
    if (!this._translation) return false

    const dx = this._translation.x - offsetX
    const dy = this._translation.y - offsetY

    this.model.translateOffset([dx / SCALE, dy / SCALE])
    this._translation.x = offsetX
    this._translation.y = offsetY
  }

  handleTranslationEnd () {
    this._translation = null
  }

  get tiles () {
    return multigrid(this.model, {
      horizontal: this.element.width / BOUND + Math.SQRT1_2,
      vertical: this.element.height / BOUND + Math.SQRT1_2,
    })
  }

  /**
   * Alternative colorings:
   *   white/grey: light #FCFAF8; dark #B3B3B3; line color #666
   *   blues:      light #6494F3; dark #76BDFA; line color #fff
   *   red/yellow: light #FEBABA; dark #FFFEB9; line color #666
   *   pinks:      light #FECCCC; dark #FE99AA; line color #666 or #fff
   **/
  fill ({ isKite }) {
    return isKite ? LIGHT : DARK
  }

  clear () {
    this.context.save()
    this.context.setTransform(1, 0, 0, 1, 0, 0)
    this.context.clearRect(0, 0, this.element.width, this.element.height)
    this.context.restore()
  }

  render () {
    this.clear()
    this.tiles.forEach((tile, index) => {
      renderTile({ tile, context: this.context, fill: this.fill(tile) })
    })
  }
}

export default Tessellation
