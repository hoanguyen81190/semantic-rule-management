import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import { Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Clear'

import { displayObjectText, buildObjectString } from './rdf_parser'

export const SUBSTITUTE_ACTION = "substituteService"
export const CONFIGURATION_ACTION = "configure"

export class SubstituteActionModel {
  constructor(consumer, fromService, toService) {
    this.type = SUBSTITUTE_ACTION
    this.consumer = consumer
    this.fromService = fromService
    this.toService = toService
  }

  getString() {
    return SUBSTITUTE_ACTION + '(' + buildObjectString(this.consumer) + ', '
                                   + buildObjectString(this.fromService) + ', '
                                   + buildObjectString(this.toService) + ')'
  }

  getDisplayComponent(key, edit) {
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
          <Tooltip title="to service">
            <Typography display="initial" variant="caption">
              {displayObjectText(this.toService)}
            </Typography>
          </Tooltip>
        </TableCell>
        {edit ? <TableCell><IconButton key="delete-action-button" onClick={(e, i) => edit.deleteCallback(key)}>
                                          <DeleteIcon style={{fill: "#f50057"}}/>
                                        </IconButton ></TableCell> : null}
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

  getString() {
    return CONFIGURATION_ACTION + '(' + buildObjectString(this.consumer) + ', '
                                   + buildObjectString(this.attribute) + ', '
                                   + buildObjectString(this.value) + ')'
  }

  getDisplayComponent(key, edit) {
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
        {edit ? <TableCell><IconButton key="delete-action-button" onClick={(e, i) => edit.deleteCallback(key)}>
                                          <DeleteIcon style={{fill: "#f50057"}}/>
                                        </IconButton ></TableCell> : null}
      </TableRow>
    )
  }
}
