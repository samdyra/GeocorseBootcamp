// Bikin Base map
var map = L.map('map').setView([-6.934409, 107.794416], 15);

var osm = L.tileLayer('https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=Hw8VtKVQyLnAHQmKSEPI', {attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',}).addTo(map)

var voyager = L.tileLayer('https://api.maptiler.com/maps/voyager/{z}/{x}/{y}.png?key=Hw8VtKVQyLnAHQmKSEPI', {attribution: '<a href="https://carto.com/" target="_blank">&copy; CARTO</a> <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'})

  
// layer 1
// Warnain biar berwarna
// klasifikasi warna sesuai klasifikas
var geojson;
function getColor(d) {
    return d === "Sangat Ringan" ? '#00FF00' :
           d === "Ringan"  ? '#FF0000' :
           d === "Sedang"  ? '#0000FF' :
                      '#FFEDA0';
}
// fungsi masukin warna sesuai dengan tabel atribut
function style(feature) {
    return {
        fillColor: getColor(feature.properties.Klasifikas),
        weight: 0,
        opacity: 1,
        color: '',
        dashArray: '',
        fillOpacity: 0.3
    };
}

// membuat jadi interaktif kalo di hover
// kalo di hover jadi berubah

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.5
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties); // ngasih info pas di hover
}
// pas gajadi hover kembali ke tempat semula
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update(); //ngasih info pas di hover
}
// fungsi biar pas di click nge zoom
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
// fungsi biar masukin semua fungsi jadi event listener
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
// bikin map
geojson = L.geoJson(studi, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
// ngasih info pas di hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Klasifikasi Bahaya</h4>' +  (props ?
        props.Klasifikas
        : 'diluar cakupan penelitian');
};
// masukin info pas di hover ke map
info.addTo(map);

// Legenda
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["Sangat Ringan", "Ringan", "Sedang"],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i] ? ''  + '<br>' : '');
    }

    return div;
};

legend.addTo(map);

// Layer 2
// Warnain biar berwarna
// klasifikasi warna sesuai klasifikas

// fungsi masukin warna sesuai dengan tabel atribut
function style2(feature) {
    return {
        fillColor: '#FFFFFF',
        weight: '1',
        opacity: 1,
        color: 'black',
        fillOpacity: 1
    };
}
let layer2;

function highlightFeature2(e) {
    var layer = e.target;

    layer.setStyle({
        fillColor: '#FFFFFF',
        weight: '1',
        opacity: 1,
        color: 'black',
        fillOpacity: 1

    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
// pas gajadi hover kembali ke tempat semula
function resetHighlight2(e) {
    layer2.resetStyle(e.target);
}
// fungsi biar pas di click nge zoom
function zoomToFeature2(e) {
    map.fitBounds(e.target.getBounds());
}
// fungsi biar masukin semua fungsi jadi event listener
function onEachFeature2(feature, layer) {
    layer.on({
        mouseover: highlightFeature2,
        mouseout: resetHighlight2,
        click: zoomToFeature2
    });
}
// bikin map
layer2 = L.geoJson(studi2, {
    style: style2,
    onEachFeature: onEachFeature2
}).addTo(map);

var baseMaps = {
    "OSM": osm,
    "Voyager": voyager
};

var layersmap = {
 "penelitian": geojson,
 "Batas Wilayah": layer2
}

L.control.layers(baseMaps, layersmap).addTo(map)



