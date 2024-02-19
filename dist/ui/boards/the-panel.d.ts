/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { ProbeMessage } from "@google-labs/breadboard";
export type VerboseLoggingCallback = (message: ProbeMessage) => Promise<void>;
export type CriticResponse = {
    id: string;
    name: string;
    completion: string;
};
export declare class Panel {
    #private;
    get board(): import("@google-labs/breadboard").GraphDescriptor | Promise<import("@google-labs/breadboard").GraphDescriptor>;
    constructor();
    addCritic(name: string, persona: string, id?: string): {
        id: string;
        name: string;
        persona: string;
    };
    critique(text: string): Promise<CriticResponse[]>;
}
//# sourceMappingURL=the-panel.d.ts.map