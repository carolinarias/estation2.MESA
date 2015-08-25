
Ext.define("esapp.view.dashboard.PC2",{
    "extend": "Ext.panel.Panel",
    "controller": "dashboard-pc2",
    "viewModel": {
        "type": "dashboard-pc2"
    },
    xtype  : 'dashboard-pc2',

    requires: [
        'esapp.view.dashboard.PC2Controller',
        'esapp.view.dashboard.PC2Model',
        'esapp.view.widgets.ServiceMenuButton',

        'Ext.layout.container.Border',
        'Ext.layout.container.VBox',
        'Ext.layout.container.Table',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Spacer',
        'Ext.Img',
        'Ext.button.Split',
        'Ext.menu.Menu'
    ],

    name:'dashboardpc',
    id: 'dashboardpc',

    title: '<span class="panel-title-style">' + esapp.Utils.getTranslation('processing_pc2') + '</span>',
    paneltitle:'',
    setdisabledPartial:false,
    setdisabledAll:false,
    activePC:false,
    activeversion: '',
    currentmode: '',
    dbstatus:false,
    internetconnection:false,

    layout: 'border',
    bodyBorder: true,
    bodyPadding:0,
    flex:1,


    initComponent: function () {
        var me = this;
        me.setTitle('<span class="panel-title-style">' + me.paneltitle + '</span>');

        me.bodyPadding = 0;

        if (me.activePC) {
            me.toolbarCls = 'active-panel-body-style';
            me.textCls = 'panel-text-style';
        }
        else {
            me.toolbarCls = '';
            me.textCls = 'panel-text-style-gray';
        }

        if (me.dbstatus)
            me.dbstatusCls = 'running';
        else
            me.dbstatusCls = 'notrunning';

        if (me.internetconnection)
            me.internetCls = 'connected';
        else
            me.internetCls = 'notconnected';

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            layout: {
                type: 'vbox',
                // pack: 'left',
                align: 'middle'
            },
            padding: '5 5 10 5',
            cls: me.toolbarCls,
            defaults: {
                width: 160,
                textAlign: 'left'
                ,disabled: me.setdisabledAll
            },
            items: [
                {
                    xtype: 'servicemenubutton',
                    service: 'eumetcast',
                    text: esapp.Utils.getTranslation('eumetcast'),     // 'Eumetcast',
                    handler: 'checkStatusServices',
                    disabled: me.setdisabledPartial
                }, ' ',
                {
                    xtype: 'servicemenubutton',
                    service: 'internet',
                    text: esapp.Utils.getTranslation('internet'),     // 'Internet',
                    handler: 'checkStatusServices',
                    disabled: me.setdisabledPartial
                }, ' ',
                {
                    xtype: 'servicemenubutton',
                    service: 'ingest',
                    text: esapp.Utils.getTranslation('ingest'),     // 'Ingest',
                    handler: 'checkStatusServices',
                    disabled: me.setdisabledPartial
                }, ' ',
                {
                    xtype: 'servicemenubutton',
                    service: 'processing',
                    text: esapp.Utils.getTranslation('processing'),     // 'Processing',
                    handler: 'checkStatusServices',
                    disabled: me.setdisabledPartial
                }, ' ',
                {
                    xtype: 'servicemenubutton',
                    service: 'system',
                    text: esapp.Utils.getTranslation('system'),     // 'System',
                    handler: 'checkStatusServices'
                }, '-',
                {
                xtype: 'splitbutton',
                name: 'datasyncbtn',
                text: esapp.Utils.getTranslation('datasynchronization'),     // 'Data Synchronization',
                iconCls: 'data-sync',       // 'fa fa-exchange fa-2x',  //  fa-spin 'icon-loop', // icomoon fonts
                //style: { color: 'blue' },
                scale: 'medium',
                width: 255,
                handler: function(){this.showMenu();},
                menu: Ext.create('Ext.menu.Menu', {
                    width: 230,
                    margin: '0 0 10 0',
                    floating: true,
                    items: [
                        {   xtype: 'checkbox',
                            boxLabel: esapp.Utils.getTranslation('disableautosync'),     // 'Disable Auto Sync',
                            name: 'enabledisableautosync',
                            checked   : true,
                            handler: 'execEnableDisableAutoSync'
                        },
                        {   text: esapp.Utils.getTranslation('executenow'),     // 'Execute Now',
                            name: 'executenow',
                            glyph: 'xf04b@FontAwesome',
                            cls:'menu-glyph-color-green',
                            handler: 'execManualDataSync'
                        }
                    ]
                })
            },{
                xtype: 'splitbutton',
                name: 'dbsyncbtn',
                text: esapp.Utils.getTranslation('dbsynchronization'),     // 'DB Synchronization',
                iconCls: 'db-sync',       // 'fa fa-database fa-2x',  //  fa-spin 'icon-loop', // icomoon fonts
                //style: { color: 'blue' },
                scale: 'medium',
                width: 255,
                handler: function(){this.showMenu();},
                menu: Ext.create('Ext.menu.Menu', {
                    width: 230,
                    margin: '0 0 10 0',
                    floating: true,
                    items: [
                        {   xtype: 'checkbox',
                            boxLabel: esapp.Utils.getTranslation('disableautosync'),     // 'Disable Auto Sync',
                            name: 'enabledisableautodbsync',
                            checked   : true,
//                            glyph: 'xf04b@FontAwesome',
//                            cls:'menu-glyph-color-green',
                            handler: 'execEnableDisableAutoDBSync'
                        },
                        {   text: esapp.Utils.getTranslation('executenow'),     // 'Execute Now',
                            name: 'executenow',
                            glyph: 'xf04b@FontAwesome',
                            cls:'menu-glyph-color-green',
                            handler: 'execManualDBSync'
                        }
                    ]
                })
            }]
        });

        me.items = [{
            xtype: 'panel',
            region: 'center',
            layout: {
                type: 'table',
                columns: 2,
                tableAttrs: {
                    style: {
                        width: '100%',
                        padding:0
                    }
                }
            },
            bodyPadding:10,
            defaults: {
                margin:'0 0 10 0'
            },
            items: [{
                xtype: 'box',
                html: esapp.Utils.getTranslation('activeversion'),     // 'Active version:',
                cls: me.textCls
            },{
                xtype: 'box',
                html: '<b>'+me.activeversion+'</b>',
                width: 120
            },{
                xtype: 'box',
                html: esapp.Utils.getTranslation('mode'),     // 'Mode:',
                cls: me.textCls,
                width: 150
            },{
                xtype: 'box',
                html: '<b>'+me.currentmode+'</b>'
            },{
                xtype: 'box',
                html: esapp.Utils.getTranslation('postgresql-status'),     // 'PostgreSQL Status:',
                cls: me.textCls,
                width: 150
            },{
                xtype: 'box',
                height:26,
                cls: me.dbstatusCls
                //src: 'resources/img/icons/check-square-o.png'
            },{
                xtype: 'box',
                html: esapp.Utils.getTranslation('internetconnection'),     // 'Internet connection:',
                cls: me.textCls,
                width: 150
            },{
                xtype: 'box',
                height:26,
                cls: me.internetCls
                //src: 'resources/img/icons/check-square-o.png'
            }]
        },{
            region: 'south',
            title: '&nbsp;' + esapp.Utils.getTranslation('diskstatus'),     // , 'Disk status'
            split:false,
            collapsible:true,
            collapsed: true,
            // flex:1.5,
            iconCls: 'x-tool-okay', // 'fa fa-check-circle-o fa-2x', // fa-check-square fa-chevron-circle-down fa-check-circle fa-check
            iconAlign : 'left',
            height: 210,
            minHeight: 200,
            maxHeight: 210,
            layout: 'fit',
            style: {
                color: 'white'
            },
            items: [{
                xtype: 'image',
                src: 'resources/img/RAID_Monitor.png',
                width: 265,
                height: 158
            }]
        }];

        if (me.activePC) {
            me.items[0].bodyCls = 'active-panel-body-style';
            //me.bodyCls = 'active-panel-body-style';
            me.controller.checkStatusServices();
        }
        else {
            me.items[0].bodyCls = '';
            //me.bodyCls = '';
        }


        me.callParent();
    }
});
