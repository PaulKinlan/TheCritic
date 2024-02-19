# "Google Labs Breadboard" Kit for the Claude API

The Claude Breadboard Kit is a collection of [Breadboard](https://github.com/google/labs-prototypes/tree/main/seeds/breadboard) nodes that are helpful for building LLM-based (Generative AI) applications using the Claude API.

## Installing

Claude Breadboard Kit requires Node version >=v19.0.0. To install:

```sh
npm install @paulkinlan/claude-breadboard-kit
```

## Node Types

Here are all node handlers that are included in the Claude Breadboard Kit

### The `generateCompletion` node

This is an [Claude API](https://docs.anthropic.com/) text completion node. To produce useful output, the node needs an `CLAUDE_API_KEY` input and the `text` input and the `model` to run it against (although it defaults to `claude-2`).

#### Example:

Given this input:

```json
{
  "CLAUDE_API_KEY": "<your API key>",
  "text": "How much wood can a woodchuck chuck?"
}
```

The node will produce this output:

```json
{
  "completion": " The exact amount a woodchuck can chuck is unknown, but it is believed that they can chuck about 700 pounds of wood in a day."
}
```

#### Inputs:

- `CLAUDE_API_KEY` required, must contain the Claude API key.
- `text` required, sent as the prompt for the completion.
- `model` the name of the model Claude that you want to use.

#### Outputs:

- `completion` - result of the Claude API text completion.
