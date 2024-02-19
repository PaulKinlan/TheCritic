/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Board,
  BoardRunner,
  asRuntimeKit,
  board,
  BreadboardCapability,
  Schema,
} from "@google-labs/breadboard";
import {
  HTTPClientTransport,
  ProxyClient,
} from "@google-labs/breadboard/remote";
import { Core, core } from "@google-labs/core-kit";
import Critic from "./critic.js";

import { Probe, ProbeMessage } from "@google-labs/breadboard";
import Template, { templates } from "@google-labs/template-kit";

export type VerboseLoggingCallback = (message: ProbeMessage) => Promise<void>;

export type CriticResponse = {
  id: string;
  name: string;
  completion: string;
};

class VerboseLoggingProbe extends EventTarget implements Probe {
  #callback: VerboseLoggingCallback;

  constructor(callback: VerboseLoggingCallback) {
    super();
    this.#callback = callback;
  }

  async report(message: ProbeMessage): Promise<void> {
    return this.#callback(message);
  }
}

export class Panel {
  #critics: Record<string, { id: string; name: string; persona: string }> = {};

  get board() {
    return board(({ list, criticBoard }) => {
      list
        .isArray()
        .title("The list of critics")
        .description("The list of critics");
      criticBoard.title("The Critic Board").description("The Critic Board");
      return list.as("list").to(core.map({ board: criticBoard }));
    }).serialize({ title: "The Critic Board" });
  }

  constructor() {}

  addCritic(name: string, persona: string, id?: string) {
    if (id == null || id == undefined) {
      id = crypto.randomUUID();
    }
    // Store the critic state.
    this.#critics[id] = { id, name, persona };

    return { id, name, persona };
  }

  async critique(text: string): Promise<CriticResponse[]> {
    const board = await Board.fromGraphDescriptor(await this.board);
    const criticBoard = await Board.fromGraphDescriptor(Critic);

    const probe = new VerboseLoggingProbe(async (data) => console.log(data));

    // We need to run things on the server.
    const proxy = window.location.toString(); // current server is proxy
    const client = new ProxyClient(new HTTPClientTransport(proxy));

    const kits = [asRuntimeKit(Core), asRuntimeKit(Template)];
    // Claude Kit is unable to run on the client so it has to be proxied.
    kits.unshift(client.createProxyKit(["generateCompletion", "secrets"]));

    const criticList = Object.values(this.#critics).map((critic) => {
      return { article: text, ...critic };
    });

    for await (const stop of board.run({ kits, probe })) {
      if (stop.type === "input") {
        if (
          (stop.inputArguments.schema as Schema)?.required.indexOf(
            "criticBoard",
          ) > -1
        ) {
          stop.inputs = {
            criticBoard: {
              kind: "board",
              board: criticBoard,
            } as BreadboardCapability,
            list: criticList,
          };
        }
      } else if (stop.type === "output") {
        // Because we are using core.map - we can get the output and return
        return stop.outputs.list as unknown as CriticResponse[];
      }
    }
  }
}
