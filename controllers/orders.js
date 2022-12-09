const Order = require('../models/order');
const { validationResult } = require('express-validator/check');
const getDb = require('../util/database').getDb;
const mongoose = require('mongoose');


exports.fetchOrders = (req, res, next) => {
  Order.fetchAll().then((orders) => {
    res.status(200).json({
      ...orders
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
};

//////////////////////update///////////////////////////////
exports.updateOrder = (req, res, next) => {
  const orderId = req.params.orderId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const refund = req.body.refund;


  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        console.log('No order')
        const error = new Error('Could not find order.');
        error.statusCode = 404;
        throw error;
      }


      const updatedOrder = new Order(null, null, null, null, refund, orderId);

      return updatedOrder.updateRefund();
    })
    .then((result) => {
      res.status(200).json({ message: 'Order updated!', order: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
///////////////////////////////////////////////////////

exports.postCreateOrder = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(401).json({
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const userData = req.body.userData;
  const newUserData = { ...userData, userId: req.userId };

  const orderData = req.body.orderData;
  const totalOrderedPrice = req.body.totalOrderedPrice;
  const totalOrderedQuantity = req.body.totalOrderedQuantity;
  const refund ='';

  const order = new Order(newUserData, orderData, totalOrderedPrice, totalOrderedQuantity, refund);

  order.save()
   return res
      .status(201)
      .json({
        message: 'Order created successfully!',
        post: {
          userData: newUserData,
          orderData: orderData,
          totalOrderedPrice,
          totalOrderedQuantity,
          refund: refund
        },
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });

};
