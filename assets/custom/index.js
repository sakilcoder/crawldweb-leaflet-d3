
const fetchText = async (url) => {
    const response = await fetch(url);
    return await response.text();
}
const csvUrl = 'assets/data/pois.csv';

let tempMarker;
let drawMarker = function (id, label, lat, lng) {
    let latlng = {
        lat: lat,
        lng: lng
    };
    if (tempMarker) {
        map.removeLayer(tempMarker);
    }
    tempMarker = L.marker(latlng, {
        icon: tempIcon
    }).addTo(map);
    let z = map.getZoom();
    map.setView([lat, lng], z);
}

// --------------------------------------------------------------------
var countyLayer;

// var markers = L.layerGroup();
var map = L.map('map', {
    layers: [OpenStreetMap_Mapnik]
}).setView([40.6584953781445, -73.90498729553246], 14);

map.options.minZoom = 8;
// map.fitBounds(aoiLayer.getBounds());
var baseLayers = {
    'OSM': OpenStreetMap_Mapnik,
    'Carto': basemapCarto,
    'Google': googleStreets,
    'Satellite': Esri_WorldImagery,
};

let gas_stations_lg = L.layerGroup();
let restaurantss_lg = L.layerGroup();
let parks_lg = L.layerGroup();
let markers_lg = L.layerGroup();


var markers_geo = { "type": "FeatureCollection" };

let markers = [];

// https://dev.crawldweb.com/maps/get-map-data.php
// https://maps.sakil.dev/api/map-data.php


fetch('https://dev.crawldweb.com/maps/get-map-data.php') // 
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let pois = data.data;

        let availableTags = [];
        for (i = 0; i < pois.length; i++) {
            // if (pois[i].latlon == '')
            //     continue;
            // let latlng = pois[i].latlon.split(',')
            let prop = {
                "id": pois[i].sl,
                "theValue": pois[i].sl,
                "type": pois[i].type,
                "name": pois[i].name,
                "label": pois[i].name,
                "address": pois[i].address,
                "phone": pois[i].phone,
                "icon_url": pois[i].icon_url,
                "lat": pois[i].latitude,//parseFloat(latlng[0]),
                "lon": pois[i].longitude, // parseFloat(latlng[1]),
            };
            // console.log(prop);
            let feature = {
                "type": "Feature",
                "properties": {
                    "id": pois[i].sl,
                    "type": pois[i].type,
                    "name": pois[i].name,
                    "address": pois[i].address,
                    "phone": pois[i].phone,
                    "icon_url": pois[i].icon_url,
                },
                "geometry": { "type": "Point", "coordinates": [parseFloat(pois[i].longitude), parseFloat(pois[i].latitude)] }
            };
            markers.push(feature);
            availableTags.push(prop);
        }
        markers_geo.features = markers;

        let markerLayer = L.geoJSON(markers_geo, {
            onEachFeature: onEachMarker,
        }).addTo(map);

        $("#search").autocomplete({
            source: availableTags,
            select: function (e, ui) {
                console.log(ui);
                //   $("#sval").val(ui.item.theValue);
                drawMarker(ui.item.id, ui.item.name, ui.item.lat, ui.item.lon)
            }
        });
        $("#search-m").autocomplete({
            source: availableTags,
            select: function (e, ui) {
                console.log(ui);
                //   $("#sval").val(ui.item.theValue);
                drawMarker(ui.item.id, ui.item.name, ui.item.lat, ui.item.lon)
            }
        });
    });


var traffic = L.tileLayer('https://api.tomtom.com/traffic/map/4/tile/flow/relative0-dark/{z}/{x}/{y}.png?key={apiKey}', {
    apiKey: ttkey,
    maxZoom: 20
}).addTo(map);

var incident = L.tileLayer('https://api.tomtom.com/traffic/map/4/tile/incidents/s0/{z}/{x}/{y}.png?t=-1&tileSize=256&key={apiKey}', {
    apiKey: ttkey,
    maxZoom: 20
}).addTo(map);

var overlayMaps = {
    "Traffic": traffic,
    "Incident": incident
};

var layerControl = L.control.layers(baseLayers, overlayMaps).addTo(map);

L.easyButton('fa-home fa-lg', function () {
    map.flyTo([40.6584953781445, -73.90498729553246], 14);
}).addTo(map);

lc = L.control
    .locate({
        strings: {
            title: "Locate me"
        },
        circlePadding: [0, 0],
        showPopup: false,
        flyTo: true,

    })
    .addTo(map);


window.lrmConfig = {};

var routeControl = L.Routing.control(L.extend(window.lrmConfig, {
    waypoints: [
        L.latLng(40.6584953781445, -73.90498729553246),
        L.latLng(40.681542945656254, -73.90318024134007)
    ],
    geocoder: L.Control.Geocoder.nominatim(),
    routeWhileDragging: true,
    reverseWaypoints: true,
    showAlternatives: true,
    altLineOptions: {
        styles: [
            { color: 'black', opacity: 0.15, weight: 9 },
            { color: 'white', opacity: 0.8, weight: 6 },
            { color: 'blue', opacity: 0.5, weight: 2 }
        ]
    }
})).addTo(map);

console.log(routeControl);

L.Routing.errorControl(routeControl).addTo(map);

var routingControlContainer = routeControl.getContainer();
var controlContainerParent = routingControlContainer.parentNode;
controlContainerParent.removeChild(routingControlContainer);
var itineraryDiv = document.getElementById('routeDiv');
itineraryDiv.appendChild(routingControlContainer);
