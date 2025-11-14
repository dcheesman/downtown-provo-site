/**
 * Main JavaScript for Downtown Provo Inc. website
 * Handles video embed configuration loading from Google Sheets or JSON fallback
 */

(function() {
	'use strict';

	// Google Sheet URL (published as TSV)
	const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQorKD7yGsoDMODmuZr0tGulqDYDKwF63t_4mpx5rHmCpZU_xxP2AN_Ra4ucEto4MZjDUCGvmer3Erj/pub?gid=0&single=true&output=tsv';

	/**
	 * Convert YouTube watch URL to embed URL format
	 * Handles both watch URLs and direct embed URLs
	 */
	function convertToEmbedUrl(url) {
		if (!url || typeof url !== 'string') {
			return null;
		}

		// If already an embed URL, return as-is
		if (url.includes('youtube.com/embed/')) {
			return url;
		}

		// Extract video ID from watch URL
		const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
		if (watchMatch) {
			return `https://www.youtube.com/embed/${watchMatch[1]}`;
		}

		// Try short URL format (youtu.be)
		const shortMatch = url.match(/youtu\.be\/([^?]+)/);
		if (shortMatch) {
			return `https://www.youtube.com/embed/${shortMatch[1]}`;
		}

		// If it's already a valid embed URL or other format, return as-is
		return url;
	}

	/**
	 * Fetch video URL from Google Sheet (cell A1)
	 * Returns the embed URL or null if fetch fails
	 */
	function fetchFromGoogleSheet() {
		return fetch(GOOGLE_SHEET_URL)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to fetch Google Sheet');
				}
				return response.text();
			})
			.then(tsv => {
				// Parse TSV - first cell (A1) is the first value before tab or newline
				const firstCell = tsv.split('\t')[0].trim().split('\n')[0].trim();
				if (firstCell) {
					return convertToEmbedUrl(firstCell);
				}
				return null;
			})
			.catch(error => {
				// Log CORS or other fetch errors
				if (error.name === 'TypeError' || error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
					console.warn('CORS issue: Could not fetch from Google Sheet (likely due to local development). Falling back to default video.');
				} else {
					console.warn('Could not fetch from Google Sheet:', error);
				}
				return null;
			});
	}

	/**
	 * Load video embed URL from JSON configuration file
	 * Returns the embed URL or null if fetch fails
	 */
	function fetchFromJson() {
		return fetch('/data/video-config.json')
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to load video config');
				}
				return response.json();
			})
			.then(data => {
				if (data && data.embedUrl && typeof data.embedUrl === 'string') {
					return convertToEmbedUrl(data.embedUrl);
				}
				return null;
			})
			.catch(error => {
				console.warn('Could not load video config from JSON:', error);
				return null;
			});
	}

	/**
	 * Load video embed URL with fallback chain:
	 * 1. Try Google Sheet first
	 * 2. Fall back to JSON config
	 * 3. Fall back to default URL
	 */
	function loadVideoConfig() {
		const iframe = document.getElementById('hero-video-iframe');
		if (!iframe) {
			return;
		}

		// Default fallback URL (YouTube watch URL - will be converted to embed format)
		const defaultUrl = 'https://www.youtube.com/watch?v=M61QjWqvWxY';
		const defaultEmbedUrl = convertToEmbedUrl(defaultUrl);

		// Try Google Sheet first, then JSON, then default
		fetchFromGoogleSheet()
			.then(embedUrl => {
				if (embedUrl) {
					console.log('Video loaded from Google Sheet');
					iframe.src = embedUrl;
					return; // Success, we're done
				}
				// Google Sheet failed, try JSON
				return fetchFromJson();
			})
			.then(embedUrl => {
				// This will be called with the result of fetchFromJson() if Google Sheet failed
				// or undefined if Google Sheet succeeded
				if (embedUrl) {
					console.log('Video loaded from JSON config');
					iframe.src = embedUrl;
				} else if (!iframe.src || iframe.src === '') {
					// Both failed, use fallback
					console.log('Using fallback video URL:', defaultUrl);
					iframe.src = defaultEmbedUrl;
				}
			})
			.catch(error => {
				// Catch any errors in the chain
				if (!iframe.src || iframe.src === '') {
					console.log('Using fallback video URL due to error:', defaultUrl);
					iframe.src = defaultEmbedUrl;
				}
			});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', loadVideoConfig);
	} else {
		loadVideoConfig();
	}
})();

