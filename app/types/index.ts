import type { Question } from "~/bindings";
import type { Topic } from "./subtopic";

export * from "./subtopic";

declare global {
  export type UnionFromArray<T extends Readonly<Array<unknown>>> = T[number];

  type TopicData = Record<string, Question[]>;
  type Data = Record<Topic, TopicData>;
}
