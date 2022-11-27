import * as Fs from 'fs';
import * as Path from 'path';
import * as Graphology from 'graphology';
import * as GEXF from 'graphology-gexf';
import argument from './argument.js';
import processFile from './processFile.js';
import winnowGraph from './winnowGraph.js';
import writeDictionary from './writeDictionary.js';
const constructGraph = () => {
    const inputDirectoryArgument = argument.inputDirectory;
    const outputFileArgument = argument.outputFile;
    console.log('Constructing graph...');
    const graph = new Graphology.default({
        'type': 'directed',
        'allowSelfLoops': true
    });
    const inputDirectoryContents = Fs.readdirSync(inputDirectoryArgument);
    for (const inputFileBasename of inputDirectoryContents) {
        const inputFile = Path.join(inputDirectoryArgument, inputFileBasename);
        processFile(graph, inputFile);
    }
    ;
    console.log('Writing graph...');
    Fs.writeFileSync(outputFileArgument + '.gexf', GEXF.write(graph));
    writeDictionary(graph, outputFileArgument);
    winnowGraph(graph);
    Fs.writeFileSync(outputFileArgument + '-winnowed.gexf', GEXF.write(graph));
    writeDictionary(graph, outputFileArgument + '-winnowed');
    console.log('  Success.');
    console.log('Constructing undirected graph...');
    const undirectedGraph = new Graphology.default({
        'type': 'undirected',
        'allowSelfLoops': true
    });
    graph.forEachNode((node, attributes) => {
        undirectedGraph.addNode(node, attributes);
    });
    graph.forEachEdge((edge, attributes, source, target, sourceAttributes, targetAttributes, undirected) => {
        if (undirectedGraph.hasEdge(target, source)) {
            const weight = graph.getEdgeAttribute(edge, 'weight');
            undirectedGraph.updateEdgeAttribute(target, source, 'weight', n => n += weight);
        }
        else {
            undirectedGraph.addEdge(source, target, attributes);
        }
        ;
    });
    console.log('  Success.');
    console.log('Writing graph...');
    Fs.writeFileSync(outputFileArgument + '-undirected-winnowed.gexf', GEXF.write(undirectedGraph));
    console.log('  Success.');
};
const commandArgument = argument._[0];
switch (commandArgument) {
    case 'constructGraph':
        constructGraph();
        break;
}
;
