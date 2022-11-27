export const trimLines = (lines: string[]): string[] => {

    console.log('  Trimming lines...');

    const cleanedLines: string[] = [];

    for (const line of lines) {
        cleanedLines.push(line.trim());
    };

    console.log('    Success.');

    return cleanedLines;

};

export const replaceTabsWithSpaces = (lines: string[]): string[] => {

    console.log ('  Replacing tabs with spaces...');

    const cleanedLines: string[] = [];

    for (const line of lines) {
        cleanedLines.push(line.replaceAll('\t', '    '));
    };

    console.log ('    Success.');

    return cleanedLines;

};

export const dumbenEllipses = (lines: string[]): string[] => {

    console.log ('  Dumbening ellipses...');

    const cleanedLines: string[] = [];

    for (const line of lines) {
        cleanedLines.push(line.replaceAll('…', '.'));
    };

    console.log ('    Success.');

    return cleanedLines;

};

export const removeEmptyLines = (lines: string[]): string[] => {

    console.log ('  Removing empty lines...');

    const cleanedLines: string[] = [];

    for (const line of lines) {

        if (line != '') {
            cleanedLines.push(line);
        };

    };

    console.log ('    Success.');

    return cleanedLines;

};

export const removeSentencelessLines = (lines: string[]): string[] => {

    console.log('  Removing sentenceless lines...');

    const cleanedLines: string[] = [];

    for (const line of lines) {

        if (line.search(/[.:!?][\s\n]/) != -1) {
            cleanedLines.push(line);
        };

    };

    console.log('    Success.');

    return cleanedLines;

};

export const removeQuoteAttributions = (lines: string[]): string[] => {

    console.log('  Removing quote attributions...');

    const cleanedLines: string[] = [];

    for (const line of lines) {
        if (!line.startsWith('—')) {
            cleanedLines.push(line);
        };
    };

    console.log('    Success.');

    return cleanedLines;

};

export const removeEmDashes = (lines: string[]): string[] => {

    console.log ('  Dumbening ellipses...');

    const cleanedLines: string[] = [];

    for (const line of lines) {
        cleanedLines.push(line.replaceAll('—', ' '));
    };

    console.log ('    Success.');

    return cleanedLines;

};

export const removeBullets = (lines: string[]): string[] => {

    console.log('  Removing bullets...');

    const cleanedLines: string[] = [];

    for (const line of lines) {

        let cleanedLine = line;

        if (
            cleanedLine.startsWith('*') ||
            cleanedLine.startsWith('»') ||
            cleanedLine.startsWith('•')

        ) {
            cleanedLine = cleanedLine.slice(1);
            cleanedLine = cleanedLine.trimStart();
        };

        cleanedLines.push(cleanedLine);

    };

    console.log('    Success.');

    return cleanedLines;

};

export const removeListNumbers = (lines: string[]): string[] => {

    console.log('  Removing list numbers...');

    const cleanedLines: string[] = [];

    for (const line of lines) {

        let cleanedLine = line;
        const lineNumberMatch = cleanedLine.match(/^\d+\./);

        if (lineNumberMatch != null) {
            const numberLength = lineNumberMatch[0].length;
            cleanedLine = cleanedLine.slice(numberLength);
            cleanedLine = cleanedLine.trimStart();
        };

        cleanedLines.push(cleanedLine);

    };

    console.log('    Success.');

    return cleanedLines;

};

export const dumbenQuotationMarks = (lines: string[]): string[] => {

    console.log('  Dumbening quotation marks...');

    const cleanedLines: string[] = [];

    for (const line of lines) {

        let cleanedLine = line;

        cleanedLine = cleanedLine.replaceAll('“', '"');
        cleanedLine = cleanedLine.replaceAll('”', '"');
        cleanedLine = cleanedLine.replaceAll('‘', '\'');
        cleanedLine = cleanedLine.replaceAll('’', '\'');

        cleanedLines.push(cleanedLine);

    };

    console.log('    Success.');

    return cleanedLines;

};

export const removeDoubleQuotationMarks = (lines: string[]): string[] => {

    console.log('  Removing double quotation marks...')

    const cleanedLines: string[] = [];

    for (const line of lines) {
        cleanedLines.push(line.replaceAll('"', ''));
    };

    console.log('    Success.');

    return cleanedLines;

};

export const removeParentheticals = (lines: string[]): string[] => {

    console.log('  Removing parentheticals...');

    const cleanedLines: string[] = [];

    for (const line of lines) {
        cleanedLines.push(line.replaceAll(/\(.*?\)/g, ''));
    };

    console.log('    Success.');

    return cleanedLines;

};

export const removeWordsWithNoLettersOrNumbers = (lines: string[]): string[] => {

    console.log('  Removing words with no letters or numbers...');

    const cleanedLines: string[] = [];

    for (const line of lines) {

        let cleanedWords: string[] = [];

        for (const word of line.split(' ')) {
            if (word.search(/[\w\d]/) != -1) {
                cleanedWords.push(word);
            };
        };

        cleanedLines.push(cleanedWords.join(' '));

    };

    console.log('    Success.');

    return cleanedLines;

};

export const lowerCase = (lines: string[]): string[] => {

    console.log('  Lowering case...');

    const cleanedLines: string[] = [];

    for (const line of lines) {
        cleanedLines.push(line.toLowerCase());
    };

    console.log('    Success.');

    return cleanedLines;

};
