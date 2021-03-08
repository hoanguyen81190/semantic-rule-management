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
import { Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles'

import store from '../../core/store';
import ac_rest_manager from '../../core/ac_rest_manager.js';

const useStyles = makeStyles((theme) => ({

}));

const Queries = (props) => {
  //const classes = useStyles()
  const { classes, ...rest } = props
  const [dense, setDense] = React.useState(false)
  const [secondary, setSecondary] = React.useState(false)
  const [queries, setQueries] = React.useState([])

  const [selectedIndex, setSelectedIndex] = React.useState(false)

  useEffect(() => {
    ac_rest_manager.getAllQueries((data) => {
      console.log("queries", data)
      setQueries(data)
    })
  }, []);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const generate = (elements) => {
    return elements.map((item, index) =>
      <ListItem key={index}
                onClick={event => handleListItemClick(event, index)}
                selected={selectedIndex === index}>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item.name}
          secondary={secondary ? 'Secondary text' : null}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  const content =
    <div className={"mainPage"}>
      {generate(queries)}
    </div>
    return( content );
}



export default withStyles(useStyles)(Queries);
