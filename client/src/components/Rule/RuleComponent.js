import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import RDFGraph from '../../components/Rule/RDFGraph'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '89%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}));

export default function RuleComponent(props) {
  const svgRef = React.useRef(null)
  const { jenaRules } = props
  const classes = useStyles()

  console.log("JENA", jenaRules)
  return (
    <RDFGraph rdfTriples={jenaRules.statement.body}/>
  );
}
