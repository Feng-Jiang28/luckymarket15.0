import { Lifetime } from "awilix"
import {
    FindConfig,
    StoreService as MedusaStoreService, Store, Customer,
} from "@medusajs/medusa"

class StoreService extends MedusaStoreService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly loggedInCustomer_: Customer | null

    constructor(container, options) {
        // @ts-expect-error prefer-rest-params
        super(...arguments)

        try {
            this.loggedInCustomer_ = container.loggedInCustomer
        } catch (e) {
            // avoid errors when backend first runs
        }
    }

    async retrieve(config?: FindConfig<Store>): Promise<Store> {
        if (!this.loggedInCustomer_) {
            return super.retrieve(config);
        }

        return this.retrieveForLoggedInCustomer(config);
    }

    async retrieveForLoggedInCustomer (config?: FindConfig<Store>) {
        const storeRepo = this.manager_.withRepository(this.storeRepository_);
        const store = await storeRepo.findOne({
            ...config,
            relations: [
                ...config.relations,
                'members'
            ],
            where: {
                id: this.loggedInCustomer_.store_id
            },
        });

        if (!store) {
            throw new Error('Unable to find the user store');
        }

        return store
    }
}

export default StoreService
