import { Router, Request, Response } from "express";
import { Product } from "src/models/product";
import ProductService from "src/services/product";
import customRouteHandler from "../custom-route-handler";
import { CreateProductInput } from "@medusajs/medusa/dist/types/product"
import { wrapHandler } from "@medusajs/medusa";


const router = Router();

// functions for each route
async function createProduct(req: Request, res: Response): Promise<void> {
    const productService: ProductService = req.scope.resolve("productService")
    const { body } = req;
    const { product } = body;
    const createdProduct: Product = await productService.create(product as CreateProductInput);
    res.status(201).json({ product: createdProduct });
}

// attach functions to routes
router.post("/create", wrapHandler(createProduct));
router.get("/create", wrapHandler(customRouteHandler));

export default router;
