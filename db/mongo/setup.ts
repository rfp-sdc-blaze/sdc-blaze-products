import { Schema, model, connect } from "mongoose";
import { Url } from "url";

// 1. Create an interface representing a document in MongoDB.
interface IProduct {
  id: number;
  name: string;
  slogan: string;
  description: string;
  category: string;
  default_price: string;
}

interface IFeature {
  id: number;
  product_id: number;
  feature: string;
  value: string;
}

interface IRelated {
  id: number;
  current_product_id: number;
  related_product_id: number;
}

interface IStyles {
  id: number;
  productId: number;
  name: string;
  sale_price: string;
  original_price: string;
  default_style: boolean;
}

interface ISkus {
  id: number;
  styleId: number;
  size: string;
  quantity: number;
}

interface IPhotos {
  id: number;
  style_id: number;
  url: string;
  thumbnail_url: string;
}

// 2. Create a Schema corresponding to the document interface.
const productSchema = new Schema<IProduct>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  slogan: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  default_price: { type: String, required: true },
});

const featureSchema = new Schema<IFeature>({
  id: { type: Number, required: true },
  product_id: { type: Number, required: true },
  feature: { type: String, required: true },
  value: { type: String, required: true },
});

const relatedSchema = new Schema<IRelated>({
  id: { type: Number, required: true },
  current_product_id: { type: Number, required: true },
  related_product_id: { type: Number, required: true },
});

const stylesSchema = new Schema<IStyles>({
  id: { type: Number, required: true },
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  sale_price: { type: String, required: true },
  original_price: { type: String, required: true },
  default_style: { type: Boolean, required: true },
});

const photosSchema = new Schema<IPhotos>({
  id: { type: Number, required: true },
  style_id: { type: Number, required: true },
  url: { type: String, required: true },
  thumbnail_url: { type: String, required: true },
});

const skusSchema = new Schema<ISkus>({
  id: { type: Number, required: true },
  styleId: { type: Number, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
});

// 3. Create a Model.
const Product = model<IProduct>("Product", productSchema);
const Feature = model<IFeature>("Feature", featureSchema);
const Related = model<IRelated>("Related", relatedSchema);
const Styles = model<IStyles>("Product", stylesSchema);
const Photos = model<IPhotos>("Product", photosSchema);
const Skus = model<ISkus>("Product", skusSchema);

run().catch((err) => console.log(err));

async function run() {
  // 4. Connect to MongoDB
  await connect("mongodb://localhost:27017/test");

  const prod = new Product({
    id: 1,
    name: "This is a name",
    slogan: "This is a slogan",
    description: "This is a description",
    category: "This is a category",
    default_price: "This is a default price",
  });
  await prod.save();

  console.log(prod.category); // 'This is a category'
}
