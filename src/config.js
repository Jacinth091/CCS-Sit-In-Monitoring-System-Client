const rawApiUrl = import.meta.env.VITE_API_URL;
const rawAssetUrl = import.meta.env.VITE_ASSET_URL;

const isLocalHost = (host) => host === 'localhost' || host === '127.0.0.1';

const mapHostIfNeeded = (urlString) => {
	if (!urlString) return urlString;
	try {
		const url = new URL(urlString);
		if (isLocalHost(url.hostname) && !isLocalHost(window.location.hostname)) {
			url.hostname = window.location.hostname;
		}
		return url.toString();
	} catch {
		return urlString;
	}
};

export const API_URL = mapHostIfNeeded(rawApiUrl);
export const ASSET_URL = mapHostIfNeeded(rawAssetUrl) || `${window.location.origin}/sitIn`;
