#!/usr/bin/env bash

browserify \
	-r bip32 \
	-r bip39 \
	-r jquery \
	-r bitcoinjs-lib:bitcoinjs \
	-r buffer \
	-r ./lib/seedpicker.js:seedpicker \
	-o calculator/bundle.js
