import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { Customer as MedusaCustomer } from "@medusajs/medusa"
import { Store } from "./store";

@Entity()
export class Customer extends MedusaCustomer {
    @Index("UserStoreId")
    @Column({ nullable: true })
    store_id?: string;

    @OneToOne(() => Store, (store) => store.members)
    @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
    store?: Store;
}
