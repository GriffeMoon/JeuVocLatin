//import kaplay from "./kaplay.js";
import { loquacePlugin } from "./mainloquace.js";
let failMusic = null;

const gameState = {
    score: 0,
    niveau: 1,
    joueur: { x: 0, y: 0 },//Position, important pour la sauvegarde
    erreurs: 0,
};
//Pour placer une limite générale à gauche (mur invisible)
const GAUCHE_LIMITE = 0;
//Pour dialogue qui varie
let resultatduel = 0
//Màj des erreurs
function updateErreurLabel() {
    erreurLabel.text = `Erreurs: ${gameState.erreurs}/3`;
}
const FLOOR_HEIGHT = 175;
//const JUMP_FORCE = 800;
const SPEED = 320; //640

let camAnimStarted = false;
let camAnimTime = 0;
const camAnimDuration = 5; // Durée de l'animation en secondes
const cameraStartY = -300;
const cameraEndY = 650;


const kamera = kaplay({
    buttons: {space: {keyboard: ["space"]},
    addWord: {
      keyboard: ["space"]}},
    global: true, //Pour éviter certains bugs, il est parfois préférable de laisser en false
    width: 1792,//896,
    height: 1036, //518,
    stretch : true,
    //font:
    canvas: document.querySelector("#gameCanvas"),
    backgroundAudio: true,
	background: [0, 0, 0],
    scale: 1,

    plugins: [loquacePlugin], // add Loquace plugin here

    
})
//Doit absolument être déclaré après kaplay!
layers([
    "bg",
    "nuages",
    "ui",
], "bg");

//Requis pour PLUG-IN
loquace.init(
    {showNextPrompt: false})//N'affiche plus la flèche après la deuxième boîte de dialogues);

// `loquace` is globally available by default,
// from KAPLAY's `global` option (https://kaplayjs.com/doc/KAPLAYOpt/)

//Fonction pour l'effet entre le menu et le retour en jeu (mis dans scene Hub, Boss, Archive) --> n'est pas présent en jeu car le menu n'est pas complet
function transition(sceneName) {
    const fade = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
        opacity(0),
        z(100),// --> Z pour désigner une couche, peut aller de 0 à 999
        "fade",
    ]);

    fade.onUpdate(() => {
        if (fade.opacity < 1) {
            fade.opacity += dt(); // augmente l'opacité jusqu'à 1
        } else {
            go(sceneName);
        }
    });
}

function fonduEntrant() {
    const fadeIn = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
        opacity(1),
        z(100),
    ]);

    fadeIn.onUpdate(() => {
        if (fadeIn.opacity > 0) {
            fadeIn.opacity -= dt(); // diminue l’opacité progressivement (0)
        } else {
            destroy(fadeIn);
        }
    });
}

let score = 0;
let niveau = 1;
let joueur = {
  x: 0,
  y: 0,
};


//ASSETS
loadSprite("Gaulois", "image/Gaulois.png")
loadSprite("Cielnuit", "image/cieletoiles.png") //image/cielligne.jpg")
loadSprite("Champs", "image/Coquelicot_champ.png")
loadSprite("Nuage", "image/Nuage1.png");
loadSprite("Nuage2", "image/Nuage2.png");
loadSprite("Ciel","image/cieljour.png")
loadSprite("Erable","image/Erable.png")
loadSprite("Sol","image/Sol.png")
loadSprite("Solpavé","image/Solpavé.png")
loadSprite("Solfleur","image/Solfleur.png")
loadSprite("Solclair","image/Solclair.png")
loadSprite("Solanglegauche","image/Solanglegauche.png")
loadSprite("Solangledroit","image/Solangledroit.png")
loadSprite("Colonne","image/Colonnedoriquegris.png")
loadSprite("Colonne_corinthienne", "image/Colonne_corinthienne.png")
loadSprite("Colonne_étrange","image/colonne_étrange.png")
loadSprite("Multicolonnes","image/Multicolonnes.png")
loadSprite("Escalier","image/Escalier.png")
loadSprite("Etoiles", "image/Etoiles.png")
loadSprite("Lune","image/Moon.png")
loadSprite("Phare", "image/Phareniveau.png")
loadSprite("Mer", "image/Mer.png")
loadSprite("Coquelicot", "image/Fleur.png")
loadSprite("Nenuphar", "image/Nénuphar.png")
loadSprite("Feuilles", "image/Feuille.png")
loadSprite("Luciole", "image/Luciole.png")
loadSprite("Trireme", "image/Trireme.png")
loadSprite("pont", "image/pont.png")
loadSprite("Bibliothèque", "image/Bibliothèque.png")
loadSprite("bibliothécaire", "image/Vieilhomme.png")
loadSprite("Cerisier", "image/Cerisier.png")
loadSprite("Gaden", "image/MiniNew PiskelGaden.png");
loadSprite("Alvares", "image/MiniNew PiskelAlvares.png");
loadSprite("NuitIntro", "image/Nuitintro.png")
loadSprite("Alvaresdodo","image/Alvaresdodo.png")
loadSprite("fees", "image/Luciole.png")
loadSprite("fae", "image/Luciole.png")
loadSprite("Champsnuit", "image/ChampsNuit.png")
loadSprite("stele", "image/stele.png")
loadSprite("trireme", "image/Bateau.png")
loadSprite("biblio", "image/Biblio.png")
loadSprite("parquet", "image/Parquet.png")
loadSprite("mapmonde", "image/Mapmonde.png")
loadSprite("fauteuil", "image/Fauteuil.png")
loadSprite("pilelivre", "image/Pilelivre.png")
loadSprite("livre", "image/Livre.png")
loadSprite("table","image/Table.png")
loadSprite("canard","image/Canard.png")
loadSprite("Fondbiblio", "image/Bibliofond.png")
loadSprite("ostia", "image/Ostia.png")
loadSprite("Vitraux", "image/Vitraux.png")
loadSprite("chapeau", "image/chapeau.png")
loadSprite("tour", "image/Phareavecfeu.png")
loadSprite("dummy", "image/Dummy.png")

//Pour scènes déclinaisons
// Chargement des musiques
    loadSound("musique1", "musique_rendu/calm-waves-soft-piano-314968.mp3");
    loadSound("musique2", "musique_rendu/relaxing-piano-310597.mp3");
    loadSound("musique3", "musique_rendu/forest-lullaby-110624.mp3");
    loadSound("musique4", "musique_rendu/elevator-music-bossa-nova-background-music-version-60s-10900.mp3");
// Chargement des backgrounds (exemples à adapter avec tes fichiers)
    loadSprite("bg1", "image/cielmatin.png");//Jour
    loadSprite("bg2", "image/cieljour.png");
    loadSprite("bg3", "image/cielcrepuscule.png");//Nuit
    loadSprite("bg4", "image/cieletoiles.png");//Crépuscule
loadSpriteAtlas("image/mouettes.png", {
    
    "mouettes": {
        "x": 0,
        "y": 0,
        width: 32,//32
        height: 64,//64
        sliceX: 1,
        sliceY: 2,
        "anims": {
            "idle": {
                "from": 0,
                "to": 1,
                "speed": 5,
                "loop": true,
            },
        },
    }})
loadSpriteAtlas("image/Alvaresanimationcorrigé.png",
    //Piskel/Alvares/alvares.png", 
    {
    
    "alvares": {
        "x": 0,
        "y": 0,
        width: 160,
        height: 192,//192 --> voir taille du fichier png et l'adapter à chaque fois!
        sliceX: 5, //--> ibid
        sliceY: 6,//5
        "anims": {
            "idle": {
                "from": 0,
                "to": 1,
                "speed": 5,
                "loop": true,
            },
            "marche": {
                "from": 2,
                "to": 8,
                "speed": 4,
                "loop": true,
            },
            "dodo": {
                "from": 9,
                "to": 26,
                "speed": 2,
                "loop": false,
            },
        },
    }})

    loadSpriteAtlas("sprite/gaden.png", {
    "gaden": {
        "x": 0,
        "y": 0,
        width: 160,
        height: 160,
        sliceX: 5,
        sliceY: 5,
        "anims": {
            "idle": {
                "from": 0,
                "to": 4,
                "speed": 5,
                "loop": true,
            },
        },
    }})

        loadSpriteAtlas("image/2frames.png", {
    "cinematic": {
        "x": 0,
        "y": 0,
        width: 86,//86 --> multiplier par deux les fichiers téléchargé sur piskel
        height: 180,//90
        sliceX: 1,
        sliceY: 2,
        "anims": {
            "idle": {
                "from": 0,
                "to": 1,
                "speed": 1,
                "loop": true,
            },
        },
    }})

//Liste des images de sprites pour chaque perso. --> Mieux de faire un sprite Atlas tout de même.
    loadSprite("G_Sprite1", "image/Gaden_sprite/New PiskelGaden-5.png.png");
    loadSprite("G_Sprite2", "image/Gaden_sprite/New PiskelGaden-6.png.png");
    loadSprite("G_Sprite3", "image/Gaden_sprite/New PiskelGaden-8.png.png");
    loadSprite("G_Sprite4", "image/Gaden_sprite/New PiskelGaden-9.png.png");
    loadSprite("G_Sprite5", "image/Gaden_sprite/New PiskelGaden-10.png.png");
    loadSprite("G_Sprite6", "image/Gaden_sprite/New PiskelGaden-11.png.png");
    loadSprite("G_Sprite7", "image/Gaden_sprite/New PiskelGaden-12.png.png");
    loadSprite("G_Sprite8", "image/Gaden_sprite/New PiskelGaden-13.png.png");
    loadSprite("G_Sprite9", "image/Gaden_sprite/New PiskelGaden-14.png.png");
    loadSprite("G_Sprite10", "image/Gaden_sprite/New PiskelGaden-15.png.png");

    loadSprite("A_Sprite1", "image/Alvares_sprite/New PiskelAlvares-1.png.png");
    loadSprite("A_Sprite2", "image/Alvares_sprite/New PiskelAlvares-2.png.png");
    loadSprite("A_Sprite3", "image/Alvares_sprite/New PiskelAlvares-3.png.png");
    loadSprite("A_Sprite4", "image/Alvares_sprite/New PiskelAlvares-4.png.png");
    loadSprite("A_Sprite5", "image/Alvares_sprite/New PiskelAlvares-5.png.png");
    loadSprite("A_Sprite6", "image/Alvares_sprite/New PiskelAlvares-6.png.png");
    loadSprite("A_Sprite7", "image/Alvares_sprite/New PiskelAlvares-7.png.png");
    loadSprite("A_Sprite8", "image/Alvares_sprite/New PiskelAlvares-8.png.png");
    loadSprite("A_Sprite9", "image/Alvares_sprite/New PiskelAlvares-9.png.png");
    loadSprite("A_Sprite10", "image/Alvares_sprite/New PiskelAlvares-10.png.png");
   

    loquace.characters({
        g:{
            name:"Gaden",
            sprite: "Gaden",
            //dialogType: "vn", --> Si on souhaite faire la boîte de dialogue en bas de l'écran
            dialogType: "pop",
            sideImage: "G_Sprite1",
            position: "left", //Par défaut, en haut à gauche. Il y a neuf positions: center, left, right, top, topright, topleft, bot, botright, botleft
            expressions:{ //Associer ici un mot-clé avec chaque sprite
                satisfied: "G_Sprite1",
                normal:"G_Sprite2",
                happy: "G_Sprite3",
                happy2:"G_Sprite4",
                happy3: "G_Sprite5",
                blink:"G_Sprite6",
                evil: "G_Sprite7",
                sourcileve:"G_Sprite8",
                doubt: "G_Sprite9",
                surprise:"G_Sprite10",
                //circonspect:"",
                //sad:""
            },    
            dialogOptions: {
                dialogText: {
                    //color(conf.textBox.color ? Object.values(conf.textBox.color) : WHITE),
                    color: RED, //ATTENTION: Choix couleur limité ! RED, BLUE, GREEN, YELLOW, WHITE, BLACK --> orange, purple, grey ne fonctionne pas.
                    opacity: 0.5,
                },},
            defaultExpression: "happy2",
        },

        a:{
            name: "Alvarès",
            sprite:"Alvares",
            dialogType:"pop",
            sideImage: "Alvares_Sprite1",
            position: "right",
            expressions:{ //Associer ici un mot-clà avec chaque sprite
                satisfied: "Alvares_Sprite3",
                normal:"A_Sprite1",
                happy:"A_Sprite2",
                choque:"A_Sprite10",
                doubt: "A_Sprite5",
                sideeye: "A_Sprite4",
                verydoubtful:"A_Sprite6",
                nocomment:"A_Sprite9",
                choque:"A_Sprite10",
                //test:"Test",
        },
        dialogOptions: {
            dialogText: {
                color: BLUE, //ATTENTION: Choix couleur limité !
                opacity: 0.5,
            },},
        defaultExpression: "normal",    
        }
    })



//MUSIQUE
let bell = loadSound("bell", "musique_rendu/inspiring-emotional-uplifting-piano-112623.mp3")
//https://lasonotheque.org/chant-insecte-s1052.html
let criquet = loadMusic("Criquet", "musique_rendu/ANMLInsc_Chant insecte (ID 1052)_LS.mp3")
let fond = loadMusic("Fond", "musique_rendu/ANMLInsc_Chant insecte (ID 1052)_LS.mp3")
let talk = loadMusic("Talk", "musique_rendu/atmosphere-mystic-fantasy-orchestral-music-335263.mp3")
//Bonus earned in video game : https://mixkit.co/free-sound-effects/game/
let startsound = loadMusic("startSound", "musique_rendu/mixkit-bonus-earned-in-video-game-2058.wav")
//loadMusic("startSound", "musique_rendu/mixkit-clock-tower-or-cathedral-bell-587.wav")
let victoire = loadSound("Victoire", "musique_rendu/soft-background-piano-285589.mp3");
let défaite = loadSound("Défaite", "musique_rendu/sad-waltz-piano-216330.mp3");
let forêt = loadSound("Forêt", "musique_rendu/soft-background-piano-285589.mp3")
let temple = loadSound("Temple", "musique_rendu/calm-waves-soft-piano-314968.mp3")
let biblio = loadSound("Biblio", "musique_rendu/waiting-music-116216.mp3")
let mouette = loadSound("Mouette", "musique_rendu/AMBSea_Mer vagues moyennes et mouettes (ID 0267)_LS.mp3")
let finprologue = loadSound("Fin_Prologue", "musique_rendu/Fin_Prologue.m4a")
let son = loadSound("hub", "musique_rendu/endless-beauty-main-11545.mp3")
let entrainement = loadSound("entrainement", "musique_rendu/melody-of-nature-main-6672.mp3")

//TOUS LES DIALOGUES DU JEU SE TROUVENT ICI
    const dialogs = loquace.script({
        //Il y a un bug entre le plug-in et l'intéraction --> mis un texte vide pour le régler en attendant, sinon saute le premier dialogue suivant ce que je code
        "dialogue":[
        "",    
        "Vous regardez une dernière fois le ciel étoilé. Le signe annonciateur d'un nouveau départ...", //Narrateur, sans sprite, avec vn (visual novel) comme boîte de dialogue
        "g Eh bien, eh bien, comment vas-tu depuis le temps? Pas trop de problèmes avec les tests que je t'ai donné l'autre fois?",
        "a ...",
        "g:surprise Si silencieux, si taciturne... J'ai l'impression de parler à une tombe.",
        "a:doubt ...",
        "a ... As-tu fini?",
        "g:blink Hélas, non!",
        "a:doubt *soupir*",
        "a (Et c'est reparti.)",
        "g:blink Comme tu le sais, les règles sont les règles.",
        "g:sourcileve Et elles sont décidées par ma personne.",
        "g:blink Si tu souhaites rentrer chez toi, tu devras réussir mon épreuve.",
        "Il semble que le mage soit déjà déterminé à vous tester. Vous ne pourrez pas échapper à cette confrontation... que ce soit aujourd'hui ou demain.",
        "g Bien sûr, il se fait tard, et tu as encore une longue route devant toi.",
        "g Bien que je t'aie appris quelques mots du coin depuis ton arrivée, il est toujours bon de s'entraîner à parler avec d'autres gens.",
        "g N'es-tu pas d'accord?",
        "a ...",
        "g ...",
        "g:doubt Tu pourrais tout de même répondre. Ne me dis pas que tu as déjà oublié le peu que je t'ai appris?",
        "g:sourcileve Cela ferait mal à mon petit cœur.",
        "a (Dit-il avec un grand sourire.)",
        "a:sideeye (Et il débite tellement vite que je n'ai pas le temps d'en placer une ou de trouver une traduction appropriée.)",
        "a:happy (Même si je commence à bien cerner le sens, je peine encore à traduire mes pensées...)",
        "a:nocomment (Enfin, je ne devrais pas être trop dur. Il faut dire aussi qu'il vit seul. Il n'y a pas d'autres habitants dans les environs avec qui discuter...)",
        "a:doubt (Je me demande d'ailleurs pourquoi il vit ainsi, isolé dans cette forêt, vu à quel point il adore parler.)",
        "a (Enfin, qu'importe. J'aurai mon ticket de retour une fois que j'aurai accompli sa demande absurde : apprendre le latin.)",
        "g:satisfied En tout bien, tout honneur, j'espère que ce voyage t'apportera plus que d'apprendre quelques mots par-ci par-là.",
        "a (Son ton est beaucoup plus sérieux qu'à son habitude.)",
        "g:sourcileve Comme on dit, l'apprentissage est un chemin sans fin.",
        "g:blink Bon vent!",
        "...",
        "Le 'mage de pacotille' vous a dit qu'il était déjà prêt à vous mettre à l'épreuve. Mais, c'est à vos risques et périls..." 
    ],
        "?":["g:surprise Eh bien, tu as des difficultés?"],
        "Duel":["",
            "g:surprise Oh, tu n'es pas parti?",
            "g:happy2 Je te manque déjà? En même temps, c'est compréhensible.",
            "g:satisfied Une fois que tu quitteras la forêt, le chemin se refermera petit à petit derrière toi.",
            "a:doubt ...",
            "g:surprise Bon, bon, j'ai compris. Tu n'as aucun humour ma parole!",
            "g:blink Bien sûr, tu peux toujours essayer de me battre à ce jeu-là avant ton voyage...",
            "g:evil Mais je ne ferai pas de cadeau.",
            "Voulez-vous procéder à un combat 'amical'? (Presser Enter pour valider et les flèches pour sélectionner)",],         
        "Dueldéfaite": [
            "g:blink Eh bien, comme attendu, tu as perdu.",
            "a:verydoubtful ...",
            "g:satisfied Ne réagis pas comme ça!",
            "g:satisfied Un jour viendra où on pourra faire jeu égal.",
            "g:sourcileve Même si je doute que ce jour arrive de sitôt!",
            "g:sourcileve Après tout, il faut savoir manier les mots.",
            "g:satisfied Et on ne peut pas dire que ce soit ton cas à l'heure actuelle.",
            "a:verydoubtful ...",
            "a:nocomment ...",
            "a:normal Stupide mage...",
            "g:surprise Quoi?!...",
            "g:blink Enfin, je suppose que les insultes sont les premières choses qu'on apprend dans une langue.",
            "g:happy2 N'oublie pas. La suite de ton voyage se trouve à l'est!",
        ],
        "Duelréussite": [
            "g:surprise Comment, tu...",
            "g:doubt Tu as triché!",
            "g:doubt Ou bien, tu n'avais jamais eu besoin de faire ce voyage depuis le début.",
            "g:doubt Rah, j'en perds mon latin!",
            "a ...",
            "g:doubt ...",
            "g *soupir*",
            "g Je sais que tu souhaites rentrer chez toi, et que je t'ai promis d'ouvrir le portail dès que tu réussiras mon épreuve...",
            "g:satisfied Mais il est encore trop tôt. Ce voyage est une condition sine qua non.",
            "a:doubt (Cela sonne comme un mensonge.)", 
            "a (J'ignore pourquoi il insiste tant pour que je parte.)",
            "g:blink À la revoyure! La suite de ton voyage est à l'est! Ne l'oublie pas!",
        ],
        "Pasparti": [
            "g:surprise Tu n'es pas déjà parti?",
            "g:happy Tu sais que tu dois partir à l'est, n'est-ce pas?",

        ],
        "FeeIntro":[
            "",//BUG
            "Hé toi! Oui, toi, pousse-toi! Tu es en train de marcher sur nos fleurs, malotru!",
            "a:nocomment ...",
        ],
        "Fae":[
            "",
            "Chargez les filles!",
            "a ...",
        ],
        "Rosa":[
            "",
            "L'une des fées chantonne un air.",
            "Rosa, rosa, rosam ♪, rosae, rosae, rosa ♪ rosae, rosae, rosas, rosarum ! ~♪ rosis, rosis! ~♪",
            "a ...",
            "a:sideeye ...",
            "a Est-ce vraiment censé m'aider?",
        ],
        "NVAGDA":[
            "",
            "a ...",
            "Tu es perdu?",
            "a ...",
            "a Tes amies me bloquent le passage.",
            "Bah, je ne vois pas le problème.",
            "Elles ne pourraient pas faire grand-chose face à toi. Tu pourrais passer à côté d'elles, non?",
            "a:sideeye ...",
            "a:happy Je suis juste poli.",
            "C'est vrai qu'il y a ces trois petites qui t'accompagnent. Tu es donc un ami des fées!",
            "Écoute, mon conseil, l'ami: NVAGDA",
            "a ...?",
            "a ...NVAGDA?",
            "Nominatif, Vocatif, Accusatif, Génitif, Datif, Ablatif.",
            "Tous les textes de déclinaison que tu liras seront toujours dans cet ordre. Tout comme on passe du singulier au pluriel.",
            "En tout cas, ça a toujours été comme ça. Ne me demande pas pourquoi.",
            "*soupir* J'espère que quelqu'un se débarrassera du mage qui s'est installé dernièrement. Il fout trop les jetons avec son rire sardonique!",
            "Et on dit qu'il arrache les ailes des fées pour faire des potions! Rien que d'y penser, j'en tremble de peur!",
            "a ...",
            "a (Est-ce qu'il parle de ce stupide mage?)",
            "a:happy (Non, il n'est pas assez mesquin pour faire ça...)",
            "a:sideeye (La description du rire, par contre...)",],
        "FeeAurevoir":[
            "",
            "Rosa, rosa, rosam ♪, rosae, rosae, rosa ♪ rosae, rosae, rosas, rosarum ! ~♪ rosis, rosis! ~♪",
            "Je ne savais pas que tu connaissais cette chanson!",
            "a ...",
            "a J'aimerais aller à la ville la plus proche. Est-ce que vous sauriez où aller?",
            "Pour la ville, je ne sais pas trop, mais il y a un temple plus loin. Continue vers l'est!",
            "Bonne chance!"
        ],
        "Templum":[
            "",
            "Templum, templum, templum...",
            "Hmm, Hmm, Hmm!",
            "Templi, templo, templo",
            "Hi, Ho, Ho!",
            "Templa, templa, templa...",
            "Ha, ha, ha!",
            "Le reste est illisible.",
            "a Hmm... La fin manque.",
            "a:doubt (Il n'empêche, payer une stèle pour inscrire une absurdité pareille.)"
        ],
        "Templum2":[
            "",
            "Il y a quelque chose dans l'herbe...",
            "Orum, Hisse, Hisse",
            "a (C'est la suite de l'inscription.)",
            "a:doubt (J'espère juste que je ne vais pas devoir pousser la chansonnette comme pour les fées...)",
        ],
        "Templum3":[
            "",
            "Il y a quelque chose dans l'herbe... Une feuille de papier.",
            "Dominus, domine, dominum",
            "Domini, domino, domino",
            "Domini, domini, dominos",
            "Dominorum, dominis, dominis",
            "a (Elle n'a rien à voir avec l'inscription.)"

        ],
        "...":[
            "",
            "a ...",
            "...",
            "a:doubt (Ce silence est quelque peu gênant.)",
            "a Bonjour?"
        ],
        "Anylastword":[
            "",
            "a ...",
            "a:doubt (Pourquoi ne me laisse-t-il toujours pas passer?)",
            "Tu ne passeras pas!",
            "Car je n'ai pas fini!",
            "a ...",
            "a:doubt (Oh non, comment appelle-t-on cela déjà dans le jargon...)",
            "Tu te crois malin à piquer mes répliques! Je vais t'apprendre qui c'est le boss ici!",
            "a (Ah oui, je m'en souviens maintenant : une phase 2.)"
        ],
        "Anylastword2":[
            "",
            "...",
            "a Bon, tu as compris maintenant?",
            "Non! J'ai dit que tu ne passeras pas!",
            "a:choque (Pourquoi les gens d'ici ont tendance à bloquer la route des gens? C'est agaçant à force. À moins que ce serait...)",
            "a:doubt (... une tradition?)",
            "a ...",
            "a:happy (Aux grands maux, aux grands remèdes, alors!)",
        ],
        "Maison":[
            "",
            "a (La mer...)",
            "a (Ça me rappelle la maison.)",
        ],
        "Anylastword3":[
            "",
            "Dis, tu peux me laisser partir?",
            "Ok, je t'ai un peu bloqué le passage avant.",
            "Mais tu es en train de m'éloigner du temple, là!",
            "a:happy ...Par chez moi, on dit oeil pour oeil, dent pour dent.",
            "a (Et si ce que dit ce mage est correct, il y a plusieurs interdits à respecter dans les lieux sacrés...)",
            "a:happy Ou alors... Je retrouve le prêtre et lui prévient que quelqu'un a voulu se battre dans un espace sacré...",
            "Ok, ok, j'ai compris! Ne dis surtout pas au prêtre ce qui s'est passé! Sinon, je risque plus que ma peau!",
            "Mais fais pas pour autant le malin. Toi aussi tu pourrais être sévérement puni pour avoir insulter les dieux!",
            "Écoute, en échange de ma libération, je te donne une info en or. La ville est à l'est!",
            "a ...",
            "a:doubt Je sais déjà où aller. Tu ne veux tout de même pas m'entourlouper?",
            "Euh... Alors...",
            "J'ai un bateau, on pourra le prendre pour y aller. Ça nous évitera de faire toute la côte à pied.",
            "Qu'est-ce que tu en dis?",
            "a ...",
            "a:happy Vendu.",
            "(Pour partir, appuyez sur i une fois sur le Pont.)"
        ],
        "En chemin":[
            "",
            "Narrateur : Et c'est ainsi que les deux compères partent vers d'autres horizons.",
            "Narrateur : Prenant le navire pour aller à la ville d'Ostia, notre héros a (peut-être) gagné un compagnon de route.",
            "Narrateur : Ainsi que trois déclinaisons entre-guillemet apprises.",
            "Narrateur : Mais ce n'est pas armé de ce maigre savoir qu'il pourra faire face à nouveau au mage de la forêt.",
            "g:blink  ;-)",
            "Narrateur : Il risque donc de se heuter à de nombreux obstacles avant d'en arriver là.",
            "g:happy *tousse*",
            "Narrateur : Tu n'es pas censé revenir avant la fin, ouste!",
            "g:doubt Pour un scénario qui tient sur un post-it, la cohérence, je ne m'en préoccupe guère!",
            "g:doubt Et puis bon, le grand méchant, tout-ci tout-ça, c'est d'un vu et revu.",
            "g:happy Pourquoi se compliquer la vie avec un scénario grandiloquent : il va devoir me battre pour obtenir ce qu'il veut. Point. Ça c'est dans le script.",
            "g Et pour ce faire, il n'y a qu'une seule solution.",
            "g:blink Apprendre!",
            "g:doubt ...Ou tricher.",
            "g:blink Enfin bref, il n'a pas le choix s'il souhaite rentrer chez lui!",
            "Narrateur : À ce propos...",
            "g:doubt ...",
            "Narrateur : Non, je n'ai rien dit.",
            "g:happy En attendant,je vais profiter de son petit voyage pour effectuer quelques menus travaux!",
            "g:doubt J'en ai assez de dormir sans un toit...",
            "Narrateur : *tousse* Reprenons là où nous nous sommes arrêtés...",            
        ],
        "En chemin2":[
            "",
            "a Est-ce que c'est encore loin?",
            "Le trublion du temple: Nous arrivons bientôt à Ostia. On verra rapidement le phare!",
            "Le trublion du temple: Au fait... Pourquoi souhaites-tu tant aller là-bas?",
            "a ...",
            "a Pour rentrer chez moi.",
            "Le trublion du temple: Ah bon? Pourtant, ça se voit à des kilomètres que tu n'es pas d'ici.",
            "a ...",
            "a (Peut-être vaudrait-il mieux que j'évite de parler du marché que j'ai entrepris avec le mage.)",
            "a ...",
            "a J'ai juste promis à un ami d'apprendre votre langue.",
            "a En échange, il m'aidera à rentrer.",
            "a Navré d'ailleurs, si j'ai de la peine à parler. Trouver mes mots me demandent beaucoup d'efforts.",
            "Le trublion du temple: Ah, c'est pour ça que tu restes aussi longtemps silencieux?",
            "Le trublion du temple: Bah, tant qu'on se comprend, ce n'est pas trop un souci. Il y a une bibliothèque en ville. C'est le deuxième gros bâtiments à l'ouest de la ville. Peut-être que tu trouveras ce que tu cherches là-bas, qui sait.",
            "Le trublion du temple: Oh, regarde! On arrive enfin au port!",
            "Le trublion du temple: La nuit aura été longue, mais tu pourras admirer la ville dans toute sa splendeur!",
        ],
        "Le bibliothécaire":[
            "",
            "Il n'y a que 69 tomes.",
            "a:choque ...69?",
            "Oh, ce n'est rien ça!",
            "Vous les jeunes, vous ne lisez plus assez...*soupir*",
            "a Pourquoi ce chiffre?",
            "Des rumeurs prétendent qu'il existerait un 70ème tome qui contiendrait la totalité du savoir des 69 tomes, si ce n'est plus.",
            "a Où avez-vous entendu parlé ces rumeurs?",
            "Cela vous intéresse?",
            "Eh bien, c'est un homme habillé de manière étrange, comme vous, qui m'en a parlé. Un étranger de ces terres.",
            "Maintenant que j'y pense, lui aussi souhaitait rentrer chez lui. Il est resté quelques temps à Ostia et a appris notre langue.",
            "a Et cette personne, où est-elle maintenant?",
            "... Ça, je l'ignore. Il est parti vers la forêt, et on ne l'a plus jamais revu.",
            "a (La forêt ? Est-ce que ce mage de pacotille saurait quelque chose?)",
            "a ...",
            "Bien sûr, je vous conseille de les lire dans l'ordre. Conseil de bibliothécaire.",
            "Bien que nous ne proposions pas encore de textes complets, j'espère que vous apprécierez nos livres ici présent.",

        ],
        "Le bibliothécaire_niveau":[
            //"",
            "Quels livres (niveaux) avez-vous besoin? (Valider avec Enter)",   
        ],
        "Le marchand(pasfini)":[
            //"",
            "a ...",
            "Marchand louche: Bonjour, l'ami. Est-ce que l'un de mes produits vous intéresserait?",
            "a ...",
            "a Qu'avez-vous à vendre?",
            "Marchand louche: Oh, bien des choses. Autant des choses utiles que superflus.",
            "Marchand louche: Regardez cette idole par exemple. Elle vous garantit à 100% de recevoir la bénédiction des dieux.",
            "a (Hmm, ça pourrait m'éviter de soigner par mégarde mon adversaire.)",
            "a Combien est-elle?",
            "Marchand louche: Oh, seulement 100'000 pièces",
            "a Autant ?!",
            "Marchand louche: Ce n'est pas cher payé pour avoir la bénédiction des dieux. Alors, vous la prenez?",
            "a ...",
            "a Je suppose que vous ne faites pas de ristourne?",
            "Marchand louche: Bien sûr que non! J'ai un business à faire tourner!",
            "a (Hmm... )",
            "Marchand louche: Mais j'accepte également... un autre type de monnaie si vous voyez ce que je veux dire.",
            "a C'est-à-dire?",
            "Marchand louche: Comme vous le savez, le savoir, c'est le pouvoir.",
            "Si vous atteignez un certain niveau de connaissance, je serai prêt à vous le céder.",
            "a (Parle-t-il du Score?)",
            "a (Parfait, ce sera plus facile que je ne le pensais. Je n'aurais qu'à faire une énième fois mon apprentissage de Rosa et j'aurai assez pour me le payer.)",
            "Marchand louche: Bien sûr, je le saurai si vous n'avez pas progressé ou si vous vous amusez à ne pas essayer d'apprendre d'autres choses. Relire, c'est bien, mais si on fait toujours la même chose, on n'apprend plus.",
            "a (Zut...)",
            "a (Je suppose que même ici, il n'y a pas d'argent facile...)",
            "Marchand louche: Revenez me voir lorsque vous aurez 100'000 en connaissance.",
            "Marchand louche: Pour le moment, vous avez f'${score_global}'",
        ],
   
             
    });

    const screenWidth = width();
const screenHeight = height();



//-------------------------MENU D'ENTRéE--------------------

scene("menu1", () => {
    add([
        text("Menu Principal", { size: 32 }),
        pos(center().x, 80),

    ]);

//Charger ou créer nouvelle partier
    const nouveauBtn = add([
        text("Recommencer une partie", { size: 24 }),
        pos(center().x, 160),
        area(),
        "recommencer"
    ]);

    const chargerBtn = add([
        text("Charger une partie", { size: 24 }),
        pos(center().x, 220),
        area(),
        "charger"
    ]);


    nouveauBtn.onClick(() => {
        go("Prologus"); //A minima mettre une scène, sinon plante
    });

    // Charger fichier JSON
    chargerBtn.onClick(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async () => {
  const file = input.files[0];
  const text = await file.text();
  const data = JSON.parse(text);

  score_global = data.score_global;
  niveau_joueur = data.niveau_joueur;
  position = data.position;
  currentScene = data.scene || "jeu";

  go(currentScene); // ATTENTION IL FAUT METTRE CETTE VARIABLE PARTOUT SINON, çA NE MARCHE PAS --> il y a quelques rares scènes où c'est impossible de sauvegarder aux risques d'erreurs
};


        input.click();
    });
});

go("menu1");


//------------------SAUVEGARDE & SCORE GLOBAL------------------------
// // Données du jeu

let score_global = 150;
let niveau_joueur = 3;
let position = { x: 120, y: 450 };
let currentScene ="Prologus" //PAR DéFAUT POUR QU'UNE NOUVELLE PARTIE SE LANCE
let scenesReussies = []; // Liste des scènes déjà complétées --> PERMET D'éVITER LES DOUBLES POINTS
// Fonction pour sauvegarder
function sauvegarder() {
  const sauvegarde = {
    score_global,
    niveau_joueur,
    position,
    scene: currentScene, // scène active
    scenesReussies, //Pour le score
  };

  downloadJSON("sauvegardes/partie_1.json", sauvegarde);
}

function chargerSauvegarde(data) {
  score_global = data.score_global ?? score_global;
  niveau_joueur = data.niveau_joueur ?? niveau_joueur;
  position = data.position ?? position;
  currentScene = data.scene ?? currentScene;
  scenesReussies = Array.isArray(data.scenesReussies) ? data.scenesReussies : [];

  console.log("Sauvegarde chargée avec succès :", {
    score_global,
    niveau_joueur,
    position,
    currentScene,
    scenesReussies,
  });
}
//s pour save
document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "s") {
    event.preventDefault();
    sauvegarder();
  }
});


// Fonction pour ajouter (ou pas) des points si la scène n'a jamais été réussie/est déjà réussi.
function sceneReussie(sceneId, points) {
  if (!scenesReussies.includes(sceneId)) {
    score_global += points;
    scenesReussies.push(sceneId);
    sauvegarder();
    console.log(`Bravo ! Tu as gagné ${points} points en finissant ${sceneId}.`);
  } else {
    console.log(`La scène "${sceneId}" a déjà été complétée. Aucun point ajouté.`);
  }
}
//Pour declinaison (vers scène biblio)
function onDeclinaisonComplete(declinaison) {
  const sceneId = `Declinaison-${declinaison}`;
  sceneReussie(sceneId, 50);
}
window.saveManager = {
  sauvegarder,
  chargerSauvegarde,
  onDeclinaisonComplete,
  get score() {
    return score_global;
  },
  get currentScene() {
    return currentScene;
  },
  set currentScene(value) {
    currentScene = value;
  },
  get position() {
    return position;
  },
  set position(value) {
    position = value;
  },
};
//récupération du fichier de sauvegarde --> ne peut qu'être écrit ainsi.
fetch("sauvegardes/sauvegardes_partie_1.json")
  .then(res => res.json())
  .then(data => {
    saveManager.chargerSauvegarde(data);
    go(saveManager.currentScene);
  })

//--------------------INTRODUCTION---------------------

scene("Prologus", () => {
    currentScene="Prologus"
    let murgauche = add([
    rect(10, height()),      
    pos(0, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0, 0),        
]);
let murdroite =  add([
    rect(1, height()),       
    pos(1800, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0, 0),       
]);

let criquet = loadMusic("Criquet", "musique_rendu/ANMLInsc_Chant insecte (ID 1052)_LS.mp3")
let talk = loadMusic("Talk", "musique_rendu/atmosphere-mystic-fantasy-orchestral-music-335263.mp3")

//animation de la caméra descendante
const cameraStartY = -200;
const cameraEndY = 650;
let camAnimTime = 0;
const camAnimDuration = 2;

let inputLocked = false;

    let fadeStarted = false;
    let fadeDuration = 2; // en secondes
    let fadeTime = 0;
    let camAnimStarted = false;

    let pressSpaceText = null;
    
const delayBeforeCamMove = 1.5; // seconde de pause après fade
let camDelayTimer = 0;
let talkMusicPlayed = false;

const titleText = add([
    text("Prologus - Presser Enter", {
        size: 48,
        width: width(),
        align: "center"
    }),
    pos(center().x, 100),
    anchor("center"),
    layer("ui"),
]);

function startCameraAnim() {
    kamera.camPos(vec2(width() / 2, cameraStartY));
    camAnimStarted = true;
    camAnimTime = 0;
}
let interactionCooldown = 0;

onUpdate(() => {
    if (!inputLocked) {
    inactivityTime += dt();
    if (inactivityTime >= inactivityLimit && !hintShown) {
        showHintText();
    }
}

        if (interactionCooldown > 0) {
        interactionCooldown -= dt();
    }
    if (fadeStarted && fade.opacity < 1 && !camAnimStarted) {
        fadeTime += dt();
        fade.opacity = Math.min(fadeTime / fadeDuration, 1);
        if (fade.opacity >= 1) {
            camAnimStarted = true;
            camDelayTimer += dt();
            startCameraAnim();
        }
    }

        //supprime le titre avant le début de l'animation, mais marche pas vraiment pour l'instant...
        if (camDelayTimer >= delayBeforeCamMove && titleText) {
            startCameraAnim();
            camAnimStarted = true;
            destroy(titleText);
    }

    if (camAnimStarted && camAnimTime < camAnimDuration) {
        camAnimTime += dt();
        const t = camAnimTime / camAnimDuration;
        const lerpedY = lerp(cameraStartY, cameraEndY, t);
        kamera.camPos(vec2(width() / 2, lerpedY));
        fade.opacity = 1 - t;

        if (!talkMusicPlayed) {
           talk = play("Talk", {
                loop: true,
                volume: 1,//0.8
            });
           criquet = play("Criquet", {
                loop: true,
                volume: 1,//0.8
            });
            talkMusicPlayed = true;
        }
     if (!loquace.start()) {
    inactivityTime += dt();
    if (inactivityTime > inactivityLimit && !hintShown) {
        showHintText();
    }
 
        if (player.pos.x < 0) {
            cleanUpScene()
                    if (talk) talk.stop();
        if (criquet) criquet.stop();
            position.x = width() - 10; // à droite
            go("Forêt");
        }
        if (player.pos.x > screenWidth) {
            cleanUpScene()
        if (talk) talk.stop();
        if (criquet) criquet.stop();

            position.x = 10; //à gauche
            go("Forêt");
        }
    
    }
    
}

        if (camAnimStarted && camAnimTime < camAnimDuration) {
            camAnimTime += dt();
            const t = camAnimTime / camAnimDuration;
            const lerpedY = lerp(cameraStartY, cameraEndY, t);
            kamera.camPos(vec2(width() / 2, lerpedY));

          
            fade.opacity = 1 - t;

    const isDialogueActive = get("loquaceDialog").length > 0;

    if (isDialogueActive) {
        inactivityTime = 0;

        if (hintShown) {
            hideHintText();
            hintShown = false;
        }

        return;
    }

    //  temps d'inactivité
    inactivityTime += dt();

    //  hint après inactivité
    if (inactivityTime >= inactivityLimit && !hintShown) {
        showHintText();
    } onKeyPress(() => {
    inactivityTime = 0;
});

   
}
});

    onKeyPress("enter", () => {

    if (!fadeStarted) {
        fadeStarted = true;

        //destroy(pressSpaceText);
        play("startSound"); //son de début
    }
      }
      )
onKeyPress("space", () => {
    const progressed = loquace.next();

    if (activeDialogue === "Duel") {
        duelDialogueCounter++;

  
        if (duelDialogueCounter === 8) {//8 //3 --> à modifier si le texte est réécrit
            showChoiceMenu();
        }
    }

    
    if (!progressed) {
        loquace.clear();
        inputLocked = false;
    activeDialogue = null;

        if (activeDialogue === "dialogue") {
            dialogueDone = true;
        }

        // reset
        activeDialogue = null;
        duelDialogueCounter = 0;
    }
});

const fade = add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0), 
    fixed(), 
    layer("ui")
]);

function startCameraAnim() {
    kamera.camPos(vec2(width() / 2, cameraStartY));
    camAnimStarted = true;
    camAnimTime = 0;
}


kamera.camPos(vec2(width() / 2, -200));

const targetCamPos = vec2(width() / 2, 650);


add([
    sprite("NuitIntro"),
    //scale(10),
    pos(0,-720),
    scale(width() / 1000, height() / 1000), 
    layer("bg"),    
])
    
    //Joueur 
const player = kamera.add([
    sprite("alvares"),   
    pos(1500, 600),//200,600     
    rotate(0),        
    scale(5),
    area(),
    body({isStatic: false}),
    opacity(1),
    //animate(),
    "Alvares",
    //body({ isStatic: true }),
]) 
let dodoTimeout;
let dodoEndTimeout;

// reset le timer d'inactivité
function resetDodoTimer() {
    if (dodoTimeout) clearTimeout(dodoTimeout);
    if (dodoEndTimeout) clearTimeout(dodoEndTimeout);

    dodoTimeout = setTimeout(() => {
        player.play("dodo");

       
        dodoEndTimeout = setTimeout(() => {
            player.play("idle");
            resetDodoTimer();
        }, 10000); // 3000 ms = 3 sec

    }, 10000); //10000 10 secondes d'inactivité
}

// Mouvements
["left", "right", "up", "down"].forEach((key) => {
    onKeyDown(key, () => {
        if (menuOpen || inputLocked) return;

        const dir = {
            left: [-SPEED, 0],
            right: [SPEED, 0],
            up: [0, -SPEED],
            down: [0, SPEED],
        }[key];

        player.move(...dir);

        if (key === "right") player.flipX = true;
        if (key === "left") player.flipX = false;

        // Ne pas "marche" pendant un dialogue
        if (
            !inputLocked &&
            player.curAnim() !== "marche" &&
            player.curAnim() !== "dodo"
        ) {
            player.play("marche");
        }

        userHasInteracted = true;
        inactivityTime = 0;
        hideHintText();
        resetDodoTimer();
    });
});


onUpdate(() => {
    if (
        !isKeyDown("left") &&
        !isKeyDown("right") &&
        !isKeyDown("up") &&
        !isKeyDown("down") &&
        player.curAnim() !== "idle" &&
        player.curAnim() !== "dodo"
    ) {
        player.play("idle");
    }

        if (player.pos.x > screenWidth && !inputLocked && !menuOpen && !activeDialogue) {
        console.log("Changement vers scène Forêt");
        cleanUpScene();
        if (talk) talk.stop();
        if (criquet) criquet.stop();
        go("Forêt");
    }
});



player.play("idle");
resetDodoTimer();

let inactivityTime = 0;
const inactivityLimit = 5; // secondes
let hintShown = false;
let hintText = null;
let userHasInteracted = false;

// Texte d'aide
function showHintText() {
    if (hintShown || inputLocked) return;

    hintShown = true;
    let opacityVal = 0;

    hintText = add([
        text("i: interagir | flèches: bouger | espace: passer texte", {
            size: 28,
            align: "center",
            width: width() - 100,
        }),
        pos(center().x, center().y + 200),
        anchor("center"),
        layer("ui"),
        opacity(opacityVal),
        fixed()
    ]);

    const fadeIn = onUpdate(() => {
        if (hintText && opacityVal < 1) {
            opacityVal += dt();
            hintText.opacity = Math.min(opacityVal, 1);
        }
    });
}



function hideHintText() {
    if (!hintText) return;

    let fadeOut = 1;

    const fadeOutEffect = onUpdate(() => {
        if (hintText && fadeOut > 0) {
            fadeOut -= dt();
            hintText.opacity = Math.max(fadeOut, 0);
        }

        if (fadeOut <= 0 && hintText) {
            destroy(hintText);
            hintText = null;
            hintShown = false;
        }
    });
}



if (!inputLocked) {
    inactivityTime += dt();

    if (inactivityTime >= inactivityLimit && !hintShown) {
        showHintText();
    }
}

["left", "right", "up", "down", "space", "i"].forEach((key) => {
    onKeyPress(key, () => {
        if (inputLocked) return;
        inactivityTime = 0;
        hideHintText();
    });

    onKeyDown(key, () => {
        if (inputLocked) return;
        inactivityTime = 0;
        hideHintText();
    });
});


//PNJ
    const Gaden = add([
        sprite("gaden"),  
        pos(120, 650),     
        rotate(1),       
        scale(5),
        area(),
        opacity(1),
        animate(),
        "Gaden",
        body({ isStatic: true }),
    ]); Gaden.play("idle")

//Intéraction
let dialogueDone = false;
let dialogueDone2 = false;
let activeDialogue = null;
let duelDialogueCounter = 0;
loquace.start("Duel", false)

function interact() {
       //inputLocked = true 
    if (interactionCooldown > 0 || activeDialogue) return;

    interactionCooldown = 0.5; // évite double "i"
    
    for (const col of player.getCollisions()) {
        const c = col.target;

        if (c.is("Gaden")) {
            Gaden.flipX = player.pos.x >= Gaden.pos.x;
            inactivityTime = 0;
            hideHintText();

            if (!dialogueDone) {
                inputLocked = true; 
                loquace.start("dialogue", true);
                loquace.next();
                activeDialogue = "dialogue";
                dialogueDone = true;
                inputLocked = true 
                return;
                
            }

            if (!dialogueDone2) {
                inputLocked = true; 
                loquace.start("Duel", true);
                loquace.next();
                activeDialogue = "Duel";
                duelDialogueCounter = 1;
                dialogueDone2 = true;
                   inputLocked = true 
                return;
            }
        }
    }
}

onKeyPress("i", interact);

let menuOpen = false;


function showChoiceMenu() {
    inputLocked = true 
        menuOpen = true;
    const options = ["Oui", "Non"];
    const choiceTexts = [];

    let selectedIndex = 0;

    const baseY = height() / 2 + 100;

    function updateSelection() {
        for (let i = 0; i < choiceTexts.length; i++) {
            choiceTexts[i].color = i === selectedIndex ? rgb(255, 255, 0) : rgb(255, 255, 255); // Jaune pour sélection
        }
    }

    //  options
    options.forEach((opt, i) => {
        const txt = add([
            text(opt, { size: 32 }),
            pos(center().x, baseY + i * 40),
            anchor("center"),
            layer("ui"),
            "choiceOption"
        ]);
        choiceTexts.push(txt);
    });

    updateSelection();

    onKeyPress("up", () => {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        updateSelection();
    });

    onKeyPress("down", () => {
        selectedIndex = (selectedIndex + 1) % options.length;
        updateSelection();
    });

    onKeyPress("enter", () => {
        destroyAll("choiceOption");
        menuOpen = false;
        if (options[selectedIndex] === "Oui") {
            cleanUpScene();
            talkMusicPlayed = false;
        if (talk) talk.stop();
        if (criquet) criquet.stop();
        if (murdroite) destroy(murdroite); 
            go("BossGaden");
        } else {
             if (murdroite) destroy(murdroite); 
            loquace.clear(); 
        }
    });
}

//Gravité
setGravity(600) //800

//DEPLACEMENT DU PERSONNAGE
    onKeyDown("left", () => {
        
        if (menuOpen) return;
        //if (inputLocked) return;
        player.move(-SPEED, 0)
        player.flipX = false;
            userHasInteracted = true;
    inactivityTime = 0;
    hideHintText();

    })
    
    onKeyDown("right", () => {
if (menuOpen || inputLocked) return;
        player.flipX = true;
        player.move(SPEED, 0)
            userHasInteracted = true;
    inactivityTime = 0;
    hideHintText();
    })
    
    onKeyDown("up", () => {
if (menuOpen || inputLocked) return;
        player.move(0, -SPEED)
            userHasInteracted = true;
    inactivityTime = 0;
    hideHintText();
    })
    
    onKeyDown("down", () => {
if (menuOpen || inputLocked) return;
        player.move(0, SPEED)
            userHasInteracted = true;
    inactivityTime = 0;
    hideHintText();
    })
        onKeyDown("i", () => {
if (menuOpen || inputLocked) return;
            userHasInteracted = true;
    inactivityTime = 0;
    hideHintText();
    })

// Sol
    add([
        rect(width(), 1000),
        pos(0, 800),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);


    function cleanUpScene() {


    destroyAll();   
    if (loquace && loquace.clear) loquace.clear();

}
})
//VéRIF HP après test code
//CHAQUE BOSS A UN CODE SIMILAIRE: CE QUI CHANGE :  BACKGROUND IMAGE, IMAGE BOSS/ANIMATION, MUSIQUE, DIALOGUES (S'IL Y A), CONST FILES (LE VOC ENTRAINé)
scene("BossGaden", () => {
//Barre boss = longuer vocab
//Esthéqieu textes
//Background
//Animation du personnage

//NIVEAU : DIALOGUE, BOSS IMAGE/FONDS, MUSIQUE, VOCABULAIRE TOTAUX!
let bell = loadSound("bell", "musique_rendu/inspiring-emotional-uplifting-piano-112623.mp3")
//Fonds
   //CIEL
    add([sprite("Cielnuit"),
    scale("2")
    ]);
    // Charger l'audio et commencer la musique
    bell = play("bell", {
        volume: 1,
        speed: 1,
        loop: true,
        paused: true,
    });

    bell.paused = false;
    //onKeyPress("m", () => bell.paused = !bell.paused);


   loadSpriteAtlas("sprite/gaden.png", {
    "gaden": {
        "x": 0,
        "y": 0,
        width: 160,
        height: 160,
        sliceX: 5,
        sliceY: 5,
        "anims": {
            "idle": {
                "from": 0,
                "to": 21,
                "speed": 5,
                "loop": true,
            },
        },
    },

    //avatar.animate("color", [RED, WHITE], {
      //  duration: 1,
        //direction: "forward",
    //},
    //"pos", [vec2(500, 750), vec2(550, 750)], {
      //  duration: 100,
        //direction: "ping-pong",
    });


    // Avatar du personnage
    const avatar = add([
        sprite("gaden"),
        scale(10),
        anchor("center"),
        pos(center().sub(0, 50)),
        opacity(1),
        animate(),
        //area({ shape: new Rect(vec2(0, 6), 12, 12) }),
        //body(),
        //tile(),
    ]); avatar.play("idle")

     //des variables du jeu
    let santeJoueur = 6;//6
    let santeBoss = 100;  //100 par défaut --> faire longueur des vocs dans l'idéal
    let specialBarre = 0;
    let Question = null;
    let Choix = [];
    //  des barres de santé
    let barreBoss;
    let barreJoueur;
    let barreSpecial;
    let miracleMessage = null;


    initBarres();
    tour();

    function initBarres() {
        barreBoss = add([
            rect(300, 75),
            outline(4),
            area(),
            pos(0, 0),
            color(255, 102, 102),
            outline(4, rgb(255, 255, 255)),
            z(5),
        ]);

        barreJoueur = add([
            rect(300, 75),
            outline(4),
            area(),
            pos(0, 100),
            color(204, 255, 153),
            outline(4, rgb(255, 255, 255)),
            z(5),
        ]);

        barreSpecial = add([
            rect(0, 75),
            outline(4),
            area(),
            pos(0, 200),
            color(255, 255, 153),
            outline(4, rgb(255, 255, 255)),
            z(5),
        ]);
    }

    // Fonction pour réponses
    let bonneReponse = null;
    let y = null;
    const i = 5;

    function select(choice) {
        const correct = choice === bonneReponse;
        if (correct) {
            santeBoss -= 1;//-=5 // Ici le -1 et 100 pv --> 100 réponses correctes
            //santeJoueur += 0.5;
            //specialBarre += 5;
            specialBarre = Math.min(specialBarre + 1, 10); //max 10

            barreBoss.width = (santeBoss / 100) * 300;
            barreJoueur.width = (santeJoueur / 6) * 300;
            barreSpecial.width = (specialBarre / 100) * 300;

            barreBoss.color = rgb(255 - santeBoss * 2, 102, 102);
            barreJoueur.color = rgb(204 - santeJoueur * 10, 255, 153);
            barreSpecial.color = rgb(255 - specialBarre * 2, 255, 153);

            loquace.clear('dialogue', true);
            loquace.clear('?', true);
              //const playerdialogue = loquace.script({
                //"?": ["a:test ?"]
            //});

        } else {
            santeJoueur -= 0.5;
            barreJoueur.width = (santeJoueur / 6) * 300;
            barreJoueur.color = rgb(255, 80, 80);

            //avatar.animate("color", [RED, WHITE], {
              //  duration: 0.5,
                //direction: "forward",
            //});

            const bossdialogue = loquace.script({
                "!": ["g:blink N'as-tu pas appris ça?",
                ],
            });

            loquace.start('!', true);
            loquace.start('?', true);
        }

        màjsanté();

        if (santeJoueur <= 0 || santeBoss <= 0) {
            findepartie();
        } else {
            tour();
        }
    }

    // texte vide pour mettre la question
    let questionText = add([
        text("", { size: 36 }),//36
        pos(350, 100),//550, 100
        color(WHITE),
        z(10),
    ]);

    let choixElements = [];

function afficherQuestionEtChoix(question, choices) {
    questionText.text = question;

    // supprime choix
    for (const el of choixElements) {
        destroy(el);
    }
    choixElements = [];

    // Base de placement Y
    let yBase = 350;//350

    //Son pour sélection case
loadMusic("select", "music/mixkit-bonus-earned-in-video-game-2058.wav")

let clickLocked = false; // Cooldown flag
choices.forEach((choice, index) => {
    const choiceY = yBase + index * 60;

    const bg = add([
        rect(1700, 50),//600, 50
        pos(10, choiceY + 300),
        color(rgb(50, 50, 50)),// 50, 50, 50
        z(9),
        area(),
        scale(1),
        "choice-bg",
    ]);

    const choiceText = add([
        text(choice, { size: 32 }),
        pos(10, choiceY + 308),
        area(),
        color(WHITE),
        z(10),
        "choice-text",
    ]);

    const confirmFlash = (success) => {
        const flashColor = success ? rgb(0, 255, 0) : rgb(255, 50, 50);
        bg.use(color(flashColor));
        wait(0.2, () => bg.use(color(rgb(50, 50, 50)))); 
    };

    const handleClick = () => {
        if (clickLocked) return;

        clickLocked = true;
        play("select");

        const isCorrect = (choice === bonneReponse);
        confirmFlash(isCorrect);

        select(choice);

        wait(0.5, () => {
            clickLocked = false;
        });
    };

    bg.onClick(handleClick);
    choiceText.onClick(handleClick);

    bg.onHover(() => {
        bg.use(color(rgb(90, 90, 0)));
        choiceText.use(color(rgb(255, 255, 0)));
        bg.use(scale(1.03));
    });

    bg.onHoverEnd(() => {//pour rectangles où on sélectionne les choix de réponses
        bg.use(color(rgb(50, 50, 50)));
        choiceText.use(color(WHITE));
        bg.use(scale(1));
    });

    choixElements.push(bg, choiceText);
});



}


    async function tour() {
        const vocablatin = await Vocabulaire();
        const { question, choices } = generateQuestion(vocablatin);
        afficherQuestionEtChoix(question, choices);
    }

function màjsanté() {
    // Met à jour les tailles
    barreBoss.width = (santeBoss / 100) * 300;
    barreJoueur.width = (santeJoueur / 6) * 300;
    barreSpecial.width = (specialBarre / 10) * 300;

    // barreJoueur
    const ratioJoueur = santeJoueur / 6;
    if (ratioJoueur > 0.5) {
        // Vert -->Jaune
        const t = (1 - ratioJoueur) * 2;
        barreJoueur.color = rgb(
            0 + t * 255,    
            255,            
            0               
        );
    } else {
        // Jaune -->Rouge
        const t = (0.5 - ratioJoueur) * 2;
        barreJoueur.color = rgb(
            255,
            255 - t * 255,  
            0
        );
    }

    // barreBoss
    const ratioBoss = santeBoss / 100;
    if (ratioBoss > 0.5) {
        // Rouge clair -->Rouge moyen
        const t = (1 - ratioBoss) * 2;
        barreBoss.color = rgb(
            255,
            102 - t * 50,   
            102 - t * 50    
        );
    } else {
        // Rouge moyen -->Rouge foncé
        const t = (0.5 - ratioBoss) * 2;
        barreBoss.color = rgb(
            255,
            52 - t * 50,    
            52 - t * 50
        );
    }
}


//CODE BARRE SPéCIAL
let specialReady = false;

loop(0.1, () => {
    if (specialBarre >= 10 && !specialReady) {
        specialReady = true;
        animateSpecialBarre();

        // message miracle
        if (!miracleMessage) {
            miracleMessage = add([
                text("Appuyez sur W pour utiliser le miracle (soin ou révélation)... mais attention.", { size: 24 }),
                pos(300, 225),
                color(YELLOW),
                z(20),
                "miracle-msg",
            ]);
        }
    } else if (specialBarre < 10 && specialReady) {
        specialReady = false;
        barreSpecial.use(color(255, 255, 153));

        if (miracleMessage) {
            destroy(miracleMessage);
            miracleMessage = null;
        }
    }
});


function animateSpecialBarre() {
    if (!specialReady) return;
    barreSpecial.use(color(255, 255, 0));
    wait(0.3, () => {
        barreSpecial.use(color(255, 255, 153));
        wait(0.3, () => {
            if (specialReady) animateSpecialBarre();
        });
    });
}

onKeyPress("w", () => {
    if (specialBarre >= 10) {
        //  malus (1 chance sur 10)
        const isMalus = Math.random() < 0.1;

        if (isMalus) {
            const typeMalus = Math.random();
            if (typeMalus < 0.5) {
                // vie du joueur à 0.5
                santeJoueur = 0.5;
                barreJoueur.width = (santeJoueur / 6) * 300;
            } else {
                // Soigne le boss (entre 50% et 100%)
                const soin = 50 + Math.floor(Math.random() * 51); // entre 50 et 100
                santeBoss = Math.min(100, santeBoss + soin);
                barreBoss.width = (santeBoss / 100) * 300;
            }
        } else {
            // Effet bénéfique
            const effet = Math.random();
            if (effet < 0.5) {
                // Soin
                santeJoueur = 6;
                barreJoueur.width = (santeJoueur / 6) * 300;
            } else {
                // clignotement bonne réponse
                for (const choiceEl of choixElements) {
                    if (choiceEl.text === bonneReponse) {
                        let count = 0;
                        function blink() {
                            choiceEl.use(color(count % 2 === 0 ? rgb(0, 255, 0) : WHITE));
                            count++;
                            if (count < 20) {
                                wait(0.2, blink);
                            }
                        }
                        blink();
                    }
                }
            }
        }


        specialBarre = 0;
        barreSpecial.width = 0;
        specialReady = false;
        barreSpecial.use(color(255, 255, 153));

        //supprime message
        if (miracleMessage) {
            destroy(miracleMessage);
            miracleMessage = null;
        }

        màjsanté();
    }
});








    function findepartie() {
        if (santeJoueur <= 0) {
            resultatduel = -1;
            cleanUpScene();
            //go("FinBossGaden");
        if (bell) bell.stop();
            go("ResultScene", { win: false });

        } else if (santeBoss <= 0) {
            resultatduel = +1;
            cleanUpScene();
            //go("RéussiBossGaden");
            if (bell) bell.stop();
            go("ResultScene", { win: true });

        }
    }

    function cleanUpScene() {
        if (bell && bell.stop) bell.stop();
        destroyAll();
        if (loquace && loquace.clear) loquace.clear();
        santeJoueur = 6;
        santeBoss = 100;
        specialBarre = 100;
    }

    async function Vocabulaire() {
        const files = [
            'vocabulaire_latin_dico_bachelor_discipline_latin/ALLDICO.txt',
        ];

        let vocablatin = [];
        for (const file of files) {
            const response = await fetch(file);
            const text = await response.text();
            const lines = text.split(/\r?\n/);
            lines.forEach(line => {
                const [latin, french] = line.split('\t');
                if (latin && french) {
                    vocablatin.push({ latin, french });
                }
            });
        }

        return vocablatin;
    }

    function generateQuestion(vocablatin) {
        const question = vocablatin[Math.floor(Math.random() * vocablatin.length)];
        const correctReponse = question.french;
        bonneReponse = correctReponse;

        const wrong = vocablatin.filter(item => item.french !== correctReponse)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
            .map(item => item.french);

        const choices = [correctReponse, ...wrong].sort(() => Math.random() - 0.5);
        Question = question.latin;
        Choix = choices;

        return {
            question: `Quel est la traduction de "${Question}" ?`,
            choices
        };
    }

    // Démarrer le jeu
    tour();
});
//BUG WIN
scene("FinBossGaden", () => {
    add([
        sprite("Alvaresdodo"),
        area(),
        outline(2),
        pos(320,720),
        anchor("center"),
        //color(193,210,255),
        scale(20),
        layer("ui"),
    ]);

    add([
        text("Fin de la partie ! Ne dors pas sur tes révisions!", { size: 48 }),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text("Appuie sur Espace pour recommencer ou Enter pour quitter (attention, vous abandonnez le combat définitivement!)", { size: 24 }),
        pos(center().x, center().y + 60),
        anchor("center"),
    ]);


    onKeyPress("space", () => {
        if (failMusic) {
        failMusic.stop(); 
        failMusic = null;
    }
        gameState.score = 0;
        gameState.erreurs = 0;
        go("BossGaden");
    });

        onKeyPress("enter", () => {
        if (failMusic) {
        failMusic.stop(); 
        failMusic = null;
    }
        gameState.score = 0;
        gameState.erreurs = 0;
        go("ResultScene");
    });
});
//BUG WIN
scene("RéussiBossGaden", () => {
    add([
        sprite("Alvaresdodo"),
        area(),
        outline(2),
        pos(320,720),
        anchor("center"),
        //color(193,210,255),
        scale(20),
        layer("ui"),
    ]);

    add([
        text("Fin de la partie ! Tu peux dormir sereinement.", { size: 48 }),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text("Appuie sur Enter pour quitter.", { size: 24 }),
        pos(center().x, center().y + 60),
        anchor("center"),
    ]);

        onKeyPress("enter", () => {
        if (failMusic) {
        failMusic.stop(); 
        failMusic = null;
    }
        gameState.score = 0;
        gameState.erreurs = 0;
        go("ResultScene");
    });
});
//Faut ajouter un item en cas de réussite et l'ajouter à l'inventaire?
//BUG DU DEUXIèME DIALOGUE  "Tu n'es pas parti?"
scene("ResultScene", ({win}) => {
//currentScene="ResultScene" --> Pas sauvegardable en l'état, à cause de la valeur win qui change dialogues

add([
    rect(10, height()),       
    pos(0, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0, 0),         
]);

    const cameraStartY = -200;
    const cameraEndY = 650;
    let camAnimTime = 0;
    const camAnimDuration = 2;
    let camAnimStarted = false;

    kamera.camPos(vec2(width() / 2, cameraStartY));

    let inputLocked = false;
    let inactivityTime = 0;
    const inactivityLimit = 5;
    let hintShown = false;
    let hintText = null;
    let pressSpaceText = null;
    let duelDialogueCounter = 0;
    let activeDialogue = null;
    let dialogueDone = false;
    let dialogueDone2 = false;
add([
    sprite("NuitIntro"),
    //scale(10),
    pos(0,-720),
    scale(width() / 1000, height() / 1000), 
    layer("bg"),    
])
const player = kamera.add([
    sprite("alvares"),   
    pos(1500, 600),//200,600     
    rotate(0),        
    scale(5),
    area(),
    body({isStatic: false}),
    opacity(1),
    //animate(),
    "Alvares",
    //body({ isStatic: true }),
])
    player.play("idle");


//PNJ
    const Gaden = add([
        sprite("gaden"),  
        pos(120, 650),     
        rotate(1),       
        scale(5),
        area(),
        opacity(1),
        animate(),
        "Gaden",
        body({ isStatic: true }),
    ]); Gaden.play("idle")


    function showHintText() {
        if (hintShown || inputLocked) return;
        hintShown = true;

        hintText = add([
            text("i: interagir | flèches: bouger | espace: passer texte", {
                size: 28, align: "center", width: width() - 100
            }),
            pos(center().x, center().y + 200),
            anchor("center"), layer("ui"), opacity(0.5), fixed()
        ]);
    }

    function hideHintText() {
        if (hintText) destroy(hintText);
        hintShown = false;
    }

    function cleanUpScene() {
        destroyAll();
        loquace.clear();
    }


let fond = loadMusic("Fond", "musique_rendu/ANMLInsc_Chant insecte (ID 1052)_LS.mp3")
let victoire = loadSound("Victoire", "musique_rendu/soft-background-piano-285589.mp3");
let défaite = loadSound("Défaite", "musique_rendu/sad-waltz-piano-216330.mp3");


  fond = play("Criquet", {
        loop: true, speed: 1, detune: -120, seek: 5, volume:0.5,
    });



let resultatduel; // -1 = perdu, 1 = gagné
//if (win = true) {resultatduel+1} else if (win = false){resultatduel-1}
let dialogueDone1 = false
let interactionCooldown = 0

function interact() {
    //if (inputLocked) return;

if (interactionCooldown > 0 || activeDialogue) return;

    interactionCooldown = 0.5; // évite double "i"
    
    for (const col of player.getCollisions()) {
        if (col.target.is("Gaden")) {
            Gaden.flipX = player.pos.x >= Gaden.pos.x;
            inputLocked = true;

            if (duelDialogueCounter === 0) {
                const resultKey = win ? "Duelréussite" : "Dueldéfaite";
                loquace.start(resultKey, true);
                activeDialogue = resultKey;
                inputLocked = true 
                duelDialogueCounter = false
                dialogueDone1 = true
                return
            } 
            if (dialogueDone1) {
                inputLocked = true;
                loquace.start("Pasparti", true);
                activeDialogue = "Pasparti";
                duelDialogueCounter = 1;
                dialogueDone1 = true;
                inputLocked = true 
                return;

            } else {
            
                inputLocked = false;
            }


        }
    }
}




    function startCameraAnim() {
        camAnimStarted = true;
        camAnimTime = 0;
    }

    let camDelayTimer = 0;
    let delayBeforeCamMove = 1.5;

    onUpdate(() => {


        if (player.pos.x < 0) {
            cleanUpScene()
            position.x = width() - 10;
            go("Forêt");
        }


        if (player.pos.x > screenWidth) {
            cleanUpScene()
        if (fond) fond.stop();
        if (win === false) {if (défaite) défaite.stop();}
        if (win === true) {if (victoire) victoire.stop();}
            position.x = 10; 
            go("Forêt");
        }
        
        if (!camAnimStarted) {
            camDelayTimer += dt();
            if (camDelayTimer > delayBeforeCamMove) {
                startCameraAnim();
            }
        } else {
            camAnimTime += dt();
            const t = Math.min(camAnimTime / camAnimDuration, 1);
            kamera.camPos(vec2(width() / 2, lerp(cameraStartY, cameraEndY, t)));
        }

        const isDialogueActive = get("loquaceDialog").length > 0;
        if (isDialogueActive) {
            inputLocked = true;
            inactivityTime = 0;
            hideHintText();
            return;
        } else {
            inputLocked = false;
        }

        inactivityTime += dt();
        if (inactivityTime >= inactivityLimit && !hintShown) {
            showHintText();
        }
        if (inputLocked) return;

    if (isKeyDown("left")) {
        player.move(-SPEED, 0);
        player.flipX = false;
    }

    if (isKeyDown("right")) {
        player.move(SPEED, 0);
        player.flipX = true;
    }

    if (isKeyDown("up")) {
        player.move(0, -SPEED);
    }

    if (isKeyDown("down")) {
        player.move(0, SPEED);
    }
    });

 onKeyPress("space", () => {
    const progressed = loquace.next();

    if (!progressed) {
        loquace.clear();
        inputLocked = false;
        activeDialogue = null;

        duelDialogueCounter++;
    }

    inactivityTime = 0;
    hideHintText();
});



    onKeyPress("i", () => {
        interact();
        inactivityTime = 0;
        hideHintText();
    });

    // Déplacement
   const SPEED = 320;

onKeyDown(() => {
    if (inputLocked) return;

    if (isKeyDown("left")) {
        player.move(-SPEED, 0);
        player.flipX = false;
    }

    if (isKeyDown("right")) {
        player.move(SPEED, 0);
        player.flipX = true;
    }

    if (isKeyDown("up")) {
        player.move(0, -SPEED);
    }

    if (isKeyDown("down")) {
        player.move(0, SPEED);
    }

    inactivityTime = 0;
    hideHintText();
});

//Gravité
setGravity(600) //800

        onKeyDown("i", () => {
    inactivityTime = 0;
    hideHintText();
    })
    
// Sol
    add([
        rect(width(), 1000),
        pos(0, 800),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);


    if (win === true) {
     victoire = play("Victoire");
} else {
    défaite = play("Défaite"); 
}

});


scene("Forêt", () => {
currentScene="Forêt"
add([
    rect(10, height()),      
    pos(0, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0, 0),        
]);

    setGravity(600);

    add([
        sprite("NuitIntro"),
        pos(0, 0),
        scale(width() / 1000, height() / 1000),
        layer("bg"),
    ]);

    // Sol
    add([
        rect(width(), 1000),
        pos(0, 800),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);
let forêt = loadSound("Forêt", "musique_rendu/soft-background-piano-285589.mp3")
forêt = play("Forêt", {
    speed: 1,//1.25
    loop: true,
    seek: 5,
    detune: -120,//-120,//-1200
})
    addLevel([
        "0 0 0 0 0 0 0 0 0 0  0  0  0  0  0  0000000000000",
        "",
        "              -       -       1                        "
       ],{
        tileWidth: 56,
        tileHeight: 56,
        scale:100,
        tiles: {
                   "0": () => [
                sprite("Solfleur", { }),
                scale(10),//10
                pos(0,650),
                color(120,0,120),
                //area(),
                //body({ isStatic: true})
                ],
                 "1": () => [
                sprite("Colonne", { }),
                scale(10),
                pos(0,0),
                //color(20,0,255),
                //color(193,210,255)
                color(120,0,120),
                //area(),
                //body({ isStatic: false})
                ],
                "2": () => [
                sprite("Colonne", { }),
                scale(2),
                pos(0,0),
                color(0,0,0),
                //color(193,210,255)
                //color(120,0,120),
                //area(),
                //body({ isStatic: false})
                ],
            }})

    
    kamera.camPos(center());

    // Joueur : Alvares
    const player = kamera.add([
        sprite("alvares"),
        pos(200, 600),
        scale(5),
        area(),
        body(),
        "player",
    ]);

    player.play("idle");

      add([sprite("Colonne"),
        pos(900, 200),
        scale(10),
        color(120,0,120),
    ])

    // Fée
    const fee = add([
        sprite("fees"),
        pos(600, 600),
        scale(4),
        area(),
        body({ isStatic: true }),
        "fee",
        color(240,0,240)
    ]);

        const feechantante = add([
        sprite("fees"),
        pos(300, 450),
        scale(4),
        area(),
        //body({ isStatic: false }),
        "feechantante",
        color(0,240,240)
    ]);
        const feeblue = add([
        sprite("fees"),
        pos(100, 600),
        scale(4),
        area(),
        //body({ isStatic: true }),
        "feeblue",
        color(255,255,240)
    ]);

    // Variables dialogues
    let inputLocked = false;
    let activeDialogue = null;
    let dialogueDone = false;
    let dialogueDone2 = false;
    let duelDialogueCounter = 0;
let interactionCooldown = 0;
    function interact() {
       //inputLocked = true 
    if (interactionCooldown > 0 || activeDialogue) return;

    interactionCooldown = 0.5; // évite double "i"
    
    for (const col of player.getCollisions()) {
        const c = col.target;

        if (c.is("fee")) {
            fee.flipX = player.pos.x >= fee.pos.x;
            inactivityTime = 0;
            hideHintText();

            if (!dialogueDone) {
                inputLocked = true;
                loquace.start("FeeIntro", true);
                loquace.next();
                activeDialogue = "FeeIntro";
                dialogueDone = true;
                inputLocked = true 
                return;
                
            }
            if (dialogueDone2) {
                inputLocked = true;
                loquace.start("Fae", true);
                loquace.next();
                activeDialogue = "Fae";
                duelDialogueCounter = 1;
                dialogueDone2 = true;
                inputLocked = true 
                if(forêt) forêt.stop();
                loquace.clear(go("DeclinaisonRosa"))
                return;
            }}
             if (c.is("feeblue")) {
            fee.flipX = player.pos.x >= fee.pos.x;
            inactivityTime = 0;
            hideHintText();
                if (dialogueDone) {
                inputLocked = true; 
                loquace.start("NVAGDA", true);
                loquace.next();
                activeDialogue = "NVAGDA";
                duelDialogueCounter = 1;
                dialogueDone2 = true;
                inputLocked = true 
                //loquace.clear(go("DeclinaisonRosa"))
                return;
            }}
                if (c.is("feechantante")) {
                fee.flipX = player.pos.x >= fee.pos.x;
                inactivityTime = 0;
                hideHintText();
                if (dialogueDone) {
                inputLocked = true;
                loquace.start("Rosa", true);
                loquace.next();
                activeDialogue = "Rosa";
                duelDialogueCounter = 1;
                dialogueDone2 = true;
                inputLocked = true 
                //loquace.clear(go("DeclinaisonRosa"))
                return;
            }}
        
    }
}

    onKeyPress("i", interact);

    // Avancer le dialogue
    onKeyPress("space", () => {
        const progressed = loquace.next();

        if (!progressed) {
            loquace.clear();
            inputLocked = false;
            activeDialogue = null;
        }
    });

    // Mouvements
    const SPEED = 300;

    ["left", "right", "up", "down"].forEach((key) => {
        onKeyDown(key, () => {
            if (inputLocked) return;

            const dir = {
                left: [-SPEED, 0],
                right: [SPEED, 0],
                up: [0, -SPEED],
                down: [0, SPEED],
            }[key];

            player.move(...dir);

            if (key === "right") player.flipX = true;
            if (key === "left") player.flipX = false;

            if (player.curAnim() !== "marche" && player.curAnim() !== "dodo") {
                player.play("marche");
            }

            inactivityTime = 0;
            hideHintText();
            resetDodoTimer();
        });
    });

    function cleanUpScene() {
        music.stop();//àmodif'
        destroyAll();
        loquace.clear();
    }

    onUpdate(() => {
                if (interactionCooldown > 0) {
        interactionCooldown -= dt();
    }

        if (player.pos.x < 0) {
            cleanUpScene()
            position.x = width() - 10; 
            go("Prologus");
        }

        if (player.pos.x > screenWidth) {
            cleanUpScene()
            position.x = 10; 
            go("Champsnuit");
        }
        
        if (
            !isKeyDown("left") &&
            !isKeyDown("right") &&
            !isKeyDown("up") &&
            !isKeyDown("down") &&
            player.curAnim() !== "idle" &&
            player.curAnim() !== "dodo"
        ) {
            player.play("idle");
        }
    });

    // Inactivité -->animation dodo
    let inactivityTime = 0;
    let dodoTimeout;
    let dodoEndTimeout;

    function resetDodoTimer() {
        if (dodoTimeout) clearTimeout(dodoTimeout);
        if (dodoEndTimeout) clearTimeout(dodoEndTimeout);

        dodoTimeout = setTimeout(() => {
            player.play("dodo");

            dodoEndTimeout = setTimeout(() => {
                player.play("idle");
                resetDodoTimer();
            }, 10000);
        }, 10000);
    }

    resetDodoTimer();

    onUpdate(() => {
        if (!inputLocked) {
            inactivityTime += dt();
        }
    });


    ["left", "right", "up", "down", "i", "space"].forEach((key) => {
        onKeyPress(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
        onKeyDown(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
    });

    let hintText = null;
    let hintShown = false;

    function showHintText() {
        if (hintShown || inputLocked) return;
        hintShown = true;
        hintText = add([
            text("i: interagir | flèches: bouger | espace: passer texte", {
                size: 24,
                width: width() - 100,
                align: "center"
            }),
            pos(center().x, center().y + 200),
            anchor("center"),
            layer("ui"),
            opacity(0),
            fixed()
        ]);
    }

    function hideHintText() {
        if (hintText) {
            destroy(hintText);
            hintText = null;
            hintShown = false;
        }
    }

    onUpdate(() => {
        if (!inputLocked && inactivityTime >= 5 && !hintShown) {
            showHintText();
        }
    });
});

scene("DeclinaisonRosa", () => {

const FLOOR_HEIGHT = 64;
const SPEED = 60;
let nuagesActive = false;
let musique = null;
let currentBG = null;


    let music = [
        { id: "musique1", bg: "bg1" },
        { id: "musique2", bg: "bg2" },
        { id: "musique3", bg: "bg3" },
        { id: "musique4", bg: "bg4" }
    ];

   function playRandomMusic() {
    const choix = choose(music);

    if (musique) music.stop();
    if (currentBG) destroy(currentBG);


    const nouveauBG = add([
        sprite(choix.bg),
        pos(0, 0),
        scale(4),
        layer("bg"),
        opacity(0),
    ]);

    if (currentBG) {
        tween(currentBG.opacity, 0, 1, val => currentBG.opacity = val);
        wait(1, () => destroy(currentBG));
    }

    tween(nouveauBG.opacity, 1, 1, val => nouveauBG.opacity = val);
    currentBG = nouveauBG;

    musique = play(choix.id, { loop: true });
    musique.paused = false;

}
onKeyPress("space", () => {
    if (!musique) {
        playRandomMusic();
        if (!nuagesActive) {
            nuagesActive = true;
            spawnNuage();
        }
    } else {
        musique.paused = !musique.paused;

        if (!musique.paused && !nuagesActive) {
            nuagesActive = true;
            spawnNuage();
        }
    }
});


let sceneScore = gameState.score;

loadSprite("Ciel1", "image/cielligne.jpg")

loadSprite("Ciel", "image/cieletoiles.png")
loadSprite("Ciel1", "image/cieletoiles.png")
loadSprite("Ciel2", "image/cieletoiles.png")
loadSprite("Ciel3", "image/cieletoiles.png")


loadSprite("Nuage", "image/Nuage1.png");
loadSprite("Nuage2", "image/Nuage2.png");


// Ciel random 
let ciel = add([
    sprite(music.paused ? "Ciel1" : "Ciel"),
    pos(0, 0),
    scale(4),
    layer("bg"),
]);


const ciels = ["Ciel", "Ciel1", "Ciel2", "Ciel3", ]
let cielIndex = 0;
let cielActuel = ciel;
let transitionEnCours = false;
let changementAutomatiqueActif = false;


function changerCiel() {
    if (music.paused || transitionEnCours) return; 
    transitionEnCours = true;
    cielIndex = (cielIndex + 1) % ciels.length;
    
    let ancienCiel = ciel;

}


if (!music.paused) {
    wait(10, changerCiel);
}


onKeyPress("space", () => {
    if (!music.paused && !nuagesActive) {
        spawnNuage();
        wait(10, changerCiel);
    }
});


// Fonction nuages (appelée uniquement après SPACE)
function spawnNuage() {
    add([
        //sprite("Nuage"),
        sprite("fees"),
        opacity(0.5,1),
        pos(width(), rand(40, height() - 100)),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        scale(rand(10, 15)),
        //scale(rand(1.5, 2.5)),
        //z(0),
        layer("nuages"),
    ]);
        add([
       //sprite("Nuage2"),
        sprite("fees"),
        opacity(0.5,1),
        pos(width(), rand(40, height() - 100)),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        color(120,120,255),
        scale(rand(10, 15)),
        //scale(rand(1.5, 2.5)),
        //z(0),
        layer("nuages")
    ]);

    wait(rand(5, 10), spawnNuage);
}

    add([
        text("Clique sur une forme et choisis le(s) réponse(s)."),
        anchor("center"),
        pos(850,50),
        layer("ui"),
    ],)
  const touche = add([text("Appuie sur Espace pour commencer"),
    anchor("center"),
    pos(850,500),
    ])

//Il y a un bug connu pour l'affichage des positions quand il y en a trop (deux-trois éléments se retrouvent derrière certains rectangles), mais n'est pas trop grave en l'état car ils réapparaissent après quelques réponses correctes et n'influent pas sur les réponses de ceux au-dessus.
// Déclinaisons (formes)
const formes = [
    //Fém.
    { text: "rosae", answers: ["nominatif pluriel", "génitif singulier", "datif singulier", "vocatif pluriel"] },
    { text: "rosam", answers: ["accusatif singulier"] },
    { text: "rosis", answers: ["datif pluriel", "ablatif pluriel"] },
    { text: "rosa", answers: ["nominatif singulier", "vocatif singulier", "ablatif singulier"] },
    { text: "rosarum", answers: ["génitif pluriel"] },
    { text: "rosas", answers: ["accusatif pluriel"] },
];

// Fonctions grammaticales
const fonctions = [
    "nominatif singulier",
    "nominatif pluriel",
   
    "vocatif singulier",
    "vocatif pluriel",

    "accusatif singulier",
    "accusatif pluriel",

    "génitif singulier",
    "génitif pluriel",

    "datif singulier",
    "datif pluriel",

    "ablatif singulier",
    "ablatif pluriel",

];

let xStart = 100;
let yStart = 100;
let spacingY = 50;
let maxY = height() - 100;
let column = 0;
let row = 0;


//Perfecr score 12 sur les 6 formes --> 72 donc perfect score 720
const scoreLabel = add([
    text(`Score: ${gameState.score}`, { size: 32 }),
    pos(50, 15),
    layer("ui"),
]);
const erreurLabel = add([
    text(`Erreurs: ${gameState.erreurs}/3`, { size: 32 }),
    pos(50, 40),
    layer("ui"),
]);

function updateScoreLabel() {
    scoreLabel.text = `Score: ${gameState.score}`;
}
function updateErreurLabel() {
    erreurLabel.text = `Erreurs: ${gameState.erreurs}/3`;
}


let selectedForme = null;
const formeCards = [];


//Pour les positionner dès le départ droit (à corriger plus tard)
function positionFormes() {
    const f = formes
    // Position de départ
    let xStart = 100;
    let yStart = 100;
    let spacingY = 50;
    let maxY = height() - 100;
    let column = 0;

    formeCards.forEach((f, i) => {
        let x = xStart + column * 200;
        let y = yStart + (i % Math.floor(maxY / spacingY)) * spacingY;

        if (y >= maxY) {
            column++;
            y = yStart;
        }
        if (x >= maxX) {
            column++;
            x = xStart;
        }
        f.pos = vec2(x, y);
    });
}
positionFormes()


//   déclinaisons
formes.forEach((f, index) => {
    let x = xStart + column * 200;
    let y = yStart + row * spacingY;

    if (y >= maxY) {
        column++;
        row = 0;
        y = yStart;
        x = xStart + column * 200;
    }

    row++;

    const box = add([
        rect(150, 40, { radius: 8 }),
        pos(x, y),
        color(255, 255, 200),
        area(),
        outline(2),
        anchor("center"),
        "forme",
        layer("ui"),
        {
            text: f.text,
            answers: f.answers,
            foundAnswers: [],
            disabled: false,
        },
    ]);

box.add([
    text(f.text, {
        size: 32, 
        font: "times",
    }),
    anchor("center"),
    color(0, 0, 0),
    pos(0, 0),
]);

    box.onClick(() => {
        if (box.disabled) return;

        if (selectedForme === box) {
            box.color = rgb(255, 255, 200);
            selectedForme = null;
            return;
        }

        if (selectedForme) {
            selectedForme.color = rgb(255, 255, 200);
        }

        selectedForme = box;
        box.color = rgb(200, 255, 150);
    });
    formeCards.push(box);
});

//   fonctions
fonctions.forEach((func, i) => {
    const box = add([
        rect(400, 40, { radius: 8 }),
        pos(1500, 80 + i * 50),
        color(200, 225, 255),
        area(),
        outline(5),//10
        anchor("center"),
        "fonction",
        layer("ui"),
        { text: func,},
    ]);

    box.add([
        text(func, { size: 32 }),
        anchor("center"),
        pos(0, 0),
        color(0,0,0),
    ]);

box.onClick(() => {
    if (!selectedForme || selectedForme.disabled) return; 

    const isCorrect = selectedForme.answers.includes(func);

add([
    text(isCorrect ? "CORRECT" : "FAUX", { size: 24 }),
    pos(mousePos().x + 10, mousePos().y),
    opacity(1),
    lifespan(1),
    color(isCorrect ? rgb(0, 200, 0) : rgb(200, 0, 0)),
]);

if (!isCorrect) {
    gameState.erreurs++;
    updateErreurLabel();

 if (gameState.erreurs >= 3) {
     if (musique) musique.stop();
    wait(1, () => go("FinRosa"));
}

}


    if (isCorrect) {
        if (!selectedForme.foundAnswers) {
            selectedForme.foundAnswers = [];
        }

        if (!selectedForme.foundAnswers.includes(func)) {
            selectedForme.foundAnswers.push(func);
            gameState.score += 10;
            updateScoreLabel();
  
            if(gameState.score == 120){ if (musique) musique.stop(); go("RéussiRosa")}//SCORE MAX DE ROSA
        }

        const toutesBonnes = selectedForme.answers.every(r =>
            selectedForme.foundAnswers.includes(r)
        );

if (toutesBonnes) {

    formeCards.splice(formeCards.indexOf(selectedForme), 1); 
    destroy(selectedForme); 

  
    repositionFormes();
}
    

function repositionFormes() {
    // Position de départ
    let xStart = 100;
    let yStart = 100;
    let spacingY = 50;
    let maxY = height() - 100;
    let column = 0;

    formeCards.forEach((f, i) => {
        let x = xStart + column * 200;
        let y = yStart + (i % Math.floor(maxY / spacingY)) * spacingY;


        if (y >= maxY) {
            column++;
            y = yStart;
        }

        f.pos = vec2(x, y);
    });
}


    }
});

});

// Ciel random
onUpdate(() => {
    ciel.use(sprite(music.paused ? "Ciel1" : "Ciel"));
}); 
    
})
//BUG non seulement le son se clear pas, MAIS si tu fais un aller-retour entre la scène et la scène déclinaison --> score garder
scene("FinRosa", () => {
    loadSprite("Alvaresdodo","image/Alvaresdodo.png")
    add([
        sprite("Alvaresdodo"),
        area(),
        outline(2),
        pos(320,720),
        anchor("center"),
        //color(193,210,255),
        scale(20),
        layer("ui"),
    ]);


    add([
        text("Fin de la partie ! Ne dors pas sur tes révisions!", { size: 48 }),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text("Appuie sur Espace pour recommencer ou Enter pour quitter.", { size: 24 }),
        pos(center().x, center().y + 60),
        anchor("center"),
    ]);

    onKeyPress("enter", () => {
        gameState.score = 0;
        gameState.erreurs = 0;
        
        go("Forêt")}) 

    onKeyPress("space", () => {
        if (failMusic) {
        failMusic.stop(); 
        failMusic = null;
    }
        gameState.score = 0;
        gameState.erreurs = 0;
        go("DeclinaisonRosa");
    });
});

scene("RéussiRosa", () => {
    loadSprite("Alvaresdodo","image/Alvaresdodo.png")
    add([
        sprite("Alvaresdodo"),
        area(),
        outline(2),
        pos(320,720),
        anchor("center"),
        //color(193,210,255),
        scale(20),
        layer("ui"),
    ]);


    add([
        text("Fin de la partie ! Tu peux dormir sereinement.", { size: 48 }),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text("Appuie sur Espace pour recommencer ou Enter pour quitter.", { size: 24 }),
        pos(center().x, center().y + 60),
        anchor("center"),
    ]);

    onKeyPress("enter", () => {
        gameState.score = 0;
        gameState.erreurs = 0;
        niveau =+ 10;
        go("ResultForêt")}) 

    onKeyPress("space", () => {
        if (failMusic) {
        failMusic.stop(); 
        failMusic = null;
    }
        niveau =+ 10;
        gameState.score = 0;
        gameState.erreurs = 0;
        go("DeclinaisonRosa");

       // every((obj) => {
        //destroy(obj);
        //return niveau+10

});

    //});
});

scene("ResultForêt", () => {
currentScene="ResultForêt"
add([
    rect(10, height()),      
    pos(0, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0, 0),        
]);

    setGravity(600);


    add([
        sprite("NuitIntro"), 
        pos(0, 0),
        scale(width() / 1000, height() / 1000),
        layer("bg"),
    ]);

    // Sol
    add([
        rect(width(), 1000),
        pos(0, 800),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);
let forêt = loadSound("Forêt", "musique_rendu/soft-background-piano-285589.mp3")
forêt = play("Forêt", {
    speed: 1,//1.25
    loop: true,
    seek: 5,
    detune: -120,//-120,//-1200
})
    addLevel([
        "0 0 0 0 0 0 0 0 0 0  0  0  0  0  0  0000000000000",
        "",
        "              -                        "
       ],{
        tileWidth: 56,
        tileHeight: 56,
        scale:100,
        tiles: {
                   "0": () => [
                sprite("Solfleur", { }),
                scale(10),//10
                pos(0,650),
                color(120,0,120),
                //area(),
                //body({ isStatic: true})
                ],
                 "1": () => [
                sprite("Colonne", { }),
                scale(10),
                pos(0,0),
                //color(20,0,255),
                //color(193,210,255)
                color(120,0,120),
                //area(),
                //body({ isStatic: false})
                ],
                "2": () => [
                sprite("Colonne", { }),
                scale(2),
                pos(0,0),
                color(0,0,0),
                //color(193,210,255)
                //color(120,0,120),
                //area(),
                //body({ isStatic: false})
                ],
            }})

    
    kamera.camPos(center());

    // Joueur : Alvares
    const player = kamera.add([
        sprite("alvares"),
        pos(200, 600),
        scale(5),
        area(),
        body(),
        "player",
    ]);

    player.play("idle");
    add([sprite("Colonne"),
        pos(900, 200),
        scale(10),
        color(120,0,120),
    ])
    // Fée
    const fee = add([
        sprite("fees"),
        pos(600, 600),
        scale(4),
        area(),
        //body({ isStatic: true }),//-->Laisse passer
        "fee",
        color(240,0,240)
    ]);

        const feechantante = add([
        sprite("fees"),
        pos(300, 450),
        scale(4),
        area(),
        //body({ isStatic: false }),
        "feechantante",
        color(0,240,240)
    ]);
        const feeblue = add([
        sprite("fees"),
        pos(100, 600),
        scale(4),
        area(),
        //body({ isStatic: true }),
        "feeblue",
        color(255,255,240)
    ]);

    // Variables dialogues
    let inputLocked = false;
    let activeDialogue = null;
    let dialogueDone = false;
    let dialogueDone2 = false;
    let duelDialogueCounter = 0;
let interactionCooldown = 0;
    function interact() {
       //inputLocked = true 

    if (interactionCooldown > 0 || activeDialogue) return;

    interactionCooldown = 0.5; // évite double "i"
    //loquace.start("FeeAurevoir")// -->Démarre directement à l'arrivée de la scène.
    for (const col of player.getCollisions()) {
        const c = col.target;

        if (c.is("fee")) {
            fee.flipX = player.pos.x >= fee.pos.x;
            inactivityTime = 0;
            hideHintText();

            if (!dialogueDone) {
                inputLocked = true; 
                loquace.start("FeeAurevoir", true);
                loquace.next();
                activeDialogue = "FeeAurevoir";
                dialogueDone = true;
                inputLocked = true 
                return;
                
            }
            //if (dialogueDone2) {
              //  inputLocked = true;
                //loquace.start("Fae", true);
                //loquace.next();
                //activeDialogue = "Fae";
                //duelDialogueCounter = 1;
                //dialogueDone2 = true;
                //inputLocked = true 
                //loquace.clear(go("DeclinaisonRosa"))
                //return;
            //}
            }
             if (c.is("feeblue")) {
            fee.flipX = player.pos.x >= fee.pos.x;
            inactivityTime = 0;
            hideHintText();
                if (dialogueDone) {
                inputLocked = true; 
                loquace.start("NVAGDA", true);
                loquace.next();
                activeDialogue = "NVAGDA";
                duelDialogueCounter = 1;
                dialogueDone2 = true;
                inputLocked = true 
                //loquace.clear(go("DeclinaisonRosa"))
                return;
            }}
                if (c.is("feechantante")) {
                fee.flipX = player.pos.x >= fee.pos.x;
                inactivityTime = 0;
                hideHintText();
                if (dialogueDone) {
                inputLocked = true;
                loquace.start("Rosa", true);
                loquace.next();
                activeDialogue = "Rosa";
                duelDialogueCounter = 1;
                dialogueDone2 = true;
                inputLocked = true 
                //loquace.clear(go("DeclinaisonRosa"))
                return;
            }}
        
    }
}

    onKeyPress("i", interact);

    // Avancer le dialogue
    onKeyPress("space", () => {
        const progressed = loquace.next();

        if (!progressed) {
            loquace.clear();
            inputLocked = false;
            activeDialogue = null;
        }
    });

    // Mouvements
    const SPEED = 300;

    ["left", "right", "up", "down"].forEach((key) => {
        onKeyDown(key, () => {
            if (inputLocked) return;

            const dir = {
                left: [-SPEED, 0],
                right: [SPEED, 0],
                up: [0, -SPEED],
                down: [0, SPEED],
            }[key];

            player.move(...dir);

            if (key === "right") player.flipX = true;
            if (key === "left") player.flipX = false;

            if (player.curAnim() !== "marche" && player.curAnim() !== "dodo") {
                player.play("marche");
            }

            inactivityTime = 0;
            hideHintText();
            resetDodoTimer();
        });
    });
    function cleanUpScene() {
        destroyAll();
        loquace.clear();
    }

    onUpdate(() => {
                if (interactionCooldown > 0) {
        interactionCooldown -= dt();
    }
                     
        if (player.pos.x < 0) {
            cleanUpScene()
            position.x = width() - 10; 
             if (forêt) forêt.stop();
            go("Prologus");
        }


        if (player.pos.x > screenWidth) {
            cleanUpScene()
            position.x = 10; 
            if (forêt) forêt.stop();
            go("Champsnuit");
        }
   
            //if (player.pos.x < 0 || player.pos.x > width() || player.pos.y < 0 || player.pos.y > height()) {
            //cleanUpScene();  
        
            //go("Champsnuit");
        //}
        if (
            !isKeyDown("left") &&
            !isKeyDown("right") &&
            !isKeyDown("up") &&
            !isKeyDown("down") &&
            player.curAnim() !== "idle" &&
            player.curAnim() !== "dodo"
        ) {
            player.play("idle");
        }
    });

    // Inactivité -->animation dodo
    let inactivityTime = 0;
    let dodoTimeout;
    let dodoEndTimeout;

    function resetDodoTimer() {
        if (dodoTimeout) clearTimeout(dodoTimeout);
        if (dodoEndTimeout) clearTimeout(dodoEndTimeout);

        dodoTimeout = setTimeout(() => {
            player.play("dodo");

            dodoEndTimeout = setTimeout(() => {
                player.play("idle");
                resetDodoTimer();
            }, 10000);
        }, 10000);
    }

    resetDodoTimer();

    onUpdate(() => {
        if (!inputLocked) {
            inactivityTime += dt();
        }
    });

    ["left", "right", "up", "down", "i", "space"].forEach((key) => {
        onKeyPress(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
        onKeyDown(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
    });

    let hintText = null;
    let hintShown = false;

    function showHintText() {
        if (hintShown || inputLocked) return;
        hintShown = true;
        hintText = add([
            text("i: interagir | flèches: bouger | espace: passer texte", {
                size: 24,
                width: width() - 100,
                align: "center"
            }),
            pos(center().x, center().y + 200),
            anchor("center"),
            layer("ui"),
            opacity(0),
            fixed()
        ]);

        //onUpdate(() => {
            //if (hintText.opacity < 1) {
              //  hintText.opacity += dt();
            //}
        //});
    }

    function hideHintText() {
        if (hintText) {
            destroy(hintText);
            hintText = null;
            hintShown = false;
        }
    }

    onUpdate(() => {
        if (!inputLocked && inactivityTime >= 5 && !hintShown) {
            showHintText();
        }
    });
});

scene("Champsnuit", () => {
currentScene="Champsnuit"
add([
    rect(10, height()),       
    pos(0, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0, 0),        
]);

    setGravity(600);

    
    add([
        sprite("Champsnuit"),
        pos(0, 0),
        scale(width() / 1000, height() / 1000),
        layer("bg"),
    ]);

    // Sol
    add([
        rect(width(), 1000),
        pos(0, 800),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);
let forêt = loadSound("Forêt", "musique_rendu/soft-background-piano-285589.mp3")
forêt = play("Forêt", {
    speed: 1,//1.25
    loop: true,
    seek: 5,
    detune: -120,//-120,//-1200
})
    addLevel([
        "4   4   4   4   4   4   4   4   4   ",
        "1 0 0 0 0 0 0 0 0 0  0  0  0  0  0  0000000000000",
        "   3",
        "         2   2   2   2   2   2   2   2        4        2",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
       ],{
        tileWidth: 56,
        tileHeight: 56,
        scale:100,
        tiles: {
                   "0": () => [
                sprite("Solpavé", { }),
                scale(10),//10
                pos(0,650),
                color(120,0,255),
                //area(),
                //body({ isStatic: true})
                ],
                 "1": () => [
                sprite("Solanglegauche", { }),
                scale(10),
                pos(0,650),
                //color(20,0,255),
                //color(193,210,255)
                color(120,0,255),
                //area(),
                //body({ isStatic: false})
                ],
                "2": () => [
                sprite("Multicolonnes", { }),
                scale(2),
                pos(0,300),
                color(100,0,255),
                //color(193,210,255)
                //color(120,0,120),
                //area(),
                //body({ isStatic: false})
                ],
                "4": () => [
                sprite("Etoiles", {}),
                pos(0, 50),
                scale(6),
                area(),
                opacity(0.2),
                body({ isStatic: true }),//-->Laisse passer
                "Etoiles",
                color(240,240,240)],
            }})

    
    kamera.camPos(center());
    //stele
const stele = add([
        sprite("stele"),
        pos(0, 600),
        scale(4),
        area(),
        //body({ isStatic: true}),
        "stele",
        color(255,255,250)
            ]);
    // Joueur : Alvares
    const player = kamera.add([
        sprite("alvares"),
        pos(200, 600),
        scale(5),
        area(),
        body(),
        "player",
    ]);

    player.play("idle");
    add([sprite("Colonne"),
        pos(900, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(600, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(300, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(0, 200),
        scale(10),
        color(71,87,180),
    ])


const caillou = add([
        sprite("Coquelicot"),
        pos(1000, 700),
        scale(0.1),
        area(),
        //body({ isStatic: true}),
        "caillou",
        color(120,0,250)
            ]);
const caillou2 = add([
        sprite("Coquelicot"),
        pos(1450, 800),
        scale(0.1),
        area(),
        //body({ isStatic: true}),
        "caillou2",
        color(120,0,250)
            ]);

    // Variables dialogues
    let inputLocked = false;
    let activeDialogue = null;
    let dialogueDone = false;
    let dialogueDone2 = false;
    let duelDialogueCounter = 0;
let interactionCooldown = 0;

    function interact() {
       //inputLocked = true 
    if (interactionCooldown > 0 || activeDialogue) return;

    interactionCooldown = 0.5; // évite double "i"
    //loquace.start("Templum")// -->Démarre directement à l'arrivée de la scène. mais faut faire espace
    for (const col of player.getCollisions()) {
        const c = col.target;

        if (c.is("stele")) {
            inactivityTime = 0;
            hideHintText();

            if (!dialogueDone) {
                inputLocked = true;
                loquace.start("Templum", true);
                loquace.next();
                activeDialogue = "Templum";
                dialogueDone = true;
                inputLocked = true 
                return;
                
            }}
             if (c.is("caillou")) {

            inactivityTime = 0;
            hideHintText();
                if (dialogueDone) {
                inputLocked = true;
                loquace.start("Templum2", true);
                loquace.next();
                activeDialogue = "Templum2";
                duelDialogueCounter = 1;
                dialogueDone2 = true;
                inputLocked = true 
                //loquace.clear(go("DeclinaisonRosa"))
                return;
            }}
            //il faudra ajouter le dialogue plus haut
             if (c.is("caillou2")) {

            inactivityTime = 0;
            hideHintText();
                if (dialogueDone) {
                inputLocked = true;
                loquace.start("Templum3", true);
                loquace.next();
                activeDialogue = "Templum3";
                duelDialogueCounter = 1;
                dialogueDone2 = true;
                inputLocked = true 
                //loquace.clear(go("DeclinaisonRosa"))
                return;
            }}
        
    }
}



    onKeyPress("i", interact);

    // Avancer le dialogue
    onKeyPress("space", () => {
        const progressed = loquace.next();

        if (!progressed) {
            loquace.clear();
            inputLocked = false;
            activeDialogue = null;
        }
    });

    // Mouvements
    const SPEED = 300;

    ["left", "right", "up", "down"].forEach((key) => {
        onKeyDown(key, () => {
            if (inputLocked) return;

            const dir = {
                left: [-SPEED, 0],
                right: [SPEED, 0],
                up: [0, -SPEED],
                down: [0, SPEED],
            }[key];

            player.move(...dir);

            if (key === "right") player.flipX = true;
            if (key === "left") player.flipX = false;

            if (player.curAnim() !== "marche" && player.curAnim() !== "dodo") {
                player.play("marche");
            }

            inactivityTime = 0;
            hideHintText();
            resetDodoTimer();
        });
    });
    function cleanUpScene() {
        destroyAll();
        loquace.clear();
    }

    onUpdate(() => {
                if (interactionCooldown > 0) {
        interactionCooldown -= dt();
    }
                      
        if (player.pos.x < 0) {
            cleanUpScene()
            position.x = width() - 10; 
            if (forêt) forêt.stop()
            go("Forêt");
        }

        if (player.pos.x > screenWidth) {
            cleanUpScene()
            position.x = 10;
            if (forêt) forêt.stop()
            go("Temple");
        }
        //if (
          //  player.pos.x < 0 ||
            //player.pos.x > width() ||
            //player.pos.y < 0 ||
            //player.pos.y > height()
        //) {
          //  cleanUpScene();
            //go("Temple"); 
        //}
        if (
            !isKeyDown("left") &&
            !isKeyDown("right") &&
            !isKeyDown("up") &&
            !isKeyDown("down") &&
            player.curAnim() !== "idle" &&
            player.curAnim() !== "dodo"
        ) {
            player.play("idle");
        }
    });

    // Inactivité -->animation dodo
    let inactivityTime = 0;
    let dodoTimeout;
    let dodoEndTimeout;

    function resetDodoTimer() {
        if (dodoTimeout) clearTimeout(dodoTimeout);
        if (dodoEndTimeout) clearTimeout(dodoEndTimeout);

        dodoTimeout = setTimeout(() => {
            player.play("dodo");

            dodoEndTimeout = setTimeout(() => {
                player.play("idle");
                resetDodoTimer();
            }, 10000);
        }, 10000);
    }

    resetDodoTimer();

    onUpdate(() => {
        if (!inputLocked) {
            inactivityTime += dt();
        }
    });

    
    ["left", "right", "up", "down", "i", "space"].forEach((key) => {
        onKeyPress(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
        onKeyDown(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
    });

    let hintText = null;
    let hintShown = false;

    function showHintText() {
        if (hintShown || inputLocked) return;
        hintShown = true;
        hintText = add([
            text("i: interagir | flèches: bouger | espace: passer texte", {
                size: 24,
                width: width() - 100,
                align: "center"
            }),
            pos(center().x, center().y + 200),
            anchor("center"),
            layer("ui"),
            opacity(0),
            fixed()
        ]);

        //onUpdate(() => {
            //if (hintText.opacity < 1) {
              //  hintText.opacity += dt();
            //}
        //});
    }

    function hideHintText() {
        if (hintText) {
            destroy(hintText);
            hintText = null;
            hintShown = false;
        }
    }

    onUpdate(() => {
        if (!inputLocked && inactivityTime >= 5 && !hintShown) {
            showHintText();
        }
    });
});

scene("Temple", () => {
currentScene="Temple"

    setGravity(600);

    
    add([
        sprite("Champsnuit"),
        pos(0, 0),
        scale(width() / 1000, height() / 1000),
        layer("bg"),
    ]);

    // Sol
    add([
        rect(width(), 1000),
        pos(0, 800),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);
let temple = loadSound("Temple", "musique_rendu/calm-waves-soft-piano-314968.mp3")
temple = play("Temple", {
    speed: 1,//1.25
    loop: true,
    seek: 5,
    detune: -120,//-120,//-1200
})
    addLevel([
        "4   4   4   4   4   4   4   4   4   ",
        "0 0 0 0 0 0 0 0 0 0  0  0  0  0  0  0000000000000",
        "   ",
        "2   2   2   2   2   2   2   2   2   2   2        4        2",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
       ],{
        tileWidth: 56,
        tileHeight: 56,
        scale:100,
        tiles: {
                   "0": () => [
                sprite("Solpavé", { }),
                scale(10),//10
                pos(0,650),
                color(120,0,255),
                //area(),
                //body({ isStatic: true})
                ],
                 "1": () => [
                sprite("Solanglegauche", { }),
                scale(10),
                pos(0,650),
                //color(20,0,255),
                //color(193,210,255)
                color(120,0,255),
                //area(),
                //body({ isStatic: false})
                ],
                "2": () => [
                sprite("Multicolonnes", { }),
                scale(2),
                pos(0,300),
                color(100,0,255),
                //color(193,210,255)
                //color(120,0,120),
                //area(),
                //body({ isStatic: false})
                ],
                "4": () => [
                sprite("Etoiles", {}),
                pos(0, 50),
                scale(6),
                area(),
                opacity(0.2),
                body({ isStatic: true }),//-->Laisse passer
                "Etoiles",
                color(240,240,240)],
            }})

    
    kamera.camPos(center());

    // Joueur : Alvares
    const player = kamera.add([
        sprite("alvares"),
        pos(200, 600),
        scale(5),
        area(),
        body(),
        "player",
    ]);
    player.play("idle");
    const inconnu = add([
        sprite("Gaulois"),
        pos(1300, 600),
        scale(5),
        area(),
        body({ isStatic: true}),
        "inconnu",
        color(0,0,0)
            ]);
    add([sprite("Colonne"),
        pos(1200, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(900, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(600, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(300, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(0, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(-300, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(-600, 200),
        scale(10),
        color(71,87,180),
    ])

 



    // Variables dialogues
    let inputLocked = false;
    let activeDialogue = null;
    let dialogueDone = false;
    let dialogueDone2 = false;
    let duelDialogueCounter = 0;
let interactionCooldown = 0;

function interact() {
       //inputLocked = true 
    if (interactionCooldown > 0 || activeDialogue) return;

    interactionCooldown = 0.5; // évite double "i"
    
    for (const col of player.getCollisions()) {
        const c = col.target;

        if (c.is("inconnu")) {
            inconnu.flipX = player.pos.x >= inconnu.pos.x;
            inactivityTime = 0;
            hideHintText();

            if (!dialogueDone) {
                inputLocked = true;
                loquace.start("...", true);
                loquace.next();
                activeDialogue = "...";
                dialogueDone = true;
                inputLocked = true 
                return;
            }

            if (!dialogueDone2) {
                go("DeclinaisonTemplum")
                if (temple) temple.stop();
                return;
            }
        }
    }
}



    onKeyPress("i", interact);

    // Avancer le dialogue
    onKeyPress("space", () => {
        const progressed = loquace.next();

        if (!progressed) {
            loquace.clear();
            inputLocked = false;
            activeDialogue = null;
        }
    });

    // Mouvements
    const SPEED = 300;

    ["left", "right", "up", "down"].forEach((key) => {
        onKeyDown(key, () => {
            if (inputLocked) return;

            const dir = {
                left: [-SPEED, 0],
                right: [SPEED, 0],
                up: [0, -SPEED],
                down: [0, SPEED],
            }[key];

            player.move(...dir);

            if (key === "right") player.flipX = true;
            if (key === "left") player.flipX = false;

            if (player.curAnim() !== "marche" && player.curAnim() !== "dodo") {
                player.play("marche");
            }
            inactivityTime = 0;
            hideHintText();
            resetDodoTimer();
        });
    });
    function cleanUpScene() {
        //music.stop();//àmodif
        destroyAll();
        loquace.clear();
    }
 
    onUpdate(() => {
                if (interactionCooldown > 0) {
        interactionCooldown -= dt();
    }
               
        if (player.pos.x < 0) {
            cleanUpScene()
            position.x = width() - 10; 
            if (temple) temple.stop();
            go("Champsnuit");
        }


        if (player.pos.x > screenWidth) {
            cleanUpScene()
            position.x = 10; 
            if (temple) temple.stop();
            go("Mer");
        }
  
        if (
            !isKeyDown("left") &&
            !isKeyDown("right") &&
            !isKeyDown("up") &&
            !isKeyDown("down") &&
            player.curAnim() !== "idle" &&
            player.curAnim() !== "dodo"
        ) {
            player.play("idle");
        }
    });

    //animation dodo
    let inactivityTime = 0;
    let dodoTimeout;
    let dodoEndTimeout;

    function resetDodoTimer() {
        if (dodoTimeout) clearTimeout(dodoTimeout);
        if (dodoEndTimeout) clearTimeout(dodoEndTimeout);

        dodoTimeout = setTimeout(() => {
            player.play("dodo");

            dodoEndTimeout = setTimeout(() => {
                player.play("idle");
                resetDodoTimer();
            }, 10000);
        }, 10000);
    }

    resetDodoTimer();

    onUpdate(() => {
        if (!inputLocked) {
            inactivityTime += dt();
        }
    });


    ["left", "right", "up", "down", "i", "space"].forEach((key) => {
        onKeyPress(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
        onKeyDown(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
    });


    let hintText = null;
    let hintShown = false;

    function showHintText() {
        if (hintShown || inputLocked) return;
        hintShown = true;
        hintText = add([
            text("i: interagir | flèches: bouger | espace: passer texte", {
                size: 24,
                width: width() - 100,
                align: "center"
            }),
            pos(center().x, center().y + 200),
            anchor("center"),
            layer("ui"),
            opacity(0),
            fixed()
        ]);
    }

    function hideHintText() {
        if (hintText) {
            destroy(hintText);
            hintText = null;
            hintShown = false;
        }
    }

    onUpdate(() => {
        if (!inputLocked && inactivityTime >= 5 && !hintShown) {
            showHintText();
        }
    });
});

scene("DeclinaisonTemplum", () => {

const FLOOR_HEIGHT = 64;
const SPEED = 60;
let nuagesActive = false;
let musique = null;
let currentBG = null;


    const music = [
        { id: "musique1", bg: "bg1" },
        { id: "musique2", bg: "bg2" },
        { id: "musique3", bg: "bg3" },
        { id: "musique4", bg: "bg4" }
    ];


   function playRandomMusic() {
    const choix = choose(music);

    if (musique) musique.stop();
    if (currentBG) destroy(currentBG);

    const nouveauBG = add([
        sprite(choix.bg),
        pos(0, 0),
        scale(4),
        layer("bg"),
        opacity(0),
    ]);

    if (currentBG) {
        tween(currentBG.opacity, 0, 1, val => currentBG.opacity = val);
        wait(1, () => destroy(currentBG));
    }

    tween(nouveauBG.opacity, 1, 1, val => nouveauBG.opacity = val);
    currentBG = nouveauBG;

    musique = play(choix.id, { loop: true });
    musique.paused = false;

    //debug.log(`Musique : ${choix.id} — Fond : ${choix.bg}`);
}
onKeyPress("space", () => {
    if (!musique) {
        playRandomMusic();
        if (!nuagesActive) {
            nuagesActive = true;
            spawnNuage();
        }
    } else {
        musique.paused = !musique.paused;
        //debug.log(musique.paused ? "Pause" : "Lecture");

        if (!musique.paused && !nuagesActive) {
            nuagesActive = true;
            spawnNuage();
        }
    }
});

let sceneScore = gameState.score;

loadSprite("Ciel1", "image/cielligne.jpg")

loadSprite("Ciel", "image/cieletoiles.png")
loadSprite("Ciel1", "image/cieletoiles.png")
loadSprite("Ciel2", "image/cieletoiles.png")
loadSprite("Ciel3", "image/cieletoiles.png")

loadSprite("Nuage", "image/Nuage1.png");
loadSprite("Nuage2", "image/Nuage2.png");


// Ciel random
let ciel = add([
    sprite(music.paused ? "Ciel1" : "Ciel"),
    pos(0, 0),
    scale(4),
    layer("bg"),
]);

const ciels = ["Ciel", "Ciel1", "Ciel2", "Ciel3"]
let cielIndex = 0;
let cielActuel = ciel;
let transitionEnCours = false;
let changementAutomatiqueActif = false;

// 
function changerCiel() {
    if (music.paused || transitionEnCours) return; 
    transitionEnCours = true;
    cielIndex = (cielIndex + 1) % ciels.length;
    
    let ancienCiel = ciel;

}


if (!music.paused) {
    wait(10, changerCiel);
}


onKeyPress("space", () => {
    if (!music.paused && !nuagesActive) {
        spawnNuage();
        wait(10, changerCiel);
    }
});


// Fonction nuages (appelée uniquement après SPACE)
function spawnNuage() {
    add([
        //sprite("Nuage"),
        sprite("Nuage"),
        pos(width(), rand(40, height() - 100)),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        scale(rand(10, 15)),
        //scale(rand(1.5, 2.5)),
        //z(0),
        color(0,0,0),
        layer("nuages"),
    ]);
        add([
       //sprite("Nuage2"),
        sprite("Nuage2"),
        pos(width(), rand(40, height() - 100)),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        color(0,0,0),
        scale(rand(10, 15)),
        //scale(rand(1.5, 2.5)),
        //z(0),
        layer("nuages")
    ]);

    wait(rand(5, 10), spawnNuage);
}

    add([
        text("Clique sur une forme et choisis le(s) réponse(s)."),
        anchor("center"),
        pos(850,50),
        layer("ui"),
    ],)
  const touche = add([text("Appuie sur Espace pour commencer"),
    anchor("center"),
    pos(850,500),
    ])

//Il y a un bug connu pour l'affichage des positions quand il y en a trop (deux-trois éléments se retrouvent derrière certains rectangles), mais n'est pas trop grave en l'état car ils réapparaissent après quelques réponses correctes et n'influent pas sur les réponses de ceux au-dessus.
// Déclinaisons (formes)
const formes = [
    //Neutre
    { text: "templum", answers: ["nominatif singulier","vocatif singulier", "accusatif singulier"] },
    { text: "templa", answers: ["nominatif pluriel","vocatif pluriel", "accusatif pluriel"] },
    { text: "templi", answers: ["génitif singulier"] },
    { text: "templo", answers: ["datif singulier", "ablatif singulier"] },
    { text: "templis", answers: ["datif pluriel", "ablatif pluriel"] },
    { text: "templorum", answers: ["génitif pluriel"] },
];

// Fonctions grammaticales
const fonctions = [
    "nominatif singulier",
    "nominatif pluriel",
   
    "vocatif singulier",
    "vocatif pluriel",

    "accusatif singulier",
    "accusatif pluriel",

    "génitif singulier",
    "génitif pluriel",

    "datif singulier",
    "datif pluriel",

    "ablatif singulier",
    "ablatif pluriel",

];

let xStart = 100;
let yStart = 100;
let spacingY = 50;
let maxY = height() - 100;
let column = 0;
let row = 0;





//Perfecr score 12 sur les 6 formes --> 72 donc perfect score 720
const scoreLabel = add([
    text(`Score: ${gameState.score}`, { size: 32 }),
    pos(50, 15),
    layer("ui"),
]);
const erreurLabel = add([
    text(`Erreurs: ${gameState.erreurs}/3`, { size: 32 }),
    pos(50, 40),
    layer("ui"),
]);

function updateScoreLabel() {
    scoreLabel.text = `Score: ${gameState.score}`;
}
function updateErreurLabel() {
    erreurLabel.text = `Erreurs: ${gameState.erreurs}/3`;
}


let selectedForme = null;
const formeCards = [];


//Pour les positionner dès le départ droit (à corriger plus tard)
function positionFormes() {
    const f = formes
    // Position de départ
    let xStart = 100;
    let yStart = 100;
    let spacingY = 50;
    let maxY = height() - 100;
    let column = 0;

    formeCards.forEach((f, i) => {
        let x = xStart + column * 200;
        let y = yStart + (i % Math.floor(maxY / spacingY)) * spacingY;


        if (y >= maxY) {
            column++;
            y = yStart;
        }
        if (x >= maxX) {
            column++;
            x = xStart;
        }
        f.pos = vec2(x, y);
    });
}
positionFormes()


//   déclinaisons
formes.forEach((f, index) => {
    let x = xStart + column * 200;
    let y = yStart + row * spacingY;

    if (y >= maxY) {
        column++;
        row = 0;
        y = yStart;
        x = xStart + column * 200;
    }

    row++;

    const box = add([
        rect(150, 40, { radius: 8 }),
        pos(x, y),
        color(255, 255, 200),
        area(),
        outline(2),
        anchor("center"),
        "forme",
        layer("ui"),
        {
            text: f.text,
            answers: f.answers,
            foundAnswers: [],
            disabled: false,
        },
    ]);
// formes
box.add([
    text(f.text, {
        size: 32, 
        font: "times",
    }),
    anchor("center"),
    color(0, 0, 0),
    pos(0, 0),
]);

    box.onClick(() => {
        if (box.disabled) return;

        if (selectedForme === box) {
            box.color = rgb(255, 255, 200);
            selectedForme = null;
            return;
        }

        if (selectedForme) {
            selectedForme.color = rgb(255, 255, 200);
        }

        selectedForme = box;
        box.color = rgb(200, 255, 150);
    });
    formeCards.push(box);
});

//   fonctions
fonctions.forEach((func, i) => {
    const box = add([
        rect(400, 40, { radius: 8 }),
        pos(1500, 80 + i * 50),
        color(200, 225, 255),
        area(),
        outline(5),//10
        anchor("center"),
        "fonction",
        layer("ui"),
        { text: func,},
    ]);

    box.add([
        text(func, { size: 32 }),
        anchor("center"),
        pos(0, 0),
        color(0,0,0),
    ]);

box.onClick(() => {
    if (!selectedForme || selectedForme.disabled) return; 

    const isCorrect = selectedForme.answers.includes(func);

add([
    text(isCorrect ? "CORRECT" : "FAUX", { size: 24 }),
    pos(mousePos().x + 10, mousePos().y),
    opacity(1),
    lifespan(1),
    color(isCorrect ? rgb(0, 200, 0) : rgb(200, 0, 0)),
]);

if (!isCorrect) {
    gameState.erreurs++;
    updateErreurLabel();

 if (gameState.erreurs >= 3) {
    if (musique) musique.stop()
    wait(1, () => go("FinTemplum"));
}

}


    if (isCorrect) {
  
        if (!selectedForme.foundAnswers) {
            selectedForme.foundAnswers = [];
        }

        if (!selectedForme.foundAnswers.includes(func)) {
            selectedForme.foundAnswers.push(func);
            gameState.score += 10;
            updateScoreLabel();
            if(gameState.score == 120){if (musique) musique.stop(); go("RéussiTemplum")}//SCORE MAX DE ROSA
        }

        const toutesBonnes = selectedForme.answers.every(r =>
            selectedForme.foundAnswers.includes(r)
        );

if (toutesBonnes) {

    formeCards.splice(formeCards.indexOf(selectedForme), 1); 
    destroy(selectedForme);

    repositionFormes();
}
    

function repositionFormes() {
    // Position de départ
    let xStart = 100;
    let yStart = 100;
    let spacingY = 50;
    let maxY = height() - 100;
    let column = 0;

    formeCards.forEach((f, i) => {
        let x = xStart + column * 200;
        let y = yStart + (i % Math.floor(maxY / spacingY)) * spacingY;

        // change de colonne
        if (y >= maxY) {
            column++;
            y = yStart;
        }

        f.pos = vec2(x, y);
    });
}

    }
});

});

// Ciel random
onUpdate(() => {
    ciel.use(sprite(music.paused ? "Ciel1" : "Ciel"));
}); 
    
})
scene("FinTemplum", () => {
    loadSprite("Alvaresdodo","image/Alvaresdodo.png")
    add([
        sprite("Alvaresdodo"),
        area(),
        outline(2),
        pos(320,720),
        anchor("center"),
        //color(193,210,255),
        scale(20),
        layer("ui"),
    ]);


    add([
        text("Fin de la partie ! Ne dors pas sur tes révisions!", { size: 48 }),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text("Appuie sur Espace pour recommencer ou Enter pour quitter.", { size: 24 }),
        pos(center().x, center().y + 60),
        anchor("center"),
    ]);

    onKeyPress("enter", () => {
        gameState.score = 0;
        gameState.erreurs = 0;
        go("Temple")}) 

    onKeyPress("space", () => {
        if (failMusic) {
        failMusic.stop(); 
        failMusic = null;
    }
        gameState.score = 0;
        gameState.erreurs = 0;
        go("DeclinaisonTemplum");
    });
});

scene("RéussiTemplum", () => {
    loadSprite("Alvaresdodo","image/Alvaresdodo.png")
    add([
        sprite("Alvaresdodo"),
        area(),
        outline(2),
        pos(320,720),
        anchor("center"),
        //color(193,210,255),
        scale(20),
        layer("ui"),
    ]);


    add([
        text("Fin de la partie ! Tu peux dormir sereinement.", { size: 48 }),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text("Appuie sur Espace pour recommencer ou Enter pour quitter.", { size: 24 }),
        pos(center().x, center().y + 60),
        anchor("center"),
    ]);

    onKeyPress("enter", () => {
        gameState.score = 0;
        gameState.erreurs = 0;
        niveau =+ 10;
        go("ResultTemple")}) 

    onKeyPress("space", () => {
        if (failMusic) {
        failMusic.stop(); 
        failMusic = null;
    }
        niveau =+ 10;
        gameState.score = 0;
        gameState.erreurs = 0;
        go("DeclinaisonTemplum");

        //every((obj) => {
        //destroy(obj);
        //return niveau+10

});

    //});
});

scene("ResultTemple", () => {
currentScene="ResultTemple"

    setGravity(600);


    add([
        sprite("Champsnuit"), 
        pos(0, 0),
        scale(width() / 1000, height() / 1000),
        layer("bg"),
    ]);

    // Sol
    add([
        rect(width(), 1000),
        pos(0, 800),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);
let temple = loadSound("Temple", "musique_rendu/calm-waves-soft-piano-314968.mp3")
temple = play("Temple", {
    speed: 1,//1.25
    loop: true,
    seek: 5,
    detune: -120,//-120,//-1200
})
    addLevel([
        "4   4   4   4   4   4   4   4   4   ",
        "0 0 0 0 0 0 0 0 0 0  0  0  0  0  0  0000000000000",
        "   ",
        "2   2   2   2   2   2   2   2   2   2   2        4        2",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
       ],{
        tileWidth: 56,
        tileHeight: 56,
        scale:100,
        tiles: {
                   "0": () => [
                sprite("Solpavé", { }),
                scale(10),//10
                pos(0,650),
                color(120,0,255),
                //area(),
                //body({ isStatic: true})
                ],
                 "1": () => [
                sprite("Solanglegauche", { }),
                scale(10),
                pos(0,650),
                //color(20,0,255),
                //color(193,210,255)
                color(120,0,255),
                //area(),
                //body({ isStatic: false})
                ],
                "2": () => [
                sprite("Multicolonnes", { }),
                scale(2),
                pos(0,300),
                color(100,0,255),
                //color(193,210,255)
                //color(120,0,120),
                //area(),
                //body({ isStatic: false})
                ],
                "4": () => [
                sprite("Etoiles", {}),
                pos(0, 50),
                scale(6),
                area(),
                opacity(0.2),
                body({ isStatic: true }),//-->Laisse passer
                "Etoiles",
                color(240,240,240)],
            }})

    
    kamera.camPos(center());

    // Joueur : Alvares
    const player = kamera.add([
        sprite("alvares"),
        pos(200, 600),
        scale(5),
        area(),
        body(),
        "player",
    ]);
        player.play("idle");

const inconnu = add([
        sprite("Gaulois"),
        pos(1300, 600),
        scale(5),
        area(),
        body({ isStatic: true}),
        "inconnu",
        color(0,0,0)
            ]);


    add([sprite("Colonne"),
        pos(1200, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(900, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(600, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(300, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(0, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(-300, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(-600, 200),
        scale(10),
        color(71,87,180),
    ])



    // Variables dialogues
    let inputLocked = false;
    let activeDialogue = null;
    let dialogueDone = false;
    let dialogueDone2 = false;
    let duelDialogueCounter = 0;
let interactionCooldown = 0;

function interact() {
       //inputLocked = true 
    if (interactionCooldown > 0 || activeDialogue) return;

    interactionCooldown = 0.5; // évite double "i"
    
    for (const col of player.getCollisions()) {
        const c = col.target;

        if (c.is("inconnu")) {
            inconnu.flipX = player.pos.x >= inconnu.pos.x;
            inactivityTime = 0;
            hideHintText();

            if (!dialogueDone) {
                inputLocked = true;
                loquace.start("Anylastword", true);
                loquace.next();
                activeDialogue = "Anylastword";
                dialogueDone = true;
                   inputLocked = true 
                return;
                
            }

            if (!dialogueDone2) {
                if (temple) temple.stop();
                go("DeclinaisonTemplum&Rosa")
                return;
            }
        }
    }
}




    onKeyPress("i", interact);

    // Avancer le dialogue
    onKeyPress("space", () => {
        const progressed = loquace.next();

        if (!progressed) {
            loquace.clear();
            inputLocked = false;
            activeDialogue = null;
        }
    });

    // Mouvements
    const SPEED = 300;

    ["left", "right", "up", "down"].forEach((key) => {
        onKeyDown(key, () => {
            if (inputLocked) return;

            const dir = {
                left: [-SPEED, 0],
                right: [SPEED, 0],
                up: [0, -SPEED],
                down: [0, SPEED],
            }[key];

            player.move(...dir);

            if (key === "right") player.flipX = true;
            if (key === "left") player.flipX = false;

            if (player.curAnim() !== "marche" && player.curAnim() !== "dodo") {
                player.play("marche");
            }

            inactivityTime = 0;
            hideHintText();
            resetDodoTimer();
        });
    });
    function cleanUpScene() {
        //music.stop();//àmodif
        destroyAll();
        loquace.clear();
    }
 
    onUpdate(() => {
                if (interactionCooldown > 0) {
        interactionCooldown -= dt();
    }
    
        if (player.pos.x < 0) {
            cleanUpScene()
            position.x = width() - 10; 
            if (temple) temple.stop();
            go("Champsnuit");
        }


        if (player.pos.x > screenWidth) {
            cleanUpScene()
            position.x = 10; 
            if (temple) temple.stop();
            go("Mer");
        }
        //if (
          //  player.pos.x < 0 ||
            //player.pos.x > width() ||
            //player.pos.y < 0 ||
            //player.pos.y > height()
        //) {
          //  cleanUpScene();
           // go("Temple"); 
        //}
        if (
            !isKeyDown("left") &&
            !isKeyDown("right") &&
            !isKeyDown("up") &&
            !isKeyDown("down") &&
            player.curAnim() !== "idle" &&
            player.curAnim() !== "dodo"
        ) {
            player.play("idle");
        }
    });

    // Inactivité -->animation dodo
    let inactivityTime = 0;
    let dodoTimeout;
    let dodoEndTimeout;

    function resetDodoTimer() {
        if (dodoTimeout) clearTimeout(dodoTimeout);
        if (dodoEndTimeout) clearTimeout(dodoEndTimeout);

        dodoTimeout = setTimeout(() => {
            player.play("dodo");

            dodoEndTimeout = setTimeout(() => {
                player.play("idle");
                resetDodoTimer();
            }, 10000);
        }, 10000);
    }

    resetDodoTimer();

    onUpdate(() => {
        if (!inputLocked) {
            inactivityTime += dt();
        }
    });


    ["left", "right", "up", "down", "i", "space"].forEach((key) => {
        onKeyPress(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
        onKeyDown(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
    });
    let hintText = null;
    let hintShown = false;

    function showHintText() {
        if (hintShown || inputLocked) return;
        hintShown = true;
        hintText = add([
            text("i: interagir | flèches: bouger | espace: passer texte", {
                size: 24,
                width: width() - 100,
                align: "center"
            }),
            pos(center().x, center().y + 200),
            anchor("center"),
            layer("ui"),
            opacity(0),
            fixed()
        ]);

        //onUpdate(() => {
            //if (hintText.opacity < 1) {
              //  hintText.opacity += dt();
            //}
        //});
    }

    function hideHintText() {
        if (hintText) {
            destroy(hintText);
            hintText = null;
            hintShown = false;
        }
    }


    onUpdate(() => {
        if (!inputLocked && inactivityTime >= 5 && !hintShown) {
            showHintText();
        }
    });
});

scene("DeclinaisonTemplum&Rosa", () => {

const FLOOR_HEIGHT = 64;
const SPEED = 60;
let nuagesActive = false;
let musique = null;
let currentBG = null;

    const music = [
        { id: "musique1", bg: "bg1" },
        { id: "musique2", bg: "bg2" },
        { id: "musique3", bg: "bg3" },
        { id: "musique4", bg: "bg4" }
    ];

   function playRandomMusic() {
    const choix = choose(music);

    if (musique) musique.stop();
    if (currentBG) destroy(currentBG);

    const nouveauBG = add([
        sprite(choix.bg),
        pos(0, 0),
        scale(4),
        layer("bg"),
        opacity(0),
    ]);

    if (currentBG) {
        tween(currentBG.opacity, 0, 1, val => currentBG.opacity = val);
        wait(1, () => destroy(currentBG));
    }

    tween(nouveauBG.opacity, 1, 1, val => nouveauBG.opacity = val);
    currentBG = nouveauBG;

    musique = play(choix.id, { loop: true });
    musique.paused = false;

    //debug.log(`Musique : ${choix.id} — Fond : ${choix.bg}`);
}
onKeyPress("space", () => {
    if (!musique) {
        playRandomMusic();
        if (!nuagesActive) {
            nuagesActive = true;
            spawnNuage();
        }
    } else {
        musique.paused = !musique.paused;
        //debug.log(musique.paused ? "Pause" : "Lecture");

        if (!musique.paused && !nuagesActive) {
            nuagesActive = true;
            spawnNuage();
        }
    }
});

let sceneScore = gameState.score;
// Chargement des images
loadSprite("Ciel1", "image/cielligne.jpg")

loadSprite("Ciel", "image/cieletoiles.png")
loadSprite("Ciel1", "image/cieletoiles.png")
loadSprite("Ciel2", "image/cieletoiles.png")
loadSprite("Ciel3", "image/cieletoiles.png")


loadSprite("Nuage", "image/Nuage1.png");
loadSprite("Nuage2", "image/Nuage2.png");


// Ciel random 
let ciel = add([
    sprite(music.paused ? "Ciel1" : "Ciel"),
    pos(0, 0),
    scale(4),
    layer("bg"),
]);

const ciels = ["Ciel", "Ciel1", "Ciel2", "Ciel3",]
let cielIndex = 0;
let cielActuel = ciel;
let transitionEnCours = false;
let changementAutomatiqueActif = false;


function changerCiel() {
    if (music.paused || transitionEnCours) return; 
    transitionEnCours = true;
    cielIndex = (cielIndex + 1) % ciels.length;
    
    let ancienCiel = ciel;
}


if (!music.paused) {
    wait(10, changerCiel);
}


onKeyPress("space", () => {
    if (!music.paused && !nuagesActive) {
        spawnNuage();
        wait(10, changerCiel);
    }
});


// Fonction nuages (appelée uniquement après SPACE)
function spawnNuage() {
    add([
        //sprite("Nuage"),
        sprite("Nuage"),
        pos(width(), rand(40, height() - 100)),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        scale(rand(10, 15)),
        //scale(rand(1.5, 2.5)),
        //z(0),
        color(0,0,0),
        layer("nuages"),
    ]);
        add([
       //sprite("Nuage2"),
        sprite("Nuage2"),
        pos(width(), rand(40, height() - 100)),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        color(0,0,0),
        scale(rand(10, 15)),
        //scale(rand(1.5, 2.5)),
        //z(0),
        layer("nuages")
    ]);

    wait(rand(5, 10), spawnNuage);
}

    add([
        text("Clique sur une forme et choisis le(s) réponse(s)."),
        anchor("center"),
        pos(850,50),
        layer("ui"),
    ],)
  const touche = add([text("Appuie sur Espace pour commencer"),
    anchor("center"),
    pos(850,500),
    ])

//Il y a un bug connu pour l'affichage des positions quand il y en a trop (deux-trois éléments se retrouvent derrière certains rectangles), mais n'est pas trop grave en l'état car ils réapparaissent après quelques réponses correctes et n'influent pas sur les réponses de ceux au-dessus.
// Déclinaisons (formes)
const formes = [
    //Fém.
    { text: "rosae", answers: ["nominatif pluriel", "génitif singulier", "datif singulier", "vocatif pluriel"] },
    { text: "rosam", answers: ["accusatif singulier"] },
    { text: "rosis", answers: ["datif pluriel", "ablatif pluriel"] },
    { text: "rosa", answers: ["nominatif singulier", "vocatif singulier", "ablatif singulier"] },
    { text: "rosarum", answers: ["génitif pluriel"] },
    { text: "rosas", answers: ["accusatif pluriel"] },
    //Masc.
    { text: "dominus", answers: ["nominatif singulier"] },
    { text: "domine", answers: ["vocatif singulier"] },
    { text: "dominum",  answers: ["accusatif singulier"] },
    { text: "domini", answers: ["nominatif pluriel", "vocatif pluriel", "génitif singulier"] },
    { text: "domino", answers: ["datif singulier", "ablatif singulier"] },
    { text: "dominos", answers: ["accusatif pluriel"] },
    { text: "dominorum", answers: ["génitif pluriel"] },
    { text: "dominis", answers: ["datif pluriel", "ablatif pluriel"] },
    //Neutre
    { text: "templum", answers: ["nominatif singulier","vocatif singulier", "accusatif singulier"] },
    { text: "templa", answers: ["nominatif pluriel","vocatif pluriel", "accusatif pluriel"] },
    { text: "templi", answers: ["génitif singulier"] },
    { text: "templo", answers: ["datif singulier", "ablatif singulier"] },
    { text: "templis", answers: ["datif pluriel", "ablatif pluriel"] },
    { text: "templorum", answers: ["génitif pluriel"] },
];

// Fonctions grammaticales
const fonctions = [
    "nominatif singulier",
    "nominatif pluriel",
   
    "vocatif singulier",
    "vocatif pluriel",

    "accusatif singulier",
    "accusatif pluriel",

    "génitif singulier",
    "génitif pluriel",

    "datif singulier",
    "datif pluriel",

    "ablatif singulier",
    "ablatif pluriel",

];

let xStart = 100;
let yStart = 100;
let spacingY = 50;
let maxY = height() - 100;
let column = 0;
let row = 0;





//Perfecr score 12 sur les 6 formes --> 72 donc perfect score 720
const scoreLabel = add([
    text(`Score: ${gameState.score}`, { size: 32 }),
    pos(50, 15),
    layer("ui"),
]);
const erreurLabel = add([
    text(`Erreurs: ${gameState.erreurs}/3`, { size: 32 }),
    pos(50, 40),
    layer("ui"),
]);

function updateScoreLabel() {
    scoreLabel.text = `Score: ${gameState.score}`;
}
function updateErreurLabel() {
    erreurLabel.text = `Erreurs: ${gameState.erreurs}/3`;
}


let selectedForme = null;
const formeCards = [];


//Pour les positionner dès le départ droit (à corriger plus tard)
function positionFormes() {
    const f = formes
    // Position de départ
    let xStart = 100;
    let yStart = 100;
    let spacingY = 50;
    let maxY = height() - 100;
    let column = 0;

    formeCards.forEach((f, i) => {
        let x = xStart + column * 200;
        let y = yStart + (i % Math.floor(maxY / spacingY)) * spacingY;

        if (y >= maxY) {
            column++;
            y = yStart;
        }
        if (x >= maxX) {
            column++;
            x = xStart;
        }
        f.pos = vec2(x, y);
    });
}
positionFormes()


// déclinaisons
formes.forEach((f, index) => {
    let x = xStart + column * 200;
    let y = yStart + row * spacingY;

    if (y >= maxY) {
        column++;
        row = 0;
        y = yStart;
        x = xStart + column * 200;
    }

    row++;

    const box = add([
        rect(150, 40, { radius: 8 }),
        pos(x, y),
        color(255, 255, 200),
        area(),
        outline(2),
        anchor("center"),
        "forme",
        layer("ui"),
        {
            text: f.text,
            answers: f.answers,
            foundAnswers: [],
            disabled: false,
        },
    ]);
//formes
box.add([
    text(f.text, {
        size: 32, 
        font: "times",
    }),
    anchor("center"),
    color(0, 0, 0),
    pos(0, 0),
]);

    box.onClick(() => {
        if (box.disabled) return;

        if (selectedForme === box) {
            box.color = rgb(255, 255, 200);
            selectedForme = null;
            return;
        }

        if (selectedForme) {
            selectedForme.color = rgb(255, 255, 200);
        }

        selectedForme = box;
        box.color = rgb(200, 255, 150);
    });
    formeCards.push(box);
});

//   fonctions
fonctions.forEach((func, i) => {
    const box = add([
        rect(400, 40, { radius: 8 }),
        pos(1500, 80 + i * 50),
        color(200, 225, 255),
        area(),
        outline(5),//10
        anchor("center"),
        "fonction",
        layer("ui"),
        { text: func,},
    ]);

    box.add([
        text(func, { size: 32 }),
        anchor("center"),
        pos(0, 0),
        color(0,0,0),
    ]);

box.onClick(() => {
    if (!selectedForme || selectedForme.disabled) return;

    const isCorrect = selectedForme.answers.includes(func);

add([
    text(isCorrect ? "CORRECT" : "FAUX", { size: 24 }),
    pos(mousePos().x + 10, mousePos().y),
    opacity(1),
    lifespan(1),
    color(isCorrect ? rgb(0, 200, 0) : rgb(200, 0, 0)),
]);

if (!isCorrect) {
    gameState.erreurs++;
    updateErreurLabel();

 if (gameState.erreurs >= 3) {
    if (musique) musique.stop()
    //music.stop(); 
    wait(1, () => go("FinTemplum&Rosa"));
}

}


    if (isCorrect) {
        if (!selectedForme.foundAnswers) {
            selectedForme.foundAnswers = [];
        }

        if (!selectedForme.foundAnswers.includes(func)) {
            selectedForme.foundAnswers.push(func);
            gameState.score += 10;
            updateScoreLabel();
            if(gameState.score == 360){if (musique) musique.stop(); go("RéussiTemplum&Rosa")}//SCORE MAX DE ROSA 120
        }

        const toutesBonnes = selectedForme.answers.every(r =>
            selectedForme.foundAnswers.includes(r)
        );

if (toutesBonnes) {
    formeCards.splice(formeCards.indexOf(selectedForme), 1); 
    destroy(selectedForme); 
//Repositionne
    repositionFormes();
}
    

function repositionFormes() {
    // Position de départ
    let xStart = 100;
    let yStart = 100;
    let spacingY = 50;
    let maxY = height() - 100;
    let column = 0;

    formeCards.forEach((f, i) => {
        let x = xStart + column * 200;
        let y = yStart + (i % Math.floor(maxY / spacingY)) * spacingY;

        
        if (y >= maxY) {
            column++;
            y = yStart;
        }

        f.pos = vec2(x, y);
    });
}




    }
});

});

// Ciel random
onUpdate(() => {
    ciel.use(sprite(music.paused ? "Ciel1" : "Ciel"));
}); 
    
})

scene("FinTemplum&Rosa", () => {
    loadSprite("Alvaresdodo","image/Alvaresdodo.png")
    add([
        sprite("Alvaresdodo"),
        area(),
        outline(2),
        pos(320,720),
        anchor("center"),
        //color(193,210,255),
        scale(20),
        layer("ui"),
    ]);


    add([
        text("Fin de la partie ! Ne dors pas sur tes révisions!", { size: 48 }),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text("Appuie sur Espace pour recommencer ou Enter pour quitter.", { size: 24 }),
        pos(center().x, center().y + 60),
        anchor("center"),
    ]);

    onKeyPress("enter", () => {
        gameState.score = 0;
        gameState.erreurs = 0;
        go("ResultTemple")}) 

    onKeyPress("space", () => {
        if (failMusic) {
        failMusic.stop();
        failMusic = null;
    }
        gameState.score = 0;
        gameState.erreurs = 0;
        go("DeclinaisonTemplum&Rosa");
    });
});

scene("RéussiTemplum&Rosa", () => {
    loadSprite("Alvaresdodo","image/Alvaresdodo.png")
    add([
        sprite("Alvaresdodo"),
        area(),
        outline(2),
        pos(320,720),
        anchor("center"),
        //color(193,210,255),
        scale(20),
        layer("ui"),
    ]);


    add([
        text("Fin de la partie ! Tu peux dormir sereinement.", { size: 48 }),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text("Appuie sur Espace pour recommencer ou Enter pour quitter.", { size: 24 }),
        pos(center().x, center().y + 60),
        anchor("center"),
    ]);

    onKeyPress("enter", () => {
        gameState.score = 0;
        gameState.erreurs = 0;
        niveau =+ 10;
        go("ResultTemple2")}) 

    onKeyPress("space", () => {
        if (failMusic) {
        failMusic.stop();
        failMusic = null;
    }
        niveau =+ 10;
        gameState.score = 0;
        gameState.erreurs = 0;
        go("DeclinaisonTemplum&Rosa");

       // every((obj) => {
        //destroy(obj);
        //return niveau+10

});

  //  });
});

scene("ResultTemple2", () => {
currentScene="ResultTemple2"
    setGravity(600);


    add([
        sprite("Champsnuit"), 
        pos(0, 0),
        scale(width() / 1000, height() / 1000),
        layer("bg"),
    ]);

    // Sol
    add([
        rect(width(), 1000),
        pos(0, 800),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);
let temple = loadSound("Temple", "musique_rendu/calm-waves-soft-piano-314968.mp3")
temple = play("Temple", {
    speed: 1,//1.25
    loop: true,
    seek: 5,
    detune: -120,//-120,//-1200
})
    addLevel([
        "4   4   4   4   4   4   4   4   4   ",
        "0 0 0 0 0 0 0 0 0 0  0  0  0  0  0  0000000000000",
        "   ",
        "2   2   2   2   2   2   2   2   2   2   2        4        2",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
       ],{
        tileWidth: 56,
        tileHeight: 56,
        scale:100,
        tiles: {
                   "0": () => [
                sprite("Solpavé", { }),
                scale(10),//10
                pos(0,650),
                color(120,0,255),
                //area(),
                //body({ isStatic: true})
                ],
                 "1": () => [
                sprite("Solanglegauche", { }),
                scale(10),
                pos(0,650),
                //color(20,0,255),
                //color(193,210,255)
                color(120,0,255),
                //area(),
                //body({ isStatic: false})
                ],
                "2": () => [
                sprite("Multicolonnes", { }),
                scale(2),
                pos(0,300),
                color(100,0,255),
                //color(193,210,255)
                //color(120,0,120),
                //area(),
                //body({ isStatic: false})
                ],
                "4": () => [
                sprite("Etoiles", {}),
                pos(0, 50),
                scale(6),
                area(),
                opacity(0.2),
                body({ isStatic: true }),//-->Laisse passer
                "Etoiles",
                color(240,240,240)],
            }})

    
    kamera.camPos(center());

    // Joueur : Alvares
    const player = kamera.add([
        sprite("alvares"),
        pos(200, 600),
        scale(5),
        area(),
        body(),
        "player",
    ]);

    player.play("idle");


let inconnu = add([
        sprite("Gaulois"),
        pos(1300, 650),
        scale(5),
        area(),
        body({ isStatic: true}),
        "inconnu",
        color(0,0,0)
            ]);
   
    // Variables dialogues
    let inputLocked = false;
    let activeDialogue = null;
    let dialogueDone = false;
    let dialogueDone2 = false;
    let duelDialogueCounter = 0;
let interactionCooldown = 0;

function interact() {
       //inputLocked = true 
    if (interactionCooldown > 0 || activeDialogue) return;

    interactionCooldown = 0.5; // évite double "i"
    
    for (const col of player.getCollisions()) {
        const c = col.target;

        if (c.is("inconnu")) {
            inconnu.flipX = player.pos.x >= inconnu.pos.x;
            inactivityTime = 0;
            hideHintText();

            if (!dialogueDone) {
                inputLocked = true;
                loquace.start("Anylastword2", true);
                loquace.next();
                activeDialogue = "Anylastword2";
                dialogueDone = true;
                   inputLocked = true 
                   destroy (inconnu)
                inconnu = add([
        sprite("Gaulois"),
        pos(1300, 600),
        scale(5),
        area(),
        body({ isStatic: false}),
        "inconnu",
        color(0,0,0)
            ]);
             add([sprite("Colonne"),
        pos(1200, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(900, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(600, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(300, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(0, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(-300, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(-600, 200),
        scale(10),
        color(71,87,180),
    ])

                
            }

            if (!dialogueDone2) {
                
                return;
            }
        }
    }
}
 add([sprite("Colonne"),
        pos(1200, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(900, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(600, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(300, 200),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Colonne"),
        pos(0, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(-300, 200),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Colonne"),
        pos(-600, 200),
        scale(10),
        color(71,87,180),
    ])







    onKeyPress("i", interact);

    // Avancer le dialogue
    onKeyPress("space", () => {
        const progressed = loquace.next();

        if (!progressed) {
            loquace.clear();
            inputLocked = false;
            activeDialogue = null;
        }
    });

    // Mouvements
    const SPEED = 300;

    ["left", "right", "up", "down"].forEach((key) => {
        onKeyDown(key, () => {
            if (inputLocked) return;

            const dir = {
                left: [-SPEED, 0],
                right: [SPEED, 0],
                up: [0, -SPEED],
                down: [0, SPEED],
            }[key];

            player.move(...dir);

            if (key === "right") player.flipX = true;
            if (key === "left") player.flipX = false;

            if (player.curAnim() !== "marche" && player.curAnim() !== "dodo") {
                player.play("marche");
            }

            inactivityTime = 0;
            hideHintText();
            resetDodoTimer();
        });
    });
    function cleanUpScene() {
        //music.stop();//àmodif
        destroyAll();
        loquace.clear();
    }
    onUpdate(() => {
                if (interactionCooldown > 0) {
        interactionCooldown -= dt();
    }
                                    
        if (player.pos.x < 0) {
            cleanUpScene()
            position.x = width() - 10; 
            if (temple) temple.stop();
            go("Champsnuit");
        }


        if (player.pos.x > screenWidth) {
            cleanUpScene()
            position.x = 10; 
            if (temple) temple.stop();
            go("Mer");
        }
        //if (
          //  player.pos.x < 0 ||
            //player.pos.x > width() ||
            //player.pos.y < 0 ||
            //player.pos.y > height()
        //) {
          //  cleanUpScene();
            //go("Mer"); 
        //}
        if (
            !isKeyDown("left") &&
            !isKeyDown("right") &&
            !isKeyDown("up") &&
            !isKeyDown("down") &&
            player.curAnim() !== "idle" &&
            player.curAnim() !== "dodo"
        ) {
            player.play("idle");
        }
    });

    // Inactivité -->animation dodo
    let inactivityTime = 0;
    let dodoTimeout;
    let dodoEndTimeout;

    function resetDodoTimer() {
        if (dodoTimeout) clearTimeout(dodoTimeout);
        if (dodoEndTimeout) clearTimeout(dodoEndTimeout);

        dodoTimeout = setTimeout(() => {
            player.play("dodo");

            dodoEndTimeout = setTimeout(() => {
                player.play("idle");
                resetDodoTimer();
            }, 10000);
        }, 10000);
    }

    resetDodoTimer();

    onUpdate(() => {
        if (!inputLocked) {
            inactivityTime += dt();
        }
    });

    ["left", "right", "up", "down", "i", "space"].forEach((key) => {
        onKeyPress(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
        onKeyDown(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
    });

    let hintText = null;
    let hintShown = false;

    function showHintText() {
        if (hintShown || inputLocked) return;
        hintShown = true;
        hintText = add([
            text("i: interagir | flèches: bouger | espace: passer texte", {
                size: 24,
                width: width() - 100,
                align: "center"
            }),
            pos(center().x, center().y + 200),
            anchor("center"),
            layer("ui"),
            opacity(0),
            fixed()
        ]);

        //onUpdate(() => {
            //if (hintText.opacity < 1) {
              //  hintText.opacity += dt();
            //}
        //});
    }

    function hideHintText() {
        if (hintText) {
            destroy(hintText);
            hintText = null;
            hintShown = false;
        }
    }


    onUpdate(() => {
        if (!inputLocked && inactivityTime >= 5 && !hintShown) {
            showHintText();
        }
    });
});

scene("Mer", () => {
    currentScene="Mer"
    add([
    rect(10, height()),      
    pos(0, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0, 0),         
]);



//loquace.start("Maison")//marche une fois sur deux.
    setGravity(600);

    add([
        sprite("Ciel"),
        pos(0, 0),
        scale(width(), height()),
        layer("bg"),
    ]);
      // Sol
    add([
        rect(width(), 1),
        pos(0, 800),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);

let mer = loadSound("Mouette", "musique_rendu/AMBSea_Mer vagues moyennes et mouettes (ID 0267)_LS.mp3")
mer = play("Mouette", {
    speed: 1,//1.25
    loop: true,
    seek: 5,
    detune: -120,//-120,//-1200
})
    addLevel([
        "4   4   4   4   4   4   4   4   4   ",
        "1      11      11      11      1 111 1 1 1 1 1 1 1 1 1 1 ",
        "0 0 2  00 2  00 0 0 2  00  0  0  0  0  0  0000000000000",
        "   ",
       ],{
        tileWidth: 56,
        tileHeight: 56,
        scale:100,
        tiles: {
                   "0": () => [
                sprite("Solclair", { }),
                scale(10),//10
                pos(0,650),
                //color(120,0,255),
                //area(),
                //body({ isStatic: true})
                ],
                 "1": () => [
                sprite("Mer", { }),
                scale(10),
                pos(0,650),
                //color(20,0,255),
                //color(193,210,255)
                color(120,0,255),
                //area(),
                //body({ isStatic: false})
                ],
                "2": () => [
                sprite("Solfleur", { }),
                scale(10),
                pos(0,650),
                //color(100,0,255),
                //color(193,210,255)
                //color(120,0,120),
                //area(),
                //body({ isStatic: false})
                ],
                "4": () => [
                sprite("Etoiles", {}),
                pos(0, 50),
                scale(6),
                area(),
                opacity(0.2),
                //body({ isStatic: true }),//-->Laisse passer
                "Etoiles",
                color(240,240,240)],
            }})

    
    kamera.camPos(center());

    // Joueur : Alvares
    const player = kamera.add([
        sprite("alvares"),
        pos(200, 600),
        scale(5),
        area(),
        body({isStatic:false}),
        "player",
    ]);

    player.play("idle");

    add([sprite("Mer"),
        pos(1200, 800),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Mer"),
        pos(800, 900),
        scale(10),
        color(71,87,180),
    ])
    add([sprite("Mer"),
        pos(400, 1000),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("Mer"),
        pos(0, 1100),
        scale(10),
        color(71,87,180),
    ])
        add([sprite("pont"),
        pos(1400, 750),//1400,750 le y
        scale(30),//12
        //color(71,87,180),
        area(),
        body({ isStatic: true}),
        "pont",
    ])


let inconnu = add([
        sprite("Gaulois"),
        pos(400, 750),
        scale(5),
        area(),
        body({ isStatic: true}),
        "inconnu",
       //color(0,0,0)
            ]);


let menuOpen = false;


function showChoiceMenu() {
    inputLocked = true 
        menuOpen = true;
    const options = ["Oui", "Non"];
    const choiceTexts = [];

    let selectedIndex = 0;

    const baseY = height() / 2 + 100;

    function updateSelection() {
        for (let i = 0; i < choiceTexts.length; i++) {
            choiceTexts[i].color = i === selectedIndex ? rgb(255, 255, 0) : rgb(255, 255, 255); // Jaune pour sélection
        }
    }
let murdroite =  add([
    rect(1, height()),       
    pos(1800, 0),
    area(),
    body({ isStatic: false }),
    color(0, 0, 0, 0),         
]);
    //  options
    options.forEach((opt, i) => {
        const txt = add([
            text(opt, { size: 32 }),
            pos(center().x, baseY + i * 40),
            anchor("center"),
            layer("ui"),
            "choiceOption"
        ]);
        choiceTexts.push(txt);
    });

    updateSelection();

    onKeyPress("up", () => {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        updateSelection();
    });

    onKeyPress("down", () => {
        selectedIndex = (selectedIndex + 1) % options.length;
        updateSelection();
    });

    onKeyPress("enter", () => {
        destroyAll("choiceOption");
        menuOpen = false; 
        if (options[selectedIndex] === "Oui") {
            cleanUpScene();
            if (mer) mer.stop();
            go("Sur la mer");
        } else {
               murdroite = add([
    rect(0, 0),      
    pos(0, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0, 0),        
]);
            loquace.clear(); 
        }
    });
}

    // Variables dialogues
    let inputLocked = false;
    let activeDialogue = null;
    let dialogueDone = false;
    let dialogueDone2 = false;
    let duelDialogueCounter = 0;
let interactionCooldown = 0;

function interact() {
       //inputLocked = true 
    if (interactionCooldown > 0 || activeDialogue) return;

    interactionCooldown = 0.5; // évite double "i"
    
    for (const col of player.getCollisions()) {
        const c = col.target;

         if (c.is("pont")) {
                console.log("La fonction marche")
            showChoiceMenu();
            return;
            }
        if (c.is("inconnu")) {
    inconnu.flipX = player.pos.x >= inconnu.pos.x;
            inactivityTime = 0;
            hideHintText();

            if (!dialogueDone) {
                inputLocked = true;
                loquace.start("Anylastword3", true);
                loquace.next();
                activeDialogue = "Anylastword3";
                dialogueDone = true;
                //destroy(inconnu)
                   inputLocked = true 
                   inconnu = player.add([
    sprite("Gaulois"),
    pos(50, 600),
    scale(5),
    //area(),
    body(),
    body({isStatic:false}),
    "inconnu",
])
                   }

    
                }  
            if (!dialogueDone2) {
                
                return;
            }

    }
}
let trireme = add([
    sprite("trireme"),
    pos(800,0),
    scale(50),
])
    onKeyPress("i", interact);

    // Avancer le dialogue
    onKeyPress("space", () => {
        const progressed = loquace.next();

        if (!progressed) {
            loquace.clear();
            inputLocked = false;
            activeDialogue = null;
        }
 if (duelDialogueCounter === 2) {
            showChoiceMenu();
        }
    });

    // Mouvements
    const SPEED = 300;

    ["left", "right", "up", "down"].forEach((key) => {
        onKeyDown(key, () => {
            if (inputLocked) return;

            const dir = {
                left: [-SPEED, 0],
                right: [SPEED, 0],
                up: [0, -SPEED],
                down: [0, SPEED],
            }[key];

            player.move(...dir);

            if (key === "right") player.flipX = true;
            if (key === "left") player.flipX = false;
            if (key === "right") inconnu.flipX = true;
            if (key === "left") inconnu.flipX = false;

            if (player.curAnim() !== "marche" && player.curAnim() !== "dodo") {
                player.play("marche");
            }

            inactivityTime = 0;
            hideHintText();
            resetDodoTimer();
        });
    });
    function cleanUpScene() {
        //music.stop();//àmodif
        destroyAll();
        loquace.clear();
    }

    onUpdate(() => {
                if (interactionCooldown > 0) {
        interactionCooldown -= dt();
    }

        if (player.pos.x < 0) {
            cleanUpScene()
            position.x = width() - 10; 
            if (mer) mer.stop();
            go("Temple");
        }

 
        if (player.pos.x > screenWidth) {
            cleanUpScene()
            position.x = 10; 
            if (mer) mer.stop();
            go("Sur la mer")
        }

        if (
            !isKeyDown("left") &&
            !isKeyDown("right") &&
            !isKeyDown("up") &&
            !isKeyDown("down") &&
            player.curAnim() !== "idle" &&
            player.curAnim() !== "dodo"
        ) {
            player.play("idle");
        }
    });

    // Inactivité -->animation dodo
    let inactivityTime = 0;
    let dodoTimeout;
    let dodoEndTimeout;

    function resetDodoTimer() {
        if (dodoTimeout) clearTimeout(dodoTimeout);
        if (dodoEndTimeout) clearTimeout(dodoEndTimeout);

        dodoTimeout = setTimeout(() => {
            player.play("dodo");

            dodoEndTimeout = setTimeout(() => {
                player.play("idle");
                resetDodoTimer();
            }, 10000);
        }, 10000);
    }

    resetDodoTimer();

    onUpdate(() => {
        if (!inputLocked) {
            inactivityTime += dt();
        }
    });


    ["left", "right", "up", "down", "i", "space"].forEach((key) => {
        onKeyPress(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
        onKeyDown(key, () => {
            inactivityTime = 0;
            hideHintText();
        });
    });

    let hintText = null;
    let hintShown = false;

    function showHintText() {
        if (hintShown || inputLocked) return;
        hintShown = true;
        hintText = add([
            text("i: interagir | flèches: bouger | espace: passer texte", {
                size: 24,
                width: width() - 100,
                align: "center"
            }),
            pos(center().x, center().y + 200),
            anchor("center"),
            layer("ui"),
            opacity(0),
            fixed()
        ]);

    }

    function hideHintText() {
        if (hintText) {
            destroy(hintText);
            hintText = null;
            hintShown = false;
        }
    }


    onUpdate(() => {
        if (!inputLocked && inactivityTime >= 5 && !hintShown) {
            showHintText();
        }
    });
});

//Plus VN ce code
scene("Sur la mer", () => {
let mouette = loadSound("Mouette", "musique_rendu/AMBSea_Mer vagues moyennes et mouettes (ID 0267)_LS.mp3")
    mouette = play("Mouette", {
    speed: 1,//1.25
    loop: true,
    seek: 5,
    detune: -120,//-120,//-1200
})
    currentScene = "Sur la mer";
    loquace.start("En chemin");

    let dialogueDone = false;
    let interactionCooldown = 0;
    let activeDialogue = 0;
    let dialogueIndex = 0;
    const fadeTriggerIndex = 22;

    function interact() {
        if (interactionCooldown > 0 || activeDialogue) return;
        interactionCooldown = 0.5;

        if (!dialogueDone) {
            loquace.start("En chemin", true);
            loquace.next();
            activeDialogue = "En chemin";
            dialogueDone = true;
        }
    }

    onKeyPress("i", interact);

    // Background
    add([sprite("Ciel"), scale(10)]);

    for (let x = 0; x <= 1600; x += 400) {
        add([
            sprite("Mer"),
            pos(x, 500),
            scale(2),
            color(71, 87, 180),
            {
                dir: -1,
                speed: 40,
                yBase: center().y,
                update() {
                    this.pos.y += this.dir * dt() * this.speed;
                    if (this.pos.y <= this.yBase - 20 || this.pos.y >= this.yBase + 20) {
                        this.dir *= -1;
                    }
                }
            }
        ]);
    }

    add([
        sprite("trireme"),
        scale(3),
        pos(center().x, center().y),
        {
            dir: -1,
            speed: 40,
            yBase: center().y,
            update() {
                this.pos.y += this.dir * dt() * this.speed;
                if (this.pos.y <= this.yBase - 20 || this.pos.y >= this.yBase + 20) {
                    this.dir *= -1;
                }
            }
        }
    ]);

    onKeyPress("space", () => {
        loquace.next();
        dialogueIndex++;

        if (dialogueIndex === fadeTriggerIndex) {
            const fade = add([
                rect(width(), height()),
                color(0, 0, 0),
                pos(0, 0),
                opacity(0),
                z(100),
                "fade",
            ]);

    
            tween(
                0, 1, 1,
                (val) => fade.opacity = val,
                easings.linear,
                () => {
                    destroy(fade);
                    if (mouette) mouette.stop();
                    go("cinematique");
                }
            );
        }
        if (dialogueIndex === (fadeTriggerIndex + 1)) {
            if (mouette) mouette.stop();
        go("cinematique");}
    });
});

scene("cinematique", () => {
let mouette = loadSound("Mouette", "musique_rendu/AMBSea_Mer vagues moyennes et mouettes (ID 0267)_LS.mp3")
 mouette = play("Mouette", {
    speed: 1,//1.25
    loop: true,
    seek: 5,
    detune: -120,//-120,//-1200
})
loquace.start("En chemin2")
    destroyAll("fade");

    const fadeIn = add([
        rect(width(), height()),
        color(0, 0, 0),
        pos(0, 0),
        opacity(1),
        z(100),
    ]);

    tween(
        fadeIn.opacity,
        0,
        1,
        (val) => fadeIn.opacity = val,
        easings.linear,
        () => destroy(fadeIn) 
    );

    let dialogueDone = false;
    let interactionCooldown = 0;
    let activeDialogue = 0;
    let dialogueIndex = 0;
    const fadeTriggerIndex = 17;//16


    function interact() {
        if (interactionCooldown > 0 || activeDialogue) return;
        interactionCooldown = 0.5;

        if (!dialogueDone) {
            loquace.start("En chemin", true);
            loquace.next();
            activeDialogue = "En chemin";
            dialogueDone = true;
        }
    }

    onKeyPress("i", interact);
    // Background
    add([sprite("Ciel"), scale(8), color(0,0,255)]);

    for (let x = 0; x <= 1600; x += 400) {
        add([
            sprite("Mer"),
            pos(x, 500),
            scale(2),
            color(71, 87, 180),
            {
                dir: -1,
                speed: 40,
                yBase: center().y,
                update() {
                    this.pos.y += this.dir * dt() * this.speed;
                    if (this.pos.y <= this.yBase - 20 || this.pos.y >= this.yBase + 20) {
                        this.dir *= -1;
                    }
                }
            }
        ]);
    }
            //Après 15 intéractions dialogues, l'image apparait --> enlevé
       let ostia = add([
                    sprite("ostia"),
                    pos(1100, 300),
                    scale(8),
                    //z(),
                    //"bg"
                ]);

    add([     
        sprite("mouettes"),
        scale(4),
        pos(1000,100),
        {
            dir: -1,
            speed: 40,
            yBase: center().y,
            update() {
                this.pos.y += this.dir * dt() * this.speed;
                if (this.pos.y <= this.yBase - 20 || this.pos.y >= this.yBase + 20) {
                    this.dir *= -1;
                }
            }
        }])


    onKeyPress("space", () => {
        loquace.next();
        dialogueIndex++;

   
if (dialogueIndex === fadeTriggerIndex) {
    const screenHeight = height();

    let curtain = add([
        rect(width(), 0),     
        color(0, 0, 0),
        pos(0, screenHeight),     
        opacity(1),
        z(100),
        "curtain"
    ]);

    let curtainHeight = 0;
    let hasSwitchedImage = false;

    tween(
        curtainHeight,
        screenHeight, // Le rideau va s'étirer jusqu'à couvrir tout l'écran
        2,
        (val) => {
            curtainHeight = val;

            // ajuste la taille/hauteur ET la position du haut du rideau
            curtain.height = curtainHeight;
            curtain.pos.y = screenHeight - (curtainHeight);

            // change l'image quand le rideau a couvert tout--> pas réussi mais tant pis
            if (!hasSwitchedImage && curtain.pos.y <= 0) {
                hasSwitchedImage = true;

                

            }
        },
        easings.easeInOutSine
    );
}





        if (dialogueIndex === (fadeTriggerIndex + 2)) {
        if (mouette) mouette.stop();
        go("Fin_prologue");
        play("Fin_Prologue", {
        speed: 1.25,
        loop: false,
        seek: 0,
        detune: -120,
    });}
    });

add([
    color(0,0,0),
    pos(0, 0),
    rect(width(), 300),
   // z(100),
])

    // Sprite avec animation
    let anim = add([
        sprite("cinematic"),
        pos(100,0),
        scale(10)
    ]);

    anim.play("idle");
   
    add([
    color(0,0,0),
    pos(0, 800),
    rect(width(), 300),
   // z(100),
])
    




})

scene("Fin_prologue", () => {
 


    destroyAll("fade");

   
    const fadeIn = add([
        rect(width(), height()),
        color(0, 0, 0),
        pos(0, 0),
        opacity(1),
        z(100),
        "fade"
    ]);
    tween(fadeIn.opacity, 0, 1, (val) => fadeIn.opacity = val, easings.linear, () => destroy(fadeIn));


    add([
        rect(width(), height()),
        color(0, 0, 0),
        pos(0, 0),
    ]);


    const texteFin = add([
        text("Fin du prologue (appuyer sur espace)", { size: 48 }),
        pos(center()),
        anchor("center"),
        color(WHITE),
        opacity(1),
        z(10),
    ]);

    onKeyPress("space", () => {
        tween(
            texteFin.opacity,
            0,
            1,
            (val) => texteFin.opacity = val,
            easings.easeInOutCubic,
            () => {
            }
        ); 
        go("Hub");
    });
});

//--------------------CHAPITRE 1 / NIVEAU 1---------------------

//Le joueur doit trouvé la "menace sur la ville" pour aller au niveau 2

scene("Hub",  () => {
    currentScene="Hub"

add([
    rect(1, 2000),      
    pos(-2500, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0, 0),    
]);
let murdroite =  add([
    rect(1, 2000),       
    pos(1700, 0),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0, 0),        
]);
    const touche = add([
        text("m : menu, s : pour sauvegarder, i : pour intéragir avec personnage ou entrer un lieu"),
        //anchor("center")
        pos(250,250)
    ])
    
    //Joueur 
const player = kamera.
add([
    sprite("alvares"),   
    pos(300, 700),//200,600        //1500,600 
    rotate(0),        
    scale(5),
    area(),
    body(),
    opacity(1),
    animate(),
    "Alvares",
    layer("ui"),
    body({ isStatic: false }),
])
let dodoTimeout;
let dodoEndTimeout;


function resetDodoTimer() {
    if (dodoTimeout) clearTimeout(dodoTimeout);
    if (dodoEndTimeout) clearTimeout(dodoEndTimeout);

    dodoTimeout = setTimeout(() => {
        player.play("dodo");

    
        dodoEndTimeout = setTimeout(() => {
            player.play("idle");
            resetDodoTimer();
        }, 10000); // 3000 ms = 3 sec

    }, 10000); //10000 10 secondes d'inactivité
}
let menuOpen = false;





// Mouvements
["left", "right", "up", "down"].forEach((key) => {
    onKeyDown(key, () => {
        //if (menuOpen || inputLocked) return;

        const dir = {
            left: [-SPEED, 0],
            right: [SPEED, 0],
            up: [0, -SPEED],
            down: [0, SPEED],
        }[key];

        player.move(...dir);

        if (key === "right") player.flipX = true;
        if (key === "left") player.flipX = false;

        // Ne pas "marche" pendant un dialogue
        if (
            //!inputLocked &&
            player.curAnim() !== "marche" &&
            player.curAnim() !== "dodo"
        ) {
            player.play("marche");
        }

        //userHasInteracted = true;
        //inactivityTime = 0;
        //hideHintText();
        resetDodoTimer();
    });
});


onUpdate(() => {
    if (
        !isKeyDown("left") &&
        !isKeyDown("right") &&
        !isKeyDown("up") &&
        !isKeyDown("down") &&
        player.curAnim() !== "idle" &&
        player.curAnim() !== "dodo"
    ) {
        player.play("idle");
    }
});


// 
player.play("idle");
resetDodoTimer();



player.pos = vec2(joueur.x, joueur.y);

joueur.x = player.pos.x;
joueur.y = player.pos.y;



    fonduEntrant();

   // add([text("Hub", { size: 32 }), pos(50, 50)]);

    let music = play("hub", {
    //   volume: 1,
        speed: 1,
        loop: true,
        seek: 5, //en secondes
   });
    music.paused = false
    music.speed = 1.0 //2.0
    //onKeyPress("space", () => music.paused = !music.paused)

        const ciel = add([
            sprite("Ciel"),
            pos(-5000, 0),
            scale(20),//20
            //color(0,0,120),
            "Ciel",])
        const tourauloin = add([
    //"bg",
    area({  }),
    //body({ isStatic: true}),
    tile({ isObstacle: true}),
    "legrandarbre",//Pour l'instant placeholder pour la biblio
    
    sprite("tour"),
    pos(450,800), //pour 20 pos(-1520,254),  // 15 et  pos(-1400,550)//pos(-1400,450)
    scale(3),//50 pour erable //20 cerisier
    //color(249, 193, 231),
    color(33, 5, 151 ),
    z(0),
        {
        dir: -1,
        speed: 1,//20
        xBase: center().x,
        update() {
            this.pos.x += this.dir * dt() * this.speed;
            if (this.pos.x <= this.xBase - 20 || this.pos.x >= this.xBase + 20) {
                this.dir *= -1;
            }
        }
    }
])
const legrandarbreauloin = add([
    //"bg",
    area({  }),
    //body({ isStatic: true}),
    tile({ isObstacle: true}),
    "legrandarbre",//Pour l'instant placeholder pour la biblio
    
    sprite("Cerisier"),
    pos(750,450), //pour 20 pos(-1520,254),  // 15 et  pos(-1400,550)//pos(-1400,450)
    scale(10),//50 pour erable //20 cerisier
    //color(249, 193, 231),
    color(33, 5, 151 ),
    //z(999),
        {
        dir: -1,
        speed: 1,//20
        xBase: center().x,
        update() {
            this.pos.x += this.dir * dt() * this.speed;
            if (this.pos.x <= this.xBase - 20 || this.pos.x >= this.xBase + 20) {
                this.dir *= -1;
            }
        }
    }
])
const legrandarbreauloin2 = add([
    //"bg",
    area({  }),
    //body({ isStatic: true}),
    tile({ isObstacle: true}),
    "legrandarbre",//Pour l'instant placeholder pour la biblio
    
    sprite("Cerisier"),
    pos(450,800), //pour 20 pos(-1520,254),  // 15 et  pos(-1400,550)//pos(-1400,450)
    scale(6),//50 pour erable //20 cerisier
    //color(249, 193, 231),
    color(33, 5, 151 ),
    //z(999),
        {
        dir: -1,
        speed: 1,//20
        xBase: center().x,
        update() {
            this.pos.x += this.dir * dt() * this.speed;
            if (this.pos.x <= this.xBase - 20 || this.pos.x >= this.xBase + 20) {
                this.dir *= -1;
            }
        }
    }
])


    addLevel([
        "                                -                               -                                        ",//MAX
        "                     -                      -                              -                                           ",
        "                                   -                                                              -      ",//MAX
        "                                                       -                                                ",
        "         -                                                                                              ",//MAX
        "                                                                                           -            ",
        "-  -    -                                                                                         ",//MAX
        "-       -       -        -       ",
        "                                            -             ",//MAX
        "                                                                                                       ",
        "                                                                                                       ",//MAX
        "                                      -           -                                     -                 ",
        "             -                                                                                          ",//MAX
        "                                                                                                 ",
        "                                -  -         -         -                                        ",//MAX
        "o      o       o      o       o      o      o      o      o      o      o      o      o      o      o      o      o      o      o      o      o      o      o                                                                                                                 ",
        "  f                                                                                                     ",//MAX
        "                                                                                                      ",
        "                                                                                                       ",//MAX
        "                                                                                                      ",
        "                                                                                                      ",//MAX
        "                                                                                                       ",
        "                                                                                 ",//MAX
        "                                                                                                        ",
        "                          d         d         d                                                                             ",//MAX
        "                                                                                                       ",
        "                                                                                                       ",//MAX
        "                                                                      è                                 ",
        "       è                           è                                                                     ",//MAX
        "                    è                                     è                                              ",
        "                                                                                                       ",//MAX
        "                                    ",
        "iiii21 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 13  0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 00",//LIMITE ET HAUTEUR ENTRE-GUILLEMET MOYENNE (BÂTIMENT EN HAUTEUR ET BÂTIMENT EN BAS)
        "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0  0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",//MAX
        "                  0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
    ], {
        tileWidth: 56,
        tileHeight: 56,
        scale:100,
        tiles: {
            "i": () => [
                sprite("Solclair", { }),
                scale(5),
                pos(-2550,0),
                //color(0,0,0),
                area(),
                body({ isStatic: true }),
            ],
            //"j": () => [//Pour hitbox, faudrait juste ajouter une barre verticale et enlever le isstatic de l'escalier pour la barre!
              //  sprite("Escalier", { }),
                //scale(5),
                //area({  }),
                //body({ isStatic: false }),
            //],
            "0": () => [
                sprite("Solfleur", { }),
                scale(5),
                pos(-2550,0),
                //color(0,0,0),
                area(),
                body({ isStatic: true }),
            ],
            "1": () => [
                sprite("Solpavé", { }),
                scale(5),
                pos(-2550,0),
                //color(0,0,0),
                area(),
                body({ isStatic: true }),
            ],
            "2": () => [
                sprite("Solanglegauche", { }),
                scale(5),
                pos(-2550,0),
                //color(0,0,0),
                area(),
                body({ isStatic: true }),
            ],
            "3": () => [
                sprite("Solangledroit", { }),
                scale(5),
                pos(-2550,0),
                //color(0,0,0),
                area(),
                body({ isStatic: true }),
            ],





            "z": () => [
                sprite("Erable", { }),
                scale(15),
                pos(0,-500)
            ],






            "c":() => [
                sprite("Multicolonnes", { }),
                pos(0,465)
            ],
            "k":() => [
                sprite("Colonne", { }),
                scale(4),
                color(193,210,255)
            ],
            "l":() => [
                sprite("Colonne", { }),
                pos(0,-270),
                scale(6)
            ],
            "d":() => [
                sprite("Colonne_corinthienne", { }),
                pos(0,-270),
                scale(6)
            ],



            "n": () => [
                sprite("Cielnuit", { })
            ],
            "m":() => [
                sprite("Lune", { }),
                scale(12),
            ],
            "h":() => [
                sprite("Luciole", { }),
                scale(6),
                
            ],           
            "f":() => [
                sprite("Phare", { }),
                scale(12),
                pos(-2750,-2525),
                area({  }),
                //body({ isStatic: true}),
                tile({ isObstacle: true}),
                "phare",
                //body({ isStatic: true }),
            ],
            "e":() => [
                sprite("Etoiles", { }),
                scale(1),
            ],
            "o":() => [
                sprite("Mer", { }),
                scale(1),
                pos(-5000,500),//-2750
                
            ],
            "t":() => [
                sprite("Coquelicot", { }),
                scale(1),//3
                //color(255,255,255),
                pos(-2500,-500),
                
            ],
            "u":() => [ //Pour effet de premier plan
                sprite("Coquelicot", { }),
                scale(1),//3
                pos(0,-60),
                
            ],
            "r":() => [
                sprite("Champs", { }),
                scale(2.5),
                pos(0,0),
                
            ],
            "g":() => [
                sprite("Gaulois", { }),
                scale(5),//le sprite est petit
                pos(0,-100),
                area({  }),
                body({ isStatic: true }),
            ],
           // "y":() => [
             //   sprite("Nuage", { }),
               // scale(5),//le sprite est petit
                //pos(0,-100),
                //area({  }),
                //body({ isStatic: true }),  
            //],
            "è": () => [
                sprite("Feuilles", {}),
                scale(1),
                pos(0,0),
                opacity(0.25),
                //buoyancyEffector({
                  //  surfaceLevel: 100,
                    //density: 0.5,
               // })


            ]

        },
    });
add([
    sprite("Bibliothèque"),
    area({  }),
    //body({ isStatic: true}),
    tile({ isObstacle: true}),
    pos(-1920,793),//15 scale 300 y
    scale(10),
    "Bibliothèque",
    z(999),
])



//Test animation Feuilles des arbres
const obj = add([
    pos(0,500),
    color(242, 0, 255),
    sprite("Feuilles"),
    body({ isStatic: true }),
    scale(7),
    {
        time: 0,
    },
],
);
add([
    pos(300,1090),
    sprite("Vitraux"),
    body({ isStatic: true }),
    scale(7),
])

obj.onUpdate(() => {
    obj.time += dt();
    const t = (obj.time % 5) / 2;
    obj.pos = lerp(vec2(200, -250), vec2(50, 550), t);
})

    


// Animation bateau
const trireme = add([
    //color(0,0,255),
    sprite("trireme"),
    scale(4),
    pos(120,1254),//1854
    {
        dir: -1,
        speed: 40,
        yBase: center().y,
        update() {
            this.pos.y += this.dir * dt() * this.speed;
            if (this.pos.y <= this.yBase - 20 || this.pos.y >= this.yBase + 20) {
                this.dir *= -1;
            }
        }
    }
])

const bateau = add([
    //color(0,0,255),
    sprite("trireme"),
    scale(1),
    pos(0,1304),//1854//1254
    {
        dir: -1,
        speed: 40,
        yBase: center().y,
        update() {
            this.pos.y += this.dir * dt() * this.speed;
            if (this.pos.y <= this.yBase - 20 || this.pos.y >= this.yBase + 20) {
                this.dir *= -1;
            }
        }
    }
])
    //JOUEUR & camera

    const pnj = add([
        sprite("Gaulois"),   
        pos(0, 1800),     
        rotate(1),        
        //anchor("center"), 
        scale(5),
        area(),
        // body()
        "Gaulois",
        //body({ isStatic: true }),

    ])
    //PNJ
    add([
        sprite("bibliothécaire"),
        pos(200, 1800),//pos(200, 2000),
        scale(5),
        area(),
        "Exilé",
        //body({ isStatic: true }),
    ])
   
    add([
        rect(width(), 48),
        outline(4),
        area(),
        pos(0, 3360),
        body({ isStatic: true }),
    ])

let fleur = add([
    sprite("Coquelicot"),
    pos(750,450),
    scale(18),

])
    const legrandarbre = add([
    //"bg",
    area({  }),
    //body({ isStatic: true}),
    tile({ isObstacle: true}),
    "legrandarbre",//Pour l'instant placeholder pour la biblio
    
    sprite("Cerisier"),
    pos(-1400,300), //pour 20 pos(-1520,254),  // 15 et  pos(-1400,550)//pos(-1400,450)
    scale(18),//50 pour erable //20 cerisier
    color(249, 193, 231),
   // z(999),
])

let vitrailInteractReady = false;
     //Interaction    et Dialogue
   function interact() {
    let interacted = false;
    for (const col of player.getCollisions()) {
        const c = col.target;
        //if (c.is("vitraux"))//{go("Boss")}//Pour changement de scene
        //if (c.is("colonne")) {go("Introduction")}
        if (c.is("Bibliothèque")) {
            if(music) music.stop();
            go("Bibliothèque")}

 
        
    }
        if(!interacted) {
    }
}
onKeyPress("i", interact);


 setGravity(600) //800
    
 onKeyPress("space", () => {
     if (player.isGrounded()) {
      
         player.jump()
     }
 })
 
 
 onKeyDown("down", () => {
     if (!player.isGrounded()) {
         player.vel.y += dt() * 1200
     }
 })
 

onKeyPress("m", () => {
    go("menu1")}),    


//LA CAMERA
player.onUpdate(() => {
    kamera.camPos(player.pos)
})
    
    // onKeyDown() registers an event that runs every frame as long as user is holding a certain key
 //DEPLACEMENT DU player
    onKeyDown("left", () => {
        //if (menuOpen) return;
        //if () return;
        player.move(-SPEED, 0)
        player.flipX = false;
          //  userHasInteracted = true;
    //inactivityTime = 0;
    //hideHintText();

    })
    
    onKeyDown("right", () => {
//if (menuOpen || inputLocked) return;
        player.flipX = true;
        player.move(SPEED, 0)
            //userHasInteracted = true;
    //inactivityTime = 0;
    //hideHintText();
    })
    
    onKeyDown("up", () => {
//if (menuOpen || inputLocked) return;
        player.move(0, -SPEED)
           // userHasInteracted = true;
    //inactivityTime = 0;
    //hideHintText();
    })
    
    onKeyDown("down", () => {
//if (menuOpen || inputLocked) return;
        player.move(0, SPEED)
          //  userHasInteracted = true;
    //inactivityTime = 0;
    //hideHintText();
    })
        onKeyDown("i", () => {
//if (menuOpen || inputLocked) return;
           // userHasInteracted = true;
    //inactivityTime = 0;
    //hideHintText();
    })
    
    
    onButtonPress("space", loquace.next)
   
  


    
})
//Le lieu pour sélectionner tous les niveaux
//Manque encore adjectifs et conjugaison
scene("Bibliothèque", () => {
currentScene="Bibliothèque"
add([
    sprite("Fondbiblio"),
    //scale(10),
    pos(0,-720),
    scale(20),
    layer("bg"),
])
// Sol
    add([
        rect(width(), 1),
        pos(0, 600),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);

add([
    sprite("parquet"),
    pos(1500,700),
    scale(10),
    color(120,120,120),
])
add([
    sprite("parquet"),
    pos(1200,700),
    scale(10),
    color(120,120,120),
    body(),
])
add([
    sprite("parquet"),
    pos(900,700),
    scale(10),
    color(120,120,120),
    body(),
])
add([
    sprite("parquet"),
    pos(600,700),
    scale(10),
    color(120,120,120),
    body(),
])
add([
    sprite("parquet"),
    pos(300,700),
    scale(10),
    color(120,120,120),
    body(),
])
add([
    sprite("parquet"),
    pos(0,700),
    scale(10),
    color(120,120,120),
    body(),
])


add([
    sprite("biblio"),
    pos(0, 350),
    area(),
    scale(10),
    color(120,120,120),
    body({ isStatic: true }),
    //color(0, 0, 0),
    
])
add([
    sprite("biblio"),
    pos(300, 350),
    area(),
    scale(10),
    color(120,120,120),
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("biblio"),
    pos(600, 350),
    area(),
    scale(10),
    color(120,120,120),
    //
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("biblio"),
    pos(900, 350),
    area(),
    scale(10),
    color(120,120,120),
    //
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("biblio"),
    pos(1200, 350),
    area(),
    scale(10),
    color(120,120,120),
    //
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("biblio"),
    pos(1500, 350),
    area(),
    scale(10),
    color(120,120,120),
    //
    body({ isStatic: true }),
    //color(0, 0, 0),
])

add([
    sprite("biblio"),
    pos(1500, 900),
    area(),
    scale(10),
    color(12,12,12),
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("biblio"),
    pos(1200, 900),
    area(),
    scale(10),
    color(12,12,12),
    //
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("biblio"),
    pos(900, 900),
    area(),
    scale(10),
    color(12,12,12),
    //
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("biblio"),
    pos(600, 900),
    area(),
    scale(10),
    color(12,12,12),
    //
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("biblio"),
    pos(300, 900),
    area(),
    scale(10),
    color(12,12,12),
    //
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("biblio"),
    pos(0, 900),
    area(),
    scale(10),
    color(12,12,12),
    //
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("table"),
    pos(200, 550),
    area(),
    scale(5),
    //color(12,12,12),
    //
    body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("mapmonde"),
    scale(4),
    pos(240,500)
   // color(120,120,120),
])
add([
    sprite("livre"),
    pos(900, 600),
    area(),
    scale(5),
    //color(12,12,12),
    //
    //body({ isStatic: true }),
    //color(0, 0, 0),
])
add([
    sprite("pilelivre"),
    pos(600, 700),
    area(),
    scale(5),
    //color(120,120,255),
    //
    //body({ isStatic: true }),
    //color(0, 0, 0),
])
let biblio = loadSound("Biblio", "musique_rendu/waiting-music-116216.mp3")
biblio = play("Biblio", {
    loop: true,
    speed: 1,
    detune: -120,
    seek: 5,
});
biblio.paused = false;


let inputLocked = false;

    let fadeStarted = false;
    let fadeDuration = 2; // en secondes
    let fadeTime = 0;
    let camAnimStarted = false;

    let pressSpaceText = null;
    
const delayBeforeCamMove = 1.5; 
let camDelayTimer = 0;
let talkMusicPlayed = false;

const titleText = add([
    text("Bibliothèque d'Ostia - Presser Enter", {
        size: 48,
        width: width(),
        align: "center"
    }),
    pos(center().x, 100),
    anchor("center"),
    layer("ui"),
]);

function startCameraAnim() {
    kamera.camPos(vec2(width() / 2, cameraStartY));
    camAnimStarted = true;
    camAnimTime = 0;
}
let interactionCooldown = 0;

onUpdate(() => {
    if (!inputLocked) {
    inactivityTime += dt();
    if (inactivityTime >= inactivityLimit && !hintShown) {
        showHintText();
    }
}

        if (interactionCooldown > 0) {
        interactionCooldown -= dt();
    }
    if (fadeStarted && fade.opacity < 1 && !camAnimStarted) {
        fadeTime += dt();
        fade.opacity = Math.min(fadeTime / fadeDuration, 1);
        if (fade.opacity >= 1) {
            camAnimStarted = true;
            camDelayTimer += dt();
            startCameraAnim(); 
        }
    }

  
        if (camDelayTimer >= delayBeforeCamMove && titleText) {
            startCameraAnim();
            camAnimStarted = true;
            destroy(titleText);
        
    }

    if (camAnimStarted && camAnimTime < camAnimDuration) {
        camAnimTime += dt();
        const t = camAnimTime / camAnimDuration;
        const lerpedY = lerp(cameraStartY, cameraEndY, t);
        kamera.camPos(vec2(width() / 2, lerpedY));
        fade.opacity = 1 - t;


        if (!talkMusicPlayed) {
           
            talkMusicPlayed = true;
        }
     if (!loquace.start()) {
    inactivityTime += dt();
    if (inactivityTime > inactivityLimit && !hintShown) {
        showHintText();
    }


        if (player.pos.x < 0 || player.pos.x > width() || player.pos.y < 0 || player.pos.y > height()) {
            cleanUpScene(); 
            if (biblio) biblio.stop();
            go("Hub"); 
    }
    }
    
}
   
        if (camAnimStarted && camAnimTime < camAnimDuration) {
            camAnimTime += dt();
            const t = camAnimTime / camAnimDuration;
            const lerpedY = lerp(cameraStartY, cameraEndY, t);
            kamera.camPos(vec2(width() / 2, lerpedY));


            fade.opacity = 1 - t;

    const isDialogueActive = get("loquaceDialog").length > 0;

    if (isDialogueActive) {
        inactivityTime = 0;

        if (hintShown) {
            hideHintText();
            hintShown = false;
        }

        return;
    }


    inactivityTime += dt();


    if (inactivityTime >= inactivityLimit && !hintShown) {
        showHintText();
    } onKeyPress(() => {
    inactivityTime = 0;
});

   
}
});

    onKeyPress("enter", () => {

    if (!fadeStarted) {
        fadeStarted = true;
    
        //destroy(pressSpaceText); 
        play("startSound"); 
    }
   
      }
      )
onKeyPress("space", () => {
    const progressed = loquace.next();

    if (activeDialogue === "Duel") {
        duelDialogueCounter++;
        if (duelDialogueCounter === 2) {
            showChoiceMenu();
        }
    }

    if (!progressed) {
        loquace.clear();
        inputLocked = false;
        activeDialogue = null;
        duelDialogueCounter = 0;
    }
});

        //let bell = play("bell", {
          //  volume: 0.8,
            //speed: 1,//1.5//1.25//1.15
            //loop: true,
            //paused: true,
        //});

const fade = add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0),
    fixed(),
    layer("ui")
]);

// Animation déclenchée SEULEMENT après fondu complet
function startCameraAnim() {
    kamera.camPos(vec2(width() / 2, cameraStartY));
    camAnimStarted = true;
    camAnimTime = 0;
}

    // Position de départ de la caméra (en haut de la scène)
kamera.camPos(vec2(width() / 2, -200));


const targetCamPos = vec2(width() / 2, 650);

  

    
    //Joueur 
const player = kamera.add([
    sprite("alvares"),   
    pos(1500, 600),//200,600     
    rotate(0),        
    scale(5),
    area(),
    //body({isStatic: true}),
    opacity(1),
    //animate(),
    "Alvares",
    body(),
]) 
//const chapeau = add([
  //sprite("chapeau"),
  //pos(player.pos.add(0, 0)),
  //anchor("center"),
  //layer("ui"),
  //z(10),
  //scale(5),
  //{ suitJoueur: true },
//]);

//chapeau.onUpdate(() => {
  //chapeau.pos = player.pos.add(60, 50);
//});

let dodoTimeout;
let dodoEndTimeout;

// Redémarrer le timer d'inactivité
function resetDodoTimer() {
    if (dodoTimeout) clearTimeout(dodoTimeout);
    if (dodoEndTimeout) clearTimeout(dodoEndTimeout);

    dodoTimeout = setTimeout(() => {
        player.play("dodo");

        dodoEndTimeout = setTimeout(() => {
            player.play("idle");
            resetDodoTimer();
        }, 10000); // 3000 ms = 3 sec

    }, 10000); //10000 10 secondes d'inactivité
}

// Mouvements
["left", "right", "up", "down"].forEach((key) => {
    onKeyDown(key, () => {
        if (menuOpen || inputLocked) return;

        const dir = {
            left: [-SPEED, 0],
            right: [SPEED, 0],
            up: [0, -SPEED],
            down: [0, SPEED],
        }[key];

        player.move(...dir);

        if (key === "right") player.flipX = true;
        if (key === "left") player.flipX = false;
       // if (key === "right") chapeau.flipX = true;
        //if (key === "left") chapeau.flipX = false;
        // Ne pas "marche" pendant un dialogue
        if (
            !inputLocked &&
            player.curAnim() !== "marche" &&
            player.curAnim() !== "dodo"
        ) {
            player.play("marche");
        }

        userHasInteracted = true;
        inactivityTime = 0;
        hideHintText();
        resetDodoTimer();
    });
});


onUpdate(() => {
    if (
        activeDialogue === "Le bibliothécaire_niveau" &&
        get("Le bibliothécaire_niveau").length === 0 &&
        duelDialogueCounter === 2 &&
        !menuOpen
    ) {
        showChoiceMenu();
    }
});



// 
player.play("idle");
resetDodoTimer();


// Change scène
 if (player.pos.x < 0 || player.pos.x > width() || player.pos.y < 0 || player.pos.y > height()) {
            cleanUpScene();
            if (biblio) biblio.stop();
            go("Hub");  
    }


let inactivityTime = 0;
const inactivityLimit = 5; // secondes
let hintShown = false;
let hintText = null;
let userHasInteracted = false;

// Texte d'aide
function showHintText() {
    if (hintShown || inputLocked) return;

    hintShown = true;
    let opacityVal = 0;

    hintText = add([
        text("i: interagir | flèches: bouger | espace: passer texte", {
            size: 28,
            align: "center",
            width: width() - 100,
        }),
        pos(center().x, center().y + 200),
        anchor("center"),
        layer("ui"),
        opacity(opacityVal),
        fixed()
    ]);

    const fadeIn = onUpdate(() => {
        if (hintText && opacityVal < 1) {
            opacityVal += dt();
            hintText.opacity = Math.min(opacityVal, 1);
        }
    });
}


function hideHintText() {
    if (!hintText) return;

    let fadeOut = 1;

    const fadeOutEffect = onUpdate(() => {
        if (hintText && fadeOut > 0) {
            fadeOut -= dt();
            hintText.opacity = Math.max(fadeOut, 0);
        }

        if (fadeOut <= 0 && hintText) {
            destroy(hintText);
            hintText = null;
            hintShown = false;
        }
    });
}



if (!inputLocked) {
    inactivityTime += dt();

    if (inactivityTime >= inactivityLimit && !hintShown) {
        showHintText();
    }
}

["left", "right", "up", "down", "space", "i"].forEach((key) => {
    onKeyPress(key, () => {
        if (inputLocked) return;
        inactivityTime = 0;
        hideHintText();
    });

    onKeyDown(key, () => {
        if (inputLocked) return;
        inactivityTime = 0;
        hideHintText();
    });
});


//PNJ
    const Bibliothécaire = add([
        sprite("bibliothécaire"),  
        pos(120, 650),     
        rotate(1),       
        scale(5),
        area(),
        opacity(1),
        animate(),
        "bibliothécaire",
        body({ isStatic: true }),
    ]); //Bibliothécaire.play("idle")

//Intéraction
let dialogueDone = false;
let dialogueDone2 = false;
let activeDialogue = null;
let duelDialogueCounter = 0;
loquace.start("Duel", false)

function interact() {
       //inputLocked = true 
    if (interactionCooldown > 0 || activeDialogue) return;

    interactionCooldown = 0.5; // évite double "i"
    
    for (const col of player.getCollisions()) {
        const c = col.target;

        if (c.is("bibliothécaire")) {
            Bibliothécaire.flipX = player.pos.x >= Bibliothécaire.pos.x;
            inactivityTime = 0;
            hideHintText();

            if (!dialogueDone) {
                inputLocked = true;
                loquace.start("Le bibliothécaire_niveau", true);
                //loquace.next();
                activeDialogue = "Le bibliothécaire_niveau";
                dialogueDone = true;
                duelDialogueCounter = 2;
                return;
                
            }

            if (!dialogueDone2) {
                inputLocked = true;
                loquace.start("Le bibliothécaire", true);
                loquace.next();
                activeDialogue = "Le bibliothécaire";
                //duelDialogueCounter = 1;
                dialogueDone2 = true;
                   inputLocked = true 
                return;
            }
        }
        if(c.is("mapmonde")){
            duelDialogueCounter = 2;

        }
    }
}

onKeyPress("i", interact);

let menuOpen = false;


function showChoiceMenu() {
    if (menuOpen) return;
    inputLocked = true;
    menuOpen = true;

    let selectedIndex = 0;
    const mainOptions = ["Vocabulaires", "Déclinaisons"];//Adjectifs, Conjugaison
    const optionTexts = [];

    const baseY = height() / 2 + 100;

    function updateSelection() {
        for (let i = 0; i < optionTexts.length; i++) {
            optionTexts[i].color = i === selectedIndex ? rgb(255, 255, 0) : rgb(255, 255, 255);
        }
    }

    function clearMenu(tag) {
        destroyAll(tag);
    }

    function handleMainSelection() {
        const selected = mainOptions[selectedIndex];
        clearMenu("mainMenuOption");

        if (selected === "Vocabulaires") {
            showSubMenu(
                [...Array(69).keys()].map(i => `Niveau ${i + 1}`).concat(["Mode Infini (alldico)", "Final Boss"]),
                (selected) => {
                    if (selected === "Mode Infini (alldico)") {
                        //showConfirmationMenu("VocabInfini", {});
                    } else if (selected === "Final Boss") {
                        //showConfirmationMenu("VocabFinalBoss", {});
                    } else {
                        const levelNum = parseInt(selected.split(" ")[1]);
                        showConfirmationMenu("ChoixVocabulaire", { level: levelNum });
                    }
                }
            );
        } else if (selected === "Déclinaisons") {
            showSubMenu(
                ["Rosa", "Templum", "Dominus", "Flumen", "Corpus", "Manus", "6 Déclinaisons"],
                (selected) => {
                    showConfirmationMenu("ChoixDeclinaison", { declinaison: selected });
                }
            );
        }
    }

    mainOptions.forEach((opt, i) => {
        const txt = add([
            text(opt, { size: 32 }),
            pos(center().x, baseY + i * 40),
            anchor("center"),
            layer("ui"),
            "mainMenuOption"
        ]);
        optionTexts.push(txt);
    });

    updateSelection();

    const cancelKeys = [];

    cancelKeys.push(onKeyPress("up", () => {
        selectedIndex = (selectedIndex - 1 + mainOptions.length) % mainOptions.length;
        updateSelection();
    }));

    cancelKeys.push(onKeyPress("down", () => {
        selectedIndex = (selectedIndex + 1) % mainOptions.length;
        updateSelection();
    }));

    cancelKeys.push(onKeyPress("enter", () => {
        cancelKeys.forEach(cancel => cancel.cancel());
        handleMainSelection();
    }));
}


function showSubMenu(options, onSelect) {
    menuOpen = true;
    inputLocked = true;

    let selectedIndex = 0;
    const optionTexts = [];
    const baseY = height() / 2 + 100;

    function updateSelection() {
        for (let i = 0; i < optionTexts.length; i++) {
            optionTexts[i].color = i === selectedIndex ? rgb(255, 255, 0) : rgb(255, 255, 255);
        }
    }

    options.forEach((opt, i) => {
        const txt = add([
            text(opt, { size: 28 }),
            pos(center().x, baseY + i * 30),
            anchor("center"),
            layer("ui"),
            "subMenuOption"
        ]);
        optionTexts.push(txt);
    });

    updateSelection();

    const cancelKeys = [];

    cancelKeys.push(onKeyPress("up", () => {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        updateSelection();
    }));

    cancelKeys.push(onKeyPress("down", () => {
        selectedIndex = (selectedIndex + 1) % options.length;
        updateSelection();
    }));

    cancelKeys.push(onKeyPress("escape", () => {
        cancelKeys.forEach(cancel => cancel.cancel());
        destroyAll("subMenuOption");
        showChoiceMenu();
    }));

    cancelKeys.push(onKeyPress("enter", () => {
        const selected = options[selectedIndex];
        cancelKeys.forEach(cancel => cancel.cancel());
        destroyAll("subMenuOption");
        menuOpen = false;
        inputLocked = false;
        onSelect(selected);
    }));
}

function showConfirmationMenu(sceneName, sceneData) {
    destroyAll("mainMenuOption");
    destroyAll("subMenuOption");

    const baseY = height() / 2 + 100;

    const msg = add([
        text("Lancer ce niveau ? (Entrée = oui, Échap = non)", { size: 24 }),
        pos(center().x, baseY),
        anchor("center"),
        layer("ui"),
        "confirmMenu"
    ]);

    const confirmKeys = [];

    confirmKeys.push(onKeyPress("enter", () => {
        confirmKeys.forEach(c => c.cancel());
        destroyAll("confirmMenu");
        if(biblio) biblio.stop();
        go(sceneName, sceneData);
    }));

    confirmKeys.push(onKeyPress("escape", () => {
        confirmKeys.forEach(c => c.cancel());
        destroyAll("confirmMenu");
        showChoiceMenu();
    }));
}


//DEPLACEMENT DU PERSONNAGE
    onKeyDown("left", () => {
        
        if (menuOpen) return;
        //if (inputLocked) return;
        player.move(-SPEED, 0)
        player.flipX = false;
            userHasInteracted = true;
    inactivityTime = 0;
    hideHintText();

    })
    
    onKeyDown("right", () => {
if (menuOpen || inputLocked) return;
        player.flipX = true;
        player.move(SPEED, 0)
            userHasInteracted = true;
    inactivityTime = 0;
    hideHintText();
    })
    
    onKeyDown("up", () => {
if (menuOpen || inputLocked) return;
        player.move(0, -SPEED)
            userHasInteracted = true;
    inactivityTime = 0;
    hideHintText();
    })
    
    onKeyDown("down", () => {
if (menuOpen || inputLocked) return;
        player.move(0, SPEED)
            userHasInteracted = true;
    inactivityTime = 0;
    hideHintText();
    })
        onKeyDown("i", () => {
if (menuOpen || inputLocked) return;
            userHasInteracted = true;
    inactivityTime = 0;
    hideHintText();
    })
    


    function cleanUpScene() {

    //play("bell");

    destroyAll();     
    if (loquace && loquace.clear) loquace.clear();
  
}
})



scene("ChoixVocabulaire", () => {
    const vocabulaires = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
        "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
        "51", "52", "53", "54", "55", "56", "57", "58", "59", "60",
        "61", "62", "63", "64", "65", "66", "67", "68", "69",
        "1-69", "AllDico", // "Vocpersonnalisé(1)", "Vocpersonnalisé(2)", "Vocpersonnalisé(3)",
    ];

    const boutons = [];
    let selectedIndex = 0;

    add([
        text("Choisis un niveau de vocabulaire avec un Clic ou Esc pour quitter le menu :", { size: 32 }),
        pos(center().x, 30),
        anchor("center"),
    ]);

    const itemsPerCol = 18;
    const colSpacing = 120;
    const rowSpacing = 40;
    const startX = center().x - 2 * colSpacing;
    const startY = 100;

    vocabulaires.forEach((nom, i) => {
        const col = Math.floor(i / itemsPerCol);
        const row = i % itemsPerCol;

        const bouton = add([
            text(nom, { size: 28 }),
            pos(startX + col * colSpacing, startY + row * rowSpacing),
            anchor("center"),
            area(),
            "vocabulaireChoix"
        ]);

        bouton.onClick(() => {
            //if (biblio) biblio.stop
            go("Vocabulaire", { niveau: nom });
        })

    bouton.onHover(() => {
    selectedIndex = i;
    updateSelection();
    bouton.scale = vec2(1.2);
});

bouton.onHoverEnd(() => {
    bouton.scale = vec2(1);
});

        boutons.push(bouton);
    });

    function updateSelection() {
        boutons.forEach((btn, i) => {
            btn.color = (i === selectedIndex) ? rgb(255, 255, 0) : rgb(255, 255, 255);
        });
    }

    onKeyPress("up", () => {
        selectedIndex = (selectedIndex - 1 + boutons.length) % boutons.length;
        updateSelection();
    });

    onKeyPress("down", () => {
        selectedIndex = (selectedIndex + 1) % boutons.length;
        updateSelection();
    });

    onKeyPress("enter", () => {
        boutons[selectedIndex].trigger("click");
    });

    onKeyPress("escape", () => {
        go("Bibliothèque");
    });

    updateSelection();
});

scene("ChoixDeclinaison", () => {
    const declinaisons = ["rosa", "dominus", "templum", "corpus", "flumen", "mare", "consul", "civis", "manus", "res"];
    const baseY = height() / 2 - 100;
    const boutons = [];
    let selectedIndex = 0;

    add([
        text("Choisis une déclinaison avec un Clic ou Esc pour quitter le menu :", { size: 32 }),
        pos(center().x, baseY - 50),
        anchor("center"),
    ]);

    declinaisons.forEach((nom, i) => {
        const bouton = add([
            text(nom, { size: 28 }),
            pos(center().x, baseY + i * 40),
            anchor("center"),
            area(),
            "declinaisonChoix"
        ]);

        bouton.onClick(() => {
            go("Declinaison", { declinaison: nom });
        });

bouton.onHover(() => {
    selectedIndex = i;
    updateSelection();
    bouton.scale = vec2(1.2);
});

bouton.onHoverEnd(() => {
    bouton.scale = vec2(1);
});


        boutons.push(bouton);
    });

    function updateSelection() {
        boutons.forEach((btn, i) => {
            btn.color = (i === selectedIndex) ? rgb(255, 255, 0) : rgb(255, 255, 255);
        });
    }

    onKeyPress("up", () => {
        selectedIndex = (selectedIndex - 1 + boutons.length) % boutons.length;
        updateSelection();
    });

    onKeyPress("down", () => {
        selectedIndex = (selectedIndex + 1) % boutons.length;
        updateSelection();
    });

    onKeyPress("enter", () => {
        boutons[selectedIndex].trigger("click");
    });

    onKeyPress("escape", () => {
        go("Bibliothèque");
    });

    updateSelection();
});


scene("Declinaison", ({ declinaison }) => {


const FLOOR_HEIGHT = 64;
const SPEED = 60;
let nuagesActive = false;
let musique = null;
let currentBG = null;


    let music = [
        { id: "musique1", bg: "bg1" },
        { id: "musique2", bg: "bg2" },
        { id: "musique3", bg: "bg3" },
        { id: "musique4", bg: "bg4" }
    ];


   function playRandomMusic() {
    const choix = choose(music);

    if (musique) musique.stop();
    if (currentBG) destroy(currentBG);


    const nouveauBG = add([
        sprite(choix.bg),
        pos(0, 0),
        scale(4),
        layer("bg"),
        opacity(0),
    ]);
     if (currentBG) {
        tween(currentBG.opacity, 0, 1, val => currentBG.opacity = val);
        wait(1, () => destroy(currentBG));
    }

    tween(nouveauBG.opacity, 1, 1, val => nouveauBG.opacity = val);
    currentBG = nouveauBG;

    musique = play(choix.id, { loop: true });
    musique.paused = false;

    debug.log(`Musique : ${choix.id} — Fond : ${choix.bg}`);
}
onKeyPress("space", () => {
    if (!musique) {
        playRandomMusic();
        if (!nuagesActive) {
            nuagesActive = true;
            spawnNuage();
        }
    } else {
        musique.paused = !musique.paused;
        debug.log(musique.paused ? "Pause" : "Lecture");

        if (!musique.paused && !nuagesActive) {
            nuagesActive = true;
            spawnNuage();
        }
    }
});

let sceneScore = gameState.score;

loadSprite("Ciel1", "image/cielligne.jpg")

loadSprite("Ciel", "image/cieletoiles.png")
loadSprite("Ciel1", "image/cieletoiles.png")
loadSprite("Ciel2", "image/cieletoiles.png")
loadSprite("Ciel3", "image/cieletoiles.png")

loadSprite("Nuage", "image/Nuage1.png");
loadSprite("Nuage2", "image/Nuage2.png");


// Ciel random 
let ciel = add([
    sprite(music.paused ? "Ciel1" : "Ciel"),
    pos(0, 0),
    scale(4),
    layer("bg"),
]);



const ciels = ["Ciel", "Ciel1", "Ciel2", "Ciel3"]
let cielIndex = 0;
let cielActuel = ciel;
let transitionEnCours = false;
let changementAutomatiqueActif = false;

function changerCiel() {
    if (music.paused || transitionEnCours) return; 
    transitionEnCours = true;
    cielIndex = (cielIndex + 1) % ciels.length;
    
    let ancienCiel = ciel;

}

if (!music.paused) {
    wait(10, changerCiel);
}

onKeyPress("space", () => {
    if (!music.paused && !nuagesActive) {
        spawnNuage();
        wait(10, changerCiel);
    }
});

function spawnNuage() {
    add([
        //sprite("Nuage"),
        sprite("Nuage"),
        pos(width(), rand(40, height() - 100)),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        scale(rand(10, 15)),
        //scale(rand(1.5, 2.5)),
        //z(0),
        color(0,0,0),
        layer("nuages"),
    ]);
        add([
       //sprite("Nuage2"),
        sprite("Nuage2"),
        pos(width(), rand(40, height() - 100)),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        color(0,0,0),
        scale(rand(10, 15)),
        //scale(rand(1.5, 2.5)),
        //z(0),
        layer("nuages")
    ]);

    wait(rand(5, 10), spawnNuage);
}

    add([
        text("Clique sur une forme et choisis le(s) réponse(s)."),
        anchor("center"),
        pos(850,50),
        layer("ui"),
    ],)
  const touche = add([text("Appuie sur Espace pour commencer"),
    anchor("center"),
    pos(850,500),
    ])


    const toutesFormes = [
//1ère déclinaison
        { decl: "rosa", text: "rosae", answers: ["nominatif pluriel", "génitif singulier", "datif singulier", "vocatif pluriel"] },
        { decl: "rosa", text: "rosam", answers: ["accusatif singulier"] },
        { decl: "rosa", text: "rosis", answers: ["datif pluriel", "ablatif pluriel"] },
        { decl: "rosa", text: "rosa", answers: ["nominatif singulier", "vocatif singulier", "ablatif singulier"] },
        { decl: "rosa", text: "rosarum", answers: ["génitif pluriel"] },
        { decl: "rosa", text: "rosas", answers: ["accusatif pluriel"] },
//2ème déclinaison
        { decl: "dominus", text: "dominus", answers: ["nominatif singulier"] },
        { decl: "dominus", text: "domine", answers: ["vocatif singulier"] },
        { decl: "dominus", text: "dominum", answers: ["accusatif singulier"] },
        { decl: "dominus", text: "domini", answers: ["nominatif pluriel", "vocatif pluriel", "génitif singulier"] },
        { decl: "dominus", text: "domino", answers: ["datif singulier", "ablatif singulier"] },
        { decl: "dominus", text: "dominos", answers: ["accusatif pluriel"] },
        { decl: "dominus", text: "dominorum", answers: ["génitif pluriel"] },
        { decl: "dominus", text: "dominis", answers: ["datif pluriel", "ablatif pluriel"] },
        //Neutre
        { decl: "templum", text: "templum", answers: ["nominatif singulier","vocatif singulier", "accusatif singulier"] },
        { decl: "templum", text: "templa", answers: ["nominatif pluriel","vocatif pluriel", "accusatif pluriel"] },
        { decl: "templum", text: "templi", answers: ["génitif singulier"] },
        { decl: "templum", text: "templo", answers: ["datif singulier", "ablatif singulier"] },
        { decl: "templum", text: "templis", answers: ["datif pluriel", "ablatif pluriel"] },
        { decl: "templum", text: "templorum", answers: ["génitif pluriel"] },
//3ème déclinaison
    { decl: "consul", text: "consul", answers: ["nominatif singulier","vocatif singulier"] },
    { decl: "consul", text: "consulem", answers: ["accusatif singulier"] },
    { decl: "consul", text: "consuli", answers: ["datif singulier"] },
    { decl: "consul", text: "consulis", answers: ["génitif singulier"] },
    { decl: "consul", text: "consule", answers: ["ablatif singulier"] },
    { decl: "consul", text: "consulibus", answers: ["datif pluriel", "ablatif pluriel"] },
    { decl: "consul", text: "consules", answers: ["nominatif pluriel","vocatif pluriel", "accusatif pluriel"] },
    { decl: "consul", text: "consulum", answers: ["génitif pluriel"] },

    { decl: "civis", text: "civis", answers: ["nominatif singulier","vocatif singulier","génitif singulier"] },
    { decl: "civis", text: "civem", answers: ["accusatif singulier"] },
    { decl: "civis", text: "civi", answers: ["datif singulier"] },
    { decl: "civis", text: "cive", answers: ["ablatif singulier"] },
    { decl: "civis", text: "civibus", answers: ["datif pluriel", "ablatif pluriel"] },
    { decl: "civis", text: "cives", answers: ["nominatif pluriel","vocatif pluriel", "accusatif pluriel"] },
    { decl: "civis", text: "civium", answers: ["génitif pluriel"] },

    { decl: "flumen", text: "flumen", answers: ["nominatif singulier","vocatif singulier","accusatif singulier"] },
    { decl: "flumen", text: "flumini", answers: ["datif singulier"] },
    { decl: "flumen", text: "fluminis", answers: ["génitif singulier"] },
    { decl: "flumen", text: "flumine", answers: ["ablatif singulier"] },
    { decl: "flumen", text: "fluminibus", answers: ["datif pluriel", "ablatif pluriel"] },
    { decl: "flumen", text: "flumina", answers: ["nominatif pluriel","vocatif pluriel", "accusatif pluriel"] },
    { decl: "flumen", text: "fluminum", answers: ["génitif pluriel"] },

    { decl: "corpus", text: "corpus", answers: ["nominatif singulier","vocatif singulier","accusatif singulier"] },
    { decl: "corpus", text: "corpori", answers: ["datif singulier"] },
    { decl: "corpus", text: "corporis", answers: ["génitif singulier"] },
    { decl: "corpus", text: "corpore", answers: ["ablatif singulier"] },
    { decl: "corpus", text: "corporibus", answers: ["datif pluriel", "ablatif pluriel"] },
    { decl: "corpus", text: "corpora", answers: ["nominatif pluriel","vocatif pluriel", "accusatif pluriel"] },
    { decl: "corpus", text: "corporum", answers: ["génitif pluriel"] },

    { decl: "mare", text: "mare", answers: ["nominatif singulier","vocatif singulier","accusatif singulier"] },
    { decl: "mare", text: "mari", answers: ["datif singulier", "ablatif singulier"] },
    { decl: "mare", text: "maris", answers: ["génitif singulier"] },
    { decl: "mare", text: "maribus", answers: ["datif pluriel", "ablatif pluriel"] },
    { decl: "mare", text: "maria", answers: ["nominatif pluriel","vocatif pluriel", "accusatif pluriel"] },
    { decl: "mare", text: "marium", answers: ["génitif pluriel"] },

//4ème déclinaison
    { decl: "manus", text: "manus", answers: ["nominatif singulier","vocatif singulier","génitif singulier","nominatif pluriel","vocatif pluriel","accusatif pluriel"] },
    { decl: "manus", text: "manum", answers: ["accusatif singulier"] },
    { decl: "manus", text: "manui", answers: ["datif singulier"] },
    { decl: "manus", text: "manu", answers: ["ablatif singulier"] },
    { decl: "manus", text: "manibus", answers: ["datif pluriel", "ablatif pluriel"] },
    { decl: "manus", text: "manuum", answers: ["génitif pluriel"] },
//5ème déclinaison    
    { decl: "res", text: "res", answers: ["nominatif singulier","vocatif singulier","nominatif pluriel","vocatif pluriel","accusatif pluriel"] },
    { decl: "res", text: "rem", answers: ["accusatif singulier"] },
    { decl: "res", text: "rei", answers: ["génitif singulier","datif singulier"] },
    { decl: "res", text: "re", answers: ["ablatif singulier"] },
    { decl: "res", text: "rebus", answers: ["datif pluriel", "ablatif pluriel"] },
    { decl: "res", text: "rerum", answers: ["génitif pluriel"] },






    ];

    const fonctions = [
        "nominatif singulier", "nominatif pluriel",
        "vocatif singulier", "vocatif pluriel",
        "accusatif singulier", "accusatif pluriel",
        "génitif singulier", "génitif pluriel",
        "datif singulier", "datif pluriel",
        "ablatif singulier", "ablatif pluriel"
    ];

    const formes = toutesFormes.filter(f => f.decl === declinaison);

    const scoreMaxParDecl = {//"rosa", "dominus", "templum", "corpus", "flumen", "mare", "consul", "res", "manus", //civis
        rosa: 120, //Marche 1ère déclinaison
        dominus: 120, //Marche 2ème déclinaison
        templum: 120,//Marche 2ème déclinaison: autre ex. ayant même structure ager, puer, scrutum
        //3ème déclinaison
        flumen: 120,//Marche autre ex. ayant même structure mare et corpus
        corpus: 120,
        mare: 120,

        consul: 120,//Marche autre ex. ayant même structure : civis
        civis: 120,

        manus: 120, //4ème déclinaison

        res: 120, //5ème déclinaison
    };
    const scoreMax = scoreMaxParDecl[declinaison] || 999;

    gameState.score = 0;
    gameState.erreurs = 0;

    const scoreLabel = add([
        text(`Score: 0`, { size: 32 }),
        pos(50, 15),
        layer("ui"),
    ]);

    const erreurLabel = add([
        text(`Erreurs: 0/3`, { size: 32 }),
        pos(50, 50),
        layer("ui"),
    ]);

    function updateScoreLabel() {
        scoreLabel.text = `Score: ${gameState.score}`;
    }

    function updateErreurLabel() {
        erreurLabel.text = `Erreurs: ${gameState.erreurs}/3`;
    }

    let selectedForme = null;
    const formeCards = [];

    let xStart = 100, yStart = 100, spacingY = 50;
    let column = 0, row = 0;
    const maxY = height() - 100;

    formes.forEach((f, index) => {
        let x = xStart + column * 200;
        let y = yStart + row * spacingY;

        if (y >= maxY) {
            column++;
            row = 0;
            y = yStart;
            x = xStart + column * 200;
        }
        row++;

        const box = add([
            rect(150, 40, { radius: 8 }),
            pos(x, y),
            color(255, 255, 200),
            area(),
            outline(2),
            anchor("center"),
            "forme",
            layer("ui"),
            {
                text: f.text,
                answers: f.answers,
                foundAnswers: [],
                disabled: false,
            },
        ]);

        box.add([
            text(f.text, { size: 32, font: "times" }),
            anchor("center"),
            pos(0, 0),
            color(0, 0, 0),
        ]);

        box.onClick(() => {
            if (box.disabled) return;
            if (selectedForme === box) {
                box.color = rgb(255, 255, 200);
                selectedForme = null;
                return;
            }
            if (selectedForme) selectedForme.color = rgb(255, 255, 200);
            selectedForme = box;
            box.color = rgb(200, 255, 150);
        });

        formeCards.push(box);
    });

    fonctions.forEach((func, i) => {
        const box = add([
            rect(400, 40, { radius: 8 }),
            pos(1500, 80 + i * 50),
            color(200, 225, 255),
            area(),
            outline(5),
            anchor("center"),
            "fonction",
            layer("ui"),
            { text: func }
        ]);

        box.add([
            text(func, { size: 32 }),
            anchor("center"),
            pos(0, 0),
            color(0, 0, 0),
        ]);

        box.onClick(() => {
            if (!selectedForme || selectedForme.disabled) return;
            const isCorrect = selectedForme.answers.includes(func);

            add([
                text(isCorrect ? "V" : "X", { size: 24 }),
                pos(mousePos().x + 10, mousePos().y),
                opacity(1),
                lifespan(1),
                color(isCorrect ? rgb(0, 200, 0) : rgb(200, 0, 0)),
            ]);

            if (isCorrect) {
                if (!selectedForme.foundAnswers.includes(func)) {
                    selectedForme.foundAnswers.push(func);
                    gameState.score += 10;
                    updateScoreLabel();
                    //if (musique) musique.stop()
                }

                const allCorrect = selectedForme.answers.every(a => selectedForme.foundAnswers.includes(a));
                if (allCorrect) {
                    selectedForme.disabled = true;
                    destroy(selectedForme);
                    formeCards.splice(formeCards.indexOf(selectedForme), 1);
                    repositionFormes();
                }

                if (gameState.score >= scoreMax) {
// identifiant unique basé sur la déclinaison
    saveManager.onDeclinaisonComplete(`Declinaison-${declinaison}`); // ajoutera 50 points si jamaisfait
    onDeclinaisonComplete(`Declinaison-${declinaison}`);
                    if (musique) musique.stop();
                    go("Bibliothèque");
                }

            } else {
                gameState.erreurs++;
                updateErreurLabel();
                if (gameState.erreurs >= 3) {
                     if (musique) musique.stop();
                    go("Bibliothèque");
                }
            }
        });
    });

    function repositionFormes() {
        let column = 0, row = 0;
        formeCards.forEach((box) => {
            let x = xStart + column * 200;
            let y = yStart + row * spacingY;

            if (y >= maxY) {
                column++;
                row = 0;
                y = yStart;
                x = xStart + column * 200;
            }
            row++;

            box.pos = vec2(x, y);
        });
    }

    add([
        text(`Déclinaison : ${declinaison}`, { size: 32 }),
        pos(center().x, 40),
        anchor("center"),
        layer("ui"),
    ]);



    onKeyPress("escape", () => go("ChoixDeclinaison"));
});


//BUG PV BOSS si vocablength
scene("Vocabulaire", ({niveau: nom}) => {
//Barre boss = longuer vocab
//Esthéqieu textes
//Background
//Animation du personnage

//NIVEAU : DIALOGUE, BOSS IMAGE/FONDS, MUSIQUE, VOCABULAIRE TOTAUX!
//let bell = loadSound("bell", "musique_rendu/inspiring-emotional-uplifting-piano-112623.mp3")
//Fonds
   //CIEL
    add([sprite("Cielnuit"),
    scale("2")
    ]);
    
    entrainement = play("entrainement", {
        volume: 1,
        speed: 1,
        loop: true,
        paused: true,
    });

    entrainement.paused = false;
    //onKeyPress("m", () => bell.paused = !bell.paused);




    // Avatar du personnage
    const avatar = add([
        sprite("dummy"),
        scale(10),
        anchor("center"),
        pos(center().sub(0, 50)),
        opacity(1),
        animate(),
        //area({ shape: new Rect(vec2(0, 6), 12, 12) }),
        //body(),
        //tile(),
    ])

     //  variables du jeu
    let santeJoueur = 6;//6
    let santeBoss = 100;  //100 par défaut --> faire longueur des vocs dans l'idéal
    let specialBarre = 0;
    let Question = null;
    let Choix = [];
    // barres de santé
    let barreBoss;
    let barreJoueur;
    let barreSpecial;
    let miracleMessage = null;


    initBarres();
    tour();

    function initBarres() {
        barreBoss = add([
            rect(300, 75),
            outline(4),
            area(),
            pos(0, 0),
            color(255, 102, 102),
            outline(4, rgb(255, 255, 255)),
            z(5),
        ]);

        barreJoueur = add([
            rect(300, 75),
            outline(4),
            area(),
            pos(0, 100),
            color(204, 255, 153),
            outline(4, rgb(255, 255, 255)),
            z(5),
        ]);

        barreSpecial = add([
            rect(0, 75),
            outline(4),
            area(),
            pos(0, 200),
            color(255, 255, 153),
            outline(4, rgb(255, 255, 255)),
            z(5),
        ]);
    }

    // Fonction pour gérer les réponses
    let bonneReponse = null;
    let y = null;
    const i = 5;

    function select(choice) {
        const correct = choice === bonneReponse;
        if (correct) {
            santeBoss -= 1;//-=5 // Ici le -1 et 100 pv --> 100 réponses correctes
            //santeJoueur += 0.5;
            //specialBarre += 5;
            specialBarre = Math.min(specialBarre + 1, 10); //max 10

            barreBoss.width = (santeBoss / 100) * 300;
            barreJoueur.width = (santeJoueur / 6) * 300;
            barreSpecial.width = (specialBarre / 100) * 300;

            barreBoss.color = rgb(255 - santeBoss * 2, 102, 102);
            barreJoueur.color = rgb(204 - santeJoueur * 10, 255, 153);
            barreSpecial.color = rgb(255 - specialBarre * 2, 255, 153);

            //loquace.clear('dialogue', true);
            //loquace.clear('?', true);
              //const playerdialogue = loquace.script({
                //"?": ["a:test ?"]
            //});

        } else {
            santeJoueur -= 0.5;
            barreJoueur.width = (santeJoueur / 6) * 300;
            barreJoueur.color = rgb(255, 80, 80);

            //avatar.animate("color", [RED, WHITE], {
              //  duration: 0.5,
                //direction: "forward",
            //});

            //const bossdialogue = loquace.script({
              //  "!": ["g:blink N'as-tu pas appris ça?",
                //],
            //});

            //loquace.start('!', true);
            //loquace.start('?', true);
        }

        màjsanté();

        if (santeJoueur <= 0 || santeBoss <= 0) {
            findepartie();
        } else {
            tour();
        }
    }

    // texte vide pour mettre la question
    let questionText = add([
        text("", { size: 36 }),//36
        pos(350, 100),//550, 100
        color(WHITE),
        z(10),
    ]);

    let choixElements = [];

function afficherQuestionEtChoix(question, choices) {
    questionText.text = question;

    // supprime anciens choix
    for (const el of choixElements) {
        destroy(el);
    }
    choixElements = [];

    // Base de placement Y
    let yBase = 350;//350

    //Son pour sélection case --> ne fonctionne pas
loadMusic("select", "music/mixkit-bonus-earned-in-video-game-2058.wav")

let clickLocked = false; 
choices.forEach((choice, index) => {
    const choiceY = yBase + index * 60;

    const bg = add([
        rect(1700, 50),//600, 50
        pos(10, choiceY + 300),
        color(rgb(50, 50, 50)),// 50, 50, 50
        z(9),
        area(),
        scale(1),
        "choice-bg",
    ]);

    const choiceText = add([
        text(choice, { size: 32 }),
        pos(10, choiceY + 308),
        area(),
        color(WHITE),
        z(10),
        "choice-text",
    ]);

    const confirmFlash = (success) => {
        const flashColor = success ? rgb(0, 255, 0) : rgb(255, 50, 50); 
        bg.use(color(flashColor));
        wait(0.2, () => bg.use(color(rgb(50, 50, 50)))); 
    };

    const handleClick = () => {
        if (clickLocked) return;

        clickLocked = true;
        play("select");

        const isCorrect = (choice === bonneReponse);
        confirmFlash(isCorrect);

        select(choice);

        wait(0.5, () => {
            clickLocked = false;
        });
    };

    bg.onClick(handleClick);
    choiceText.onClick(handleClick);

    bg.onHover(() => {
        bg.use(color(rgb(90, 90, 0)));
        choiceText.use(color(rgb(255, 255, 0)));
        bg.use(scale(1.03));
    });

    bg.onHoverEnd(() => {//pour rectangles où on sélectionne les choix de réponses
        bg.use(color(rgb(50, 50, 50)));
        choiceText.use(color(WHITE));
        bg.use(scale(1));
    });

    choixElements.push(bg, choiceText);
});



}


    async function tour() {
        const vocablatin = await Vocabulaire();
        const { question, choices } = generateQuestion(vocablatin);
        afficherQuestionEtChoix(question, choices);
    }

function màjsanté() {
//tailles
    barreBoss.width = (santeBoss / 100) * 300;
    barreJoueur.width = (santeJoueur / 6) * 300;
    barreSpecial.width = (specialBarre / 10) * 300;

    // barreJoueur
    const ratioJoueur = santeJoueur / 6;
    if (ratioJoueur > 0.5) {
        // Vert -->Jaune
        const t = (1 - ratioJoueur) * 2;
        barreJoueur.color = rgb(
            0 + t * 255,    
            255,            
            0               
        );
    } else {
        // Jaune -->Rouge
        const t = (0.5 - ratioJoueur) * 2;
        barreJoueur.color = rgb(
            255,
            255 - t * 255,  
            0
        );
    }

    // barreBoss
    const ratioBoss = santeBoss / 100;
    if (ratioBoss > 0.5) {
        // Rouge clair -->Rouge moyen
        const t = (1 - ratioBoss) * 2;
        barreBoss.color = rgb(
            255,
            102 - t * 50,   
            102 - t * 50    
        );
    } else {
        // Rouge moyen -->Rouge foncé
        const t = (0.5 - ratioBoss) * 2;
        barreBoss.color = rgb(
            255,
            52 - t * 50,    
            52 - t * 50
        );
    }
}


//CODE BARRE SPéCIAL
let specialReady = false;

loop(0.1, () => {
    if (specialBarre >= 10 && !specialReady) {
        specialReady = true;
        animateSpecialBarre();

        // message miracle
        if (!miracleMessage) {
            miracleMessage = add([
                text("Appuyez sur W pour utiliser le miracle (soin ou révélation)... mais attention.", { size: 24 }),
                pos(300, 225),
                color(YELLOW),
                z(20),
                "miracle-msg",
            ]);
        }
    } else if (specialBarre < 10 && specialReady) {
        specialReady = false;
        barreSpecial.use(color(255, 255, 153));


        if (miracleMessage) {
            destroy(miracleMessage);
            miracleMessage = null;
        }
    }
});


function animateSpecialBarre() {
    if (!specialReady) return;
    barreSpecial.use(color(255, 255, 0));
    wait(0.3, () => {
        barreSpecial.use(color(255, 255, 153));
        wait(0.3, () => {
            if (specialReady) animateSpecialBarre();
        });
    });
}

onKeyPress("w", () => {
    if (specialBarre >= 10) {
        //  malus (1 chance sur 10)
        const isMalus = Math.random() < 0.1;

        if (isMalus) {
            const typeMalus = Math.random();
            if (typeMalus < 0.5) {
                //  vie du joueur à 0.5
                santeJoueur = 0.5;
                barreJoueur.width = (santeJoueur / 6) * 300;
            } else {
                // Soigne le boss (entre 50% et 100%)
                const soin = 50 + Math.floor(Math.random() * 51); // entre 50 et 100
                santeBoss = Math.min(100, santeBoss + soin);
                barreBoss.width = (santeBoss / 100) * 300;
            }
        } else {
            // Effet bénéfique
            const effet = Math.random();
            if (effet < 0.5) {
                // Soin
                santeJoueur = 6;
                barreJoueur.width = (santeJoueur / 6) * 300;
            } else {
                // Clignotement bonne réponse
                for (const choiceEl of choixElements) {
                    if (choiceEl.text === bonneReponse) {
                        let count = 0;
                        function blink() {
                            choiceEl.use(color(count % 2 === 0 ? rgb(0, 255, 0) : WHITE));
                            count++;
                            if (count < 20) {
                                wait(0.2, blink);
                            }
                        }
                        blink();
                    }
                }
            }
        }


        specialBarre = 0;
        barreSpecial.width = 0;
        specialReady = false;
        barreSpecial.use(color(255, 255, 153));

        if (miracleMessage) {
            destroy(miracleMessage);
            miracleMessage = null;
        }

        màjsanté(); 
    }
});






    function findepartie() {
        if (santeJoueur <= 0) {
            resultatduel = -1;
            cleanUpScene();
            //go("FinBossGaden");
        if (entrainement) entrainement.stop();
            go("Bibliothèque", { win: false });

        } else if (santeBoss <= 0) {
            resultatduel = +1;
            cleanUpScene();
            //go("RéussiBossGaden");
            if (entrainement) entrainement.stop();
            go("Bibliothèque", { win: true });

        }
    }

    function cleanUpScene() {
        if (entrainement && entrainement.stop) entrainement.stop();
        destroyAll();
        if (loquace && loquace.clear) loquace.clear();
        santeJoueur = 6;
        santeBoss = 50;//100
        specialBarre = 100;
    }

function getFilesForNiveau(niveau) {
    const fichiers = [];
    const num = parseInt(niveau);

    if (!isNaN(num) && num >= 1 && num <= 69) {
        const niveauFolder = Math.ceil(num / 10);
        fichiers.push(`niveau_voc/${niveauFolder}/Vocabulaire ${num}.txt`);
    } else if (niveau === "AllDico") {
        fichiers.push("vocabulaire_latin_dico_bachelor_discipline_latin/ALLDICO.txt");
    } else if (niveau === "1-69") {
        for (let i = 1; i <= 69; i++) {
            const folder = Math.ceil(i / 10);
            fichiers.push(`niveau_voc/${folder}/Vocabulaire ${i}.txt`);
        }
    }

    return fichiers;
}

    async function Vocabulaire() {
        //const files = [
          //  'vocabulaire_latin_dico_bachelor_discipline_latin/ALLDICO.txt',
        //];
        const files = getFilesForNiveau(nom);

        let vocablatin = [];
        for (const file of files) {
            const response = await fetch(file);
            const text = await response.text();
            const lines = text.split(/\r?\n/);
            lines.forEach(line => {
                const [latin, french] = line.split('\t');
                if (latin && french) {
                    vocablatin.push({ latin, french });
                }
            });
        }

        return vocablatin;
    }

    function generateQuestion(vocablatin) {
        const question = vocablatin[Math.floor(Math.random() * vocablatin.length)];
        const correctReponse = question.french;
        bonneReponse = correctReponse;

        const wrong = vocablatin.filter(item => item.french !== correctReponse)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
            .map(item => item.french);

        const choices = [correctReponse, ...wrong].sort(() => Math.random() - 0.5);
        Question = question.latin;
        Choix = choices;

        return {
            question: `Quel est la traduction de "${Question}" ?`,
            choices
        };
    }

    // Démarrer le jeu
    tour();
});
