const express = require('express');
const router = express.Router();
const db = require('../models');
const { Item } = db;

//    GET    /items
//    POST   /items
//    GET    /items/:id
//    PUT    /items/:id
//    DELETE /items/:id

router.get('/', (req, res) => {
  Item.findAll({}).then((items) => res.json(items));
});

router.post('/', (req, res) => {
  let { name, price, description, userId } = req.body;

  Item.create({ name, price, description, userId })
    .then((item) => {
      res.status(201).json(item);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Item.findByPk(id).then((item) => {
    if (!item) {
      return res.sendStatus(404);
    }
    res.json(item);
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  let { name, price, description, userId } = req.body;

  Item.findByPk(id).then((item) => {
    if (!item) {
      Item.create({ name, price, description, userId })
        .then((item) => {
          res.status(201).json(item);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      item.name = name;
      item.price = price;
      item.description = description;
      item.userId = userId;
      item
        .save()
        .then((item) => {
          res.json(item);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Item.findByPk(id).then((item) => {
    if (!item) {
      return res.sendStatus(404);
    }

    item.destroy();
    res.sendStatus(204);
  });
});

module.exports = router;
