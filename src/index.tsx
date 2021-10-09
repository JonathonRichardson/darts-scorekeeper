import { render } from "react-dom";
import * as React from "react"

import {App} from "./App";

const rootElement = document.createElement('div');
document.body.append(rootElement);

render(<App />, rootElement);
