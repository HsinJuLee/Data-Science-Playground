$(function () {
    function setupHighcharts(data) {
        function mapCsvNumbers(val) {
            if (val === 'NULL') {
                return 0;
            } else {
                return +val;
            }
        }

        function mapToBoxPlotPrices(prices) {
            var quartiles = jStat.quartiles(prices);

            return [ jStat.min(prices), quartiles[0], jStat.median(prices), quartiles[2], jStat.max(prices) ];
        }

        var data_grouped_by_postcode =
            Enumerable.From(data)
            .GroupBy(function(x) { return x.post_code_group; })
            .Select(function(x) { return {
                Postcode: x.Key(),
                Prices:
                    x.Select(function(y) { return mapCsvNumbers(y.price); }).ToArray()
            }})
            // Filter out postcodes with less then 10 sales
            .Where(function(x) { return x.Prices.length >= 10; })
            .Select(function(x) { return {
                Postcode: x.Postcode,
                BoxPlotPrices: mapToBoxPlotPrices(x.Prices)
            }})
            .OrderBy(function(x) { return x.Postcode; })

        var prices_grouped_by_postcode =
            data_grouped_by_postcode
            .Select(function (d) { return d.BoxPlotPrices; })
            .ToArray();

        var group_postcodes =
            data_grouped_by_postcode
            .Select(function (d) { return d.Postcode; })
            .ToArray();

        $('#house-prices-boxplot').highcharts({
            chart: {
                type: 'boxplot'
            },
            title: {
                text: 'London Build Price 2013-2014'
            },
            legend: {
                enabled: false
            },
            subtitle: {
                text: 'Source: data.london.gov.uk'
            },
            xAxis: {
                categories: group_postcodes,
                title: {
                    text: 'Postcode'
                }
            },
            yAxis: {
                title: {
                    text: 'House Price'
                }
            },
            series: [{
                name: 'New Build Price',
                data: prices_grouped_by_postcode,
                tooltip: {
                    headerFormat: '<em>Experiment No {point.key}</em><br/>'
                }
            }]
        });
    }

    $.ajax({
        url: "date_price_inner.csv",
        async: false,
        success: function (csvd) {
            var data = $.csv.toObjects(csvd);
            setupHighcharts(data);
        },
        dataType: "text",
        complete: function () {}
    });
});