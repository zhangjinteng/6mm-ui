/**
 * Reusable 24x24 stroke icons migrated from the legacy agent console SVG set.
 *
 * The source assets use a mix of 1024x1024 filled paths and naming styles. Keep
 * their reusable semantics here while matching MmIcon's currentColor stroke
 * contract and public English icon names.
 */
export declare const extendedIconDefinitions: {
    readonly camera: readonly [readonly ["path", {
        readonly d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "13";
        readonly r: "3";
    }]];
    readonly "circle-help": readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "10";
    }], readonly ["path", {
        readonly d: "M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3";
    }], readonly ["path", {
        readonly d: "M12 17h.01";
    }]];
    readonly clock: readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "10";
    }], readonly ["path", {
        readonly d: "M12 6v6l4 2";
    }]];
    readonly download: readonly [readonly ["path", {
        readonly d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4";
    }], readonly ["path", {
        readonly d: "M7 10l5 5 5-5";
    }], readonly ["path", {
        readonly d: "M12 15V3";
    }]];
    readonly ellipsis: readonly [readonly ["circle", {
        readonly cx: "5";
        readonly cy: "12";
        readonly r: "1";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "1";
    }], readonly ["circle", {
        readonly cx: "19";
        readonly cy: "12";
        readonly r: "1";
    }]];
    readonly "ellipsis-vertical": readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "5";
        readonly r: "1";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "1";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "19";
        readonly r: "1";
    }]];
    readonly eraser: readonly [readonly ["path", {
        readonly d: "m7 21-4.3-4.3a2.4 2.4 0 0 1 0-3.4L13.3 2.7a2.4 2.4 0 0 1 3.4 0l4.6 4.6a2.4 2.4 0 0 1 0 3.4L11 21";
    }], readonly ["path", {
        readonly d: "M22 21H7";
    }], readonly ["path", {
        readonly d: "m5 11 9 9";
    }]];
    readonly eye: readonly [readonly ["path", {
        readonly d: "M2.06 12.35a1 1 0 0 1 0-.7C3.42 7.51 7.36 5 12 5s8.58 2.51 9.94 6.65a1 1 0 0 1 0 .7C20.58 16.49 16.64 19 12 19S3.42 16.49 2.06 12.35";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "3";
    }]];
    readonly "eye-off": readonly [readonly ["path", {
        readonly d: "m2 2 20 20";
    }], readonly ["path", {
        readonly d: "M6.71 6.71a11.8 11.8 0 0 0-4.05 4.85 1 1 0 0 0 0 .88C4.25 15.94 7.65 18 12 18c1.16 0 2.24-.15 3.23-.44";
    }], readonly ["path", {
        readonly d: "M10.73 5.08A9.8 9.8 0 0 1 12 5c4.35 0 7.75 2.06 9.34 5.56a1 1 0 0 1 0 .88 11.9 11.9 0 0 1-2.2 3.19";
    }], readonly ["path", {
        readonly d: "m14.12 14.12-4.24-4.24";
    }]];
    readonly fullscreen: readonly [readonly ["path", {
        readonly d: "M8 3H5a2 2 0 0 0-2 2v3";
    }], readonly ["path", {
        readonly d: "M16 3h3a2 2 0 0 1 2 2v3";
    }], readonly ["path", {
        readonly d: "M8 21H5a2 2 0 0 1-2-2v-3";
    }], readonly ["path", {
        readonly d: "M16 21h3a2 2 0 0 0 2-2v-3";
    }]];
    readonly "fullscreen-exit": readonly [readonly ["path", {
        readonly d: "M5 8h3V5";
    }], readonly ["path", {
        readonly d: "M19 8h-3V5";
    }], readonly ["path", {
        readonly d: "M5 16h3v3";
    }], readonly ["path", {
        readonly d: "M19 16h-3v3";
    }]];
    readonly image: readonly [readonly ["rect", {
        readonly x: "3";
        readonly y: "3";
        readonly width: "18";
        readonly height: "18";
        readonly rx: "2";
    }], readonly ["circle", {
        readonly cx: "9";
        readonly cy: "9";
        readonly r: "2";
    }], readonly ["path", {
        readonly d: "m21 15-5-5L5 21";
    }]];
    readonly mail: readonly [readonly ["rect", {
        readonly x: "2";
        readonly y: "4";
        readonly width: "20";
        readonly height: "16";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "m22 7-8.99 5.73a2 2 0 0 1-2.02 0L2 7";
    }]];
    readonly map: readonly [readonly ["polygon", {
        readonly points: "3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6";
    }], readonly ["line", {
        readonly x1: "9";
        readonly x2: "9";
        readonly y1: "3";
        readonly y2: "18";
    }], readonly ["line", {
        readonly x1: "15";
        readonly x2: "15";
        readonly y1: "6";
        readonly y2: "21";
    }]];
    readonly "map-pin": readonly [readonly ["path", {
        readonly d: "M20 10c0 5-5.5 10.5-7.4 12.35a.85.85 0 0 1-1.2 0C9.5 20.5 4 15 4 10a8 8 0 0 1 16 0";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "10";
        readonly r: "3";
    }]];
    readonly mic: readonly [readonly ["path", {
        readonly d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3";
    }], readonly ["path", {
        readonly d: "M19 10v2a7 7 0 0 1-14 0v-2";
    }], readonly ["line", {
        readonly x1: "12";
        readonly x2: "12";
        readonly y1: "19";
        readonly y2: "22";
    }]];
    readonly phone: readonly [readonly ["path", {
        readonly d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0 1 22 16.92";
    }]];
    readonly printer: readonly [readonly ["path", {
        readonly d: "M6 9V2h12v7";
    }], readonly ["path", {
        readonly d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2";
    }], readonly ["rect", {
        readonly x: "6";
        readonly y: "14";
        readonly width: "12";
        readonly height: "8";
    }]];
    readonly "repeat-2": readonly [readonly ["path", {
        readonly d: "m2 9 3-3 3 3";
    }], readonly ["path", {
        readonly d: "M5 6h11a4 4 0 0 1 4 4v1";
    }], readonly ["path", {
        readonly d: "m22 15-3 3-3-3";
    }], readonly ["path", {
        readonly d: "M19 18H8a4 4 0 0 1-4-4v-1";
    }]];
    readonly "scan-line": readonly [readonly ["path", {
        readonly d: "M3 7V5a2 2 0 0 1 2-2h2";
    }], readonly ["path", {
        readonly d: "M17 3h2a2 2 0 0 1 2 2v2";
    }], readonly ["path", {
        readonly d: "M21 17v2a2 2 0 0 1-2 2h-2";
    }], readonly ["path", {
        readonly d: "M7 21H5a2 2 0 0 1-2-2v-2";
    }], readonly ["path", {
        readonly d: "M7 12h10";
    }]];
    readonly "share-2": readonly [readonly ["circle", {
        readonly cx: "18";
        readonly cy: "5";
        readonly r: "3";
    }], readonly ["circle", {
        readonly cx: "6";
        readonly cy: "12";
        readonly r: "3";
    }], readonly ["circle", {
        readonly cx: "18";
        readonly cy: "19";
        readonly r: "3";
    }], readonly ["line", {
        readonly x1: "8.59";
        readonly x2: "15.42";
        readonly y1: "10.51";
        readonly y2: "6.49";
    }], readonly ["line", {
        readonly x1: "8.59";
        readonly x2: "15.42";
        readonly y1: "13.49";
        readonly y2: "17.51";
    }]];
    readonly "undo-2": readonly [readonly ["path", {
        readonly d: "M9 14 4 9l5-5";
    }], readonly ["path", {
        readonly d: "M4 9h10.5a5.5 5.5 0 0 1 0 11H11";
    }]];
    readonly "volume-2": readonly [readonly ["polygon", {
        readonly points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5";
    }], readonly ["path", {
        readonly d: "M15.54 8.46a5 5 0 0 1 0 7.07";
    }], readonly ["path", {
        readonly d: "M19.07 4.93a10 10 0 0 1 0 14.14";
    }]];
    readonly "volume-x": readonly [readonly ["polygon", {
        readonly points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5";
    }], readonly ["line", {
        readonly x1: "22";
        readonly x2: "16";
        readonly y1: "9";
        readonly y2: "15";
    }], readonly ["line", {
        readonly x1: "16";
        readonly x2: "22";
        readonly y1: "9";
        readonly y2: "15";
    }]];
};
