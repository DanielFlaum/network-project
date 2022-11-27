import * as Fs from 'fs';
import * as Graphology from 'graphology';
import * as GEXF from 'graphology-gexf';
import * as Metrics from 'graphology-metrics';
import * as CSV from 'fast-csv';
import argument from './argument.js';
const computeDegreeDistributions = (graph) => {
    console.log('  Computing degree distributions');
    const degrees = new Map();
    const inDegrees = new Map();
    const outDegrees = new Map();
    const weightedDegrees = new Map();
    const weightedInDegrees = new Map();
    const weightedOutDegrees = new Map();
    graph.forEachNode((node, attributes) => {
        const degree = Metrics.node.weightedDegree(graph, node, () => 1);
        const inDegree = Metrics.node.weightedInDegree(graph, node, () => 1);
        const outDegree = Metrics.node.weightedOutDegree(graph, node, () => 1);
        const weightedDegree = Metrics.node.weightedDegree(graph, node, 'weight');
        const weightedInDegree = Metrics.node.weightedInDegree(graph, node, 'weight');
        const weightedOutDegree = Metrics.node.weightedOutDegree(graph, node, 'weight');
        if (degrees.has(degree)) {
            degrees.set(degree, degrees.get(degree) + 1);
        }
        else {
            degrees.set(degree, 1);
        }
        ;
        if (inDegrees.has(degree)) {
            inDegrees.set(inDegree, inDegrees.get(inDegree) + 1);
        }
        else {
            inDegrees.set(inDegree, 1);
        }
        ;
        if (outDegrees.has(outDegree)) {
            outDegrees.set(outDegree, outDegrees.get(outDegree) + 1);
        }
        else {
            outDegrees.set(outDegree, 1);
        }
        ;
        if (weightedDegrees.has(weightedDegree)) {
            weightedDegrees.set(weightedDegree, weightedDegrees.get(weightedDegree) + 1);
        }
        else {
            weightedDegrees.set(weightedDegree, 1);
        }
        ;
        if (weightedInDegrees.has(weightedInDegree)) {
            weightedInDegrees.set(weightedInDegree, weightedInDegrees.get(weightedInDegree) + 1);
        }
        else {
            weightedInDegrees.set(weightedInDegree, 1);
        }
        ;
        if (weightedOutDegrees.has(weightedOutDegree)) {
            weightedOutDegrees.set(weightedOutDegree, weightedOutDegrees.get(weightedOutDegree) + 1);
        }
        else {
            weightedOutDegrees.set(weightedOutDegree, 1);
        }
        ;
    });
    const degreeRecords = [['degree', 'frequency']];
    const inDegreeRecords = [['inDegree', 'frequency']];
    const outDegreeRecords = [['outDegree', 'frequency']];
    const weightedDegreeRecords = [['weightedDegree', 'frequency']];
    const weightedInDegreeRecords = [['weightedInDegree', 'frequency']];
    const weightedOutDegreeRecords = [['weightedOutDegree', 'frequency']];
    degrees.forEach((value, key) => { degreeRecords.push([key.toString(), value.toString()]); });
    inDegrees.forEach((value, key) => { inDegreeRecords.push([key.toString(), value.toString()]); });
    outDegrees.forEach((value, key) => { outDegreeRecords.push([key.toString(), value.toString()]); });
    weightedDegrees.forEach((value, key) => { weightedDegreeRecords.push([key.toString(), value.toString()]); });
    weightedInDegrees.forEach((value, key) => { weightedInDegreeRecords.push([key.toString(), value.toString()]); });
    weightedOutDegrees.forEach((value, key) => { weightedOutDegreeRecords.push([key.toString(), value.toString()]); });
    return {
        degreeRecords,
        inDegreeRecords,
        outDegreeRecords,
        weightedDegreeRecords,
        weightedInDegreeRecords,
        weightedOutDegreeRecords
    };
};
const computeStatistics = () => {
    const inputFileArgument = argument.inputFile;
    const outputFileBasenameArgument = argument.outputFileBasename;
    console.log('Loading graph...');
    const inputFileContents = Fs.readFileSync(inputFileArgument).toString();
    const graph = GEXF.parse(Graphology.default, inputFileContents);
    console.log('  Success.');
    console.log('Evaluating graph...');
    const degreeDistributions = computeDegreeDistributions(graph);
    console.log('  Success.');
    console.log('Writing reports...');
    CSV.writeToPath(outputFileBasenameArgument + '-degreeDistribution.csv', degreeDistributions.degreeRecords);
    CSV.writeToPath(outputFileBasenameArgument + '-degreeDistributionIn.csv', degreeDistributions.inDegreeRecords);
    CSV.writeToPath(outputFileBasenameArgument + '-degreeDistributionOut.csv', degreeDistributions.outDegreeRecords);
    CSV.writeToPath(outputFileBasenameArgument + '-degreeDistributionWeighted.csv', degreeDistributions.weightedDegreeRecords);
    CSV.writeToPath(outputFileBasenameArgument + '-degreeDistributionWeightedIn.csv', degreeDistributions.weightedInDegreeRecords);
    CSV.writeToPath(outputFileBasenameArgument + '-degreeDistributionWeightedOut.csv', degreeDistributions.weightedOutDegreeRecords);
    console.log('  Success.');
};
const commandArgument = argument._[0];
switch (commandArgument) {
    case 'computeStatistics':
        computeStatistics();
        break;
}
;
