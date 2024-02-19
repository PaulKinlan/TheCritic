import BB from "@google-labs/breadboard/remote"

declare module "@google-labs/breadboard/remote" {
  export * from BB;
  /**
   * Minimal interface in the shape of express.js's response object.
   */
  export type ServerResponse = {
    header(field: string, value: string): unknown;
    write: (chunk: unknown) => boolean;
    end: () => unknown;
  };
}