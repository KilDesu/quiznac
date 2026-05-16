<script lang="ts" setup>
  import fuz from "fuzzysort";

  import type { QSelectProps } from "quasar";
  import type { Question } from "~/bindings";
  import type { Subtopic, Topic } from "~/types";

  interface RevisionOptions {
    limitQuestions: boolean;
    subtopics: Subtopic<Topic>[];
    questionsCount: number;
    splitEvenly: boolean;
  }

  const route = useRoute();
  const options = ref<RevisionOptions>({
    subtopics: [],
    limitQuestions: true,
    questionsCount: 70,
    splitEvenly: true,
  });
  const subtopicsOptions = ref<Subtopic<Topic>[]>([]);
  const questions = ref<Question[]>([]);
  const readyToRevise = ref(false);

  const topicData = computed(() => useTopicData(route.params.topic));
  const allSubtopics = computed(() =>
    (Object.keys(topicData.value || {}) as Subtopic<Topic>[])
      .filter((subtopic) => topicData.value![subtopic]?.length)
      .toSorted((a, b) => a.localeCompare(b)),
  );

  watch(
    allSubtopics,
    (newVal) => {
      subtopicsOptions.value = newVal;
    },
    { immediate: true },
  );

  watch(
    options,
    (opts) => {
      if (!topicData.value) {
        return;
      }

      const result: Question[] = [];
      const selectedSubtopics = opts.subtopics.length
        ? opts.subtopics.filter(
            (subtopic) => topicData.value![subtopic]?.length,
          )
        : allSubtopics.value;

      if (!opts.limitQuestions) {
        for (const subtopic of selectedSubtopics) {
          const questionsForSubtopic = topicData.value[subtopic];

          if (!questionsForSubtopic) {
            continue;
          }

          result.push(...questionsForSubtopic);
        }

        questions.value = shuffle(
          result.map((q) => ({ ...q, answers: shuffle(q.answers) })),
        );
        return;
      }

      if (opts.splitEvenly) {
        const availablePools = selectedSubtopics
          .map((subtopic) => ({
            subtopic,
            questions: shuffle(topicData.value![subtopic] || []),
          }))
          .filter((pool) => pool.questions.length);

        // Shuffle pools to distribute remaining items randomly among tied lengths
        shuffle(availablePools);

        // Sort ascending by available questions so smaller chapters take what they can
        // and larger chapters make up the difference
        availablePools.sort((a, b) => a.questions.length - b.questions.length);

        let needed = opts.questionsCount;

        for (let i = 0; i < availablePools.length; i++) {
          const pool = availablePools[i]!;
          const remainingPoolsCount = availablePools.length - i;
          const fairShare = Math.ceil(needed / remainingPoolsCount);

          const toTake = Math.min(fairShare, pool.questions.length);
          result.push(...pool.questions.slice(0, toTake));
          needed -= toTake;

          if (needed <= 0) break;
        }
      } else {
        const allAvailable: Question[] = [];
        for (const subtopic of selectedSubtopics) {
          const questionsForSubtopic = topicData.value[subtopic];
          if (questionsForSubtopic) {
            allAvailable.push(...questionsForSubtopic);
          }
        }
        result.push(...shuffle(allAvailable).slice(0, opts.questionsCount));
      }

      questions.value = shuffle(
        result.map((q) => ({ ...q, answers: shuffle(q.answers) })),
      );
    },
    { deep: true, immediate: true },
  );

  const filterFn: QSelectProps["onFilter"] = (input, update) => {
    if (!input) {
      return update(() => {
        subtopicsOptions.value = allSubtopics.value;
      });
    }

    return update(() => {
      const result = fuz.go(input, allSubtopics.value, {
        threshold: 0.5,
      });

      subtopicsOptions.value = result.map(
        (res) => res.target,
      ) as Subtopic<Topic>[];
    });
  };

  function handleDeleteKey(e: KeyboardEvent & { target: HTMLInputElement }) {
    if (e.target.value) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    options.value.subtopics.pop();
  }
</script>

<template>
  <QPage v-if="topicData && Object.values(topicData).some((q) => q.length)">
    <QCard v-if="!readyToRevise" class="surface-container-low">
      <QCardSection class="text-h6 q-pb-none">
        Avant de commencer à réviser
      </QCardSection>

      <QCardSection>
        <AppSelect
          v-model="options.subtopics"
          :options="subtopicsOptions"
          label="Chapitres à réviser"
          hint="Si aucun chapitre n'est sélectionné, tous les chapitres seront utilisés"
          input-debounce="500"
          use-input
          multiple
          @filter="filterFn"
          @keydown.delete="handleDeleteKey"
        />
      </QCardSection>

      <QCardSection class="text-body1">
        <span class="q-mr-md">Limiter le nombre de questions ?</span>

        <QBtnToggle
          v-model="options.limitQuestions"
          toggle-color="primary-container"
          toggle-text-color="on-primary-container"
          rounded
          :options="[
            {
              label: 'Oui',
              value: true,
            },
            {
              label: 'Non',
              value: false,
            },
          ]"
        />

        <div v-if="options.limitQuestions" class="q-mt-sm">
          <AppInput
            v-model.number="options.questionsCount"
            type="number"
            label="Nombre de questions"
          />

          <span class="q-mr-md">
            Homogénéiser le nombre de questions par chapitre ?
          </span>

          <QBtnToggle
            v-model="options.splitEvenly"
            toggle-color="primary-container"
            toggle-text-color="on-primary-container"
            rounded
            :options="[
              {
                label: 'Oui',
                value: true,
              },
              {
                label: 'Non',
                value: false,
              },
            ]"
          />
        </div>
      </QCardSection>

      <QCardActions align="center">
        <AppBtn
          :label="`Commencer à réviser ${questions.length} ${handlePlural('question', questions.length)}`"
          :disable="!questions.length"
          :class="questions.length ? 'primary' : 'surface-variant'"
          @click="readyToRevise = true"
        />
      </QCardActions>
    </QCard>

    <QuestionsDisplay v-else :questions />
  </QPage>

  <QPage v-else>
    <div class="text-h1 text-center">Ce cours n'a encore aucune question.</div>
  </QPage>
</template>

<style>
  input[type="number"] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
</style>
