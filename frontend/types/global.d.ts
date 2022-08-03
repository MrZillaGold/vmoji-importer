declare module '*.svg' {
    import { FunctionComponent, SVGProps } from 'react';

    export const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement> & {
        title?: string
    }>;
    const src: string;
    export default src;
}

declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '@vkontakte/mvk-mini-apps-scroll-helper' {
    function mvkScrollHelper(element: HTMLElement | null): void;

    export default mvkScrollHelper;
}

declare type Union<E> = (typeof E)[keyof typeof E];

declare interface Window {
    iNoBounce?: INoBounce;
    VKLang: VKLang;
}

declare module 'inobounce/inobounce' {
    interface INoBounce  {
        enable(): void;
        disable(): void;
    }

    const iNoBounce: INoBounce;

    export default iNoBounce;
}
