import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap'
import { ipcRenderer } from 'electron';
import HashtagList from './HashTagList'
import ResultsList from './ResultsList'
import { findDeletedFiles, findOrphanTags } from "../../dirscan";
import { withRouter } from 'react-router'
import { Icon } from 'react-icons-kit';
import { refresh } from 'react-icons-kit/fa/refresh';
import { searchPlus } from 'react-icons-kit/fa/searchPlus';
import ScaleLoader from 'react-spinners/ScaleLoader';
import moment from 'moment'

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFindingOutOfDate: false,
      isScanningFiles: false,
      scansInProgress: 0,
      numFilesToScan: 0,
      numFilesScanned: 0
    }
  }

  componentWillMount() {
    ipcRenderer.on('transitionTo', (evt, route) => {
      this.props.history.push(route);
    });

    ipcRenderer.on('fgmessage', (event, payload) => {
      // console.log("Messgae received", payload);
      switch (payload.type) {
        case "scanComplete":
          this.scanFileComplete(payload.absolute, payload.hashtags);
          break;
        case "scanFailed":
          this.scanFileFailed(payload.absolute, payload.errors);
          break;
        case "fileIsOutOfDate":
          this.outOfDateFileFound(payload.absolute, payload.doc);
          break;
        case "outOfDateScanComplete":
          this.outOfDateScanComplete(payload);
          break;
      }
    });
  }



  refreshFiles() {
    this.findOutOfDate();
    this.findDeleted();
    this.findOrphanTags();
  }

  findOrphanTags() {
    findOrphanTags(this.props.files, this.props.tags, function(tag) {
      this.props.removeTag(tag);
    }.bind(this));
  }

  findOutOfDate() {
    console.log("Checking which files need updating");

    this.setState( prevState =>  { return { isFindingOutOfDate: true }});
    ipcRenderer.send('bgmessage', {
      type: "findOutOfDateFiles",
      dirs: this.props.dirs
    });
  }

  outOfDateFileFound(absolute, doc) {
      this.props.upsertFile(absolute, doc);
  }

  outOfDateScanComplete(allResults) {
    console.log(allResults);
    this.setState( prevState =>  { return { isFindingOutOfDate: false }});
  }

  findDeleted() {
    console.log("Checking for files which have been deleted");
    findDeletedFiles(this.props.dirs, this.props.files, function(missingFileKey) {
      console.log('MISSING', missingFileKey);
      this.props.removeFile(missingFileKey);
    }.bind(this));
  }

  scanFileComplete(absolute, hashtags) {
    console.log("Scan complete", absolute, hashtags);
    this.props.tagFile(absolute, hashtags);
    this.props.upsertFile(absolute, { lastScanned: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ") });
    this.setState( (prevState) =>  { return {
      scansInProgress: prevState.scansInProgress - 1,
      isScanningFiles: prevState.scansInProgress - 1 > 0
    }})
  }

  scanFileFailed(absolute, error) {
    console.log("Scan failed", absolute, error);
    this.setState( (prevState) =>  { return {
      scansInProgress: prevState.scansInProgress - 1,
      isScanningFiles: prevState.scansInProgress - 1 > 0
    }})
  }

  scanFiles(files) {
    if (!Array.isArray(files)) files = [files];
    console.log(files);
    this.setState( (prevState) =>  { return {
      scansInProgress: prevState.scansInProgress + 1,
      isScanningFiles: true,
    }})
    ipcRenderer.send('bgmessage', {
      type: "scanFiles",
      files: files
    });
  }

  scanAllOutOfDate() {
    this.scanFiles(this.listOutOfDate());
  }

  isOutOfDate(doc) {
    return doc.lastScanned === null || doc.lastScanned < doc.modified
  }

  listOutOfDate() {
    return Object.keys(this.props.files).filter( key => this.isOutOfDate(this.props.files[key]));
  }

  countOutOfDate() {
    return this.listOutOfDate().length;
  }

  renderNoData() {
    return (
      <Col xs="8" style={{ height: "100vh", width: "100%", overflowY: "auto", overflowX: "hidden" }} className="m-0 p-0">
        <div className="container d-flex h-100">
          <div className="align-self-center">

            { Object.keys(this.props.dirs).length === 0 ? <div>
            <h1 className="display-4">Welcome</h1>
            <p>To begin, add at least one folder to scan.</p>
            <Button color="primary" onClick={() => this.handleSettings()} size="sm">Add Folders</Button>
            </div> : ''}

            { !this.state.isScanning && Object.keys(this.props.dirs).length > 0 && Object.keys(this.props.files).length === 0 ? <div>
            <h1 className="display-4">No files</h1>
            <p>No PDF files have been detected in the folders you have selected.</p>
            <Button disabled={ this.state.isFindingOutOfDate || this.state.isScanningFiles } color="primary" onClick={() => this.findOutOfDate() } size="sm">
            { this.state.isFindingOutOfDate || this.state.isScanningFiles ?
            <ScaleLoader height={20}/>
            : 'Check Again' }
            </Button>
            </div>
            : null }

            </div>
        </div>
      </Col>
    )
  }

  renderResultsHeaderDoing(title) {
    return <div>
      <div className="m-2 float-left">
      {title}
    </div>
    <div className="float-right mt-2 mr-2"><ScaleLoader height={20}/></div>
    </div>
  }

  renderResultsHeader() {

    if (this.state.isScanningFiles) return this.renderResultsHeaderDoing("Scanning files...");
    if (this.state.isFindingOutOfDate) return this.renderResultsHeaderDoing("Refreshing File List...");

    return <div>
      <div className="m-2 float-left">
      { Object.keys(this.props.files).length} files found. { this.countOutOfDate() } need to updated.
      </div>

      { this.countOutOfDate() > 0 && this.state.scansInProgress <= 0 && !this.state.isFindingOutOfDate ?
      <Button
        onClick={ this.scanAllOutOfDate.bind(this) }
        size="sm"
        className="mt-1"
        color="link"
        disabled={ this.state.isFindingOutOfDate || this.state.isScanningFiles }
      ><Icon icon={searchPlus}></Icon> Update Now</Button>
      : null }

      <Button color="link" size="sm" onClick={() => this.refreshFiles() } className="float-right mr-2 mt-1"><Icon icon={refresh}></Icon> Refresh</Button>
    </div>;
  }
  renderResults() {
    return (
      <Col xs="8" style={{ height: "100vh", width: "100%", overflowY: "auto", overflowX: "hidden" }} className="m-0 p-0">

      { this.renderResultsHeader() }

      <ResultsList
        results={this.props.files}
        tags={ Object.keys(this.props.tags).filter( tag => { return this.props.tags[tag].checked }) }
        onScanClick={ (absolute) => { this.scanFiles(absolute) }}
        isUpdating={ this.state.isFindingOutOfDate || this.state.isScanningFiles }
        />
      </Col>
    )
  }

  render() {
    return (<div className="container-fluid">
        <Row>
          <Col xs="4" className="border-right p-0" style={{ height: "100vh", width: "100%", backgroundColor: "#34363a", overflowY: "auto", overflowX: "hidden" }}>
            <Row className="pb-2">
              <Col>
                <h3 className="ml-3 mt-3"><img src="assets/logo.png" height="30"/></h3>
              </Col>
            </Row>
            <HashtagList tags={this.props.tags} onCheckChange={ (tagname) => this.props.toggleCheckTag(this.props.tags[tagname]) } />
          </Col>
          { Object.keys(this.props.files).length === 0 ? this.renderNoData() : this.renderResults() }
        </Row>
      </div>);
  }
}

export default withRouter(Home);
