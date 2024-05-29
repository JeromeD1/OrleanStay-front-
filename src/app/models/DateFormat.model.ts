export const MY_DATE_FORMAT = {
    parse: {
        dateInput: 'DD/MM/YYYY'
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
   
    }
}

// parse : Ce champ est utilisé pour analyser les dates à partir des chaînes de caractères. Il a un sous-champ :

// dateInput : Il définit le format dans lequel les dates sont saisies par l’utilisateur. Ici, 'DD/MM/YYYY' signifie que l’utilisateur doit entrer la date au format “jour/mois/année”.



// display : Ce champ est utilisé pour afficher les dates à l’utilisateur. Il a plusieurs sous-champs :

// dateInput : Il définit le format dans lequel les dates sont affichées dans le champ de saisie de la date. Ici, 'DD/MM/YYYY' signifie que la date sera affichée au format “jour/mois/année”.
// monthYearLabel : Il définit le format dans lequel les étiquettes de l’année et du mois sont affichées. Ici, 'MMM YYYY' signifie que l’étiquette sera affichée au format “mois abrégé/année”.
// dateA11yLabel : Il définit le format dans lequel les dates sont lues par les lecteurs d’écran pour l’accessibilité. Ici, 'LL' est un format de moment.js qui affiche la date au format “Mois jour, année”.
// monthYearA11yLabel : Il définit le format dans lequel les étiquettes de l’année et du mois sont lues par les lecteurs d’écran pour l’accessibilité. Ici, 'MMMM YYYY' signifie que l’étiquette sera lue au format “mois complet/année”.