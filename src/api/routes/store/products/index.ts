import { Router, Request, Response } from "express";
import { Product } from "src/models/product";
import ProductService from "src/services/product";
import customRouteHandler from "../custom-route-handler";
import { CreateProductInput } from "@medusajs/medusa/dist/types/product";
import { defaultStoreCategoryScope } from "@medusajs/medusa/dist/api/routes/store/product-categories";
import { StoreGetProductsParams, wrapHandler } from "@medusajs/medusa";
import { CartService } from "@medusajs/medusa/dist/services";


const router = Router();

// functions for each route
// create a product
async function createProduct(req: Request, res: Response): Promise<void> {
    const productService: ProductService = req.scope.resolve("productService")
    const { body } = req;
    const { product } = body;
    const createdProduct: Product = await productService.create(product as CreateProductInput);
    res.status(201).json({ product: createdProduct });
}

// list products in a customer's store
// https://github.com/medusajs/medusa/blob/develop/packages/medusa/src/api/routes/store/products/list-products.ts
async function listProductsByCustomer(req: Request, res: Response): Promise<void> {
    const productService: ProductService = req.scope.resolve("productService")

    const validated = req.validatedQuery as StoreGetProductsParams

    const listConfig = req.listConfig

    const [rawProducts, count] = await productService.listAndCountByStore({}, listConfig)

    res.json({
        products: rawProducts,
        count,
        offset: validated.offset,
        limit: validated.limit,
    })
}

// attach functions to routes
// create a product
router.post("/create", wrapHandler(createProduct));
// list products in a customer's store
router.get("/by-customer", wrapHandler(listProductsByCustomer));
// for testing
router.get("/create", wrapHandler(customRouteHandler));

export default router;
