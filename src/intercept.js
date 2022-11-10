const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.send = function () {
	const originalOnReadyStateChange = this.onreadystatechange;

	this.onreadystatechange = function () {
		if (this.readyState && this.readyState === 4) {
			if (this.getResponseHeader('content-type')?.includes('application/json')) {
				let response;
				try {
					response = JSON.parse(this.responseText);
				} catch (e) {
					return;
				}

				if (response && typeof response === 'object') {
					const checkForBlueVerified = (obj) => {
						for (const key in obj) {
							if (key.includes('is_blue_verified')) {
								obj[key] = false;
							} else if (typeof obj[key] === 'object') {
								checkForBlueVerified(obj[key]);
							}
						}
					};

					checkForBlueVerified(response);

					Object.defineProperty(this, 'responseText', {
						value: JSON.stringify(response),
					});
				}
			}
		}

		return originalOnReadyStateChange.apply(this, arguments);
	};

	return originalSend.apply(this, arguments);
};
