const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');


class Order {
  constructor(userData, orderData, totalOrderedPrice, totalOrderedQuantity,refund, orderId) {
    this.userData = userData;
    this.orderData = orderData;
    this.totalOrderedPrice = totalOrderedPrice;
    this.totalOrderedQuantity = totalOrderedQuantity;
    this.refund = refund ? refund : null;
    this._id = orderId ? new mongodb.ObjectId(orderId) : null;
  }

  save() {
    let dbOp;
    const db = getDb();
    if (this._id) {
      // update the meal
      // $set is for update selected Meal
      dbOp = db
      .collection('orders')
      .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('orders').insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  updateRefund() {
    let dbOp;
    const db = getDb();
    if (this._id) {
      // update the meal
      // $set is for update selected Meal
      dbOp = db
      .collection('orders')
      .updateOne({ _id: this._id}, { $set: {refund: this.refund }});
    } else {
      dbOp = db.collection('orders').insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log('update order result', result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('orders')
      .find()
      .toArray()
      .then((orders) => {
        console.log(orders);
        return orders;
      })
      .catch((err) => console.log(err));
  }

  static findById(orderId) {
    const db = getDb();
    return db
      .collection('orders')
      .find({ _id: new mongodb.ObjectId(orderId) })
      .next()
      .then((order) => {
        return order;
      })
      .catch((err) => console.log(err));
  }

}

module.exports = Order;
