
Ext.define("esapp.view.analysis.timeseriesProductSelection",{
    extend: "Ext.container.Container",
 
    requires: [
        "esapp.view.analysis.timeseriesProductSelectionController",
        "esapp.view.analysis.timeseriesProductSelectionModel"

        ,"Ext.layout.container.Accordion"
        //"esapp.view.analysis.timeseriesNestedSubProductSelection"
        //,"Ext.data.TreeStore"
    ],
    
    controller: "analysis-timeseriesproductselection",
    viewModel: {
        type: "analysis-timeseriesproductselection"
    },
    xtype: 'timeseriesproductselection',

    //layout: 'fit',
    layout: {
        type: 'vbox'
        ,align: 'stretch'
    },
    defaults: {
        margin: '5 0 5 0'
    },
    border: false,

    charttype: 'xy',
    cumulative: false,
    ranking: false,
    multiplevariables: false,
    fromto: false,
    year: false,
    compareyears: false,
    multipleyears: false,


    initComponent: function () {
        var me = this;


        me.selectedtimeseries = {
            xtype: 'grid',
            id: 'selected-timeseries-mapset-dataset-grid_'+me.charttype,
            reference: 'selected-timeseries-mapset-dataset-grid_'+me.charttype,
            //autoWidth: true,
            //width: 395,
            maxHeight: 255,
            //margin:'10 0 10 0',
            autoScroll: true,
            hidden: false,
            //store: {
            //    bind: '{selectedtimeseriesmapsetdatasets}'
            //},
            bind: '{selectedtimeseriesmapsetdatasets}',
            layout: 'fit',

            viewConfig: {
                stripeRows: false,
                enableTextSelection: true,
                draggable: false,
                markDirty: false,
                resizable: false,
                disableSelection: false,
                trackOver: true
            },

            //selType: 'checkboxmodel',
            //selModel: {
            //    allowDeselect: true,
            //    checkOnly: false,
            //    mode: 'SIMPLE'
            //    //,listeners: {}
            //},
            collapsible: false,
            enableColumnMove: false,
            enableColumnResize: false,
            multiColumnSort: false,
            columnLines: false,
            rowLines: true,
            frame: false,
            border: true,
            bodyBorder: false,
            forceFit: true,
            reserveScrollbar: true,

            //listeners: {
            //    //rowclick: 'mapsetDataSetGridRowClick'
            //},
            defaults: {
                menuDisabled: true,
                sortable: false,
                variableRowHeight: true,
                draggable: false,
                groupable: false,
                hideable: false
            },
            columns: [{
                xtype: 'actioncolumn',
                hidden: false,
                width: 10,
                align: 'center',
                shrinkWrap: 0,
                menuDisabled: true,
                items: [{
                    getClass: function (v, meta, rec) {
                        if (rec.get('selected')) {
                            return 'activated';
                        } else {
                            return 'deactivated';
                        }
                    },
                    getTip: function (v, meta, rec) {
                        //if (rec.get('selected')) {
                        //    return esapp.Utils.getTranslation('deactivateproduct');   // 'Deactivate Product';
                        //} else {
                        //    return esapp.Utils.getTranslation('activateproduct');   // 'Activate Product';
                        //}
                    },
                    handler: function (grid, rowIndex, colIndex, icon, e, record) {
                        var rec = record,   // grid.getStore().getAt(rowIndex),
                            selectedTimeseriesStore = grid.getStore();
                        var yearsData = [];

                        rec.get('selected') ? rec.set('selected', false) : rec.set('selected', true);
                        if (!rec.get('selected')) {
                            selectedTimeseriesStore.remove(record);
                        }

                        selectedTimeseriesStore.getData().each(function (product) {
                            yearsData = esapp.Utils.union_arrays(yearsData, product.get('years'));
                        });
                        var yearsDataDict = [];
                        yearsData.forEach(function (year) {
                            yearsDataDict.push({'year': year});
                        });

                        //if (Ext.isObject(Ext.getCmp('ts_selectyearstocompare_'+me.charttype).searchPopup)) {
                        //    Ext.getCmp('ts_selectyearstocompare_'+me.charttype).searchPopup.lookupReference('searchGrid').getSelectionModel().deselectAll();
                        //}
                        //Ext.getCmp('timeserieschartselection').getViewModel().getStore('years').setData(yearsDataDict);
                        me.getViewModel().getStore('years').setData(yearsDataDict);
                    }
                }]
            }, {
                text: '<div class="grid-header-style">SELECTED ' + esapp.Utils.getTranslation('timeseries') + '</div>',   //'<div class="grid-header-style">Time series</div>',
                xtype: 'templatecolumn',
                tpl: new Ext.XTemplate(
                    //'<b>{prod_descriptive_name}</b>' +
                    '<b>{product_descriptive_name}</b>' +
                    '<tpl if="version != \'undefined\'">',
                    '<b class="smalltext"> - {version} </b>',
                    '</tpl>',
                    '</br>' +
                    '<span class="smalltext"><b style="color:darkgrey">{productcode} - {subproductcode}</b> - <b>{mapsetcode}</b>' +
                    '</span>'
                ),
                //minWidth: 415,
                menuDisabled: true,
                cellWrap: true
            }, {
                xtype: 'actioncolumn',
                dataIndex: 'reference',
                header: esapp.Utils.getTranslation('Reference'),
                width: 30,
                align: 'center',
                shrinkWrap: 0,
                stopSelection: false,
                menuDisabled: true,
                hidden: !me.cumulative,
                disabled: !me.cumulative,
                items: [{
                    tooltip: esapp.Utils.getTranslation('Reference'),
                    getClass: function (v, meta, rec) {
                        if (rec.get('reference') === ' '){
                            return ''
                        }
                        else if (rec.get('difference')){
                            return ''
                        }
                        else if (rec.get('reference') && !rec.get('difference')) {
                            return 'x-grid3-radio-col-on';
                        }
                        else {
                            return 'x-grid3-radio-col'
                        }
                    },
                    handler: function (grid, rowIndex, colIndex, icon, e, record) {
                        //console.info(record);
                        if (!record.get('reference')){
                            //record.set('reference', !record.get('reference'));
                            grid.getStore().each(function(rec){
                                //console.info(rec);
                                rec.set('reference', false);
                                if (rec.get('frequency_id') != record.get('frequency_id')){
                                    rec.set('difference', ' ');
                                }
                            });
                            record.set('reference', true);
                        }
                        else {
                            grid.getStore().each(function(rec){
                                //console.info(rec);
                                rec.set('reference', false);
                                rec.set('difference', false);
                            });
                            //record.set('reference', false);
                        }
                    }
                }]
            },{
                xtype: 'actioncolumn',
                dataIndex: 'difference',
                header: esapp.Utils.getTranslation('Diff'),
                width: 30,
                align: 'center',
                shrinkWrap: 0,
                stopSelection: false,
                menuDisabled: true,
                hidden: !me.cumulative,
                disabled: !me.cumulative,
                items: [{
                    tooltip: esapp.Utils.getTranslation('Diff'),
                    getClass: function (v, meta, rec) {
                        if (rec.get('difference') === ' '){
                            return ''
                        }
                        else if (rec.get('reference')){
                            return ''
                        }
                        else if (rec.get('difference') && !rec.get('reference')) {
                            return 'x-grid3-radio-col-on';
                        }
                        else {
                            return 'x-grid3-radio-col'
                        }
                    },
                    handler: function (grid, rowIndex, colIndex, icon, e, record) {
                        if (!record.get('difference')){
                            grid.getStore().each(function(rec){
                                rec.set('difference', false);
                                if (rec.get('frequency_id') != record.get('frequency_id')){
                                    rec.set('reference', ' ');
                                }
                            });
                            record.set('difference', true);
                        }
                        else {
                            grid.getStore().each(function(rec){
                                //console.info(rec);
                                rec.set('reference', false);
                                rec.set('difference', false);
                            });
                            //record.set('difference', false);
                        }
                    }
                }]

                //xtype: 'checkcolumn',
                //dataIndex: 'difference',
                //header: esapp.Utils.getTranslation('Diff'),
                //width: 30,
                //align: 'center',
                //stopSelection: false,
                //menuDisabled: true,
                //hidden: !me.cumulative,
                //disabled: !me.cumulative
            }, {
                xtype: 'actioncolumn',
                //header: esapp.Utils.getTranslation('actions'),   // 'Edit draw properties',
                width: 10,
                align: 'center',
                stopSelection: false,
                menuDisabled: true,

                items: [{
                    // scope: me,
                    //width: '35',
                    disabled: false,
                    getClass: function (v, meta, rec) {
                        return 'chart-curve_edit';
                    },
                    getTip: function (v, meta, rec) {
                        return esapp.Utils.getTranslation('edittimeseriesdrawproperties') + ' ' + rec.get('productcode') + ' - ' + rec.get('subproductcode');
                    },
                    handler: 'editTSDrawProperties'
                }]
            }]
        };

        me.timeframeselection =  Ext.create('Ext.form.FieldSet', {
            xtype: 'fieldset',
            id: 'ts_timeframe_'+me.charttype,
            reference: 'ts_timeframe_'+me.charttype,
            title: '<b style="font-size:16px; color:#0065A2; line-height: 18px;">' + esapp.Utils.getTranslation('timeframe') + '</b>',
            hidden: false,
            //autoWidth: true,
            //width: 395,
            autoHeight: true,
            border: 2,
            padding: 5,
            style: {
                borderColor: '#157FCC',
                borderStyle: 'solid'
            },
            layout: 'vbox'
        });

        me.fromtoSelection = {
            layout: 'hbox',
            layoutConfig: {columns: 3, rows: 1},
            margin: 5,
            items: [{
                xtype: 'radio',
                id: 'radio-fromto_'+me.charttype,
                checked: true,
                name: 'ts-period_'+me.charttype,
                //inputValue: 'year',
                style: {"margin-right": "5px"},
                disabled: false
            }, {
                xtype: 'datefield',
                id: 'ts_from_period_'+me.charttype,
                fieldLabel: esapp.Utils.getTranslation('from'),    // 'From',
                labelAlign: 'left',
                labelWidth: 35,
                style: {"margin-right": "10px"},
                width: 160,
                format: "d/m/Y",
                emptyText: 'dd/mm/yyyy ',
                allowBlank: true,
                maxValue: new Date(),
                listeners: {
                    change: function () {
                        Ext.getCmp("radio-fromto_"+me.charttype).setValue(true);
                    }
                }
            }, {
                xtype: 'datefield',
                id: 'ts_to_period_'+me.charttype,
                fieldLabel: esapp.Utils.getTranslation('to'),    // 'To',
                labelAlign: 'left',
                labelWidth: 20,
                style: {"margin-right": "10px"},
                width: 160,
                format: "d/m/Y",
                emptyText: 'dd/mm/yyyy ',
                allowBlank: true,
                //maxValue: new Date(),
                //,value: new Date()
                listeners: {
                    change: function () {
                        Ext.getCmp("radio-fromto_"+me.charttype).setValue(true);
                    }
                }
            }]
        };

        me.yearSelection = {
            layout: 'hbox',
            layoutConfig: {columns: 3, rows: 1},
            margin: 5,
            hidden: false,
            items: [{
                xtype: 'radio',
                id: 'radio-year_'+me.charttype,
                checked: false,
                align: 'middle',
                name: 'ts-period_'+me.charttype,
                //inputValue: 'year',
                //style: {"margin-right": "5px"},
                margin: '8 5 0 0',
                disabled: false
            }, {
                xtype: 'combobox',
                id: 'YearTimeseries_'+me.charttype,
                name: 'YearTimeseries_'+me.charttype,
                bind: {
                    store: '{years}'        // me.getViewModel().get('years')   //
                },
                //store: '{years}',
                fieldLabel: esapp.Utils.getTranslation('year'),    // 'Year',
                labelWidth: 40,
                labelAlign: 'left',
                width: 155,
                margin: '9 0 0 0',
                //colspan: 2,
                valueField: 'year',
                displayField: 'year',
                //publishes: ['year'],
                typeAhead: true,
                queryMode: 'local',
                emptyText: esapp.Utils.getTranslation('select'),    // 'Select...',
                listeners: {
                    select: function () {
                        Ext.getCmp("radio-year_"+me.charttype).setValue(true);
                    }
                }
            }, {
                xtype: 'fieldset',
                //flex: 2,
                title: '<b>Season</b>',
                layout: 'hbox',
                layoutConfig: {columns: 2, rows: 1},
                margin: '0 0 0 20',
                defaults: {
                    margin: 10
                    //anchor: '100%',
                    //hideEmptyLabel: false
                    //layout: 'form',
                    //xtype: 'container'
                    //style: 'width: 50%'
                },
                items: [{
                    xtype: 'datefield',
                    id: 'ts_from_season_'+me.charttype,
                    fieldLabel: esapp.Utils.getTranslation('from'),    // 'From',
                    labelAlign: 'left',
                    labelWidth: 35,
                    style: {"margin-right": "10px"},
                    width: 120,
                    format: "d/m",
                    emptyText: 'dd/mm ',
                    allowBlank: true,
                    showToday: false,
                    //maxValue: new Date(),
                    listeners: {
                        change: function () {
                            Ext.getCmp("radio-year_"+me.charttype).setValue(true);
                        }
                    }
                }, {
                    xtype: 'datefield',
                    id: 'ts_to_season_'+me.charttype,
                    fieldLabel: esapp.Utils.getTranslation('to'),    // 'To',
                    labelAlign: 'left',
                    labelWidth: 20,
                    style: {"margin-right": "10px"},
                    width: 120,
                    format: "d/m",
                    emptyText: 'dd/mm',
                    allowBlank: true,
                    showToday: false,
                    //maxValue: new Date(),
                    //,value: new Date()
                    listeners: {
                        change: function () {
                            Ext.getCmp("radio-year_"+me.charttype).setValue(true);
                        }
                    }
                }]
            }]
        };

        me.compareyearsSelection = {
            layout: 'hbox',
            layoutConfig: {columns: 3, rows: 1},
            margin: 5,
            items: [{
                xtype: 'radio',
                id: 'radio-compareyears_'+me.charttype,
                checked: false,
                name: 'ts-period_'+me.charttype,
                //inputValue: 'year',
                style: {"margin-right": "5px"},
                disabled: false
            }, {
                xtype: 'multiselector',
                id: 'ts_selectyearstocompare_'+me.charttype,
                title: 'Year(s) of interest',
                cls: 'newpanelstyle',
                style: { "margin-right": "20px" },
                width: 160,
                height: 105,
                border: false,
                fieldName: 'year',
                viewConfig: {
                    deferEmptyText: false,
                    emptyText: 'No years selected'
                },
                search: {
                    field: 'year',
                    searchText: '',
                    //bind: '{years}',
                    //store: 'years',
                    bind: {
                        store: '{years}'
                    },
                    cls: 'newpanelstyle',
                    modal: false,
                    shadow: false,
                    border: false,
                    frame: false,
                    layout: '',
                    floating: true,
                    resizable: false,
                    width: 110,
                    height: 100,
                    minWidth: 110,
                    minHeight: 100,
                    listeners: {
                        activate: function () {
                            Ext.getCmp("radio-compareyears_"+me.charttype).setValue(true);
                        },
                        show: function () {
                            Ext.getCmp("radio-compareyears_"+me.charttype).setValue(true);
                        }
                    }
                },
                listeners: {
                    containerclick: function () {
                        Ext.getCmp("radio-compareyears_"+me.charttype).setValue(true);
                    },
                    itemclick: function () {
                        Ext.getCmp("radio-compareyears_"+me.charttype).setValue(true);
                    }
                }

            }, {
                xtype: 'fieldset',
                //flex: 1,
                title: '<b>Compare seasons</b>',
                layout: 'column',
                //layoutConfig: {columns: 2, rows: 2},
                defaults: {
                    //anchor: '100%',
                    //hideEmptyLabel: false
                    layout: 'form',
                    xtype: 'container',
                    style: 'width: 50%'
                },
                items: [{
                    items: [{
                        xtype: 'datefield',
                        id: 'ts_from_seasoncompare_'+me.charttype,
                        fieldLabel: esapp.Utils.getTranslation('from'),    // 'From',
                        labelAlign: 'left',
                        labelWidth: 35,
                        style: {"margin-right": "10px"},
                        width: 160,
                        format: "d/m",
                        emptyText: 'dd/mm ',
                        allowBlank: true,
                        showToday: false,
                        //maxValue: new Date(),
                        listeners: {
                            change: function () {
                                Ext.getCmp("radio-compareyears_"+me.charttype).setValue(true);
                            }
                        }
                    }, {
                        xtype: 'datefield',
                        id: 'ts_to_seasoncompare_'+me.charttype,
                        fieldLabel: esapp.Utils.getTranslation('to'),    // 'To',
                        labelAlign: 'left',
                        labelWidth: 20,
                        style: {"margin-right": "10px"},
                        width: 160,
                        format: "d/m",
                        emptyText: 'dd/mm',
                        allowBlank: true,
                        showToday: false,
                        //maxValue: new Date(),
                        //,value: new Date()
                        listeners: {
                            change: function () {
                                Ext.getCmp("radio-compareyears_"+me.charttype).setValue(true);
                            }
                        }
                    }]
                }]
            }]
        };

        me.multipleyearsSelection = {
            layout: 'hbox',
            layoutConfig: {columns: 3, rows: 1},
            margin: 5,
            items: [{
                xtype: 'radio',
                id: 'radio-multiyears_'+me.charttype,
                checked: true,
                name: 'ts-period_'+me.charttype,
                //inputValue: 'year',
                style: {"margin-right": "5px"},
                disabled: false
            }, {
                xtype: 'grid',
                id: 'ts_selectmultiyears_'+me.charttype,
                //title: 'Year(s) of interest',
                selType: 'checkboxmodel',
                bind: {
                    store: '{years}'
                },
                defaults: {
                    sortable: true
                },
                columns: [
                    {
                        text: 'Available Years',
                        width: 135,
                        dataIndex: 'year',
                        menuDisabled: true,
                        sortable: true,
                        shrinkWrap: 0,
                        stopSelection: false
                    }
                ],
                sortableColumns: true,
                reserveScrollbar: true,
                columnLines: true,
                frame: true,
                border: false,
                cls: 'newpanelstyle',
                style: { "margin-right": "20px" },
                width: 185,
                height: 140
            }, {
                xtype: 'fieldset',
                //flex: 1,
                title: '<b>Season</b>',
                layout: 'column',
                //layoutConfig: {columns: 2, rows: 2},
                defaults: {
                    //anchor: '100%',
                    //hideEmptyLabel: false
                    layout: 'form',
                    xtype: 'container',
                    style: 'width: 50%'
                },
                items: [{
                    items: [{
                        xtype: 'datefield',
                        id: 'ts_from_seasonmulti_'+me.charttype,
                        fieldLabel: esapp.Utils.getTranslation('from'),    // 'From',
                        labelAlign: 'left',
                        labelWidth: 35,
                        style: {"margin-right": "10px"},
                        width: 160,
                        format: "d/m",
                        emptyText: 'dd/mm ',
                        allowBlank: true,
                        showToday: false,
                        //maxValue: new Date(),
                        listeners: {
                            change: function () {
                                Ext.getCmp("radio-multiyears_"+me.charttype).setValue(true);
                            }
                        }
                    }, {
                        xtype: 'datefield',
                        id: 'ts_to_seasonmulti_'+me.charttype,
                        fieldLabel: esapp.Utils.getTranslation('to'),    // 'To',
                        labelAlign: 'left',
                        labelWidth: 20,
                        style: {"margin-right": "10px"},
                        width: 160,
                        format: "d/m",
                        emptyText: 'dd/mm',
                        allowBlank: true,
                        showToday: false,
                        //maxValue: new Date(),
                        //,value: new Date()
                        listeners: {
                            change: function () {
                                Ext.getCmp("radio-multiyears_"+me.charttype).setValue(true);
                            }
                        }
                    }]
                }]
            }]
        };

        if (me.fromto){
            me.timeframeselection.add(me.fromtoSelection);
        }
        if (me.year){
            me.timeframeselection.add(me.yearSelection);
        }
        if (me.compareyears){
            me.timeframeselection.add(me.compareyearsSelection);
        }
        if (me.multipleyears){
            me.timeframeselection.add(me.multipleyearsSelection);
        }

        me.items = [{
            xtype: 'panel',
            //id:'productcategories',
            reference: 'productcategories',
            title: esapp.Utils.getTranslation('products'),  // 'Products',
            border: true,
            frame: false,
            height: 360,
            collapsible: true,
            bodyPadding: '0 0 0 0',
            style: {
                "font-size": 18
            },
            layout: {
                // layout-specific configs
                type: 'accordion',
                titleCollapse: true,
                animate: true,
                activeOnTop: true
            },
            defaults: {
                margin: '0 0 1 0',
                padding: '0 0 0 0'
            },
            tools: [{
                type: 'refresh',
                tooltip: esapp.Utils.getTranslation('refreshproductlist'),  // 'Refresh product list',
                callback: function (grid) {
                    var timeseriesProductsStore = Ext.getStore('TimeseriesProductsStore');
                    //var timeseriesProductsStore = me.getViewModel().getStore('products');
                    //console.info(timeseriesProductsStore);
                    if (timeseriesProductsStore.isStore) {
                        timeseriesProductsStore.reload();
                        //me.fireEvent('render');
                    }
                }
            }],
            listeners: {
                render: function(){
                    //console.info(this.getViewModel().getStore('categories'));
                    var timeseriesProductsStore = Ext.getStore('TimeseriesProductsStore'),
                        delay = 0;
                    if (!timeseriesProductsStore.isLoaded()){
                        delay = 4000;
                    }

                    var task = new Ext.util.DelayedTask(function() {
                        me.getViewModel().getStore('categories').each(function(record){
                            //Ext.getCmp('productcategories').add({
                            me.lookupReference('productcategories').add({
                                xtype:'timeseriescategoryproducts',
                                id:'productsPanel_'+record.get('category_id')+'_'+me.id,
                                categoryid:record.get('category_id'),
                                categoryname:record.get('descriptive_name'),
                                title:'<span class="categorytitle"> ' + record.get('descriptive_name') + '</span>',
                                charttype: me.charttype,
                                cumulative: me.cumulative,
                                multiplevariables: me.multiplevariables
                            });
                        });
                    });
                    task.delay(delay);
                }
            }
        },
        me.selectedtimeseries,
        me.timeframeselection
       ];

        me.callParent();
    }
});



Ext.define("esapp.view.analysis.timeseriesCategoryProducts",{
    extend: "Ext.grid.Panel",

    requires: [
        "esapp.view.analysis.timeseriesProductSelectionController"
        ,"esapp.view.analysis.timeseriesProductSelectionModel"

    ],

    controller: "analysis-timeseriesproductselection",
    viewModel: {
        type: "analysis-timeseriesproductselection"
    },
    xtype: 'timeseriescategoryproducts',

    //title: esapp.Utils.getTranslation('products'),  // 'Products',
    //reference: 'TimeSeriesCategoryProductsGrid',
    height: 400,
    //bind: '{products}',
    session: true,
    viewConfig: {
        stripeRows: false,
        enableTextSelection: true,
        draggable: false,
        markDirty: false,
        resizable: false,
        disableSelection: false,
        trackOver: true
    },
    layout: 'fit',
    hideHeaders: true,

    //selType: 'checkboxmodel',
    //selModel: {
    //    allowDeselect: true,
    //    checkOnly: false,
    //    mode: 'SIMPLE'
    //    //,listeners: {}
    //},

    collapsible: false,
    enableColumnMove: false,
    enableColumnResize: true,
    multiColumnSort: false,
    columnLines: false,
    rowLines: true,
    frame: false,
    border: false,
    bodyBorder: false,
    forceFit: true,
    reserveScrollbar: true,

    //tools: [{
    //    type: 'refresh',
    //    tooltip: esapp.Utils.getTranslation('refreshproductlist'),  // 'Refresh product list',
    //    callback: function (grid) {
    //        var timeseriesProductsStore = grid.getStore('products');
    //
    //        if (timeseriesProductsStore.isStore) {
    //            timeseriesProductsStore.load();
    //        }
    //    }
    //}],

    //onRender: function() {
    //    var me = this;
    //    me.callParent(arguments);
    //    if(me.border){
    //        me.el.setStyle("border","1px solid #333");
    //    }
    //},

    cls: 'group-header-style grid-color-yellow',
    style: {"margin-right": "15px"},

    features: [{
        reference: 'timeseriesproductcategories',
        ftype: 'grouping',
        groupHeaderTpl: Ext.create('Ext.XTemplate',
            '<div class="product-group-header-style">',
                //'{[children[0].product_descriptive_name]}',
            //'<tpl for="children">',
            //    '<tpl if="timeseries_role == \'Initial\'">',
            //        '<b>{product_descriptive_name}</b>',
            //    '</tpl>',
            //'</tpl>',
            ' {name} ({children.length})</div>'
        ),
        hideGroupedHeader: true,
        enableGroupingMenu: false,
        startCollapsed: true,
        depthToIndent: 150
        //,groupByText: esapp.Utils.getTranslation('productcategories')  // 'Product category'
    }],

    //plugins: [{
    //    ptype: 'rowexpander',
    //    //cellWrap:true,
    //    //layout:'fit',
    //    useArrows: true,
    //    rowBodyTpl: [
    //        '<div class="subproducts"></div>'
    //    ]
    //    //rowBodyTpl: new Ext.XTemplate(
    //    //    '<span class="smalltext">' +
    //    //    '<p>{description}</p>' +
    //    //    '</span>'
    //    //)
    //}],

    listeners: {
        //afterrender: 'loadTimeseriesProductsGrid',
        //rowclick: 'TimeseriesProductsGridRowClick'
    },

    categoryid: null,
    categoryname: null,
    charttype: '',
    cumulative: false,
    multiplevariables: false,

    initComponent: function () {
        var me = this;
        var productsStore = me.getViewModel().get('products');
        me.store = productsStore;

        //var delay = 0;
        //if (productsStore == null){
        //    delay = 2000;
        //}
        //else if (!productsStore.isLoaded()){
        //    delay = 2000;
        //}

        var task = new Ext.util.DelayedTask(function() {
            //if (productsStore.getFilters().items.length == 0) {
            productsStore.setFilters({
                property: 'category_id'
                ,value: me.categoryid
                ,anyMatch: true
            });
            //}

            me.store = productsStore;
        });
        task.delay(500);

        me.columns = [{
            xtype: 'actioncolumn',
            hidden: false,
            width: 20,
            align: 'center',
            shrinkWrap: 0,
            padding: 0,
            variableRowHeight: true,
            items: [{
                getClass: function (v, meta, rec) {
                    return 'add20';
                    //if (rec.get('selected')) {
                    //    return 'activated';
                    //} else {
                    //    return 'deactivated';
                    //}
                },
                getTip: function (v, meta, rec) {
                    return esapp.Utils.getTranslation('Add to selected');
                    //if (rec.get('selected')) {
                    //    return esapp.Utils.getTranslation('deactivateproduct');   // 'Deactivate Product';
                    //} else {
                    //    return esapp.Utils.getTranslation('activateproduct');   // 'Activate Product';
                    //}
                },
                //handler: 'TimeseriesProductsGridRowClick'
                handler: function (grid, rowIndex, colIndex, icon, e, record) {
                    var gridSelectedTS = 'selected-timeseries-mapset-dataset-grid_'+ me.charttype;
                    //if (grid.up().charttype == 'cumulative'){
                    //    gridSelectedTS = 'selected-timeseries-mapset-dataset-grid_cum';
                    //}
                    var selectedTimeseriesStore = Ext.getCmp(gridSelectedTS).getStore();
                    //var selectedTimeseriesStore = grid.up().up().up().lookupReference(gridSelectedTS).getStore();
                    var yearsData = [];
                    var newrecord = Ext.clone(record);

                    //record.get('selected') ? record.set('selected', false) : record.set('selected', true);
                    //record.get('selected') ? selectedTimeseriesStore.add(record) : selectedTimeseriesStore.remove(record);

                    if (me.cumulative){
                        newrecord.set('cumulative', true);
                    }

                    if (selectedTimeseriesStore.count() > 0){
                        var recordExists = false;
                        selectedTimeseriesStore.getData().each(function(product) {
                            if (product.get('productmapsetid') == record.get('productmapsetid') && product.get('subproductcode') == record.get('subproductcode')){
                                recordExists = true;
                            }
                        });
                        if (!recordExists){
                            if (!me.multiplevariables){
                                selectedTimeseriesStore.removeAll();
                            }
                            newrecord.set('selected', true);
                            selectedTimeseriesStore.add(newrecord);
                        }
                        //var  recordExists = selectedTimeseriesStore.findRecord('productmapsetid', record.get('productmapsetid'), 0, true);
                        //console.info(recordExists);
                        //if (recordExists != null ){
                        //    console.info(recordExists.get('subproductcode'));
                        //    console.info(record.get('subproductcode'));
                        //    if (!(recordExists.get('subproductcode') == record.get('subproductcode'))){
                        //        record.set('selected', true);
                        //        selectedTimeseriesStore.add(record);
                        //    }
                        //}
                    }
                    else {
                        if (!me.multiplevariables){
                            selectedTimeseriesStore.removeAll();
                        }
                        newrecord.set('selected', true);
                        selectedTimeseriesStore.add(newrecord);
                    }

                    selectedTimeseriesStore.getData().each(function(product) {
                        yearsData = esapp.Utils.union_arrays(yearsData, product.get('years'));

                        //alltimeseriesmapsetdatasets.push(product);
                        //// First loop the mapsets to get the by the user selected mapset if the product has > 1 mapsets.
                        //var datasets = product.get('productmapsets')[0].timeseriesmapsetdatasets;
                        ////var datasets = product.get(children)[0].children;
                        //datasets.forEach(function(datasetObj) {
                        //    //yearsData = Ext.Object.merge(yearsData, datasetObj.years);
                        //    yearsData = esapp.Utils.union_arrays(yearsData, datasetObj.years);
                        //    alltimeseriesmapsetdatasets.push(datasetObj);
                        //});
                    });
                    var yearsDataDict = [];
                    yearsData.forEach(function(year) {
                        yearsDataDict.push({'year': year});
                    });

                    //if (!record.get('selected') && Ext.isObject(Ext.getCmp('ts_selectyearstocompare_'+me.charttype).searchPopup)){
                    //    Ext.getCmp('ts_selectyearstocompare_'+me.charttype).searchPopup.lookupReference('searchGrid').getSelectionModel().deselectAll();
                    //}
                    //Ext.getCmp('timeserieschartselection').getViewModel().getStore('years').setData(yearsDataDict);
                    me.up().up().getViewModel().get('years').setData(yearsDataDict);

                    //Ext.getCmp('selected-timeseries-mapset-dataset-grid').show();
                    //Ext.getCmp('ts_timeframe').show();
                    //Ext.getCmp('gettimeseries_btn').setDisabled(false);
                }
            }]
        },{
            xtype: 'templatecolumn',
            width: 280,
            minWidth: 280,
            cellWrap: true,
            tpl: new Ext.XTemplate(
                '<b>{product_descriptive_name}</b>',
                '<tpl if="version != \'undefined\'">',
                '<b class="smalltext"> - {version}</b>',
                '</tpl>',
                '</br>',
                '<b class="smalltext" style="color:darkgrey">{productcode} - {subproductcode}</b>',
                '<b class="smalltext"> - {mapset_name}</b>'
                //'<tpl for="productmapsets">',
                //'<b class="smalltext"> - {descriptive_name}</b>',
                //'</tpl>'
            )
        },{
            xtype: 'actioncolumn',
            //header: esapp.Utils.getTranslation('active'),   // 'Active',
            hidden: false,
            hideable: false,
            width: 25,
            align: 'center',
            shrinkWrap: 0,
            variableRowHeight:true,
            items: [{
                getClass: function(v, meta, rec) {
                    return 'info';
                },
                getTip: function(v, meta, rec) {
                    return rec.get('product_description');
                },
                handler: function(grid, rowIndex, colIndex, icon, e, record) {

                }
            }]
        }];

        me.callParent();
    }
});