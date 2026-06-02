const numeUtilizator = 'elenateodorapuia-creator';
const urlApi = `https://api.github.com/users/${numeUtilizator}/repos`;

const containerProiecte = document.getElementById('container-proiecte');
const mesajPortofoliu = document.getElementById('mesaj-portofoliu');
const mesajIncarcare = document.getElementById('mesaj-incarcare');
const baraCautare = document.getElementById('bara-cautare');
const butonLoadMore = document.getElementById('buton-load-more');

let listaCurentaDeProiecte = []; 
let limitaAfisare = 6;

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
    },
    { name: "Proiect Extra 1", description: "Acesta este un proiect de test pentru a verifica butonul de Load More.", language: "Java", stargazers_count: 0, forks_count: 0, html_url: "#" },
    { name: "Proiect Extra 2", description: "Alt proiect de test pentru paginare.", language: "HTML", stargazers_count: 0, forks_count: 0, html_url: "#" }
];

async function preiaProiecteGitHub() {
    try {
        mesajIncarcare.style.display = 'block'; // mesaj loading
        // request la api
        const raspuns = await fetch(urlApi);
        if (!raspuns.ok) {
            throw new Error('Eroare la preluarea datelor API.');
        }
        // transformam in JSON
        let proiecteGitHub = await raspuns.json();
        proiecteGitHub = proiecteGitHub.filter(proiect => proiect.fork === false); // filtrare
        proiecteGitHub.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // sortare

        mesajIncarcare.style.display = 'none'; // ascundem mesaj loading

        if (proiecteGitHub.length < 5) {
            mesajPortofoliu.innerText = "Found less than 5 public projects on GitHub. Displaying extended portfolio data:";
            listaCurentaDeProiecte = proiecteDeRezerva;
        } else {
            listaCurentaDeProiecte = proiecteGitHub;
        }
        afiseazaProiecte(listaCurentaDeProiecte);
        limitaAfisare = 6;
        //afiseazaProiecte(proiecteGitHub);

    } catch (eroare) {
        mesajIncarcare.style.display = 'none';
        mesajPortofoliu.innerText = "Could not connect to GitHub API. Loading local backup projects:";
        listaCurentaDeProiecte = proiecteDeRezerva;
        limitaAfisare = 6;
        afiseazaProiecte(listaCurentaDeProiecte);
    }
}

function afiseazaProiecte(listaProiecte) {
    // golim container 
    containerProiecte.innerHTML = '';
    const proiecteDeAfisat = listaProiecte.slice(0, limitaAfisare);

    proiecteDeAfisat.forEach(proiect => {
        const card = document.createElement('div');
        card.className = 'card-proiect'; 

        const descriereProiect = proiect.description ? proiect.description : "No description available.";
        const limbajProiect = proiect.language ? proiect.language : "Not specified";

        let butonSursa = '';
        if (proiect.html_url === '#' || !proiect.html_url) {
            butonSursa = `<span class="buton-cod buton-dezactivat">Private Code</span>`;
        } else {
            butonSursa = `<a href="${proiect.html_url}" target="_blank" class="buton-cod">View Code</a>`;
        }

        // HTML-ul cardului:
        card.innerHTML = `
            <h3>${proiect.name}</h3>
            <p>${descriereProiect}</p>
            <p><span class="eticheta-limbaj">Language:</span> ${limbajProiect}</p>
            <p>⭐ ${proiect.stargazers_count} | 🍴 ${proiect.forks_count}</p>
            ${butonSursa}
        `;
        containerProiecte.appendChild(card);
    });
    if (listaProiecte.length > limitaAfisare) {
        butonLoadMore.style.display = 'inline-block';
    } else {
        butonLoadMore.style.display = 'none';
    }
}

butonLoadMore.addEventListener('click', () => {
    limitaAfisare += 6; 
    // in cazul in care utilizatorul a cautat ceva si are mai mult de 6 potriviri:
    const textCautat = baraCautare.value.toLowerCase();
    const proiecteFiltrate = listaCurentaDeProiecte.filter(proiect => {
        const nume = proiect.name.toLowerCase();
        const limbaj = proiect.language ? proiect.language.toLowerCase() : "";
        return nume.includes(textCautat) || limbaj.includes(textCautat);
    });
    afiseazaProiecte(proiecteFiltrate);
});

// bara de cautare:
baraCautare.addEventListener('input', (eveniment) => {
    limitaAfisare = 6;
    const textCautat = eveniment.target.value.toLowerCase(); // sa nu fie case sensitive
    const proiecteFiltrate = listaCurentaDeProiecte.filter(proiect => {
        const nume = proiect.name.toLowerCase();
        const limbaj = proiect.language ? proiect.language.toLowerCase() : "";
        return nume.includes(textCautat) || limbaj.includes(textCautat);
    });
    afiseazaProiecte(proiecteFiltrate);
});

preiaProiecteGitHub();