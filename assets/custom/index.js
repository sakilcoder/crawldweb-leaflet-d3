
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

fetchText(csvUrl).then(text => {
    let pois = d3.csvParse(text);

    let availableTags = [];
    for (i = 0; i < pois.length; i++) {
        if (pois[i].latlon == '')
            continue;
        let latlng = pois[i].latlon.split(',')
        let prop = {
            "id": pois[i].sl,
            "theValue": pois[i].sl,
            "type": pois[i].type,
            "name": pois[i].name,
            "label": pois[i].name,
            "address": pois[i].address,
            "phone": pois[i].phone,
            "lat": parseFloat(latlng[0]),
            "lon": parseFloat(latlng[1]),
        };
        let feature = {
            "type": "Feature",
            "properties": {
                "id": pois[i].sl,
                "type": pois[i].type,
                "name": pois[i].name,
                "address": pois[i].address,
                "phone": pois[i].phone,
            },
            "geometry": { "type": "Point", "coordinates": [parseFloat(latlng[1]), parseFloat(latlng[0])] }
        };
        markers.push(feature);
        availableTags.push(prop)
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

var layerControl = L.control.layers(baseLayers).addTo(map);

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



// let routeControl =  L.Routing.control({
//         waypoints: [
//           L.latLng(40.6584953781445, -73.90498729553246),
//           L.latLng(40.681542945656254, -73.90318024134007)
//         ],
//         routeWhileDragging: true
//       }).addTo(map);

// function createButton(label, container) {
//     var btn = L.DomUtil.create('button', '', container);
//     btn.setAttribute('type', 'button');
//     btn.innerHTML = label;
//     return btn;
// }

// map.on('click', function(e) {
//     var container = L.DomUtil.create('div'),
//         startBtn = createButton('Start from this location', container),
//         destBtn = createButton('Go to this location', container);

//     L.popup()
//         .setContent(container)
//         .setLatLng(e.latlng)
//         .openOn(map);
// });

// L.Routing.control({
//     waypoints: [
//         L.latLng(40.6584953781445, -73.90498729553246),
//         L.latLng(40.681542945656254, -73.90318024134007)
//     ],
//     routeWhileDragging: true,
//     geocoder: L.Control.Geocoder.nominatim()
// })
// .on('routesfound', function(e) {
//     var routes = e.routes;
//     alert('Found ' + routes.length + ' route(s).');
// })
// .addTo(map);