import React, { Component } from 'react';
import { Button, Row, Col, Card, CardImg, CardBody, CardText, CardTitle, CardSubtitle } from 'reactstrap'
import shell from 'electron';

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
          <Col sm={ styles.frame }>
          <Card className="border-0">
          <CardBody>
            <CardText>
              This project is Open Source and all contributions to the code base are welcome. See https://github.com/jkittley/PDFSearch for more details.
              The maintenance of this project is supported by Kittley Ltd (www.kittley.com).
            </CardText>

            <CardImg top src="assets/kittley-logo.png" alt="Kittley Limited Logo" className="mt-4" />

            <CardText className="mt-4"></CardText>
          </CardBody>
        </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const styles = {
  frame: { size: 8, offset: 2 },
}
