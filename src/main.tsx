import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import muLogo from "./assets/mu-logo.jpg";
import "./styles/global.css";

function setSiteIcons(iconUrl: string) {
  const ensureLink = (rel: string) => {
    let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      document.head.appendChild(link);
    }

    link.type = "image/jpeg";
    link.href = iconUrl;
  };

  ensureLink("icon");
  ensureLink("shortcut icon");
  ensureLink("apple-touch-icon");
}

setSiteIcons(muLogo);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
