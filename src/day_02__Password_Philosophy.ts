

import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/2
 * 
 * https://www.reddit.com/r/adventofcode/comments/k52psu/2020_day_02_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day02/day_02__Password_Philosophy.js
 * 
 * Day 2 - Password Philosophy
 * 
 * PW Policy           1-3 a  Min 1  Max 3  Letter a
 * PW String           abcde
 * Letter Occurance    1
 * Letter at Positions a c
 * 
 * PW Policy           1-3 b  Min 1  Max 3  Letter b
 * PW String           cdefg
 * Letter Occurance    0
 * Letter at Positions c e
 * 
 * PW Policy           2-9 c  Min 2  Max 9  Letter c
 * PW String           ccccccccc
 * Letter Occurance    9
 * Letter at Positions c c
 * 
 * Result Part 1 = 2
 * Result Part 2 = 1
 * 
 * Day 02 - End
 * 
 * Result Part 1 = 622
 * Result Part 2 = 263
 * 
 */

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        /*
         * Splitting input string in rule and password
         */

        let [ pw_policy, pw_string ] : string[] = cur_input_str.split( ": " );

        /*
         * Splitting the password rule in min, max and letter
         */

        let [ min_val_s, max_val_s, pw_letter ] : string[] = pw_policy!.replace( "-", " " ).split( " " );

        let min_val : number = parseInt( min_val_s!, 10 )
        let max_val : number = parseInt( max_val_s!, 10 )

        /*
         * Part 01 - Calculating the occurance of the letter from the rule
         */

        let letter_occurance : number = 0;

        for ( const cur_letter of pw_string! )
        {
            if ( cur_letter === pw_letter )
            {
                letter_occurance++;
            }
        }

        if ( ( letter_occurance >= min_val ) && ( letter_occurance <= max_val ) )
        {
            result_part_01++;
        }

        /*
         * Part 02 - Checking the letter at the positions from the rule
         */

        let letter_pos_a : string = pw_string![ ( min_val - 1 ) ]!;
        let letter_pos_b : string = pw_string![ ( max_val - 1 ) ]!;
        
        if ( ( letter_pos_a === pw_letter ) && ( letter_pos_b !== pw_letter ) )
        {
            result_part_02++;
        } 

        if ( ( letter_pos_b === pw_letter ) && ( letter_pos_a !== pw_letter ) )
        {
            result_part_02++;
        } 

        if ( pKnzDebug )
        {
            wl( "" );
            wl( "" );
            wl( "PW Policy           " + pw_policy! + "  Min " + min_val! + "  Max " + max_val! + "  Letter " + pw_letter );
            wl( "PW String           " + pw_string! );
            wl( "Letter Occurance    " + letter_occurance );
            wl( "Letter at Positions " + letter_pos_a + " " + letter_pos_b );
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day02_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) 
    {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}


function checkReaddatei() : void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "1-3 a: abcde" );
    array_test.push( "1-3 b: cdefg" );
    array_test.push( "2-9 c: ccccccccc" );

    return array_test;
}


wl( "" );
wl( "Day 2 - Password Philosophy" );
wl( "" );

calcArray( getTestArray1(), true );

checkReaddatei();

wl( "" )
wl( "Day 02 - End " );

