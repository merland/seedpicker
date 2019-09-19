#!/usr/bin/env bash

browserify \
	-r bip39 \
	-r bitcoinjs-lib:bitcoinjs \
	-r buffer \
	-r ./calculator/seedpicker.js:seedpicker \
	-o calculator/bundle.js