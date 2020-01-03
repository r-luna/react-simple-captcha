# react-simple-captcha

A two-part React Captcha consisting of (1) a back-end service written in Express for generating an SVG captcha and (2) a React component which displays and handles user interaction. Uses Bootstrap.

NOTE: The Captcha font being used creates lower-case "L" and upper case "I" that both look the same - essentialy a character that looks like a pipe in either case. Its easy to mistake the rendering for either one of these letters. This sample repo relies on the `svg-captcha` package - visit its documentation to learn how to select a different font and how to set additional options.

As well, a Captcha of any length can be generated. I've chosen 4 characters and provided no prop to customize it. Anyway, you would need to let the backing service know you want more than 4 characters, and update the component's input field to allow the desired number of chars.

In any event, this is a working example and everything can be evolved from here.

# Running the example

Install dependencies

> $ npm install

Build react app... the compiled app will be dropped into the public folder.

> $ npm run build

Start Express

> $ npm run start

Visit http://localhost:3000

# Moving parts

## React Component

Takes a single `onValid` prop which accepts your custom function to be fired when the captcha has been successfully validated.

## Services

> GET localhost:3000/captcha

Returns an SVG captcha image with the captcha solution sent via a "captcha" header (Access-Control-Expose-Headers). The solution is grabbed from the header and kept in state. User input is then compared against the solution when the "verify" button is clicked.
