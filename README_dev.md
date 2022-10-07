## Building

#### Normal build

`./build.sh`

#### Clean build

`rm -rf node_modules package-lock.json; ./build.sh`

#### Unit Testing

`npm test`

#### Run locally

Run ´./build.sh´ then open ´calculator/last-word.html´ in a browser.

#### Deployment

The build results in a bundle.js in `/calculator`.
Commit that file manually and Github pages will take care of the deployment.

##### TODO

Would be nice to not having to commit the bundle.js but it's OK for now.
(There is a Travis job, but it only handles build and test, not yet deployment.)

---

Oct 22: Wanted to update bip32 to latest (3.1.0) but there is a problem that will have to wait for now:

```
bundle.js:61757 Uncaught TypeError: (0 , fs_1.readFileSync) is not a function
at require.292../rand.cjs (bundle.js:54791:38)
at o (bundle.js:1:273)
at bundle.js:1:324
at require.tiny-secp256k1../validate.cjs (bundle.js:69054:26)
at o (bundle.js:1:273)
at bundle.js:1:324
at Object.<anonymous> (bundle.js:68611:13)
at Object.<anonymous> (bundle.js:68803:4)
at require.logic../xpubformats.js (bundle.js:68803:17)
at o (bundle.js:1:273)
```

It seems like one of the bip32 deps - secp256k1 - breaks when packaged by Browserify

## Markdown to Pdf generation

A few .md docs are being published on the site as pdf.  
For consistent appearance, use the following tools:

Sublime Text package _MarkdownPreview_ to .html, then print to pdf using Chrome.
Check that it looks ok and commit the pdf.

##### TODO: Incorporate this process (using other tools?) in the build.

## Updating raffle ticket cutouts

- Use [this Google Doc](https://docs.google.com/document/d/1jBkh3xVeG-o8J4etIf9kU8fSiq_tRBXPfKqZkEzb_cQ).
  (make a copy if you don't have edit rights)
- Download as pdf

## Environment

Tested and built on:

```
> npm -v; node -v
8.18.0
v16.17.0
```
