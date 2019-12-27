export default (function Device() {
	const ua = window.navigator.userAgent;

	const device = {
		ios: false,
		android: false,
		androidChrome: false,
		desktop: false,
		windows: false
	};

	//eslint-disable-next-line no-useless-escape
	const windows = ua.match(/(Windows Phone);?[\s\/]+([\d.]+)?/);
	//eslint-disable-next-line no-useless-escape
	const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
	const ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);


	// Windows
	if (windows) {
		device.os = 'windows';
		device.osVersion = windows[2];
		device.windows = true;
	}
	// Android
	if (android && !windows) {
		device.os = 'android';
		device.osVersion = android[2];
		device.android = true;
		device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
	}
	if (ipad || iphone || ipod) {
		device.os = 'ios';
		device.ios = true;
	}

	// Desktop
	device.desktop = !(device.os || device.android || device.webView);

	// Webview
	device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

	// Export object
	return device;
}());
