import Lowerdash from 'lowerdash';
import { Model } from 'backbone';
import moment from 'moment';

export default class SuperModel extends Model {
	schema = {};

	constructor(attributes, options){
		super(attributes, options);

		this.options = options;
		this.setSchema();

		Lowerdash.each(this.schema, (properties, field) => {
			let { change, forceType, initial, require } = properties;

			if(change){
				this.on('change:' + field, model => {
					model.set(field, change.call(model, model.get(field)), {
						silent: true
					});

					console.info('\nAUTO CHANGE: "' + model.get('id') + '" ' + field + '\n-> ', model.get(field));
				});

			} else if(forceType) {
				this.on('change:' + field, model => {
					model.cast(field);

					console.info(
						'\nCAST: "' + model.get('id') + '" ' +
						field + ' field to type ' + forceType + '\n-> ',
						model.get(field)
					);
				});
			}

			if(initial && (this.hasAll(require) || !require)){
				this.set(field, Lowerdash.isFunction(initial) ? initial.call(this) : initial);

				console.info('\nSET INITIAL: "' + this.get('id') + '" ' + field + ' field \n-> ', this.get(field));
			}
		});

		this.on('change', model => {
			Lowerdash.each(model.schema, (properties, field) => {
				model.compute(field);
			});
		});

		return this;
	}

	compute(field){
		let { compute, require } = this.schema[field];

		if(compute && (this.hasAll(require) || !require)){
			this.set(field, compute.call(this));

			console.info('\nCOMPUTE: "' + this.get('id') + '" ' + field + '\n-> ', this.get(field));
		}

		return this;
	}

	/**
	 * Checks if given key is a custom one
	 * @method isComputed
	 * @param {String} key 				Key name
	 * @return {Bool}					Instance's key presence
	 */
	isComputed(field){
		return this.has(field) && Lowerdash.isFunction(this.schema[field].compute);
	}

	/**
	 * Checks if model has all provided fields
	 * @method hasAll
	 * @param {Array} fields		Fields that must verify the presence
	 * @return {Boolean}			All fields are present
	 */
	hasAll(fields){
		return Lowerdash.every(fields, field => this.has(field));
	}

	/**
	 * Change the type of the provided value
	 * @method cast
	 * @param {Mixed} value			Value to cast, mostly a string or a number
	 * @param {String} type			Type to cast value to. Type can be 'number', 'boolean', 'date' or 'array'
	 * @return {Mixed}				Casted value
	 */
	cast(field){
		var value = this.get(field),
			type = this.schema[field].forceType;

		if(type == 'number' && !Lowerdash.isNumber(value)){
			value = Number(value);

		} else if(type == 'boolean' && !Lowerdash.contains([undefined, null, 'false', 0, '0', false], value)){
			value = true;

		} else if(type == 'boolean' && Lowerdash.contains([undefined, null, 'false', 0, '0'], value)){
			value = false;

		} else if(type == 'date' && !Lowerdash.isDate(value)){
			value = moment(value);

		} else if(type == 'array' && Lowerdash.isString(value)){
			value = value.split(',');

		} else if(type == 'array' && !Lowerdash.isArray(value)){
			value = Lowerdash.from(value);
		}

		return this.set(field, value, {
			silent: true
		});
	}

	/**
	 * Return model into raw object without data attributes contained in this.tricare.
	 * @method getRaw
	 * @return {Object}					Raw model data
	 */
	toJSON(){
		var rawObj = {};

		Lowerdash.each(this.schema, (properties, field) => {
			var fieldValue = this.get(field);

// 				if(fieldValue && properties.type == 'date')
// 					fieldValue = fieldValue.getTime();

			Lowerdash.setFromPath(rawObj, field, fieldValue);
		});

		return rawObj;
	}

	setSchema(){}
}
