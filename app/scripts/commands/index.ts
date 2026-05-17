import { genCommandsList } from "./genCommandsList";

// Run the function
(async () => {
  try {
    await genCommandsList();
  } catch (error) {
    console.error("Error generating command list:", error);
  }
})();
