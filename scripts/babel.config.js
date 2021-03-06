"use strict";
const {engines: {node:nodeVersion}} = require("../package.json");



module.exports =
{
	plugins:
	[
		"@babel/proposal-class-properties",
		"@babel/proposal-export-namespace-from",
		"@babel/proposal-nullish-coalescing-operator",
		"@babel/proposal-numeric-separator",
		"@babel/proposal-optional-catch-binding",
		"@babel/proposal-optional-chaining",
		"@babel/proposal-private-methods",
		"add-module-exports"
	],
	presets:
	[
		["@babel/preset-env",
		{
			corejs: 3,
			targets: `node ${nodeVersion}`,
			useBuiltIns: "usage"
		}]
	]
};
