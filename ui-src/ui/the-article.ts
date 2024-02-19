export class TheArticle extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `<style>
		:host {
		  display: flex;
		  flex-direction: column;
      gap: var(--size-1);
		}

		textarea {
			flex:1;
		}
	  </style>
	  <textarea placeholder="The Article that you want critiqued"></textarea>
	  <button id="critique">Critique</button>
	`;

    const critique = root.getElementById("critique");
    critique?.addEventListener("click", () => {
      const textarea = root.querySelector("textarea");
      const critiqueEvent = new CustomEvent("critique", {
        detail: {
          text: textarea?.value,
        },
        composed: true,
      });
      this.dispatchEvent(critiqueEvent);
    });
  }
}
