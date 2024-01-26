const fs = require('fs');

function convertJSON(inputFile, outputFile) {
    try {
        const data = fs.readFileSync(inputFile, 'utf8');
        const creds = JSON.parse(data);
        const processedCreds = creds.reduce((acc, cred) => {
            acc[cred.name] = cred;

            return acc;
        }, {});

        fs.writeFileSync(outputFile, JSON.stringify(processedCreds, null, 2), 'utf8');
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
