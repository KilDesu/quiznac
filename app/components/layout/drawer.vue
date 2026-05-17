<script lang="ts" setup>
  const isDrawerOpen = defineModel<boolean>();
  // const isUpdateAvailable = ref(false);

  const data = useData();

  const topics = computed(() => Object.keys(data.value));
</script>

<template>
  <QDrawer
    :model-value="isDrawerOpen"
    side="left"
    :width="200"
    :breakpoint="900"
    persistent
    class="surface-container flex column justify-between"
  >
    <QList class="scroll col text-weight-bold">
      <QItem to="/">
        <QItemSection avatar>
          <AppIcon name="home" />
        </QItemSection>
        <QItemSection> Accueil </QItemSection>
      </QItem>

      <QItem to="/configuration">
        <QItemSection avatar>
          <AppIcon name="settings" />
        </QItemSection>
        <QItemSection> Configuration </QItemSection>
      </QItem>

      <QSeparator />

      <QItem
        v-for="topic in topics"
        :key="topic"
        :to="`/review/${encodeURI(topic)}`"
      >
        <QItemSection avatar>
          <AppIcon name="chevron_right" />
        </QItemSection>
        <QItemSection> {{ topic }} </QItemSection>
      </QItem>
    </QList>
  </QDrawer>
</template>

<style>
  .q-drawer__content {
    box-shadow: var(--inner-shadow);
  }
</style>
