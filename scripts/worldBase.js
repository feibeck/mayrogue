// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util'],
    function(_, Util) {
        
    var WorldBase = Util.extend(Util.Base, {
        properties: [
            {field: '_map', getter: true},
            {field: '_entities', getter: true},
            {field: '_batchInProgress', getter: 'batchInProgress'}
        ],
        mixins: [Util.Observable],

        _dirty: false,

        create: function(config) {
            var me = this;
            Util.Base.prototype.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);

            me.getConfig(config, ['map']);

            me._entities = [];
            if (config.entities) _.each(config.entities, function(entity) {
                me.addEntity(entity);
            });
        },

        addEntity: function(entity) {
            var me = this;

            me._entities.push(entity);
            entity.setWorld(me);
            entity.attachListeners({change: me._onEntityChange}, me);
        },

        removeEntity: function(entity) {
            var me = this;

            me._entities = _.without(me._entities, entity);
            entity.setWorld(null);
            entity.detachListeners({change: me._onEntityChange}, me);
        },

        _onEntityChange: function(entity, bbOld, bbNew) {
            var me = this;

            me.fireEvent('change');
        },

        getEntityById: function(id) {
            var me = this;
            var found = _.find(me._entities, function(entity) {
                return id === entity.getId();
            });

            if (!found) return null;
            return found;
        },

        getMapData: function() {
            var me = this;

            return me._map.getData();
        },

        destroy: function() {
            var me = this;

            _.each(me._entities, function(entity) {
                entity.detachListeners({change: me._onEntityChange}, me);
            });
        },

        rectAccessible: function(rect, entity) {
            var me = this;

            if (!me._map.rectAccessible(rect)) return false;

            if (!entity) return true;
            return !_.some(me._entities, function(e) {
                return (e !== entity &&
                    e.getBoundingBox().intersect(rect));
            });
        },

        fieldAccessible: function(x, y, entity) {
            var me = this;

            if (!me._map.fieldAccessible(x, y)) return false;

            if (!entity) return true;
            return !_.some(me._entities, function(e) {
                return (e !== entity &&
                    e.getBoundingBox().isInside(x, y));
            });
        }
    });

    return WorldBase;

});
