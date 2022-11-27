import * as Fs from 'fs';
import * as Graphology from 'graphology';
import * as GEXF from 'graphology-gexf';
import louvain from 'graphology-communities-louvain';
import argument from './argument.js';
const evaluateGraph = () => {
    const inputFileArgument = argument.inputFile;
    const outputFileArgument = argument.outputFile;
    console.log('Loading graph...');
    const inputFileContents = Fs.readFileSync(inputFileArgument).toString();
    const graph = GEXF.parse(Graphology.default, inputFileContents);
    console.log('  Success.');
    console.log('Evaluating graph...');
    for (let index = 0; index < 10; index += 1) {
        louvain.assign(graph, {
            getEdgeWeight: 'weight',
            nodeCommunityAttribute: 'louvainCommunity' + index,
            resolution: 0.98
        });
    }
    console.log('  Success.');
    console.log('Writing graph...');
    Fs.writeFileSync(outputFileArgument, GEXF.write(graph));
    console.log('  Success.');
};
const commandArgument = argument._[0];
switch (commandArgument) {
    case 'evaluateGraph':
        evaluateGraph();
        break;
}
;
