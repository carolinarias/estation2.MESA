Ext.define('esapp.view.analysis.timeseriesChartSelectionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.analysis-timeserieschartselection'


    ,getTimeseriesSelections: function(charttype){
        //var timeseriesgrid = this.getView().lookupReference('timeseries-mapset-dataset-grid');
        //var timeseriesgrid = Ext.getCmp('timeseries-mapset-dataset-grid');
        //var selectedTimeSeries = timeseriesgrid.getSelectionModel().selected.items;
        var selectedTimeSeries = null,
            wkt_polygon = this.getView().lookupReference('wkt_polygon'),
            timeseriesselected = [],
            timeseriesselections = null,
            yearTS = '',
            tsFromPeriod = '',
            tsToPeriod = '',
            yearsToCompare = '',
            tsFromSeason = null,
            tsToSeason = null,
            postfix_charttype = charttype,
            ts_from_season = '',
            ts_to_season = '',
            legend_id = null;

        //if (charttype == 'cumulative'){
        //    postfix_charttype = '_cum'
        //}
        if (charttype == 'matrix'){
            //console.info(Ext.getCmp('colorschemesMatrixTSProductGrid').getStore());
            //var legend_id = Ext.getCmp('selected-timeseries-mapset-dataset-grid_'+postfix_charttype).up().legend_id;
            Ext.getCmp('colorschemesMatrixTSProductGrid').getStore().each(function(rec){
                if (rec.get('default_legend')) {
                    legend_id = rec.get('legend_id');
                }
            },this);
        }

        //selectedTimeSeries = this.getView().down().lookupReference('selected-timeseries-mapset-dataset-grid'+postfix_charttype).getStore().getData();
        selectedTimeSeries = Ext.getCmp('selected-timeseries-mapset-dataset-grid_'+postfix_charttype).getStore().getData();
        //console.info(this.getView().down('timeseriesproductselection').lookupReference('selected-timeseries-mapset-dataset-grid'+postfix_charttype));

        if (wkt_polygon.getValue().trim() == '') {
            Ext.Msg.show({
               title: esapp.Utils.getTranslation('selectapolygon'),    // 'Select a polygon!',
               msg: esapp.Utils.getTranslation('pleaseselectapolygon'),    // 'Please select or draw a polygon in a MapView!',
               width: 300,
               buttons: Ext.Msg.OK,
               animEl: '',
               icon: Ext.Msg.WARNING
            });
            return timeseriesselections;
        }

        if (selectedTimeSeries.length >0){
            if (Ext.isObject(Ext.getCmp('radio-year_'+postfix_charttype)) && Ext.getCmp('radio-year_'+postfix_charttype).getValue()){
                if (Ext.getCmp("YearTimeseries_"+postfix_charttype).getValue()== null || Ext.getCmp("YearTimeseries_"+postfix_charttype).getValue() == '') {
                    Ext.getCmp("YearTimeseries_"+postfix_charttype).validate();
                    Ext.Msg.show({
                       title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
                       msg: esapp.Utils.getTranslation('pleaseselectayear'),    // 'Please select a year!',
                       width: 300,
                       buttons: Ext.Msg.OK,
                       animEl: '',
                       icon: Ext.Msg.WARNING
                    });
                    return timeseriesselections;
                }
                yearTS = Ext.getCmp("YearTimeseries_"+postfix_charttype).getValue();

                ts_from_season = Ext.getCmp("ts_from_season_"+postfix_charttype).getValue();
                ts_to_season = Ext.getCmp("ts_to_season_"+postfix_charttype).getValue();
                if (( (ts_from_season == null) && (ts_to_season != null) ) ||
                    ( (ts_to_season == null) && (ts_from_season != null) )
                ) {
                    ts_from_season.validate();
                    ts_to_season.validate();
                    Ext.Msg.show({
                       title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
                       msg: esapp.Utils.getTranslation('please_give_seasons_date'),    // 'Please give Seasons "From" and "To" date!',
                       width: 300,
                       buttons: Ext.Msg.OK,
                       animEl: '',
                       icon: Ext.Msg.WARNING
                    });
                    return timeseriesselections;
                }

                tsFromSeason = Ext.getCmp("ts_from_season_"+postfix_charttype).getValue();
                tsToSeason = Ext.getCmp("ts_to_season_"+postfix_charttype).getValue();
            }
            else if (Ext.isObject(Ext.getCmp('radio-fromto_'+postfix_charttype)) && Ext.getCmp('radio-fromto_'+postfix_charttype).getValue()){
                if (Ext.getCmp("ts_from_period_"+postfix_charttype).getValue()== null || Ext.getCmp("ts_from_period_"+postfix_charttype).getValue() == '') {
                    Ext.getCmp("ts_from_period_"+postfix_charttype).validate();
                    Ext.Msg.show({
                       title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
                       msg: esapp.Utils.getTranslation('pleaseselectafromdate'),    // 'Please select a "From date"!',
                       width: 300,
                       buttons: Ext.Msg.OK,
                       animEl: '',
                       icon: Ext.Msg.WARNING
                    });
                    return timeseriesselections;
                }
                if (Ext.getCmp("ts_to_period_"+postfix_charttype).getValue()== null || Ext.getCmp("ts_to_period_"+postfix_charttype).getValue() == '') {
                    Ext.getCmp("ts_to_period_"+postfix_charttype).validate();
                    Ext.Msg.show({
                       title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
                       msg: esapp.Utils.getTranslation('pleaseselectatodate'),    // 'Please select a "To date"!',
                       width: 300,
                       buttons: Ext.Msg.OK,
                       animEl: '',
                       icon: Ext.Msg.WARNING
                    });
                    return timeseriesselections;
                }
                tsFromPeriod = Ext.getCmp("ts_from_period_"+postfix_charttype).getValue();
                tsToPeriod = Ext.getCmp("ts_to_period_"+postfix_charttype).getValue();
            }
            else if (Ext.isObject(Ext.getCmp('radio-compareyears_'+postfix_charttype)) && Ext.getCmp('radio-compareyears_'+postfix_charttype).getValue()){
                var selectedYears = Ext.getCmp("ts_selectyearstocompare_"+postfix_charttype).getStore().getData();

                if (selectedYears.length < 1){
                    Ext.Msg.show({
                       title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
                       msg: esapp.Utils.getTranslation('please_select_one_or_more_years'),    // 'Please select one or more years!',
                       width: 400,
                       buttons: Ext.Msg.OK,
                       animEl: '',
                       icon: Ext.Msg.WARNING
                    });
                    return timeseriesselections;
                }
                yearsToCompare = [];
                selectedYears.each(function(year) {
                    yearsToCompare.push(year.get('year'));
                });

                ts_from_season = Ext.getCmp("ts_from_seasoncompare_"+postfix_charttype).getValue();
                ts_to_season = Ext.getCmp("ts_to_seasoncompare_"+postfix_charttype).getValue();
                if (( (ts_from_season == null) && (ts_to_season != null) ) ||
                    ( (ts_to_season == null) && (ts_from_season != null) )
                ) {
                    ts_from_season.validate();
                    ts_to_season.validate();
                    Ext.Msg.show({
                       title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
                       msg: esapp.Utils.getTranslation('please_give_seasons_date'),    // 'Please give Seasons "From" and "To" date!',
                       width: 300,
                       buttons: Ext.Msg.OK,
                       animEl: '',
                       icon: Ext.Msg.WARNING
                    });
                    return timeseriesselections;
                }

                tsFromSeason = Ext.getCmp("ts_from_seasoncompare_"+postfix_charttype).getValue();
                tsToSeason = Ext.getCmp("ts_to_seasoncompare_"+postfix_charttype).getValue();
            }
            else if (Ext.isObject(Ext.getCmp('radio-multiyears_'+postfix_charttype)) && Ext.getCmp('radio-multiyears_'+postfix_charttype).getValue()){
                var multiYearsGrid = Ext.getCmp("ts_selectmultiyears_"+postfix_charttype);
                var selectedMultiYears = multiYearsGrid.getSelection();
                //console.info(selectedMultiYears);

                if (selectedMultiYears.length < 1){
                    Ext.Msg.show({
                       title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
                       msg: esapp.Utils.getTranslation('please_select_one_or_more_years'),    // 'Please select one or more years!',
                       width: 400,
                       buttons: Ext.Msg.OK,
                       animEl: '',
                       icon: Ext.Msg.WARNING
                    });
                    return timeseriesselections;
                }
                yearsToCompare = [];
                selectedMultiYears.forEach(function(year) {
                    yearsToCompare.push(year.get('year'));
                });

                ts_from_season = Ext.getCmp("ts_from_seasonmulti_"+postfix_charttype).getValue();
                ts_to_season = Ext.getCmp("ts_to_seasonmulti_"+postfix_charttype).getValue();
                if (( (ts_from_season == null) && (ts_to_season != null) ) ||
                    ( (ts_to_season == null) && (ts_from_season != null) )
                ) {
                    ts_from_season.validate();
                    ts_to_season.validate();
                    Ext.Msg.show({
                       title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
                       msg: esapp.Utils.getTranslation('please_give_seasons_date'),    // 'Please give Seasons "From" and "To" date!',
                       width: 300,
                       buttons: Ext.Msg.OK,
                       animEl: '',
                       icon: Ext.Msg.WARNING
                    });
                    return timeseriesselections;
                }

                tsFromSeason = Ext.getCmp("ts_from_seasonmulti_"+postfix_charttype).getValue();
                tsToSeason = Ext.getCmp("ts_to_seasonmulti_"+postfix_charttype).getValue();
            }
            //else if (Ext.getCmp('radio-compareseasons').getValue()){
            //    if (Ext.getCmp("ts_from_season").getValue()== null ||
            //        Ext.getCmp("ts_from_season").getValue() == '' ||
            //        Ext.getCmp("ts_to_season").getValue()== null ||
            //        Ext.getCmp("ts_to_season").getValue() == ''
            //    ) {
            //        Ext.getCmp("ts_from_season").validate();
            //        Ext.getCmp("ts_to_season").validate();
            //        Ext.Msg.show({
            //           title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
            //           msg: esapp.Utils.getTranslation('pleaseselectafromdate'),    // 'Please select a "From date"!',
            //           width: 300,
            //           buttons: Ext.Msg.OK,
            //           animEl: '',
            //           icon: Ext.Msg.WARNING
            //        });
            //        return timeseriesselections;
            //    }
            //
            //    if (Ext.getCmp("seasonYear1").getValue()== null ||
            //        Ext.getCmp("seasonYear1").getValue() == '' ||
            //        Ext.getCmp("seasonYear2").getValue()== null ||
            //        Ext.getCmp("seasonYear2").getValue() == ''
            //    ) {
            //        Ext.getCmp("seasonYear1").validate();
            //        Ext.getCmp("seasonYear2").validate();
            //        Ext.Msg.show({
            //           title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
            //           msg: esapp.Utils.getTranslation('pleaseselectafromdate'),    // 'Please select a "From date"!',
            //           width: 300,
            //           buttons: Ext.Msg.OK,
            //           animEl: '',
            //           icon: Ext.Msg.WARNING
            //        });
            //        return timeseriesselections;
            //    }
            //
            //    tsFromSeason = Ext.getCmp("ts_from_season").getValue();
            //    tsToSeason = Ext.getCmp("ts_to_season").getValue();
            //    tsYear1Season = Ext.getCmp("seasonYear1").getValue();
            //    tsYear2Season = Ext.getCmp("seasonYear2").getValue();
            //
            //}
            else {
                Ext.Msg.show({
                   title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
                   msg: esapp.Utils.getTranslation('pleaseselectatimeframe'),    // 'Please select a "From date"!',
                   width: 300,
                   buttons: Ext.Msg.OK,
                   animEl: '',
                   icon: Ext.Msg.WARNING
                });
                return timeseriesselections;
            }

            selectedTimeSeries.each(function(product) {
                var productObj = {
                    "productcode": product.get('productcode'),
                    "version": product.get('version'),
                    "subproductcode": product.get('subproductcode'),
                    "mapsetcode": product.get('mapsetcode'),
                    "date_format": product.get('date_format'),
                    "frequency_id": product.get('frequency_id'),
                    "cumulative": product.get('cumulative'),
                    "difference": product.get('difference'),
                    "reference": product.get('reference'),
                    "colorramp": product.get('colorramp') ? product.get('colorramp') : false,
                    "legend_id": legend_id,
                    "zscore": product.get('zscore') ? product.get('zscore') : false     // checkbox gives no value when not checked so no value is passed. Forse false in this case.
                };
                //console.info(product);
                timeseriesselected.push(productObj);
            });
            //console.info(timeseriesselected);
            timeseriesselected = Ext.util.JSON.encode(timeseriesselected);
        }
        else {
            Ext.Msg.show({
               title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
               msg: esapp.Utils.getTranslation('pleaseselectatimeseries'),    // 'Please select one or more times series!',
               width: 300,
               buttons: Ext.Msg.OK,
               animEl: '',
               icon: Ext.Msg.WARNING
            });
            return timeseriesselections;
        }

        timeseriesselections = {
            charttype: charttype,
            selectedTimeseries: timeseriesselected,
            yearTS: yearTS,
            tsFromPeriod: tsFromPeriod,
            tsToPeriod: tsToPeriod,
            yearsToCompare: yearsToCompare,
            tsFromSeason: tsFromSeason,
            tsToSeason: tsToSeason,
            wkt: wkt_polygon.getValue()
        };

        return timeseriesselections
    }

    ,generateTimeseriesChart: function(btn){
        var TSChartWinConfig = this.getTimeseriesSelections(btn.charttype);
        if (TSChartWinConfig != null){
            var newTSChartWin = new esapp.view.analysis.timeseriesChartView(TSChartWinConfig);

            Ext.getCmp('analysismain').add(newTSChartWin);
            //this.getView().add(newTSChartWin);
            newTSChartWin.show();
        }
    }

    //,__getTimeseriesSelectionsCumulative: function(){
    //    //var timeseriesgrid = this.getView().lookupReference('timeseries-mapset-dataset-grid');
    //    //var timeseriesgrid = Ext.getCmp('timeseries-mapset-dataset-grid');
    //    //var selectedTimeSeries = timeseriesgrid.getSelectionModel().selected.items;
    //    var selectedTimeSeries = this.getView().down('timeseriesproductselection').lookupReference('selected-timeseries-mapset-dataset-grid').getStore().getData(),
    //        wkt_polygon = this.getView().lookupReference('wkt_polygon'),
    //        timeseriesselected = [],
    //        timeseriesselections = null,
    //        yearTS = '',
    //        tsFromPeriod = '',
    //        tsToPeriod = '',
    //        yearsToCompare = '',
    //        tsFromSeason = null,
    //        tsToSeason = null;
    //
    //    if (wkt_polygon.getValue().trim() == '') {
    //        Ext.Msg.show({
    //           title: esapp.Utils.getTranslation('selectapolygon'),    // 'Select a polygon!',
    //           msg: esapp.Utils.getTranslation('pleaseselectapolygon'),    // 'Please select or draw a polygon in a MapView!',
    //           width: 300,
    //           buttons: Ext.Msg.OK,
    //           animEl: '',
    //           icon: Ext.Msg.WARNING
    //        });
    //        return timeseriesselections;
    //    }
    //
    //    if (selectedTimeSeries.length >0){
    //        if (Ext.getCmp('radio-year').getValue()){
    //            if (Ext.getCmp("YearTimeseries").getValue()== null || Ext.getCmp("YearTimeseries").getValue() == '') {
    //                Ext.getCmp("YearTimeseries").validate();
    //                Ext.Msg.show({
    //                   title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
    //                   msg: esapp.Utils.getTranslation('pleaseselectayear'),    // 'Please select a year!',
    //                   width: 300,
    //                   buttons: Ext.Msg.OK,
    //                   animEl: '',
    //                   icon: Ext.Msg.WARNING
    //                });
    //                return timeseriesselections;
    //            }
    //            yearTS = Ext.getCmp("YearTimeseries").getValue();
    //        }
    //        else if (Ext.getCmp('radio-fromto').getValue()){
    //            if (Ext.getCmp("ts_from_period").getValue()== null || Ext.getCmp("ts_from_period").getValue() == '') {
    //                Ext.getCmp("ts_from_period").validate();
    //                Ext.Msg.show({
    //                   title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
    //                   msg: esapp.Utils.getTranslation('pleaseselectafromdate'),    // 'Please select a "From date"!',
    //                   width: 300,
    //                   buttons: Ext.Msg.OK,
    //                   animEl: '',
    //                   icon: Ext.Msg.WARNING
    //                });
    //                return timeseriesselections;
    //            }
    //            if (Ext.getCmp("ts_to_period").getValue()== null || Ext.getCmp("ts_to_period").getValue() == '') {
    //                Ext.getCmp("ts_to_period").validate();
    //                Ext.Msg.show({
    //                   title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
    //                   msg: esapp.Utils.getTranslation('pleaseselectatodate'),    // 'Please select a "To date"!',
    //                   width: 300,
    //                   buttons: Ext.Msg.OK,
    //                   animEl: '',
    //                   icon: Ext.Msg.WARNING
    //                });
    //                return timeseriesselections;
    //            }
    //            tsFromPeriod = Ext.getCmp("ts_from_period").getValue();
    //            tsToPeriod = Ext.getCmp("ts_to_period").getValue();
    //        }
    //        else if (Ext.getCmp('radio-compareyears').getValue()){
    //            var selectedYears = Ext.getCmp("ts_selectyearstocompare").getStore().getData();
    //
    //            if (selectedYears.length < 1){
    //                Ext.Msg.show({
    //                   title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
    //                   msg: esapp.Utils.getTranslation('please select one or more years'),    // 'Please select at least one year to compare!',
    //                   width: 400,
    //                   buttons: Ext.Msg.OK,
    //                   animEl: '',
    //                   icon: Ext.Msg.WARNING
    //                });
    //                return timeseriesselections;
    //            }
    //            yearsToCompare = [];
    //            selectedYears.each(function(year) {
    //                yearsToCompare.push(year.get('year'));
    //            });
    //
    //            var ts_from_season = Ext.getCmp("ts_from_season").getValue();
    //            var ts_to_season = Ext.getCmp("ts_to_season").getValue();
    //            if (( (ts_from_season == null) && (ts_to_season != null) ) ||
    //                ( (ts_to_season == null) && (ts_from_season != null) )
    //            ) {
    //                ts_from_season.validate();
    //                ts_to_season.validate();
    //                Ext.Msg.show({
    //                   title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
    //                   msg: esapp.Utils.getTranslation('Please give Seasons "From" and "To" date!'),    // 'Please choose both "From" and "To" date!',
    //                   width: 300,
    //                   buttons: Ext.Msg.OK,
    //                   animEl: '',
    //                   icon: Ext.Msg.WARNING
    //                });
    //                return timeseriesselections;
    //            }
    //
    //            tsFromSeason = Ext.getCmp("ts_from_season").getValue();
    //            tsToSeason = Ext.getCmp("ts_to_season").getValue();
    //        }
    //
    //        //else if (Ext.getCmp('radio-compareseasons').getValue()){
    //        //    if (Ext.getCmp("ts_from_season").getValue()== null ||
    //        //        Ext.getCmp("ts_from_season").getValue() == '' ||
    //        //        Ext.getCmp("ts_to_season").getValue()== null ||
    //        //        Ext.getCmp("ts_to_season").getValue() == ''
    //        //    ) {
    //        //        Ext.getCmp("ts_from_season").validate();
    //        //        Ext.getCmp("ts_to_season").validate();
    //        //        Ext.Msg.show({
    //        //           title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
    //        //           msg: esapp.Utils.getTranslation('pleaseselectafromdate'),    // 'Please select a "From date"!',
    //        //           width: 300,
    //        //           buttons: Ext.Msg.OK,
    //        //           animEl: '',
    //        //           icon: Ext.Msg.WARNING
    //        //        });
    //        //        return timeseriesselections;
    //        //    }
    //        //
    //        //    if (Ext.getCmp("seasonYear1").getValue()== null ||
    //        //        Ext.getCmp("seasonYear1").getValue() == '' ||
    //        //        Ext.getCmp("seasonYear2").getValue()== null ||
    //        //        Ext.getCmp("seasonYear2").getValue() == ''
    //        //    ) {
    //        //        Ext.getCmp("seasonYear1").validate();
    //        //        Ext.getCmp("seasonYear2").validate();
    //        //        Ext.Msg.show({
    //        //           title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
    //        //           msg: esapp.Utils.getTranslation('pleaseselectafromdate'),    // 'Please select a "From date"!',
    //        //           width: 300,
    //        //           buttons: Ext.Msg.OK,
    //        //           animEl: '',
    //        //           icon: Ext.Msg.WARNING
    //        //        });
    //        //        return timeseriesselections;
    //        //    }
    //        //
    //        //    tsFromSeason = Ext.getCmp("ts_from_season").getValue();
    //        //    tsToSeason = Ext.getCmp("ts_to_season").getValue();
    //        //    tsYear1Season = Ext.getCmp("seasonYear1").getValue();
    //        //    tsYear2Season = Ext.getCmp("seasonYear2").getValue();
    //        //
    //        //}
    //        else {
    //            Ext.Msg.show({
    //               title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
    //               msg: esapp.Utils.getTranslation('pleaseselectatimeframe'),    // 'Please select a "From date"!',
    //               width: 300,
    //               buttons: Ext.Msg.OK,
    //               animEl: '',
    //               icon: Ext.Msg.WARNING
    //            });
    //            return timeseriesselections;
    //        }
    //
    //        selectedTimeSeries.each(function(product) {
    //            var productObj = {
    //                "productcode": product.get('productcode'),
    //                "version": product.get('version'),
    //                "subproductcode": product.get('subproductcode'),
    //                "mapsetcode": product.get('mapsetcode'),
    //                "date_format": product.get('date_format'),
    //                "cumulative": product.get('cumulative')
    //            };
    //            //console.info(product);
    //            timeseriesselected.push(productObj);
    //        });
    //        //console.info(timeseriesselected);
    //        timeseriesselected = Ext.util.JSON.encode(timeseriesselected);
    //    }
    //    else {
    //        Ext.Msg.show({
    //           title: esapp.Utils.getTranslation('mandatoryfield'),    // 'Mandatory field',
    //           msg: esapp.Utils.getTranslation('pleaseselectatimeseries'),    // 'Please select one or more times series!',
    //           width: 300,
    //           buttons: Ext.Msg.OK,
    //           animEl: '',
    //           icon: Ext.Msg.WARNING
    //        });
    //        return timeseriesselections;
    //    }
    //
    //    timeseriesselections = {
    //        selectedTimeseries: timeseriesselected,
    //        yearTS: yearTS,
    //        tsFromPeriod: tsFromPeriod,
    //        tsToPeriod: tsToPeriod,
    //        yearsToCompare: yearsToCompare,
    //        tsFromSeason: tsFromSeason,
    //        tsToSeason: tsToSeason,
    //        //tsYear1Season: tsYear1Season,
    //        //tsYear2Season: tsYear2Season,
    //        wkt: wkt_polygon.getValue(),
    //        charttype: 'default',
    //        country:'',
    //        region: ''
    //    };
    //
    //    return timeseriesselections
    //}
    //
    //,__loadTimeseriesProductsGrid: function() {
    //
    //    var prodgrid = this.getView().lookupReference('TimeSeriesProductsGrid');
    //    var myLoadMask = new Ext.LoadMask({
    //        msg    : esapp.Utils.getTranslation('loading'), // 'Loading...',
    //        target : prodgrid
    //    });
    //    myLoadMask.show();
    //
    //    this.getStore('products').load({
    //        callback:function(){
    //            myLoadMask.hide();
    //        }
    //    });
    //}
    //
    //,__TimeseriesProductsGridRowClick: function(gridview, record){
    //    var selectedTimeSeriesProducts = gridview.getSelectionModel().selected.items;
    //    var timeseriesmapsetdatasets = [];
    //    var yearsData = [];
    //
    //    function union_arrays (x, y) {
    //      var obj = {};
    //      for (var i = x.length-1; i >= 0; -- i)
    //         obj[x[i]] = x[i];
    //      for (var i = y.length-1; i >= 0; -- i)
    //         obj[y[i]] = y[i];
    //      var res = []
    //      for (var k in obj) {
    //        if (obj.hasOwnProperty(k))  // <-- optional
    //          res.push(obj[k]);
    //      }
    //      return res;
    //    }
    //
    //    selectedTimeSeriesProducts.forEach(function(product) {
    //        // ToDO: First loop the mapsets to get the by the user selected mapset if the product has > 1 mapsets.
    //        var datasets = product.get('productmapsets')[0].timeseriesmapsetdatasets;
    //        datasets.forEach(function(datasetObj) {
    //            //yearsData = Ext.Object.merge(yearsData, datasetObj.years);
    //            yearsData = union_arrays(yearsData, datasetObj.years);
    //            //console.info(yearsData);
    //            timeseriesmapsetdatasets.push(datasetObj);
    //        });
    //        //console.info(product.get('productmapsets')[0].timeseriesmapsetdatasets);
    //    });
    //    var yearsDataDict = [];
    //    yearsData.forEach(function(year) {
    //        yearsDataDict.push({'year': year});
    //    });
    //    //var productmapset = record.get('productmapsets')[0];
    //    this.getStore('years').setData(yearsDataDict);
    //    this.getStore('timeseriesmapsetdatasets').setData(timeseriesmapsetdatasets);
    //    //console.info(timeseriesmapsetdatasets);
    //
    //    if (selectedTimeSeriesProducts.length == 0) {
    //        Ext.getCmp('timeseries-mapset-dataset-grid').hide();
    //        Ext.getCmp('ts_timeframe').hide();
    //        Ext.getCmp('gettimeseries_btn').setDisabled(true);
    //        //Ext.getCmp('gettimeseries_btn2').setDisabled(true);
    //    }
    //    else {
    //        Ext.getCmp('timeseries-mapset-dataset-grid').show();
    //        Ext.getCmp('ts_timeframe').show();
    //        Ext.getCmp('gettimeseries_btn').setDisabled(false);
    //        //Ext.getCmp('gettimeseries_btn2').setDisabled(false);
    //    }
    //}
    //
    //,__editTSDrawProperties: function(gridview, recordID){
    //    var source = {};
    //    var myNewRecord = null;
    //    var TSrecord = gridview.store.getAt(recordID);
    //    var tsDrawPropertiesStore = this.getStore('timeseriesdrawproperties');
    //
    //    if (!tsDrawPropertiesStore.isLoaded())
    //        tsDrawPropertiesStore.load();
    //
    //    tsDrawPropertiesStore.clearFilter(true);
    //    tsDrawPropertiesStore.filterBy(function (record, id) {
    //        if (record.get("productcode") == TSrecord.get('productcode') && record.get("version") == TSrecord.get('version') && record.get("subproductcode") == TSrecord.get('subproductcode')) {
    //            return true;
    //        }
    //        return false;
    //    });
    //
    //    var tsdrawprobs_record = tsDrawPropertiesStore.findRecord('productcode', TSrecord.get('productcode'));
    //
    //    //console.info(tsdrawprobs_record);
    //    if (tsdrawprobs_record == null){
    //        var newtitle = '',
    //            newunit = '',
    //            newmin = null,
    //            newmax = null,
    //            newoposite = false,
    //            newcharttype = 'line',
    //            newyaxes_id = TSrecord.get('productcode') + ' - ' + TSrecord.get('version'),
    //            newtitle_color = esapp.Utils.convertRGBtoHex('0 0 0');
    //
    //        tsDrawPropertiesStore.clearFilter(true);
    //        tsDrawPropertiesStore.filterBy(function (record, id) {
    //            if (record.get("productcode") == TSrecord.get('productcode') && record.get("version") == TSrecord.get('version')) {
    //                return true;
    //            }
    //            return false;
    //        });
    //
    //        var similarTSrecord = tsDrawPropertiesStore.getAt(0);
    //        if (similarTSrecord != null){
    //            newtitle = similarTSrecord.get('title');
    //            newunit = similarTSrecord.get('unit');
    //            newmin = similarTSrecord.get('min');
    //            newmax = similarTSrecord.get('max');
    //            newoposite = similarTSrecord.get('oposite');
    //            newcharttype = similarTSrecord.get('charttype');
    //            newyaxes_id = similarTSrecord.get('yaxes_id');
    //            newtitle_color = similarTSrecord.get('title_color');
    //        }
    //
    //        //myNewRecord = new tsDrawPropertiesStore.recordType({
    //        myNewRecord = new esapp.model.TSDrawProperties({
    //            productcode: TSrecord.get('productcode'),
    //            subproductcode: TSrecord.get('subproductcode'),
    //            version: TSrecord.get('version'),
    //            title: newtitle,
    //            unit: newunit,
    //            min: newmin,
    //            max: newmax,
    //            oposite: newoposite,
    //            tsname_in_legend: TSrecord.get('productcode') + ' - ' + TSrecord.get('version') + ' - ' + TSrecord.get('subproductcode'),
    //            charttype: newcharttype,
    //            linestyle: 'Solid',
    //            linewidth: 2,
    //            color: esapp.Utils.convertRGBtoHex('0 0 0'),
    //            yaxes_id: newyaxes_id,
    //            title_color: newtitle_color,
    //            aggregation_type: 'mean',
    //            aggregation_min: null,
    //            aggregation_max: null
    //        });
    //
    //        tsDrawPropertiesStore.add(myNewRecord);
    //        tsdrawprobs_record = myNewRecord;
    //
    //        createTSDrawPropertiesWin();
    //
    //    }
    //    else {
    //        createTSDrawPropertiesWin();
    //    }
    //
    //    //var texteditor = new Ext.grid.GridEditor(new Ext.form.TextField({allowBlank: false,selectOnFocus: true}));
    //    //var numbereditor = new Ext.grid.GridEditor(new Ext.form.NumberField({allowBlank: false,selectOnFocus: true}));
    //    //var cedit = new Ext.grid.GridEditor(new Ext.ux.ColorField({allowBlank: false,selectOnFocus: true}));
    //
    //    function createTSDrawPropertiesWin(){
    //        var myTSDrawPropertiesWin = Ext.getCmp('TSDrawPropertiesWin');
    //        if (myTSDrawPropertiesWin!=null && myTSDrawPropertiesWin!='undefined' ) {
    //            myTSDrawPropertiesWin.close();
    //        }
    //
    //        var colorrenderer = function(color) {
    //            renderTpl = color;
    //
    //            if (color.trim()==''){
    //                renderTpl = 'transparent';
    //            }
    //            else {
    //                renderTpl = '<span style="background:rgb(' + esapp.Utils.HexToRGB(color) + '); color:' + esapp.Utils.invertHexToRGB(color) + ';">' + esapp.Utils.HexToRGB(color) + '</span>';
    //            }
    //            return renderTpl;
    //        }
    //
    //        source = {
    //            yaxes_id: tsdrawprobs_record.get('yaxes_id'),
    //            tsname_in_legend: tsdrawprobs_record.get('tsname_in_legend'),
    //            //oposite: tsdrawprobs_record.get('oposite'),
    //            //unit: tsdrawprobs_record.get('unit'),
    //            charttype: tsdrawprobs_record.get('charttype'),
    //            linestyle: tsdrawprobs_record.get('linestyle'),
    //            linewidth: tsdrawprobs_record.get('linewidth'),
    //            color: esapp.Utils.convertRGBtoHex(tsdrawprobs_record.get('color'))
    //            //aggregation_type: tsdrawprobs_record.get('aggregation_type'),
    //            //aggregation_min: tsdrawprobs_record.get('aggregation_min'),
    //            //aggregation_max: tsdrawprobs_record.get('aggregation_max')
    //        }
    //
    //        var TSDrawPropertiesWin = new Ext.Window({
    //             id:'TSDrawPropertiesWin'
    //            ,title: esapp.Utils.getTranslation('Time series draw properties for ') + tsdrawprobs_record.get('productcode') + ' - ' + tsdrawprobs_record.get('version') + ' - ' +  tsdrawprobs_record.get('subproductcode')
    //            ,width:450
    //            ,plain: true
    //            ,modal: true
    //            ,resizable: true
    //            ,closable:true
    //            ,layout: {
    //                 type: 'fit'
    //            },
    //            listeners: {
    //                close: function(){
    //                    //console.info('closing window and removing filter');
    //                    tsDrawPropertiesStore.clearFilter(true);
    //                }
    //            }
    //            ,items:[{
    //                xtype: 'propertygrid',
    //                //nameField: 'Property',
    //                //width: 400,
    //                nameColumnWidth: 160,
    //                sortableColumns: false,
    //                source: source,
    //                sourceConfig: {
    //                    yaxes_id: {
    //                        displayName: esapp.Utils.getTranslation('yaxes_id'),   // 'Yaxe ID',
    //                        //type: 'text',
    //                        editor: {
    //                            xtype: 'textfield',
    //                            selectOnFocus:false
    //                        }
    //                    },
    //                    tsname_in_legend: {
    //                        displayName: esapp.Utils.getTranslation('tsname_in_legend'),   // 'Time series name in legend',
    //                        //type: 'text',
    //                        editor: {
    //                            xtype: 'textfield',
    //                            selectOnFocus:false
    //                        }
    //                    },
    //
    //                    //oposite: {
    //                    //    displayName: esapp.Utils.getTranslation('oposite'),   // 'Oposite',
    //                    //    type: 'boolean'
    //                    //},
    //                    //unit: {
    //                    //    displayName: esapp.Utils.getTranslation('unit'),   // 'Unit',
    //                    //    //type: 'text',
    //                    //    editor: {
    //                    //        xtype: 'textfield',
    //                    //        selectOnFocus:false
    //                    //    }
    //                    //},
    //                    charttype: {
    //                        displayName: esapp.Utils.getTranslation('charttype'),   // 'Chart type',
    //                        editor: {
    //                            xtype: 'combobox',
    //                            store: ['line', 'column'],
    //                            forceSelection: true
    //                        }
    //                    },
    //                    linestyle: {
    //                        displayName: esapp.Utils.getTranslation('linestyle'),   // 'Line style',
    //                        editor: {
    //                            xtype: 'combobox',
    //                            store: ['Solid',
    //                                    'ShortDash',
    //                                    'ShortDot',
    //                                    'ShortDashDot',
    //                                    'ShortDashDotDot',
    //                                    'Dot',
    //                                    'Dash',
    //                                    'LongDash',
    //                                    'DashDot',
    //                                    'LongDashDot',
    //                                    'LongDashDotDot'],
    //                            forceSelection: true
    //                        }
    //                    },
    //                    linewidth: {
    //                        displayName: esapp.Utils.getTranslation('linewidth'),   // Line width',
    //                        type: 'number'
    //                    },
    //                    color: {
    //                        displayName: esapp.Utils.getTranslation('color'),   // 'Colour',
    //                        editor: {
    //                            xtype: 'mycolorpicker'
    //                        }
    //                        ,renderer: colorrenderer
    //                    }
    //                    //,aggregation_type: {
    //                    //    displayName: esapp.Utils.getTranslation('aggregation_type'),   // 'Aggregation type',
    //                    //    editor: {
    //                    //        xtype: 'combobox',
    //                    //        store: ['mean', 'count'],
    //                    //        forceSelection: true
    //                    //    }
    //                    //},
    //                    //aggregation_min: {
    //                    //    displayName: esapp.Utils.getTranslation('aggregation_min'),   // 'Aggregation min',
    //                    //    type: 'number'
    //                    //},
    //                    //aggregation_max: {
    //                    //    displayName: esapp.Utils.getTranslation('aggregation_max'),   // 'Aggregation max',
    //                    //    type: 'number'
    //                    //}
    //                },
    //                listeners: {
    //                    propertychange: function( source, recordId, value, oldValue, eOpts ){
    //                        if (value != oldValue)
    //                            tsdrawprobs_record.set(recordId, value)
    //                    }
    //                }
    //            }]
    //
    //        });
    //        TSDrawPropertiesWin.show();
    //        TSDrawPropertiesWin.alignTo(gridview.getEl(),"r-tr", [-6, 0]);  // See: http://www.extjs.com/deploy/dev/docs/?class=Ext.Window&member=alignTo
    //    }
    //}
});
