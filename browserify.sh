#!/usr/bin/env bash

browserify \
	-r bip32 \
	-r bip39 \
	-r bitcoinjs-lib:bitcoinjs \
	-r buffer \
	-r ./calculator/seedpicker.js:seedpicker \
	-o calculator/bundle.js