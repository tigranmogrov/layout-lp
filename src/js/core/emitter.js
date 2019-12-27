import { Subject } from 'rxjs';

const createName = (name) => `$${ name }`;

export class Emitter {

	constructor() {
		this.subjects = {};
	}

	emit( name, data ) {
		const fnName = createName( name );
		this.subjects[ fnName ] || ( this.subjects[ fnName ] = new Subject() );
		this.subjects[ fnName ].next( data );
	}

	on( name, handler ) {
		const fnName = createName( name );
		this.subjects[ fnName ] || ( this.subjects[ fnName ] = new Subject() );
		this.subjects[ fnName ].subscribe( handler );
	}

	off( name ) {
		const fnName = createName( name );
		if ( this.subjects[ fnName ] ) {
			this.subjects[ fnName ].unsubscribe();
			delete this.subjects[ fnName ];
		}
	}

}
