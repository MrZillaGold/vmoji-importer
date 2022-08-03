import { AppearanceType } from '@vkontakte/vk-bridge';

export interface Image {
    /**
     * Image id
     */
    id: string;
    /**
     * Image url
     */
    url: string;
    /**
     * Image width
     */
    width: number;
    /**
     * Image height
     */
    height: number;
    /**
     * Appearance type
     */
    theme: AppearanceType;
}
