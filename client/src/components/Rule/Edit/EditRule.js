import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import RDFGraph from '../../../components/Rule/RDFGraph'
import EditFact from './EditFact'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  card: {
    margin: "2%",
    maxHeight: "30%"
  }
}));

export default function EditRule(props) {
  const { callback } = props
  const classes = useStyles();

  const handleOKClick = (event, index) => {
    callback(true)
  }

  const handleCancelClick = (event, iindex) => {
    callback(false)
  }
  return (
    <div className={classes.root}>
      <Container style={{ backgroundColor: '#cfe8fc', height: '100vh' }}>
      <TextField required id="standard-required" label="Name" />
      <EditFact />
      <Divider />
      <Card className={classes.card}>
        <CardContent>
          Conclude
        </CardContent>
      </Card>
      </Container>
      <Button variant="contained" onClick={handleOKClick}>
        OK
      </Button>
      <Button variant="contained" onClick={handleCancelClick} >
        Cancel
      </Button>
    </div>
  );
}
