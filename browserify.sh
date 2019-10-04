#!/usr/bin/env bash

browserify \
	-r bip32 \
	-r bip39 \
	-r jquery \
	-r bitcoinjs-lib:bitcoinjs \
	-r buffer \
	-r ./lib/seedpicker.js:seedpicker \
	-r ./lib/presentation.js:presentation \
	-o calculator/bundle.js
