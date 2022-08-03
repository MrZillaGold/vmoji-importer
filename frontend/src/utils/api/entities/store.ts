import { Image } from './image';
import { Sticker } from './sticker';

export interface StoreProductPreview {
    /**
     * Product id
     */
    id: number;
    /**
     * Product type
     */
    type: StoreProductType;
    /**
     * Title of the product
     */
    title: string;
    /**
     * Description of the product
     */
    description: string;
    /**
     * Author of the product
     */
    author: string;
    /**
     * Product icon
     */
    icon: Image;
    /**
     * Information whether the product is purchased
     */
    is_purchased: boolean;
    /**
     * Information whether the product is active
     */
    is_active: boolean;
    /**
     * For sticker packs: full or partial list of stickers
     */
    stickers: Sticker[];
    /**
     * For sticker packs: information whether the pack contains animated stickers
     */
    is_animated: boolean;
}

export enum StoreProductType {
    STICKERS = 'stickers'
}

export enum StoreProductFilter {
    PURCHASED = 'purchased',
    ACTIVE = 'active',
    PROMOTED = 'promoted'
}
