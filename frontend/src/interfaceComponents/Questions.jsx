import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import QuestionsTable from "./QuestionsTable.jsx";

import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
  editBar: {
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",

  },
  button: {
    margin: "10px"
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
    width: 1600,
    label: 'Questions',
    dataKey: 'question',
  },
]

export default function Questions(props) {

  const classes = useStyles()
  const [data, setData] = React.useState(rows)
  const [checkboxes, setCheckboxes] = React.useState(temp)
  const [showEditBar, setShowEditBar] = React.useState(false)

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
      else {
        console.log(idx)
        console.log(data[idx])
      }
    })
    setData(tempData)
    setCheckboxes(temp)
  }

  return (
    <div {...props}>
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

      <QuestionsTable
      rows = {data}
      columns = {columns}
      checkboxes = {checkboxes}
      setCheckboxes = {setCheckboxes}
      />
    </div>
  )
}
