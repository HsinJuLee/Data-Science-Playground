$(function () {
    function setupHighcharts(data) {
        // skip header row
        var noHeader = data.filter(function(row, index) {
            return index > 0;
        });

        var transposedArray = noHeader[0].map(function(col, i) {
            return noHeader.map(function(row) {
                return row[i]
            })
        });

        var postcodes = transposedArray[0]
        var houseSales = transposedArray[3].map(function (val) { return +val; })

        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'House sales in different London postcodes'
            },
            subtitle: {
                text: 'Source: Government data'
            },
            xAxis: {
                categories: transposedArray[0],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'House sales'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'House sales',
                data: houseSales

            }]
        });
    }

    $.ajax({
        url: "price-by-postcode-whether-newbuild.csv",
        async: false,
        success: function (csvd) {
            var data = $.csv.toArrays(csvd);
            setupHighcharts(data);
        },
        dataType: "text",
        complete: function () {}
    });
});