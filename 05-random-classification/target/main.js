import * as Fs from 'fs';
import { parse as parseCSV } from 'csv-parse/sync';
import * as CSV from 'fast-csv';
import argument from './argument.js';
const attemptClassification = (inputRecords, partOfSpeechProbabilityDistribution) => {
    for (const inputRecord of inputRecords) {
        let partOfSpeech;
        const randomNumber = Math.random();
        if (randomNumber <= partOfSpeechProbabilityDistribution.nouns) {
            partOfSpeech = 'n';
        }
        else if (randomNumber <= partOfSpeechProbabilityDistribution.verbs) {
            partOfSpeech = 'v';
        }
        else if (randomNumber <= partOfSpeechProbabilityDistribution.adjectives) {
            partOfSpeech = 'ad';
        }
        else if (randomNumber <= partOfSpeechProbabilityDistribution.adverbs) {
            partOfSpeech = 'av';
        }
        else {
            partOfSpeech = 'f';
        }
        ;
        inputRecord.randomClassification = partOfSpeech;
    }
    ;
    let successes = 0;
    let failures = 0;
    for (const inputRecord of inputRecords) {
        const partsOfSpeech = inputRecord.partsOfSpeech.split('-');
        if (partsOfSpeech.includes(inputRecord.randomClassification)) {
            successes += 1;
        }
        else {
            failures += 1;
        }
        ;
    }
    ;
    return [
        successes.toString(),
        failures.toString(),
        (successes / (successes + failures)).toString()
    ];
};
const classifyRandomly = () => {
    const inputFileArgument = argument.inputFile;
    const outputFileArgument = argument.outputFile;
    console.log('Counting words...');
    const inputFileContents = Fs.readFileSync(inputFileArgument).toString();
    const inputRecords = parseCSV(inputFileContents, { columns: true, trim: true });
    const partsOfSpeechCounts = {
        nouns: 0,
        verbs: 0,
        adjectives: 0,
        adverbs: 0,
        functionals: 0
    };
    for (const inputRecord of inputRecords) {
        const partsOfSpeech = inputRecord.partsOfSpeech.split('-');
        for (const partOfSpeech of partsOfSpeech) {
            switch (partOfSpeech) {
                case 'n':
                    partsOfSpeechCounts.nouns += 1;
                    break;
                case 'v':
                    partsOfSpeechCounts.verbs += 1;
                    break;
                case 'ad':
                    partsOfSpeechCounts.adjectives += 1;
                    break;
                case 'av':
                    partsOfSpeechCounts.adverbs += 1;
                    break;
                case 'f':
                    partsOfSpeechCounts.functionals += 1;
                    break;
                default:
                    break;
            }
            ;
        }
        ;
    }
    ;
    const totalNumberOfWords = partsOfSpeechCounts.nouns +
        partsOfSpeechCounts.verbs +
        partsOfSpeechCounts.adjectives +
        partsOfSpeechCounts.adverbs +
        partsOfSpeechCounts.functionals;
    const partsOfSpeechRelativeFrequencies = {
        nouns: partsOfSpeechCounts.nouns / totalNumberOfWords,
        verbs: partsOfSpeechCounts.verbs / totalNumberOfWords,
        adjectives: partsOfSpeechCounts.adjectives / totalNumberOfWords,
        adverbs: partsOfSpeechCounts.adverbs / totalNumberOfWords,
        functionals: partsOfSpeechCounts.functionals / totalNumberOfWords
    };
    const partOfSpeechProbabilityDistribution = {
        nouns: partsOfSpeechRelativeFrequencies.nouns,
        verbs: partsOfSpeechRelativeFrequencies.verbs + partsOfSpeechRelativeFrequencies.nouns,
        adjectives: partsOfSpeechRelativeFrequencies.adjectives + partsOfSpeechRelativeFrequencies.verbs + partsOfSpeechRelativeFrequencies.nouns,
        adverbs: partsOfSpeechRelativeFrequencies.adverbs + partsOfSpeechRelativeFrequencies.adjectives + partsOfSpeechRelativeFrequencies.verbs + partsOfSpeechRelativeFrequencies.nouns,
        functionals: 1
    };
    console.log('  Success.');
    console.log('Classifying words...');
    const numberOfAttempts = 10;
    const results = [['success', 'failures', 'successRate']];
    for (let index = 0; index < 10; index += 1) {
        console.log(`Attempt ${index} of ${numberOfAttempts}...`);
        results.push(attemptClassification(inputRecords, partOfSpeechProbabilityDistribution));
    }
    ;
    CSV.writeToPath(outputFileArgument, results);
};
const commandArgument = argument._[0];
switch (commandArgument) {
    case 'classifyRandomly':
        classifyRandomly();
        break;
}
;
