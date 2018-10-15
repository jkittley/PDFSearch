
export function upsertTag(tagname, docs) {
  return {
      type: "TAGS/UPSERT",
      tag: tagname,
      payload: {
        "name": tagname,
        "checked": false
      }
  }
}

export function checkTag(tagname) {
  return {
      type: "TAGS/CHECK",
      tag: tagname,
      payload: true
  }
}

export function uncheckTag(tagname) {
  return {
      type: "TAGS/CHECK",
      tag: tagname,
      payload: false
  }
}

export function removeTag(tagname) {
  return {
    type: "TAGS/REMOVE",
    payload: tagname,
  }
}

export function destroyAllTags() {
  return {
      type: "TAGS/DESTROY"
  }
}

