
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
    layers: [basemapCarto]
}).setView([40.6584953781445, -73.90498729553246], 14);

map.options.minZoom = 8;
// map.fitBounds(aoiLayer.getBounds());
var baseLayers = {
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
        select: function(e, ui) {
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