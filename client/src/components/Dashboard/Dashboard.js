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

import Sidebar from '../Sidebar/Sidebar'
import dashboardRoutes from '../../routes/dashboardRoutes'

import image from '../../assets/img/sidebar-ah-2.png'
import logo from '../../assets/img/arrowhead_logo_white.png'
import dashboardStyle from '../../assets/jss/material-dashboard-react/layouts/dashboardStyle'

import store from '../../core/store';
import ac_rest_manager from '../../core/ac_rest_manager.js';

import './Dashboard.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect) {
        return <Redirect from={prop.path} to={prop.to} key={key} />
      }
      if (prop.collapse) {
        return prop.views.map((view, index) => {
          return (
            <Route
              path={view.path}
              component={view.component}
              key={key + '-' + index}
            />
          )
        })
      } else {
        return <Route path={prop.path} component={prop.component} key={key} />
      }
    })}
  </Switch>
)

const Dashboard = (props) => {
  //const classes = useStyles()
  const { classes, ...rest } = props
  const [dense, setDense] = React.useState(false)
  const [secondary, setSecondary] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const content =
    <div className={"mainPage"}>
      <Sidebar
        routes={dashboardRoutes}
        logoText="Arrowhead"
        logo={logo}
        image={image}
        open={mobileOpen}
        color="blue"
        {...rest}
      />
      <div className={classes.mainPanel}>
        <div >{switchRoutes}</div>
      </div>;
    </div>
    return( content );
}



export default withStyles(dashboardStyle)(Dashboard);
