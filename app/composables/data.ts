export const useData = () => {
  const data = inject<Ref<Partial<Data>>>("data");

  if (!data) {
    throw new Error(
      "Les données avec les questions n'ont pus être injectées dans le composant.",
    );
  }

  return data;
};
