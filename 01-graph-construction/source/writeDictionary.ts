import * as Fs from 'fs';

import * as Graphology from 'graphology';



const writeDictionary = (
    graph: Graphology.default,
    outputFileArgument: string
) => {

    const dictionary: { word: string, weight: number }[] = [];
    graph.forEachNode((node, attributes) => {
        dictionary.push({ 'word': node, 'weight': attributes.weight});
    });

    dictionary.sort((leftWord, rightWord) => {
        return leftWord.word.localeCompare(rightWord.word);
    });

    let outputFileContents = 'word, occurrences\n';

    for (const word of dictionary) {
        outputFileContents += `${word.word}, ${word.weight}\n`
    };

    Fs.writeFileSync(outputFileArgument + '.csv', outputFileContents);

};

export default writeDictionary;
