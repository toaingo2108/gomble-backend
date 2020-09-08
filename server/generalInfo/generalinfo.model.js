const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

/**
 * GeneralInfo Schema
 */
const GeneralInfoSchema = new mongoose.Schema({
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
GeneralInfoSchema.method({});

/**
 * Statics
 */
GeneralInfoSchema.statics = {
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
 * @typedef GeneralInfo
 */
module.exports = mongoose.model("GeneralInfo", GeneralInfoSchema);
