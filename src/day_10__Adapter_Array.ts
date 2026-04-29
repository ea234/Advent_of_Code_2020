import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/10
 * 
 * https://www.reddit.com/r/adventofcode/comments/ka8z8x/2020_day_10_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day10/day_10__Adapter_Array.js
 * 
 * Day 10 - Adapter Array
 * 
 * (13) [0, 1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19, 22]
 * 
 *    0     1 -     0 =  1   1_diff    1   3_diff    0   ELSE    0
 *    1     4 -     1 =  3   1_diff    1   3_diff    1   ELSE    0
 *    2     5 -     4 =  1   1_diff    2   3_diff    1   ELSE    0
 *    3     6 -     5 =  1   1_diff    3   3_diff    1   ELSE    0
 *    4     7 -     6 =  1   1_diff    4   3_diff    1   ELSE    0
 *    5    10 -     7 =  3   1_diff    4   3_diff    2   ELSE    0
 *    6    11 -    10 =  1   1_diff    5   3_diff    2   ELSE    0
 *    7    12 -    11 =  1   1_diff    6   3_diff    2   ELSE    0
 *    8    15 -    12 =  3   1_diff    6   3_diff    3   ELSE    0
 *    9    16 -    15 =  1   1_diff    7   3_diff    3   ELSE    0
 *   10    19 -    16 =  3   1_diff    7   3_diff    4   ELSE    0
 *   11    22 -    19 =  3   1_diff    7   3_diff    5   ELSE    0
 * 
 * adapter_max            =  19
 * device_joltage_rating  =  22
 * 
 * diff_1_count        7
 * diff_3_count        5
 * diff_else_count     0
 * 
 * Result Part 1 = 35
 * Result Part 2 = 0
 * 
 * ----------------------------------------------------------------------------
 * 
 * (33) [0, 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31, 32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 48, 49, 52]
 * 
 *    0     1 -     0 =  1   1_diff    1   3_diff    0   ELSE    0
 *    1     2 -     1 =  1   1_diff    2   3_diff    0   ELSE    0
 *    2     3 -     2 =  1   1_diff    3   3_diff    0   ELSE    0
 *    3     4 -     3 =  1   1_diff    4   3_diff    0   ELSE    0
 *    4     7 -     4 =  3   1_diff    4   3_diff    1   ELSE    0
 *    5     8 -     7 =  1   1_diff    5   3_diff    1   ELSE    0
 *    6     9 -     8 =  1   1_diff    6   3_diff    1   ELSE    0
 *    7    10 -     9 =  1   1_diff    7   3_diff    1   ELSE    0
 *    8    11 -    10 =  1   1_diff    8   3_diff    1   ELSE    0
 *    9    14 -    11 =  3   1_diff    8   3_diff    2   ELSE    0
 *   10    17 -    14 =  3   1_diff    8   3_diff    3   ELSE    0
 *   11    18 -    17 =  1   1_diff    9   3_diff    3   ELSE    0
 *   12    19 -    18 =  1   1_diff   10   3_diff    3   ELSE    0
 *   13    20 -    19 =  1   1_diff   11   3_diff    3   ELSE    0
 *   14    23 -    20 =  3   1_diff   11   3_diff    4   ELSE    0
 *   15    24 -    23 =  1   1_diff   12   3_diff    4   ELSE    0
 *   16    25 -    24 =  1   1_diff   13   3_diff    4   ELSE    0
 *   17    28 -    25 =  3   1_diff   13   3_diff    5   ELSE    0
 *   18    31 -    28 =  3   1_diff   13   3_diff    6   ELSE    0
 *   19    32 -    31 =  1   1_diff   14   3_diff    6   ELSE    0
 *   20    33 -    32 =  1   1_diff   15   3_diff    6   ELSE    0
 *   21    34 -    33 =  1   1_diff   16   3_diff    6   ELSE    0
 *   22    35 -    34 =  1   1_diff   17   3_diff    6   ELSE    0
 *   23    38 -    35 =  3   1_diff   17   3_diff    7   ELSE    0
 *   24    39 -    38 =  1   1_diff   18   3_diff    7   ELSE    0
 *   25    42 -    39 =  3   1_diff   18   3_diff    8   ELSE    0
 *   26    45 -    42 =  3   1_diff   18   3_diff    9   ELSE    0
 *   27    46 -    45 =  1   1_diff   19   3_diff    9   ELSE    0
 *   28    47 -    46 =  1   1_diff   20   3_diff    9   ELSE    0
 *   29    48 -    47 =  1   1_diff   21   3_diff    9   ELSE    0
 *   30    49 -    48 =  1   1_diff   22   3_diff    9   ELSE    0
 *   31    52 -    49 =  3   1_diff   22   3_diff   10   ELSE    0
 * 
 * adapter_max            =  49
 * device_joltage_rating  =  52
 * 
 * diff_1_count       22
 * diff_3_count       10
 * diff_else_count     0
 * 
 * Result Part 1 = 220
 * Result Part 2 = 0
 * 
 * ----------------------------------------------------------------------------
 * 
 * adapter_max            = 172
 * device_joltage_rating  = 175
 * 
 * diff_1_count       70
 * diff_3_count       35
 * diff_else_count     0
 * 
 * Result Part 1 = 2450
 * Result Part 2 = 0
 * 
 * 
 */

const MAX_JOLTAGE_PLUS : number = 3;

const CHARGING_OUTLET_JOLTAGE_RATING : number = 0;

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function padL( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadLeft )
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let adapter_vector : number[] = [ CHARGING_OUTLET_JOLTAGE_RATING ];

    let adapter_max    : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        /*
         * Creating a number from the current input string 
         */
        let new_number : number =  parseInt( cur_input_str, 10 );

        adapter_vector.push( new_number );

        adapter_max = Math.max( adapter_max, new_number );
    }

    adapter_vector.push( adapter_max + MAX_JOLTAGE_PLUS );

    adapter_vector.sort( ( a, b ) => a - b );

    let device_joltage_rating : number = adapter_max + MAX_JOLTAGE_PLUS;

    if ( pKnzDebug )
    {
        wl( "" );

        console.log( adapter_vector );

        wl( "" );
    } 

    let diff_1_count    : number = 0;
    let diff_3_count    : number = 0;
    let diff_else_count : number = 0;

    for ( let adapter_idx : number = 0; adapter_idx < ( adapter_vector.length - 1); adapter_idx++ )
    {
        let diff_x : number = adapter_vector[ adapter_idx + 1 ]! - adapter_vector[ adapter_idx ]!;

        if ( diff_x === 1 )
        {
            diff_1_count++;
        }
        else if ( diff_x === 3 )
        {
            diff_3_count++;
        }
        else
        {
            diff_else_count++;
        }

        if ( pKnzDebug )
        {
           wl( padL( adapter_idx, 4 ) + " " + padL( ( adapter_vector[ adapter_idx + 1 ] ?? device_joltage_rating ), 5 ) + " - " + padL( adapter_vector[ adapter_idx ]!, 5 ) + " = " + padL( diff_x, 2 ) + "   1_diff " + padL( diff_1_count, 4 ) + "   3_diff " + padL( diff_3_count, 4 ) + "   ELSE " + padL( diff_else_count, 4 ) + " ")
        }
    }

    result_part_01 = diff_1_count * diff_3_count;

    wl( "" );
    wl( "adapter_max            = " + padL( adapter_max, 3 ) );
    wl( "device_joltage_rating  = " + padL( device_joltage_rating, 3 ) );
    wl( "" );
    wl( "diff_1_count    " +  padL( diff_1_count , 5 ) );
    wl( "diff_3_count    " +  padL( diff_3_count , 5 ) );
    wl( "diff_else_count " +  padL( diff_else_count , 5 ) );
    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day10_input.txt";

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

    array_test.push(  "1" );
    
    array_test.push(  "4" ); // + 3
    
    array_test.push(  "5" ); // + 1

    array_test.push(  "6" ); // + 1

    array_test.push(  "7" ); // + 1

    array_test.push( "10" ); // + 3

    array_test.push( "11" ); // + 1

    array_test.push( "12" ); // + 1

    array_test.push( "15" ); // + 3

    array_test.push( "16" ); // + 1

    array_test.push( "19" ); // + 3

    // 22 = + 3

    return array_test;
}


function getTestArray2() : string[] 
{
    const array_test: string[] = [];

    array_test.push(  "1" );
    array_test.push(  "2" );
    array_test.push(  "3" );
    array_test.push(  "4" );
    array_test.push(  "7" );
    array_test.push(  "8" );
    array_test.push(  "9" );
    array_test.push( "10" );
    array_test.push( "11" );
    array_test.push( "14" );
    array_test.push( "17" );
    array_test.push( "18" );
    array_test.push( "19" );
    array_test.push( "20" );
    array_test.push( "23" );
    array_test.push( "24" );
    array_test.push( "25" );
    array_test.push( "28" );
    array_test.push( "31" );
    array_test.push( "32" );
    array_test.push( "33" );
    array_test.push( "34" );
    array_test.push( "35" );
    array_test.push( "38" );
    array_test.push( "39" );
    array_test.push( "42" );
    array_test.push( "45" );
    array_test.push( "46" );
    array_test.push( "47" );
    array_test.push( "48" );
    array_test.push( "49" );

    return array_test;
}


wl( "" );
wl( "Day 10 - Adapter Array" );
wl( "" );

calcArray( getTestArray1(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

calcArray( getTestArray2(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

checkReaddatei();

wl( "" )
wl( "Day 10 - End " );
