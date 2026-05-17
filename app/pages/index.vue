<template>
  <div class="text-h2 text-center q-pa-md">Bienvenue sur QUIZNAC</div>

  <div class="text-body1 q-py-lg">
    <p>
      QUIZNAC est une application créée afin de pouvoir s'entraîner sur des
      questions type QCU/QCM pour tous les cours de deuxième année GSEA. Cela
      permet de rassembler les connaissances au même endroit afin de pouvoir
      rendre l'apprentissage plus complet plus facilement.
    </p>

    <p>
      Les questions sont créées par la communauté pour la communauté. Elle sont
      ainsi consultables et modifiables par tous, donc bienveillance et
      bienséance sont de rigueur (merci de ne pas tout supprimer 🫠).
    </p>

    <p>
      Sur cette app, les questions sont organisées par cours et par chapitres :
      Un cours peut contenir plusieurs chapitres et chaque chapitre peut
      contenir plusieurs questions.
    </p>

    <p>
      L'ajout, la modification et la suppression des chapitres et des questions
      se fait dans
      <NuxtLink to="/configuration"> l'onglet <b>Configuration</b> </NuxtLink>.
      Pour ajouter des cours, merci de contacter directement
      <a href="mailto:contact.quiznac@gmail.com"> l'administrateur </a>.<br />

      Les questions peuvent avoir un nombre arbitraire de réponses dont une ou
      plus peuvent être correctes. Les questions peuvent également contenir des
      images donc il y a de quoi être créatif !<br />

      Enfin, à chaque question doit obligatoirement être rattachée une
      explication afin de pouvoir comprendre la réponse attendue.
    </p>

    <p>
      Les quiz peuvent être débutés dans les onglets correspondant au cours à
      réviser. Il sera alors possible de choisir les chapitres voulus et le
      nombre de questions auxquelles répondre afin de terminer le quiz (même si
      un quiz peut être arrêté à tout moment).
    </p>

    <p>
      Les quiz se font par cours : on peut choisir le ou les chapitre(s) que
      l'on veut réviser, et QUIZNAC choisit aléatoirement parmi les questions de
      ces chapitres afin de ne pas revoir toujours la même chose. Par défaut,
      une limite de 70 questions est appliquée, mais elle peut être modifiée
      facilement.<br />

      Lorsqu'un quiz est terminé (prématurément ou non), une note en pourcentage
      est donnée sur la base du nombre de questions répondues et un
      récapitulatif des réponses incorrectes est donné.<br />

      En revanche aucune statistique n'est gardée en mémoire, donc c'est à vous
      de suivre votre évolution !
    </p>
  </div>

  <div class="text-h6 text-center">
    On compte sur vous pour faire vivre cette application et bon courage pour
    vos révisions ! 🤗
  </div>
</template>
