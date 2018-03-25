var graphdata = [];
var ds;

var datasetDiv = $('#dataset');
var dataset;
var targetId;
var t;
var lastid;
var lastscore;
var vector;
var simcounter = 0;

$(document).ready(function() {
    dataset = getUrlVars().dataset;
    targetId = getUrlVars().id;
    showResult(targetId);
    dataSet();
    entityAutocomplete();
    getGraph();
});


function entityAutocomplete() {


    $("#restSearch").autocomplete({
        minLength: 0,
        source: function(request, response) {

            $.ajax({

                url: 'http://localhost:19000/search.groovy?term=' + request.term,
                dataType: "json",

                success: function(data) {
                    alert(data.lenght);
                    response($.map(data, function(item) {

                        return {
                            label: "<div style='padding-bottom: 20px'><b>" + item[0] + "</b>(dataset:" + item[2] + ")</div>",
                            value: item[0],
                            desc: item[1],
                            _data: item[3],
                            _dataset: item[2],
                            _vector: item[4]
                        }

                    }));
                }
            });
        },
        select: function(event, element) {
            dataset = element.item._dataset;
            showResult(element.item._data);
            getGraph();
            //showSim(element.item._dataset, element.item._vector);
        }

    }).autocomplete("instance")._renderItem = function(ul, item) {
        return $("<li>")
            .append(item.label)
            .appendTo(ul);
    };
}

function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}

function getGraph() {
    var lastGraphId;
    var getmore = false;

    $.ajax({
        url: 'http://localhost:19000/graph.groovy?term=' + dataset,
        dataType: "json",
        success: function(data) {

            $.each(data, function() {
                lastGraphId = this._source.id;
                //alert(this._source.id);
                //alert("lastid="+lastGraphId)
                var polt = {
                    "pca_x": parseFloat(this._source.pca_x),
                    "pca_y": parseFloat(this._source.pca_y),
                    "id": this._source.id,
                    "name": this._source.name[0],
                    "entity": this._source.entity_type,
                    "_id": this._id
                };
                graphdata.push(polt);
            });
            graph(graphdata);

            if (data.length == 10000) {
                getmore = true;
                getMore();
            }
        },
        error: function(data) {
            console.log("error");
        }
    });

    function getMore() {
        
            //alert("in while");
            $.ajax({
                url: 'http://localhost:19000/graph.groovy?term=' + dataset + '&sa=' + lastGraphId,
                dataType: "json",
                success: function(data) {

                    $.each(data, function() {
                        lastGraphId = this.id;
                        var polt = {
                            "pca_x": parseFloat(this._source.pca_x),
                            "pca_y": parseFloat(this._source.pca_y),
                            "id": this._source.id,
                            "name": this._source.name[0],
                            "entity": this._source.entity_type,
                            "_id": this._id
                        };
                        graphdata.push(polt);
                    });
                    graph(graphdata);

                    //alert(data.length);
                    if (data.length == 10000) {
                        //getMore();
                    } 
                },
                error: function(data) {
                    console.log("error");
                }
            });
        }
    
}

function dataSet() {

    $.ajax({

        url: 'http://localhost:19000/dataset.groovy?term=all',
        dataType: "json",

        success: function(data) {
            //alert(data);
            console.log("dataset" + data);
            $.map(data, function(item) {
                //console.log("hello"+item._source.dataset_name);
                //alert(item._source.dataset_name)
                $('#dataset').append($('<option>', {
                    value: item._source.dataset_name,
                    text: item._source.dataset_name
                }));

            });

        },
        error: function(data) {
            console.log("Dataset error");



        }


    })

    $("#dataset option").filter(function() {

        // alert("hi");
        return $.trim($(this).text()) == $.trim(dataset);
    }).prop('selected', true);

    //$("#dataset option[value='full_text_embeddings']").attr('selected', 'selected');
    //$("#dataset").val(dataset);
    //$("#dataset option[value='1']").attr("selected", true);
    //$("#dataset").attr("value", dataset);
    //alert("trying "+dataset);


}

function graph(data) {

    $('#bio2vecgraph').empty();
    var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        outerWidth = 900,
        outerHeight = 300,
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    var padding = 0;
    var currentTransform = null;
    //scale
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) {
            return d.pca_x;
        }))
        .range([padding, width - padding])
        .nice();
    var y = d3.scaleLinear()
        .domain(d3.extent(data, function(d) {
            return d.pca_y;
        }))
        .range([height, 0]);

    var zoom = d3.zoom()
        .scaleExtent([0, 500])
        .translateExtent([
            [-width * 2, -height * 2],
            [width * 2, height * 2]
        ])
        .on("zoom", zoomed);

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
            return "name: " + d.name + "<br>" + "id : " + d.id;
        });


    //chart
    var chart = d3.select('#bio2vecgraph')
        .append('svg:svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight)
        .attr("fill", "white")
        .attr('class', 'chart')
        .append("g")
        .attr("transform", "translate(200, 0)")
        .call(zoom);

    chart.call(tip);

    chart.append("rect")
        .attr("width", width)
        .attr("height", height);

    var main = chart.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'main')


    var xAxis = d3.axisBottom(x);
    var x_axis = chart.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'main axis date')
        .call(xAxis);
    var yAxis = d3.axisLeft(y);

    var y_axis = chart.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('class', 'main axis date')
        .call(yAxis);

    var objects = chart.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);



    var dots = objects.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d) {
            return x(d.pca_x);

        })
        .attr("cy", function(d) {
            return y(d.pca_y);

        })
        .attr("fill", function(d) {
            return entityCol(d.entity, d._id);
        })
        .attr("r", 3)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    function zoomed() {

        x_axis.call(xAxis.scale(d3.event.transform.rescaleX(x)));
        y_axis.call(yAxis.scale(d3.event.transform.rescaleY(y)));

        // re-draw circles using new x-axis & y-axis 
        var new_y = d3.event.transform.rescaleY(y);
        dots.attr("cy", function(d) {
            return new_y(d.pca_y);
        });
        var new_x = d3.event.transform.rescaleX(x);
        dots.attr("cx", function(d) {
            return new_x(d.pca_x);
        });

        function transform(d) {
            return "translate(" + d3.event.transform.rescaleX(x) + "," + d3.event.transform.rescaleY(y) + ")";

        }


    }

}

function entityCol(entity, _id) {

    if (_id == 2109) {
        alert("found");

        return "#0000b3";
    } 
    else if (entity == "http://bio2vec.net/ontology/gene") {
        return "#3d3d3d";
    } 
    else if (entity == "http://bio2vec.net/ontology/disease") {
        return "#bf00ff";
    }
    
    else if (entity == "http://bio2vec.net/ontology/phenotype") {
        return "#662200";
    } 
    
    else if (entity == "http://bio2vec.net/ontology/mesh") {
        return "#99e600";
    
    } 
    else if (entity == "http://bio2vec.net/ontology/gene_function") {
        return "#e60000";
    } 
    
     else if (entity == "http://bio2vec.net/ontology/chemical") {
        return "#ff8000";
    } 
    else {
        return "#bf00ff";
    }
}

function showMore() {
    $('#simmore').remove();
    $.ajax({

        url: 'http://localhost:19000/sim.groovy?vector=' + vector + '&dataset=' + dataset + '&sa=' + lastid + '&sc=' + lastscore,
        dataType: "json",

        success: function(data) {
            //console.log("success");
            //console.log(data.length);

            var simHtml = '<ul class="media-list media-list-divider">'
            $.each(data, function() {
                $.each(this, function() {
                    lastid = this[1];
                    lastscore = this[3];
                    //console.log(lastid);
                    //console.log(lastscore);
                    simcounter = simcounter + 1;
                    simHtml = simHtml + '<li class="media flexbox"><div><div class="media-heading"><a class="text-success" onclick="showResult(' + this[4] + ');return false;" href="">' + simcounter + '-' + this[0][0] + '</a></div><div class="font-13 text-light">' + this[1] + '</div></div></li>'

                });
            });
            simHtml = simHtml + '<li class="media flexbox" id="simmore"><div><div class="media-heading"><button class="btn btn-outline-info btn-fix btn-block" onclick="showMore();"> Show More</button></div></div></li>'
            simHtml = simHtml + '</div>';
            $('#sim').append(simHtml);


        },
        error: function(data) {
            console.log("similarity error");
            //console.log(data);

        }


    });
}

function showSim(ds, model_factor) {
    $('#sim').empty();
    simcounter = 0;
    var simDiv = $('#sim');
    dataset = ds;


    factor = model_factor.replace(/\s*\d+\|/g, ',').replace(/^,/, '');
    vector = factor;
    $.ajax({

        url: 'http://localhost:19000/sim.groovy?vector=' + factor + '&dataset=' + dataset,
        dataType: "json",

        success: function(data) {
            //console.log("success");
            //console.log(data.length);

            var simHtml = '<ul class="media-list media-list-divider">'
            $.each(data, function() {
                $.each(this, function(i) {
                    if (i > 0) {
                        lastid = this[1];
                        lastscore = this[3];
                        //console.log(lastid);
                        //console.log(lastscore);
                        simcounter = simcounter + 1;
                        simHtml = simHtml + '<li class="media flexbox"><div><div class="media-heading"><span style="padding-right:10px;" >' + simcounter + ')</span><a class="text-success" onclick="showResult(' + this[4] + ');return false;" href="">' + this[0][0] + '</a></div><div class="font-13 text-light">' + this[1] + '</div></div></li>'

                    }
                });
            });
            simHtml = simHtml + '<li class="media flexbox" id="simmore"><div><div class="media-heading"><button class="btn btn-outline-info btn-fix btn-block" onclick="showMore();"> Show More</button></div></div></li>'
            simHtml = simHtml + '</div>';
            $('#sim').append(simHtml);


        },
        error: function(data) {
            console.log("similarity error");
            //console.log(data);

        }


    });



}

function showResult(j) {

    targetId = j;
    $('#accordion-1').empty();
    $('#entity-details').empty();

    $.ajax({

        url: 'http://localhost:19000/SearchId.groovy?term=' + targetId + "&dataset=" + dataset,
        dataType: "json",

        success: function(data) {

            $.each(data, function() {
                console.log(this);
                details = this;

                //$('<div class="ibox-title">Similar Entities</div>').appendTo("#entity-details");
                $('#entity-details').append($('<div class="ibox-title">' + details._source.name[0] + '</div>'));
                var synonym = '<div class="p-3 bg-primary-50 mt-3"><ul class="media-list media-list-divider">';


                $.each(details._source.name, function(i) {
                    if (i > 0) {
                        synonym = synonym + '<li style="padding-left: 20px;">' + this + '</li>'
                    }
                });


                synonym = synonym + '</ul></div>'

                var synonymliHtml = '<li class="list-group-item"><a class="text-success" data-toggle="collapse" href="#faq1-2">Synonym<i class="fa fa-angle-down"></i></a><div class="collapse show" id="faq1-2">' + synonym + '</div></li>'
                $('#accordion-1')
                    .append($('<ul class="list-group list-group-divider list-group-full faq-list" />')
                        .append(synonymliHtml)
                    );

                var type;
                details._source.entity_type == "http://bio2vec.net/ontology/gene" ? type = "Gene" : type = "Disease";
                $('<p class="font-strong"><span class="font-strong" style="color: #18c5a9;  padding-right: 20px;">entity_type :</span>' + type + '</p>').appendTo("#accordion-1");
                $('<p class="font-strong"><span class="font-strong" style="color: #18c5a9;  padding-right: 50px;">ID :</span><a  href="' + details._source.id + '" target="_blank">' + details._source.id + '</a></p>').appendTo("#accordion-1");



                factor = details._source['@model_factor'].replace(/\s*\d+\|/g, ',').replace(/^,/, '');
                var res = factor.split(',');
                var factorHtml = '<div class="p-3 bg-primary-50 mt-3">'
                var i = 0
                $.each(res, function() {
                    i = i + 1;
                    factorHtml = factorHtml + '<span style="padding-right: 20px; width:20px;">' + this + '</span>';
                    if (i == 7) {
                        factorHtml = factorHtml + '</br>';
                        i = 0;
                    }

                });
                factorHtml + '</div>';
                var liHtml = '<li class="list-group-item"><a class="text-success" data-toggle="collapse" href="#faq1-1">Vector<i class="fa fa-angle-down"></i></a><div class="collapse show" id="faq1-1">' + factorHtml + '</div></li>'
                $('#accordion-1')
                    .append($('<ul class="list-group list-group-divider list-group-full faq-list" />')
                        .append(liHtml)
                    );

            });

            showSim(details._source.dataset_name, details._source['@model_factor']);


        },
        error: function(data) {
            console.log("error");



        }


    })

}