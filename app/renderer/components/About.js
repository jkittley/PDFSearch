import React, { Component } from 'react';
import { Button, Row, Col, Card, CardImg, CardBody, CardText, CardTitle, CardSubtitle } from 'reactstrap'


export default class About extends Component {

  handleExit () {
    this.props.exit();
  };

  render() {
    return (

      <div className="container text-center">
        <Button close onClick={ ()=> this.handleExit() }/>
        <h2 className="m-4">About</h2>
        <Row>
          <Col sm={{ size: 6, offset: 3 }}>
          <Card>
          <CardBody>
            <CardSubtitle>This application was developed and is supported by Kittley Ltd</CardSubtitle>
            <CardImg top src="assets/kittley-logo.png" alt="Kittley Limited Logo" />

            <CardText className="mt-4"></CardText>
          </CardBody>
        </Card>
          </Col>
        </Row>




      </div>
    );
  }
}
