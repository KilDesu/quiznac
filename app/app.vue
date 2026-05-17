<script lang="ts" setup>
  import { initializeApp } from "firebase/app";
  import { type Firestore, initializeFirestore } from "firebase/firestore";

  const error = ref<string | null>(null);
  const db = ref<Firestore | null>(null);

  const allTopicsWithData = ref<Partial<Data>>({});

  provide("db", db);
  provide("data", allTopicsWithData);

  onBeforeMount(async () => {
    await useTheme.init();

    const apiKey = await run("get_firebase_key");

    const firebaseConfig = {
      apiKey,
      authDomain: "basic-enac.firebaseapp.com",
      projectId: "basic-enac",
      storageBucket: "basic-enac.firebasestorage.app",
      messagingSenderId: "27109400850",
      appId: "1:27109400850:web:4e1892786dd87c738713cb",
    };

    const firebaseApp = initializeApp(firebaseConfig);

    db.value = initializeFirestore(firebaseApp, {
      ignoreUndefinedProperties: true,
    });

    allTopicsWithData.value = await getAllQuestions(db.value);
    console.log(allTopicsWithData.value);
  });

  onErrorCaptured((err) => {
    console.error({ err });

    if (err instanceof Error) {
      error.value = err.message;
    }

    return false;
  });
</script>

<template>
  <NuxtLayout>
    <NuxtPage />

    <AppError v-model="error" />
  </NuxtLayout>
</template>
