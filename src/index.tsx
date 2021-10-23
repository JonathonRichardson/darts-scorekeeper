import { render } from "react-dom";
import * as React from "react"

(window as any).$RefreshReg$ = () => {};
(window as any).$RefreshSig$ = () => () => {};


import {App} from "./App";

const rootElement = document.createElement('div');
document.body.append(rootElement);

render(<App />, rootElement);
