#!/usr/bin/env bash

npx browserify \
	-r bip32 \
	-r bip39 \
	-r jquery \
	-r bitcoinjs-lib:bitcoinjs \
	-r buffer \
	-r ./lib/dice.js:dice \
	-r ./lib/wordlist.js:wordlist \
	-r ./lib/presentation.js:presentation \
	-r ./lib/logic.js:logic \
	-o calculator/bundle.js
