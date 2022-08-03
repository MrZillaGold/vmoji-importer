import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { Stage, Layer, Rect, Text, Image as ImageShape } from 'fcanvas';
import { ScreenSpinner } from '@vkontakte/vkui';
import VKBridge from '@vkontakte/vk-bridge';

import { arrayRandomItem } from '../utils';
import { constructorParamsState, popoutState } from '../store';

export function useShare() {
    const [constructorInitParams] = useRecoilState(constructorParamsState);
    const [, setPopout] = useRecoilState(popoutState);

    const [retries, setRetries] = useState(0);

    const loadImage = (src: string) => (
        new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();

            image.crossOrigin = 'anonymous';

            image.onload = () => {
                resolve(image);
            };

            image.onerror = (error) => {
                reject(error);
            };

            image.src = src;
        })
    );

    const generateTitle = () => {
        const scale = 4;
        const horizontalPadding = 16 * scale;
        const verticalPadding = 10 * scale;
        const title = new Text({
            x: horizontalPadding,
            y: verticalPadding,
            fontSize: 28 * scale,
            lineHeight: 0.29 * scale,
            text: 'Мой персонаж vmoji',
            fill: 'black',
            fontFamily: 'VK Sans Display'
        });

        const { width, height } = title['size']();

        const stageSize = {
            width: width + (horizontalPadding * 2),
            height: height + (verticalPadding * 2)
        };

        const stage = new Stage({
            container: 'story',
            ...stageSize
        });
        const titleLayer = new Layer(stageSize);

        stage.add(titleLayer);

        const background = new Rect({
            fill: 'white',
            cornerRadius: 12 * scale,
            x: 0,
            y: 0,
            ...stageSize
        });

        titleLayer.add(background);
        titleLayer.add(title);

        titleLayer.batchDraw();

        return titleLayer.toDataURL();
    };

    const generateBackground = async (stickerSrc: string) => {
        const stageSize = {
            width: 1080,
            height: 1920
        };
        const { width } = stageSize;

        const stage = new Stage({
            container: 'story',
            ...stageSize
        });
        const backgroundLayer = new Layer(stageSize);

        stage.add(backgroundLayer);

        if (!constructorInitParams) {
            return;
        }

        const { story_backgrounds } = constructorInitParams;

        const background = new ImageShape({
            x: 0,
            y: 0,
            image: await loadImage(arrayRandomItem(story_backgrounds)),
            ...stageSize
        });

        backgroundLayer.add(background);

        const stickerSize = 921;
        const sticker = new ImageShape({
            x: (width - stickerSize) / 2,
            y: 1283 - stickerSize,
            width: stickerSize,
            height: stickerSize,
            image: await loadImage(stickerSrc)
        });

        backgroundLayer.add(sticker);

        return backgroundLayer.toDataURL();
    };

    const retryOpen = () => {
        if (retries >= 3) {
            return;
        }

        setRetries(retries + 1);

        openStoryEditor();
    };

    const openStoryEditor = async () => {
        const { stickers } = getPreview();
        const sticker = getSticker(
            arrayRandomItem(stickers)
        );

        if (!sticker) {
            return retryOpen();
        }

        const stickerImage = getStickerImage(sticker, true);

        if (!stickerImage) {
            return retryOpen();
        }

        setPopout(
            <ScreenSpinner/>
        );

        const background = await generateBackground(stickerImage)
            .catch(() => null);

        setPopout();

        if (!background) {
            return retryOpen();
        }

        await VKBridge.send('VKWebAppShowStoryBox', {
            background_type: 'image',
            blob: background,
            stickers: [
                {
                    sticker_type: 'renderable',
                    sticker: {
                        content_type: 'image',
                        blob: generateTitle(),
                        transform: {
                            relation_width: 0.85,
                            translation_y: 0.15
                        },
                        clickable_zones: [{
                            action_type: 'link',
                            action: {
                                link: vmojiUrl,
                                tooltip_text_key: 'tooltip_open_default'
                            }
                        }]
                    }
                }
            ],
            attachment: {
                text: 'open',
                type: 'url',
                url: vmojiUrl
            },
            locked: true
        });
    };

    const sendMessage = () => {
        VKBridge.send('VKWebAppShare', {
            link: vmojiUrl
        });
    };

    const wallPost = () => {
        VKBridge.send('VKWebAppShowWallPostBox', {
            message: vmojiUrl
        });
    };

    return {
        wallPost,
        sendMessage,
        openStoryEditor
    };
}
