import React, { useState, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import AddIcon from '@material-ui/icons/Add'
import { Typography } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'

import Prefixes from '../../components/Prefixes/Prefixes'
import RuleComponent from '../../components/Rule/RuleComponent'
import EditRuleComponent from '../../components/Rule/Edit/EditRuleComponent'

import store from '../../core/store'
import ac_rest_manager from '../../core/ac_rest_manager.js'

import jenaRuleExample from './TestConsumer.rule'
import sosaTurtle from './sosa.ttl'
import { jenaRuleParser, getRuleResponseParser, buildJenaRuleRequest } from '../../core/rdf_parser'

const useStyles = makeStyles((theme) => ({

}));

const Rules = (props) => {
  //const classes = useStyles()
  const { classes, ...rest } = props
  const [dense, setDense] = React.useState(false)
  const [secondary, setSecondary] = React.useState(false)

  const [jenaRules, setJenaRules] = React.useState([])
  const [prefixes, setPrefixes] = React.useState([])

  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [open, setOpen] = React.useState({})

  const [consumerSystems, setConsumerSystems] = React.useState([])
  const [rerender, setRerender] = React.useState(0)

  const handleClick = () => {

  }

  const [openAlertDialog, setOpenAlertDialog] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const handleClose = () => {
    setOpenAlertDialog(false)
  }

  useEffect(() => {
    // fetch(jenaRuleExample)
    //   .then(r => r.text())
    //   .then(text => {
    //     var output = jenaRuleParser(text)
    //     console.log("output", output)
    //     setJenaRules(output.rules)
    //   })
    ac_rest_manager.getAllRules((data) => {
      if (data) {
        var output = getRuleResponseParser(data, consumerSystems)
        setConsumerSystems(output.systems)
        setJenaRules(output.rules)
      }
    })
  }, [])

  const editRuleCallback = (newRule) => {
    if (!newRule) {
      setOpen({...open, [0]: false})
    }
    else {
      var jenaRule = buildJenaRuleRequest(newRule)
      ac_rest_manager.registerRule(jenaRule, (response) => {
        if (response.status === 200) { //succeeded
          console.log("NEW RULE", newRule)
          jenaRules.push(newRule)
          setOpenAlertDialog(true)
          setMessage("Rule " + newRule.name + " has been added for the system " + newRule.systemName)
          setOpen({...open, [0]: false})
        }
        else { //failed
          setMessage("Error! can not add rule " + newRule.name + " for the system " + newRule.systemName)
        }
      })
    }
  }

  const handleListItemClick = (event, iindex) => {
    // setOpen(!open)
    if (open[iindex] === undefined) {
      setOpen({...open, [iindex]: true})
    }
    else {
      setOpen({...open, [iindex]: !open[iindex]})

    }

    setSelectedIndex(iindex - 1)
  }

  const handleDeleteRule = (index) => {
    var jenaRule = buildJenaRuleRequest(jenaRules[index])
    ac_rest_manager.deleteRule(jenaRule, (response) => {
      if(response.status === 200) { //succeeded
        jenaRules.splice(index, 1)
        setRerender(rerender + 1)
      }
    })
  }

  var rules = <List>
    <div key={0}>
      <ListItem
                button
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}>
          <AddIcon/>
          <Typography>
            Add new rule
          </Typography>
      </ListItem>
      <Collapse in={open[0]} timeout="auto" unmountOnExit>
        <EditRuleComponent currentRules={jenaRules} callback={editRuleCallback} consumerSystems={consumerSystems}/>
      </Collapse>
    </div>
  {jenaRules.map((sitem, sindex) =>
      <div key={sindex + 1}>
        <ListItem
                  button
                  selected={selectedIndex === sindex}
                  onClick={(event) => handleListItemClick(event, sindex + 1)}>
          <ListItemAvatar>
            <Avatar>
              <LibraryBooksIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={sitem.systemName + ': ' + sitem.name} />
          {open[sindex + 1] ? <ExpandLess /> : <ExpandMore />}
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={(e, v) => handleDeleteRule(sindex)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={open[sindex + 1]} timeout="auto" unmountOnExit>
          <RuleComponent jenaRules={sitem} />
        </Collapse>
      </div>
    )}
  </List>

  //var mainDisplay = (!isAdding) ? rules : <EditRule callback={editRuleCallback}/>

  var content =
    <div>
    <Prefixes />
    <Divider />
    {rules}
    <Dialog
        open={openAlertDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/*<DialogTitle id="alert-dialog-title">{}</DialogTitle>*/}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  return (content)
}



export default withStyles(useStyles)(Rules)
