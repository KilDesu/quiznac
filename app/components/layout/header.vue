<script lang="ts" setup>
  import { useTheme } from "#imports";

  const isDrawerOpen = defineModel<boolean>();

  const themeIcon = computed(() =>
    useTheme.current === "system"
      ? "sym_r_brightness_auto"
      : `sym_r_${useTheme.current}_mode`,
  );
  const logo = computed(
    () => `img:/logo-${useTheme.isDark ? "dark" : "light"}.svg`,
  );
</script>

<template>
  <QHeader bordered>
    <QToolbar class="surface-container">
      <QBtn
        flat
        round
        icon="sym_r_menu"
        @click="isDrawerOpen = !isDrawerOpen"
      />

      <QSpace />

      <QBtn flat to="/">
        <QIcon size="xl" :name="logo" />
        <QToolbarTitle class="text-weight-bold"> QUIZNAC </QToolbarTitle>
      </QBtn>

      <QSpace />

      <QBtn flat round :icon="themeIcon">
        <QMenu cover auto-close class="surface-container">
          <QList>
            <QItem
              clickable
              :active="useTheme.current === 'system'"
              @click="useTheme.update('system')"
            >
              <QItemSection avatar style="min-width: unset">
                <QIcon name="sym_r_brightness_auto" />
              </QItemSection>
              <QItemSection> Système </QItemSection>
            </QItem>
            <QItem
              clickable
              :active="useTheme.current === 'light'"
              @click="useTheme.update('light')"
            >
              <QItemSection avatar style="min-width: unset">
                <QIcon name="sym_r_light_mode" />
              </QItemSection>
              <QItemSection> Clair </QItemSection>
            </QItem>
            <QItem
              clickable
              :active="useTheme.current === 'dark'"
              @click="useTheme.update('dark')"
            >
              <QItemSection avatar style="min-width: unset">
                <QIcon name="sym_r_dark_mode" />
              </QItemSection>
              <QItemSection> Sombre </QItemSection>
            </QItem>
          </QList>
        </QMenu>
      </QBtn>
    </QToolbar>
  </QHeader>
</template>
