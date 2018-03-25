var datasetDiv = $('#dataset');

$(function() {


    //var root='https://restcountries.eu/rest/v2/name/'
    $("#restSearch").autocomplete({
        minLength: 0,
        source: function(request, response) {

            $.ajax({

                url: 'http://localhost:19000/search.groovy?term=' + request.term,
                dataType: "json",

                success: function(data) {
                    response($.map(data, function(item) {
                        console.log()
                        return {
                            label: "<div style='padding-bottom: 20px'><b>" + item[0] + "</b>(dataset:"+ item[2] + ")</div>"  ,
                            value: item[0] ,
                            _data: item[3],
                            _dataSet: item[2]
                        }

                    }));
                }
            });
        },

        select: function(event, element) {

            window.location.replace("Bio2VecSearch.html?id=" + element.item._data+"&dataset="+element.item._dataSet);

        }

    }).autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( item.label )
        .appendTo( ul );
    };
});




