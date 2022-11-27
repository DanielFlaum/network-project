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
         .command('constructGraph <inputDirectory> <outputFile>', 'build graph from corpus', (yargs) => {
             yargs.positional('inputDirectory', {
                 describe: 'a directory contain plain text files',
                 type: 'string',
                 normalize: true
             }).positional('outputFile', {
                 describe: 'a path and basename to write graph data to',
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
