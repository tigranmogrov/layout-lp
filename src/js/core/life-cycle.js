import {Emitter} from './emitter';

const HOOK_EMITTER = new Emitter();
let moduleId;

/* Module decorator */
export function Initiate(options = {}) {
	// create moduleId
	moduleId = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();

	return function (classPrototype) {

		const classInstance = new classPrototype();
		/*
		* HOOK `PREPARE` - prepare module with decorators
		* */
		HOOK_EMITTER.emit(`$prepare.module#${moduleId}`, classInstance);
		/*
		* HOOK `OnView` - invoke onViewInit methods
		* */
		if (options.onViewInit) {
			onViewIO(classInstance).observe(options.onViewInit);
		}

		// return `init` to bootstrap
		return () => classInstance.init ? classInstance.init() : false;
	};
}

export function Listener(target, eventName) {
	return function (classPrototype, propertyName) {

		// wait HOOK `PREPARE`
		HOOK_EMITTER.on(`$prepare.module#${moduleId}`, (instance) => {

			// on HOOK `PREPARE` addListeners
			target.addEventListener(eventName, instance[propertyName].bind(instance));

			// unsubscribe of HOOK `PREPARE`
			HOOK_EMITTER.off(`$prepare.module#${moduleId}`);
		});
	};
}

/*
* OnView - IntersectionObserver init module method onViewInit
* !Important - need polyfill for IntersectionObserver
* */
function onViewIO(classInstance) {
	return new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {

			if (entry.isIntersecting) {
				classInstance.onViewInit();
				observer.disconnect();
			}
		});
	});
}
