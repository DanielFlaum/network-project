export const trimLines = (lines) => {
    console.log('  Trimming lines...');
    const cleanedLines = [];
    for (const line of lines) {
        cleanedLines.push(line.trim());
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const replaceTabsWithSpaces = (lines) => {
    console.log('  Replacing tabs with spaces...');
    const cleanedLines = [];
    for (const line of lines) {
        cleanedLines.push(line.replaceAll('\t', '    '));
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const dumbenEllipses = (lines) => {
    console.log('  Dumbening ellipses...');
    const cleanedLines = [];
    for (const line of lines) {
        cleanedLines.push(line.replaceAll('…', '.'));
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const removeEmptyLines = (lines) => {
    console.log('  Removing empty lines...');
    const cleanedLines = [];
    for (const line of lines) {
        if (line != '') {
            cleanedLines.push(line);
        }
        ;
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const removeSentencelessLines = (lines) => {
    console.log('  Removing sentenceless lines...');
    const cleanedLines = [];
    for (const line of lines) {
        if (line.search(/[.:!?][\s\n]/) != -1) {
            cleanedLines.push(line);
        }
        ;
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const removeQuoteAttributions = (lines) => {
    console.log('  Removing quote attributions...');
    const cleanedLines = [];
    for (const line of lines) {
        if (!line.startsWith('—')) {
            cleanedLines.push(line);
        }
        ;
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const removeEmDashes = (lines) => {
    console.log('  Dumbening ellipses...');
    const cleanedLines = [];
    for (const line of lines) {
        cleanedLines.push(line.replaceAll('—', ' '));
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const removeBullets = (lines) => {
    console.log('  Removing bullets...');
    const cleanedLines = [];
    for (const line of lines) {
        let cleanedLine = line;
        if (cleanedLine.startsWith('*') ||
            cleanedLine.startsWith('»') ||
            cleanedLine.startsWith('•')) {
            cleanedLine = cleanedLine.slice(1);
            cleanedLine = cleanedLine.trimStart();
        }
        ;
        cleanedLines.push(cleanedLine);
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const removeListNumbers = (lines) => {
    console.log('  Removing list numbers...');
    const cleanedLines = [];
    for (const line of lines) {
        let cleanedLine = line;
        const lineNumberMatch = cleanedLine.match(/^\d+\./);
        if (lineNumberMatch != null) {
            const numberLength = lineNumberMatch[0].length;
            cleanedLine = cleanedLine.slice(numberLength);
            cleanedLine = cleanedLine.trimStart();
        }
        ;
        cleanedLines.push(cleanedLine);
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const dumbenQuotationMarks = (lines) => {
    console.log('  Dumbening quotation marks...');
    const cleanedLines = [];
    for (const line of lines) {
        let cleanedLine = line;
        cleanedLine = cleanedLine.replaceAll('“', '"');
        cleanedLine = cleanedLine.replaceAll('”', '"');
        cleanedLine = cleanedLine.replaceAll('‘', '\'');
        cleanedLine = cleanedLine.replaceAll('’', '\'');
        cleanedLines.push(cleanedLine);
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const removeDoubleQuotationMarks = (lines) => {
    console.log('  Removing double quotation marks...');
    const cleanedLines = [];
    for (const line of lines) {
        cleanedLines.push(line.replaceAll('"', ''));
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const removeParentheticals = (lines) => {
    console.log('  Removing parentheticals...');
    const cleanedLines = [];
    for (const line of lines) {
        cleanedLines.push(line.replaceAll(/\(.*?\)/g, ''));
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const removeWordsWithNoLettersOrNumbers = (lines) => {
    console.log('  Removing words with no letters or numbers...');
    const cleanedLines = [];
    for (const line of lines) {
        let cleanedWords = [];
        for (const word of line.split(' ')) {
            if (word.search(/[\w\d]/) != -1) {
                cleanedWords.push(word);
            }
            ;
        }
        ;
        cleanedLines.push(cleanedWords.join(' '));
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
export const lowerCase = (lines) => {
    console.log('  Lowering case...');
    const cleanedLines = [];
    for (const line of lines) {
        cleanedLines.push(line.toLowerCase());
    }
    ;
    console.log('    Success.');
    return cleanedLines;
};
