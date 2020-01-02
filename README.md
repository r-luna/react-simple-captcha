# react-simple-captcha

A two-part React Captcha consisting of (1) a back-end service written in Express for generating an SVG captcha and (2) a React component which displays and handles user interaction. Uses Bootstrap.

NOTE: The font used creates lower-case "L" and upper case "I" that both look the same - essentialy a character that looks like a pipe in both cases. Its easy to mistake the rendering for eith one of these letters. This example repo relies on the `svg-captcha` package - visit its documentation to learn how to select a different font and additional options.

As well, a Captcha of any length can be generated. I've chosen 4 characters and provided no prop to customnize it. Anyway, you would need to let the backing service know you want more than 4 characters, and update the component's input filed to allow the desired number of chars.

In any event, this is a working example and can be evolved from here.

# Running the example

Install dependencies

> $ npm install

Build react app... the compiled app will be dropped into the public folder.

> $ npm run build

Start Express

> $ npm run start

Visit http://localhost:3000

# React Component

# Services

> GET localhost:3000/captcha

Returns an SVG captcha image with the captcha solution sent via a "captcha" header (Access-Control-Expose-Headers). Simply grab the header and keep in state. Compare any user input against the solution when the "verify" button is clicked.
