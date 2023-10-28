import { render } from "react-dom";
import * as React from "react";

(window as any).$RefreshReg$ = () => {};
(window as any).$RefreshSig$ = () => () => {};

import { App } from "./App";

const rootElement = document.createElement("div");
rootElement.classList.add("app-root");

let configureViewport = () => {
    let mobileDescrepency = visualViewport.height;
    document.documentElement.style.setProperty(
        "--viewport-diff",
        `${mobileDescrepency}px`
    );
};

window.addEventListener("resize", configureViewport);
window.addEventListener("orientationchange", configureViewport);
configureViewport();

document.body.append(rootElement);

const viewport = {
    height: undefined, //window.visualViewport.height,
    width: undefined, //window.visualViewport.width,
};

render(<App viewport={viewport} />, rootElement);
