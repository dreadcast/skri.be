(function(){
	var 
		_ = require('hidash'),
		supermodel = require('backbone-supermodel');

	var BaseModel = supermodel.extend({
		 /**
		 *	Properties already set
		 *	@property {Array} specified
		 *	@protected
		 */
		
/*
		options: {
			idProperty: 'key',
			schema: {}
		},
*/
		
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
	
	return;



	/**
	 * Default base model for Kubity App
	 * 
	 *	@class Qbt.Model
	 *	@module Base
	 *	@constructor
	 *	@chainable
	 *	@param {Object | Number} data		When an object is provided, Model's data.<br>
	 *										Otherwise Model ID for further retrieval.
	 *	@param {Object} options				Instance options
	 *	@return {QbtBaseModel}				Instance
	 *	@example
	 *	var myQbtModel = new Qbt.Model({
	 *		title: 'My model title',
	 *		id: 156,
	 *		customProperties: {
	 *			prop1: 1,
	 *			prop2: 2
	 *		}
	 *	});
	 */
	/**
	 *	@event change
	 *	@param {Mixed} newValue Observable's new value
	 *	@param {String} keyName Observable's key name
	 */
	var _ = require('hidash'),
		Class = require('./Class');
		
	module.exports = Class({
		constructor: function(options){
			this.setOptions(options);
			this.data = {};
			this.specified = [];
			this.schema = {};
			this.setSchema();
			
			_(this.schema).each(function(properties, path){
				if(properties.initial)
					this.set(path, properties.initial);
			}, this);
	
			_(this.schema).each(function(properties, computedPath){
				if(properties.compute && !properties.require)
					this.compute(computedPath, properties)
			}, this);
			
			this.on('change', function(path, value, type){
				_(this.schema).each(function(properties, computedPath){
					if(properties.compute && properties.require && _.contains(properties.require, path))
						this.compute(computedPath, properties)
				}, this);
			});
			
			return this;
		},
		
		mergeSchema: function(schema){
			var mergedSchema = {};
			
				
			_.merge(mergedSchema, this.schema, schema);
			
			return mergedSchema;
		},
		
		setSchema: function(){
			this.schema = {};
			
			return this;
		},
		
		 /**
		 *	Properties already set
		 *	@property {Array} specified
		 *	@protected
		 */
		
		options: {
			idProperty: 'key',
			schema: {}
		},
		
		/**
		 *	Defines a custom computed observable
		 *
		 *	@method compute
		 *	@param {Object} properties		Computed field's properties
		 *	@chainable
		 *	@return {Model}			Instance
		*/
		compute: function(path, properties){
			if(properties.require && _.intersection(this.specified, properties.require).length != properties.require.length)
				return this;
					
			_.setFromPath(this.data, path, properties.compute.call(this));
			
			return this;
		},
		
		/**
		 * Set the model's data according to provided schema.
		 * @method mergeData
		 * @param {Object} newData			Model's data
		 * @private
		 * @chainable
		 * @return {QbtBaseModel}			Instance
		 */
		merge: function(newData){
			// Get non custom fields to set regular data
			_(this.schema).pick(function(properties){
				return !properties.compute;
			}).each(function(properties, path){
				var dataValue = _.getFromPath(newData, path);
				
				if(dataValue)
					this.set(path, dataValue);
			}, this);
			
			this.emit('merge', newData);
			
			return this;
		},
		
		/**
		 *	Casts given data and updates model
		 *
		 *	@method cast
		 *	@param {String} path			Path (point delimited) to data
		 *	@param {String} type			Type to cast data to. Accepts 'number', 'boolean' and 'date'
		 *	@chainable
		 *	@return {QbtBaseModel}			Instance
		 *	@example
		 *		// observe  an object
		 *		myQbtModel = {
		 *			prop1: '123',
		 *			prop2: 'true'
		 *		}
		 *		
		 *		myQbtModel.cast('prop1', 'number');
		 *		myQbtModel.cast('prop2', 'boolean');
		 *
		 *		myQbtModel = {
		 *			prop1: 123,
		 *			prop2: true
		 *		}
		*/
		cast: function(value, type){
			if(typeof(value) == type)
				return value;
			
			else if(type == 'number')
				return Number(value);
			
			else if(type == 'boolean' && value === 'true')
					return true;
			
			else if(type == 'boolean' && value === 'false')
				return false;
			
			else if(type == 'date')
				return new Date(parseInt(value));
	
			else if(type == 'array')
				return _.from(value);
			
			return value;
		},
		
		/**
		 * Update model's data with supplied value
		 * @method set
		 * @chainable
		 * @param {String} path 			Path to data
		 * @param {Mixed} value				Value to set
		 * @return {QbtBaseModel}			Instance
		 */
		set: function(path, value){
			if(this.isComputed(path))
				throw new Error('this.data.' + path + ' is a computed property');
			
			var schemaPart = _.getFromPath(this.schema, path);
				
			if(schemaPart && schemaPart.type)
				value = this.cast(value, schemaPart.type);
			
			_.setFromPath(this.data, path, value);
			
			this.specified = _(this.specified).union([path]).value();
			
			this.emit('change', path, value);
			
			return this;
		},
		
		/**
		 * Removes model's data from supplied path
		 * @method set
		 * @chainable
		 * @param {String} path 			Path to data
		 * @return {QbtBaseModel}			Instance
		 */
		unset: function(path){
			_.eraseFromPath(this.data, path);
			
			this.specified = _.without(this.specified, path);
			
			return this;
		},
		
		/**
		 * Get model's data
		 * @method get
		 * @param {String} key 				Key name
		 * @return {Mixed}					Instance's data value, wether it is observable or not
		 */
		get: function(path){
			return _.getFromPath(this.data, path);
		},
		
		/**
		 * Checks if model has given key
		 * @method has
		 * @param {String} key 				Key name
		 * @return {Bool}					Instance's key presence
		 */
		has: function(path){
			return !_.contains([/*false, */null, undefined], _.getFromPath(this.data, path));
		},
		
		/**
		 * Checks if given key is a custom one
		 * @method isComputed
		 * @param {String} key 				Key name
		 * @return {Bool}					Instance's key presence
		 */
		isComputed: function(path){
			return this.has(path) && _.isFunction(_.getFromPath(this.schema, path).compute);
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
				
				if(fieldValue && properties.type == 'date')
					fieldValue = fieldValue.getTime();
					
				_.setFromPath(rawObj, path, fieldValue);
			}, this);
			
			return rawObj;
		},
		
		getJs: function(){
			
		},
		
		getId: function(){
			return this.get(this.options.idProperty);
		}
	});
})();
