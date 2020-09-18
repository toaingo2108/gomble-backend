const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

/**
 * Techpack Schema
 */
const TechpackSchema = new mongoose.Schema({
  folder_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  generalinfo: {
    type: mongoose.Schema.ObjectId,
  },
  sketches: {
    type: Array,
    default: [],
  },
  materials: {
    type: Array,
    default: [],
  },
  measurements: {
    type: Array,
    default: [],
  },
  measurement_unit: {
    type: String,
    defaults: "inch",
  },
  measurement_size_range: {
    type: Array,
    default: [],
  },
  patterns: {
    type: Array,
    default: [],
  },
  readytowear: {
    type: Array,
    default: [],
  },
  stage: {
    type: mongoose.Schema.ObjectId,
  },
  is_draft: {
    type: Boolean,
    default: true,
  },
  price: {
    type: mongoose.Schema.ObjectId,
  },
  factory: {
    type: mongoose.Schema.ObjectId,
  },
  designer: {
    type: mongoose.Schema.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
TechpackSchema.method({});

/**
 * Statics
 */
TechpackSchema.statics = {
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
 * @typedef Techpack
 */
module.exports = mongoose.model("Techpack", TechpackSchema);
