import Lowerdash from 'lowerdash';
import { Model } from 'backbone';
import moment from 'moment';

export default class SuperModel extends Model {
	schema = {};

	constructor(attributes, options){
		super({}, options);

		this.options = options;
		this.setSchema();

		Lowerdash.each(this.schema, (properties, field) => {
			let { initial, compute } = properties;


			if(typeof compute == 'function'){
				this.set({
					[field]: compute
				});
			}

			if(initial){
				this.set({
					[field]: (typeof initial == 'function') ? initial.call(this) : initial
				});
			}
		});

		this.set(attributes);

		return this;
	}

	get(field) {
		var value = super.get(field);

		return typeof value == 'function' ? value.call(this) : value;
	}

	set(values, options) {
		values = Lowerdash.mapValues(values, (value, field) => {
			if(this.schema[field]){
				var { forceType, change } = this.schema[field];

				if(forceType){
					value = SuperModel.cast(value, forceType);

				} else if(change) {
					value = change.call(this, value);
				}
			}

			return value;
		});

		return super.set(values, options);
	}

	/**
	 * Checks if given key is a custom one
	 * @method isComputed
	 * @param {String} key 				Key name
	 * @return {Bool}					Instance's key presence
	 */
	isComputed(field){
		return this.has(field) && typeof this.schema[field].compute == 'function';
	}

	/**
	 * Checks if model has all provided fields
	 * @method hasAll
	 * @param {Array} fields		Fields that must verify the presence
	 * @return {Boolean}			All fields are present
	 */
	hasAll(fields){
		return fields.every(field => this.has(field));
	}

	/**
	 * Change the type of the provided value
	 * @method cast
	 * @param {Mixed} value			Value to cast, mostly a string or a number
	 * @param {String} type			Type to cast value to. Type can be 'number', 'boolean', 'date' or 'array'
	 * @return {Mixed}				Casted value
	 */
	static cast(value, type){
		if(type == 'number' && !Lowerdash.isNumber(value)){
			value = Number(value);

		} else if(type == 'boolean' && !Lowerdash.contains([undefined, null, 'false', 0, '0', false], value)){
			value = true;

		} else if(type == 'boolean' && Lowerdash.contains([undefined, null, 'false', 0, '0'], value)){
			value = false;

		} else if(type == 'date' && !Lowerdash.isDate(value)){
			value = moment(value);

		} else if(type == 'array' && Lowerdash.isString(value)){
			value = value.split(/,\s?/);

		} else if(type == 'array' && !Lowerdash.isArray(value)){
			value = Lowerdash.from(value);
		}

		return value;
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

	setSchema(){
		return this;
	}
}
