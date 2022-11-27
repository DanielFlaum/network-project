#!/usr/bin/fish
cd 00-corpus-cleaning
gulp build
cd ../01-graph-construction
gulp build
cd ../02-statistics-report
gulp build
cd ../03-louvain
gulp build
cd ../04-inverted-louvain
gulp build
cd ../05-random-classification
gulp build
cd ../06-louvain-classification
gulp build
