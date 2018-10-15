import React from 'react';
import { Table, Button, Badge } from 'reactstrap'
import { Icon } from 'react-icons-kit'
import { filePdfO } from 'react-icons-kit/fa/filePdfO'
import { exclamationTriangle } from 'react-icons-kit/fa/exclamationTriangle'

import moment from 'moment';

const shell = require('electron').shell;


const ResultsListItem = (props) => {
  var ood = props.lastScanned === null || moment(props.lastScanned).isBefore(moment(props.modified));
  return <tr>
    <td style={{ width: 50 }} className="p-4 m-4 text-center">

    { ood ?
      <Icon icon={exclamationTriangle} size="34" className="p-0 m-0" />
    :
      <Icon icon={filePdfO} size="34" className="p-0 m-0"/>
    }
    </td>
    <td>{props.file}<br/>
    <small>{props.path}</small><br/>
    { props.tags.map( (tag, i) => <Badge key={i} color="primary" pill>{ tag }</Badge> )}
    { ood ? <div>
      <Button disabled={props.isUpdating} onClick={ () => props.onClick(props.absolute) } color="link" size="sm" className="p-0 m-0">
      Modified recently. Update Now.
      </Button>
    </div> : null }
    </td>
    <td><Button disabled={props.isUpdating} color="primary" outline size="sm" onClick={ () => shell.openItem(props.absolute) }>Open</Button></td>
  </tr>;
}

function intersect(a, b) {
  var t;
  if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
  return a.filter(function (e) {
      return b.indexOf(e) > -1;
  });
}

const ResultsList = (props) => {
   return <Table>
        <tbody>
        { Object.keys(props.results).map( (key, i) => {
          if (props.tags.length >0 && intersect(props.results[key].tags, props.tags).length == 0) return null;
          return <ResultsListItem
            key={i} { ...props.results[key] }
            onClick={ props.onScanClick }
            isUpdating={ props.isUpdating }
          />
        })}
        </tbody>
      </Table>;
}

export default ResultsList;
