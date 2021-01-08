## Building

`./build.sh`

The build results in a bundle.js in `/calculator`.
Commit that file manually and Github pages will take care of the deployment.

##### TODO

Would be nice to not having to commit the bundle.js but it's OK for now.
(There is a Travis job, but it only handles build and test, not yet deployment.)

## Markdown to Pdf generation

A few .md docs are being published on the site as pdf.  
For consistent appearance, use the following tools:

Sublime Text package _MarkdownPreview_ to .html, then print to pdf using Chrome.
Check that it looks ok and commit the pdf.

##### TODO: Incorporate this process (using other tools?) in the build.

## Updating raffle ticket cutouts

- Use [this Google Doc](https://docs.google.com/document/d/1jBkh3xVeG-o8J4etIf9kU8fSiq_tRBXPfKqZkEzb_cQ). (make a copy if you don't have edit right)
- Downlad as pdf

## Environment

Tested and built on:

```
> npm -v; node -v
7.0.8
v15.1.0
```
