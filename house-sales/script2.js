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

        function mapCsvNumbers(val) {
            if (val === 'NULL') {
                return 0;
            } else {
                return +val;
            }

        }

        var new_housePrice = transposedArray[3].map(mapCsvNumbers)
        var old_housePrice = transposedArray[4].map(mapCsvNumbers)

        $('#house-prices').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'London New/Old Build Price 2013-2014'
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
                    text: 'House Price (£)'
                }
            },
            tooltip: {
                formatter: function () {
                    var boxText = '<b>' + this.x + '</b>';

                    function formatValue(val) {
                        if (val === 0) {
                            return "No Sales"
                        } else if (val < 1000) {
                            return Math.round(val);
                        } else if (val < 1000000) {
                            return (Math.ceil(val/1000 * 1) / 1) + 'K';
                        } else {
                            return (Math.ceil(val/1000000 * 10) / 10) + "M";
                        }
                    }

                    $.each(this.points, function() {
                    boxText += '<br/><span style="color:' + this.series.color + '">' + this.series.name + '</span>:' + formatValue(this.y);
                    });

                    return boxText;
                },
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
                name: 'New Build Price',
                data: new_housePrice

            },
            {
                name: 'Old Build Price',
                data: old_housePrice}]
        });
    }

    $.ajax({
        url: "new_old_by_postcode.csv",
        async: false,
        success: function (csvd) {
            var data = $.csv.toArrays(csvd);
            setupHighcharts(data);
        },
        dataType: "text",
        complete: function () {}
    });
});
    