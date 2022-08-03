import { STICKERS_EMOJIS, STICKERS_FALLBACK_EMOJI } from '../constants';

export function getStickerEmojis(stickerId: number): string {
    return String(STICKERS_EMOJIS.get(stickerId)) || STICKERS_FALLBACK_EMOJI;
}
