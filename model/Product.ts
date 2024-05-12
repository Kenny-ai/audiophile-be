import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface Image {
  mobile: string;
  tablet: string;
  desktop: string;
}
interface IProduct {
  slug: string;
  name: string;
  image: Image;
  category: string;
  categoryImage: Image;
  isNew: boolean;
  price: number;
  description: string;
  features: string;
  includes: { quantity: number; item: string }[];
  gallery: Image[];
  others: { slug: string; name: string; image: Image }[];
}

const imageType = {
  mobile: { type: String, trim: true },
  tablet: { type: String, trim: true },
  desktop: { type: String, trim: true },
};

const productSchema = new Schema<IProduct>(
  {
    slug: { type: String, trim: true },
    name: { type: String, trim: true, required: true },
    image: imageType,
    category: { type: String, trim: true, required: true },
    categoryImage: imageType,
    isNew: { type: Boolean },
    price: { type: Number, required: true },
    description: { type: String, trim: true },
    features: { type: String, trim: true },

    includes: [
      {
        quantity: { type: Number, trim: true },
        item: { type: String, trim: true },
      },
    ],

    gallery: [imageType],

    others: [
      {
        slug: { type: String, trim: true },
        name: { type: String, trim: true },
        image: imageType,
      },
    ],

    // owner: { type: Schema.Types.ObjectId, ref: "User" },
  }
  // { timestamps: true }
);

export default mongoose.model("Product", productSchema);
