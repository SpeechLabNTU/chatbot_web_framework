import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Questions from "./Questions.jsx";
import SingleQuestion from "./SingleQuestion.jsx";
import NewQuestion from "./NewQuestion.jsx";

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import BackupIcon from '@material-ui/icons/Backup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';


import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';
import Slide from '@material-ui/core/Slide';

import axios from 'axios';


const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: 40,
    marginRight: 40,
  },
  sideIcon: {
    marginRight: 10,
  },
  topicMenu: {
    zIndex: 1300,
  },
}));


export default function Main(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const [allTopics, setAllTopics] = React.useState([])
  const [currentTopic, setCurrentTopic] = React.useState("")
  const [data, setData] = React.useState([])
  const [dataChanged, setDataChanged] = React.useState(false)
  const [currentContext, setCurrentContext] = React.useState("Questions")

  const [isTopicMenuOpen, setIsTopicMenuOpen] = React.useState(false)
  const [topicAnchorRef, setTopicAnchorRef] = React.useState(null)

  const [selectedIndex, setSelectedIndex] = React.useState(null)
  const [addNewQuestion, setAddNewQuestion] = React.useState(false)

  // initial call to backend to get all topics available
  React.useEffect( () => {
    axios.get(`${process.env.REACT_APP_API}/faqtopics`)
    .then( res => {
      setAllTopics(res.data.topics)
      setCurrentTopic(res.data.topics[0])
    })
  }, [])

  React.useEffect( () => {
    if (currentTopic !== ""){
      axios.get(`${process.env.REACT_APP_API}/faqdata/${currentTopic}`)
      .then( (res) => {
        setData(res.data.data)
      }).catch( (err) => {
        console.log(err)
      })
    }
  }, [currentTopic])

  React.useEffect( () => {
    if (dataChanged) {
      axios.post(`${process.env.REACT_APP_API}/faqdata`, {
        topic: currentTopic,
        data: data,
      }).catch( err => {
        console.log(err)
      })
      setDataChanged(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataChanged])

  // side drawer component
  const drawer = (
    <React.Fragment >
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem key={"Topics"}>
          <ListItemText primary={"Topics"} primaryTypographyProps={{variant: 'h6'}} />
        </ListItem>
        <ListItem button onClick={ (e) => {
          setTopicAnchorRef(e.currentTarget)
          setIsTopicMenuOpen((prev)=>!prev)
        }}>
          <ListItemText primary={currentTopic} />
          <ArrowDropDownIcon />
        </ListItem>
      </List>
      <Popper open={isTopicMenuOpen} anchorEl={topicAnchorRef} transition placement="right-start"
      className={classes.topicMenu}>
      { ( {TransitionProps, placement} ) => (
        <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
        <Paper>
        <ClickAwayListener onClickAway={()=>{setIsTopicMenuOpen(false)}}>
        <MenuList autoFocusItem={isTopicMenuOpen}>
          {allTopics.map((item) => (
            <MenuItem key={item} button onClick={()=>setCurrentTopic(item)}>{item}</MenuItem>
          ))}
        </MenuList>
        </ClickAwayListener>
        </Paper>
        </Grow>
      )}
      </Popper>

      <Divider />

      <List>
        <ListItem button key={"Questions"} onClick={()=>setCurrentContext("Questions")}>
          <QuestionAnswerIcon className={classes.sideIcon}/>
          <ListItemText primary={"Questions"} />
        </ListItem>
        <ListItem button key={"Trained Models"} onClick={()=>setCurrentContext("Trained Models")}>
          <ListItemText primary={"Trained Models"} />
        </ListItem>
        <ListItem button key={"Deployments"} onClick={()=>setCurrentContext("Deployments")}>
          <BackupIcon className={classes.sideIcon} />
          <ListItemText primary={"Deployments"} />
        </ListItem>
      </List>
      <Divider />
    </React.Fragment>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            edge="start"
            onClick={()=>setMobileOpen(p=>!p)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            FAQ Answering Model
          </Typography>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp >
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={()=>setMobileOpen(p=>!p)}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown >
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <div className={classes.toolbar} />
          {/* Questions context */}
          <Fade in={currentContext==="Questions"}>
            <div>
            <Slide direction="right" in={selectedIndex===null && !addNewQuestion} mountOnEnter unmountOnExit
            timeout={{enter:600}}>
              <div>
                <Questions
                setAddNewQuestion={setAddNewQuestion}
                data={data}
                setData={setData}
                setDataChanged={setDataChanged}
                setSelectedIndex={setSelectedIndex} />
              </div>
            </Slide>
            <Slide direction="left" in={selectedIndex!==null} mountOnEnter unmountOnExit
            timeout={{enter:600}}>
              <div>
                <SingleQuestion
                data={data}
                setData={setData}
                setDataChanged={setDataChanged}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex} />
              </div>
            </Slide>
            <Slide direction="left" in={addNewQuestion} mountOnEnter unmountOnExit
            timeout={{enter:600}}>
              <div>
                <NewQuestion
                data={data}
                setData={setData}
                setDataChanged={setDataChanged}
                setAddNewQuestion={setAddNewQuestion} />
              </div>
            </Slide>
            </div>
          </Fade>

      </main>
    </div>
  )
}
