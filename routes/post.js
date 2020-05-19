const router = require('express').Router();
const verify = require('./verifytoken');

router.get('/', verify, (req, res)=>{
    res.send('Welcome to protected route!!!');
});

module.exports = router;