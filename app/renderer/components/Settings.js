import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, FormGroup, Label, Input } from 'reactstrap'
import { remote } from 'electron'
import { Icon } from 'react-icons-kit'
import { trash } from 'react-icons-kit/fa/trash'
import { plusCircle } from 'react-icons-kit/fa/plusCircle'

export default class Settings extends Component {

  constructor(props) {
    super(props);
  }

  handleExit () {
    this.props.save();
  };

  handleAddDir () {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }, function (folderNames) {
      if (folderNames === undefined) return;
      for (var i=0; i<folderNames.length; i++) {
        this.props.upsertDir(folderNames[i]);
      }
    }.bind(this));
  }

  handleSubFolder(absolute, newState) {
    this.props.setIncSubFolder(absolute, newState);
  }

  handleDelete(path) {
    this.props.removeDir(path);
  }

  render() {
    return (

      <div className="container text-center">
        <Button close onClick={ ()=> this.handleExit() }/>
        <h2 className="m-4">Settings</h2>

        <ListGroup className="text-left">
          <ListGroupItem style={{ backgroundColor: "#eee" }}>Document Folders</ListGroupItem>

          { Object.keys(this.props.dirs).map( (path, i ) =>
            <ListGroupItem key={i}>

            <div className="float-left">
            {path}<br/>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" onChange={ (state) => this.handleSubFolder(path, !this.props.dirs[path].incSubFolders) } checked={ this.props.dirs[path].incSubFolders } />
                <span>Search subfolders</span>
              </Label>
            </FormGroup>
            </div>
            <div className="float-right">
            <Button className="float-right" onClick={ () => this.handleDelete(path) } color="link">
              <Icon icon={trash}/>
            </Button>
            </div>
            </ListGroupItem>

          )}
          <ListGroupItem>
            <Button onClick={ ()=> this.handleAddDir() } color="link">
            <Icon icon={ plusCircle }/>{' '}
            Add Folder
            </Button>
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }
}
