
Ext.define("esapp.view.analysis.addEditLegend",{
    extend: "Ext.window.Window",
 
    requires: [
        "esapp.view.analysis.addEditLegendController",
        "esapp.view.analysis.addEditLegendModel",

        'Ext.grid.column.RowNumberer',
        // 'Ext.form.field.Hidden',
        // 'Ext.form.field.File',
        'Ext.form.FieldSet',
        'Ext.form.field.Number',
        'Ext.Action',

        'Ext.ux.colorpick.Field'
    ],
    
    controller: "analysis-addeditlegend",
    viewModel: {
        type: "analysis-addeditlegend"
    },

    session:true,

    title: '',
    header: {
        titlePosition: 0,
        titleAlign: 'center'
    },

    constrainHeader: true,
    modal: true,
    closable: true,
    closeAction: 'destroy',
    resizable: true,
    autoScroll: true,
    maximizable: false,
    maxHeight: Ext.getBody().getViewSize().height < 900 ? Ext.getBody().getViewSize().height-10 : 900,
    // maxHeight: 900,

    border: true,
    frame: true,
    fieldDefaults: {
        labelWidth: 120,
        labelAlign: 'left'
    },
    bodyPadding: '10 10 0 10',
    viewConfig: {forceFit:true},
    layout: 'vbox',
    // pack: 'center',
    defaultAlign: 't-t',
    alignTarget: 'analysismain',

    params: {
        edit: false,
        legendrecord: null
    },

    initComponent: function () {
        var me = this;

        var colorrenderer = function(color) {
            var renderTpl = color;

            if (color.trim()==''){
                renderTpl = 'transparent';
            }
            else {
                renderTpl = '<span style="background:rgb(' + esapp.Utils.HexToRGB(color) + '); color:' + esapp.Utils.invertHexToRGB(color) + ';">' + esapp.Utils.HexToRGB(color) + '</span>';
            }
            return renderTpl;
        };

        var colorCellRenderer = function myCustomRenderer(value, cell, row, rowIndex, colIndex, ds) {
            var arr = [];
            if (esapp.Utils.is_array(value)){
                arr = value;
            }
            else {
                arr = value.split(" "); // toString().replace(/,/g,' ');
            }

            var R = arr[0];
            var G = arr[1];
            var B = arr[2];
            var rgbValue = esapp.Utils.RGBtoHex(R,G,B);
            var Rinverse = (R ^ 128);
            var Ginverse = (G ^ 128);
            var Binverse = (B ^ 128);

            var fontcolor = esapp.Utils.RGBtoHex( Rinverse, Ginverse, Binverse);
            // cell.attr = 'style="background:'+rgbValue+'; color: '+fontcolor+';"';
            cell.style = 'background:'+rgbValue+'; color: '+fontcolor+';';

            return value;
        };

        if (me.params.edit){
            me.setTitle('<span class="panel-title-style">' + esapp.Utils.getTranslation('editlegend') + '</span>');
        }
        else {
            me.setTitle('<span class="panel-title-style">' + esapp.Utils.getTranslation('newlegend') + '</span>');
        }

        me.listeners = {
            afterrender: function(){
                if (me.params.edit) {
                    me.lookupReference('legenddescriptivename').setValue(me.params.legendrecord.get('legend_descriptive_name'));
                    me.lookupReference('title_in_legend').setValue(me.params.legendrecord.get('legendname'));
                    me.lookupReference('legend_minvalue').setValue(me.params.legendrecord.get('minvalue'));
                    me.lookupReference('legend_maxvalue').setValue(me.params.legendrecord.get('maxvalue'));
                }
                me.setY(me.getY()-75);
            }
        };

        me.bbar = ['->',{
            xtype: 'button',
            text: esapp.Utils.getTranslation('save'),
            //scope:me,
            iconCls: 'fa fa-save fa-2x',
            style: {color: 'lightblue'},
            scale: 'medium',
            disabled: false,
            handler: 'saveLegend'
        }];

        me.items = [{
            xtype: 'container',
            layout: 'column',
            items: [{
                xtype: 'form',
                reference: 'legendform',
                border: false,
                // use the Model's validations for displaying form errors
                //modelValidation: true,
                fieldDefaults: {
                    labelAlign: 'top',
                    labelStyle: 'font-weight: bold;',
                    msgTarget: 'side',
                    preventMark: false
                },
                layout: 'column',

                items: [{
                    xtype: 'fieldset',
                    title: '<div class="grid-header-style">' + esapp.Utils.getTranslation('legendsettings') + '</div>',
                    collapsible: false,
                    layout: 'column',
                    defaults: {
                        labelWidth: 120,
                        margin: '0 15 5 0'
                    },
                    items: [{
                        xtype: 'container',
                        items: [{
                            // id: 'legenddescriptivename',
                            reference: 'legenddescriptivename',
                            //bind: '{me.params.layerrecord.description}',
                            xtype: 'textfield',
                            fieldLabel: esapp.Utils.getTranslation('legenddescriptivename'),
                            labelAlign: 'top',
                            width: 350,
                            allowBlank: false
                        }, {
                            // id: 'title_in_legend',
                            reference: 'title_in_legend',
                            //bind: '{me.params.layerrecord.layername}',
                            xtype: 'htmleditor',
                            fieldLabel: esapp.Utils.getTranslation('Title in legend'),
                            width: 350,
                            height: 100,
                            allowBlank: false,
                            enableColors: false,
                            enableFontSize: false,
                            enableFormat: false,
                            enableFont: false,
                            enableLinks: false,
                            enableLists: false,
                            enableSourceEdit: false,
                            enableAlignments: false,
                            listeners: {
                                change: function () {
                                    // var legendClassesStore = me.getViewModel().getStore('legendClassesStore');
                                    me.getController().setLegendPreview();
                                }
                            }
                        }]
                    }, {
                        xtype: 'container',
                        items: [{
                            // id: 'legend_minvalue',
                            reference: 'legend_minvalue',
                            xtype: 'numberfield',
                            fieldLabel: esapp.Utils.getTranslation('minvalue'),
                            width: 80,
                            allowBlank: false
                        }, {
                            // id: 'legend_maxvalue',
                            reference: 'legend_maxvalue',
                            xtype: 'numberfield',
                            fieldLabel: esapp.Utils.getTranslation('maxvalue'),
                            width: 80,
                            allowBlank: false
                        }]
                    }]
                }]
            },{
                xtype: 'fieldset',
                title: '<div class="grid-header-style">' + esapp.Utils.getTranslation('assigneddatasets') + '</div>',
                collapsible: false,
                layout: 'fit',
                defaults: {
                    margin:'5 5 5 5'
                },
                margin: '0 10 10 10',
                // minHeight: 550,
                maxHeight: 189,
                items: [{
                    xtype: 'grid',
                    reference: 'assignedDatasetsGrid',
                    // width: 400,
                    bind: '{assigneddatasets}',
                    autoScroll: true,
                    width: 300,
                    height: 175,
                    // maxHeight: 300,
                    // bufferedRenderer: false,
                    cls: 'newpanelstyle',
                    viewConfig: {
                        stripeRows: false,
                        enableTextSelection: true,
                        draggable: false,
                        markDirty: false,
                        trackOver: false,
                        preserveScrollOnRefresh: true,
                        forceFit: true
                    },
                    // selModel: {
                    //     type: 'cellmodel'
                    // },
                    syncRowHeight: true,
                    shrinkWrap: true,

                    hideHeaders: true,
                    collapsible: false,
                    enableColumnMove: false,
                    enableColumnResize: true,
                    sortableColumns: true,
                    multiColumnSort: false,
                    columnLines: true,
                    rowLines: true,
                    frame: false,
                    border: false,
                    bodyBorder: false,

                    listeners: {
                        beforerender: function () {
                            var assignedDatasetsStore = me.getViewModel().getStore('assigneddatasets');
                            if (me.params.legendrecord.get('legendid') != -1) {
                                assignedDatasetsStore.proxy.extraParams = {legendid: me.params.legendrecord.get('legendid')};
                                assignedDatasetsStore.load({
                                    callback: function(records, options, success) {
                                        // console.info(assignedDatasetsStore);
                                    }
                                });
                            }
                        }
                    },
                    columns: {
                        defaults: {
                            variableRowHeight: true,
                            menuDisabled: true,
                            sortable: false,
                            draggable: false,
                            groupable: false,
                            hideable: false
                        },
                        items: [{
                            // text: '<div class="grid-header-style">'+esapp.Utils.getTranslation('datasets')+'</div>'
                            xtype: 'templatecolumn',
                            tpl: new Ext.XTemplate(
                                '<b>{descriptive_name}</b>' +
                                '</BR>' +
                                '<span class="smalltext"><b style="color:darkgrey">{productcode}</b>' +
                                '<tpl if="version != \'undefined\'">',
                                    '<b class="smalltext" style="color:darkgrey"> - {version} </b>',
                                '</tpl>',
                                '<span class="smalltext"><b style="color:darkgrey"> - {subproductcode}</b></span>'
                            ),
                            width: 255,
                            sortable: true
                        },{
                            // text: 'action'
                            xtype: 'actioncolumn',
                            hidden: false,
                            width: 25,
                            align: 'center',
                            shrinkWrap: 0,
                            items: [{
                                getClass: function(v, meta, rec) {
                                    return 'info x-action-col-cell-18';
                                },
                                getTip: function(v, meta, rec) {
                                    return rec.get('description');
                                },
                                handler: function(grid, rowIndex, colIndex, icon, e, record) {

                                }
                            }]
                        }]
                    }
                }]
            }]
        },{
            xtype: 'fieldset',
            title: '<div class="grid-header-style">' + esapp.Utils.getTranslation('legend_classes') + '</div>',
            collapsible: false,
            layout: 'column',
            defaults: {
                margin:'5 5 5 5'
            },
            items: [{
                xtype: 'grid',
                reference: 'legendclassesGrid',
                width: 600,
                bind: '{legendClassesStore}',
                autoScroll: true,
                maxHeight: 555,
                // bufferedRenderer: false,
                cls: 'newpanelstyle',
                viewConfig: {
                    stripeRows: false,
                    enableTextSelection: true,
                    draggable: false,
                    markDirty: false,
                    trackOver: false,
                    preserveScrollOnRefresh: true,
                    forceFit: true
                },
                selModel: {
                    type: 'cellmodel'
                },
                syncRowHeight: true,
                shrinkWrap: true,

                plugins: {
                    ptype: 'cellediting',
                    clicksToEdit: 1
                },

                hideHeaders: false,
                collapsible: false,
                enableColumnMove: false,
                enableColumnResize: true,
                sortableColumns: true,
                multiColumnSort: false,
                columnLines: true,
                rowLines: true,
                frame: false,
                border: false,
                bodyBorder: true,

                listeners: {
                    beforerender: function () {
                        var legendClassesStore = me.getViewModel().getStore('legendClassesStore');
                        if (me.params.legendrecord.get('legendid') != -1) {
                            legendClassesStore.proxy.extraParams = {legendid: me.params.legendrecord.get('legendid')};
                            legendClassesStore.load({
                                callback: function(records, options, success) {
                                    me.getController().setLegendPreview();
                                }
                            });
                        }
                    },
                    edit: function () {
                        me.getController().setLegendPreview();
                    }
                },

                tbar: {
                    padding: 4,
                    defaults: {
                        scale: 'medium',
                        hidden: false
                    },
                    items: [{
                        xtype: 'button',
                        text: esapp.Utils.getTranslation('legend_newclass'),    // 'New class',
                        name: 'legend_newclass',
                        iconCls: 'fa fa-plus-circle fa-2x',
                        style: {color: 'green'},
                        handler: 'newClass'
                    }, {
                        xtype: 'button',
                        text: esapp.Utils.getTranslation('legend_generate_classes'),    // 'Generate classes',
                        name: 'legend_generate_classes',
                        iconCls: 'fa fa-cogs fa-2x',
                        style: {color: 'gray'},
                        handler: 'generateClasses'
                    }, '->'
                        , {
                            xtype: 'button',
                            text: esapp.Utils.getTranslation('legend_delete_all_classes'),    // 'Delete all classes',
                            name: 'legend_delete_all_classes',
                            iconCls: 'fa fa-trash fa-2x',
                            style: {color: 'red'},
                            handler: 'deleteAllClasses'
                        }]
                },

                columns: {
                    defaults: {
                        variableRowHeight: true,
                        menuDisabled: true,
                        sortable: false,
                        draggable: false,
                        groupable: false,
                        hideable: false
                    },
                    items: [{
                        xtype: 'rownumberer'
                    },{
                        xtype: 'actioncolumn',
                        width: 25,
                        align: 'center',
                        stopSelection: true,
                        items: [{
                            width: 25,
                            disabled: false,
                            getClass: function (v, meta, rec) {
                                return 'colorwheel x-action-col-cell-16';
                            },
                            getTip: function (v, meta, rec) {
                                return esapp.Utils.getTranslation('colorpicker');
                            },
                            handler: function (gridView, rowIndex, colIndex, el, ev) {
                                var record = gridView.getStore().getAt(rowIndex);
                                // console.info('Open color picker');
                                me.getController().openColourPicker(record, gridView.getCell(record,gridView.grid.columns[colIndex+1]).el);
                            }
                        }]
                    }, {
                        header: esapp.Utils.getTranslation('colour'), // 'Colour',
                        dataIndex: 'color_rgb',
                        flex: 1,
                        width: 100,
                        renderer: colorCellRenderer,
                        editor: {
                            type: 'textfield',
                            regex: /(\d{1,3}) (\d{1,3}) (\d{1,3})/,
                            maskRe: /[0-9 ]+/,
                            invalidText: 'Not a valid RGB.  Must be 3 numbers between 0 and 255, devided by a space".'
                        }
                        // ,cellActions:[{
                        //     iconCls:'color_wheel-icon',
                        //     qtip:esapp.Utils.getTranslation('gridcellaction_qtip_opencolourpicker'), // 'Open colour picker.',
                        //     hide:true,
                        //     hideMode:'display'
                        // }]
                    }, {
                        header: esapp.Utils.getTranslation('from'), // 'From',
                        dataIndex: 'from_step',
                        sortable: true,
                        width: 80,
                        editor: {
                            xtype: 'numberfield',
                            decimalPrecision: 8
                        }
                    }, {
                        header: esapp.Utils.getTranslation('To'), // 'To',
                        dataIndex: 'to_step',
                        width: 80,
                        editor: {
                            xtype: 'numberfield',
                            decimalPrecision: 8
                        }
                    }, {
                        header: esapp.Utils.getTranslation('legendclass_label'), // 'Class label',
                        dataIndex: 'color_label',
                        width: 100,
                        editor: 'textfield'
                    }, {
                        header: esapp.Utils.getTranslation('legendclass_group_label'), // 'Group label',
                        dataIndex: 'group_label',
                        width: 100,
                        editor: 'textfield'
                    }, {
                        xtype: 'actioncolumn',
                        width: 25,
                        align: 'center',
                        stopSelection: true,
                        items: [{
                            width: 25,
                            disabled: false,
                            getClass: function (v, meta, rec) {
                                // if (rec.get('deletable')){
                                return 'delete16 x-action-col-cell-16';
                                // }
                            },
                            getTip: function (v, meta, rec) {
                                return esapp.Utils.getTranslation('deletelegendclass');
                            },
                            // handler: 'deleteLegendClass'
                            handler: function (grid, rowIndex, colIndex, el, ev) {
                                var record = grid.getStore().getAt(rowIndex);
                                grid.getStore('legendClassesStore').remove(record);
                                me.getController().setLegendPreview();
                            }
                        }]
                    }]
                }
            },{
                xtype: 'fieldset',
                title: '<div class="grid-header-style">' + esapp.Utils.getTranslation('preview') + '</div>',
                collapsible: false,
                // padding: '10 10 10 10',
                layout: 'fit',
                defaults: {
                    margin:'15 5 5 5'
                },
                // minHeight: 550,
                maxHeight: 750,
                items: [{
                    xtype: 'container',
                    id: 'legendpreview',
                    scrollable: 'vertical',
                    html: ''
                }]
            }]
        }];

        me.callParent();

    }
});