
function onEachMarker(feature, layer) {
    console.log(feature.properties);
    layer.setIcon(setIconFromUrl(feature.properties.icon_url));

    var popup = L.popup();
    let str_popup = '';
    str_popup += '<h5 class="text-center" style="font-weight: bold">' + feature.properties.name + '</h5>';
    str_popup += '<table style="width: 100%">';
    str_popup += '<tr><td class="text-center">Phone: ' + feature.properties.phone + '</td></tr>';
    str_popup += '<tr><td class="text-center">Address: ' + feature.properties.address + '</td></tr>';
    str_popup += '</table>';

    popup.setContent(str_popup);
    layer.bindPopup(popup, popupOptions);

    layer.on('mouseover', function (e) {
        var popup = e.target.getPopup();
        popup.setLatLng(e.latlng).openOn(map);
    });

    layer.on('mouseout', function (e) {
        e.target.closePopup();
    });

    layer.on('click', function (e) {
        console.log(feature.properties.name);
        // let infoDiv=document.getElementById('infoDiv');
        // infoDiv.innerHTML=feature.properties.name + ", " +feature.properties.address;
        
    });

}

var setIconFromUrl=function(iconUrl){
    console.log(iconUrl);
    return L.icon({
        iconUrl: iconUrl,    
        iconSize: [36, 36], // size of the icon
    });
}

var getIcon = function (type) {
    let gi='';
    if (type == 'Gas station') {
        gi = '<i class="material-icons" style="font-size:24px;color:red">local_gas_station</i>';
    } else if (type == 'Restaurant') {
        gi = '<i class="material-icons" style="font-size:24px;color:red">restaurant</i>';
    } else if (type == 'Park') {
        gi = '<i class="material-icons" style="font-size:24px;color:red">park</i>';
    }
    var icon = GoogleIcon('<span class="g-icon">' + gi + '</span>');
    return icon;
}
