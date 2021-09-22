import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import RDFGraph from '../../components/Rule/RDFGraph'


export default function RuleComponent(props) {
  const { jenaRules } = props

  console.log("JENA", jenaRules)
  return (
    <RDFGraph rdfTriples={jenaRules.statement.body} isEditable={false}/>
  );
}
