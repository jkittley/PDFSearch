const fs = require('fs');
var path = require('path')

export function findDeletedFiles(dirs, files, onMissing) {
  Object.keys(files).forEach(absolute => {
    // If the file has been removed
    fs.exists(absolute, function(exists) { if (!exists) return onMissing(absolute); });
    // If the search root is no longer listed
    if (Object.keys(dirs).indexOf(files[absolute].searchRoot) == -1 ) return onMissing(absolute);
    // If the sub folder is no longer included
    if (files[absolute].path !== files[absolute].searchRoot && !dirs[files[absolute].searchRoot].incSubFolders) return onMissing(absolute);
  });
}

export function findOrphanTags(files, tags, onFindOrphan) {
  var allTags = [];
  for (var key in files) { allTags = allTags.concat(files[key].tags); }
  for (var tag in tags) { if (allTags.indexOf(tag) == -1) onFindOrphan(tag); }
}

export function findOutOfDateFiles(dirs, onDocfind) {
  return new Promise(function(resolve, reject) {
    var promises = [];
    for (var dir in dirs) promises.push(scanDir(dir, dir, onDocfind, dirs[dir].incSubFolders));
    Promise.all(promises).then( allResults => resolve(allResults) );
  });
}

function scanDir(dir, searchRoot, onDocfind, incSubDirs=false) {
  return new Promise(function(resolve, reject) {

    var foundDocs = [];
    var promises = [];

    fs.readdir(dir, (err, files) => {
      if (err) reject();

      for (var f in files) {

        var absolute = path.join(dir, files[f]);
        var stats = fs.statSync(absolute);
        var doc = {
          path: dir,
          file: files[f],
          absolute: absolute,
          searchRoot: searchRoot,
          modified: stats.mtime.toISOString()
        };

        if (path.extname(absolute) === ".pdf") {

          onDocfind(doc);
          foundDocs.push(doc);

        } else if (incSubDirs && stats.isDirectory()) {

          promises.push(scanDir(doc.absolute, searchRoot, onDocfind.bind(this), incSubDirs));

        }

      };

      if (promises.length === 0) resolve(foundDocs);
      Promise.all(promises).then( allResults => resolve(allResults.concat(foundDocs)) );

    });
  });
}
