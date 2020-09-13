import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import QuestionsTable from "./QuestionsTable.jsx";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SearchIcon from '@material-ui/icons/Search';
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';



const useStyles = makeStyles((theme) => ({
  editBar: {
    marginBottom: theme.spacing(2),
    height: 50,
    display: "flex",
    justifyContent: "flex-end",

  },
  button: {
    margin: "10px"
  },
  topBarPaper: {
    marginBottom: theme.spacing(2),
    height: 60,
    width: '100%',
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  barItems: {
    margin: 30,
  },
  searchBar: {
    marginBottom: theme.spacing(2),
    display: "flex",
    height: 50,
    alignItems: "center",
  }
}))
const sample = [
  ["What"],
  ["Who"],
  ["why"],
  ["How"],
  ["Where"],
];

function createData(id, question) {
  return { id, question };
}

const rows = [];
const temp = [];

for (let i = 0; i < 200; i += 1) {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  rows.push(createData(i, ...randomSelection));
  temp.push(false)
}

var columns = [
  {
    minWidth: 50,
    width: 50,
    label: '',
    dataKey: 'id',
  },
  {
    width: 500,
    flexGrow: 1,
    label: 'Questions',
    dataKey: 'question',
  },
]

export default function Questions(props) {

  const classes = useStyles()
  const [data, setData] = React.useState(rows)
  const [searchValue, setSearchValue] = React.useState("")
  const [searchData, setSearchData] = React.useState(undefined)
  const [checkboxes, setCheckboxes] = React.useState(temp)
  const [showEditBar, setShowEditBar] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuAnchorRef = React.useRef(null)

  React.useEffect( ()=>{
    if (checkboxes.includes(true)) setShowEditBar(true)
    else setShowEditBar(false)
  }, [checkboxes]
  )

  const handleDeleteButton = () => {
    let tempData = []
    let temp = []
    let i = 0
    checkboxes.map( (val, idx) => {
      if (!val) {
        tempData.push(data[idx])
        tempData[i].id=i
        temp.push(false)
        i++
      }
      return undefined
    })
    setData(tempData)
    setCheckboxes(temp)
  }

  const handleSearch = (e) => {
    let value = e.target.value.toLowerCase()
    setSearchValue(value)
    if (value === "") {
      setSearchData(undefined)
    }
    else {
      let temp = []
      data.forEach((val) => {
        let q = val.question.toLowerCase()
        if (q.search(value) !== -1) {
          temp.push(val)
        }
      })
      setSearchData(temp)
    }
  }

  return (
    <div {...props}>
      <Paper className={classes.topBarPaper}>
        <Typography variant='h5' className={classes.barItems}>Questions</Typography>
        <div className={classes.barItems}>
          <Button variant="contained" color="primary">
          Add Question
          </Button>

          <IconButton ref={menuAnchorRef} onClick={()=>setIsMenuOpen((prev)=>!prev)}>
          <MoreHorizIcon/>
          </IconButton>

          <Popper open={isMenuOpen} anchorEl={menuAnchorRef.current} transition>
          { ({TransitionProps, placement }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
            <Paper>
            <ClickAwayListener onClickAway={()=>{setIsMenuOpen(false)}}>
            <MenuList autoFocusItem={isMenuOpen}>
              <MenuItem>Upload Questions</MenuItem>
              <MenuItem>Delete All</MenuItem>
            </MenuList>
            </ClickAwayListener>
            </Paper>
            </Grow>
          )}
          </Popper>
        </div>
      </Paper>

      { !showEditBar ?
      <Fade in={!showEditBar}>
        <Paper className={classes.searchBar}>
        <div className={classes.barItems}>
        <SearchIcon />
        </div>
        <InputBase
        placeholder="Search questions"
        onChange={handleSearch}
        value={searchValue}
        />
        </Paper>
      </Fade>
      :
      <Fade in={showEditBar}>
        <div className={classes.editBar}>
          <Button variant="contained" className={classes.button}
          onClick={handleDeleteButton}>
          Delete
          </Button>
          <Button variant="contained" className={classes.button}
          onClick={ () => setCheckboxes(checkboxes.map(() => (false))) }
          >
          Cancel
          </Button>
        </div>
      </Fade>
      }

      <QuestionsTable
      rows = {searchData ? searchData : data}
      columns = {columns}
      checkboxes = {checkboxes}
      setCheckboxes = {setCheckboxes}
      />
    </div>
  )
}
