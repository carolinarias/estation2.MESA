Ext.define('esapp.model.InternetSource', {
    extend: 'esapp.model.Base',
    
    requires : [
        'Ext.data.proxy.Rest'
    ],

    fields: [
        {name: 'internet_id'},
        {name: 'defined_by'},
        {name: 'descriptive_name'},
        {name: 'description'},
        {name: 'modified_by'},
        {name: 'update_datetime'},
        {name: 'url'},
        {name: 'user_name'},
        {name: 'password'},
        {name: 'type'},
        {name: 'include_files_expression'},
        {name: 'files_filter_expression'},
        {name: 'status'},
        {name: 'pull_frequency'},
        {name: 'frequency_id'},
        {name: 'start_date'},
        {name: 'end_date'},
        {name: 'datasource_descr_id'},
        {name: 'format_type'},
        {name: 'file_extension'},
        {name: 'delimiter'},
        {name: 'date_type'},
        {name: 'date_position'},
        {name: 'product_identifier'},
        {name: 'prod_id_position'},
        {name: 'prod_id_length'},
        {name: 'area_type'},
        {name: 'area_position'},
        {name: 'area_length'},
        {name: 'preproc_type'},
        {name: 'product_release'},
        {name: 'release_position'},
        {name: 'release_length'},
        {name: 'native_mapset'}
    ]

    ,autoLoad: true
    ,autoSync: true

    ,proxy: {
        type: 'rest',

        appendId: false,

        api: {
            read: 'internetsource',
            create: 'internetsource/create',
            update: 'internetsource/update',
            destroy: 'internetsource/delete'
        },
        reader: {
             type: 'json'
            ,successProperty: 'success'
            ,rootProperty: 'internetsources'
            ,messageProperty: 'message'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            rootProperty: 'internetsources'
        },
        listeners: {
            exception: function(proxy, response, operation){
                Ext.MessageBox.show({
                    title: 'INTERNET SOURCE MODEL - REMOTE EXCEPTION',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        }
    }
    ,listeners: {
        update: function(store, record, operation, modifiedFieldNames, details, eOpts  ){
            Ext.toast({ html: "Update: "+operation.getResultSet().message, title: operation.action, width: 200, align: 't' });
        },
        write: function(store, operation){
            if (operation.action == 'update' && operation.success) {
               Ext.toast({ html: "Write: "+operation.getResultSet().message, title: operation.action, width: 200, align: 't' });
            }
        }
    }
});
