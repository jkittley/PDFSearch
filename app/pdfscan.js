var hummus = require('hummus');
var path = require('path')

export function scanPDFFile(absolute) {
  return new Promise(function(resolve, reject) {
    if (path.extname(absolute) !== ".pdf") {
      reject("Not a PDF");
    } else {
      try {
        let scanner = new PDFScanner();
        scanner.scan(absolute, (hashtags) => {
          resolve(hashtags)
        });
      } catch (err) {
        reject(err);
      }
    }
  });
}


export class PDFScanner {

  constructor() {
    this.iterateObjectTypes = this.iterateObjectTypes.bind(this);
  }

  scan(filename, onComplete) {
    this.mIteratedObjectIDs = {};
    this.detectedHashtags = [];
    const pdfReader = hummus.createReader(filename);
    const catalogue = pdfReader.queryDictionaryObject(pdfReader.getTrailer(),'Root');
    this.iterateObjectTypes(catalogue, pdfReader);
    onComplete(Array.from(new Set(this.detectedHashtags)));
  }

  iterateObjectTypes(inObject, inReader) {
    if (inObject.getType() == hummus.ePDFObjectIndirectObjectReference) {
      var objectID = inObject.toPDFIndirectObjectReference().getObjectID();
      if (!this.mIteratedObjectIDs.hasOwnProperty(objectID)) {
        this.mIteratedObjectIDs[objectID] = true;
        this.iterateObjectTypes(inReader.parseNewObject(objectID),inReader);
      }

    } else if (inObject.getType() == hummus.ePDFObjectArray) {
      inObject.toPDFArray().toJSArray().forEach(function(element){
        this.iterateObjectTypes(element,inReader);
      }.bind(this));

    } else if (inObject.getType() == hummus.ePDFObjectDictionary) {
      var aDictionary = inObject.toPDFDictionary().toJSObject();
      Object.getOwnPropertyNames(aDictionary).forEach(function(element)	{
        this.iterateObjectTypes(aDictionary[element], inReader);
      }.bind(this));

    } else if (inObject.getType() == hummus.ePDFObjectStream) {
      this.iterateObjectTypes(inObject.toPDFStream().getDictionary(),inReader);

    } else {
      if (hummus.getTypeLabel(inObject.getType()) === "LiteralString" || hummus.getTypeLabel(inObject.getType()) === "HexString") {
        this.hashDetect(inObject.value);
      }
    }
  }

  hashDetect(str) {
    var hashtags = str.match(/\B\#\w\w+\b/g);
    if (!hashtags) return;
    // Check hashtags are not hex color strings
    for (var i=0; i<hashtags.length; i++) {
      if (/^#[0-9A-F]{6}$/i.test(hashtags[i])) hashtags.splice(i, 1);
    }
    this.detectedHashtags.push(...hashtags);
  }
}


