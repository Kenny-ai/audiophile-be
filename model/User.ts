import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;

interface IUser {
  name: string;
  email: string;
  password: string;
  getSignedAccessToken: () => string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Add a password!"],
    },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(8);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Sign JWT and return
userSchema.methods.getSignedAccessToken = function () {
  return jwt.sign({ id: this._id }, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}`,
  });
};

// userSchema.methods.getSignedRefreshToken = function () {
//   return jwt.sign({ id: this._id }, `${process.env.REFRESH_TOKEN_SECRET}`, {
//     expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE}`,
//   });
// };

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
