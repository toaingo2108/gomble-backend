const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

/**
 * Price Schema
 */
const PriceSchema = new mongoose.Schema({
  techpack_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  factory: {
    type: Number,
  },
  fee: {
    type: Number,
  },
  materials: {
    type: Number,
  },
  delivery: {
    type: Number,
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
PriceSchema.method({});

/**
 * Statics
 */
PriceSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError("No such user exists!", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

/**
 * @typedef Price
 */
module.exports = mongoose.model("Price", PriceSchema);
