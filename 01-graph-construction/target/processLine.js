const processLine = (line) => {
    const words = line.split(' ');
    const sentences = [];
    let sentence = [];
    while (words.length > 0) {
        let word = words.shift();
        if (word == '') {
            continue;
        }
        ;
        if (word.endsWith(',') ||
            word.endsWith(';')) {
            word = word.slice(0, -1);
        }
        ;
        if (word.endsWith('.') ||
            word.endsWith('!') ||
            word.endsWith('?') ||
            word.endsWith(':')) {
            word = word.slice(0, -1);
            sentence.push(word);
            sentences.push(sentence);
            sentence = [];
        }
        else {
            sentence.push(word);
        }
        ;
    }
    ;
    return sentences;
};
export default processLine;
