#!/usr/bin/python

import networkx

print('Generating Erdős-Rényi networks...')

for i in range(10):
    print('  Generating network ' + str(i) + ' of 10...')
    graph = networkx.erdos_renyi_graph(5535, 0.023, None, True)
    networkx.write_gml(graph, '00-results/er' + str(i) + '.gml')

print('  Success.')

print('Generating Barabási-Albert networks...')

for i in range(10):
    print('  Generating network ' + str(i) + ' of 10...')
    graph = networkx.barabasi_albert_graph(5535, 126, None, None)
    networkx.write_gml(graph, '00-results/ba' + str(i) + '.gml')

print('  Success.')
