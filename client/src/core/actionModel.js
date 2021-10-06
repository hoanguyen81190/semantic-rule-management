import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import { Typography } from '@material-ui/core'

import { displayObjectText } from './rdf_parser'

export const SUBSTITUTE_ACTION = "substituteService"
export const CONFIGURATION_ACTION = "configure"

export class SubstituteActionModel {
  constructor(consumer, fromService, fromProducer, toService, toProducer) {
    this.type = SUBSTITUTE_ACTION
    this.consumer = consumer
    this.fromService = fromService
    this.fromProducer = fromProducer
    this.toService = toService
    this.toProducer = toProducer
  }

  getDisplayComponent(key) {
    return (
      <TableRow key={key}>
        <TableCell component="th" scope="row">
          {SUBSTITUTE_ACTION}
        </TableCell>
        <TableCell >
          <Tooltip title="consumer system">
            <Typography display="initial" variant="caption">
              {displayObjectText(this.consumer)}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell >
          <Tooltip title="from service">
            <Typography display="initial" variant="caption">
              {displayObjectText(this.fromService)}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell >
          <Tooltip title="from provider">
            <Typography display="initial" variant="caption">
              {displayObjectText(this.fromProducer)}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell >
          <Tooltip title="to service">
            <Typography display="initial" variant="caption">
              {displayObjectText(this.toService)}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell >
          <Tooltip title="to producer">
            <Typography display="initial" variant="caption">
              {displayObjectText(this.toProducer)}
            </Typography>
          </Tooltip>
        </TableCell>
      </TableRow>
    )
  }
}

export class ConfigureActionModel {
  constructor(consumer, attribute, value) {
    this.type = CONFIGURATION_ACTION
    this.consumer = consumer
    this.attribute = attribute
    this.value = value
  }

  getDisplayComponent(key) {
    return (
      <TableRow key={key}>
        <TableCell component="th" scope="row">
          {CONFIGURATION_ACTION}
        </TableCell>
        <TableCell >
          <Tooltip title="consumer system">
            <Typography display="initial" variant="caption">
              {displayObjectText(this.consumer)}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell >
          <Tooltip title="attribute">
            <Typography display="initial" variant="caption">
              {displayObjectText(this.attribute)}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell >
          <Tooltip title="value">
            <Typography display="initial" variant="caption">
              {displayObjectText(this.value)}
            </Typography>
          </Tooltip>
        </TableCell>
      </TableRow>
    )
  }
}
