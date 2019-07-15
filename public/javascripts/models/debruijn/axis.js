class Axis {
  static exteriorProducts (axis) {
    const products = []

    axis.forEach((element, index) => {
      products.push([])

      for (let j = 0; j <= index; j++) {
        if (index === j) {
          products[index][index] = 0
        } else {
          // NAW: Can this use Vector methods?
          products[index][j] = element[0] * axis[j][1] - axis[j][0] * element[1]

          products[j][index] = -products[index][j]
        }
      }
    })

    return products
  }
}

export default Axis
