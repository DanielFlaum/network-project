/**
 * This module uses [Yargs](https://yargs.js.org/docs/) to parse arguments from the command-line and supply them to the rest of the program.
 *
 * @module
 */

 import Yargs from 'yargs';
 import * as YargsHelpers from 'yargs/helpers';

 // For purpose see https://yargs.js.org/docs/ > API reference
 const rawCommandArguments = YargsHelpers.hideBin(process.argv);

 // Configure the Yargs parser
 const yargsParser =
     Yargs(rawCommandArguments)
         .command('computeStatistics <inputFile> <outputFileBasename>', 'compute statistics', (yargs) => {
             yargs.positional('inputFile', {
                 describe: 'a file containing a graph to evaluate',
                 type: 'string',
                 normalize: true
             }).positional('outputFileBasename', {
                 describe: 'a file basename to save statistics to',
                 type: 'string',
                 normalize: true
             });
         });

 // Parse and extract the arguments.
 const commandArguments = yargsParser.parseSync();

 /**
  * An object containing the arguments parsed by Yargs.
  */
 export default commandArguments;
