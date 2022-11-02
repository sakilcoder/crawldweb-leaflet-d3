
const fetchText = async (url) => {
    const response = await fetch(url);
    return await response.text();
}
const csvUrl = 'assets/data/pois.csv';

// --------------------------------------------------------------------

var countyLayer;

// var markers = L.layerGroup();
var map = L.map('map', {
    layers: [basemapCarto]
}).setView([40.6584953781445, -73.90498729553246], 12);
// map.options.minZoom = 4;
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


var gas_stations_geo = { "type": "FeatureCollection" };
var restaurants_geo = { "type": "FeatureCollection" };
var parks_geo = { "type": "FeatureCollection" };
var markers_geo = { "type": "FeatureCollection" };

let gas_stations= [];
let restaurants= [];
let parks= [];
let markers= [];

fetchText(csvUrl).then(text => {
    let pois = d3.csvParse(text);
    // console.log(pois);
    let features = [];

    for (i = 0; i < pois.length; i++) {
        if(pois[i].latlon=='')
            continue;
        let latlng = pois[i].latlon.split(',')
        let feature = {
            "type": "Feature",
            "properties": {
                "id": pois[i].sl                ,
                "type": pois[i].type,
                "name": pois[i].name,
                "address": pois[i].address,
                "phone": pois[i].phone,
            },
            "geometry": { "type": "Point", "coordinates": [parseFloat(latlng[1]), parseFloat(latlng[0])] }
        };
        markers.push(feature);
        // let type = pois[i].type;
        // if(type=='Gas station'){
        //     gas_stations.push(feature);
        // }else if(type=='Restaurant'){
        //     restaurants.push(feature);
        // }else if(type=='Restaurant'){
        //     parks.push(feature);
        // }
    }
    markers_geo.features = markers;
    L.geoJSON(markers_geo, {
        onEachFeature: onEachMarker,
    }).addTo(map);
   
    // var controlSearch = new L.Control.Search({
	// 	// position:'topright',	
	// 	layer: poiLayer,
	// 	initial: false,
	// 	zoom: 12,
	// 	// marker: true,
	// 	collapsed: true,
	// 	textPlaceholder: 'Rechercher un departement',
	// 	propertyName: 'name',
	// 	hideMarkerOnCollapse: true,
	// });

	// map.addControl(controlSearch);

});

var layerControl = L.control.layers(baseLayers).addTo(map);

// L.easyButton('fa-home fa-lg', function () {

// }).addTo(map);

lc = L.control
    .locate({
        strings: {
            title: "Locate me"
        },
        circlePadding: [0, 0],
        showPopup: false,
        flyTo:true,
        
    })
    .addTo(map);