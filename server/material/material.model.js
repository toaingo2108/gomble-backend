const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

/**
 * Material Schema
 */
const MaterialSchema = new mongoose.Schema({
  techpack_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  image: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  tags: {
    type: Array,
    default: [],
  },
  colors: {
    type: Array,
    default: [],
  },
  quantity: {
    type: Number,
  },
  price_per_item: {
    type: Number,
  },
  price_total: {
    type: Number,
  },
  factory_name: {
    type: Number,
  },
  factory_email: {
    type: Number,
  },
  factory_phone: {
    type: Number,
  },
  factory_information: {
    type: Number,
  },
  is_draft: {
    type: Boolean,
    default: true,
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
MaterialSchema.method({});

/**
 * Statics
 */
MaterialSchema.statics = {
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
 * @typedef Material
 */
module.exports = mongoose.model("Material", MaterialSchema);
