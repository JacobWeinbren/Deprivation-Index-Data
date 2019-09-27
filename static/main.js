var map = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamFjb2J3ZWluYnJlbiIsImEiOiJjanY0YW5iZ28wZ3RuNDRuejhza3g5OGV3In0.pF6j188jtsk35p4plequDA'
}).addTo(map);

$.getJSON('static/small.json', function(geojson) {
    L.glify.shapes({
        map: map,
        data: geojson,
        click: function(e, feature) {
            console.log(feature)
        },
        color: function(index, feature) {
            color = {
                r: 218,
                g: 0,
                b: 214
            }
            return color
        }
    });
})