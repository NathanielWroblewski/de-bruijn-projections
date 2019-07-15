import Axis from './axis.js'

const KITES = [9, 7, 4, 3, 0]

// NAW: live on Grid?
// Find the range of grid lines for each axis
const gridExtents = (cuttingPlane, bounds) => {
  const { horizontal, vertical } = bounds
  const corners = [
    cuttingPlane.unproject([-horizontal, -vertical]),
    cuttingPlane.unproject([-horizontal,  vertical]),
    cuttingPlane.unproject([ horizontal, -vertical]),
    cuttingPlane.unproject([ horizontal,  vertical]),
  ]

  const min = []
  const max = []

  for (let i = 0; i < cuttingPlane.dimensions; i++) {
    min.push(corners.reduce((memo, point) => Math.min(memo, Math.floor(point[i])), Infinity));
    max.push(corners.reduce((memo, point) => Math.max(memo, Math.ceil(point[i])), -Infinity));
  }

  return { min, max }
}

const getFaceTypes = dimensions => {
  const faceTypes = new Array(dimensions).fill(0).map(() => [])
  let typeIx = 0

  for (let i = 0, len = dimensions - 1; i < len; i++) {
    for (let j = i + 1; j < dimensions; j++) {
      faceTypes[i][j] = typeIx
      faceTypes[j][i] = typeIx
      typeIx++
    }
  }

  return faceTypes
}

const getIntersection = (i, j, ki, kj, cuttingPlane, axis, exteriorProducts) => {
  const u = ki + 0.5 - cuttingPlane.offset[i]
  const v = kj + 0.5 - cuttingPlane.offset[j]

  // NAW: Vector calculations?
  return [
    (u * axis[j][1] - v * axis[i][1]) / exteriorProducts[i][j],
    (v * axis[i][0] - u * axis[j][0]) / exteriorProducts[i][j],
  ]
}

// NAW: abs(vector[value] < Number.epsilon) function

// NAW: at intersection
const getFaceVertex = (i, j, ki, kj, cuttingPlane, axis, exteriorProducts) => {
  const intersection = getIntersection(i, j, ki, kj, cuttingPlane, axis, exteriorProducts)

  return cuttingPlane.unproject(intersection).map((x, ix) => {
    if (ix === i) return ki
    if (ix === j) return kj
    if (Math.abs(x - Math.floor(x) - 0.5) >= 1e-10) return Math.round(x)
    if ((
      Math.abs(exteriorProducts[i][ix]) < Number.EPSILON &&
      axis[ix].dot(axis[i]) > 0 &&
      ix < i
    ) || (
      Math.abs(exteriorProducts[ix][j]) < Number.EPSILON &&
      axis[ix].dot(axis[j]) > 0 &&
      ix < j
    ) || (
      exteriorProducts[i][j] * exteriorProducts[i][ix] > 0 &&
      exteriorProducts[i][j] * exteriorProducts[ix][j] > 0
    )) {
      return Math.ceil(x)
    }

    return Math.floor(x)
  })
}

const getFaces = ({ cuttingPlane, axis, exteriorProducts, bounds, grid, faceTypes }) => {
  const faces = []

  for (let i = 0, len = cuttingPlane.dimensions - 1; i < len; i++) {
    for (let j = i + 1; j < cuttingPlane.dimensions; j++) {
      if (Math.abs(exteriorProducts[i][j]) < Number.EPSILON) {
        // Axis i and axis j are parallel.
        // Faces with this orientation have zero area / are perpendicular
        // to the cut plane, so they do not produce tiles.
        continue;
      }

      for (let ki = grid.min[i]; ki < grid.max[i]; ki++) {
        for (let kj = grid.min[j]; kj < grid.max[j]; kj++) {
          const faceVertex = getFaceVertex(i, j, ki, kj, cuttingPlane, axis, exteriorProducts)
          const f1 = cuttingPlane.project(faceVertex)
          const xmid = f1[0] + (axis[i][0] + axis[j][0]) / 2
          const ymid = f1[1] + (axis[i][1] + axis[j][1]) / 2

          if (Math.abs(xmid) > bounds.horizontal || Math.abs(ymid) > bounds.vertical) {
            continue
          }

          const f2 = f1.add(axis[i])
          const f3 = f2.add(axis[j])
          const f4 = f1.add(axis[j])

          // NAW: Make this a face object
          faces.push({
            vertices: [f1, f2, f3, f4],
            a1: i,
            a2: j,
            type: faceTypes[i][j],
            isKite: KITES.includes(faceTypes[i][j])
          })
        }
      }
    }
  }

  return faces
}

// Generate the tiling using the multigrid method.
const multigrid = (cuttingPlane, bounds) => {
  const axis = cuttingPlane.transposeBasis(cuttingPlane.basis)

  return getFaces({
    cuttingPlane,
    axis,
    exteriorProducts: Axis.exteriorProducts(axis),
    bounds,
    grid: gridExtents(cuttingPlane, bounds),
    faceTypes: getFaceTypes(cuttingPlane.dimensions)
  })
}

export default multigrid
