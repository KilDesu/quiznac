<script lang="ts" setup>
  const isDrawerOpen = ref(true);
</script>

<template>
  <QLayout view="hHh Lpr lFf">
    <LayoutHeader v-model="isDrawerOpen" />

    <LayoutDrawer v-model="isDrawerOpen" />

    <QPageContainer>
      <QPage padding class="q-mx-auto" style="max-width: 75rem">
        <slot />
      </QPage>
    </QPageContainer>
  </QLayout>
</template>
