import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

import { RDFTriple } from "../../../core/rdfModel"
import * as ActionModel from "../../../core/actionModel"
import Autocomplete from '@material-ui/lab/Autocomplete'
import Button from '@material-ui/core/Button'

import RDFGraph from '../RDFGraph'
import ac_rest_manager from '../../../core/ac_rest_manager'
import { constructQueryBuilder, selectQueryBuilder, common_queries } from '../../../core/comunica'
import { convertToAutoCompleteRDF, parseObject } from '../../../core/rdf_parser'
import store from '../../../core/store'
import ONTOLOGY from "../../../core/ontologyConstants"

const useStyles = makeStyles((theme) => ({

}))

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

export default function EditAction(props) {
  const { onCloseCallback, openActionDialog, inputAction, variablesList } = props
  const classes = useStyles()

  const [ action, setAction ] = React.useState(ActionModel.SUBSTITUTE_ACTION)
  const [ errorMessage, setErrorMessage ] = React.useState('')
  var selectedVariables = []

  useEffect(() => {
  }, [variablesList])

  const updateActionClick = (event, index) => {
    if (action === ActionModel.SUBSTITUTE_ACTION) {
      if (selectedVariables.length !== 3) {
        setErrorMessage("Substitution action requires 3 parameters")
      }
      else {
        onCloseCallback(true, new ActionModel.SubstituteActionModel(selectedVariables[0],
                                                                    selectedVariables[1],
                                                                    selectedVariables[2]))
      }
    }
    else if (action === ActionModel.CONFIGURATION_ACTION) {
      if (selectedVariables.length !== 3) {
        setErrorMessage("Configuration action requires 3 parameters ")
      }
      else {
        onCloseCallback(true, new ActionModel.ConfigureActionModel(selectedVariables[0],
                                                                    selectedVariables[1],
                                                                    selectedVariables[2]))
      }
    }
  }

  const closeActionClick = (event, index) => {
    onCloseCallback(false, null)
  }

  var placeHolder = action === ActionModel.SUBSTITUTE_ACTION? 'consumer, from service, to service' : 'consumer, attribute, value'

  return (
    <Dialog
        open={openActionDialog}
        onClose={closeActionClick}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"New Action"}
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            id="action-suggestion"
            value={action}
            options={[ActionModel.SUBSTITUTE_ACTION, ActionModel.CONFIGURATION_ACTION]}
            onChange={(event, newValue) => {
              setAction(newValue)
            }}
            renderInput={(params) => <TextField required
                                                {...params} label="Action" variant="outlined" />}
          />
          <Autocomplete
            multiple
            id="checkboxes-variables-demo"
            options={variablesList}
            disableCloseOnSelect
            getOptionLabel={(option) => option.value}
            onChange={(event, value) => selectedVariables = value}
            renderOption={(option, { selected }) => (
              <React.Fragment>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.value}
              </React.Fragment>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Variables" placeholder={placeHolder} />
            )}
          />
          <Typography color='error'>
            {errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={updateActionClick}>OK</Button>
          <Button onClick={closeActionClick} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  )
}
