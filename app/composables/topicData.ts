import type { Topic } from "~/types";

export const useTopicData = (topic: string | string[] | undefined) => {
  if (!topic || Array.isArray(topic)) {
    throw new Error(
      "Le nom du cours passé en URL n'est pas valide : " +
        JSON.stringify(topic),
    );
  }

  const data = useData();
  const decoded = decodeURI(topic);

  if (!(decoded in data.value)) {
    throw new Error(
      "Le cours demandé n'existe pas dans la base de données : " + decoded,
    );
  }

  return data.value[decoded as Topic];
};
