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

import TestComponent from '../../components/Test/TestComponent'

import NestedList from '../../components/List/NestedList'
import Prefixes from '../../components/Rule/Prefixes'
import RuleComponent from '../../components/Rule/RuleComponent'
import EditRuleComponent from '../../components/Rule/Edit/EditRuleComponent'

import store from '../../core/store'
import ac_rest_manager from '../../core/ac_rest_manager.js'

import jenaRuleExample from './TestConsumer.rule'
import sosaTurtle from './sosa.ttl'
import { jenaRuleParser, turtleParser, getRuleResponseParser } from '../../core/rdf_parser'

const useStyles = makeStyles((theme) => ({

}));

const Rules = (props) => {
  //const classes = useStyles()
  const { classes, ...rest } = props
  const [dense, setDense] = React.useState(false)
  const [secondary, setSecondary] = React.useState(false)
  const [consumerSystems, setConsumerSystems] = React.useState([])
  const [jenaRules, setJenaRules] = React.useState([])
  const [prefixes, setPrefixes] = React.useState([])

  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [open, setOpen] = React.useState({})
  const [isAdding, setIsAdding] = React.useState(false)
  const handleClick = () => {

  }

  useEffect(() => {
    fetch(jenaRuleExample)
      .then(r => r.text())
      .then(text => {
         var parseResult = jenaRuleParser(text)
         setPrefixes(parseResult.prefixes)
         setJenaRules(parseResult.rules)
      })
    // ac_rest_manager.getAllRules((data) => {
    //   if (data) {
    //     //console.log("GET ALL RULES", data)
    //     console.log("GET ALL RULES", data)
    //     var output = getRuleResponseParser(data)
    //     console.log("output", output)
    //     setJenaRules(getRuleResponseParser(data))
    //   }
    //
    // })
  }, [])

  // useEffect(() => {
  //   ac_rest_manager.getAllRules((data) => {
  //     if (data) {
  //       setConsumerSystems(data)
  //     }
  //
  //   })
  // }, [])


  const editRuleCallback = (close) => {
    //console.log("reason", close)
    setIsAdding(false)
  }

  const handleListItemClick = (event, iindex) => {
    // setOpen(!open)
    if (open[iindex] === undefined) {
      setOpen({...open, [iindex]: true})
    }
    else {
      setOpen({...open, [iindex]: !open[iindex]})

    }

    //console.log("SELECTED INDEX", iindex)
    setSelectedIndex(iindex - 1)
  }

  const handleAddRuleClick = () => {
    //collapse all Rules
    setIsAdding(true)
    //console.info('you want to add', open)
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
        <EditRuleComponent callback={editRuleCallback}/>
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
            <IconButton edge="end" aria-label="delete">
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

    {rules}
    </div>
  return (content)
}



export default withStyles(useStyles)(Rules)
