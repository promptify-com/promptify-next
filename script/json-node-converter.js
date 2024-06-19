const fs = require('fs');

function convertJSON(inputFile, outputFile) {
    try {
        const data = fs.readFileSync(inputFile, 'utf8');
        const nodes = JSON.parse(data);
        const processedNodes = nodes.reduce((acc, node) => {
            acc[node.name] = {
                name: node.displayName,
                type: node.name,
                iconUrl: node.iconUrl ?? "",
                description: node.description ?? "",
            };

            return acc;
        }, {});

        fs.writeFileSync(outputFile, JSON.stringify(processedNodes, null, 2), 'utf8');

    } catch (err) {
        console.error('Error:', err);
    }

}

const [inputFile, outputFile] = process.argv.slice(2);

if (!inputFile || !outputFile) {
    console.error('Please provide input and output file paths.');
    process.exit(1);
}

convertJSON(inputFile, outputFile);
