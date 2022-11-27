import * as Fs from 'fs';
import * as Path from 'path';

import * as Graphology from 'graphology';
import * as GEXF from 'graphology-gexf';

import { parse as parseCSV } from 'csv-parse/sync';
import * as CSV from 'fast-csv';

import argument from './argument.js';



type DictionaryRecord = { word: string, frequency: string, partsOfSpeech: string };
type PartOfSpeech = 'n' | 'v' | 'ad' | 'av' | 'f';
type CommunitySummary = {
    majorityPartOfSpeech: PartOfSpeech,
    frequency: number,
    size: number
};
type Community = {
    summary?: CommunitySummary,
    words: DictionaryRecord[]
};
type LouvainCommunityReportRecord = [string, string, string, string, string];


const attemptClassification = (
    graph: Graphology.default,
    dictionary: DictionaryRecord[],
    louvainAttribute: string) => {

    const louvainCommunitiesMap = new Map<string,Community>();

    for (const record of dictionary) {

        const attributes = graph.getNodeAttributes(record.word);
        const community = attributes[louvainAttribute];

        if (louvainCommunitiesMap.has(community)) {
            louvainCommunitiesMap.get(community)!.words.push(record);
        } else {
            louvainCommunitiesMap.set(
                community,
                {
                    summary: undefined,
                    words: [record]
                }
            );
        };

    };

    louvainCommunitiesMap.forEach((community, louvainNumber) => {

        const summaries = {
            n: { majorityPartOfSpeech: 'n' as PartOfSpeech, frequency: 0, size: 0 },
            v: { majorityPartOfSpeech: 'v' as PartOfSpeech, frequency: 0, size: 0 },
            ad: { majorityPartOfSpeech: 'ad' as PartOfSpeech, frequency: 0, size: 0 },
            av: { majorityPartOfSpeech: 'av' as PartOfSpeech, frequency: 0, size: 0 },
            f: { majorityPartOfSpeech: 'f' as PartOfSpeech, frequency: 0, size: 0 }
        };

        for (const word of community.words) {

            const partsOfSpeech = (word.partsOfSpeech as string).split('-');

            for (const partOfSpeech of partsOfSpeech) {
                summaries[partOfSpeech as PartOfSpeech].frequency += 1;
            };

        };

        let winningSummary = summaries.n;
        for (const partOfSpeech in summaries) {
            if (summaries[partOfSpeech as PartOfSpeech].frequency > winningSummary.frequency) {
                winningSummary = summaries[partOfSpeech as PartOfSpeech];
            };
        };

        winningSummary.size = community.words.length;
        community.summary = winningSummary;

    });

    return louvainCommunitiesMap;

};

const inferWordClasses = () => {

    const inputGraphArgument = argument.inputGraph as string;
    const inputDictionaryArgument = argument.inputDictionary as string;
    const outputDirectoryArgument = argument.outputDirectory as string;

    console.log('Loading data...');

    const inputGraphContents = Fs.readFileSync(inputGraphArgument).toString();
    const graph = GEXF.parse(Graphology.default, inputGraphContents);

    const inputDictionaryContents = Fs.readFileSync(inputDictionaryArgument).toString();
    const dictionaryRecords =
        parseCSV(
            inputDictionaryContents,
            {
                columns: true,
                trim: true
            }
        ) as DictionaryRecord[];

    console.log('  Success.');

    console.log('Cropping graph...');

    graph.forEachNode((node, attributes) => {
        let nodeIsInDictionary = false;
        dictionaryRecords.forEach((record) => {
            if (node == record.word) {
                nodeIsInDictionary = true
            };
        });
        if (!nodeIsInDictionary) {
            graph.dropNode(node);
        };
    });

    console.log('  Success.');

    console.log('Evaluating graph...');

    const louvainCommunitiesMaps: Map<string,Map<string,Community>> = new Map();

    for (let index = 0; index < 10; index += 1) {

        const louvainAttribute = 'louvainCommunity' + index;

        const louvainCommunitiesMap = attemptClassification(
            graph,
            dictionaryRecords,
            louvainAttribute
        );

        louvainCommunitiesMaps.set(louvainAttribute, louvainCommunitiesMap);

        const invertedLouvainAttribute = 'invertedLouvainCommunity' + index;

        const invertedLouvainCommunitiesMap = attemptClassification(
            graph,
            dictionaryRecords,
            invertedLouvainAttribute
        );

        louvainCommunitiesMaps.set(invertedLouvainAttribute, invertedLouvainCommunitiesMap);

    };

    console.log('  Success.');

    console.log('Writing results...');

    louvainCommunitiesMaps.forEach((louvainCommunitiesMap, louvainAttribute) => {

        louvainCommunitiesMap.forEach((community, louvainNumber) => {
            for (const word of community.words) {
                graph.setNodeAttribute(word.word, louvainAttribute + 'PartOfSpeech', community.summary!.majorityPartOfSpeech);
            };
        });

    });

    Fs.writeFileSync(outputDirectoryArgument + '/cropped-graph.gexf', GEXF.write(graph));

    louvainCommunitiesMaps.forEach((louvainCommunitiesMap, louvainAttribute) => {

        let louvainCommunityReport: LouvainCommunityReportRecord[] = [
            ['louvainCommunity', 'majorityPartOfSpeech', 'frequency', 'size', 'ratio']
        ];
        louvainCommunitiesMap.forEach((community, louvainNumber) => {
            louvainCommunityReport.push([
                louvainNumber,
                community.summary!.majorityPartOfSpeech,
                (community.summary!.frequency).toString(),
                (community.summary!.size).toString(),
                (community.summary!.frequency / community.summary!.size).toString()
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

};
