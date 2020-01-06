# react-simple-captcha

A two-part React Captcha consisting of (1) a back-end service written in Express for generating an SVG captcha and (2) a React component which displays and handles user interaction. Uses Bootstrap.

NOTE: The Captcha font being used creates lower-case "L" and upper case "I" that both look the same - essentialy a character that looks like a pipe. Its easy to mistake the rendering for either one of these letters. This sample repo relies on the `svg-captcha` package - visit its documentation to learn how to select a different font.

That aside, many of `svg-captcha`'s options are implimented via the React component.

When the SVG is generated the solution is sent back along with it via an exposed access control header. Not that you have to impliment anything as its all been done for you, but thats how everything works.

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

### Props

The Props largely mirror the JSON payload detailed further below with the exception of this brief list:

| Prop       | Type   | Default          | Description |
| ----------- | ------ | ---------------- | ----------- |
| preamble    | string | (empty string)   | Text to appear before the solution input box |
| postamble   | string | (empty string)   | Text to appear should the captcha be solved, replacing the "verifY' button |
| onValid     | func   | null             | The callback to be called upon succesfully solving the captcha |

Otherwise look to the JSON prop table for additional props.

Here's a complete component example:

```javascript
<Captcha
  preamble="Prove you're not a robot:"
  postamble="You're human!"
  onValid={this.yourCustomFunctionHere}
  size={9}
  ignoreChars="abcdefghijklmnopqrstuvwxyz"
  noise={5}
  color="false"
  bg="cc9966"
  width={300}
  height={90}
  fontSize={60}
/>
```

The above example shows, via `ignoreChars`, that all letters will be upper-case since lower-case letters are dissallowed (ignored).

## Service

> POST localhost:3000/captcha/

Upon recieving a JSON payload returns an SVG captcha image with the captcha solution sent via a "captcha" header (Access-Control-Expose-Headers).

Defaults are imposed by the service.

### Props

| Param       | Type   | Default          | Description |
| ----------- | ------ | ---------------- | ----------- |
| size        | number | 4                | The number of captcha characters |
| width       | number | 150              | Width of captcha in pixels |
| height      | number | 50               | Height of the captcha in pixels |
| fontSize    | number | 70               | Font size |
| ignoreChars | string | (empty string)   | Specifies characters to not be included in the captcha string generation. For example, if you wanted a captcha comprised of only letters you would provide `0123456789` here. Case matters here, so to omit lower-case `abc` simply supply those lower-case letters and only the upper-case versions of `abc` would be capable of appearing. |
| noise       | number | 1                | Number of lines to be drawn horizontaly through the captcha image |
| color       | string | 'false'          | The string `true` or `false` to indicate if the captcha characters should use random colors. |
| bg          | string | 'ffffff'         | Hexadecimal background color, preceeding hash (#) omitted. If this is set `color` is turned on, regardless of the `color` value or presence therof. |

### Sample Payload

```javascript
{
  "size": 5,
  "noise": 2,
  "color": "true"
}
```
