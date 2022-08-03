import { ReactNode } from 'react';
import { atom } from 'recoil';

export const popoutState = atom<ReactNode | void>({
    key: 'popout',
    default: undefined
});
