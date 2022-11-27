import * as Graphology from 'graphology';

const winnowGraph = (graph: Graphology.default) => {

    graph.forEachNode((node, attributes) => {
        if (attributes.weight < 100) {
            graph.dropNode(node);
        }
    });

};

export default winnowGraph;
