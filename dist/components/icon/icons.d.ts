export type IconNodeTag = "circle" | "ellipse" | "line" | "path" | "polygon" | "polyline" | "rect";
export type IconNodeAttributes = Readonly<Record<string, number | string>>;
export type IconNode = readonly [IconNodeTag, IconNodeAttributes];
export declare const iconDefinitions: {
    readonly alert: readonly [readonly ["path", {
        readonly d: "M12 3 2.7 20h18.6L12 3Z";
    }], readonly ["path", {
        readonly d: "M12 9v4";
    }], readonly ["path", {
        readonly d: "M12 17h.01";
    }]];
    readonly "arrow-down": readonly [readonly ["path", {
        readonly d: "M12 5v14";
    }], readonly ["path", {
        readonly d: "m19 12-7 7-7-7";
    }]];
    readonly "arrow-down-to-line": readonly [readonly ["path", {
        readonly d: "M12 17V3";
    }], readonly ["path", {
        readonly d: "m6 11 6 6 6-6";
    }], readonly ["path", {
        readonly d: "M19 21H5";
    }]];
    readonly "arrow-left": readonly [readonly ["path", {
        readonly d: "m12 19-7-7 7-7";
    }], readonly ["path", {
        readonly d: "M19 12H5";
    }]];
    readonly "arrow-left-right": readonly [readonly ["path", {
        readonly d: "M8 3 4 7l4 4";
    }], readonly ["path", {
        readonly d: "M4 7h16";
    }], readonly ["path", {
        readonly d: "m16 21 4-4-4-4";
    }], readonly ["path", {
        readonly d: "M20 17H4";
    }]];
    readonly "arrow-right": readonly [readonly ["path", {
        readonly d: "m9 18 6-6-6-6";
    }]];
    readonly "arrow-up": readonly [readonly ["path", {
        readonly d: "m5 12 7-7 7 7";
    }], readonly ["path", {
        readonly d: "M12 19V5";
    }]];
    readonly "arrow-up-down": readonly [readonly ["path", {
        readonly d: "m21 16-4 4-4-4";
    }], readonly ["path", {
        readonly d: "M17 20V4";
    }], readonly ["path", {
        readonly d: "m3 8 4-4 4 4";
    }], readonly ["path", {
        readonly d: "M7 4v16";
    }]];
    readonly "arrow-up-right": readonly [readonly ["path", {
        readonly d: "M7 7h10v10";
    }], readonly ["path", {
        readonly d: "M7 17 17 7";
    }]];
    readonly "arrow-up-to-line": readonly [readonly ["path", {
        readonly d: "M5 3h14";
    }], readonly ["path", {
        readonly d: "m18 13-6-6-6 6";
    }], readonly ["path", {
        readonly d: "M12 7v14";
    }]];
    readonly "badge-dollar-sign": readonly [readonly ["path", {
        readonly d: "M12 2 15 5l4-.5.5 4L22 12l-2.5 3.5-.5 4-4-.5-3 3-3-3-4 .5-.5-4L2 12l2.5-3.5.5-4 4 .5z";
    }], readonly ["path", {
        readonly d: "M15 9h-5a1.5 1.5 0 0 0 0 3h4a1.5 1.5 0 0 1 0 3H9M12 7v10";
    }]];
    readonly ban: readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "10";
    }], readonly ["path", {
        readonly d: "M4.929 4.929 19.07 19.071";
    }]];
    readonly banknote: readonly [readonly ["rect", {
        readonly x: "2";
        readonly y: "6";
        readonly width: "20";
        readonly height: "12";
        readonly rx: "2";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "2";
    }], readonly ["path", {
        readonly d: "M6 10h.01M18 14h.01";
    }]];
    readonly "bar-chart-3": readonly [readonly ["path", {
        readonly d: "M3 3v18h18";
    }], readonly ["path", {
        readonly d: "M8 17v-6M13 17V7M18 17V4";
    }]];
    readonly bell: readonly [readonly ["path", {
        readonly d: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9";
    }], readonly ["path", {
        readonly d: "M10 21h4";
    }]];
    readonly "building-2": readonly [readonly ["path", {
        readonly d: "M3 21h18M6 21V4h9v17M15 8h3v13M9 8h2M9 12h2M9 16h2";
    }]];
    readonly calendar: readonly [readonly ["rect", {
        readonly x: "3";
        readonly y: "5";
        readonly width: "18";
        readonly height: "16";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M16 3v4M8 3v4M3 11h18";
    }]];
    readonly "candlestick-chart": readonly [readonly ["path", {
        readonly d: "M9 5v4";
    }], readonly ["rect", {
        readonly x: "7";
        readonly y: "9";
        readonly width: "4";
        readonly height: "6";
        readonly rx: "1";
    }], readonly ["path", {
        readonly d: "M9 15v2";
    }], readonly ["path", {
        readonly d: "M17 3v2";
    }], readonly ["rect", {
        readonly x: "15";
        readonly y: "5";
        readonly width: "4";
        readonly height: "8";
        readonly rx: "1";
    }], readonly ["path", {
        readonly d: "M17 13v3";
    }], readonly ["path", {
        readonly d: "M3 3v16a2 2 0 0 0 2 2h16";
    }]];
    readonly "chart-candlestick": readonly [readonly ["path", {
        readonly d: "M9 5v4";
    }], readonly ["rect", {
        readonly x: "7";
        readonly y: "9";
        readonly width: "4";
        readonly height: "6";
        readonly rx: "1";
    }], readonly ["path", {
        readonly d: "M9 15v2";
    }], readonly ["path", {
        readonly d: "M17 3v2";
    }], readonly ["rect", {
        readonly x: "15";
        readonly y: "5";
        readonly width: "4";
        readonly height: "8";
        readonly rx: "1";
    }], readonly ["path", {
        readonly d: "M17 13v3";
    }], readonly ["path", {
        readonly d: "M3 3v16a2 2 0 0 0 2 2h16";
    }]];
    readonly "chart-no-axes-combined": readonly [readonly ["path", {
        readonly d: "M3 3v18h18";
    }], readonly ["path", {
        readonly d: "m7 16 4-5 4 3 5-7";
    }]];
    readonly check: readonly [readonly ["path", {
        readonly d: "m5 12 4 4L19 6";
    }]];
    readonly chevron: readonly [readonly ["path", {
        readonly d: "m9 18 6-6-6-6";
    }]];
    readonly "chevron-down": readonly [readonly ["path", {
        readonly d: "m6 9 6 6 6-6";
    }]];
    readonly "chevron-left": readonly [readonly ["path", {
        readonly d: "m15 18-6-6 6-6";
    }]];
    readonly "chevron-right": readonly [readonly ["path", {
        readonly d: "m9 18 6-6-6-6";
    }]];
    readonly "chevron-up": readonly [readonly ["path", {
        readonly d: "m18 15-6-6-6 6";
    }]];
    readonly "circle-arrow-up": readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "10";
    }], readonly ["path", {
        readonly d: "m16 12-4-4-4 4";
    }], readonly ["path", {
        readonly d: "M12 16V8";
    }]];
    readonly "circle-check": readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "10";
    }], readonly ["path", {
        readonly d: "m9 12 2 2 4-4";
    }]];
    readonly "circle-check-big": readonly [readonly ["path", {
        readonly d: "M21.801 10A10 10 0 1 1 17 3.335";
    }], readonly ["path", {
        readonly d: "m9 11 3 3L22 4";
    }]];
    readonly "circle-dollar-sign": readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "10";
    }], readonly ["path", {
        readonly d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 6v12";
    }]];
    readonly "circle-pause": readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "10";
    }], readonly ["line", {
        readonly x1: "10";
        readonly x2: "10";
        readonly y1: "15";
        readonly y2: "9";
    }], readonly ["line", {
        readonly x1: "14";
        readonly x2: "14";
        readonly y1: "15";
        readonly y2: "9";
    }]];
    readonly "circle-x": readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "10";
    }], readonly ["path", {
        readonly d: "m15 9-6 6";
    }], readonly ["path", {
        readonly d: "m9 9 6 6";
    }]];
    readonly "clipboard-list": readonly [readonly ["rect", {
        readonly x: "5";
        readonly y: "4";
        readonly width: "14";
        readonly height: "18";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M9 4V2h6v2M9 9h6M9 13h6M9 17h4";
    }]];
    readonly close: readonly [readonly ["path", {
        readonly d: "M18 6 6 18M6 6l12 12";
    }]];
    readonly coins: readonly [readonly ["circle", {
        readonly cx: "8";
        readonly cy: "8";
        readonly r: "6";
    }], readonly ["path", {
        readonly d: "M18 8a6 6 0 1 1-6 6";
    }]];
    readonly columns: readonly [readonly ["rect", {
        readonly x: "3";
        readonly y: "3";
        readonly width: "18";
        readonly height: "18";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M9 3v18M15 3v18";
    }]];
    readonly copy: readonly [readonly ["rect", {
        readonly width: "14";
        readonly height: "14";
        readonly x: "8";
        readonly y: "8";
        readonly rx: "2";
        readonly ry: "2";
    }], readonly ["path", {
        readonly d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2";
    }]];
    readonly database: readonly [readonly ["ellipse", {
        readonly cx: "12";
        readonly cy: "5";
        readonly rx: "8";
        readonly ry: "3";
    }], readonly ["path", {
        readonly d: "M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6";
    }]];
    readonly down: readonly [readonly ["path", {
        readonly d: "m6 9 6 6 6-6";
    }]];
    readonly "external-link": readonly [readonly ["path", {
        readonly d: "M15 3h6v6";
    }], readonly ["path", {
        readonly d: "M10 14 21 3";
    }], readonly ["path", {
        readonly d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6";
    }]];
    readonly "file-bar-chart": readonly [readonly ["path", {
        readonly d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z";
    }], readonly ["path", {
        readonly d: "M14 2v6h6M8 18v-3M12 18v-6M16 18v-4";
    }]];
    readonly "file-chart-column": readonly [readonly ["path", {
        readonly d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z";
    }], readonly ["path", {
        readonly d: "M14 2v6h6M8 18v-3M12 18v-6M16 18v-4";
    }]];
    readonly "file-check-2": readonly [readonly ["path", {
        readonly d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z";
    }], readonly ["path", {
        readonly d: "M14 2v6h6m-11 7 2 2 4-4";
    }]];
    readonly "file-clock": readonly [readonly ["path", {
        readonly d: "M14 2H6a2 2 0 0 0-2 2v6M14 2v6h6v3";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "17";
        readonly r: "5";
    }], readonly ["path", {
        readonly d: "M12 14v3l2 1";
    }]];
    readonly "file-text": readonly [readonly ["path", {
        readonly d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z";
    }], readonly ["path", {
        readonly d: "M14 2v6h6M8 13h8M8 17h8M8 9h2";
    }]];
    readonly filter: readonly [readonly ["path", {
        readonly d: "M4 5h16M7 12h10M10 19h4";
    }]];
    readonly gift: readonly [readonly ["rect", {
        readonly x: "3";
        readonly y: "8";
        readonly width: "18";
        readonly height: "13";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M12 8v13M3 12h18M7.5 8C5 8 4 6.5 5 5s3.5 0 7 3M16.5 8C19 8 20 6.5 19 5s-3.5 0-7 3";
    }]];
    readonly globe: readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "10";
    }], readonly ["path", {
        readonly d: "M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20";
    }]];
    readonly "grid-3x3": readonly [readonly ["rect", {
        readonly width: "18";
        readonly height: "18";
        readonly x: "3";
        readonly y: "3";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M3 9h18";
    }], readonly ["path", {
        readonly d: "M3 15h18";
    }], readonly ["path", {
        readonly d: "M9 3v18";
    }], readonly ["path", {
        readonly d: "M15 3v18";
    }]];
    readonly "hand-coins": readonly [readonly ["path", {
        readonly d: "M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.2.2-1.6.7L3 17";
    }], readonly ["path", {
        readonly d: "m7 21 1.6-1.4c.4-.4 1-.6 1.6-.6H15c1.1 0 2.1-.4 2.8-1.2L22 13.8";
    }], readonly ["path", {
        readonly d: "M2 16l6 6";
    }], readonly ["circle", {
        readonly cx: "16";
        readonly cy: "6";
        readonly r: "4";
    }]];
    readonly history: readonly [readonly ["path", {
        readonly d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8";
    }], readonly ["path", {
        readonly d: "M3 3v5h5";
    }], readonly ["path", {
        readonly d: "M12 7v5l4 2";
    }]];
    readonly "id-card": readonly [readonly ["rect", {
        readonly x: "3";
        readonly y: "5";
        readonly width: "18";
        readonly height: "14";
        readonly rx: "2";
    }], readonly ["circle", {
        readonly cx: "8";
        readonly cy: "10";
        readonly r: "2";
    }], readonly ["path", {
        readonly d: "M6 15c.7-1.3 1.7-2 3-2s2.3.7 3 2M14 9h4M14 13h4";
    }]];
    readonly inbox: readonly [readonly ["polyline", {
        readonly points: "22 12 16 12 14 15 10 15 8 12 2 12";
    }], readonly ["path", {
        readonly d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z";
    }]];
    readonly info: readonly [readonly ["path", {
        readonly d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z";
    }], readonly ["path", {
        readonly d: "M12 11v6";
    }], readonly ["path", {
        readonly d: "M12 7h.01";
    }]];
    readonly key: readonly [readonly ["circle", {
        readonly cx: "7.5";
        readonly cy: "15.5";
        readonly r: "5.5";
    }], readonly ["path", {
        readonly d: "m21 2-9.6 9.6M15 6l3 3M18 3l3 3";
    }]];
    readonly "key-round": readonly [readonly ["circle", {
        readonly cx: "7.5";
        readonly cy: "15.5";
        readonly r: "5.5";
    }], readonly ["path", {
        readonly d: "m21 2-9.6 9.6M15 6l3 3M18 3l3 3";
    }]];
    readonly landmark: readonly [readonly ["path", {
        readonly d: "m3 10 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18";
    }]];
    readonly "layout-dashboard": readonly [readonly ["rect", {
        readonly x: "3";
        readonly y: "3";
        readonly width: "7";
        readonly height: "7";
    }], readonly ["rect", {
        readonly x: "14";
        readonly y: "3";
        readonly width: "7";
        readonly height: "7";
    }], readonly ["rect", {
        readonly x: "3";
        readonly y: "14";
        readonly width: "7";
        readonly height: "7";
    }], readonly ["rect", {
        readonly x: "14";
        readonly y: "14";
        readonly width: "7";
        readonly height: "7";
    }]];
    readonly left: readonly [readonly ["path", {
        readonly d: "m15 18-6-6 6-6";
    }]];
    readonly "line-chart": readonly [readonly ["path", {
        readonly d: "M3 3v18h18";
    }], readonly ["path", {
        readonly d: "m7 16 4-5 4 3 5-7";
    }]];
    readonly list: readonly [readonly ["path", {
        readonly d: "M3 5h.01";
    }], readonly ["path", {
        readonly d: "M3 12h.01";
    }], readonly ["path", {
        readonly d: "M3 19h.01";
    }], readonly ["path", {
        readonly d: "M8 5h13";
    }], readonly ["path", {
        readonly d: "M8 12h13";
    }], readonly ["path", {
        readonly d: "M8 19h13";
    }]];
    readonly "list-checks": readonly [readonly ["path", {
        readonly d: "m3 5 2 2 4-4M3 12l2 2 4-4M3 19l2 2 4-4M13 6h8M13 13h8M13 20h8";
    }]];
    readonly "loader-circle": readonly [readonly ["path", {
        readonly d: "M21 12a9 9 0 1 1-6.219-8.56";
    }]];
    readonly loading: readonly [readonly ["path", {
        readonly d: "M21 12a9 9 0 1 1-9-9";
    }]];
    readonly "lock-keyhole": readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "16";
        readonly r: "1";
    }], readonly ["rect", {
        readonly x: "3";
        readonly y: "10";
        readonly width: "18";
        readonly height: "12";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M7 10V7a5 5 0 0 1 10 0v3";
    }]];
    readonly logout: readonly [readonly ["path", {
        readonly d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4";
    }], readonly ["path", {
        readonly d: "m16 17 5-5-5-5M21 12H9";
    }]];
    readonly megaphone: readonly [readonly ["path", {
        readonly d: "m3 11 15-5v12L3 13zM11.6 15.5 13 21H8l-1.5-6";
    }]];
    readonly menu: readonly [readonly ["path", {
        readonly d: "M4 6h16M4 12h16M4 18h16";
    }]];
    readonly "monitor-smartphone": readonly [readonly ["path", {
        readonly d: "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8";
    }], readonly ["path", {
        readonly d: "M10 19v-3.96 3.15";
    }], readonly ["path", {
        readonly d: "M7 19h5";
    }], readonly ["rect", {
        readonly width: "6";
        readonly height: "10";
        readonly x: "16";
        readonly y: "12";
        readonly rx: "2";
    }]];
    readonly moon: readonly [readonly ["path", {
        readonly d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401";
    }]];
    readonly "mouse-pointer-click": readonly [readonly ["path", {
        readonly d: "M14 4.1 12 6";
    }], readonly ["path", {
        readonly d: "m5.1 8-2.9-.8";
    }], readonly ["path", {
        readonly d: "m6 12-1.9 2";
    }], readonly ["path", {
        readonly d: "M7.2 2.2 8 5.1";
    }], readonly ["path", {
        readonly d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z";
    }]];
    readonly network: readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "5";
        readonly r: "3";
    }], readonly ["circle", {
        readonly cx: "5";
        readonly cy: "19";
        readonly r: "3";
    }], readonly ["circle", {
        readonly cx: "19";
        readonly cy: "19";
        readonly r: "3";
    }], readonly ["path", {
        readonly d: "M12 8v4M5 16v-4h14v4";
    }]];
    readonly panel: readonly [readonly ["rect", {
        readonly x: "3";
        readonly y: "3";
        readonly width: "18";
        readonly height: "18";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M15 3v18M8 9l3 3-3 3";
    }]];
    readonly "panel-left-close": readonly [readonly ["rect", {
        readonly x: "3";
        readonly y: "3";
        readonly width: "18";
        readonly height: "18";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M7 3v18";
    }], readonly ["path", {
        readonly d: "M14.5 8.5 11 12l3.5 3.5";
    }]];
    readonly "panel-right-open": readonly [readonly ["rect", {
        readonly x: "3";
        readonly y: "3";
        readonly width: "18";
        readonly height: "18";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M17 3v18";
    }], readonly ["path", {
        readonly d: "M9.5 8.5 13 12l-3.5 3.5";
    }]];
    readonly "party-popper": readonly [readonly ["path", {
        readonly d: "M5.8 11.3 2 22l10.7-3.8";
    }], readonly ["path", {
        readonly d: "m4 3 1.5 1.5M14 2l-1 2.5M21 9l-2.5 1M11 7l6 6";
    }], readonly ["path", {
        readonly d: "M16 3c3 1 5 3 5 6";
    }]];
    readonly plug: readonly [readonly ["path", {
        readonly d: "M12 22v-5M9 8V2M15 8V2M18 8v4a6 6 0 0 1-12 0V8z";
    }]];
    readonly "plug-zap": readonly [readonly ["path", {
        readonly d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z";
    }], readonly ["path", {
        readonly d: "m2 22 3-3";
    }], readonly ["path", {
        readonly d: "M7.5 13.5 10 11";
    }], readonly ["path", {
        readonly d: "M10.5 16.5 13 14";
    }], readonly ["path", {
        readonly d: "m18 3-4 4h6l-4 4";
    }]];
    readonly plus: readonly [readonly ["path", {
        readonly d: "M5 12h14";
    }], readonly ["path", {
        readonly d: "M12 5v14";
    }]];
    readonly "radio-tower": readonly [readonly ["path", {
        readonly d: "M4.9 16.1C1 12.2 1 5.8 4.9 1.9";
    }], readonly ["path", {
        readonly d: "M7.8 4.7a6.14 6.14 0 0 0-.8 7.5";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "9";
        readonly r: "2";
    }], readonly ["path", {
        readonly d: "M16.2 4.8c2 2 2.26 5.11.8 7.47";
    }], readonly ["path", {
        readonly d: "M19.1 1.9a9.96 9.96 0 0 1 0 14.1";
    }], readonly ["path", {
        readonly d: "M9.5 18h5";
    }], readonly ["path", {
        readonly d: "m8 22 4-11 4 11";
    }]];
    readonly "receipt-text": readonly [readonly ["path", {
        readonly d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z";
    }], readonly ["path", {
        readonly d: "M8 8h8M8 12h8M8 16h5";
    }]];
    readonly refresh: readonly [readonly ["path", {
        readonly d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8";
    }], readonly ["path", {
        readonly d: "M21 3v5h-5";
    }], readonly ["path", {
        readonly d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16";
    }], readonly ["path", {
        readonly d: "M8 16H3v5";
    }]];
    readonly "refresh-cw": readonly [readonly ["path", {
        readonly d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8";
    }], readonly ["path", {
        readonly d: "M21 3v5h-5";
    }], readonly ["path", {
        readonly d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16";
    }], readonly ["path", {
        readonly d: "M8 16H3v5";
    }]];
    readonly right: readonly [readonly ["path", {
        readonly d: "m9 18 6-6-6-6";
    }]];
    readonly rocket: readonly [readonly ["path", {
        readonly d: "M4.5 16.5c-1.5 1.3-2 4-2 4s2.7-.5 4-2M15 9l-6 6M14 4c3-2 6-2 6-2s0 3-2 6l-6 6-4-4z";
    }], readonly ["path", {
        readonly d: "M9 5H5l-3 3 6 2M19 15v4l-3 3-2-6";
    }]];
    readonly rotate: readonly [readonly ["path", {
        readonly d: "M3 12a9 9 0 1 0 3-6.7L3 8";
    }], readonly ["path", {
        readonly d: "M3 3v5h5";
    }]];
    readonly "rotate-ccw": readonly [readonly ["path", {
        readonly d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8";
    }], readonly ["path", {
        readonly d: "M3 3v5h5";
    }]];
    readonly "rotate-cw": readonly [readonly ["path", {
        readonly d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8";
    }], readonly ["path", {
        readonly d: "M21 3v5h-5";
    }]];
    readonly route: readonly [readonly ["circle", {
        readonly cx: "6";
        readonly cy: "19";
        readonly r: "3";
    }], readonly ["circle", {
        readonly cx: "18";
        readonly cy: "5";
        readonly r: "3";
    }], readonly ["path", {
        readonly d: "M9 19h2a4 4 0 0 0 4-4V9";
    }]];
    readonly save: readonly [readonly ["path", {
        readonly d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z";
    }], readonly ["path", {
        readonly d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7";
    }], readonly ["path", {
        readonly d: "M7 3v4a1 1 0 0 0 1 1h7";
    }]];
    readonly scale: readonly [readonly ["path", {
        readonly d: "m16 16 3-8 3 8a3 3 0 0 1-6 0ZM2 16l3-8 3 8a3 3 0 0 1-6 0ZM12 3v18M3 7h18";
    }]];
    readonly "scroll-text": readonly [readonly ["path", {
        readonly d: "M15 12h-5";
    }], readonly ["path", {
        readonly d: "M15 8h-5";
    }], readonly ["path", {
        readonly d: "M19 17V5a2 2 0 0 0-2-2H4";
    }], readonly ["path", {
        readonly d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3";
    }]];
    readonly search: readonly [readonly ["circle", {
        readonly cx: "11";
        readonly cy: "11";
        readonly r: "8";
    }], readonly ["path", {
        readonly d: "m21 21-4.3-4.3";
    }]];
    readonly "search-check": readonly [readonly ["path", {
        readonly d: "m8 11 2 2 4-4";
    }], readonly ["circle", {
        readonly cx: "11";
        readonly cy: "11";
        readonly r: "8";
    }], readonly ["path", {
        readonly d: "m21 21-4.3-4.3";
    }]];
    readonly "search-x": readonly [readonly ["path", {
        readonly d: "m13.5 8.5-5 5";
    }], readonly ["path", {
        readonly d: "m8.5 8.5 5 5";
    }], readonly ["circle", {
        readonly cx: "11";
        readonly cy: "11";
        readonly r: "8";
    }], readonly ["path", {
        readonly d: "m21 21-4.3-4.3";
    }]];
    readonly server: readonly [readonly ["rect", {
        readonly x: "3";
        readonly y: "4";
        readonly width: "18";
        readonly height: "6";
        readonly rx: "2";
    }], readonly ["rect", {
        readonly x: "3";
        readonly y: "14";
        readonly width: "18";
        readonly height: "6";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M7 7h.01M7 17h.01";
    }]];
    readonly settings: readonly [readonly ["path", {
        readonly d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "3";
    }]];
    readonly "settings-2": readonly [readonly ["path", {
        readonly d: "M20 7h-9M14 17H5";
    }], readonly ["circle", {
        readonly cx: "17";
        readonly cy: "17";
        readonly r: "3";
    }], readonly ["circle", {
        readonly cx: "7";
        readonly cy: "7";
        readonly r: "3";
    }]];
    readonly "shield-alert": readonly [readonly ["path", {
        readonly d: "M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z";
    }], readonly ["path", {
        readonly d: "M12 8v4M12 16h.01";
    }]];
    readonly "shield-check": readonly [readonly ["path", {
        readonly d: "M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z";
    }], readonly ["path", {
        readonly d: "m9 12 2 2 4-4";
    }]];
    readonly "sliders-horizontal": readonly [readonly ["path", {
        readonly d: "M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3";
    }], readonly ["circle", {
        readonly cx: "12";
        readonly cy: "4";
        readonly r: "2";
    }], readonly ["circle", {
        readonly cx: "10";
        readonly cy: "12";
        readonly r: "2";
    }], readonly ["circle", {
        readonly cx: "14";
        readonly cy: "20";
        readonly r: "2";
    }]];
    readonly smartphone: readonly [readonly ["rect", {
        readonly width: "14";
        readonly height: "20";
        readonly x: "5";
        readonly y: "2";
        readonly rx: "2";
        readonly ry: "2";
    }], readonly ["path", {
        readonly d: "M12 18h.01";
    }]];
    readonly "square-pen": readonly [readonly ["path", {
        readonly d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7";
    }], readonly ["path", {
        readonly d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z";
    }]];
    readonly store: readonly [readonly ["path", {
        readonly d: "M3 9l2-6h14l2 6M5 13v8h14v-8M9 21v-6h6v6";
    }], readonly ["path", {
        readonly d: "M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0";
    }]];
    readonly sun: readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "12";
        readonly r: "4";
    }], readonly ["path", {
        readonly d: "M12 2v2";
    }], readonly ["path", {
        readonly d: "M12 20v2";
    }], readonly ["path", {
        readonly d: "m4.93 4.93 1.41 1.41";
    }], readonly ["path", {
        readonly d: "m17.66 17.66 1.41 1.41";
    }], readonly ["path", {
        readonly d: "M2 12h2";
    }], readonly ["path", {
        readonly d: "M20 12h2";
    }], readonly ["path", {
        readonly d: "m6.34 17.66-1.41 1.41";
    }], readonly ["path", {
        readonly d: "m19.07 4.93-1.41 1.41";
    }]];
    readonly tag: readonly [readonly ["path", {
        readonly d: "M20 12 12 20 4 12V4h8z";
    }], readonly ["circle", {
        readonly cx: "9";
        readonly cy: "9";
        readonly r: "1";
    }]];
    readonly terminal: readonly [readonly ["path", {
        readonly d: "M12 19h8";
    }], readonly ["path", {
        readonly d: "m4 17 6-6-6-6";
    }]];
    readonly "trash-2": readonly [readonly ["path", {
        readonly d: "M10 11v6";
    }], readonly ["path", {
        readonly d: "M14 11v6";
    }], readonly ["path", {
        readonly d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6";
    }], readonly ["path", {
        readonly d: "M3 6h18";
    }], readonly ["path", {
        readonly d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2";
    }]];
    readonly "tree-branch": readonly [readonly ["path", {
        readonly d: "M5 2v10a7 7 0 0 0 7 7h8";
    }]];
    readonly "triangle-alert": readonly [readonly ["path", {
        readonly d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3";
    }], readonly ["path", {
        readonly d: "M12 9v4";
    }], readonly ["path", {
        readonly d: "M12 17h.01";
    }]];
    readonly upload: readonly [readonly ["path", {
        readonly d: "M12 3v12";
    }], readonly ["path", {
        readonly d: "m17 8-5-5-5 5";
    }], readonly ["path", {
        readonly d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4";
    }]];
    readonly user: readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "8";
        readonly r: "4";
    }], readonly ["path", {
        readonly d: "M4 21a8 8 0 0 1 16 0";
    }]];
    readonly "user-plus": readonly [readonly ["path", {
        readonly d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2";
    }], readonly ["circle", {
        readonly cx: "9";
        readonly cy: "7";
        readonly r: "4";
    }], readonly ["line", {
        readonly x1: "19";
        readonly x2: "19";
        readonly y1: "8";
        readonly y2: "14";
    }], readonly ["line", {
        readonly x1: "22";
        readonly x2: "16";
        readonly y1: "11";
        readonly y2: "11";
    }]];
    readonly "user-round": readonly [readonly ["circle", {
        readonly cx: "12";
        readonly cy: "8";
        readonly r: "5";
    }], readonly ["path", {
        readonly d: "M20 21a8 8 0 0 0-16 0";
    }]];
    readonly users: readonly [readonly ["path", {
        readonly d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2";
    }], readonly ["circle", {
        readonly cx: "9";
        readonly cy: "7";
        readonly r: "4";
    }], readonly ["path", {
        readonly d: "M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75";
    }]];
    readonly "users-round": readonly [readonly ["path", {
        readonly d: "M18 21a8 8 0 0 0-16 0";
    }], readonly ["circle", {
        readonly cx: "10";
        readonly cy: "8";
        readonly r: "5";
    }], readonly ["path", {
        readonly d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3";
    }]];
    readonly "wallet-cards": readonly [readonly ["rect", {
        readonly x: "2";
        readonly y: "5";
        readonly width: "20";
        readonly height: "14";
        readonly rx: "2";
    }], readonly ["path", {
        readonly d: "M16 13h4M2 10h20";
    }]];
    readonly webhook: readonly [readonly ["path", {
        readonly d: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2";
    }], readonly ["path", {
        readonly d: "m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06";
    }], readonly ["path", {
        readonly d: "m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8";
    }]];
    readonly x: readonly [readonly ["path", {
        readonly d: "M18 6 6 18";
    }], readonly ["path", {
        readonly d: "m6 6 12 12";
    }]];
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
export type IconName = keyof typeof iconDefinitions;
export declare const iconNames: IconName[];
