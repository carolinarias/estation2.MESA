
Ext.define("esapp.view.analysis.timeseriesChartView",{
    "extend": "Ext.window.Window",
    "controller": "analysis-timeserieschartview",
    "viewModel": {
        "type": "analysis-timeserieschartview"
    },

    xtype: 'timeserieschart-window',

    requires: [
        'esapp.view.analysis.timeseriesChartViewModel',
        'esapp.view.analysis.timeseriesChartViewController',

        'Ext.window.Window',
        'Ext.toolbar.Toolbar'
    ],

    title: '<span class="panel-title-style"Time series</span>',
    margin: '0 0 0 0',
    layout: {
        type: 'fit'
    },
    width:850,
    height:800,
    minWidth:400,
    minHeight:350,
    // glyph : 'xf080@FontAwesome',
    constrain: true,
    autoShow : false,
    closeable: true,
    closeAction: 'destroy', // 'hide',
    maximizable: true,
    collapsible: true,

    header: {
        titlePosition: 2,
        titleAlign: "center"
    },

    tschart: null,
    selectedTimeseries: null,
    yearTS: null,
    tsFromPeriod: null,
    tsToPeriod: null,
    wkt: null,

    tools: [
    {
        type: 'gear',
        tooltip: 'Show/hide time series chart tools menu',
        callback: function (tswin) {
            // toggle hide/show toolbar and adjust map size.
            var winBodyWidth = tswin.getWidth()-5;
            var winBodyHeight = tswin.getHeight()-45;
            var tsToolbar = tswin.getDockedItems('toolbar[dock="top"]')[0];
            var widthToolbar = tsToolbar.getWidth();
            var heightToolbar = tsToolbar.getHeight();
            if (tsToolbar.hidden == false) {
                tsToolbar.setHidden(true);
                winBodyWidth = document.getElementById(tswin.id + "-body").offsetWidth;
                winBodyHeight =  document.getElementById(tswin.id + "-body").offsetHeight; //+heightToolbar;
            }
            else {
                tsToolbar.setHidden(false);
                winBodyWidth = document.getElementById(tswin.id + "-body").offsetWidth;
                winBodyHeight = document.getElementById(tswin.id + "-body").offsetHeight-heightToolbar;
            }
            tswin.tschart.setSize(winBodyWidth, winBodyHeight);
            tswin.tschart.redraw();
        }
    }],

    listeners: {
        afterrender: function () {
            var me = this;
            // ToDO: create new function in controller getTimeseries() with ajax call and create chart in callback ajax call!!

            function is_array(input){
              return typeof(input)=='object'&&(input instanceof Array);
            }

            function RGBtoHex(R,G,B) {return "#"+toHex(R)+toHex(G)+toHex(B)}

            function toHex(N) {
                if (N==null) return "00";
                N=parseInt(N); if (N==0 || isNaN(N)) return "00";
                N=Math.max(0,N); N=Math.min(N,255); N=Math.round(N);
                return "0123456789ABCDEF".charAt((N-N%16)/16) + "0123456789ABCDEF".charAt(N%16);
            }

            var myLoadMask = new Ext.LoadMask({
                msg    : 'Generating requested time series...',
                target : Ext.getCmp(me.id)
            });
            myLoadMask.show();


            Ext.Ajax.request({
                url:"analysis/gettimeseries",
                timeout : 300000,
                params:{
                    selectedTimeseries: me.selectedTimeseries,
                    yearTS: me.yearTS,
                    tsFromPeriod: Ext.Date.format(me.tsFromPeriod, 'Y-m-d'),
                    tsToPeriod: Ext.Date.format(me.tsToPeriod, 'Y-m-d'),
                    WKT:me.wkt
                },
                method: 'POST',
                success: function ( result, request ) {
                    myLoadMask.hide();
                    var json = Ext.util.JSON.decode(result.responseText);
                    //var subtitle =  Ext.ux.util.Encoder.htmlDecode(json.countryName) + ' - ' + Ext.ux.util.Encoder.htmlDecode(json.areaName) + ' ( ID: '+json.rasterpointID+')';
                    //console.info(json);

	                var title = Ext.String.htmlDecode(json.countryName) + ' - ' + Ext.String.htmlDecode(json.areaName);
	                var subtitle = ' ';
                    var plotBackgroundImage = '';
                    var categories = [];
                    //var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                    if (json.data_available) {
                        //var cats = json.xaxis.categories;
                        //for (var i = 0; i < cats.length; i++) {
                        //    var year = cats[i].substring(0,4);
                        //    var month = cats[i].substring(4,6);
                        //    var day = cats[i].substring(6,8);
                        //    categories[i] = Date.UTC(year, month-1, day); // Date.UTC(year, month-1, day);
                        //}
                    } else {
                        plotBackgroundImage = 'resources/img/no_data.gif';
                    }

                    var xAxisLabels = {};
                    if (json.showYearInTicks){
                        xAxisLabels = {
                            enabled: 1,
                            rotation: 270,
                            y:28,
                            //style: xaxis_labelstyle,
                            formatter: function() {
                                return Highcharts.dateFormat('%b', this.value)+'<br/>'+Highcharts.dateFormat('\'%y', this.value);
                            }
                        };
                    } else {
                        xAxisLabels = {
                            enabled: 1,
                            rotation: 270,
                            y:28,
                            //style: xaxis_labelstyle,
                            formatter: function() {
                                return Highcharts.dateFormat('%b', this.value);
                            }
                        };
                    }

                    for (var tscount = 0; tscount < json.timeseries.length; tscount++) {

                         var tscolor = json.timeseries[tscount].color;
                         var tstype = json.timeseries[tscount].type;
                         var tsname = json.timeseries[tscount].name;

                         if (tsname.indexOf('transparent') == -1 ) { // Not a transparent timeseries
                             if (tstype == 'area'){
                                 tscolor = json.timeseries[tscount].fillColor;
                             }
                             if(tscolor.charAt(0)!="#"){ // convert RBG to HEX if RGB value is given. Highcharts excepts only HEX.
                                 var rgbarr = [];
                                 if (is_array(tscolor)){
                                     rgbarr = tscolor;
                                 }
                                 else {
                                     rgbarr = tscolor.split(" "); // toString().replace(/,/g,' ');
                                 }

                                 var tsR = rgbarr[0];
                                 var tsG = rgbarr[1];
                                 var tsB = rgbarr[2];
                                 tscolor = RGBtoHex(tsR,tsG,tsB);
                                 if (tstype == 'area'){
                                     json.timeseries[tscount].fillColor = tscolor;
                                 }
                                 else {
                                     json.timeseries[tscount].color = tscolor;
                                 }
                             }
                         }
                    }

                    var Yaxes = [];
                    for (var yaxescount = 0; yaxescount < json.yaxes.length; yaxescount++) {
                        var opposite = false;
                        if (json.yaxes[yaxescount].opposite == 'true')
                            opposite = true;
                        var unit = json.yaxes[yaxescount].unit;
                        if (json.yaxes[yaxescount].unit == null)
                            unit = ''
                        var yaxe = {
                            id: json.yaxes[yaxescount].id,
                            tickAmount: 8,
                            gridLineWidth: 1,
                            labels: {
                                format: '{value} '+unit,
                                style: {
                                    color: Highcharts.getOptions().colors[yaxescount],
                                    font: 'bold 16px Arial, Verdana, Helvetica, sans-serif'
                                }
                            },
                            title: {
                                text: json.yaxes[yaxescount].title,
                                style: {
                                    color: Highcharts.getOptions().colors[yaxescount],
                                    font: 'bold 20px Arial, Verdana, Helvetica, sans-serif'
                                }
                            },
                            opposite: opposite,
                            min:parseFloat(json.yaxes[yaxescount].min),
                            max:parseFloat(json.yaxes[yaxescount].max)
                        };
                        Yaxes.push(yaxe);
                    }

                    //var Yaxes = [{ // Primary yAxis
                    //    labels: {
                    //        format: '{value}°C',
                    //        style: {
                    //            color: Highcharts.getOptions().colors[2]
                    //        }
                    //    },
                    //    title: {
                    //        text: 'Temperature',
                    //        style: {
                    //            color: Highcharts.getOptions().colors[2]
                    //        }
                    //    },
                    //    opposite: true
                    //
                    //}, { // Secondary yAxis
                    //    gridLineWidth: 0,
                    //    title: {
                    //        text: 'Rainfall',
                    //        style: {
                    //            color: Highcharts.getOptions().colors[0]
                    //        }
                    //    },
                    //    labels: {
                    //        format: '{value} mm',
                    //        style: {
                    //            color: Highcharts.getOptions().colors[0]
                    //        }
                    //    }
                    //}, { // Tertiary yAxis
                    //    gridLineWidth: 0,
                    //    title: {
                    //        text: 'Sea-Level Pressure',
                    //        style: {
                    //            color: Highcharts.getOptions().colors[1]
                    //        }
                    //    },
                    //    labels: {
                    //        format: '{value} mb',
                    //        style: {
                    //            color: Highcharts.getOptions().colors[1]
                    //        }
                    //    },
                    //    opposite: true
                    //}];

                    var timeseries = json.timeseries;
                    //var timeseries = [{
                    //    name: 'Rainfall',
                    //    type: 'column',
                    //    yAxis: 1,
                    //    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                    //    tooltip: {
                    //        valueSuffix: ' mm'
                    //    }
                    //
                    //}, {
                    //    name: 'Sea-Level Pressure',
                    //    type: 'spline',
                    //    yAxis: 2,
                    //    data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
                    //    marker: {
                    //        enabled: false
                    //    },
                    //    dashStyle: 'shortdot',
                    //    tooltip: {
                    //        valueSuffix: ' mb'
                    //    }
                    //
                    //}, {
                    //    name: 'Temperature',
                    //    type: 'spline',
                    //    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                    //    tooltip: {
                    //        valueSuffix: ' °C'
                    //    }
                    //}];

                    var spacingRight = 10;
                    if (json.yaxes.length == 1){
                        spacingRight = 40;
                    }

                    me.tschart = new Highcharts.Chart({
                        //colors: ['#006600', '#000000', '#0070CC', '#00008A', '#8C8C8C', '#1EB611', '#FF9655', '#FFF263', '#6AF9C4'],
                        chart: {
                            renderTo:'tschart_'+me.id,
                            className: 'chartfitlayout',
                            zoomType: 'xy',
                            spacingRight: spacingRight,
                            //margin: chartMargin, // [35, 15, 65, 65],  // for legend on the bottom of the chart
                            //marginTop:top,
                            //marginRight: marginright,
                            //marginBottom:bottom,
                            //marginLeft:left,
                            plotBackgroundImage: plotBackgroundImage
                        },
                        credits: {
                           enabled: false
                        },
                        plotOptions: {
                            series: {
                                marker: {
                                    enabled: false,
                                    states: {
                                        hover: {
                                            enabled: true,
                                            radius: 4,
                                            radiusPlus: 0
                                            // lineWidthPlus: 2,
                                        }
                                    }
                                },
                                states: {
                                    hover: {
                                        halo: {
                                            size: 0
                                        },
                                        lineWidthPlus: 1
                                    }
                                }
                            }
                        },
                        title: {
                            text: 'Title'
                        },
                        subtitle: {
                            text: 'Sub title'
                        },
                        xAxis: [{
                            type: 'datetime'
                            //dateTimeLabelFormats: {
                            //    day: '%e %b'
                            //},
                            //categories: categories,
                            //crosshair: true,
                            //labels: xAxisLabels,
                           //,tickInterval: 3 // json.xaxis.ticks
                        }],
                        yAxis: Yaxes,
                        tooltip: {
                            shared: true,
                            dateTimeLabelFormats: {
                                millisecond: '',
                                second: '',
                                minute: '',
                                hour: '',
                                day:"",
                                month: '',
                                year: '%e %b %Y'
                            }
                        },
                        legend: {
                            layout: 'horizontal',  // horizontal vertical
                            align: 'center', // center left right
                            verticalAlign: 'bottom',
                            //x: 80,
                            //y: 55,
                            floating: false,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                            //borderColor: Highcharts.theme.legendBackgroundColor || '#FFFFFF',
                            symbolPadding: 3,
                            symbolWidth: 15,
                            symbolHeight: 15,
                            borderRadius: 3,
                            borderWidth: 0,
                            itemStyle: {
                                 font: '12pt Arial, Verdana, Helvetica, sans-serif',
                                 color: 'black'
                            }

                        },
                        series: timeseries
                    });

                    me.tschart.setSize(document.getElementById(me.id + "-body").offsetWidth, document.getElementById(me.id + "-body").offsetHeight);
                    me.tschart.redraw();
               },
               failure: function ( result, request) {
                   myLoadMask.hide();
               }
            });

        }
        // The resize handle is necessary to set the map!
        ,resize: function () {
            var me = this;
            if( me.tschart instanceof Highcharts.Chart){
                me.tschart.setSize(document.getElementById(this.id + "-body").offsetWidth, document.getElementById(this.id + "-body").offsetHeight);
                me.tschart.redraw();
            }
        }
        ,move: function () {
            var me = this;
            if( me.tschart instanceof Highcharts.Chart){
                me.tschart.setSize(document.getElementById(this.id + "-body").offsetWidth, document.getElementById(this.id + "-body").offsetHeight);
                me.tschart.redraw();
            }
        }
    },

    initComponent: function () {
        var me = this;

        me.frame = false;
        me.border= false;
        me.bodyBorder = false;

        me.wkt = this.wkt;

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            autoShow: true,
            alwaysOnTop: true,
            floating: false,
            hidden: false,
            border: false,
            shadow: false,
            padding:0,
            items: [{
                text: 'Chart properties',
                iconCls: 'chart-curve_edit',
                scale: 'medium'
                //,handler: 'openChartProperties'
            },'->',{
                text: 'Download timeseries',
                iconCls: 'fa fa-download fa-2x',
                scale: 'medium'
                //,handler: 'tsDownload'
            },{
                text: 'Save chart',
                iconCls: 'fa fa-floppy-o fa-2x',
                scale: 'medium'
                //,handler: 'saveChart'
            }]
        });


        me.name ='tschartwindow_' + me.id;

        me.items = [{
            region: 'center',
            items: [{
                xtype: 'container',
                layout:'fit',
                reference:'tschartcontainer_'+me.id,
                id: 'tschart_' + me.id
            }]
        }];

        me.callParent();
    }
});
