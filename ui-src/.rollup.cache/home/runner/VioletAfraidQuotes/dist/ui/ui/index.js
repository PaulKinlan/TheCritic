/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Panel } from "../boards/the-panel.js";
import { ACritic } from "./a-critic.js";
import { TheArticle } from "./the-article.js";
import { ThePanel } from "./the-panel.js";
import { marked } from "marked";
import DOMPurify from "dompurify";
const panel = new Panel();
export const register = () => {
    customElements.define("a-critic", ACritic);
    customElements.define("the-article", TheArticle);
    customElements.define("the-panel", ThePanel);
};
export const get = () => {
    return document.querySelector("#app");
};
// TODO: add a UI Controller that will handle UI events and udpate the board.
export const load = async () => {
    const app = get();
    if (app == undefined)
        return;
    const criticString = localStorage.getItem("critics");
    let critics = [];
    if (criticString != null && criticString != "") {
        critics = JSON.parse(criticString);
    }
    const panelElement = app.getElementsByTagName("the-panel")[0];
    for (const critic of critics) {
        const { name, persona, id } = critic;
        panel.addCritic(name, persona, id);
    }
    panelElement.critics = critics;
    panelElement.addEventListener("criticadded", (async (e) => {
        const { name, persona, id } = e.detail;
        panel.addCritic(name, persona, id);
        localStorage.setItem("critics", JSON.stringify(panelElement.critics));
    }));
};
export const run = async () => {
    const app = get();
    if (app == undefined)
        return;
    const articleElement = app.getElementsByTagName("the-article")[0];
    if (articleElement) {
        articleElement.addEventListener("critique", (async (e) => {
            const article = e.detail.text;
            const critiques = await panel.critique(article);
            for await (const critique of critiques) {
                console.log(`## ${critique.name}\n`);
                console.log(`${critique.completion}\n`);
                const id = critique.id;
                const el = document.querySelector(`a-critic[id="${id}"]`);
                if (el) {
                    const responseEl = document.createElement("div");
                    responseEl.innerHTML = DOMPurify.sanitize(await marked(critique.completion));
                    responseEl.slot = "response";
                    el.appendChild(responseEl);
                }
            }
        }));
    }
};
//# sourceMappingURL=index.js.map