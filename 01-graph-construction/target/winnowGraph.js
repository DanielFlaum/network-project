const winnowGraph = (graph) => {
    graph.forEachNode((node, attributes) => {
        if (attributes.weight < 100) {
            graph.dropNode(node);
        }
    });
};
export default winnowGraph;
