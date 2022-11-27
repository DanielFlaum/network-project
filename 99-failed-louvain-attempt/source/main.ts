import * as Fs from 'fs';
import * as Path from 'path';

import * as Graphology from 'graphology';
import * as GEXF from 'graphology-gexf';

import argument from './argument.js';
import computeEdgeProportions from './computeEdgeProportions.js';
import invertedLouvainsAlgorithm from './invertedLouvainsAlgorithm.js';



const evaluateGraph = () => {

    const inputFileArgument = argument.inputFile as string;
    const outputFileArgument = argument.outputFile as string;

    console.log('Loading graph...');

    const inputFileContents = Fs.readFileSync(inputFileArgument).toString();
    const graph = GEXF.parse(Graphology.default, inputFileContents);

    console.log('  Success.');

    console.log('Evaluating graph...')

    //computeEdgeProportions(graph);

    console.log('  Success.');

    console.log('Writing graph...');

    Fs.writeFileSync(outputFileArgument, GEXF.write(graph));

    const results = invertedLouvainsAlgorithm(graph);
    console.log(results);

    console.log('  Success.');

};



const commandArgument = argument._[0];
switch (commandArgument) {

    case 'evaluateGraph':
        evaluateGraph();
        break;

};
