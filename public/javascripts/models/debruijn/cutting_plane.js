import Vector from '../vector.js'

const SUN = 0.3
const STAR = 0.1

class CuttingPlane {
  constructor (dimensions) {
    this.dimensions = dimensions
    this.basis = this.resetBasis([new Vector, new Vector])
    this.offset = this.resetOffset()

    this._on = {
      change: []
    }
  }

  resetBasis (basis) {
    const f = Math.sqrt(2 / this.dimensions)
    const g = ((this.dimensions % 2) + 1) * Math.PI / this.dimensions

    for (let i = 0; i < this.dimensions; i++) {
      basis[0][i] = f * Math.cos(g * i)
      basis[1][i] = f * Math.sin(g * i)
    }

    return basis
  }

  transposeBasis (basis) {
    const transpose = []

    for (let i = 0; i < this.dimensions; i++) {
      transpose.push([basis[0][i], basis[1][i]])
    }

    return transpose
  }

  resetOffset () {
    return new Array(this.dimensions).fill(this.dimensions === 5 ? SUN : 0)
  }

  project (vector) {
    return vector.subtract(this.offset).project(this.basis)
  }

  // Take a point on the view plane to the corresponding point in space.
  unproject (point) {
    return Vector.combine(point[0], this.basis[0], point[1], this.basis[1]).add(
      this.offset
    )
  }

  // NAW: this should be on window obj
  // Move the view center to the given (x,y) coords in the view plane.
  translateOffset (coords) {
    this.offset = this.unproject(coords).map(coord => coord - Math.floor(coord))
    this.trigger('change')
  }

  on (event, callback) {
    this._on[event].push(callback)
  }

  trigger (event) {
    this._on[event].forEach(callback => callback())
  }
}

export default CuttingPlane
