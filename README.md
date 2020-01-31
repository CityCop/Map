
# Map visualization example of crime incidents using Crimeometer API 

For this project we use [deck.gl](https://deck.gl) library

## Requirements

* Node 10.8.0
* Git

Without any changes, this app is connected to `raw-data` endpoint and is using a limited evaluation API key `k3RAzKN1Ag14xTPlculT39RZb38LGgsG8n27ZycG`. This API key is limited in the information received from the API, for example it does not return the type of incident. We recommend that you replace and use a private API key to realize the full potential of the API.

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/CityCop/Map
cd Map
```

```bash
npm install
```

To start node.js server, run the following

```bash
npm start
```

Open [http://localhost:8080](http://localhost:8080) and take a look around.
