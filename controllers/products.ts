import { Request, Response } from "express";
import Product from "../model/Product";
import { IGetAuthReqInfo } from "../utils/types";
import { tokenBearer } from "../middleware/auth";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const getProductsByCategory = async (
  req: IGetAuthReqInfo,
  res: Response
) => {
  const { category } = req.params;

  const lowerCategory = category.toLowerCase();

  try {
    const products = await Product.find({ category: lowerCategory });

    if (products.length === 0)
      return res.status(404).json({
        success: false,
        data: `Product with category ${category} not found`,
      });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const getProduct = async (req: IGetAuthReqInfo, res: Response) => {
  if (!req.query.slug)
    return res.status(400).json({ data: "Product slug is required" });

  const { slug } = req.query;

  try {
    const product = await Product.findOne({ slug });

    if (!product)
      return res
        .status(404)
        .json({ success: false, data: `Product with slug ${slug} not found` });

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const getIds = async (req: IGetAuthReqInfo, res: Response) => {
  try {
    const products = await Product.find({}, { _id: 1 });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const getCategoryIds = async (req: IGetAuthReqInfo, res: Response) => {
  const { category } = req.params;

  const lowerCategory = category.toLowerCase();

  try {
    const products = await Product.find(
      { category: lowerCategory },
      { _id: 1 }
    );

    if (products.length === 0)
      return res.status(404).json({
        success: false,
        data: `Product with category ${lowerCategory} not found`,
      });

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const getCategorySlugs = async (req: IGetAuthReqInfo, res: Response) => {
  const { category } = req.params;

  const lowerCategory = category.toLowerCase();

  try {
    const products = await Product.find(
      { category: lowerCategory },
      { slug: 1 }
    );
    const result = products.map((product: { slug: string }) => {
      return { slug: product.slug };
    });

    if (products.length === 0)
      return res.status(404).json({
        success: false,
        data: `Product with category ${lowerCategory} not found`,
      });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const getCategoriesProducts = async (
  req: IGetAuthReqInfo,
  res: Response
) => {
  try {
    const products = await Product.aggregate([
      { $group: { _id: "$category", first: { $first: "$$ROOT" } } },
      {
        $project: {
          _id: "$first._id",
          slug: "$first.slug",
          category: "$first.category",
          categoryImage: "$first.categoryImage",
        },
      },
    ]);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const createNewProduct = async (req: Request, res: Response) => {
  if (!req.body.name)
    return res.status(400).json({ data: "Product name is required" });

  try {
    req.body.owner = tokenBearer.id;
    const board = await Product.create(req.body);

    res.status(201).json({ success: true, data: board });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  if (!req.query._id)
    return res.status(400).json({ data: "Product id is required" });

  const id = req.query._id;

  const { name, phaseList, tasks } = req.body;

  try {
    const board = await Product.findByIdAndUpdate(
      id,
      { name, phaseList, tasks },
      { new: true }
    );

    if (!board)
      return res
        .status(404)
        .json({ success: false, data: `board with id ${id} not found` });

    return res.status(201).json({ success: true, board });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  if (!req.query.id)
    return res.status(400).json({ data: "Product id is required" });

  const id = req.query.id;
  try {
    const board = await Product?.findByIdAndDelete(id);

    if (!board)
      return res
        .status(400)
        .json({ success: false, data: `Product with ${id} not found` });

    return res.status(200).json({
      success: true,
      data: `Successfully deleted board: ${board?.name}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const createNewTask = async (req: Request, res: Response) => {
  if (!req.query.id)
    return res.status(400).json({ data: "Product id is required" });

  if (!req.body.title)
    return res.status(400).json({ data: "Task title is required" });

  const id = req.query.id;

  try {
    const newTask = req.body;

    const board = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          tasks: newTask,
        },
      },
      { new: true }
    );
    if (!board)
      return res.status(404).json({ data: `board with id ${id} not found` });

    res.status(201).json({ success: true, board });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const boardId = req.query.boardId;
  const taskId = req.query.taskId;
  if (!taskId || !boardId)
    return res.status(400).json({ data: "board and task id are required" });

  const { title, description, subtasks, status } = req.body;

  try {
    // const board = await User.updateOne(
    //   {
    //     email: tokenBearer.email,
    //     products: { $elemMatch: { _id: boardId, "tasks._id": taskId } },
    //   },
    //   {
    //     $set: {
    //       "products.$[board].tasks.$[task].title": title,
    //       "products.$[board].tasks.$[task].description": description,
    //       "products.$[board].tasks.$[task].subtasks": subtasks,
    //       "products.$[board].tasks.$[task].phase": phase,
    //     },
    //   },
    //   { arrayFilters: [{ "board._id": boardId }, { "task._id": taskId }] }
    // );

    const board = await Product.updateOne(
      { _id: boardId, "tasks._id": taskId },
      {
        $set: {
          "tasks.$.title": title,
          "tasks.$.description": description,
          "tasks.$.subtasks": subtasks,
          "tasks.$.status": status,
        },
      }
    );

    if (!board)
      return res.status(404).json({
        data: `board with id ${boardId} or task with id ${taskId} not found`,
      });
    return res.status(200).json({ data: "Task successfully updated" });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const boardId = req.query.boardId;
  const taskId = req.query.taskId;
  if (!taskId || !boardId)
    return res.status(400).json({ data: "board and task id are required" });

  try {
    const board = await Product.updateOne(
      { _id: boardId },
      {
        $pull: {
          tasks: { _id: taskId },
        },
      }
    );

    if (!board)
      return res.status(404).json({ data: `task with id ${taskId} not found` });
    return res
      .status(200)
      .json({ data: `Task ${taskId} successfully deleted` });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// const obj = [
//   { name: "Kenny", age: 20 },
//   { name: "Taiwo", age: 21 },
//   { name: "Tomisin", age: 23 },
//   { name: "Bolu", age: 21 },
//   { name: "Tolu", age: 20 },
//   { name: "Tolani", age: 23 },
// ];
// const anti = [
//   { name: "Kenny", age: 20 },
//   { name: "Taiwo", age: 21 },
//   { name: "Tolani", age: 23 },
// ];

// Product.aggregate(
//   [{ $group: { _id: "$category", first: { $first: "$$ROOT" } } }],
//   function (err: any, products: any) {
//     if (err) {
//       console.error("Error occurred:", err);
//       return;
//     }
//     console.log(products.map((entry: any) => entry.first));
//   }
// );
