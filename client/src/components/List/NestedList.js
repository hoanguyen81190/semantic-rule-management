import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NestedList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const { displayedList } = props;

  const handleClick = () => {
    setOpen(!open);
  };

  // const listItems = displayedList.map((item, index) => {
  //   console.log(item)
  //   return
  //   <div style={{backgroundColor:'red', height:200, width:200}}>
  //     <ListItem key={index} button onClick={handleClick}>
  //       <ListItemText primary={item.systemName} />
  //       {open ? <ExpandLess /> : <ExpandMore />}
  //     </ListItem>
  //     <Collapse in={open} timeout="auto" unmountOnExit>
  //         <List component="div" disablePadding>
  //         {
  //           item.rules.map((rule, rindex) => {
  //             return
  //             <ListItem key={rindex} button className={classes.nested}>
  //               <ListItemText primary={rule}/>
  //             </ListItem>
  //           })
  //         }
  //         </List>
  //   </Collapse>
  //   </div>
  // })

  const listItems = displayedList.map((item, index) => {
    console.log("HI", item)
    return
    <div style={{backgroundColor:'red', height:200, width:200}}>
      <ListItem key={index} button onClick={handleClick}>
        <ListItemText primary={item.systemName} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          {
            item.rules.map((rule, rindex) => {
              return
              <ListItem key={rindex} button className={classes.nested}>
                <ListItemText primary={rule}/>
              </ListItem>
            })
          }
          </List>
    </Collapse>
    </div>
  })

  return (
    <List style={{backgroundColor:'blue', height:200, width:200}}
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
    {
      listItems
    }
    </List>
  );
}
