import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles'

import TestComponent from '../../components/Test/TestComponent'

import NestedList from '../../components/List/NestedList'
import RuleCard from '../../components/Rule/RuleCard'

import store from '../../core/store'
import ac_rest_manager from '../../core/ac_rest_manager.js'

const useStyles = makeStyles((theme) => ({

}));

const ConsumerSystems = (props) => {
  //const classes = useStyles()
  const { classes, ...rest } = props
  const [dense, setDense] = React.useState(false)
  const [secondary, setSecondary] = React.useState(false)
  const [consumerSystems, setConsumerSystems] = React.useState([])

  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [open, setOpen] = React.useState({})
  const handleClick = () => {

  }

  useEffect(() => {
    ac_rest_manager.getAllConsumers((data) => {
      if (data) {
        setConsumerSystems(data)
      }

    })
  }, [])

  const handleListItemClick = (event, iindex) => {
    // setOpen(!open)
    if (open[iindex] === undefined) {
      setOpen({...open, [iindex]: true})
    }
    else {
      setOpen({...open, [iindex]: !open[iindex]})

    }

    setSelectedIndex(iindex)
  }

  const content =
    <List>
    {consumerSystems.map((sitem, sindex) => {
      console.log("RIGHT BEFORE ERROR", sitem);
        var consumerInfo = JSON.parse(sitem.description)
        return <div>
          <ListItem key={sindex}
                    button
                    selected={selectedIndex === sindex}
                    onClick={(event) => handleListItemClick(event, sindex)}>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={sitem.consumer} />
            {open[sindex] ? <ExpandLess /> : <ExpandMore />}
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Collapse in={open[sindex]} timeout="auto" unmountOnExit>
            <Typography paragraph>
              {consumerInfo.serviceName}
            </Typography>
            <Typography paragraph>
              {consumerInfo.serviceEndpoint}
            </Typography>
          </Collapse>
        </div>
      }

    )}
    </List>

  return ( content )
}



export default withStyles(useStyles)(ConsumerSystems)
