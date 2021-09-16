import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'

import ontologyConstants from '../../core/ontologyConstants'
import './Prefixes.css'

export default function Prefixes(props) {
  var content = <div>
  {
    Object.keys(ontologyConstants).map((k, index) => {
      console.log(ontologyConstants[k].color)
      return <span key={"prefixes" + index} className="prefixChip" style={{backgroundColor: ontologyConstants[k].color}}>
      {k.toLowerCase()}
      </span>
    })
  }
  </div>
  return content
}
