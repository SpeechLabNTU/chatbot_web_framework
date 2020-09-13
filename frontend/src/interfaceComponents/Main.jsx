import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Questions from "./Questions.jsx";

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
  },
  sideIcon: {
    marginRight: 10,
  },
  test: {
    fontWeight: 'bold',
  }
}));


export default function Main(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [currentTopic, setCurrentTopic] = React.useState("babybonus")
  const [currentContext, setCurrentContext] = React.useState('Questions')
  const [isTopicMenuOpen, setIsTopicMenuOpen] = React.useState(false)
  const topicAnchorRef = React.useRef(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleContextChange = (context) => {
    setCurrentContext(context)
  }

  const drawer = (
    <React.Fragment>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem key={"Topics"} >
          <ListItemText primary={"Topics"} primaryTypographyProps={{variant: 'h6'}} />
        </ListItem>
        <ListItem button key={currentTopic} ref={topicAnchorRef} onClick={()=>{setIsTopicMenuOpen((prev)=>!prev)}}>
          <ListItemText primary={currentTopic} />
          <ArrowDropDownIcon />
        </ListItem>
        <Popper open={isTopicMenuOpen} anchorEl={topicAnchorRef.current} transition>
        { ({TransitionProps, placement }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
          <Paper>
          <ClickAwayListener onClickAway={()=>{setIsTopicMenuOpen(false)}}>
          <MenuList autoFocusItem={isTopicMenuOpen}>
            <MenuItem>1432</MenuItem>
          </MenuList>
          </ClickAwayListener>
          </Paper>
          </Grow>
        )}
        </Popper>
      </List>
      <Divider />
      <List>
        <ListItem button key={"Questions"} onClick={()=>handleContextChange("Questions")}>
          <QuestionAnswerIcon className={classes.sideIcon}/>
          <ListItemText primary={"Questions"} />
        </ListItem>
        <ListItem button key={"Trained Models"} onClick={()=>handleContextChange("Trained Models")}>
          <ListItemText primary={"Trained Models"} />
        </ListItem>
        <ListItem button key={"Deployments"} onClick={()=>handleContextChange("Deployments")}>
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
            onClick={handleDrawerToggle}
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
            onClose={handleDrawerToggle}
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
          <Fade in={currentContext==="Questions"}>
            <Questions />
          </Fade>
      </main>
    </div>
  )
}
