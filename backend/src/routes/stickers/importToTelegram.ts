import { API } from 'vk-io';
import { Static } from '@sinclair/typebox';
import { MediaSourceType } from 'puregram';
import { FastifyPluginCallback } from 'fastify';
import { StoreProduct } from 'vk-io/lib/api/schemas/objects';

import { APIError } from '../../error';
import { StickersErrorCode } from './_error';

import { puregram } from '../../puregram';
import { stickersImportToTelegramSchema } from '../../schemas';
import { Image, getStickerEmojis, popHighQualityImage } from '../../utils';
import { VMOJI_PACK_IDS, TELEGRAM_BOT_USERNAME, TELEGRAM_STICKERS_OWNER } from '../../constants';

export const importToTelegram: FastifyPluginCallback = (fastify, options, done) => {
    fastify.post<{
        Body: Static<typeof stickersImportToTelegramSchema>
    }>('/stickers.importToTelegram', {
        schema: {
            body: stickersImportToTelegramSchema
        }
    }, async (request) => {
        const { body: { access_token } } = request;

        const vkAPI = new API({
            token: access_token
        });

        const product = await vkAPI.store.getProducts({
            type: 'stickers',
            product_ids: VMOJI_PACK_IDS,
            extended: true
        })
            // @ts-ignore invalid lib type
            .then(({ items }) => {
                if (!items.length) {
                    return;
                }

                const [vmojiBaseProduct, ...vmojiProducts] = items;

                // @ts-ignore invalid lib type
                vmojiBaseProduct.stickers = vmojiProducts.reduce<StoreProduct['previews'][]>((vmojiStickers, { stickers }) => {
                    vmojiStickers = vmojiStickers.concat(stickers);

                    return vmojiStickers;
                }, vmojiBaseProduct.stickers!);

                return vmojiBaseProduct;
            });

        if (!product) {
            throw new APIError(StickersErrorCode.VMOJI_NOT_CREATED);
        }

        const { title } = product;

        const characterId = product.stickers[0]?.vmoji?.character_id;

        if (!characterId) {
            throw new APIError(StickersErrorCode.VMOJI_NOT_CREATED);
        }

        // @ts-ignore invalid lib types
        const stickers: [string, Image][] = product.stickers.map(({ sticker_id, images_with_background }) => (
            [getStickerEmojis(sticker_id), popHighQualityImage(images_with_background)]
        ));
        const [[iconStickerEmojis, { url: icon }]] = stickers.splice(0, 1);

        const stickersSetName = `vmoji_${characterId}_by_${TELEGRAM_BOT_USERNAME}`;

        const stickersOfSet = await puregram.api.getStickerSet({
            name: stickersSetName
        })
            .then(({ stickers }) => stickers)
            .catch(() => []);

        await Promise.allSettled(
            stickersOfSet.map(({ file_id }) => (
                puregram.api.deleteStickerFromSet({
                    sticker: file_id
                })
            ))
        );

        await puregram.api.createNewStickerSet({
            title: `${title} @vmoji_bot`,
            user_id: TELEGRAM_STICKERS_OWNER,
            name: stickersSetName,
            png_sticker: {
                type: MediaSourceType.Url,
                value: icon
            },
            emojis: iconStickerEmojis
        })
            .then(() => false)
            .catch((error) => {
                if (error.toString().includes('occupied')) {
                    return true;
                }

                throw error;
            });

        await Promise.all(
            stickers.map(([emojis, { url }]) => (
                puregram.api.addStickerToSet({
                    user_id: TELEGRAM_STICKERS_OWNER,
                    name: stickersSetName,
                    png_sticker: {
                        type: MediaSourceType.Url,
                        value: url
                    },
                    emojis
                })
                    .catch(console.log)
            ))
        );

        return {
            link: `https://t.me/addstickers/${stickersSetName}`
        };
    });

    done();
};
