class ColorPool {
  constructor (pool = {}) {
    this.colors = []

    Object.entries(pool).forEach(([color, weight]) => this.add(color, weight))
  }

  add (color, weight) {
    while (weight-- > 0) this.colors.push(color)
  }

  sample () {
    const randomIndex = Math.floor(Math.random() * this.colors.length)

    return this.colors[randomIndex]
  }
}

export default ColorPool
