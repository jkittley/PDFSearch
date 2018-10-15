import React from 'react';
import { ListGroupItem, FormGroup, Label, Input, ListGroup } from 'reactstrap';

export const HashtagItem = (props) => {
  return <ListGroupItem  style={{ backgroundColor: "#eee"}}>
  <FormGroup check>
    <Label check>
      <Input type="checkbox" onChange={ () => props.onCheckChange(props.name) } checked={props.checked} />
      <span>{props.name}</span>
    </Label>
  </FormGroup>
  </ListGroupItem>;
}

export const HashTagList = (props) => {
  return <ListGroup flush>
    { Object.keys(props.tags).sort().map( (tagname, i) => <HashtagItem key={i} {...props.tags[tagname]} onCheckChange={ props.onCheckChange } />)}
  </ListGroup>;
}

export default HashTagList;
