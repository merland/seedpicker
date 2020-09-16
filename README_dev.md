## Building

`./build.sh`

The build results in a bundle.js in `/calculator`.
Commit that file manually and Github pages will take care of the deployment.

##### TODO

Would be nice to not having to commit the bundle.js but it's OK for now.
(There is Travis job, but it only handles build and test, not yet deployment.)

## Markdown to Pdf generation

A few .md docs are being published on the site as pdf.  
For consistent appearance, use the following tools:

Sublime Text package _MarkdownPreview_ to .html, then print to pdf using Chrome.
Check that it looks ok and commit the pdf.

##### TODO: Incorporate this process (using other tools?) in the build.
