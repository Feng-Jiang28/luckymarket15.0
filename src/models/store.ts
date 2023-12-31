import { Entity, OneToMany, OneToOne } from "typeorm"
import { Store as MedusaStore} from "@medusajs/medusa"
import {Customer} from "./customer"
import { Product } from "./product";

@Entity()
export class Store extends MedusaStore {
    // TODO add relations
    @OneToOne(() => Customer, (customer) => customer?.store)
    owner?: Customer;

    @OneToMany(() => Product, (product) => product?.store)
    products?: Product[];
}
