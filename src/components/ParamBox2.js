import { Typography, Button, Select, Switch } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import {  makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';
import { grey } from '@material-ui/core/colors';

const cities = [
  {name: 'San Francisco', latitude: '37.787933', longitude: '-122.4096868', radius: '20'},
  {name: 'Chicago', latitude: '41.8334705', longitude: '-87.7320425', radius: '20'},
  {name: 'Austin', latitude: '30.272593', longitude: '-97.719811', radius: '15'},
 // {name: 'Los Angeles', latitude: '34.038720', longitude: '-118.248119', radius: '40'},
  {name: 'New York', latitude: '40.722482', longitude: '-73.976784', radius: '20'}
]; 

class ParamBox extends React.Component {
  constructor(props) {
    super(props);
    let today = new Date();
    let {miles, long, lat, name, incidents} = this.props.controlledParams
    this.state = {
      minimized: false,
      startDate: new Date(today.getTime() - 30 * 86400000),
      endDate: today,
      miles,
      long,
      lat,
      name,
      incidents,
      switch: false,
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    let {incidents} = this.props.controlledParams
    if (incidents !== prevProps.controlledParams.incidents) {
      this.setState({incidents});
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
  handlePinPointChange = (lat, long, name) => {
      this.setState({ lat, long, name })
  }

  handleToggleSwitch = () => {
    this.setState({switch: !this.state.switch})
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
            <Button style={{marginBottom: 20, textAlign: 'right',fontSize: 10, marginRight: 0}}
            onClick={() => this.setState({ minimized: true })}>
              Close
            </Button>
          </div>
          <div style={rowStyle} >
            <Typography style={{marginBottom: 15, paddingTop:8}} >
              Heatmap Layout
            </Typography>
            <Switch
              checked={this.state.switch}
              onChange={this.handleToggleSwitch}
              value={this.state.switch}
              color="primary"
            />
            <Typography style={{marginBottom: 15, paddingTop:8}} >
              Hexagons Layout
            </Typography>
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
            
       {<Select style={selectStyle} id="select" value={this.state.name} onChange={(e) => {
          for (let city in cities){
            let {longitude, latitude, name} = cities[city]
            if (name === e.target.value){
              this.handlePinPointChange(latitude, longitude, name)
            }
          }
        }}>
            {cities.map(item =>  <option key={item.name} value={item.name}>{item.name}</option>)}
          </Select>}
          {/* <div style={rowStyle2} >
            <Typography variant="subtitle2">
              Latitude
            </Typography>
            <Input
              style={{ width: '40%', marginBottom: 10, fontSize: '12px'}}
              value={this.state.lat}
              readOnly
              inputProps={{
                min: -90,
                max: 90,
                type: 'number',
              }}
            />
          </div>
          <div style={rowStyle2} >
            <Typography variant="subtitle2">
              Longitude
            </Typography>
            <Input
              style={{ width: '40%', marginBottom: 10, fontSize: '12px' }}
              value={this.state.long}
              readOnly
              inputProps={{
                min: -180,
                max: 180,
                type: 'number',
              }}
            />
          </div> */}
          {/* <Typography gutterBottom>
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
          </div> */}
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
              style={{ marginTop: 15, marginBottom: 35 }}
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

            <Typography style={{marginBottom: 5, fontSize: '12px'}} >
              INCIDENTS
            </Typography>
            <Typography style={{marginBottom: 10, fontWeight: 600}} >
              {this.state.incidents}
            </Typography>
            <Button variant="contained" color="primary" style={buttonStyle} 
            onClick={() => this.props.submitParams(this.state.startDate, this.state.endDate, this.state.miles, this.state.lat, this.state.long, this.state.switch)}>Refresh
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
  //height: auto,
  width: screen.width / 5,
  backgroundColor: '#F0F0F0',
  padding: 20,
  paddingBottom: 10,
  margin: 40,
  border: '1px outset #000'
}

const buttonStyle = {
  //marginTop:20,
  float: 'right'
}

const selectStyle = {
  marginBottom: 15,
  width: '170px'
}

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
}

const rowStyle2 = {
  display: 'flex',
  justifyContent: 'space-between',
  marginRight: 40
}

const minimizedStyle = {
  position: 'absolute',
  zIndex: '500',
  left: 0,
  bottom: 0,
  //height: screen.height / 20,
  width: screen.width / 5,
  backgroundColor: '#F0F0F0',
  padding: 10,
  margin: 20,
  border: '1px outset #000'
}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    marginTop: 20,
    float: right
  },
  input: {
    display: 'none',
  },
}));


export default ParamBox;