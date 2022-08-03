import { Image } from './image';
import { VmojiAvatar } from './vmoji';

export interface Sticker {
    /**
     * Sticker ID
     */
    sticker_id: number;
    /**
     * Pack ID
     */
    product_id: number;
    /**
     * Stickers images
     */
    images: Image[];
    /**
     * Stickers images with background
     */
    images_with_background: Image[];
    /**
     * URL of sticker animation script
     */
    animation_url: string;
    /**
     * Array of sticker animation script objects
     */
    animations: [];
    /**
     * Vmoji avatar
     */
    vmoji: VmojiAvatar;
    /**
     * Information whether the sticker is allowed
     */
    is_allowed: boolean;
}

export interface IStickerAnimation {
    /**
     * Type of animation script
     */
    type: StickerAnimationType;
    /**
     * URL of animation script
     */
    url: string;
}

export enum StickerAnimationType {
    LIGHT = 'light',
    DARK = 'dark'
}
