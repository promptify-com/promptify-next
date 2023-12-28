const fs = require('fs');

const inputFile = './nodes.json';
const outputFile = './convertedNodes.json';

function convertJSON() {
    try {
        const data = fs.readFileSync(inputFile, 'utf8');
        const nodes = JSON.parse(data);

        const processedNodes = nodes.map(({ name, displayName, iconUrl }) => ({
            name, displayName, iconUrl
        }));

        fs.writeFileSync(outputFile, JSON.stringify(processedNodes, null, 2), 'utf8');

    } catch (err) {
        console.error('Error:', err);
    }

}

convertJSON();
