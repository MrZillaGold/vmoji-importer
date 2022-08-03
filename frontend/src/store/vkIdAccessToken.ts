import { atom } from 'recoil';

export const vkIdAccessTokenState = atom<string>({
    key: 'vkIdAccessToken',
    default: ''
});
