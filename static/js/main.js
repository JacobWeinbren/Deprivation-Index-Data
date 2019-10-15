var map = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamFjb2J3ZWluYnJlbiIsImEiOiJjanY0YW5iZ28wZ3RuNDRuejhza3g5OGV3In0.pF6j188jtsk35p4plequDA'
}).addTo(map);

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function find(local) {
    for (feature in L.glify.instances[0].settings.data.features) {
        if (L.glify.instances[0].settings.data.features[feature].properties.lsoa11nm == local) {
            loc = turf.centerOfMass(L.glify.instances[0].settings.data.features[feature]).geometry.coordinates;
            map.setView(new L.LatLng(loc[1], loc[0]), 15);
        }
    }
}

function countInArray(arr, val) {
    return arr.reduce((count, item) => count + (item == val), 0)
}

const shift = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function polygonsToLines(geojson) {
    var lines = [];
    geojson.features.forEach(function(feature) {
        lines.push(turf.polygonToLine(feature));
    });
    return turf.featureCollection(lines);
}

function generate(total_data) {
    line_data = []
    for (index in total_data) {
        item = total_data[index]
        line_data.push(
            '<tr><td><a href="#" class="reveal">' + item.name + '</a></td><td style="background-color:' +
            scale_a(shift(item.old_alt, 1, 10, 0, 1)).hex() + '">' + item.old +
            '</td><td style="background-color:' + scale_a(shift(item.new_alt, 1, 10, 0, 1)).hex() + '">' + item.new +
            '</td><td style="background-color:' + scale_b(shift(item.change, -7000, 7000, 0, 1)).hex() + '">' + numberWithCommas(item.change) + '</td></tr>');
    }
    return line_data
}

scale_a = chroma.scale(['#E74C3C', '#F1C40F', '#27AE60']);
scale_b = chroma.scale(['#C0392B', '#FFFFFF', '#2980B9']);

clusterize = new Clusterize({
    rows: [],
    scrollId: 'scrollArea',
    contentId: 'contentArea',
    callbacks: {
        clusterChanged: function() {
            $('.reveal').click(function() {
                find($(this).text())
            })
        }
    }
});

function showColors() {

    total_data = []

    //2019 Data
    data_19 = []

    for (feature in data) {
        feature = data[feature];
        if (feature[2019]['authority'] == auth || auth == "England") {
            total_data.push({
                name: feature[2019]['name'],
                new: feature[2019][cat + 'rank'],
                new_alt: feature[2019][cat + 'dec'],
                old: feature[2015][cat + 'rank'],
                old_alt: feature[2015][cat + 'dec'],
                change: feature[2019][cat + 'rank'] - feature[2015][cat + 'rank']
            })
            data_19.push(feature[2019][cat + 'dec'])
        }
    }

    //2015 Data
    data_15 = []
    for (feature in data) {
        feature = data[feature];
        if (feature[2015]['authority'] == auth) {
            data_15.push(feature[2015][cat + 'dec'])
        }
    }

    total_data.sort(function(a, b) {
        return a.new - b.new
    });

    $('#r-19').html('Rank 2019 <span class="mui-caret"></span>')
    $('#r-15').html('Rank 2015')
    $('#r-ch').html('Change')
    line_data = generate(total_data)
    clusterize.update(line_data)

    $('#r-15').click(function() {
        $('#r-15').html('Rank 2015 <span class="mui-caret"></span>')
        $('#r-19').html('Rank 2019')
        $('#r-ch').html('Change')
        total_data.sort(function(a, b) {
            return a.old - b.old
        });
        line_data = generate(total_data)
        clusterize.update(line_data)
    })

    $('#r-19').click(function() {
        $('#r-19').html('Rank 2019 <span class="mui-caret"></span>')
        $('#r-15').html('Rank 2015')
        $('#r-ch').html('Change')
        total_data.sort(function(a, b) {
            return a.new - b.new
        });
        line_data = generate(total_data)
        clusterize.update(line_data)
    })

    $('#r-ch').click(function() {
        $('#r-ch').html('Change <span class="mui-caret"></span>')
        $('#r-15').html('Rank 2015')
        $('#r-19').html('Rank 2019')
        total_data.sort(function(a, b) {
            return a.change - b.change
        });
        line_data = generate(total_data)
        clusterize.update(line_data)
    })

    if (auth == "England") {
        for (i = 1; i < 11; i++) {
            val = 10
            $('#chart-15 .' + i).css('width', val + '%')
            $('#chart-15 .' + i).attr('data-tippy', Math.round(val) + '%')

            val = 10
            $('#chart-19 .' + i).css('width', val + '%')
            $('#chart-19 .' + i).attr('data-tippy', Math.round(val) + '%')
        }
    } else {
        for (i = 1; i < 11; i++) {
            val = countInArray(data_15, i) / data_15.length * 100
            $('#chart-15 .' + i).css('width', val + '%')
            $('#chart-15 .' + i).attr('data-tippy', Math.round(val) + '%')

            val = countInArray(data_19, i) / data_19.length * 100
            $('#chart-19 .' + i).css('width', val + '%')
            $('#chart-19 .' + i).attr('data-tippy', Math.round(val) + '%')
        }
    }
}

year = 2019
cat = 'dep'
auth = 'England'
difference = false;
$('#location').text('England')
$('#dec').text('5').css('background-color', scale_a(0.5).hex())
$('#rank').text('16,422').css('background-color', scale_a(0.5).hex())

for (i = 1; i < 11; i++) {
    $('.' + i).css('background-color', scale_a(shift(i, 1, 10, 0, 1)).hex())

    $('#chart-15 .' + i).attr('data-tippy', '10%')
    $('#chart-19 .' + i).attr('data-tippy', '10%')

    tippy($('#chart-15 .' + i)[0], {
        onShow(instance) {
            instance.setContent(instance.reference.dataset.tippy);
        }
    });
    tippy($('#chart-19 .' + i)[0], {
        onShow(instance) {
            instance.setContent(instance.reference.dataset.tippy);
        }
    });
}

function draw(geojson) {
    if (L.glify.instances.length == 0) {
        L.glify.shapes({
            map: map,
            data: geojson,
            color: function(index, pointer) {
                feature = data[pointer.properties.lsoa11nm][year]
                pointer.properties.authority = feature['authority']
                if (difference) {
                    feature = data[pointer.properties.lsoa11nm]
                    val = feature[2019][cat + 'rank'] - feature[2015][cat + 'rank']
                    rgb = hexToRgb(scale_b(shift(val, -7000, 7000, 0, 1)).hex())
                    pointer.properties.dec = feature[2019][cat + 'dec'] - feature[2015][cat + 'dec']
                    pointer.properties.rank = val
                } else {
                    val = feature[cat + 'dec']
                    rgb = hexToRgb(scale_a(shift(val, 1, 10, 0, 1)).hex())
                    pointer.properties.dec = feature[cat + 'dec']
                    pointer.properties.rank = feature[cat + 'rank']
                }
                return {
                    r: rgb.r / 255,
                    g: rgb.g / 255,
                    b: rgb.b / 255,
                }
            },
            click: function(e, feature, xy) {
                $('#dec-title').text('Deciles of LSOA in Deprivation: ' + feature.properties.authority)

                auth = feature.properties.authority

                $('#location').text(feature.properties.lsoa11nm)
                if (difference) {
                    if (feature.properties.rank >= 0) {
                        text = '+'
                    } else {
                        text = ''
                    }
                    $('#dec').text(text + feature.properties.dec).css('background-color', scale_b(shift(feature.properties.rank, -7000, 7000, 0, 1)).hex())
                    $('#rank').text(text + numberWithCommas(feature.properties.rank)).css('background-color', scale_b(shift(feature.properties.rank, -7000, 7000, 0, 1)).hex())
                } else {
                    $('#dec').text(feature.properties.dec).css('background-color', scale_a(shift(feature.properties.dec, 1, 10, 0, 1)).hex())
                    $('#rank').text(numberWithCommas(feature.properties.rank)).css('background-color', scale_a(shift(feature.properties.dec, 1, 10, 0, 1)).hex())
                }
                showColors()
            },
            opacity: 0.8
        });

        showColors();

        $.getJSON('static/lines.json', function(lines) {
            L.glify.lines({
                map: map,
                data: lines,
                latitudeKey: 1,
                longitudeKey: 0,
                color: function(index, point) {
                    return {
                        r: 0,
                        g: 0,
                        b: 0
                    }
                }
            });
        });
    } else {
        L.glify.instances[0].render();
        showColors();
    }
}

$.getJSON('static/data/postcodes.json', function(json) {
    postcodes = json
    $("#postcode").submit(function(event) {
        postcode = $(this).find('input[name="postcode"]').val();
        local = postcodes[postcode]
        find(local)

        event.preventDefault();
    });
});

$.getJSON('static/more_flat_simple.json', function(geojson) {
    $.getJSON('static/data/data.json', function(json) {
        data = json

        i = geojson.features.length
        while (i--) {
            if (data[geojson.features[i].properties.lsoa11nm] === undefined) {
                geojson.features.splice(i, 1);
            }
        }

        draw(geojson);

        $('.2015').click(function() {
            if (year != 2015 || difference) {
                $('#dec').text('5').css('background-color', scale_a(0.5).hex());
                $('#rank').text('16,422').css('background-color', scale_a(0.5).hex());
                year = 2015;
                difference = false;
                $('#year').text(year)
                draw(geojson);
            }
        });

        $('.dif').click(function() {
            if (!difference) {
                $('#dec').text('+0').css('background-color', scale_b(0.5).hex());
                $('#rank').text('+0').css('background-color', scale_b(0.5).hex());
                difference = true;
                $('#year').text('Difference')
                draw(geojson);
            }
        });

        $('.2019').click(function() {
            if (year != 2019 || difference) {
                $('#dec').text('5').css('background-color', scale_a(0.5).hex());
                $('#rank').text('16,422').css('background-color', scale_a(0.5).hex());
                year = 2019;
                difference = false;
                $('#year').text(year)
                draw(geojson);
            }
        });

        $(".option").click(function() {
            $('.drop-text').html($(this).text() + ' <span class="mui-caret"></span>');
            val = $(this).attr('id')
            if (val != cat) {
                cat = val;
                draw(geojson);
            }
        });

        $('.reset').click(function() {
            year = 2019
            cat = 'dep'
            auth = 'England'
            difference = false;
            $('#location').text('England')
            $('#dec').text('5').css('background-color', scale_a(0.5).hex());
            $('#rank').text('16,422').css('background-color', scale_a(0.5).hex());
            $('#dec-title').text('Deciles of LSOA in Deprivation: England');
            draw(geojson);
        })
    });
});