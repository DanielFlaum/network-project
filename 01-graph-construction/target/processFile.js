import * as Fs from 'fs';
import processLine from './processLine.js';
const processFile = (graph, inputFile) => {
    console.log(`  Processing file ${inputFile}...`);
    const inputFileContents = Fs.readFileSync(inputFile).toString();
    const lines = inputFileContents.split('\n');
    let sentences = [];
    for (const line of lines) {
        const sentencesOfCleanedLine = processLine(line);
        sentences = sentences.concat(sentencesOfCleanedLine);
    }
    ;
    for (const sentence of sentences) {
        let nextWord = sentence.shift();
        if (graph.hasNode(nextWord)) {
            graph.updateNodeAttribute(nextWord, 'weight', n => n + 1);
        }
        else {
            graph.addNode(nextWord, { weight: 1 });
        }
        ;
        while (sentence.length > 0) {
            let previousWord = nextWord;
            nextWord = sentence.shift();
            if (graph.hasNode(nextWord)) {
                graph.updateNodeAttribute(nextWord, 'weight', n => n + 1);
            }
            else {
                graph.addNode(nextWord, { weight: 1 });
            }
            ;
            if (graph.hasDirectedEdge(previousWord, nextWord)) {
                graph.updateDirectedEdgeAttribute(previousWord, nextWord, 'weight', n => n + 1);
            }
            else {
                graph.addDirectedEdge(previousWord, nextWord, { weight: 1 });
            }
            ;
        }
        ;
    }
    ;
};
export default processFile;
