import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Questions from "./Questions.jsx";
import SingleQuestion from "./SingleQuestion.jsx";
import NewQuestion from "./NewQuestion.jsx";
import Settings from "./Settings.jsx";

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';
import Slide from '@material-ui/core/Slide';

import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import MenuIcon from '@material-ui/icons/Menu';
import BackupIcon from '@material-ui/icons/Backup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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
    minHeight: "5em",
    flexDirection: 'row',
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
  toolbar: {
    minHeight: "5em"
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: '4em',
    marginRight: '4em',
  },
  sideIcon: {
    marginRight: '1em',
  },
  topicMenu: {
    zIndex: theme.zIndex.modal,
  },
  menuItem: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
  }
}));


export default function Main(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const [newTopic, setNewTopic] = React.useState("")

  const [allTopics, setAllTopics] = React.useState([])
  const [currentTopic, setCurrentTopic] = React.useState("")
  const [newTopicDialog, setNewTopicDialog] = React.useState(false)

  const [data, setData] = React.useState([])
  const [dataChanged, setDataChanged] = React.useState(false)
  const [currentContext, setCurrentContext] = React.useState("Questions")

  const [isTopicMenuOpen, setIsTopicMenuOpen] = React.useState(false)
  const [topicAnchorRef, setTopicAnchorRef] = React.useState(null)

  const [selectedIndex, setSelectedIndex] = React.useState(null)
  const [addNewQuestion, setAddNewQuestion] = React.useState(false)

  // call to backend to get all topics available
  React.useEffect( () => {
    axios.get(`${process.env.REACT_APP_API}/faqtopics`)
    .then( res => {
      setAllTopics(res.data.topics)
      if (res.data.topics.length === 0 ) {
        // do nothing if no topics found
        setData([])
      }
      else if (currentTopic==="") {
        setCurrentTopic(res.data.topics[0])
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentTopic])

  // get data for current topic
  React.useEffect( () => {
    if (currentTopic !== ""){
      axios.get(`${process.env.REACT_APP_API}/faqdata/${currentTopic}`)
      .then( (res) => {
        let temp = res.data.data.map( val => {
          if (val.Alternatives==="" || val.Alternatives===undefined) {
            val.Alternatives = []
            return val
          }
          else {
            return val
          }
        })
        setData(temp)
      }).catch( (err) => {
        console.log(err)
      })
    }
    setCurrentContext("Questions")
  }, [currentTopic])

  // update backend with changed data
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

  React.useEffect( () => {
    setIsTopicMenuOpen(false)
  }, [currentContext])

  // side drawer component
  const drawer = (
    <React.Fragment >
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem key={"Topics"}>
          <ListItemText primary={"Topics"} primaryTypographyProps={{variant: 'h6'}} />
          <IconButton size='medium' edge="end" onClick={()=>{setCurrentContext("Topics")}}>
            <SettingsIcon />
          </IconButton>
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
            <MenuItem key={item} className={classes.menuItem} button
            onClick={()=>setCurrentTopic(item)}>
              {item}
            </MenuItem>
          ))}
            <Divider style={{margin:theme.spacing(1)}}/>
            <MenuItem key={"New Topic"} className={classes.menuItem} button
            onClick={()=>{setNewTopicDialog(true)}}>
              <AddCircleOutlineIcon fontSize='small'/>
              <Typography style={{marginLeft:theme.spacing(1)}}
              >New Topic</Typography>
            </MenuItem>
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
        <ListItem button key={"Trained Models"} onClick={()=>setCurrentContext("Trained Models")} disabled>
          <ListItemText primary={"Trained Models"} />
        </ListItem>
        <ListItem button key={"Deployments"} onClick={()=>setCurrentContext("Deployments")} disabled>
          <BackupIcon className={classes.sideIcon} />
          <ListItemText primary={"Deployments"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disabled>
        This page is in development. Any data shown here is currently not linked to the any services in anyway.
        </ListItem>
      </List>

      {/* Dialog for creating new topic */}
      <Dialog open={newTopicDialog} onClose={()=>{setNewTopicDialog(false)}}>
        <DialogTitle >{"Enter name of new topic"}</DialogTitle>
        <DialogContent>
          <TextField id='new topic name' value={newTopic} onChange={(e)=>setNewTopic(e.target.value)}/>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={(e)=>{
            axios.post(`${process.env.REACT_APP_API}/faqtopics/create`, {topic: newTopic})
            .then( res => {
              setCurrentTopic(newTopic)
              setNewTopic("")
              setNewTopicDialog(false)
            })
          }}>
            Create
          </Button>
          <Button color="primary" autoFocus
          onClick={()=>{setNewTopicDialog(false)}}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense" style={{}}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={()=>setMobileOpen(p=>!p)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap>
            FAQ Management
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
          {/* Topics context */}
          <Fade in={currentContext==="Topics"}>
            <div style={{height:'100%'}}>
              <Settings
              currentTopic={currentTopic}
              setCurrentTopic={setCurrentTopic}
              />
            </div>
          </Fade>
          {/* Questions context */}
          <Fade in={currentContext==="Questions"}>
            <div style={{height:'100%', position:'relative', top:'-100%', marginBottom:'-100%'}}>
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
