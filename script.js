// Variabile pentru configurare
const numeUtilizator = 'elenateodorapuia-creator';
const urlApi = `https://api.github.com/users/${numeUtilizator}/repos`;

// Selectarea elementelor din HTML folosind ID-urile în română
const containerProiecte = document.getElementById('container-proiecte');
const mesajPortofoliu = document.getElementById('mesaj-portofoliu');

// Date de rezervă (Hardcoded JSON) traduse în engleză pentru consistența paginii
const proiecteDeRezerva = [
    { 
        name: "Ludo Game Application", 
        description: "Fully functional Ludo game developed using C++ OOP concepts, featuring modular engine-GUI separation and socket-based networking.", 
        language: "C++", 
        stargazers_count: 1, 
        forks_count: 0, 
        html_url: "https://github.com/elenateodorapuia-creator/Ludo-Game-CPP" 
    },
    { 
        name: "C# Desktop App", 
        description: "Developed a functional C# desktop application focused on professional programming principles.", 
        language: "C#", 
        stargazers_count: 0, 
        forks_count: 0, 
        html_url: "#" 
    },
    { 
        name: "ORACLE Database System", 
        description: "Relational database modeling and SQL programming project.", 
        language: "SQL", 
        stargazers_count: 0, 
        forks_count: 0, 
        html_url: "#" 
    },
    { 
        name: "NXP Embedded Systems", 
        description: "Mastering Embedded Systems by programming NXP microcontrollers via S32 Design Studio.", 
        language: "C", 
        stargazers_count: 0, 
        forks_count: 0, 
        html_url: "#" 
    },
    { 
        name: "Image Forgery Localization", 
        description: "Deep Learning (CNNs & Transformers) for digital fake detection using Python & PyTorch.", 
        language: "Python", 
        stargazers_count: 0, 
        forks_count: 0, 
        html_url: "#" 
    }
];

// Funcție asincronă pentru a aduce datele de pe GitHub
async function preiaProiecteGitHub() {
    try {
        // Facem request-ul către API
        const raspuns = await fetch(urlApi);
        
        // Dacă a picat ceva (ex: limită de 60 requesturi atinsă)
        if (!raspuns.ok) {
            throw new Error('Eroare la preluarea datelor API.');
        }

        // Transformăm răspunsul în JSON
        const proiecteGitHub = await raspuns.json();

        // Condiție cerută de profesor: Dacă sunt mai puțin de 5 proiecte
        if (proiecteGitHub.length < 5) {
            mesajPortofoliu.innerText = "Found less than 5 public projects on GitHub. Displaying extended portfolio data:";
            afiseazaProiecte(proiecteDeRezerva);
        } else {
             //Dacă ai 5 sau mai multe, le tăiem doar pe primele 5 și le afișăm
            const primeleCinciProiecte = proiecteGitHub.slice(0, 5);
            afiseazaProiecte(primeleCinciProiecte);
        }
        //afiseazaProiecte(proiecteGitHub);

    } catch (eroare) {
        // Dacă dă eroare (ex: nu ai internet), intrăm aici automat
        mesajPortofoliu.innerText = "Could not connect to GitHub API. Loading local backup projects:";
        afiseazaProiecte(proiecteDeRezerva);
    }
}

// Funcție care primește un array de proiecte și construiește cardurile pe ecran
function afiseazaProiecte(listaProiecte) {
    // Golim containerul pentru orice eventualitate
    containerProiecte.innerHTML = '';

    // Parcurgem fiecare proiect din lista primită
    listaProiecte.forEach(proiect => {
        // Creăm o cutie de tip <div> pentru fiecare card
        const card = document.createElement('div');
        card.className = 'card-proiect'; // Îi dăm clasa din CSS

        // Verificăm dacă proiectul are descriere, dacă nu, punem textul default cerut de prof
        const descriereProiect = proiect.description ? proiect.description : "No description available.";
        const limbajProiect = proiect.language ? proiect.language : "Not specified";

        // Introducem HTML-ul cardului
        card.innerHTML = `
            <h3>${proiect.name}</h3>
            <p>${descriereProiect}</p>
            <p><span class="eticheta-limbaj">Language:</span> ${limbajProiect}</p>
            <p>⭐ ${proiect.stargazers_count} | 🍴 ${proiect.forks_count}</p>
            <a href="${proiect.html_url}" target="_blank" class="buton-cod">View Code</a>
        `;
        
        // Atașăm cardul creat în containerul principal
        containerProiecte.appendChild(card);
    });
}

// Când se încarcă fișierul JS, apelăm funcția principală
preiaProiecteGitHub();