import * as Fs from 'fs';
const writeDictionary = (graph, outputFileArgument) => {
    const dictionary = [];
    graph.forEachNode((node, attributes) => {
        dictionary.push({ 'word': node, 'weight': attributes.weight });
    });
    dictionary.sort((leftWord, rightWord) => {
        return leftWord.word.localeCompare(rightWord.word);
    });
    let outputFileContents = 'word, occurrences\n';
    for (const word of dictionary) {
        outputFileContents += `${word.word}, ${word.weight}\n`;
    }
    ;
    Fs.writeFileSync(outputFileArgument + '.csv', outputFileContents);
};
export default writeDictionary;
