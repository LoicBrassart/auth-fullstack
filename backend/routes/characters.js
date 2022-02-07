const express = require('express');
const passport = require('passport');
const router = express.Router();
const { db } = require('../conf');

router.get('/', async (req, res) => {
  try {
    const [characters] = await db.query(`SELECT * FROM characters`);
    res.status(200).json(characters);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [[character]] = await db.query(
      `SELECT * FROM characters WHERE id=?`,
      [id]
    );
    res.status(200).json(character);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.use('/', passport.authenticate('jwt'), (req, res, next) => {
  next();
});

router.post('/', async (req, res) => {
  try {
    const id_owner = req.user.id;
    const { name } = req.body;

    const [resSql] = await db.query(
      `INSERT INTO characters (name,id_owner) VALUES(?,?)`,
      [name, id_owner]
    );
    res.status(200).json(resSql);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
