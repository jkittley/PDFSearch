
export function upsertDir(path) {
  return {
      type: "DIR/UPSERT",
      payload: path,
  }
}

export function removeDir(path) {
  return {
      type: "DIR/REMOVE",
      payload: path,
  }
}

export function setIncSubFolder(path, state) {
  return {
      type: "DIR/TOGGLE/SUBFOLDER",
      payload: path,
      state: state,
  }
}


