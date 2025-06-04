## Jeu de Vocabulaire Latin

# Objectifs du Projet
Ce travail a été produit dans le cadre d'un projet informatique. Le but de ce projet est de produire un jeu vidéo en 2D afin de réviser et d'apprendre le latin - en particulier les déclinaisons et le vocabulaire. Sans pour autant être un serious games, l'un des buts initiaux, mais qui a dû être avorté par manque de temps, était de faire également du jeu une manière d'explorer quelques anecdotes historiques en jeu. Mais il aurait fallu faire de plus amples recherches historiques et archéologiques ainsi que de fixer clairement le cadre temporel et spatial.

Pour ce qui est de la procédure d'installation, il suffit de télécharger le dossier "Rendu" pour avoir tout le contenu du jeu, Ce dossier contient un fichier html ainsi que trois fichiers JS nécessaires à son fonctionnement: un fichier kaplay.js, mainloquace.js et RENDU.js. Le fichier kaplay.js condense l'usage pouvant être fait de la librairie kaplay, tandis que le mainloquace est issu d'un plug-in - encore en développement - pouvant fonctionner sous kaplay. (Les crédits se trouvent en fin du README.) Si tout le dossier est intouché, le tout peut être joué localement sur l'ordinateur en créant un serveur local (via Visual Studio Code par exemple).

<img width="765" alt="Capture d’écran 2025-06-04 à 09 04 21" src="https://github.com/user-attachments/assets/d0c0cf70-94b1-4e61-802f-8dedafcb4ec7" />

# Scénario
Comme dit précédemment, bien que l'idée de départ était de faire un jeu s'inspirant d'une période temporelle et un lieu fixe, il aurait fallu consacrer du temps afin de faire les recherches nécessaires au niveau de la documentation archéologique et historique. De ce fait, l'histoire est plus un prétexte spécieux qu'informatif.

Le bref début de scénario présenté dans le jeu n'est qu'un prétexte est met indirectement en forme ce que cela pourrait être s'il y avait les 8 niveaux prévus. En comptant le prologue, cela fait 1 niveau sur 9. Le but du jeu est de l'utiliser indirectement comme outil d'apprentissage, et le reste est un peu une forme de bonus.

# 1ères étapes: documentation

Avant d'entamer le code du projet, il a fallu sélectionner quel serait le public cible principal. Le vocabulaire pouvant être appris vise principalement les personnes apprenant le latin : soit étalé sur 6 ans (trois ans d'option spécifique latin à l'école et trois ans au gymnase) soit étalé sur 2 ans (cours de latin obligatoire en Lettres qui condense les 6 ans). Pour ce qui est des personnes suivant la discipline latin en elle-même à l'université, il y a un niveau de vocabulaire qui inclut l'ensemble du vocabulaire devant être appris (soit l'ensemble du dictionnaire Déglon d'environ 3'000 mots). Nonobstant, il s'agit d'un niveau optionnel et est le seul à concerner directement et spécifiquement les personnes en discipline de latin.

Pour ce qui est de la documentation, je me suis basé sur plusieurs ouvrages. Tout d'abord, le dictionnaire latin Déglon (des p.222-258). Durant le Bachelor, j'avais déjà pu intégrer tout le vocabulaire sur le logiciel Anki. J'ai donc pu récupérer ces données sous formats .txt afin de les réutiliser pour ce projet.
Quant à la structure des niveaux, je me suis basée sur le livre de Vocabulaire Latin (édition de 2014) publié par le canton de Vaud et la dgeo (direction général de l'enseignement obligatoire). Il y a, en tout et pour tout 69 chapitres où chacun d'entre eux possède une thématique spécifique. Ce sont ces 69 chapitres qui structurent l'ordre d'apprentissage des vocabulaires en jeu, en particulier pour le scénario. Si le code de la partie scénarisée était complet, cela se découperait en tranches de 8 niveaux, avec subrepticement d'autres éléments comme les déclinaisons : 1 (1-10), 2(11-20), 3(21-30), 4(31-40), 5(41-50), 6(51-60), 7(61-59), 8(1-69). Un point qui était probablement trop ambitieux est le fait d'avoir un certain rythme entre scénario, indices (éléments permettant d'avoir accés dans une ou plusieurs scènes à des informations sur les déclinaisons/le vocabulaire qui seraient testés) et le moment où il y a le moement de révision. De ce fait, le prologue en début de jeu est une forme de tuto avant d'accéder au mode libre de révisions (scène Bibliothèque), mais également pour la suite de l'histoire - incomplète à ce jour.

# Ce qui n'a pas pu ou pourrait être fait : Bug, Améliorations
Pour des questions de droits d'auteurs sur les traductions issues des Belles-Lettres, il n'aurait pas été possible de les intégrer dans ce travail, mais il aurait pu être intéressant de proposer des textes latin en jeu et de les traduire. De plus, par manque de temps sur la fin du travail, et afin d'avoir un projet avec le moins de bug possible, il a été préféré de peaufiner au mieux le début du projet que de faire quelque chose de trop grand, et théoriquement complet, mais aux risques de plusieurs bugs. De ce fait, seul le mode libre (la bibliothèque) et le début du scénario est fonctionnel. La scène "Hub", cependant, est incomplète. 
De plus, l'idée d'un gameplay où il faudrait écrire les mots a été abandonné car cela demanderait de réécrire les fichiers .txt de sorte qu'il n'y ait pas de problème de parenthèse ou autres symboles spéciaux, tout comme - bien que plus réalisable - le fait qu'un seul mot peut avoir plusieurs traductions.
Qui plus est, il y a un bug spécifique où, lorsque l'on sauvegarde dans la scène ("ResultScene", ({win}), le jeu plante à cause de la variable "win" qui n'est pas pris spécifiquement en compte dans la fonction de sauvegarde. Il est également arrivé en cours de tests, que des images ne s'affichent pas de suite, mais cela arrive que dans des circonstances spécifiques. Par exemple, lorsque l'on fait exprès d'aller vite : comme entrer dans la scène "Hub" et faire en sorte d'entrer dans la bibliothèque pendant le temps de chargement.
À cela s'ajoute également le code pour créer des paquets de vocabulaires personnalisés dont je n'ai pas réussi à le transformer sous la forme d'un code compatible avec kaplay.
Parmi les autres améliorations possibles, tout comme le scénario, il aurait été intéressant de faire en sorte que l'ensemble des assets images produits soit cohérent. Sans forcément faire de lien temportel ou de lieu, l'image du phare s'inspire de la tour d'Hercule (en Espagne) ainsi que la bibliothèque de Celsus (en actuel Turquie) qui - comme son nom l'indique - amène à la bibliothèque dont l'intérieur ne correspond pas du tout à son apparence extérieur.

![Bibliothèque](https://github.com/user-attachments/assets/83b4825c-849c-46fa-863e-50081a6fbf30)
![Phareavecfeu](https://github.com/user-attachments/assets/6b961338-986a-44fe-933e-ecebf685bafa)
![Bateau](https://github.com/user-attachments/assets/5ceadc6a-d700-4067-97e5-dfe2c25d7c13)
![Colonne_corinthienne](https://github.com/user-attachments/assets/8fc4ce02-75ab-48a7-95d9-84ce65ec9f62)
![Colonnedoriquegris](https://github.com/user-attachments/assets/b4fd6a8f-59d6-4e5d-8ad5-c7b5cc4f17be)


# 2 choix
À partir de la fin du prologue, le joueur peut décider soit de continuer - théoriquement - l'histoire et de suivre le chemin scripté, soit d'aller à la bibliothèque afin d'augmenter son score ou de tout simplement réviser les chapitres qu'il souhaite. Plus le score est haut, plus il peut réclamer des bonus auprès du marchand dans la ville (pas codé) : comme des accessoires (il existe en commentaire le code du chapeau dans la scène Bibliothèque) ou bien des items comme une garantie de 100% de réussite pour la barre spéciale (présente uniquement dans les scènes en lien avec le vocabulaire). Le score ferait office ici d'une sorte de monnaie en jeu, et il ne serait pas possible de cumuler à la suite plusieurs points au score en réussissant plusieurs fois la même scène de vocabulaire/déclinaion (codé).
Puisqu'il a été brièvement mentionné le cas de la barre spéciale, c'est l'un des rares éléments entre-guillemet moins conventionnel qui a été ajouté dans la révision du vocabulaire. Après dix bonnes réponses, le joueur peut l'utiliser afin d'avoir soit un bienfait (9 chance sur 10) ou une malédiction (1 chance sur 10). Un bienfait correspond soit à un soin (le joueur a toujours 6 pv de base), soit désigner la bonne réponse parmi les trois choix. Cela pourrait être vu comme un choix particulier pour le dernier cas puisque le but est de réviser, mais puisque cela n'arrive que toutes les dix bonnes réponses, ce n'est que ponctuel. Quant aux malédictions, ils pénalisent le joueur en lui faisant perdre de la vie (0.5 pv sur 6) soignent un certain montant la vie du boss.

Pour ce qui est de l'histoire, il n'y a que le début qui a été codé, mais c'est surtout dû a une vision trop large. Premièrement dû à la fois à la gestion du rythme : il ne faut pas non plus mettre à la suite tous les chapitres de vocabulaires au risque d'être indigeste, de même qu'il faut étaler les indices. Deuxièmement, le nombre conséquent de vocabulaire entre les chapitres 1-69 (un peu plus de 1000 mots) ne permet pas de les mettre tous à la suite sans quelques rappels - comme c'est le cas, par exemple, avec la scène "DeclinaisonTemplum&Rosa" qui, en plus d'ajouter une nouvelle déclinaison, rappelle deux déclinaisons apprises précédemment. Il y a eu la question un moment donné de faire un gimmick à la Professor Layton où le joueur intéragit avec certains personnages et obtient des informations après avoir réussi à passer le vocabulaire. Cependant, il faut voir le jeu comme un complément pour des révisions de vocabulaires tout en ajoutant un aspect ludique en plus. Quant à ceux qui réessayent sans apprendre le vocabulaire, on pourrait presque parler de "die and retry" : au lieu de patterns, il s'agit de vocabulaire.

# Contexte de développement

Ce projet est supervisé par Isaac Pante dans le cadre d'un travail en SLI (Lettres, UNIL).

# Crédits

Plug-In Loquace codé par Loic Cattani : https://github.com/loiccattani/kaplay-loquace

Musiques & Sons : À l'exception du son en fin de prologue, l'ensemble des musiques et compositeurs sont crédités ici:

-DeusLower:
Atmosphere mystic fantasy orchestral music: https://pixabay.com/fr/music/mystere-atmosphere-mystic-fantasy-orchestral-music-335263/

-Grand_Project:
Calm Waves (Soft Piano): https://pixabay.com/fr/music/classique-moderne-calm-waves-soft-piano-314968/
Relaxing Piano: https://pixabay.com/fr/music/classique-moderne-relaxing-piano-310597/

-music_for_video: 
Elevator Music bossa nova background music ( Version 60s) : https://pixabay.com/music/elevator-music-elevator-music-bossa-nova-background-music-version-60s-10900/
Forest Lullaby: https://pixabay.com/fr/music/groupe-acoustique-forest-lullaby-110624/
Inspiring Emotional Uplifting Piano: https://pixabay.com/fr/music/classique-moderne-inspiring-emotional-uplifting-piano-112623/
Waiting Music: https://pixabay.com/music/bossa-nova-waiting-music-116216/

-Good_B_Music:
Endless Beauty (Main): https://pixabay.com/music/beautiful-plays-endless-beauty-main-11545/

-Clavier_Music:
Sad Waltz (Piano): https://pixabay.com/fr/music/classique-moderne-sad-waltz-piano-216330/
Soft Background Piano: https://pixabay.com/fr/music/classique-moderne-soft-background-piano-285589/

-Sonothèque:
Vagues et Sternes: https://lasonotheque.org/mer-vagues-moyennes-et-mouettes-s0267.html
Chant d'un insecte 1: https://lasonotheque.org/chant-insecte-s1052.html

-Mixkit: Bonus earned in video game : https://mixkit.co/free-sound-effects/game/

Images: Toutes les images ont été produites par moi-même via Piskel ou Pixil. Tout usage est libre de droit (mais sans usage commercial). Il faut juste faire mention du lien github ou du pseudonyme.
