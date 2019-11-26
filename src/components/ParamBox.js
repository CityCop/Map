import { Slider, InputAdornment, Typography, Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';
import { grey } from '@material-ui/core/colors';

//37.7575756,-122.5076424 - san francisco

class ParamBox extends React.Component {
  constructor(props) {
    super(props);
    let today = new Date();
    this.state = {
      minimized: false,
      startDate: new Date(today.getTime() - 30 * 86400000),
      endDate: today,
      miles: 10,
      lat: 41.8334705,
      long: -87.7320425,
    }
  }
  handleDateChange = (date, when) => {
    this.setState({
      [`${when}`]: date
    })
  }
  handleMilesChange = (val) => {
    let miles = ''
    if (val !== '') {
      miles = Number(val);
      if (miles > 50) miles = 50;
      if (miles < 1) miles = 1
    }
    this.setState({ miles })
  }
  handlePinPointChange = (lat, long) => {
    if (lat === '') {
      this.setState({ long })
    } else if (long === '') {
      this.setState({ lat })
    }
  }

  render() {
    if (this.state.minimized) {
      return (<div style={minimizedStyle}>
         <Button style={{ padding: 0, fontSize: 10 }} onClick={() => this.setState({ minimized: false })}>
        Open
      </Button>

      </div>
      
      
      )
    } else {
      return (
        <div style={containerStyle}>
          <div style={rowStyle} >
            <Typography style={{marginBottom: 20, fontWeight: 600}} >
              Crime Incidents
            </Typography>

           

            <Button style={{marginBottom: 20, textAlign: 'right',fontSize: 10}}
            onClick={() => this.setState({ minimized: true })}>

            
        Close
      </Button>
      
          </div>

          <div style={{ display: 'table', width: '100%' }}>
              <div style={{display: 'table-cell', background: 'rgb(1, 152, 189)', width: '16.6667%', height: '12px'}}></div>
              <div style={{display: 'table-cell', background: 'rgb(73, 227, 206)', width: '16.6667%', height: '12px'}}></div>
              <div style={{display: 'table-cell', background: 'rgb(216, 254, 181)', width: '16.6667%', height: '12px'}}></div>
              <div style={{display: 'table-cell', background: 'rgb(254, 237, 177)', width: '16.6667%', height: '12px'}}></div>
              <div style={{display: 'table-cell', background: 'rgb(254, 173, 84)', width: '16.6667%', height: '12px'}}></div>
              <div style={{display: 'table-cell', background: 'rgb(209, 55, 78)', width: '16.6667%', height: '12px'}}></div>
              </div>
            <div style={{ display: 'table', width: '100%', marginBottom: '20px' }}>
            <span style={{display: 'table-cell', width: '50%', fontSize: '12px', color: grey}}>Fewer</span>
            <span style={{display: 'table-cell', fontSize: '12px', color: grey, textAlign: 'right'}}>More</span>
            </div>

           
          <div style={rowStyle} >
            <Typography>
              Latitude
            </Typography>
            <Input
              style={{ width: '40%', marginBottom: 20 }}
              value={this.state.lat}
              onChange={(event, value) => { this.handlePinPointChange(event.target.value, '') }}
              inputProps={{
                min: -90,
                max: 90,
                type: 'number',
              }}
            />
          </div>
          <div style={rowStyle} >
            <Typography>
              Longitude
            </Typography>
            <Input
              style={{ width: '40%', marginBottom: 20 }}
              value={this.state.long}
              onChange={(event, value) => { this.handlePinPointChange('', event.target.value) }}
              inputProps={{
                min: -180,
                max: 180,
                type: 'number',
              }}
            />
          </div>
          <Typography gutterBottom>
            Radius
          </Typography>
          <div style={rowStyle} >
            <Slider
              style={{ width: '70%', marginBottom: -10, marginRight: 20 }}
              value={this.state.miles}
              onChange={(event, value) => { this.setState({ miles: value }) }}
              valueLabelDisplay="auto"
              aria-labelledby="input-slider"
              min={1}
              max={50}
              marks={[{ value: '1', label: '1' }, { value: '50', label: '50' }]}
            />
            <Input
              style={{ width: '20%', marginBottom: 20 }}
              value={this.state.miles}
              onChange={(event, value) => { this.handleMilesChange(event.target.value) }}
              endAdornment={<InputAdornment position="end">mi</InputAdornment>}
              inputProps={{
                min: 0,
                max: 1000,
                type: 'number',
              }}
            />
          </div>
          <MuiPickersUtilsProvider style={{ position: 'absolute', bottom: 0 }} utils={MomentUtils}>
            <KeyboardDatePicker
              style={{ marginTop: 15, marginBottom: 15 }}
              autoOk
              variant="inline"
              inputVariant="outlined"
              label="From"
              format="YYYY/DD/MM"
              value={this.state.startDate}
              InputAdornmentProps={{ position: "start" }}
              onChange={(date) => this.handleDateChange(date, 'startDate')}
            />
            <KeyboardDatePicker
              style={{ marginTop: 15, marginBottom: 15 }}
              autoOk
              variant="inline"
              inputVariant="outlined"
              label="To"
              format="YYYY/DD/MM"
              value={this.state.endDate}
              InputAdornmentProps={{ position: "start" }}
              onChange={date => this.handleDateChange(date, 'endDate')}
            />
          </MuiPickersUtilsProvider>

            <Button variant="contained" color="primary" style={buttonStyle} 
            onClick={() => this.props.submitParams(this.state.startDate, this.state.endDate, this.state.miles, this.state.lat, this.state.long)}>Refresh
            </Button>
        </div>
      );
    }
  }
}

const containerStyle = {
  position: 'absolute',
  zIndex: '500',
  left: 0,
  bottom: 0,
  width: screen.width / 5,
  backgroundColor: '#F0F0F0',
  padding: 30,
  paddingBottom: 10,
  margin: 40,
  border: '1px outset #000'
}

const buttonStyle = {
  marginTop:20,
  float: 'right'
}

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
}
const minimizedStyle = {
  position: 'absolute',
  zIndex: '500',
  left: 0,
  bottom: 0,
  width: screen.width / 5,
  backgroundColor: '#F0F0F0',
  padding: 10,
  margin: 20,
  border: '1px outset #000'
}


export default ParamBox;