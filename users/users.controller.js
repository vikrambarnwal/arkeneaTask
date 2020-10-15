const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const path = require('path');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// routes
router.post('/add', upload.single('profilePic'), async function (req, res, next) {
    let userData = {
        profilePic: req.file.path,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile
    };
    console.log('Data is ', userData);
    userService.create(userData)
        .then(() => res.json({}))
        .catch(err => next(err));
})

router.get('/', async function (req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
});

router.get('/:id', async function (req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
});

router.put('/:id', upload.single('profilePic'), async function (req, res, next) {
    req.body.profilePic= req.file.path;
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
});

router.delete('/:id', async function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
});

module.exports = router;