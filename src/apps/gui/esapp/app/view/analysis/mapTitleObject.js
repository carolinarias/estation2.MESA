
Ext.define("esapp.view.analysis.mapTitleObject",{
    extend: "Ext.container.Container",
 
    requires: [
        "esapp.view.analysis.mapTitleObjectController",
        "esapp.view.analysis.mapTitleObjectModel",

        "Ext.form.field.HtmlEditor"
    ],
    
    controller: "analysis-maptitleobject",
    viewModel: {
        type: "analysis-maptitleobject"
    },

    xtype: 'maptitleobject',

    id: 'title_obj',
    reference: 'title_obj',
    // autoWidth: true,
    // autoHeight: true,
    minWidth: 150,
    minHeight: 50,
    // height: 'auto',
    layout: 'fit',
    liquidLayout: false,
    hidden: true,
    floating: true,
    defaultAlign: 'tl-tl',
    closable: false,
    closeAction: 'hide',
    draggable: true,
    constrain: true,
    alwaysOnTop: true,
    autoShow: false,
    resizable: true,
    frame: false,
    frameHeader : false,
    border: false,
    shadow: false,
    cls: 'rounded-box',
    //style: 'background: white; cursor:url(resources/img/pencil_cursor.png),auto;',
    style: 'background: white; cursor:move; line-height:24px;',
    //bodyStyle:  'background:transparent;',
    margin: 0,
    padding: 3,
    html: '',
    title_ImageObj: new Image(),
    titlePosition: [0,0],
    changesmade: false,

    config: {
        tpl: [
            // '<div><b style="color:rgb(0,0,0);"><font size="3">{selected_area}</font></b></div><div><b style="color:rgb(0,0,0);"><font size="3">{product_name}</font></b></div><div><b style="color:rgb(51,102,255);"><font size="3">{product_date}</font></b></div>'
            '<div><span style="color:rgb(0,0,0); font-size: 20px; font-weight: bold;">{selected_area}</span></div><div><span style="color:rgb(0,0,0); font-size: 20px;">{product_name}</span></div><div><span style="color:rgb(51,102,255); font-size: 20px;">{product_date}</span></div>'
        ],
        titleData: null
    },
    //bind:{
    //    titleData:'{titleData}'
    //},
    bind:{
        data:'{titleData}'
    },

    initComponent: function () {
        var me = this;

        // me.autoWidth = true;
        // me.autoHeight = true;
        me.setMinWidth(150);
        me.setMinHeight(50);
        // me.height = 'auto';
        me.layout = 'fit';
        me.title_ImageObj = new Image();
        me.titlePosition = [0,0];

        //me.defaultTpl = '<font size="3" style="color: rgb(0, 0, 0);"><b>{selected_area} - {product_name}&nbsp;</b></font><div><font size="3"><b>Decade of <font color="#3366ff">{product_date}</font></b></font></div>';
        //me.tpl = me.defaultTpl;

        me.listeners = {
            //element  : 'el',
            el: {
                dblclick: function () {
                    var editorpanel = this.component.map_title_editor_panel;
                    //editorpanel.down('htmleditor').setValue(this.component.down().tpl.html);
                    editorpanel.down('htmleditor').setValue(this.component.tpl.html);
                    editorpanel.constrainTo = this.component.constrainTo;
                    editorpanel.show();

                    //Ext.util.Observable.capture(this, function(e){console.log('titleObj ' + e);});
                    //
                    //this.component.up().down('#stopedit_tool_' + me.id).show();
                    //this.component.up().down('htmleditor').setValue(this.component.tpl.html);
                    //this.component.up().down('htmleditor').show();
                    //this.component.hide();
                }
            },
            afterrender: function () {
                Ext.tip.QuickTipManager.register({
                    target: this.id,
                    trackMouse: true,
                    title: esapp.Utils.getTranslation('title_object'), // 'Title object',
                    text: '<img src="resources/img/pencil_cursor.png" alt="" height="18" width="18">' + esapp.Utils.getTranslation('doubleclick_to_edit') // 'Double click to edit.'
                });

                // me.mon(me, {
                //     move: function() {
                //         me.titlePosition = me.getPosition(true);
                //     }
                // });
                //
                //me.mon(me.el, 'click', function(){alert('container click');});
                //me.mon(me.el, 'change', function(){alert('container change');});
            },
            refreshimage: function(){
                //alert('container change');

                if(!me.hidden) {
                    //var titleObjDomClone = Ext.clone(me.getEl().dom);
                    var titleObjDom = me.getEl().dom;

                    var task = new Ext.util.DelayedTask(function() {
                        esapp.Utils.removeClass(titleObjDom, 'rounded-box');
                        //titleObjDomClone.style.width = me.getWidth();
                        html2canvas(titleObjDom, {
                            width: me.getWidth(),
                            height: me.getHeight(),
                            onrendered: function (canvas) {
                                me.title_ImageObj.src = canvas.toDataURL("image/png");
                                esapp.Utils.addClass(titleObjDom, 'rounded-box');
                            }
                        });
                    });
                    if (me.changesmade){
                        task.delay(250);
                    }
                }
            },
            show: function(){
                me.setPosition(me.titlePosition);
                me.fireEvent('refreshimage');
            }
            //,move: function(){
            //    me.titlePosition = me.getPosition(true);
            //}
            //,single: true  // Remove the listener after first invocation
            //,change: {
            //    element  : 'el',
            //    fn: function(me, x , y , eOpts){
            //        alert('onchange');
            //        //me.on('change', function() {
            //        //    alert('onchange');
            //        //});
            //    }
            //}
        };


        me.map_title_editor = Ext.create('Ext.form.field.HtmlEditor', {
            xtype: 'htmleditor',
            id: 'map_title_editor_' + me.id,
            reference: 'map_title_editor_' + me.id,
            layout: 'fit',
            style: 'background: white;',
            hidden: false,
            enableAlignments: false,
            enableColors: true,
            enableFont: true,
            enableFontSize: true,
            enableFormat: true,
            enableLinks: false,
            enableLists: false,
            enableSourceEdit: true,
            autoWidth: true,
            autoHeight: true,
            minWidth: 250,
            minHeight: 45,
            value: ''
        });

        me.map_title_editor.getToolbar().insert(1,{
            xtype: 'button',
            //text: 'Fields',
            scope: this,
            tooltip: esapp.Utils.getTranslation('add_dynamic_field'), // 'Add a dynamic field',
            overflowText: esapp.Utils.getTranslation('add_dynamic_field'), // 'Add a dynamic field',
            hidden: false,
            iconCls: 'fa fa-code',
            floating: false,  // usually you want this set to True (default)
            enableToggle: false,
            arrowVisible: false,
            arrowAlign: 'right',
            collapseDirection: 'left',
            menuAlign: 'tl-tr',
            menu: {
                hideOnClick: false,
                iconAlign: '',
                width: 125,
                defaults: {
                    hideOnClick: false,
                    cls: "x-menu-no-icon",
                    padding: 2
                },
                items: [{
                    text: esapp.Utils.getTranslation('selected_area'), // 'Selected area',
                    handler: function(){
                        me.map_title_editor.insertAtCursor('{selected_area}');
                    }
                },{
                    text: esapp.Utils.getTranslation('product_name'), // 'Product name',
                    handler: function(){
                        me.map_title_editor.insertAtCursor('{product_name}');
                    }
                },{
                    text: esapp.Utils.getTranslation('product_date'), // 'Product date',
                    handler: function(){
                        me.map_title_editor.insertAtCursor('{product_date}');
                    }
                }]
            }
        });

        me.map_title_editor_panel = Ext.create('Ext.panel.Panel', {
            autoWidth: true,
            autoHeight: true,
            layout: 'fit',
            modal: true,
            hidden: true,
            floating: true,
            defaultAlign: 'tl-tl',
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
            shadow: true,
            headerOverCls: 'grayheader',
            header: {
                title: esapp.Utils.getTranslation('title_object'), // 'Title object',
                titleAlign: 'right',
                cls: 'transparentheader',
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
                        var mapTitleObj = me,
                            mapTitleEditor = panel.down('#map_title_editor_' + me.id);

                        // console.info(mapTitleObj);
                        // mapTitleObj.setTpl(mapTitleEditor.getValue());   // .replace(/"/g, '&quot;', true);
                        mapTitleObj.tpl.set(mapTitleEditor.getValue(), true);   // .replace(/"/g, '&quot;', true);
                        //console.info(mapTitleObj.getData());
                        mapTitleObj.update(mapTitleObj.getData());
                        mapTitleObj.setHeight('auto');
                        mapTitleObj.updateLayout();
                        mapTitleObj.changesmade = true;
                        // mapTitleObj.show();
                        mapTitleObj.fireEvent('refreshimage');
                        panel.hide();
                        //mapTitleObj.down().tpl.set(mapTitleEditor.getValue(), true);   // .replace(/"/g, '&quot;', true);
                        //console.info(mapTitleObj.down().getData());
                        //mapTitleObj.down().update(mapTitleObj.down().getData());
                        //mapTitleObj.down().updateLayout();
                        //mapTitleObj.updateLayout();
                        //mapTitleObj.show();
                        //mapTitleObj.down().refresh();
                    }
                }]
            },
            items: me.map_title_editor
        });

        me.callParent();

        //me.relayEvents(me, ['change']);
    }
});
