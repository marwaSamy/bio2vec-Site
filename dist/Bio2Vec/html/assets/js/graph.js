var graphdata = [];
var ds;
$(document).ready(function() {
    alert("hi");
    $.ajax({
        url: 'http://localhost:19000/graph.groovy?term=full_text_embeddings',
        dataType: "json",
        success: function(data) {
            
            $.each(data, function() {
                
                var polt = {
                    "pca_x": parseFloat(this._source.pca_x),
                    "pca_y": parseFloat(this._source.pca_y),
                    "id": this._source.id,
                    "name": this._source.name,
                    "entity": this._source.entity_type,
                };
                graphdata.push(polt);
            });
            graph(graphdata);
            console.log("ajax:" + d3.max(graphdata, function(d) {
                return d.pca_x;
            }))

        },
        error: function(data) {
            console.log("error");
        }
    });
});

function graph(data) {


   var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 900,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

    var padding = 10;
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
        return   "name: " + d.name + "<br>"+"id : " + d.id;
      });

      
    //chart
    var chart = d3.select('#graph')
        .append('svg:svg')
        .attr('width', outerWidth )
        .attr('height', outerHeight )
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
        .attr("fill", function(d){ return entityCol(d.entity); })
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
function entityCol (d) {
  if (d=="http://bio2vec.net/ontology/gene") { return "#860E18"; } else
  if (d=="http://bio2vec.net/ontology/disease") { return "#EC620B"; }
}