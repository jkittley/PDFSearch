'use strict';
import { ipcRenderer } from 'electron';
import { scanPDFFile } from "../pdfscan";
import { findOutOfDateFiles } from '../dirscan';

window.onload = function () {

  console.log("background window started");
	ipcRenderer.on('bgmessage', function(event, message) {
    console.log("message received: ", message.type);
    switch (message.type) {
      case "scanFiles":
        scan(message);
        break;
      case "findOutOfDateFiles":
        findOutOfDate(message);
        break;
    }
  });

}

function findOutOfDate(message) {

  findOutOfDateFiles(message.dirs, function (doc) {
    ipcRenderer.send('fgmessage', {
      type: "fileIsOutOfDate",
      absolute: doc.absolute,
      doc: doc
    });

  }).then(function (allDocs) {
    ipcRenderer.send('fgmessage', {
      type: "outOfDateScanComplete",
      payload: allDocs
    })
  }).catch(function (allErrors) {
    console.log(allErrors);
    ipcRenderer.send('fgmessage', {
      type: "outOfDateScanFailed",
      payload: allErrors
    })
  });
}

function scan(message) {

  message.files.forEach( (absolute) => {
    console.log("Scanning: ", absolute);
    scanPDFFile(absolute)
      .then( (hashtags) => {
        ipcRenderer.send('fgmessage', {
          type: "scanComplete",
          absolute: absolute,
          hashtags: hashtags
        });
      })
      .catch( (errors) => {
        ipcRenderer.send('fgmessage', {
          type: "scanFailed",
          absolute: absolute,
          errors: errors
        });
      });
  });
}
