import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, FormGroup, Label, Input } from 'reactstrap'
import { Icon } from 'react-icons-kit'
import { trash } from 'react-icons-kit/fa/trash'

export default class Reset extends Component {

  constructor(props) {
    super(props);
    this.state = {
      areYouSure: "no",
    }
  }

  handleExit () {
    this.props.save();
  };

  handleDestroy() {
    this.props.destroyData();
  }

  handleAreYouSureChange() {
   this.setState({ "areYouSure": this.state.areYouSure === "no" ? "yes" : "no" });
  }

  render() {
    return (

      <div className="container text-center">
        <Button close onClick={ ()=> this.handleExit() }/>
        <h2 className="m-4">Reset Data</h2>

        <ListGroup className="text-left">
          <ListGroupItem style={{ backgroundColor: "#eee" }}>Reset</ListGroupItem>
          <ListGroupItem>
          <FormGroup check>
            <Label check>
              <Input onChange={ () => this.handleAreYouSureChange() }  type="checkbox" />{' '}
              I undestand that all the data will be erased and cannot be recovered.
            </Label>
          </FormGroup>
          <Button block disabled={this.state.areYouSure === "no"} onClick={ () => this.handleDestroy() } color="danger" className="mt-4">
                <Icon icon={trash}/>{' '}Erase All Data
          </Button>

          </ListGroupItem>
        </ListGroup>


      </div>
    );
  }
}
