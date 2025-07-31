const GITHUB_TOKEN = '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'; // 👈 Tutaj wklej swój token
const REPO = 'SPI339Nocowanka/ankieta'; // np. 'mojnick/familiada-ankiety'
const DATA_PATH = 'data/responses.json';

// Pobiera istniejące odpowiedzi z GitHub
async function fetchGitHubFile() {
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${DATA_PATH}`, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return {
            content: JSON.parse(atob(data.content)),
            sha: data.sha
        };
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        return null;
    }
}

// Zapisuje nowe odpowiedzi na GitHub
async function saveToGitHub(newData) {
    try {
        const existingFile = await fetchGitHubFile();
        let currentData = [];
        let sha = null;

        if (existingFile) {
            currentData = existingFile.content;
            sha = existingFile.sha;
        }

        currentData.push(newData);

        const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${DATA_PATH}`, {
            method: 'PUT',
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` },
            body: JSON.stringify({
                message: "Dodano nowe odpowiedzi ankietowe",
                content: btoa(JSON.stringify(currentData)),
                sha: sha
            })
        });

        return response.ok;
    } catch (error) {
        console.error('Błąd zapisu:', error);
        return false;
    }
}