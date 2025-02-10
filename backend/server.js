// 127.0.0.1:3000/api

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
fetch = require('node-fetch');
const mongoose = require('mongoose');
const cheerio = require('cheerio');


app.get('/api/helloworld', (req, res) => {
  res.send('Hello, world! Soy el servidor para el backend de la app de destinos turísticos');
});

// GET LIST OF RECOMMENDED TRAVEL DESTINATIONS
// parameter amount: how many recommended to travel destinations to get (default 10)
app.get('/api/recommended', async (req, res) => {
  const amount = req.query.amount !== undefined ? req.query.amount : 10;
  
  const collection = mongoose.connection.collection('destinations');
  destinations = await collection.aggregate([
    {$match: {img: {$ne: null}, desc: {$ne: "description not available"}}},
    {$sample: {size: 10}}
    ]).toArray();

  const searches = mongoose.connection.collection('searches');

  for (let i = 0; i < destinations.length; i++){
    let result = await searches.findOne({destination: destinations[i].name});
    destinations[i].original_search = result ? result.search : null;
  }

  json = JSON.stringify(destinations)
  res.send(json)
});


// GET LIST OF TRAVEL DESTINATIONS CLOSE TO LOCATION
// parameter geoname: name of country, city, or location
// parameter radius: in kilometers,by default 20
app.get('/api/proximity', async (req, res) => {
  const name = req.query.name;
  const radiusKilometers = req.query.radius !== undefined ? req.query.radius : 20;
  
  if (name == undefined) {
    res.send('error:parameter name needs to be defined');
    return;
  }
  
  // make the api call
  key = '5ae2e3f221c38a28845f05b620ed4ce73ce20410cf979603b92f6d57';
  url = 'http://api.opentripmap.com/0.1/en/places/geoname?name=' + name + '&apikey=' + key;
  let data = await fetch(url).then(response => response.json())
  if (data.status == "NOT_FOUND" || data == undefined){
    res.status(404).send("El geonombre introducido no existe");
    return;
  }

  let latitude = data.lat;
  let longitude = data.lon;
  let country = data.country;
  
  // use the radius api to get a list worth destinations close to those coordinates
  url = 'http://api.opentripmap.com/0.1/en/places/radius?radius=' 
  + radiusKilometers * 1000 + '&lat=' + latitude + '&' + 'lon=' + longitude + '&apikey=' + key + '&rate=3h';
  data = await fetch(url).then(response => response.json()).catch(error => console.log('error'));

  // start building the result object
  result = {geoname: name, country: country, destinations:[]};
  
  if (data.features == undefined){
    res.send(JSON.stringify(result));
    return;
  }

  data.features.forEach(feature => {
    let destination = {
      name: feature.properties.name,
      xid: feature.properties.xid,
      categories: feature.properties.kinds
    };
    if (destination.name != "")
      result.destinations.push(destination);

      // Se añade la búsqueda original que dió lugar al destino
      const searches = mongoose.connection.collection('searches');
      searches.insertOne({search: name, destination: destination.name});
  });
    
  res.send(JSON.stringify(result));
});




// GET PROPERTIES FOR A DESTINATION
// parameter xid: xid
app.get('/api/properties', async (req, res) => {
  const xid = req.query.xid;
  if (xid == undefined) {
    res.send('error: you need to specify xid');
  }
  
  // check if the given xid is in the database
  const destinations = mongoose.connection.collection('destinations');
  let result = await destinations.findOne({xid:xid});
  console.log('result from the database:', result);
  
  if (result == null) {
    console.log('making a call to the api');
    // make a request to the api
    key = '5ae2e3f221c38a28845f05b620ed4ce73ce20410cf979603b92f6d57';
    let url = 'http://api.opentripmap.com/0.1/en/places/xid/' + xid + '?apikey=' + key;
    let data = await fetch(url).then(response => response.json()).catch(error => console.log(error));

    if (data == null || data == undefined)
      res.send("El xid no se encuentra en la API de búsqueda");

    if (data.image != null && data.image != undefined){
      let html = await fetch(data.image).then(response => response.text());
      const $ = cheerio.load(html);
      const link = $('#file').children().first().attr('href');
      data.image = link;
      console.log(link);
    }

    result = {
      xid: data.xid,
      name: data.name,
      country: data.address.country,
      wiki: data.wikipedia,
      img: data.image,
      desc: data.wikipedia_extracts == undefined ? "description not available" : data.wikipedia_extracts.text,
      lat: data.point.lat,
      long: data.point.lon,
      category: data.kinds
    };
    destinations.insertOne(result);
  }
  
  res.send(JSON.stringify(result));
});





console.log('Starting to try to connect to the database');
mongoUrl = 'mongodb+srv://root:example@cluster0.asotgsd.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoUrl,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the database');
  // start the server
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
}).catch(error => {
  console.error('Error connecting to the data base');
  console.error('nature of the error:', error);
});

