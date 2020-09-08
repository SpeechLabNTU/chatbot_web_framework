import React from 'react';
import QuestionsTable from "./QuestionsTable.jsx";

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

  const [checkboxes, setCheckboxes] = React.useState(temp)

  return (
    <React.Fragment>
      <QuestionsTable
      rows = {rows}
      columns = {columns}
      checkboxes = {checkboxes}
      setCheckboxes = {setCheckboxes}
      />
    </React.Fragment>
  )
}
