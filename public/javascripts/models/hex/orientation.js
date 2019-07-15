import { R3 } from '../../constants/hex/index.js'

class Orientation {
  constructor ({ f, b, angle }) {
    this.f = f
    this.b = b
    this.angle = angle
  }

  static pointy () {
    return new Orientation({
      f: [[R3, R3/2],
          [ 0,  3/2]],
      b: [[R3/3, -1/3],
          [   0,  2/3]],
      angle: 0.5
    })
  }

  static flat () {
    return new Orientation({
      f: [[ 3/2,  0],
          [R3/2, R3]],
      b: [[ 2/3,    0],
          [-1/3, R3/3]],
      angle: 0
    })
  }
}

export default Orientation
