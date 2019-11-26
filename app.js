/* global window */
import React, { Component } from 'react';
import { render } from 'react-dom';
import MapLayout from './src/MapLayout';

// Set your mapbox token here

/* eslint-disable react/no-deprecated */
export class App extends Component {
  render() {
    return <MapLayout />
  }
}
export function renderToDOM(container) {
  render(<App/>, container);
}


