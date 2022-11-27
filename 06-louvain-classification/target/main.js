import * as Fs from 'fs';
import * as Graphology from 'graphology';
import * as GEXF from 'graphology-gexf';
import { parse as parseCSV } from 'csv-parse/sync';
import * as CSV from 'fast-csv';
import argument from './argument.js';
const attemptClassification = (graph, dictionary, louvainAttribute) => {
    const louvainCommunitiesMap = new Map();
    for (const record of dictionary) {
        const attributes = graph.getNodeAttributes(record.word);
        const community = attributes[louvainAttribute];
        if (louvainCommunitiesMap.has(community)) {
            louvainCommunitiesMap.get(community).words.push(record);
        }
        else {
            louvainCommunitiesMap.set(community, {
                summary: undefined,
                words: [record]
            });
        }
        ;
    }
    ;
    louvainCommunitiesMap.forEach((community, louvainNumber) => {
        const summaries = {
            n: { majorityPartOfSpeech: 'n', frequency: 0, size: 0 },
            v: { majorityPartOfSpeech: 'v', frequency: 0, size: 0 },
            ad: { majorityPartOfSpeech: 'ad', frequency: 0, size: 0 },
            av: { majorityPartOfSpeech: 'av', frequency: 0, size: 0 },
            f: { majorityPartOfSpeech: 'f', frequency: 0, size: 0 }
        };
        for (const word of community.words) {
            const partsOfSpeech = word.partsOfSpeech.split('-');
            for (const partOfSpeech of partsOfSpeech) {
                summaries[partOfSpeech].frequency += 1;
            }
            ;
        }
        ;
        let winningSummary = summaries.n;
        for (const partOfSpeech in summaries) {
            if (summaries[partOfSpeech].frequency > winningSummary.frequency) {
                winningSummary = summaries[partOfSpeech];
            }
            ;
        }
        ;
        winningSummary.size = community.words.length;
        community.summary = winningSummary;
    });
    return louvainCommunitiesMap;
};
const inferWordClasses = () => {
    const inputGraphArgument = argument.inputGraph;
    const inputDictionaryArgument = argument.inputDictionary;
    const outputDirectoryArgument = argument.outputDirectory;
    console.log('Loading data...');
    const inputGraphContents = Fs.readFileSync(inputGraphArgument).toString();
    const graph = GEXF.parse(Graphology.default, inputGraphContents);
    const inputDictionaryContents = Fs.readFileSync(inputDictionaryArgument).toString();
    const dictionaryRecords = parseCSV(inputDictionaryContents, {
        columns: true,
        trim: true
    });
    console.log('  Success.');
    console.log('Cropping graph...');
    graph.forEachNode((node, attributes) => {
        let nodeIsInDictionary = false;
        dictionaryRecords.forEach((record) => {
            if (node == record.word) {
                nodeIsInDictionary = true;
            }
            ;
        });
        if (!nodeIsInDictionary) {
            graph.dropNode(node);
        }
        ;
    });
    console.log('  Success.');
    console.log('Evaluating graph...');
    const louvainCommunitiesMaps = new Map();
    for (let index = 0; index < 10; index += 1) {
        const louvainAttribute = 'louvainCommunity' + index;
        const louvainCommunitiesMap = attemptClassification(graph, dictionaryRecords, louvainAttribute);
        louvainCommunitiesMaps.set(louvainAttribute, louvainCommunitiesMap);
        const invertedLouvainAttribute = 'invertedLouvainCommunity' + index;
        const invertedLouvainCommunitiesMap = attemptClassification(graph, dictionaryRecords, invertedLouvainAttribute);
        louvainCommunitiesMaps.set(invertedLouvainAttribute, invertedLouvainCommunitiesMap);
    }
    ;
    console.log('  Success.');
    console.log('Writing results...');
    louvainCommunitiesMaps.forEach((louvainCommunitiesMap, louvainAttribute) => {
        louvainCommunitiesMap.forEach((community, louvainNumber) => {
            for (const word of community.words) {
                graph.setNodeAttribute(word.word, louvainAttribute + 'PartOfSpeech', community.summary.majorityPartOfSpeech);
            }
            ;
        });
    });
    Fs.writeFileSync(outputDirectoryArgument + '/cropped-graph.gexf', GEXF.write(graph));
    louvainCommunitiesMaps.forEach((louvainCommunitiesMap, louvainAttribute) => {
        let louvainCommunityReport = [
            ['louvainCommunity', 'majorityPartOfSpeech', 'frequency', 'size', 'ratio']
        ];
        louvainCommunitiesMap.forEach((community, louvainNumber) => {
            louvainCommunityReport.push([
                louvainNumber,
                community.summary.majorityPartOfSpeech,
                (community.summary.frequency).toString(),
                (community.summary.size).toString(),
                (community.summary.frequency / community.summary.size).toString()
            ]);
        });
        CSV.writeToPath(outputDirectoryArgument + '/' + louvainAttribute + 'Report.csv', louvainCommunityReport);
    });
    console.log('  Success.');
};
const commandArgument = argument._[0];
switch (commandArgument) {
    case 'inferWordClasses':
        inferWordClasses();
        break;
}
;
