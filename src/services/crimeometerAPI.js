import React from 'react';
import axios from 'axios';

//Evaluation key - you should change this for the api key provided
const crimeometerKey = 'k3RAzKN1Ag14xTPlculT39RZb38LGgsG8n27ZycG'

const crimeometerAPI = axios.create({
    baseURL: 'https://api.crimeometer.com',
    headers: {
        'content-type' : 'application/json',
        'x-api-key' : crimeometerKey
      }
    });
const crimeometerURI = 'https://api.crimeometer.com';
export {crimeometerKey, crimeometerAPI, crimeometerURI};