var express = require('express');
var router = express.Router();

const svgCaptcha = require('svg-captcha');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* CAPTCHA generator service */
router.get('/captcha', async (req, res, next) => {
  try {
    const captcha = await svgCaptcha.create();
    res.append('captcha', captcha.text);
    res.append('Access-Control-Expose-Headers','captcha');
    res.type('svg');
    res.status(200).send(captcha.data);
  } catch (err) {
    res.status(500).json('unable to create captcha');
  }
});

module.exports = router;
