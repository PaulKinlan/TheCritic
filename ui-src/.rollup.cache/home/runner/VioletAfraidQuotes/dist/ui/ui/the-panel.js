export class ThePanel extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: "open" });
        root.innerHTML = `
	  <style>
		:host {
		  display: block;
      height: min-content;
      box-shadow: var(--shadow-1);
      padding: var(--size-2);
      border-radius: var(--radius-2);
      background-color: var(--purple-11);
		}

		div.config {
			display: flex;
			flex-direction: column;
      gap: var(--size-1);
		}
	  </style>
	  <slot name="critics"></slot>
	  <div class="config">
		<input type="text" id="name" placeholder="The name of the persona" />
		<textarea type="text" id="persona" placeholder="Describe the persona you this agent to take on"></textarea>
		<button id="add">Add Critic</button>
	  </div>
	`;
        root.querySelector("#add")?.addEventListener("click", () => {
            const nameEl = root.querySelector("#name");
            const personaEl = root.querySelector("#persona");
            this.addCritic(nameEl.value, personaEl.value);
            const critiqueEvent = new CustomEvent("criticadded", {
                detail: {
                    name: nameEl.value,
                    persona: personaEl.value,
                },
                composed: true,
            });
            this.dispatchEvent(critiqueEvent);
            nameEl.value = "";
            personaEl.value = "";
        });
    }
    get criticElements() {
        return this.querySelectorAll("a-critic");
    }
    get critics() {
        const els = this.querySelectorAll("a-critic");
        return Array.from(els).map((el) => {
            return {
                id: el.id,
                name: el.name,
                persona: el.persona,
            };
        });
    }
    set critics(value) {
        for (const el of value) {
            this.addCritic(el.name, el.persona, el.id);
        }
    }
    addCritic(name, persona, id) {
        const criticElement = document.createElement("a-critic");
        criticElement.slot = "critics";
        criticElement.setAttribute("name", name);
        criticElement.setAttribute("persona", persona);
        criticElement.setAttribute("id", id == undefined ? crypto.randomUUID() : id);
        this.appendChild(criticElement);
    }
}
//# sourceMappingURL=the-panel.js.map