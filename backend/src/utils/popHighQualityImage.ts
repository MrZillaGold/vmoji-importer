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
}

export function popHighQualityImage(images: Image[]): Image {
    return images.sort((a, b) => (
        a.width * a.height - b.width * b.height
    ))
        .pop()!;
}
