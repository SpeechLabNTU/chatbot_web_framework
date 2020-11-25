import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import axios from "axios";

import Container from '@material-ui/core/Container';

import LogoHeaders from './components/LogoHeaders';
import MassChatbotComparison from "./MassChatbotComparison";
import AudioTranscriptionComparison from "./AudioTranscriptionComparison";
import MultiChatbotInterface from "./MultiChatbotInterface";

import ReactTab from "react-bootstrap/Tab"
import ReactTabs from "react-bootstrap/Tabs"


export default function Dashboard(props) {

  const theme = useTheme()

  const backendURL = process.env.REACT_APP_API

  // API calls for various chatbots
  const askJamieAPI = params => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/jamie/api/askJamieFast`, params)
        .then((res) => {
          resolve(res.data.reply)
        })
        .catch(error => {
          console.log("Error contacting Ask Jamie")
        });
    })
  }

  const dialogAPI = params => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/dialog/api/dialogflow`, params)
        .then((res) => {
          resolve(res.data.reply)
        })
        .catch(error => {
          console.log("Error contacting Dialogflow")
        });
    })
  }

  const miclAPI = params => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/micl/api/directQuery`, params)
        .then((res) => {
          resolve(res.data.reply)
        })
        .catch(error => {
          console.log("Error contacting MICL server")
        })
    })
  }

  const rajatAPI = params => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/rajat/api/queryEndpoint`, params)
        .then((res) => {
          resolve(res.data.reply)
        })
        .catch(error => {
          console.log("Error contacting Rajat server")
        })
    })
  }

  const rushiAPI = params => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/rushi/api/queryEndpoint`, params)
        .then((res) => {
          resolve(res.data.reply)
        })
        .catch(error => {
          console.log("Error contacting Rushi server")
        })
    })
  }

  const baniAPI = params => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/bani/api/queryEndpoint`, params)
        .then((res) => {
          resolve(res.data.reply)
        })
        .catch(error => {
          console.log("Error contacting Bani server")
        })
    })
  }

  const similarQuestionsAPI = params => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/bani/api/queryEndpoint`, params)
        .then((res) => {
          resolve(res.data.similarQuestions)
        })
        .catch(error => {
          console.log("Error contacting Bani server")
        })
    })
  }

  // for response comparisons
  const makeResponseComparisonRequest = (params) => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/similarity/cosineSimilarity`, params)
        .then((res) => {
          let probability = res.data.reply
          if (probability !== -1) {
            resolve(probability)
          }
        }).catch(error => {
          reject("Error Contacting API server")
          console.log("Error Contacting API server")
        })
    })
  }

  return (
    <React.Fragment>
      <Container maxWidth="lg" style={{ paddingBottom: theme.spacing(6) }}>

        <LogoHeaders />

        <ReactTabs defaultActiveKey="dashboard" id="uncontrolled-tab-example">

          {/* Multi-Chatbot Interface */}
          <ReactTab eventKey="dashboard" title="Multi-Chatbot Interface">
            <MultiChatbotInterface
              backendURL={backendURL}
              askJamieAPI={askJamieAPI}
              dialogAPI={dialogAPI}
              miclAPI={miclAPI}
              rajatAPI={rajatAPI}
              rushiAPI={rushiAPI}
              baniAPI={baniAPI}
              similarQuestionsAPI={similarQuestionsAPI}
              makeResponseComparisonRequest={makeResponseComparisonRequest}
            />

          </ReactTab>

          {/* Performance Analysis */}
          <ReactTab eventKey="chart" title="Performance Analysis">
            <MassChatbotComparison
              askJamieAPI={askJamieAPI}
              dialogflowAPI={dialogAPI}
              miclAPI={miclAPI}
              rajatAPI={rajatAPI}
              rushiAPI={rushiAPI}
              baniAPI={baniAPI}
            />
          </ReactTab>

          {/* Transcription Comparison */}
          <ReactTab eventKey="audio" title="Transcription Comparison">
            <AudioTranscriptionComparison
              backendUrl={backendURL}
            />
          </ReactTab>
        </ReactTabs>

      </Container>
    </React.Fragment>
  )
}
