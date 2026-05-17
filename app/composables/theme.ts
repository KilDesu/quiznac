import type { ThemePreference } from "~/bindings";

function Theme() {
  const current = ref<ThemePreference>("system");
  let cachedPreference: ThemePreference | null = null;

  async function init() {
    // Remove unused class added by Quasar
    document.body.classList.remove("body--light");

    const userPreference = await run("get_theme");

    cachedPreference = userPreference;
    update(userPreference);
  }

  function isDark() {
    return (
      current.value === "dark" ||
      (current.value === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }

  async function update(theme: ThemePreference) {
    current.value = theme;

    const cls = isDark() ? "dark" : "light";
    const otherCls = isDark() ? "light" : "dark";

    document.body.classList.add(cls);
    document.body.classList.remove(otherCls);

    if (cachedPreference === theme) {
      return;
    }

    await run("set_theme", { theme });
  }

  return {
    init,
    update,
    get isDark() {
      return isDark();
    },
    get current() {
      return current.value;
    },
  };
}

export const useTheme = Theme();
