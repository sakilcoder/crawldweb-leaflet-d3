
var styleArea = {
    weight: 0.8,
    color: "#fff",
    opacity: 1,
    fillColor: "#b7d18a",
    fillOpacity: .8
}
var styleAoi = {
    weight: 1,
    color: "#ff5156",
    opacity: .1,
    fillColor: "#719b6b",
    fillOpacity: 0
}
var styleCounty = {
    weight: 1,
    color: "#2A3E56",
    opacity: .1,
    fillColor: "#719b6b",
    fillOpacity: 0
}

let GoogleIcon = function (html) {
    return L.divIcon({
        html: html,
        iconSize: [16, 16],
        className: 'my-google-icon'
    });
}

let pngIconStyle = L.Icon.extend({
    options: {
       iconSize: [10, 19]
    }
});

let pngIcon = function (url) {
    return new pngIconStyle({
        iconUrl: url
    })
}

