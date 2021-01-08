#!/usr/bin/env bash
OUT=calculator/bundle.js

echo "--- Bundling dependencies with browserify,"
echo "--- Bundle location: [${OUT}]"
echo "--- Currently, the bundle file must be committed and pushed every time it's changed! (See README_dev.md)"

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
