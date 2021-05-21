export let isCordovaAvailable = () => {
	if (!(<any>window).cordova) {
		// alert('This is a native feature. Please use a device');
		console.log('This is a native feature. Please use a device');
		return false;
	}
	return true;
};