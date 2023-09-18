const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    avartar: {
      type: String,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.userId = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);
