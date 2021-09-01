Ext.application({
	extend: 'MyNew.Application',
	name: 'MyNew',
	mainView: 'MyNew.view.Main'
});
Ext.define('MyNew.view.MyViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.myview',
 
    stores: {
        pokemon: {
            type: 'store',
            proxy: {
                type: 'ajax',
                url: 'pokemon.json'
            },
            autoLoad: true,
            sorters: ['name']
        },
        filteredPokemon: {
            type: 'chained',
            source: '{pokemon}'
        }
    }
});
 
Ext.define('MyNew.view.EarthquakeGrid', {
    extend: 'Ext.Panel',
    xtype: 'pokemongrid',
 
    config: {
        store: 'ext-empty-store'
    },
 
    applyStore: function (store) {
        return Ext.data.StoreManager.lookup(store);
    },
 
    updateStore: function (store) {
        this.down('grid').setStore(store);
    },
 
    tbar: [{
        xtype: 'sliderfield',
        width: 300,
        label: 'HP over 30',
        labelWidth: 80,
        increment: 1,
        minValue: 30,
        maxValue: 100,
        value: 30,
        liveUpdate: true,
        listeners: {
            change: function (slider, value) {
                slider.setLabel('HP over ' + value);
                var store = slider.up('pokemongrid').down('grid').getStore();
                store.clearFilter();
                store.filterBy(function (record) {
                    return (record.data.hp >= value);
                });
            }
        }
    }],
 
    layout: 'fit',
 
    items: [{
        xtype: 'grid',
        plugins: [{
            type: 'cellediting',
            triggerEvent: 'tap'
        }],
        columns: [{
            text: 'Name',
            dataIndex: 'name',
            flex: 1,
            editable: true
        }, {
            text: 'HP',
            dataIndex: 'hp',
            editable: true
        }]
    }],
    border: true,
    margin: 8
});
 
Ext.define('MyNew.view.Main', {
    extend: 'Ext.Panel',
    viewModel: {
        type: 'myview'
    },
    layout: 'hbox',
    defaults: {
        flex: 1,
        xtype: 'pokemongrid'
    },
    items: [{
        title: 'Pokemon (Source)',
        bind: {
            store: '{pokemon}'
        }
    }, {
        title: 'Filtered Pokemon (Chained)',
        bind: {
            store: '{filteredPokemon}'
        }
    }]
});