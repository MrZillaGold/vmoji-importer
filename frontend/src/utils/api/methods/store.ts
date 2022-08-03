import { Collection, StoreProductFilter, StoreProductPreview, StoreProductType } from '../entities';

export interface StoreMethods {
    getProducts(params: {
        type: StoreProductType;
        filters?: StoreProductFilter[];
        extended?: boolean;
        product_ids?: string | number | (string | number)[]
    }): Promise<Collection<StoreProductPreview>>;
}
