import * as Graphology from 'graphology';

const computeEdgeProportions = (graph: Graphology.default) => {

    graph.forEachEdge((
        edge,
        attributes,
        source,
        target,
        sourceAttributes,
        targetAttributes,
        undirected
    ) => {

        let sourceWeightedOutDegree = 0;
        graph.forEachOutEdge(source, (
            edge,
            attributes,
            source,
            target,
            sourceAttributes,
            targetAttributes,
            undirected
        ) => {
            sourceWeightedOutDegree += attributes.occurrences;
        });

        let targetWeightedInDegree = 0;
        graph.forEachInEdge(target, (
            edge,
            attributes,
            source,
            target,
            sourceAttributes,
            targetAttributes,
            undirected
        ) => {
            targetWeightedInDegree += attributes.occurrences;
        });

        graph.setEdgeAttribute(edge, 'relativeSourceOutDegree', attributes.occurrences / sourceWeightedOutDegree);
        graph.setEdgeAttribute(edge, 'relativeTargetInDegree', attributes.occurrences / targetWeightedInDegree);

    });

};

export default computeEdgeProportions;
