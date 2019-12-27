import device from './util/device';

const ios = device.ios ? 'ios': '';
const android = device.android ? 'android': '';
const windows = device.windows ? 'windows': '';
const touch = device.desktop ? 'hover': 'touch';
const userAgent = [ ios, android, windows, touch ];
document.documentElement.className = userAgent.filter((className) => className !== '').join(' ');

class Bootstrap {

	init( modulesOption ) {
		modulesOption.forEach(moduleOption => this.install(moduleOption));
	}

	install({module, dynamic = false}) {

		if (dynamic) {
			// load
			this.initDynamicModule( module );
		} else {
			// just init
			this.initModule( module );
		}
	}

	//checkPathname( module, path, dynamic ) {
	//	let parsedPathname = url.parse( window.location.href ).pathname.split('/');
	//	let parsedRoute = path.split('/');
	//
	//	if ( parsedPathname.every( (route, i) => route === parsedRoute[i] ) ) {
	//		// load or
	//		dynamic ? this.initDynamicModule( module ) : this.initModule( module );
	//	}
	//}

	initDynamicModule( promise ) {
		promise().then( _ => this.initModule( _[ Object.keys( _ )[0] ] ));
	}

	initModule( module ) {
		module();
	}

}

const boot = new Bootstrap();

export { boot };
