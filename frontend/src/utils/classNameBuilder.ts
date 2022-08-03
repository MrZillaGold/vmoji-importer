export interface ObjectClassNames {
    [key: string]: any;
}

export type ClassName =
    number
    | string
    | ObjectClassNames
    | false
    | null
    | undefined;

export function classNameBuilder(...classnames: ClassName[]): string {
    const result: string[] = [];

    for (let i = 0; i < classnames.length; i++) {
        const item = classnames[i];

        if (!item) {
            continue;
        }

        switch (typeof item) {
            case 'string':
                result.push(item);
                break;
            case 'object':
                for (const key in item) {
                    if (item[key]) {
                        result.push(key);
                    }
                }
                break;
            default:
                result.push(
                    String(item)
                );
        }
    }

    return result.join(' ');
}
