import * as Fs from 'fs';
import argument from './argument.js';
import * as cleaner from './cleaner.js';
const cleanFile = () => {
    const inputFileArgument = argument.inputFile;
    const outputFileArgument = argument.outputFile;
    console.log(`Reading file ${inputFileArgument}...`);
    const inputFileContents = Fs.readFileSync(inputFileArgument).toString();
    console.log('  Success.');
    console.log('Cleaning...');
    let lines = inputFileContents.split('\n');
    lines = cleaner.trimLines(lines);
    lines = cleaner.replaceTabsWithSpaces(lines);
    lines = cleaner.dumbenEllipses(lines);
    lines = cleaner.removeEmptyLines(lines);
    lines = cleaner.removeSentencelessLines(lines);
    lines = cleaner.removeQuoteAttributions(lines);
    lines = cleaner.removeEmDashes(lines);
    lines = cleaner.removeBullets(lines);
    lines = cleaner.removeListNumbers(lines);
    lines = cleaner.dumbenQuotationMarks(lines);
    lines = cleaner.removeDoubleQuotationMarks(lines);
    lines = cleaner.removeParentheticals(lines);
    lines = cleaner.removeWordsWithNoLettersOrNumbers(lines);
    lines = cleaner.lowerCase(lines);
    const outputContents = lines.join('\n');
    Fs.writeFileSync(outputFileArgument, outputContents);
    console.log('Success.');
};
const commandArgument = argument._[0];
switch (commandArgument) {
    case 'cleanFile':
        cleanFile();
        break;
}
;
