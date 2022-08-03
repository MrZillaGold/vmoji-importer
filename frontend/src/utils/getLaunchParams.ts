export interface LaunchParams {
    user_id: number;
    app_id: number;
    is_app_user: boolean;
    are_notifications_enabled: boolean;
    language: string;
    ref: string;
    access_token_settings: Scope[];
    group_id: number;
    viewer_group_role: ViewerGroupRole;
    platform: Platform;
    is_favorite: boolean;
    ts: number;
    sign: string;
}

export enum Scope {
    FRIENDS = 'friends',
    PHOTOS = 'photos',
    VIDEO = 'video',
    STORIES = 'stories',
    PAGES = 'pages',
    STATUS = 'status',
    NOTES = 'notes',
    WALL = 'wall',
    DOCS = 'docs',
    GROUPS = 'groups',
    STATS = 'stats',
    MARKET = 'market',
    APP_WIDGET = 'app_widget',
    MESSAGES = 'messages',
    MANAGE = 'manage'
}

export enum ViewerGroupRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    MEMBER = 'member',
    MODER = 'moder',
    NONE = 'none'
}

export enum Platform {
    DESKTOP_WEB = 'desktop_web',
    MOBILE_ANDROID = 'mobile_android',
    MOBILE_ANDROID_MESSENGER = 'mobile_android_messenger',
    MOBILE_IPAD = 'mobile_ipad',
    MOBILE_IPHONE = 'mobile_iphone',
    MOBILE_IPHONE_MESSENGER = 'mobile_iphone_messenger',
    MOBILE_WEB = 'mobile_web'
}

type ConverterHandler<T> = (value: T) => T;

const numberParams: (keyof LaunchParams)[] = ['user_id', 'app_id', 'group_id', 'ts'];
const booleanParams: (keyof LaunchParams)[] = ['is_app_user', 'are_notifications_enabled', 'is_favorite'];
const arrayParams: (keyof LaunchParams)[] = ['access_token_settings'];

const VK_KEY_PREFIX = 'vk_';

const converters: [string[][], ConverterHandler<any>[]][] = [
    [[numberParams, booleanParams], [Number, (value) => Boolean(Number(value))]],
    [[arrayParams], [(value) => value.split(',')]]
];

export function getLaunchParams(): LaunchParams {
    const params = new URLSearchParams(location.search);

    return ([...params.entries()] as [keyof LaunchParams, any][])
        .sort()
        .reduce<Record<string, any>>((params, [key, value]) => {
            if (key.startsWith(VK_KEY_PREFIX)) {
                key = key.replace(VK_KEY_PREFIX, '') as keyof LaunchParams;
            }

            converters.forEach(([params, handlers]) => {
                params.forEach((params, index) => {
                    if (params.includes(key)) {
                        const handler = handlers[index];

                        value = handler(value);
                    }
                });
            });

            params[key] = value;

            return params;
        }, {}) as LaunchParams;
}
