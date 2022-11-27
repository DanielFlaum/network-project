import * as Graphology from 'graphology';

import * as ngraphRandom from './ngraphRandom.js';

// var createCommunityGraph = require('./lib/createCommunityGraph.js');
// var createCommunity = require('./lib/createCommunity.js');

const invertedLouvainsAlgorithm = (
    graph: Graphology.default,
    options?: { seed?: number }
) => {

    var graph = initializeCommunityGraph(graph);
    var community = createCommunity(graph, options);
    var originalModularity = community.modularity();

    var modularityImproved = community.optimizeModularity();
    var newModularity = community.modularity();

    return {
        canCoarse: canCoarse,
        originalModularity: originalModularity,
        newModularity: newModularity,

        /**
         * Returns a map from community id to array of neighbor ids.
         */
        getAllCommunities: getAllCommunities
    };

    function canCoarse() {
        // If there was movement last turn - we can coarse graph further.
        return modularityImproved;
    }

    function getAllCommunities() {
        var communities = new Map();
        graph.forEachNode((node, attributes) => {
            var communityId = attributes.community;
            let neighbors = communities.get(communityId);
            if (!neighbors) {
                neighbors = [];
                communities.set(communityId, neighbors);
            }
            neighbors.push(node);
        });

        return communities;
    }

};



// Takes input from initializeCommunityGraph()
const computeTotalWeight = (graph: Graphology.default) => {

    let totalWeight = 0;

    graph.forEachNode((node, attributes) => {
        totalWeight += graph.getNodeAttribute(node, 'weightedDegree');
    });

    return totalWeight;

};

// I think this may be just a graph copy operation with some field initialization.
function initializeCommunityGraph(graph: Graphology.default): Graphology.default {

    const internalInitializeNode = (communityGraph: Graphology.default, node: string) => {
        communityGraph.addNode(node);
        communityGraph.setNodeAttribute(node, 'selfLoopsCount', 0);
        communityGraph.setNodeAttribute(node, 'weightedDegree', 0);
    };



    const communityGraph = new Graphology.default({
        // Should be undirected?
        'type': 'directed',
        'allowSelfLoops': true
    });

    const nodeCount = graph.order;

    let totalWeight = 0;

    graph.forEachNode((node, attributes) => { internalInitializeNode(communityGraph, node); });

    graph.forEachEdge(
        (
            edge,
            attributes,
            source,
            target,
            sourceAttributes,
            targetAttributes,
            undirected
        ) => {

        const occurrences = attributes.occurences;

        if (source == target) {
            communityGraph.updateNodeAttribute(source, 'selfLoopsCount', n => n += occurrences);
            communityGraph.updateNodeAttribute(source, 'weightedDegree', n => n += occurrences);
        } else {
            // We do not list self-loops here.
            communityGraph.updateNodeAttribute(source, 'weightedDegree', n => n += occurrences);
            communityGraph.updateNodeAttribute(target, 'weightedDegree', n => n += occurrences);
            // Should be undirected?
            communityGraph.addDirectedEdge(source, target, { occurrences });
        };

    });

    return communityGraph;

};



// Takes input from initializeCommunityGraph()
const createCommunity = (graph: Graphology.default, options?: { seed?: number }) => {

    const totalWeight = computeTotalWeight(graph);
    const nodeCount = graph.order;
    let seededRandom = ngraphRandom.default(42);

    const totalLinksWeight = new Float32Array(nodeCount);
    const internalLinksWeight = new Float32Array(nodeCount);
    // var nodeToCommunity = new Uint32Array(nodeCount);

    let i = 0;
    graph.forEachNode((node, attributes) => {
        graph.setNodeAttribute(node, 'community', i);
        totalLinksWeight[i] = graph.getNodeAttribute(node, 'weightedDegree');
        internalLinksWeight[i] = graph.getNodeAttribute(node, 'selfLoopsCount');

        i += 1;
    });

    return {
      /**
       * compute modularity of the current community
       */
      modularity: modularity,

      /**
       * Attempts to optimize communities of the graph. Returns true if any nodes
       * were moved; False otherwise.
       */
      optimizeModularity: optimizeModularity
    }

    function optimizeModularity() {
        var epsilon = 0.000001;
        if (options && (options.seed !== undefined)) {
            seededRandom = ngraphRandom.default(options.seed);
        }

        var iterator = getRandomNodeIdIterator();
        var newModularity = modularity();
        var currentModularity, movesCount;
        var modularityImproved = false;

        do {
          movesCount = 0;
          currentModularity = newModularity;
          for (var i = 0; i < iterator.length; ++i) {
              var node = iterator[i];
              var nodeCommunity = graph.getNodeAttribute(node, 'community');

              var neighboringCommunities = getNeighbouringCommunities(node);

              var sharedLinksWeight = neighboringCommunities.get(nodeCommunity);
              removeFromCommunity(node, nodeCommunity, sharedLinksWeight);

              var weightedDegree = graph.getNodeAttribute(node, 'weightedDegree');
              var bestCommunity = nodeCommunity;
              var bestGain = 0;

              neighboringCommunities.forEach(function(sharedWeight, communityId) {
                  var gain = getModularityGain(sharedWeight, communityId, weightedDegree);
                  if (gain <= bestGain) return;

                  bestCommunity = communityId;
                  bestGain = gain;
              });

              var bestSharedWeight = neighboringCommunities.get(bestCommunity);
              insertIntoCommunity(node, bestCommunity, bestSharedWeight);

              if (bestCommunity !== nodeCommunity) movesCount += 1;
          }

          newModularity = modularity();
          if (movesCount > 0) modularityImproved = true;
        } while (movesCount > 0 && newModularity - currentModularity > epsilon);

        return modularityImproved;
    };

    function getNeighbouringCommunities(node: string) {
        // map from community id to total links weight between this node and that community
        var map = new Map();
        map.set(graph.getNodeAttribute(node, 'community'), 0);

        // should be forEachEdge?
        graph.forEachOutEdge(
            node,
            (
                edge,
                attributes,
                source,
                target,
                sourceAttributes,
                targetAttributes,
                undirected
            ) => {
            var otherCommunity = targetAttributes.community;
            var currentValue = map.get(otherCommunity) || 0;
            map.set(otherCommunity, currentValue + attributes.occurences);
            }
        );

        return map;
    };

    function getModularityGain(sharedWeight: number, communityId: number, degree: number) {
        var totalLinksWeightInThisCommunity = totalLinksWeight[communityId];

        return sharedWeight - totalLinksWeightInThisCommunity * degree/totalWeight;
    }

    function removeFromCommunity(node: string, communityId: number, sharedLinksWeight: number) {
        totalLinksWeight[communityId] -= graph.getNodeAttribute(node, 'weightedDegree');
        internalLinksWeight[communityId] -= 2 * sharedLinksWeight + graph.getNodeAttribute(node, 'selfLoopsCount');
        graph.setNodeAttribute(node, 'community', -1);
    }

    function insertIntoCommunity(node: string, communityId: number, sharedLinksWeight: number) {
        totalLinksWeight[communityId] += graph.getNodeAttribute(node, 'weightedDegree');
        internalLinksWeight[communityId] += 2 * sharedLinksWeight + graph.getNodeAttribute(node, 'selfLoopsCount');
        graph.setNodeAttribute(node, 'community', communityId);
    }

    function modularity() {
        var result = 0;

        for (var communityId = 0; communityId < nodeCount; ++communityId) {
          if (totalLinksWeight[communityId] > 0) {
            var dw = totalLinksWeight[communityId] / totalWeight;
            result += internalLinksWeight[communityId] / totalWeight - dw * dw;
          }
        }

        return result;
    }

    function getRandomNodeIdIterator() {
        var iterator = graph.nodes();

        ngraphRandom.randomIterator(iterator, seededRandom).shuffle();

        return iterator;
    }
}



export default invertedLouvainsAlgorithm
