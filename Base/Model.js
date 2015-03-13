(function(){
	var 
		_ = require('hidash'),
		Model = require('backbone').Model;
// 		supermodel = require('backbone-supermodel');

	var BaseModel = Model.extend({
		/**
		 * Set key/value or values and cast schema fields with type property
		 * @method initialize
		 * @param {String|Object} field		Field of fieldset to set
		 * @param {Mixed} value				If field is of type String, corresponding value must be provided
		 * @return {Backbone.Model.prototype.set} set
		 */
		initialize: function(){
			this.on('change', function(model){
				this.set(_.mapValues(model.attributes, function(value, field){
					var schemaPart = this.schema[field];
			
					if(schemaPart && schemaPart.type)
						value = this.cast(value, this.schema[field].type);
					
					return value;
				}, this), {
					silent: true
				});
					
				_.each(this.schema, function(property, path){
					if(property.compute && (this.hasAll(property.require) || !property.require))
						this.set(path, property.compute.call(this));
				}, this);
			});
			
			return this;
		},
		
		/**
		 * Checks if given key is a custom one
		 * @method isComputed
		 * @param {String} key 				Key name
		 * @return {Bool}					Instance's key presence
		 */
		isComputed: function(path){
			return this.has(path) && _.isFunction(this.get(this.schema, path).compute);
		},
		
		/**
		 * Checks if model has all provided fields
		 * @method hasAll
		 * @param {Array} fields		Fields that must verify the presence
		 * @return {Boolean}			All fields are present
		 */
		hasAll: function(fields){
			return _.every(fields, function(item){
				return this.has(item);
			}, this);
		},
		
		/**
		 * Change the type of the provided value
		 * @method cast
		 * @param {Mixed} value			Value to cast, mostly a string or a number
		 * @param {String} type			Type to cast value to. Type can be 'number', 'boolean', 'date' or 'array'
		 * @return {Mixed}				Casted value
		 */
		cast: function(value, type){
			if(type == 'number' && !_.isNumber(value))
				return Number(value);
			
			else if(type == 'boolean' && !_.contains([undefined, null, 'false', 0, '0', false], value))
				return true;
			
			else if(type == 'boolean' && _.contains([undefined, null, 'false', 0, '0'], value))
				return false;
			
			else if(type == 'date' && !_.isDate(value))
				return new Date(parseInt(value));
	
			else if(type == 'array' && _.isString(value))
				return value.split(',');
	
			else if(type == 'array' && !_.isArray(value))
				return _.from(value);
			
			return value;
		},		
		
		/**
		 * Return model into raw object without data attributes contained in this.tricare.
		 * @method getRaw
		 * @return {Object}					Raw model data
		 */
		getRaw: function(){
			var rawObj = {};
			
			_(this.schema).each(function(properties, path){
				var fieldValue = this.get(path);
				
// 				if(fieldValue && properties.type == 'date')
// 					fieldValue = fieldValue.getTime();
					
				_.setFromPath(rawObj, path, fieldValue);
			}, this);
			
			return rawObj;
		}
	});
	
	module.exports = BaseModel;
})();
