import React from 'react';
import {StaticMap, FlyToInterpolator} from 'react-map-gl';
import {PhongMaterial} from '@luma.gl/core';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {HexagonLayer, HeatmapLayer} from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import { ObtainData } from './core/DataRetriever'
import ParamBox from './components/ParamBox2';
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWRvdHRpIiwiYSI6InJhVDA4ckUifQ.tNOPsPbZBO-YL5vRAWPgYg'; // eslint-disable-line

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = new PhongMaterial({
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
});

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

const elevationScale = {min: 1, max: 3};


class MapLayout extends React.Component {

  static get defaultColorRange() {
    return colorRange;
  }

  constructor(props) {
    super(props);
    this.state = {
      hoveredObject: null,
      mode: 'heatmap',
      elevationScale: elevationScale.min,
      break: false,
      miles: 20,
      lat: 37.787933,
      long: -122.4096868,
      startDate: new Date(new Date() - 30*86400000),
      endDate: new Date(),
      incidents: 0,
      name: "San Francisco",
      viewState: {
        latitude: 37.787933,
        longitude: -122.4096868,
        zoom: 11,
        minZoom: 5,
        maxZoom: 15,
        pitch: 40.5,
        bearing: 0,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator()
      }
    };
    this._onHover = this._onHover.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
    this._onViewStateChange = this._onViewStateChange.bind(this);

    this.startAnimationTimer = null;
    this.intervalTimer = null;

    this._startAnimate = this._startAnimate.bind(this);
    this._animateHeight = this._animateHeight.bind(this);

    this._group_incidents = this._group_type.bind(this);
    let {startDate, endDate, miles, lat, long} = this.state
    this.paging(startDate, endDate, miles, lat, long);
  }
  _onHover({x, y, object}) {
    console.log(object)
    this.setState({x, y, hoveredObject: object});
  }
  componentDidMount() {
    this._animate();
  }


/*
  componentWillReceiveProps(nextProps) {
    
    if (nextProps.data && this.props.data && nextProps.data.length !== this.props.data.length) {
      this._animate();
    }
  }
  */


  componentWillUnmount() {
    this._stopAnimate();
  }

  _animate() {
    this._stopAnimate();

    // wait 1.5 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 1500);
  }

  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 20);
  }

  _stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }

  _animateHeight() {
    if (this.state.elevationScale === elevationScale.max) {
      this._stopAnimate();
    } else {
      this.setState({elevationScale: this.state.elevationScale + 1});
    }
  }

  _renderLayers() {

    const ICON_MAPPING = {
      marker: {x: 0, y: 0, width: 1000, height: 1000, mask: true}
    };
    const {radius = 50, upperPercentile = 100, coverage = 1} = this.props;
    const {data, mode} = this.state
    let layer;
    if (mode === 'heatmap'){
      layer = new HeatmapLayer({
        id: 'heatmapLayer',
        colorRange,
        coverage : 100,
        data,
        elevationRange: [0, 1],
        elevationScale: this.state.elevationScale,
        extruded: true,
        getPosition: d => [d.longitude, d.latitude],
        opacity: 0.5,
        threshold: 0.2,
        radius: 10000,
        upperPercentile,
        material,
        intensity: 3,
        pickable: true,
        onHover: this._onHover
      });
    }else {
      layer = new HexagonLayer({
        id: 'hexagon-map',
        colorRange,
        coverage,
        data,
        elevationRange: [0, 1],
        elevationScale: this.state.elevationScale,
        extruded: true,
        getPosition: d => [d.longitude, d.latitude],
        opacity: 0.5,
        radius,
        upperPercentile,
        material,
        pickable: true,
        onHover: this._onHover
      })
    
    }
    return [
      layer
    ];
      /*
      new ColumnLayer({
        id: 'column-layer',
        data : [{centroid: [-87.73204249999998, 41.83347049999998], value: 0.2}],
        diskResolution: 999,
        radius: 1609.34*this.state.miles,
        extruded: false,
        stroked: true,
        pickable: true,
        elevationScale: 1,
        getPosition: d => d.centroid,
        getFillColor: [83,126,197, 50],
        getLineColor: [0, 0, 0],
        getElevation: d => d.value,
      }),
      new IconLayer({
        id: 'icon-layer',
        data: [{ coordinates: [-87.73204249999998, 41.83347049999998]}],
        pickable: true,
        // iconAtlas and iconMapping are required
        // getIcon: return a string
        iconAtlas: pic,
        iconMapping: ICON_MAPPING,
        sizeScale: 15000,
        getPosition: d => d.coordinates,
        getSize: 500,
        getColor: [255, 255, 255],
        }
        
      }),*/
 
  }

  _group_type(rows){
    var occurences = rows.reduce(function (r, row) {
      r[row.ofense_dsc] = ++r[row.ofense_dsc] || 1;
      return r;
    }, {});
  
    var result = Object.keys(occurences).map(function (key) {
     return { key: key, value: occurences[key] };
    });

    return result;
    
  }


  _renderTooltip() {
    const {x, y, hoveredObject} = this.state;

    return (
      hoveredObject &&
       (
        <div className="tooltip" style={{top: y, left: x}}>
           <div>
            <b>Incident by type</b>
            <p></p>
            </div>
           <div>
              {
                this._group_type(hoveredObject.points).map(d=>{
                  return <div><span>{d.value}   {d.key}</span></div>
                })
               }
             </div>  
        </div>
      )
    );
  }
  reRender(data){
    this.setState({data})
  }
  paging = async (startDate, endDate, miles, lat, long) => {
    let page = 1;
    let res = await ObtainData(1, startDate, endDate, miles, lat, long);
    let dataRes = [];
    console.log(res)
    let incidents = res.total_incidents;
    if(incidents/1000 > 1){
      incidents = incidents/1000;
      incidents = incidents.toFixed(1) + 'k';
    }
    this.setState({break: false, incidents})
    if (res.total_pages === 0){
      this.setState({data: []})
    }
    while (res.total_pages >= page && !this.state.break) {
      dataRes = dataRes.concat(res.incidents)
      const data = dataRes.map(row => ({
        key: String(row.incident_code),
        id: String(row.incident_code),
        date: new Date(row.incident_date),
        latitude: Number(row.incident_latitude),
        longitude: Number(row.incident_longitude),
        offense: String(row.incident_offense),
        ofense_dsc: String(row.incident_offense_description)
      }));
      this.setState({data})
      page = page + 1
      res = await ObtainData(page, startDate, endDate, miles, lat, long);
    }
  }

  submitParams = async (startDate, endDate, miles, lat, long, mode) => {
    console.log(startDate)
    console.log(endDate)
    mode = !mode ? 'heatmap' :'hexagon-map';
    await this.setState({
      break: true,
      startDate,
      endDate,
      miles,
      lat,
      long, 
      mode,
      viewState: {
        ...this.state.viewState,
        latitude: Number(lat),
        longitude: Number(long),
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator()
      }
    })
    this.paging(startDate , endDate, miles, lat, long);
  }

  _onViewStateChange({viewState}) {
    this.setState({
      viewState
    });
  }

  render() {
    
    const {controller = true, baseMap = true} = this.props;
    let {viewState} = this.state
    return (
      <div>
     
      <ParamBox submitParams={this.submitParams} controlledParams={this.state}/>
        <DeckGL
          key={1}
          layers={this._renderLayers()}
          effects={[lightingEffect]}
          viewState={viewState}
          controller={controller} 
          onViewStateChange={this._onViewStateChange}
          
          >  
          {baseMap && (
            <StaticMap
              reuseMaps
              mapStyle="mapbox://styles/mapbox/dark-v9"
              preventStyleDiffing={true}
              mapboxApiAccessToken={MAPBOX_TOKEN}
            >
            </StaticMap>
          )}

          {this._renderTooltip}  

        </DeckGL>
      </div>
    );
  }
}

export default MapLayout;