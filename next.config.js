const { i18n } = require('./next-i18next.config');
const withImages = require('next-images');
const withInterceptStdout = require('next-intercept-stdout');

var hideWarn = [
	'Invalid next.config.js options detected:',
	'The value at .experimental has an unexpected property, images, which is not in the list of allowed properties',
	'https://nextjs.org/docs/messages/invalid-next-config',
	'You have enabled experimental feature (images) in next.config.js.',
	'Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use at your own risk.',
	'Fast Refresh had to perform a full reload.',
	"Cannot read properties of null (reading 'length')"
];

const nextConfig = withInterceptStdout(
	withImages({
		images: {
			disableStaticImages: true
		},
		reactStrictMode: false,
		swcMinify: true,
		i18n,
		typescript: {
			ignoreBuildErrors: true,
		},
		eslint: {
			ignoreDuringBuilds: true,
		},
		webpack(config, options) {
			config.optimization.splitChunks = {
				chunks: "all",
				maxSize: 50000, 
			};
			config.cache = false; 
			return config
		}
	}),
	(log) => (hideWarn.some((warn) => log.includes(warn)) ? '' : log),
);

module.exports = nextConfig;
