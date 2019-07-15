class Vector extends Array {
  get x () {
    return this[0]
  }

  get y () {
    return this[1]
  }

  get z () {
    return this[2]
  }

  add (arg) {
    switch (typeof arg) {
      case 'number': return this.map(element => element + arg)
      case 'object': return this.map((element, index) => element + arg[index])
    }
  }

  subtract (arg) {
    switch (typeof arg) {
      case 'number': return this.map(element => element - arg)
      case 'object': return this.map((element, index) => element - arg[index])
    }
  }

  multiply (arg) {
    switch (typeof arg) {
      case 'number': return this.map((element, index) => element * arg)
      case 'object': return this.map((element, index) => element * arg[index])
    }
  }

  divide (arg) {
    switch (typeof arg) {
      case 'number': return this.map((element, index) => element / arg)
      case 'object': return this.map((element, index) => element / arg[index])
    }
  }

  dot (vector) {
    return this.reduce((memo, element, index) => memo + (element * vector[index]), 0)
  }

  magnitude () {
    return Math.sqrt(this.magnitudeSquared())
  }

  magnitudeSquared () {
    return this.dot(this)
  }

  is (vector) {
    return this.every((element, index) => element === vector[index])
  }

  normalize () {
    return this.divide(this.magnitude())
  }

  distance (vector) {
    return this.subtract(vector).magnitude()
  }

  project (bases) {
    return Vector.from(bases.map(basis => this.dot(basis)))
  }

  static combine (scalar1, vector1, scalar2, vector2) {
    return vector1.multiply(scalar1).add(vector2.multiply(scalar2))
  }
}

export default Vector
