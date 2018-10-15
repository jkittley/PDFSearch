
export function upsertFile(absolute, payload) {
  return {
      type: "FILES/UPSERT",
      absolute: absolute,
      payload: {
        ...payload,
      }
  }
}

export function removeFile(absolute) {
  return {
    type: "FILES/REMOVE",
    payload: absolute,
}
}

export function tagFile(absolute, hashtags) {
  return {
      type: "FILES/TAG",
      absolute: absolute,
      payload: hashtags,
  }
}

export function destroyAllFiles() {
  return {
      type: "FILES/DESTROY"
  }
}

export function setLastScanned(absolute, date) {
  return {
    type: "FILES/LAST/SCANNED",
    absolute: absolute,
    payload: date
  }
}


