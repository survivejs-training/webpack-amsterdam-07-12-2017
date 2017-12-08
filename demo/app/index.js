import "react";

import "./main.css";
import component from "./component";
import { bake } from "./shake";

if (process.env.NODE_ENV === "development") {
  console.log("bar");
}

bake();

document.body.appendChild(component());
