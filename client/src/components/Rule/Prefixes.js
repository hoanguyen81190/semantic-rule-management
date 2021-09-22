import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography'

import ONTOLOGY from '../../core/ontologyConstants'
import './Prefixes.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  section1: {
    margin: theme.spacing(3, 2),
  },
  dividerInset: {
    margin: `15px 0 15px 0`,
  },
}));

export default function Prefixes(props) {
  const classes = useStyles()
  // <Divider orientation="vertical" flexItem />
  // {ontologyConstants[k].url}
  var content = <div>

  <Typography className={classes.dividerFullWidth}
              display="initial"
              variant="caption">
  Prefixes
  </Typography>

  <Divider variant="middle"/>
    <div className={classes.section1}>
  {
    Object.keys(ONTOLOGY.ontologyConstants).map((k, index) => {
      return <span key={"prefixes" + index} className="prefixChip" style={{backgroundColor: ONTOLOGY.ontologyConstants[k].color}}>
      {k.toLowerCase()}
      </span>
    })
  }
    </div>
  <Divider variant="middle"/>
  </div>
  return content
}
