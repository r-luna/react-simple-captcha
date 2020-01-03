var express = require('express');
var router = express.Router();

const svgCaptcha = require('svg-captcha');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* CAPTCHA generator service */
router.get('/captcha/:size/:width/:height/:fontSize/:ignoreChars/:noise/:color/:bg', async (req, res, next) => {
  try {
    const { size, width, height, fontSize, ignoreChars, noise, color, bg } = req.params;
    const options = {
      size, width, height, fontSize, noise,
    };
    if (ignoreChars !== 'false') {
      options.ignoreChars = ignoreChars;
    }
    if (color === 'true') { // presence of this prop turns on color
      options.color = color;
    }
    if (bg !== 'false') { // presence of this prop turns on color
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
