#!/usr/bin/env bash
OUT=calculator/bundle.js

echo "--- Bundling code and dependencies with browserify. Bundle location: [${OUT}]"
echo "--- The bundle file must be committed and pushed every time it is changed! (See README_dev.md)"
echo "--- Added new dependencies? Don't forget to include them here too."

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
	-o $OUT
