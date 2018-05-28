
Ext.define("esapp.view.analysis.mapLogoObject",{
    extend: "Ext.container.Container",
 
    requires: [
        "esapp.view.analysis.mapLogoObjectController",
        "esapp.view.analysis.mapLogoObjectModel",

        "Ext.layout.container.Center"
    ],
    
    controller: "analysis-maplogoobject",
    viewModel: {
        type: "analysis-maplogoobject"
    },

    xtype: 'maplogoobject',

    // id: 'logo_obj',
    // reference: 'logo_obj',
    autoWidth: true,
    autoHeight: true,
    minWidth: 100,
    minHeight: 50,
    layout: 'fit',
    hidden: true,
    floating: true,
    defaultAlign: 'br-br',
    closable: false,
    closeAction: 'hide',
    draggable: true,
    constrain: true,
    alwaysOnTop: false,
    autoShow: false,
    resizable: false,
    frame: false,
    frameHeader : false,
    border: false,
    shadow: false,
    cls: 'rounded-box',
    //style: 'background: white; cursor:url(resources/img/pencil_cursor.png),auto;',
    style: 'background: white; cursor:move;',
    //bodyStyle:  'background:transparent;',
    margin: 0,
    padding: 0,

    config: {
        logoData: [
            { src:'resources/img/logo/MESA_h110.jpg', width:'65', height:'50' },
            { src:'resources/img/logo/AUC_h110.jpg', width:'65', height:'50' },
            { src:'resources/img/logo/ACP_h110.jpg', width:'65', height:'50' },
            { src:'resources/img/logo/logo_en.gif', width:'65', height:'50' }
        ],
        html: '',
        logos_ImageObj: new Image(),
        logoPosition: [290,518],
        changesmade: false
    },

    //bind: {
    //    data: {
    //        bindTo: '{logoData}',
    //        deep: true
    //    }
    //},

    bind:{
        logoData:'{logoData}'
    },
    publishes: ['logoData'],

    initComponent: function () {
        var me = this;

        me.bind = {
            logoData:'{logoData}'
        };
        me.publishes = ['logoData'];

        // me.logoData = me.getViewModel().data.logoData;

        me.logos_ImageObj = new Image();
        // me.logoPosition = [434, 583];

        me.listeners = {
            //element  : 'el',
            el: {
                dblclick: function () {
                    var editorpanel = me.map_logo_editor_panel;
                    editorpanel.constrainTo = me.constrainTo;       // this.component
                    //editorpanel.currentLogoData = this.component.getLogoData();
                    //editorpanel.down('dataview').setData(this.component.getLogoData());
                    //console.info(editorpanel.down('#logo-editor-view-' + me.id));
                    //console.info(editorpanel.down('#logo-editor-view-' + me.id).getStore());
                    //console.info(me.getLogoData());
                    editorpanel.down('#logo-editor-view-' + me.id).getStore().removeAll();
                    editorpanel.down('#logo-editor-view-' + me.id).getStore().add(me.getLogoData());
                    //console.info(editorpanel);
                    //console.info(this.component.getLogoData());
                    editorpanel.show();
                }
            },
            afterrender: function () {
                Ext.tip.QuickTipManager.register({
                    target: this.id,
                    trackMouse: true,
                    title: esapp.Utils.getTranslation('logo_object'), // 'Logo object',
                    text: '<img src="resources/img/pencil_cursor.png" alt="" height="18" width="18">' + esapp.Utils.getTranslation('doubleclick_to_edit') // 'Double click to edit.'
                });

                // me.mon(me, {
                //     move: function() {
                //        me.logoPosition = me.getPosition(true);
                //     }
                // });
            },
            refreshimage: function(){
                if(!me.hidden) {
                    //var logosObjDomClone = Ext.clone(me.getEl().dom);
                    var logosObjDom = me.getEl().dom;
                    var task = new Ext.util.DelayedTask(function() {
                        esapp.Utils.removeClass(logosObjDom, 'rounded-box');
                        //logosObjDomClone.style.width = me.getWidth();
                        html2canvas(logosObjDom, {
                            width: me.getWidth(),
                            height: me.getHeight(),
                            onrendered: function (canvas) {
                                me.logos_ImageObj.src = canvas.toDataURL("image/png");
                                esapp.Utils.addClass(logosObjDom, 'rounded-box');
                                me.changesmade = false;
                            }
                        });
                    });
                    // console.info('refreshimage logosObj');
                    // console.info(me.getViewModel().data.logoData);
                    // console.info(me.changesmade);
                    // console.info(me.logos_ImageObj.src);
                    // if ((me.getViewModel().data.logoData != null && me.getViewModel().data.logoData.length > 0) && (me.changesmade || me.logos_ImageObj.src == '')){
                    if ((me.getViewModel().data.logoData != null && me.getViewModel().data.logoData.length > 0)){
                        // console.info('refresh the logo image');
                        task.delay(20);
                    }
                    // else {
                    //     me.logos_ImageObj = new Image();
                    // }
                }
            },
            show: function(){
                me.setPosition(me.logoPosition);
                // me.fireEvent('refreshimage');
            }
            // ,move: function(){
            //     me.logoPosition = me.getPosition();
            // }
            ,beforedestroy: function(){
                // To fix the error: mapView.js?_dc=1506608907564:56 Uncaught TypeError: binding.destroy is not a function
                me.bind = null;
            }
        };

        me.items = [{
            xtype: 'dataview',
            itemSelector: 'img',
            bind: {
                data: '{logoData}'
            },
            emptyText: esapp.Utils.getTranslation('noimagesavailable'),  // 'No images available'
            tpl:  new Ext.XTemplate(
                '<div id="maplogos">',
                '<tpl for=".">',
                    '<span style="vertical-align: middle;"></span>',
                    '<img src="{src}" height="{height}"  style="vertical-align: middle; padding: 0px 5px 0px 0px;"/>',
                '</tpl>',
                '</div>'
            )
        }];


        me.map_logo_editor_panel = Ext.create('Ext.panel.Panel', {
            id: 'map_logo_editor_panel' + me.id,
            autoWidth: false,
            autoHeight: true,
            autoScroll: false,
            width: 568,
            minHeight: 400,
            layout: 'vbox',
            modal: false,
            hidden: true,
            floating: true,
            defaultAlign: 'br-br',
            closable: true,
            closeAction: 'hide',
            draggable: true,
            constrain: true,
            constrainTo: me.constrainTo,
            alwaysOnTop: false,
            autoShow: false,
            resizable: false,
            frame: false,
            frameHeader : false,
            border: false,
            bodyBorder: false,
            bodyStyle: "background-color: white !important;",
            shadow: true,
            cls: 'rounded-box',
            //headerOverCls: 'grayheader',
            header: {
                title: esapp.Utils.getTranslation('logo_object'), // 'Logo object',
                titleAlign: 'left',
                //cls: 'transparentheader',
                hidden: false,
                items: [{
                    xtype:'button',
                    itemId: 'stopedit_tool_' + me.id,
                    tooltip: esapp.Utils.getTranslation('save_changes'), // 'Save changes',
                    glyph:0xf0c7,
                    cls: 'btntransparent',
                    hidden: false,
                    margin: '3 0 0 5',
                    handler: function (btn) {
                        var panel = btn.up().up();
                        var mapLogoEditor = panel.down('#logo-editor-view-' + me.id);
                        panel.hide();
                        //var jsonData = Ext.encode(Ext.pluck(store.data.items, 'data'));
                        me.setLogoData(Ext.Array.pluck(mapLogoEditor.store.getRange(), 'data'));
                        me.updateLayout();
                        me.changesmade = true;
                        me.fireEvent('refreshimage');
                        //console.info(Ext.Array.pluck(mapLogoEditor.store.getRange(), 'data'));
                        //console.info(me.getLogoData());
                        //console.info(me.logoData);
                    }
                }]
            },
            //config: {
            //    currentLogoData: null
            //},
            //bind:{
            //    currentLogoData:'{currentLogoData}'
            //},
            items: [{
                xtype: 'panel',
                header: {
                    title: esapp.Utils.getTranslation('selected_logos'),    // 'Selected logos',
                    cls: 'rounded-box-gray-header'
                },
                region: 'center',
                layout: 'fit',
                cls: 'rounded-box',
                // autoHeight: true,
                // autoWidth: true,
                // scrollable: true,
                width: 555,
                height: 105,
                autoScroll: true,
                scrollable: 'vertical',
                reserveScrollbar: true,
                // minWidth: 545,
                // minHeight: 135,
                // maxHeight: 135,
                // maxWidth: 540,
                margin: 5,
                // flex: 1,
                items: [{
                    xtype: 'dataview',
                    id: 'logo-editor-view-' + me.id,
                    // minWidth: 530,
                    // maxWidth: 530,
                    // minHeight: 125,
                    // maxHeight: 130,
                    singleSelect: true,
                    overItemCls: 'x-view-over',
                    itemSelector: 'div.maplogo-wrap',
                    listeners: {
                        // scope: this,
                        // selectionchange: this.onIconSelect,
                        itemdblclick: function (view, rec, itemEl) {
                            view.store.remove(rec);
                            //if (selectedImage) {
                            //    this.fireEvent('selected', selectedImage);
                            //    this.hide();
                            //}
                        }
                    },
                    //bind: {
                    //    data: '{currentLogoData}'
                    //},
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: false,
                        model: 'esapp.model.LogosMapView'
                    }),
                    emptyText: esapp.Utils.getTranslation('noimagesavailable'),  // 'No images available'
                    tpl: new Ext.XTemplate(
                        //'<div id="maplogoseditview">',
                        '<tpl for=".">',
                            '<div class="maplogo-wrap" style="cursor: pointer;">',
                                '<div class="maplogo" data-qtip="'+esapp.Utils.getTranslation('doubleclick_to_remove_from_selected_logos')+'">',
                                    // '<img src="{src}" width="{width}" height="{height}" style="padding: 0px 5px 0px 0px;"/>',
                                    '<img src="{src}" height="{height}" style="vertical-align: middle; padding: 0px 5px 0px 0px;"/>',
                                '</div>',
                            '</div>',
                        '</tpl>'
                        //'</div>'
                    )
                }]
            },{
                xtype: 'panel',
                header: {
                    title: esapp.Utils.getTranslation('available_logos'),    // 'Available logos',
                    cls: 'rounded-box-gray-header'
                },
                region: 'south',
                layout: 'fit',
                cls: 'rounded-box',
                margin: 5,
                // minHeight: 350,
                // maxHeight: 400,
                // scrollable: true,
                width: 555,
                height: 310,
                autoScroll: true,
                scrollable: 'vertical',
                reserveScrollbar: true,
                // flex: 2,
                items: [{
                    xtype: 'dataview',
                    id: 'logo-chooser-view-' + me.id,
                    listeners: {
                        // scope: this,
                        // selectionchange: this.onIconSelect,
                        itemdblclick: function(view, rec, itemEl) {
                            view.up().up().down('dataview').store.add(rec);
                        }
                    },
                    singleSelect: true,
                    overItemCls: 'x-view-over',
                    itemSelector: 'div.maplogo-wrap',
                    store: "LogosMapView",
                    //bind: '{logos}',
                    tpl: new Ext.XTemplate(
                        '<tpl for=".">',
                            '<div class="maplogo-wrap" style="cursor: pointer;">',
                                '<div class="maplogo" data-qtip="'+esapp.Utils.getTranslation('doubleclick_to_add_to_selected_logos')+'">',
                                    '<img src="{src}" width="110" />',
                                '</div>',
                            '</div>',
                            '<tpl if="xindex % 4 === 0"><div class="x-clear"></div></tpl>',
                        '</tpl>',
                        '<div class="x-clear"></div>'
                    )
                }]
            }]
        });

        me.callParent();

    }

    /**
     * Called whenever the user clicks on an item in the DataView. This tells the info panel in the east region to
     * display the details of the image that was clicked on
     */
    // ,onIconSelect: function(dataview, selections) {
    //     //console.info(dataview);
    //     //console.info(selections);
    //     //Ext.toast({html: "Item selected", title: "Item selected", width: 300, align: 't'});
    //     //var selected = selections[0];
    //     //
    //     //if (selected) {
    //     //    this.down('infopanel').loadRecord(selected);
    //     //}
    // },

    /**
     * Fires the 'selected' event, informing other components that an image has been selected
     */
    // fireImageSelected: function() {
    //     //Ext.toast({html: "fireImageSelected", title: "fireImageSelected", width: 300, align: 't'});
    //     //var selectedImage = this.down('iconbrowser').selModel.getSelection()[0];
    //     //
    //     //if (selectedImage) {
    //     //    this.fireEvent('selected', selectedImage);
    //     //    this.hide();
    //     //}
    // }
});
