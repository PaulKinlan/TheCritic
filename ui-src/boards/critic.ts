/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { board, base, code } from "@google-labs/breadboard";
import { core } from "@google-labs/core-kit";
import { templates } from "@google-labs/template-kit";
import { claude } from "@paulkinlan/claude-breadboard-kit";

const argMaker = code(({ item }) => {
  const { name, id, article, persona } = item as {
    name: string;
    id: string;
    article: string;
    persona: string;
  };
  return { name, id, article, persona };
});

export default await board(({ item }) => {
  const { name, id, article, persona } = argMaker({ $id: "makeArgs", item });
  // name.isString().title("Critic Name").description("The name of the Critic");
  // id.isString().title("id").description("The id of the critique being created");
  // article
  //   .isString()
  //   .title("articleToCritique")
  //   .description("The article that is being critiqued");
  // persona
  //   .isString()
  //   .title("Critic Persona")
  //   .description("The Persona of the Critic");

  const criticOutput = base.output({});

  const criticPrompt = templates.promptTemplate({
    template: `Your name is {{name}} and you are a {{persona}}.

  You will create a markdown bulleted critique of the following input:

  {{article}}

  Critique:
  `,
    name,
    id,
    article,
    persona,
  });

  name.to(criticOutput);
  id.to(criticOutput);
  persona.to(criticOutput);

  return core
    .secrets({ keys: ["CLAUDE_API_KEY"] })
    .to(
      claude.generateCompletion({
        model: "claude-2.1",
        text: criticPrompt.prompt,
      }),
    )
    .completion.to(criticOutput);
}).serialize({
  title: "The Critic",
  description: "The Critic Board",
  version: "0.0.1",
});
