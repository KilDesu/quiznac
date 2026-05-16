<script lang="ts" setup>
  import hljs from "highlight.js/lib/core";
  import typescript from "highlight.js/lib/languages/typescript";
  import "highlight.js/styles/github-dark.css";

  import { readTextFile } from "@tauri-apps/plugin-fs";
  import type { Firestore } from "firebase/firestore";

  import type { Answer, Question } from "~/bindings";
  import type { Subtopic, Topic } from "~/types";

  hljs.registerLanguage("typescript", typescript);

  const code = hljs.highlight(
    `
/**
  * Représente une réponse de QCU/QCM.
  */
type Answer = {
  /**
    * La réponse.
    */
  label: string;
  /**
    * Est-ce que c'est une bonne réponse ou non.
    * Doit apparaître seulement si "true".
    */
  isAnswer: boolean | null;
};

/**
  * Représente une question de QCU/QCM.
  */
type Question = {
  /**
    * Le texte de la question.
    */
  label: string;
  /**
    * URL de l'image associée à la question s'il y en a.
    */
  image: string | null;
  /**
    * Les réponses possibles.
    */
  answers: Answer[];
  /**
    * L'explication des réponses.
    */
  explanation: string;
};
  `,
    { language: "typescript" },
  );

  const db = inject<Ref<Firestore | null>>("db");

  const route = useRoute();
  const data = useData();

  const questionToEdit = ref<Question | "new" | null>(null);
  const importDialog = ref(false);
  const importedFilePath = ref<string | null>(null);
  const questionToDelete = ref<Question | null>(null);

  const questions = computed(() => {
    const { topic, subtopic } = route.params;

    if (
      !topic ||
      !subtopic ||
      typeof topic !== "string" ||
      typeof subtopic !== "string"
    ) {
      return [];
    }

    const subtopicData = data.value?.[topic as Topic]?.[subtopic];

    if (!subtopicData) {
      return [];
    }

    return subtopicData;
  });

  function getAnswerCountLabel(answers: Answer[]) {
    const correctAnswers = answers.filter((answer) => answer.isAnswer);

    return `${answers.length} ${handlePlural(
      "réponse",
      answers.length,
    )} dont ${correctAnswers.length} ${handlePlural(
      "correcte",
      correctAnswers.length,
    )}`;
  }

  async function handleJsonAdd() {
    if (!db?.value || !importedFilePath.value) {
      return;
    }

    const { subtopic } = route.params;

    if (typeof subtopic !== "string") {
      return;
    }

    const content = await readTextFile(importedFilePath.value);
    const questionsToImport = JSON.parse(content) as Question[];

    await addQuestionsToSubtopic(
      db.value,
      subtopic as Subtopic<Topic>,
      questionsToImport,
      data,
    );
  }

  async function handleQuestionDelete(question: Question) {
    if (!db?.value) {
      return;
    }

    const { subtopic } = route.params;

    if (typeof subtopic !== "string") {
      return;
    }

    await removeQuestionsFromSubtopic(
      db.value,
      subtopic as Subtopic<Topic>,
      question,
      data,
    );

    questionToDelete.value = null;
  }

  async function handleQuestionSave(
    question: Question,
    originalLabel?: string,
  ) {
    if (!db?.value || !questionToEdit.value) {
      return;
    }

    const { subtopic } = route.params;

    if (typeof subtopic !== "string") {
      return;
    }

    if (questionToEdit.value === "new") {
      await addQuestionsToSubtopic(
        db.value,
        subtopic as Subtopic<Topic>,
        question,
        data,
      );
    } else {
      await updateQuestionInSubtopic(
        db.value,
        subtopic as Subtopic<Topic>,
        question,
        data,
        originalLabel,
      );
    }

    questionToEdit.value = null;
  }
</script>

<template>
  <div>
    <div class="text-h3 q-mb-lg">Chapitre "{{ route.params.subtopic }}"</div>

    <div class="flex q-mb-sm" style="gap: 1rem">
      <QSpace />

      <AppBtn icon="upload" label="Importer" @click="importDialog = true">
        <QTooltip class="surface-variant text-body2">
          Importer un fichier JSON
        </QTooltip>
      </AppBtn>
      <AppBtn
        icon="add"
        label="Ajouter une question"
        @click="questionToEdit = 'new'"
      />
    </div>

    <QList class="surface-container">
      <QExpansionItem v-for="question in questions" :key="question.label">
        <template #header>
          <QItemSection>
            <QItemLabel>{{ question.label }}</QItemLabel>
            <QItemLabel caption>
              {{ getAnswerCountLabel(question.answers) }}
            </QItemLabel>
          </QItemSection>

          <QItemSection v-if="question.image" side>
            <AppIcon name="image" />
          </QItemSection>
          <QItemSection side>
            <AppBtn icon="edit" @click.stop="questionToEdit = question" />
          </QItemSection>
          <QItemSection side>
            <AppBtn
              icon="delete"
              class="error-container"
              @click.stop="questionToDelete = question"
            />
          </QItemSection>
        </template>

        <QList class="transparent" separator>
          <QItem v-for="answer in question.answers" :key="answer.label">
            <QItemSection>{{ answer.label }}</QItemSection>
            <QItemSection v-if="answer.isAnswer" side>
              <AppIcon name="check_circle" color="primary" filled />
            </QItemSection>
          </QItem>
        </QList>

        <QSeparator />

        <div class="q-pa-md">
          <b>Explication</b> : {{ question.explanation }}
        </div>
      </QExpansionItem>
    </QList>

    <QuestionEdit v-model="questionToEdit" @save="handleQuestionSave" />

    <DeleteDialog
      v-model="questionToDelete"
      text="cette question"
      @delete="handleQuestionDelete"
    >
      cette question
    </DeleteDialog>

    <QDialog v-model="importDialog">
      <QCard class="surface-container-low text-body1">
        <QCardSection class="text-h4"> Importer un fichier JSON </QCardSection>

        <QCardSection>
          <AppFile
            v-model="importedFilePath"
            label="Fichier à importer"
            :accept="['json']"
          />
        </QCardSection>

        <QCardSection>
          Pour accélérer la saisie de questions, il est possible d'importer un
          fichier JSON contenant une liste de questions.
        </QCardSection>

        <QCardSection class="q-pt-none">
          Pour ça, chaque question et réponse doit avec un format particulier :
        </QCardSection>

        <pre
          class="text-body2 q-px-md q-ma-md overflow-auto shadow-out dark surface"
          style="border-radius: 0.5rem; max-height: 30rem"
        ><code v-html="code.value" /></pre>

        <QCardActions align="right">
          <AppBtn
            flat
            label="Annuler"
            @click="
              importDialog = false;
              importedFilePath = null;
            "
          />
          <AppBtn
            class="primary"
            label="Importer"
            :disable="!importedFilePath"
            @click="handleJsonAdd"
          />
        </QCardActions>
      </QCard>
    </QDialog>
  </div>
</template>
