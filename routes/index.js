var express = require('express');
var router = express.Router();

const svgCaptcha = require('svg-captcha');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* CAPTCHA generator service */
router.post('/captcha', async (req, res, next) => {
  try {
    const {
      size = 4,
      width = 150,
      height = 50,
      fontSize = 70,
      ignoreChars,
      noise = 1,
      color,
      bg,
    } = req.body;
    const options = {
      size, width, height, fontSize, noise,
    };
    if (ignoreChars) {
      options.ignoreChars = ignoreChars;
    }
    if (color) {
      options.color = color;
    }
    if (bg) { // presence of this prop turns on color
      options.background = `#${bg}`;
    }
    console.log(options);
    const captcha = await svgCaptcha.create(options);
    res.append('captcha', captcha.text);
    res.append('Access-Control-Expose-Headers','captcha');
    res.type('svg');
    res.status(200).send(captcha.data);
  } catch (err) {
    res.status(500).json({ msg: 'unable to create captcha' });
  }
});

module.exports = router;
