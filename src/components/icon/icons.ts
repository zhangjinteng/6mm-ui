import { extendedIconDefinitions } from "./extended-icons";

export type IconNodeTag =
  "circle" | "ellipse" | "line" | "path" | "polygon" | "polyline" | "rect";

export type IconNodeAttributes = Readonly<Record<string, number | string>>;
export type IconNode = readonly [IconNodeTag, IconNodeAttributes];

export const iconDefinitions = {
  ...extendedIconDefinitions,
  alert: [
    [
      "path",
      {
        d: "M12 3 2.7 20h18.6L12 3Z",
      },
    ],
    [
      "path",
      {
        d: "M12 9v4",
      },
    ],
    [
      "path",
      {
        d: "M12 17h.01",
      },
    ],
  ],
  "arrow-down": [
    [
      "path",
      {
        d: "M12 5v14",
      },
    ],
    [
      "path",
      {
        d: "m19 12-7 7-7-7",
      },
    ],
  ],
  "arrow-down-to-line": [
    [
      "path",
      {
        d: "M12 17V3",
      },
    ],
    [
      "path",
      {
        d: "m6 11 6 6 6-6",
      },
    ],
    [
      "path",
      {
        d: "M19 21H5",
      },
    ],
  ],
  "arrow-left": [
    [
      "path",
      {
        d: "m12 19-7-7 7-7",
      },
    ],
    [
      "path",
      {
        d: "M19 12H5",
      },
    ],
  ],
  "arrow-left-right": [
    [
      "path",
      {
        d: "M8 3 4 7l4 4",
      },
    ],
    [
      "path",
      {
        d: "M4 7h16",
      },
    ],
    [
      "path",
      {
        d: "m16 21 4-4-4-4",
      },
    ],
    [
      "path",
      {
        d: "M20 17H4",
      },
    ],
  ],
  "arrow-right": [
    [
      "path",
      {
        d: "m9 18 6-6-6-6",
      },
    ],
  ],
  "arrow-up": [
    [
      "path",
      {
        d: "m5 12 7-7 7 7",
      },
    ],
    [
      "path",
      {
        d: "M12 19V5",
      },
    ],
  ],
  "arrow-up-down": [
    [
      "path",
      {
        d: "m21 16-4 4-4-4",
      },
    ],
    [
      "path",
      {
        d: "M17 20V4",
      },
    ],
    [
      "path",
      {
        d: "m3 8 4-4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M7 4v16",
      },
    ],
  ],
  "arrow-up-right": [
    [
      "path",
      {
        d: "M7 7h10v10",
      },
    ],
    [
      "path",
      {
        d: "M7 17 17 7",
      },
    ],
  ],
  "arrow-up-to-line": [
    [
      "path",
      {
        d: "M5 3h14",
      },
    ],
    [
      "path",
      {
        d: "m18 13-6-6-6 6",
      },
    ],
    [
      "path",
      {
        d: "M12 7v14",
      },
    ],
  ],
  "badge-dollar-sign": [
    [
      "path",
      {
        d: "M12 2 15 5l4-.5.5 4L22 12l-2.5 3.5-.5 4-4-.5-3 3-3-3-4 .5-.5-4L2 12l2.5-3.5.5-4 4 .5z",
      },
    ],
    [
      "path",
      {
        d: "M15 9h-5a1.5 1.5 0 0 0 0 3h4a1.5 1.5 0 0 1 0 3H9M12 7v10",
      },
    ],
  ],
  ban: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "M4.929 4.929 19.07 19.071",
      },
    ],
  ],
  banknote: [
    [
      "rect",
      {
        x: "2",
        y: "6",
        width: "20",
        height: "12",
        rx: "2",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M6 10h.01M18 14h.01",
      },
    ],
  ],
  "bar-chart-3": [
    [
      "path",
      {
        d: "M3 3v18h18",
      },
    ],
    [
      "path",
      {
        d: "M8 17v-6M13 17V7M18 17V4",
      },
    ],
  ],
  bell: [
    [
      "path",
      {
        d: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9",
      },
    ],
    [
      "path",
      {
        d: "M10 21h4",
      },
    ],
  ],
  "building-2": [
    [
      "path",
      {
        d: "M3 21h18M6 21V4h9v17M15 8h3v13M9 8h2M9 12h2M9 16h2",
      },
    ],
  ],
  calendar: [
    [
      "rect",
      {
        x: "3",
        y: "5",
        width: "18",
        height: "16",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M16 3v4M8 3v4M3 11h18",
      },
    ],
  ],
  "candlestick-chart": [
    [
      "path",
      {
        d: "M9 5v4",
      },
    ],
    [
      "rect",
      {
        x: "7",
        y: "9",
        width: "4",
        height: "6",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M9 15v2",
      },
    ],
    [
      "path",
      {
        d: "M17 3v2",
      },
    ],
    [
      "rect",
      {
        x: "15",
        y: "5",
        width: "4",
        height: "8",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M17 13v3",
      },
    ],
    [
      "path",
      {
        d: "M3 3v16a2 2 0 0 0 2 2h16",
      },
    ],
  ],
  "chart-candlestick": [
    [
      "path",
      {
        d: "M9 5v4",
      },
    ],
    [
      "rect",
      {
        x: "7",
        y: "9",
        width: "4",
        height: "6",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M9 15v2",
      },
    ],
    [
      "path",
      {
        d: "M17 3v2",
      },
    ],
    [
      "rect",
      {
        x: "15",
        y: "5",
        width: "4",
        height: "8",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M17 13v3",
      },
    ],
    [
      "path",
      {
        d: "M3 3v16a2 2 0 0 0 2 2h16",
      },
    ],
  ],
  "chart-no-axes-combined": [
    [
      "path",
      {
        d: "M3 3v18h18",
      },
    ],
    [
      "path",
      {
        d: "m7 16 4-5 4 3 5-7",
      },
    ],
  ],
  check: [
    [
      "path",
      {
        d: "m5 12 4 4L19 6",
      },
    ],
  ],
  chevron: [
    [
      "path",
      {
        d: "m9 18 6-6-6-6",
      },
    ],
  ],
  "chevron-down": [
    [
      "path",
      {
        d: "m6 9 6 6 6-6",
      },
    ],
  ],
  "chevron-left": [
    [
      "path",
      {
        d: "m15 18-6-6 6-6",
      },
    ],
  ],
  "chevron-right": [
    [
      "path",
      {
        d: "m9 18 6-6-6-6",
      },
    ],
  ],
  "chevron-up": [
    [
      "path",
      {
        d: "m18 15-6-6-6 6",
      },
    ],
  ],
  "circle-arrow-up": [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "m16 12-4-4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M12 16V8",
      },
    ],
  ],
  "circle-check": [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "m9 12 2 2 4-4",
      },
    ],
  ],
  "circle-check-big": [
    [
      "path",
      {
        d: "M21.801 10A10 10 0 1 1 17 3.335",
      },
    ],
    [
      "path",
      {
        d: "m9 11 3 3L22 4",
      },
    ],
  ],
  "circle-dollar-sign": [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 6v12",
      },
    ],
  ],
  "circle-pause": [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "line",
      {
        x1: "10",
        x2: "10",
        y1: "15",
        y2: "9",
      },
    ],
    [
      "line",
      {
        x1: "14",
        x2: "14",
        y1: "15",
        y2: "9",
      },
    ],
  ],
  "circle-x": [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "m15 9-6 6",
      },
    ],
    [
      "path",
      {
        d: "m9 9 6 6",
      },
    ],
  ],
  "clipboard-list": [
    [
      "rect",
      {
        x: "5",
        y: "4",
        width: "14",
        height: "18",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M9 4V2h6v2M9 9h6M9 13h6M9 17h4",
      },
    ],
  ],
  close: [
    [
      "path",
      {
        d: "M18 6 6 18M6 6l12 12",
      },
    ],
  ],
  coins: [
    [
      "circle",
      {
        cx: "8",
        cy: "8",
        r: "6",
      },
    ],
    [
      "path",
      {
        d: "M18 8a6 6 0 1 1-6 6",
      },
    ],
  ],
  columns: [
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M9 3v18M15 3v18",
      },
    ],
  ],
  copy: [
    [
      "rect",
      {
        width: "14",
        height: "14",
        x: "8",
        y: "8",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
      },
    ],
  ],
  database: [
    [
      "ellipse",
      {
        cx: "12",
        cy: "5",
        rx: "8",
        ry: "3",
      },
    ],
    [
      "path",
      {
        d: "M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
      },
    ],
  ],
  down: [
    [
      "path",
      {
        d: "m6 9 6 6 6-6",
      },
    ],
  ],
  "external-link": [
    [
      "path",
      {
        d: "M15 3h6v6",
      },
    ],
    [
      "path",
      {
        d: "M10 14 21 3",
      },
    ],
    [
      "path",
      {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
      },
    ],
  ],
  "file-bar-chart": [
    [
      "path",
      {
        d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
      },
    ],
    [
      "path",
      {
        d: "M14 2v6h6M8 18v-3M12 18v-6M16 18v-4",
      },
    ],
  ],
  "file-chart-column": [
    [
      "path",
      {
        d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
      },
    ],
    [
      "path",
      {
        d: "M14 2v6h6M8 18v-3M12 18v-6M16 18v-4",
      },
    ],
  ],
  "file-check-2": [
    [
      "path",
      {
        d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
      },
    ],
    [
      "path",
      {
        d: "M14 2v6h6m-11 7 2 2 4-4",
      },
    ],
  ],
  "file-clock": [
    [
      "path",
      {
        d: "M14 2H6a2 2 0 0 0-2 2v6M14 2v6h6v3",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "17",
        r: "5",
      },
    ],
    [
      "path",
      {
        d: "M12 14v3l2 1",
      },
    ],
  ],
  "file-text": [
    [
      "path",
      {
        d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
      },
    ],
    [
      "path",
      {
        d: "M14 2v6h6M8 13h8M8 17h8M8 9h2",
      },
    ],
  ],
  filter: [
    [
      "path",
      {
        d: "M4 5h16M7 12h10M10 19h4",
      },
    ],
  ],
  gift: [
    [
      "rect",
      {
        x: "3",
        y: "8",
        width: "18",
        height: "13",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M12 8v13M3 12h18M7.5 8C5 8 4 6.5 5 5s3.5 0 7 3M16.5 8C19 8 20 6.5 19 5s-3.5 0-7 3",
      },
    ],
  ],
  globe: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
      },
    ],
  ],
  "grid-3x3": [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M3 9h18",
      },
    ],
    [
      "path",
      {
        d: "M3 15h18",
      },
    ],
    [
      "path",
      {
        d: "M9 3v18",
      },
    ],
    [
      "path",
      {
        d: "M15 3v18",
      },
    ],
  ],
  "hand-coins": [
    [
      "path",
      {
        d: "M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.2.2-1.6.7L3 17",
      },
    ],
    [
      "path",
      {
        d: "m7 21 1.6-1.4c.4-.4 1-.6 1.6-.6H15c1.1 0 2.1-.4 2.8-1.2L22 13.8",
      },
    ],
    [
      "path",
      {
        d: "M2 16l6 6",
      },
    ],
    [
      "circle",
      {
        cx: "16",
        cy: "6",
        r: "4",
      },
    ],
  ],
  history: [
    [
      "path",
      {
        d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
      },
    ],
    [
      "path",
      {
        d: "M3 3v5h5",
      },
    ],
    [
      "path",
      {
        d: "M12 7v5l4 2",
      },
    ],
  ],
  "id-card": [
    [
      "rect",
      {
        x: "3",
        y: "5",
        width: "18",
        height: "14",
        rx: "2",
      },
    ],
    [
      "circle",
      {
        cx: "8",
        cy: "10",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M6 15c.7-1.3 1.7-2 3-2s2.3.7 3 2M14 9h4M14 13h4",
      },
    ],
  ],
  inbox: [
    [
      "polyline",
      {
        points: "22 12 16 12 14 15 10 15 8 12 2 12",
      },
    ],
    [
      "path",
      {
        d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      },
    ],
  ],
  info: [
    [
      "path",
      {
        d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
      },
    ],
    [
      "path",
      {
        d: "M12 11v6",
      },
    ],
    [
      "path",
      {
        d: "M12 7h.01",
      },
    ],
  ],
  key: [
    [
      "circle",
      {
        cx: "7.5",
        cy: "15.5",
        r: "5.5",
      },
    ],
    [
      "path",
      {
        d: "m21 2-9.6 9.6M15 6l3 3M18 3l3 3",
      },
    ],
  ],
  "key-round": [
    [
      "circle",
      {
        cx: "7.5",
        cy: "15.5",
        r: "5.5",
      },
    ],
    [
      "path",
      {
        d: "m21 2-9.6 9.6M15 6l3 3M18 3l3 3",
      },
    ],
  ],
  landmark: [
    [
      "path",
      {
        d: "m3 10 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18",
      },
    ],
  ],
  "layout-dashboard": [
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "7",
        height: "7",
      },
    ],
    [
      "rect",
      {
        x: "14",
        y: "3",
        width: "7",
        height: "7",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "14",
        width: "7",
        height: "7",
      },
    ],
    [
      "rect",
      {
        x: "14",
        y: "14",
        width: "7",
        height: "7",
      },
    ],
  ],
  left: [
    [
      "path",
      {
        d: "m15 18-6-6 6-6",
      },
    ],
  ],
  "line-chart": [
    [
      "path",
      {
        d: "M3 3v18h18",
      },
    ],
    [
      "path",
      {
        d: "m7 16 4-5 4 3 5-7",
      },
    ],
  ],
  list: [
    [
      "path",
      {
        d: "M3 5h.01",
      },
    ],
    [
      "path",
      {
        d: "M3 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M3 19h.01",
      },
    ],
    [
      "path",
      {
        d: "M8 5h13",
      },
    ],
    [
      "path",
      {
        d: "M8 12h13",
      },
    ],
    [
      "path",
      {
        d: "M8 19h13",
      },
    ],
  ],
  "list-checks": [
    [
      "path",
      {
        d: "m3 5 2 2 4-4M3 12l2 2 4-4M3 19l2 2 4-4M13 6h8M13 13h8M13 20h8",
      },
    ],
  ],
  "loader-circle": [
    [
      "path",
      {
        d: "M21 12a9 9 0 1 1-6.219-8.56",
      },
    ],
  ],
  loading: [
    [
      "path",
      {
        d: "M21 12a9 9 0 1 1-9-9",
      },
    ],
  ],
  "lock-keyhole": [
    [
      "circle",
      {
        cx: "12",
        cy: "16",
        r: "1",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "10",
        width: "18",
        height: "12",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 10V7a5 5 0 0 1 10 0v3",
      },
    ],
  ],
  logout: [
    [
      "path",
      {
        d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
      },
    ],
    [
      "path",
      {
        d: "m16 17 5-5-5-5M21 12H9",
      },
    ],
  ],
  megaphone: [
    [
      "path",
      {
        d: "m3 11 15-5v12L3 13zM11.6 15.5 13 21H8l-1.5-6",
      },
    ],
  ],
  menu: [
    [
      "path",
      {
        d: "M4 6h16M4 12h16M4 18h16",
      },
    ],
  ],
  "monitor-smartphone": [
    [
      "path",
      {
        d: "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",
      },
    ],
    [
      "path",
      {
        d: "M10 19v-3.96 3.15",
      },
    ],
    [
      "path",
      {
        d: "M7 19h5",
      },
    ],
    [
      "rect",
      {
        width: "6",
        height: "10",
        x: "16",
        y: "12",
        rx: "2",
      },
    ],
  ],
  moon: [
    [
      "path",
      {
        d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      },
    ],
  ],
  "mouse-pointer-click": [
    [
      "path",
      {
        d: "M14 4.1 12 6",
      },
    ],
    [
      "path",
      {
        d: "m5.1 8-2.9-.8",
      },
    ],
    [
      "path",
      {
        d: "m6 12-1.9 2",
      },
    ],
    [
      "path",
      {
        d: "M7.2 2.2 8 5.1",
      },
    ],
    [
      "path",
      {
        d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
      },
    ],
  ],
  network: [
    [
      "circle",
      {
        cx: "12",
        cy: "5",
        r: "3",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "19",
        r: "3",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "19",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M12 8v4M5 16v-4h14v4",
      },
    ],
  ],
  panel: [
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M15 3v18M8 9l3 3-3 3",
      },
    ],
  ],
  "panel-left-close": [
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 3v18",
      },
    ],
    [
      "path",
      {
        d: "M14.5 8.5 11 12l3.5 3.5",
      },
    ],
  ],
  "panel-right-open": [
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M17 3v18",
      },
    ],
    [
      "path",
      {
        d: "M9.5 8.5 13 12l-3.5 3.5",
      },
    ],
  ],
  "party-popper": [
    [
      "path",
      {
        d: "M5.8 11.3 2 22l10.7-3.8",
      },
    ],
    [
      "path",
      {
        d: "m4 3 1.5 1.5M14 2l-1 2.5M21 9l-2.5 1M11 7l6 6",
      },
    ],
    [
      "path",
      {
        d: "M16 3c3 1 5 3 5 6",
      },
    ],
  ],
  plug: [
    [
      "path",
      {
        d: "M12 22v-5M9 8V2M15 8V2M18 8v4a6 6 0 0 1-12 0V8z",
      },
    ],
  ],
  "plug-zap": [
    [
      "path",
      {
        d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",
      },
    ],
    [
      "path",
      {
        d: "m2 22 3-3",
      },
    ],
    [
      "path",
      {
        d: "M7.5 13.5 10 11",
      },
    ],
    [
      "path",
      {
        d: "M10.5 16.5 13 14",
      },
    ],
    [
      "path",
      {
        d: "m18 3-4 4h6l-4 4",
      },
    ],
  ],
  plus: [
    [
      "path",
      {
        d: "M5 12h14",
      },
    ],
    [
      "path",
      {
        d: "M12 5v14",
      },
    ],
  ],
  "radio-tower": [
    [
      "path",
      {
        d: "M4.9 16.1C1 12.2 1 5.8 4.9 1.9",
      },
    ],
    [
      "path",
      {
        d: "M7.8 4.7a6.14 6.14 0 0 0-.8 7.5",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "9",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M16.2 4.8c2 2 2.26 5.11.8 7.47",
      },
    ],
    [
      "path",
      {
        d: "M19.1 1.9a9.96 9.96 0 0 1 0 14.1",
      },
    ],
    [
      "path",
      {
        d: "M9.5 18h5",
      },
    ],
    [
      "path",
      {
        d: "m8 22 4-11 4 11",
      },
    ],
  ],
  "receipt-text": [
    [
      "path",
      {
        d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z",
      },
    ],
    [
      "path",
      {
        d: "M8 8h8M8 12h8M8 16h5",
      },
    ],
  ],
  refresh: [
    [
      "path",
      {
        d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
      },
    ],
    [
      "path",
      {
        d: "M21 3v5h-5",
      },
    ],
    [
      "path",
      {
        d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
      },
    ],
    [
      "path",
      {
        d: "M8 16H3v5",
      },
    ],
  ],
  "refresh-cw": [
    [
      "path",
      {
        d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
      },
    ],
    [
      "path",
      {
        d: "M21 3v5h-5",
      },
    ],
    [
      "path",
      {
        d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
      },
    ],
    [
      "path",
      {
        d: "M8 16H3v5",
      },
    ],
  ],
  right: [
    [
      "path",
      {
        d: "m9 18 6-6-6-6",
      },
    ],
  ],
  rocket: [
    [
      "path",
      {
        d: "M4.5 16.5c-1.5 1.3-2 4-2 4s2.7-.5 4-2M15 9l-6 6M14 4c3-2 6-2 6-2s0 3-2 6l-6 6-4-4z",
      },
    ],
    [
      "path",
      {
        d: "M9 5H5l-3 3 6 2M19 15v4l-3 3-2-6",
      },
    ],
  ],
  rotate: [
    [
      "path",
      {
        d: "M3 12a9 9 0 1 0 3-6.7L3 8",
      },
    ],
    [
      "path",
      {
        d: "M3 3v5h5",
      },
    ],
  ],
  "rotate-ccw": [
    [
      "path",
      {
        d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
      },
    ],
    [
      "path",
      {
        d: "M3 3v5h5",
      },
    ],
  ],
  "rotate-cw": [
    [
      "path",
      {
        d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",
      },
    ],
    [
      "path",
      {
        d: "M21 3v5h-5",
      },
    ],
  ],
  route: [
    [
      "circle",
      {
        cx: "6",
        cy: "19",
        r: "3",
      },
    ],
    [
      "circle",
      {
        cx: "18",
        cy: "5",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M9 19h2a4 4 0 0 0 4-4V9",
      },
    ],
  ],
  save: [
    [
      "path",
      {
        d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      },
    ],
    [
      "path",
      {
        d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
      },
    ],
    [
      "path",
      {
        d: "M7 3v4a1 1 0 0 0 1 1h7",
      },
    ],
  ],
  scale: [
    [
      "path",
      {
        d: "m16 16 3-8 3 8a3 3 0 0 1-6 0ZM2 16l3-8 3 8a3 3 0 0 1-6 0ZM12 3v18M3 7h18",
      },
    ],
  ],
  "scroll-text": [
    [
      "path",
      {
        d: "M15 12h-5",
      },
    ],
    [
      "path",
      {
        d: "M15 8h-5",
      },
    ],
    [
      "path",
      {
        d: "M19 17V5a2 2 0 0 0-2-2H4",
      },
    ],
    [
      "path",
      {
        d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
      },
    ],
  ],
  search: [
    [
      "circle",
      {
        cx: "11",
        cy: "11",
        r: "8",
      },
    ],
    [
      "path",
      {
        d: "m21 21-4.3-4.3",
      },
    ],
  ],
  "search-check": [
    [
      "path",
      {
        d: "m8 11 2 2 4-4",
      },
    ],
    [
      "circle",
      {
        cx: "11",
        cy: "11",
        r: "8",
      },
    ],
    [
      "path",
      {
        d: "m21 21-4.3-4.3",
      },
    ],
  ],
  "search-x": [
    [
      "path",
      {
        d: "m13.5 8.5-5 5",
      },
    ],
    [
      "path",
      {
        d: "m8.5 8.5 5 5",
      },
    ],
    [
      "circle",
      {
        cx: "11",
        cy: "11",
        r: "8",
      },
    ],
    [
      "path",
      {
        d: "m21 21-4.3-4.3",
      },
    ],
  ],
  server: [
    [
      "rect",
      {
        x: "3",
        y: "4",
        width: "18",
        height: "6",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "14",
        width: "18",
        height: "6",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 7h.01M7 17h.01",
      },
    ],
  ],
  settings: [
    [
      "path",
      {
        d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "3",
      },
    ],
  ],
  "settings-2": [
    [
      "path",
      {
        d: "M20 7h-9M14 17H5",
      },
    ],
    [
      "circle",
      {
        cx: "17",
        cy: "17",
        r: "3",
      },
    ],
    [
      "circle",
      {
        cx: "7",
        cy: "7",
        r: "3",
      },
    ],
  ],
  "shield-alert": [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z",
      },
    ],
    [
      "path",
      {
        d: "M12 8v4M12 16h.01",
      },
    ],
  ],
  "shield-check": [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z",
      },
    ],
    [
      "path",
      {
        d: "m9 12 2 2 4-4",
      },
    ],
  ],
  "sliders-horizontal": [
    [
      "path",
      {
        d: "M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "4",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "10",
        cy: "12",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "14",
        cy: "20",
        r: "2",
      },
    ],
  ],
  smartphone: [
    [
      "rect",
      {
        width: "14",
        height: "20",
        x: "5",
        y: "2",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "M12 18h.01",
      },
    ],
  ],
  "square-pen": [
    [
      "path",
      {
        d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
      },
    ],
    [
      "path",
      {
        d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      },
    ],
  ],
  store: [
    [
      "path",
      {
        d: "M3 9l2-6h14l2 6M5 13v8h14v-8M9 21v-6h6v6",
      },
    ],
    [
      "path",
      {
        d: "M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0",
      },
    ],
  ],
  sun: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "4",
      },
    ],
    [
      "path",
      {
        d: "M12 2v2",
      },
    ],
    [
      "path",
      {
        d: "M12 20v2",
      },
    ],
    [
      "path",
      {
        d: "m4.93 4.93 1.41 1.41",
      },
    ],
    [
      "path",
      {
        d: "m17.66 17.66 1.41 1.41",
      },
    ],
    [
      "path",
      {
        d: "M2 12h2",
      },
    ],
    [
      "path",
      {
        d: "M20 12h2",
      },
    ],
    [
      "path",
      {
        d: "m6.34 17.66-1.41 1.41",
      },
    ],
    [
      "path",
      {
        d: "m19.07 4.93-1.41 1.41",
      },
    ],
  ],
  tag: [
    [
      "path",
      {
        d: "M20 12 12 20 4 12V4h8z",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "9",
        r: "1",
      },
    ],
  ],
  terminal: [
    [
      "path",
      {
        d: "M12 19h8",
      },
    ],
    [
      "path",
      {
        d: "m4 17 6-6-6-6",
      },
    ],
  ],
  "trash-2": [
    [
      "path",
      {
        d: "M10 11v6",
      },
    ],
    [
      "path",
      {
        d: "M14 11v6",
      },
    ],
    [
      "path",
      {
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
      },
    ],
    [
      "path",
      {
        d: "M3 6h18",
      },
    ],
    [
      "path",
      {
        d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
      },
    ],
  ],
  "tree-branch": [
    [
      "path",
      {
        d: "M5 2v10a7 7 0 0 0 7 7h8",
      },
    ],
  ],
  "triangle-alert": [
    [
      "path",
      {
        d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      },
    ],
    [
      "path",
      {
        d: "M12 9v4",
      },
    ],
    [
      "path",
      {
        d: "M12 17h.01",
      },
    ],
  ],
  upload: [
    [
      "path",
      {
        d: "M12 3v12",
      },
    ],
    [
      "path",
      {
        d: "m17 8-5-5-5 5",
      },
    ],
    [
      "path",
      {
        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
      },
    ],
  ],
  user: [
    [
      "circle",
      {
        cx: "12",
        cy: "8",
        r: "4",
      },
    ],
    [
      "path",
      {
        d: "M4 21a8 8 0 0 1 16 0",
      },
    ],
  ],
  "user-plus": [
    [
      "path",
      {
        d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "7",
        r: "4",
      },
    ],
    [
      "line",
      {
        x1: "19",
        x2: "19",
        y1: "8",
        y2: "14",
      },
    ],
    [
      "line",
      {
        x1: "22",
        x2: "16",
        y1: "11",
        y2: "11",
      },
    ],
  ],
  "user-round": [
    [
      "circle",
      {
        cx: "12",
        cy: "8",
        r: "5",
      },
    ],
    [
      "path",
      {
        d: "M20 21a8 8 0 0 0-16 0",
      },
    ],
  ],
  users: [
    [
      "path",
      {
        d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "7",
        r: "4",
      },
    ],
    [
      "path",
      {
        d: "M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
      },
    ],
  ],
  "users-round": [
    [
      "path",
      {
        d: "M18 21a8 8 0 0 0-16 0",
      },
    ],
    [
      "circle",
      {
        cx: "10",
        cy: "8",
        r: "5",
      },
    ],
    [
      "path",
      {
        d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",
      },
    ],
  ],
  "wallet-cards": [
    [
      "rect",
      {
        x: "2",
        y: "5",
        width: "20",
        height: "14",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M16 13h4M2 10h20",
      },
    ],
  ],
  webhook: [
    [
      "path",
      {
        d: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2",
      },
    ],
    [
      "path",
      {
        d: "m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06",
      },
    ],
    [
      "path",
      {
        d: "m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8",
      },
    ],
  ],
  x: [
    [
      "path",
      {
        d: "M18 6 6 18",
      },
    ],
    [
      "path",
      {
        d: "m6 6 12 12",
      },
    ],
  ],
} as const satisfies Record<string, readonly IconNode[]>;

export type IconName = keyof typeof iconDefinitions;

export const iconNames = Object.keys(iconDefinitions) as IconName[];
