(function downloadString(text, fileType, fileName) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(new Blob([text], { type: fileType }));
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
  
    a.addEventListener("click", () => {
        setTimeout(function() { URL.revokeObjectURL(a.href); }, 0);
    })
    a.click();
    document.body.removeChild(a);
})(JSON.stringify(object.children[0].children.map(a => (function extractIndexedFaceSet(geometry) {
  const vertices = [];
  const indices = [];

  // Extract vertex positions
  const positionAttribute = geometry.getAttribute('position');
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = positionAttribute.getZ(i);
    vertices.push(x, y, z);
  }

  // Extract face indices
  const indexAttribute = geometry.getIndex();
  if (indexAttribute) {
    for (let i = 0; i < indexAttribute.count; i += 3) {
      const a = indexAttribute.getX(i);
      const b = indexAttribute.getX(i + 1);
      const c = indexAttribute.getX(i + 2);
      indices.push(a, b, c);
    }
  } else {
    for (let i = 0; i < positionAttribute.count; i += 3) {
      indices.push(i, i + 1, i + 2);
    }
  }

  // Create IndexedFaceSet
  const indexedFaceSet = {
    coord: vertices,
    coordIndex: indices
  };

  return indexedFaceSet;
})(a.geometry)).reduce((p, c) => ({coord: [...p.coord, ...c.coord], coordIndex: [...p.coordIndex, ...c.coordIndex]}), {coord: [], coordIndex: []})), "application/json", "export.json")