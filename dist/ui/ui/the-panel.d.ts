export declare class ThePanel extends HTMLElement {
    constructor();
    get criticElements(): NodeListOf<Element>;
    get critics(): {
        name: string;
        persona: string;
        id: string;
    }[];
    set critics(value: {
        name: string;
        persona: string;
        id: string;
    }[]);
    addCritic(name: string, persona: string, id?: string): void;
}
//# sourceMappingURL=the-panel.d.ts.map