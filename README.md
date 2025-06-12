## Jeu de vocabulaire latin

# Objectifs du projet
Ce travail a été réalisé dans le cadre d'un projet informatique. Son objectif est de produire un jeu vidéo en 2D permettant de réviser et d'apprendre le latin, notamment les déclinaisons et le vocabulaire. Sans pour autant être un *serious game*, l'un des objectifs initiaux, mais qui a dû être abandonné par manque de temps, était de faire également du jeu un moyen d'explorer quelques anecdotes historiques. Mais il aurait fallu mener de plus amples recherches historiques et archéologiques, et définir clairement le cadre temporel et spatial.

Pour ce qui est de la procédure d'installation, il suffit de télécharger tous les documents (à l'exception des documents .md) pour avoir accès à l'intégralité du contenu du jeu. Ce dossier contient un fichier HTML ainsi que trois fichiers JS nécessaires à son fonctionnement: les fichiers kaplay.js, mainloquace.js et RENDU.js. Le fichier kaplay.js condense l'usage qui peut être fait de la librairy kaplay, tandis que le mainloquace.js est issu d'un plug-in - encore en développement - pouvant fonctionner sous kaplay. (Les crédits de ce dernier se trouvent en fin du README.) Si le dossier n'est pas modifié, le jeu peut être joué localement sur l'ordinateur en créant un serveur local (via Visual Studio Code par exemple). Lors de sauvegarde, il sera cependant nécessaire de glisser le fichier dans le dossier dédié "sauvegardes", tout en prenant soin d'avoir le nom de fichier "sauvegardes_partie_1.json".

<img width="765" alt="Capture d’écran 2025-06-04 à 09 04 21" src="https://github.com/user-attachments/assets/d0c0cf70-94b1-4e61-802f-8dedafcb4ec7" />

# Scénario
Comme indiqué précédemment, l'idée de départ était de créer un jeu s'inspirant d'une période et d'un lieu spécifiques, mais il aurait fallu consacrer du temps à la recherche de documentation archéologique et historique. De ce fait, l'histoire est davantage un prétexte spécieux qu'un élément informatif.

Le bref début de scénario présenté dans le jeu n'est qu'un prétexte qui permet d'imaginer ce que cela pourrait être s'il y avait les 8 niveaux prévus. En comptant le prologue, cela fait 1 niveau sur 9. Le but du jeu est de l'utiliser indirectement comme un outil d'apprentissage, et le reste relève plutôt de la forme de bonus.

# 1ères étapes: documentation

Avant d'entamer la rédaction du code du projet, il a fallu sélectionner quel serait le public cible principal. Le vocabulaire pouvant être appris vise principalement les personnes apprenant le latin : soit étalé sur 6 ans (trois ans d'option spécifique latin à l'école et trois ans au gymnase), soit étalé sur 2 ans (cours de latin obligatoire en Lettres qui condense les 6 ans). Pour les personnes suivant la discipline latin en elle-même à l'université, il existe un niveau de vocabulaire qui inclut l'ensemble du vocabulaire devant être appris (soit l'ensemble du dictionnaire Déglon d'environ 3'000 mots). Il s'agit toutefois d'un niveau optionnel qui concerne directement et spécifiquement les personnes suivant la discipline latin.

En ce qui concerne la documentation, je me suis basé sur plusieurs ouvrages. Tout d'abord, le dictionnaire latin Déglon (p.222-258). Durant le Bachelor, j'avais déjà pu intégrer tout le vocabulaire dans le logiciel Anki. J'ai donc pu récupérer ces données sous formats .txt afin de les réutiliser pour ce projet. Je n'avais plus qu'à créer de nouveaux fichiers .txt pour séparer les paquets de vocabulaires par niveau.
Quant à la structure des niveaux, je me suis basée sur le livre de *Vocabulaire Latin* (édition de 2014) publié par le canton de Vaud et la DGEO (direction général de l'enseignement obligatoire). Il y a, en tout et pour tout, 69 chapitres où chacun d'entre eux possède une thématique spécifique. Ce sont ces 69 chapitres qui structurent l'ordre d'apprentissage des vocabulaires en jeu, en particulier pour le scénario. Si le code de la partie scénarisée était complet, cela se découperait en tranches de 8 niveaux, avec subrepticement d'autres éléments comme les déclinaisons : 1 (1-10), 2(11-20), 3(21-30), 4(31-40), 5(41-50), 6(51-60), 7(61-69), 8(1-69). Un point qui était probablement trop ambitieux est le fait d'instaurer un certain rythme entre le scénario, les indices (éléments permettant d'accéder à des informations sur les déclinaisons/le vocabulaire qui seraient testés) et le moment où il y a révision. Le prologue en début de jeu est une forme de tutoriel avant d'accéder au mode libre de révisions (scène Bibliothèque), mais il sert également à la suite de l'histoire, qui est incomplète à ce jour.

# Ce qui n'a pas pu ou pourrait être fait : bugs, améliorations
Pour des questions de droits d'auteur sur les traductions issues des Belles-Lettres, il n'aurait pas été possible de les intégrer dans ce travail. En revanche, il aurait pu être intéressant de proposer des textes latin dans le jeu et de les traduire. De plus, par manque de temps sur la fin du projet, et afin de limiter les bugs, il a été préférable de peaufiner au mieux le début du projet plutôt que de réaliser quelque chose de trop grand, et théoriquement complet, mais comportant plus de risques de bugs. De ce fait, seul le mode libre (la bibliothèque) et le début du scénario sont fonctionnels. La scène "Hub", cependant, est incomplète. 
De plus, l'idée d'un gameplay où il faudrait écrire les mots a été abandonnée car cela demanderait de réécrire les fichiers .txt de sorte qu'il n'y ait pas de problème de parenthèses ou d'autres symboles spéciaux, tout comme le fait qu'un seul mot peut avoir plusieurs traductions, bien que cela soit plus réalisable. Qui plus est, il y a un bug spécifique où, lorsque l'on sauvegarde dans la scène ("ResultScene", ({win}), le jeu plante à cause de la variable "win" qui n'est pas pris spécifiquement en compte dans la fonction de sauvegarde. Cela dit, si le joueur intéragit avec le personnage, le bug ne se produit pas. Il est également arrivé lors de tests, que des images ne s'affichent pas immédiatement, mais cela ne se produit que dans des circonstances spécifiques. Par exemple, lorsque l'on fait exprès d'aller vite : comme commencer dans la scène "Hub" et faire en sorte d'entrer dans la bibliothèque pendant le temps de chargement.
À cela s'ajoute également le code pour créer des paquets de vocabulaires personnalisés que je n'ai pas réussi à le transformer sous la forme d'un code compatible avec kaplay.
Parmi les autres améliorations possibles, il aurait été intéressant de faire en sorte que l'ensemble des assets images produits soit cohérent, tout comme le scénario. Sans forcément établir de lien temportel ou géographique, l'image du phare s'inspire de la tour d'Hercule (en Espagne), et la bibliothèque s'inspire de celle de Celsus (en actuel Turquie). Cette dernière possède un intérieur qui ne correspond pas du tout à son apparence extérieure et qui donne un ensemble hétérogène.

![Bibliothèque](https://github.com/user-attachments/assets/83b4825c-849c-46fa-863e-50081a6fbf30)
![Phareavecfeu](https://github.com/user-attachments/assets/6b961338-986a-44fe-933e-ecebf685bafa)
![Bateau](https://github.com/user-attachments/assets/5ceadc6a-d700-4067-97e5-dfe2c25d7c13)
![Colonne_corinthienne](https://github.com/user-attachments/assets/8fc4ce02-75ab-48a7-95d9-84ce65ec9f62)
![Colonnedoriquegris](https://github.com/user-attachments/assets/b4fd6a8f-59d6-4e5d-8ad5-c7b5cc4f17be)


# 2 choix
À partir de la fin du prologue, le joueur peut décider soit de continuer - théoriquement - l'histoire et de suivre le chemin scripté, ou bien d'aller à la bibliothèque afin d'augmenter son score ou de tout simplement réviser les chapitres qu'il souhaite. Plus le score est élevé, plus il peut réclamer des bonus auprès du marchand présent dans la ville (pas codé) : comme des accessoires (il existe, en commentaire, le code du chapeau dans la scène Bibliothèque) ou bien des items comme une garantie de 100% de réussite pour la barre spéciale (présente uniquement dans les scènes en lien avec le vocabulaire). Le score jouerait alors le rôle d'une sorte de monnaie en jeu, et il ne serait pas possible de cumuler des points en réussissant plusieurs fois la même scène de vocabulaire/déclinaison (codé).
Puisqu'il a été brièvement mentionné le cas de la barre spéciale, c'est l'un des rares éléments moins conventionnels qui a été ajoutés dans les scènes de révision du vocabulaire. Après dix bonnes réponses, le joueur peut l'utiliser pour recevoir un bienfait (9 chances sur 10) ou une malédiction (1 chance sur 10). Un bienfait correspond soit à un soin (le joueur a toujours 6 pv de base et il récupère la totalité), soit il désigne la bonne réponse parmi les trois choix. Cela pourrait être vu comme un choix particulier pour le second cas de figures, puisque le but est de réviser, mais puisque cela n'arrive que toutes les dix bonnes réponses, cela reste que ponctuel. Quant aux malédictions, elles pénalisent le joueur en lui faisant perdre de la vie (il ne lui reste plus que 0.5 pv) et soignent un certain montant la vie du boss (entre 50% et 100%).

Pour ce qui est de l'histoire, seul le début a été codé, mais c'est surtout dû à une vision trop large. Premièrement, cela est dû à la gestion du rythme : il ne faut pas non plus mettre à la suite tous les chapitres de vocabulaire au risque d'être indigeste, de même qu'il faut étaler les indices. Deuxièmement, le nombre conséquent de vocabulaire entre les chapitres 1 et 69 (un peu plus de 1'000 mots) ne permet pas de tous les mettre à la suite sans quelques rappels - comme c'est le cas, par exemple, avec la scène "DeclinaisonTemplum&Rosa" qui, en plus d'ajouter une nouvelle déclinaison, rappelle deux déclinaisons apprises précédemment. Il a été question un moment donné de créer un gimmick similaire à la manière dont étale les parties de gameplays les *Professeur Layton*. Dans notre cas, le joueur interagit avec certains personnages et obtient des informations après avoir réussi à passer le vocabulaire. Cependant, il faut voir le jeu comme un complément pour aux révisions de vocabulaire, avec une dimension ludique supplémentaire. Quant à ceux qui réessayent sans apprendre le vocabulaire, on pourrait presque parler de "die and retry" : au lieu d'apprendre des patterns, il s'agit de vocabulaires.

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

Melody of Nature (Main): https://pixabay.com/music/beautiful-plays-melody-of-nature-main-6672/

-Clavier_Music:

Sad Waltz (Piano): https://pixabay.com/fr/music/classique-moderne-sad-waltz-piano-216330/

Soft Background Piano: https://pixabay.com/fr/music/classique-moderne-soft-background-piano-285589/

-Sonothèque:

Vagues et Sternes: https://lasonotheque.org/mer-vagues-moyennes-et-mouettes-s0267.html

Chant d'un insecte 1: https://lasonotheque.org/chant-insecte-s1052.html

-Mixkit: Bonus earned in video game : https://mixkit.co/free-sound-effects/game/

Images: Toutes les images ont été produites par moi-même via Piskel ou Pixil. Tout usage est libre de droit (mais sans usage commercial). Il faut, a minima, faire mention du lien github.
