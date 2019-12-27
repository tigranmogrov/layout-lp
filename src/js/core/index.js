import {Initiate, Listener} from './life-cycle';

export {Initiate, Listener};

/*
* Singleton
* */
export class Singleton {

	constructor( className ) {
		if ( !className._instance ) className._instance = this;
		else return className._instance;
	}

}

/*
* State container
* */
export class State {

	constructor( container, nextClassState ) {
		this.container = container;
		this._nextClassState = nextClassState;
	}

	next() {
		return new this._nextClassState( this.container );
	}

}

/*
* Bind decorator
* */
export function Bind( methodName ) {
	return function ( classPrototype, propertyName, descriptor ) {
		if ( descriptor.initializer ) {
			classPrototype[ '_' + propertyName ] = descriptor.initializer();
		}

		delete descriptor.writable;
		delete descriptor.initializer;

		descriptor.get = function() {
			return this[ '_' + propertyName ];
		};
		descriptor.set = function( value ) {
			this[ '_' + propertyName ] = value;
			this[ methodName ]();
		};
	};
}
