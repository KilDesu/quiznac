<script lang="ts" setup>
  import type { Question } from "~/bindings";

  const { questions } = defineProps<{ questions: Question[] }>();

  const emit = defineEmits<{
    finished: [payload: { answered: number; correct: number; total: number }];
  }>();

  type Phase = "quiz" | "results";

  const phase = ref<Phase>("quiz");
  const viewIndex = ref(0);
  const validated = ref<boolean[]>([]);
  const wasCorrect = ref<(boolean | null)[]>([]);
  const draftRadioIndex = ref<(number | null)[]>([]);
  const draftCheckboxIndices = ref<number[][]>([]);
  const validateBlockedMessage = ref("");

  const currentQuestion = computed(() => questions[viewIndex.value] ?? null);
  const resultsSummary = computed(() => answeredStats());
  const canGoPrev = computed(
    () => phase.value === "quiz" && viewIndex.value > 0,
  );
  const canGoNext = computed(
    () => phase.value === "quiz" && viewIndex.value < frontier.value,
  );
  const frontier = computed(() => {
    const notValidatedIndex = validated.value.findIndex((v) => !v);
    return notValidatedIndex === -1 ? questions.length : notValidatedIndex;
  });
  const canEditSelection = computed(() => {
    if (phase.value !== "quiz") {
      return false;
    }

    const index = viewIndex.value;
    return (
      index === frontier.value &&
      index < questions.length &&
      !validated.value[index]
    );
  });
  const isViewReadonly = computed(() => {
    if (phase.value !== "quiz") {
      return true;
    }
    return !canEditSelection.value;
  });
  const radioOptions = computed(() => {
    const question = currentQuestion.value;
    if (!question) {
      return [];
    }
    return question.answers.map((answer, index) => ({
      label: answer.label.trim() || `Réponse ${index + 1}`,
      value: index,
    }));
  });
  const errorReviewIndices = computed(() => {
    const out: number[] = [];

    for (let i = 0; i < questions.length; i++) {
      if (validated.value[i] && !wasCorrect.value[i]) {
        out.push(i);
      }
    }
    return out;
  });

  watch(
    () => questions,
    () => {
      initFromQuestions();
    },
    { immediate: true, deep: false },
  );

  function correctIndices(question: Question): number[] {
    return question.answers
      .map((answer, index) => (answer.isAnswer ? index : -1))
      .filter((index) => index >= 0);
  }

  function countCorrectAnswers(question: Question): number {
    return question.answers.filter((answer) => answer.isAnswer).length;
  }

  function isMultipleCorrect(question: Question): boolean {
    return countCorrectAnswers(question) > 1;
  }

  function initFromQuestions() {
    const questionsCount = questions.length;
    validated.value = Array(questionsCount).fill(false);
    wasCorrect.value = Array(questionsCount).fill(null);
    draftRadioIndex.value = Array(questionsCount).fill(null);
    draftCheckboxIndices.value = Array.from(
      { length: questionsCount },
      () => [],
    );
    viewIndex.value = 0;
    phase.value = "quiz";
    validateBlockedMessage.value = "";
  }

  function goPrev() {
    if (canGoPrev.value) {
      viewIndex.value--;
    }
  }

  function goNext() {
    if (canGoNext.value) {
      viewIndex.value++;
    }
  }

  function setsEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    const sortedA = arr1.toSorted((x, y) => x - y);
    const sortedB = arr2.toSorted((x, y) => x - y);
    return sortedA.every((v, i) => v === sortedB[i]);
  }

  function validateCurrent() {
    validateBlockedMessage.value = "";
    const i = frontier.value;
    if (i >= questions.length || validated.value[i]) {
      return;
    }
    const question = questions[i];
    if (!question) {
      return;
    }

    const correct = correctIndices(question);
    if (correct.length === 0) {
      validateBlockedMessage.value =
        "Cette question n'a aucune bonne réponse configurée.";
      return;
    }

    let ok = false;
    if (isMultipleCorrect(question)) {
      const picked = draftCheckboxIndices.value[i] ?? [];
      ok = setsEqual(picked, correct);
    } else {
      const sel = draftRadioIndex.value[i];
      ok = correct.length === 1 && sel === correct[0];
    }

    validated.value[i] = true;
    wasCorrect.value[i] = ok;
  }

  function answeredStats() {
    let answered = 0;
    let correct = 0;
    const n = questions.length;
    for (let i = 0; i < n; i++) {
      if (validated.value[i]) {
        answered++;
        if (wasCorrect.value[i]) {
          correct++;
        }
      }
    }
    return { answered, correct, total: n };
  }

  function goToResults() {
    phase.value = "results";
    const { answered, correct, total } = answeredStats();
    emit("finished", { answered, correct, total });
  }

  function finishEarly() {
    goToResults();
  }

  function resetQuiz() {
    initFromQuestions();
  }

  function toggleCheckbox(
    questionIndex: number,
    answerIndex: number,
    checked: boolean,
  ) {
    if (!canEditSelection.value || viewIndex.value !== questionIndex) {
      return;
    }
    const row = draftCheckboxIndices.value[questionIndex] ?? [];
    const next = checked
      ? [...new Set([...row, answerIndex])].sort((a, b) => a - b)
      : row.filter((x) => x !== answerIndex);
    draftCheckboxIndices.value[questionIndex] = next;
  }

  function setRadio(questionIndex: number, value: number | null) {
    if (!canEditSelection.value || viewIndex.value !== questionIndex) {
      return;
    }
    draftRadioIndex.value[questionIndex] = value;
  }

  function answerLabels(question: Question, indices: number[]): string {
    return indices
      .filter((i) => i >= 0 && i < question.answers.length)
      .map((i) => question.answers[i]!.label.trim() || `Réponse ${i + 1}`)
      .join(", ");
  }

  function userPickedIndices(
    question: Question,
    questionIndex: number,
  ): number[] {
    if (isMultipleCorrect(question)) {
      return [...(draftCheckboxIndices.value[questionIndex] ?? [])];
    }
    const radioIndex = draftRadioIndex.value[questionIndex];
    return radioIndex === null || radioIndex === undefined ? [] : [radioIndex];
  }
</script>

<template>
  <div v-if="!questions.length" class="column items-center q-pa-lg">
    <QCard
      class="surface-container-low q-pa-lg"
      style="width: min(480px, 100%); border-radius: 0.75rem"
    >
      <div class="text-body1 text-on-surface-variant text-center">
        Aucune question à afficher.
      </div>
    </QCard>
  </div>

  <div v-else-if="phase === 'quiz'" class="column q-gutter-md">
    <QCard
      class="surface-container-low"
      style="border-radius: 0.75rem; border: 1px solid var(--outline)"
    >
      <QCardSection class="row items-center no-wrap q-py-sm">
        <div class="column" style="min-width: 0">
          <span class="text-subtitle2 text-on-surface-variant">
            Question {{ viewIndex + 1 }} / {{ questions.length }}
          </span>
          <span
            v-if="isViewReadonly && validated[viewIndex]"
            class="text-caption text-on-surface-variant q-mt-xs"
          >
            Réponse verrouillée (révision)
          </span>
        </div>
        <QSpace />
        <div class="row q-gutter-xs shrink-0">
          <AppBtn
            flat
            dense
            round
            icon="chevron_left"
            :disable="!canGoPrev"
            aria-label="Précédent"
            @click="goPrev"
          />
          <AppBtn
            flat
            dense
            round
            icon="chevron_right"
            :disable="!canGoNext"
            aria-label="Suivant"
            @click="goNext"
          />
        </div>
      </QCardSection>

      <QSeparator style="background: var(--outline)" />

      <QCardSection v-if="currentQuestion" class="column q-gutter-md">
        <div class="text-h6" style="word-break: break-word">
          {{ currentQuestion.label }}
        </div>

        <div
          v-if="currentQuestion.image"
          class="flex justify-center"
          style="width: 100%; min-width: 0"
        >
          <img
            :src="currentQuestion.image"
            alt=""
            class="rounded-borders block"
            style="
              max-width: 100%;
              max-height: 20rem;
              object-fit: contain;
              border-radius: 0.75rem;
            "
          />
        </div>

        <QBanner
          v-if="validateBlockedMessage"
          dense
          rounded
          class="error-container q-pa-sm"
        >
          {{ validateBlockedMessage }}
        </QBanner>

        <div
          v-if="isMultipleCorrect(currentQuestion)"
          class="column q-gutter-sm"
        >
          <span class="text-subtitle2 text-on-surface-variant">
            Plusieurs réponses correctes possibles
          </span>
          <div
            v-for="(answer, idx) in currentQuestion.answers"
            :key="idx"
            class="row items-center no-wrap q-gutter-sm"
          >
            <QCheckbox
              :model-value="
                draftCheckboxIndices[viewIndex]?.includes(idx) ?? false
              "
              :disable="!canEditSelection"
              :label="answer.label"
              dense
              class="text-body1"
              @update:model-value="
                (v) => toggleCheckbox(viewIndex, idx, Boolean(v))
              "
            />
          </div>
        </div>

        <QOptionGroup
          v-else
          :model-value="draftRadioIndex[viewIndex]"
          :options="radioOptions"
          type="radio"
          color="primary"
          :disable="!canEditSelection"
          @update:model-value="(v) => setRadio(viewIndex, v as number | null)"
        />

        <template v-if="validated[viewIndex]">
          <QSeparator style="background: var(--outline)" />
          <QBanner
            dense
            rounded
            :class="
              wasCorrect[viewIndex]
                ? 'primary-container q-pa-md'
                : 'error-container q-pa-md'
            "
          >
            <div class="text-weight-medium q-mb-sm">
              {{
                wasCorrect[viewIndex]
                  ? "Bonne réponse 🎉"
                  : "Mauvaise réponse 🫠"
              }}
            </div>
            <div
              v-if="!wasCorrect[viewIndex]"
              v-for="correct in [correctIndices(currentQuestion)]"
              class="text-body2 q-mb-sm"
            >
              <span class="text-weight-medium">
                {{ handlePlural("Réponse", correct.length) }}
                {{ handlePlural("attendue", correct.length) }} :
              </span>
              {{ answerLabels(currentQuestion, correct) }}
            </div>
            <div v-if="currentQuestion.explanation.trim()" class="text-body2">
              <span class="text-weight-medium">Explication : </span>
              {{ currentQuestion.explanation }}
            </div>
          </QBanner>
        </template>
      </QCardSection>

      <QSeparator style="background: var(--outline)" />

      <QCardActions class="q-pa-md row wrap q-gutter-sm justify-between">
        <div class="col"></div>

        <div
          v-for="isLast in [frontier === questions.length]"
          class="col text-center"
        >
          <AppBtn
            v-if="canGoNext"
            :label="isLast ? 'Terminer' : 'Prochaine question'"
            no-caps
            class="primary"
            @click="() => (isLast ? goToResults() : goNext())"
          />

          <AppBtn
            v-else-if="canEditSelection"
            label="Valider"
            no-caps
            class="primary"
            @click="validateCurrent"
          />
        </div>

        <div class="col text-right">
          <AppBtn flat no-caps label="Terminer le quiz" @click="finishEarly" />
        </div>
      </QCardActions>
    </QCard>
  </div>

  <div v-else class="column q-gutter-md">
    <QCard
      class="surface-container-low"
      style="border-radius: 0.75rem; border: 1px solid var(--outline)"
    >
      <QCardSection>
        <div class="text-h6 q-mb-md">Résultats</div>
        <div class="text-body1 column q-gutter-xs">
          <span
            v-for="percent in [
              (
                (resultsSummary.correct * 100) /
                resultsSummary.answered
              ).toFixed(0),
            ]"
          >
            Score :
            <span class="text-weight-medium">
              <template v-if="resultsSummary.answered > 0">
                {{ percent }}%
              </template>
              —
              {{ +percent >= 75 ? "Ça passe !" : "Va falloir plus réviser !" }}
            </span>
          </span>
          <span
            v-if="resultsSummary.answered === 0"
            class="text-on-surface-variant"
          >
            Aucune question validée — le score reflète uniquement les questions
            auxquelles vous avez répondu.
          </span>
        </div>
      </QCardSection>

      <QSeparator style="background: var(--outline)" />

      <QCardSection v-if="errorReviewIndices.length">
        <div class="text-subtitle1 q-mb-sm">Revoir les erreurs</div>
        <QList bordered separator class="rounded-borders surface-container">
          <QExpansionItem
            v-for="questionIndex in errorReviewIndices"
            :key="questionIndex"
            dense
            separator
            header-class="text-body2"
          >
            <template #header>
              <QItemSection avatar>
                <AppIcon name="error" color="error" filled />
              </QItemSection>
              <QItemSection>
                <div class="text-weight-medium ellipsis-2-lines">
                  {{ questions[questionIndex]!.label }}
                </div>
                <div class="text-caption text-on-surface-variant">
                  Question {{ questionIndex + 1 }}
                </div>
              </QItemSection>
            </template>
            <QCard flat class="surface-container-high q-ma-sm">
              <QCardSection class="column q-gutter-sm text-body2">
                <div>
                  <span class="text-weight-medium">Votre réponse : </span>
                  {{
                    answerLabels(
                      questions[questionIndex]!,
                      userPickedIndices(
                        questions[questionIndex]!,
                        questionIndex,
                      ),
                    ) || "—"
                  }}
                </div>
                <div
                  v-for="correct in [correctIndices(questions[questionIndex]!)]"
                >
                  <span class="text-weight-medium">
                    {{ handlePlural("Réponse", correct.length) }}
                    {{ handlePlural("correcte", correct.length) }} :
                  </span>
                  {{ answerLabels(questions[questionIndex]!, correct) }}
                </div>
                <div v-if="questions[questionIndex]!.explanation.trim()">
                  <span class="text-weight-medium">Explication : </span>
                  {{ questions[questionIndex]!.explanation }}
                </div>
              </QCardSection>
            </QCard>
          </QExpansionItem>
        </QList>
      </QCardSection>

      <QCardSection v-else-if="resultsSummary.answered > 0">
        <div class="text-body2 primary-container q-pa-md rounded-borders">
          Aucune erreur parmi les questions auxquelles vous avez répondu.
        </div>
      </QCardSection>

      <QSeparator style="background: var(--outline)" />

      <QCardActions align="center" class="q-pa-md">
        <AppBtn
          flat
          no-caps
          label="Rejouer"
          class="primary"
          @click="resetQuiz"
        />
      </QCardActions>
    </QCard>
  </div>
</template>

<style scoped>
  .rounded-borders {
    border-radius: 0.75rem;
  }

  .ellipsis-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
