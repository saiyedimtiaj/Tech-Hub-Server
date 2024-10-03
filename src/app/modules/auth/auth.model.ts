import { model, Schema } from "mongoose";
import { IUser } from "./auth.interface";
import bcrypt from "bcrypt";

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    role: {
      type: String,
      default: "user",
    },
    bio: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "active",
    },
    followers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    following: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    membership: {
      type: Boolean,
      default: false,
    },
    membershipEnd: {
      type: Date,
      required: function () {
        return this.membership;
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.path("followers").default([]);
userSchema.path("following").default([]);

userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Remove password from response objects
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Create and export the User model
const User = model<IUser>("User", userSchema);

export default User;
