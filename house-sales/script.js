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
        var new_houseSales = transposedArray[1].map(function (val) { return + val; })
        var old_houseSales = transposedArray[2].map(function (val) { return + val; })

        $('#house-sales').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'London New/Old Build Sales 2013-2014'
            },
            subtitle: {
                text: 'Source: data.london.gov.uk'
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
                    '<td style="padding:0"><b>{point.y:.0f} sales </b></td></tr>',
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
                name: 'New Build Sales',
                data: new_houseSales

            },
            {
                name: 'Old Build Sales',
                data: old_houseSales}]
        });
    }

    $.ajax({
        url: "house-sales/new_old_by_postcode.csv",
        async: false,
        success: function (csvd) {
            var data = $.csv.toArrays(csvd);
            setupHighcharts(data);
        },
        dataType: "text",
        complete: function () {}
    });
});
