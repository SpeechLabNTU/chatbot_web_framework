import React, { Component } from 'react'
import './Record.css'
import './recorder'
import axios from 'axios'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import LinearProgress from '@material-ui/core/LinearProgress';


const textField={width:'auto'};
const buttonStyle={width:'50%'}

export default class Record extends Component {
  constructor (props) {
    super(props)
    this.state = {
      browserSupported: true,
      recorder: {},
      recordInterval: 0,
      isRecording: false,
      stopRecording: true,
      service: 'record',
      start: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount () {
    await this.recorderWithoutCanvas()

    // this.props.socket.on('stream-close', () => {
    //  this.cancel()
    // })
  }

  componentWillUnmount() {
    // cancel recorder from browser
    // window.cancelAnimationFrame(this.drawVisual)
    if (this.state.browserSupported){
      const track = this.mediaStream.getTracks()[0]
      track.stop()
      // Closes the audio context, releasing any system audio resources that it uses.
      this.audioCtx.close()
      this.cancel() // cancel stream
    }
  }


  async recorderWithoutCanvas () {

    if (!navigator.mediaDevices) {
      console.log('browser doesn\'t support')
      this.setState({browserSupported:false})
      this.props.setState({
        transcription:"Media input is not support on this browser"
      })

    } else if (navigator.mediaDevices.getUserMedia) {

      console.log('getUserMedia supported.')

      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      let source

      const constraints = { audio: true }
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

        source = this.audioCtx.createMediaStreamSource(this.mediaStream)
        this.audioStream = source
        window.source = source

        // -------IMPORTANT------
        // eslint-disable-next-line no-undef
        const recorder = new Recorder(source, { workerPath: '/recorderWorker.js' })
        this.setState({
          recorder
        })
      } catch (e) {
        console.log('The following error occured: ' + e)
        // this.$emit('onError', e.toString())
        this.setState({browserSupported:false})
        this.props.setState({
          transcription:"Media input is not possible"
        })
      }
    } else {
      // this.$emit('onError', 'getUserMedia not supported on your browser!')
      console.log('getUserMedia not supported on your browser!')
    }
  }

  async prepare () {
    this.canvas = document.querySelector('.visualizer')
    this.canvasCtx = this.canvas.getContext('2d')
    // const intendedWidth = document.querySelector('.visualizer-container').clientWidth
    const intendedWidth = 500
    this.canvas.setAttribute('width', intendedWidth)
    this.canvas.setAttribute('height', 200)

    if (intendedWidth / 2 < 500) {
      this.canvas.style.width = intendedWidth + 'px'
    } else {
      this.canvas.style.width = (intendedWidth / 2) + 'px'
    }

    this.canvas.style.height = '100px'

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    let source

    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.minDecibels = -90
    this.analyser.maxDecibels = -10
    this.analyser.smoothingTimeConstant = 0.85

    const distortion = this.audioCtx.createWaveShaper()
    const gainNode = this.audioCtx.createGain()
    const biquadFilter = this.audioCtx.createBiquadFilter()
    const convolver = this.audioCtx.createConvolver()

    if (!navigator.mediaDevices) {
      console.log('browser doesn\'t support')
      // this.$emit('onError', 'Your browser doesn\'t support audio recorder. Make sure you grant permission for recording audio and your browser is running with HTTPS')
    }

    if (navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.')
      const constraints = { audio: true }
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

        source = this.audioCtx.createMediaStreamSource(this.mediaStream)
        this.audioStream = source
        // Firefox loses the audio input stream every five seconds
        // To fix added the input to window.source
        window.source = source
        source.connect(distortion)
        distortion.connect(biquadFilter)
        biquadFilter.connect(gainNode)
        convolver.connect(gainNode)
        gainNode.connect(this.analyser)
        this.analyser.connect(this.audioCtx.destination)
        this.audioCtx.resume()
        this.visualize()

        // -------IMPORTANT------
        // eslint-disable-next-line no-undef
        const recorder = new Recorder(source, { workerPath: '/recorderWorker.js' })
        this.setState({
          recorder
        })
      } catch (e) {
        console.log('The following error occured: ' + e)
        // this.$emit('onError', e.toString())
      }
    } else {
      // this.$emit('onError', 'getUserMedia not supported on your browser!')
      console.log('getUserMedia not supported on your browser!')
    }
  }

  visualize () {
    this.analyser.fftSize = 32768
    this.bufferLength = this.analyser.fftSize
    this.dataArray = new Uint8Array(this.bufferLength)

    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.draw()
  }

  draw = () => {
    this.drawVisual = requestAnimationFrame(this.draw)

    this.analyser.getByteTimeDomainData(this.dataArray)

    this.canvasCtx.fillStyle = '#f7fafc'
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.canvasCtx.lineWidth = 2
    this.canvasCtx.strokeStyle = '#007aff'

    this.canvasCtx.beginPath()

    const sliceWidth = this.canvas.width * 1.0 / this.bufferLength
    let x = 0

    for (let i = 0; i < this.bufferLength; i++) {
      const v = this.dataArray[i] / 128.0
      const y = v * this.canvas.height / 2

      if (i === 0) {
        this.canvasCtx.moveTo(x, y)
      } else {
        this.canvasCtx.lineTo(x, y)
      }

      x += sliceWidth
    }

    this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2)
    this.canvasCtx.stroke()
  }

  // -------IMPORTANT------
  // Function below
  start = async () => {

    try {
      if (this.props.isBusy) {
        return
      }

      this.props.reset()

      await axios.post(`${this.props.backendUrl}/stream/${this.state.service}`, {
        socketid: this.props.socket.id,
      })

      const recordInterval = setInterval(() => {
        this.state.recorder.export16kMono((blob) => {
          if (this.props.isSocketReady) {
            this.props.socket.emit('stream-input', blob)
          }
          this.state.recorder.clear()
        }, 'audio/x-raw')
      }, 250)

      // set a limit on how long user can speak for
      const maxTimeout = setTimeout(() => {
        if (this.state.start) {
          this.stop()
          setTimeout(() => {
            this.props.setState({
              transcription: "Stopped: 2 minute maximum stream duration reached"
            })
          },1000)
          // delay in set text to allow buffer for last message from backend
        }
      }, 120000)
      // 2 min maximum as google api will raise error if streaming for too long

      this.setState({
        recordInterval,
        maxTimeout
      })

      // Start recording
      this.setState({start:true})
      this.state.recorder.record()
      this.props.setBusy()
      this.setState({
        isRecording: true,
        stopRecording: false
      })
    } catch (err) {
      console.log(err)
    }
  }

  // -------IMPORTANT------
  // Function below
  stop = () => {
    this.setState({start:false})

    clearInterval(this.state.recordInterval)
    clearTimeout(this.state.maxTimeout)
    // Stop recording
    if (this.state.recorder) {
      this.state.recorder.stop()
      this.setState({
        isRecording: false,
        stopRecording: true,
      })
      // Push the remaining audio to the server
      this.state.recorder.export16kMono((blob) => {
        if (this.props.isSocketReady) {
          this.props.socket.emit('stream-stop', blob)
        }
        this.state.recorder.clear()
      }, 'audio/x-raw')
      // this.props.reset()
    } else {
      this.$emit('onError', 'Recorder undefined')
    }
  }

  // -------IMPORTANT------
  // Function below
  cancel = () => {
    // Stop the regular sending of audio (if present)
    clearInterval(this.state.recordInterval)

    if (this.state.recorder) {
      this.state.recorder.stop()
      this.state.recorder.clear()
      if (this.props.isSocketReady) {
        this.props.socket.emit('stream-cancel')
      }
    }
  }

  handleChange(e){
    let option = e.target.value
    this.setState({service: option})

  }

  render () {
    return (
      <div>
      <FormControl fullWidth variant="outlined">
      <TextField
      style={textField}
      id="filled-read-only-input"
      label="Read"
      value={this.props.transcription + ' ' + this.props.partialResult}
      InputProps={{
        readOnly: true,
      }}
      variant="filled"
      name="input"
      multiline
      />

      {this.state.start &&
        <LinearProgress color="secondary" />}

      <ButtonGroup variant="contained">
        <Button
        style={buttonStyle}
        color="primary"
        onClick={this.start}
        disabled={!this.state.browserSupported || this.state.isRecording}
        >Start
        </Button>
        <Button
        style={buttonStyle}
        color="secondary"
        onClick={this.stop}
        disabled={!this.state.browserSupported || this.state.stopRecording}
        >Stop
        </Button>
      </ButtonGroup>

      <RadioGroup aria-label="position" name="position" value={this.state.service} onChange={this.handleChange} row>
        <FormControlLabel
        disabled={this.state.start && this.state.service === 'google'}
        value="record"
        label="AISG"
        control={<Radio color="primary" />}
        />
        <FormControlLabel
        disabled={this.state.start && this.state.service === 'record'}
        value="google"
        label="Google"
        control={<Radio color="primary" />}
        />
      </RadioGroup>

      </FormControl>
      </div>
    )
  }
}
