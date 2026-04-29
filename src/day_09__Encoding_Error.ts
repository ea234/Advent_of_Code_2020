import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/9
 * 
 * https://www.reddit.com/r/adventofcode/comments/k9lfwj/2020_day_09_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day09/day_09__Encoding_Error.js
 * 
 * Day 09 - Encoding Error
 * 
 * PRE     1    35
 * PRE     2    20
 * PRE     3    15
 * PRE     4    25
 * PRE     5    47
 * ADD     6    40 OK =    25 +    15
 * ADD     7    62 OK =    47 +    15
 * ADD     8    55 OK =    15 +    40
 * ADD     9    65 OK =    25 +    40
 * ADD    10    95 OK =    55 +    40
 * ADD    11   102 OK =    62 +    40
 * ADD    12   117 OK =    55 +    62
 * ADD    13   150 OK =    95 +    55
 * ADD    14   182 OK =    65 +   117
 * RES    15   127 #### ERROR ####
 * 
 * (5) [102, 117, 150, 182, 95]
 * 
 * Find Number -------------------------------------------
 * Target Number   127
 * Min Value        15
 * Max Value        47
 * Sum Min + Max    62
 * Index From        2 To     5
 * 
 * (4) [15, 25, 47, 40]
 * 
 * Result Part 1 = 127
 * Result Part 2 = 62
 * 
 * ---------------------------------------------------------------------------------------
 * 
 * RES   505 14144619 #### ERROR ####
 * 
 * (25) [18626976, 17672716, 17703820, 17851962, 8855488, 9630524, 9003630, 12526739, 9623346, 11116867, 10294294, 9917096, 16907445, 14012323, 13726510, 12320741, 14582666, 15546077, 13878755, 15514973, 15776526, 18889622, 22157263, 17315646, 17784570]
 * 
 * Find Number -------------------------------------------
 * Target Number 14144619
 * Min Value     614133
 * Max Value     1152264
 * Sum Min + Max 1766397
 * Index From      390 To   406
 * 
 * (17) [614133, 671167, 649148, 621311, 763293, 630866, 998283, 697663, 638044, 878157, 742375, 940426, 1152264, 1041497, 943710, 1013677, 1148605]
 * 
 * Result Part 1 = 14144619
 * Result Part 2 = 1766397
 * 
 * 
 */

type ResultNumbers = { knz_ok : boolean, number_1 : number, number_2 : number };

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


function findTwoNumbers( pVector : number[], pTargetNumber : number ) : ResultNumbers
{
    /*
     * Copied from day 01, and modified:
     * https://github.com/ea234/Advent_of_Code_2020/blob/main/src/day_01__Report_Repair.ts#L46
     */

    for ( let index_nr_1 = pVector.length - 1; index_nr_1 > 0; index_nr_1-- )
    {
        let number_1 : number = pVector[ index_nr_1 ]!;

        let number_2 : number = pTargetNumber - number_1;

        if ( number_2 > 0 )
        {
            if ( pVector.includes( number_2 ) )
            {
                return { knz_ok : true, number_1 : number_1, number_2 : number_2 };
            }
        }
    }

    return { knz_ok : false, number_1 : 0, number_2 : 0 }
}


function findNumber( pVector : number[], pTargetNumber : number ) : number
{
    for ( let index_nr_1 : number = 0; index_nr_1 < pVector.length; index_nr_1++ )
    {
        let sum_loop : number = 0;

        let min_val : number = Number.MAX_SAFE_INTEGER;
        let max_val : number = -1;
        
        for ( let index_nr_2 : number = index_nr_1; index_nr_2 < pVector.length; index_nr_2++ )
        {
            min_val = Math.min( min_val, pVector[ index_nr_2 ]! );

            max_val = Math.max( max_val, pVector[ index_nr_2 ]! );
            
            sum_loop += pVector[ index_nr_2 ]!;

            if ( sum_loop === pTargetNumber )
            {
                wl( "" );
                wl( "Find Number -------------------------------------------" );
                wl( "Target Number " + padL( pTargetNumber, 5 ) );
                wl( "Min Value     " + padL( min_val, 5 ) );
                wl( "Max Value     " + padL( max_val, 5 ) );
                wl( "Sum Min + Max " + padL( ( min_val + max_val ), 5 ) );
                wl( "Index From    " + padL( index_nr_1, 5 )  + " To " +  padL( index_nr_2, 5 ) );
                wl( "" );

                console.log( pVector.slice( index_nr_1, index_nr_2 + 1 ) );
                
                wl( "" );

                return min_val + max_val;
            }
        }
    }

    return -1;
}


function calcArray( pArray : string[], pPreambleSize : number, pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let fifo_mem       : number[] = [];
    let all_numbers    : number[] = [];

    let step_counter   : number = 0;
    let index_add      : number = -1;

    for ( const cur_input_str of pArray ) 
    {
        /*
         * Creating a number from the current input string 
         */
        let new_number : number =  parseInt( cur_input_str, 10 );

        /*
         * Increasing the step counter for the preamble numbers 
         */
        step_counter++;
 
        if ( step_counter <= pPreambleSize )
        {
            /*
             * In the preamble period, all numbers are pushed to the vector
             */
            fifo_mem.push( new_number );

            all_numbers.push( new_number );

            if ( pKnzDebug )
            {
                wl( "PRE " + padL( step_counter, 5 ) + " " + padL( new_number, 5 ) );
            }
        }
        else 
        {
            /*
             * Increase the index where the new number is stored in the fifo vector
             */
            index_add++;

            /*
             * If the add-index reaches the preamble size, the add-index is set to 0.
             */
            if ( index_add == pPreambleSize )
            {
                index_add = 0;
            }

            /*
             * Try to verify the number, by finding 2 numbers, that add up to the new number.
             */
            let result_find_2_numbers : ResultNumbers = findTwoNumbers( fifo_mem, new_number );

            if ( result_find_2_numbers.knz_ok )
            {
                /*
                 * If the number is verified, the number is stored in both vectors
                 */
                fifo_mem[ index_add ] = parseInt( cur_input_str, 10 );

                all_numbers.push( new_number );

                if ( pKnzDebug )
                {
                    wl( "ADD " + padL( step_counter, 5 ) + " " + padL( new_number, 5 ) + " OK = " + padL( result_find_2_numbers.number_1, 5 ) + " + " + padL( result_find_2_numbers.number_2, 5 ) );
                }
            }
            else
            {
                /*
                 * If the number is not veryfied, then ...
                 * ... the new number is the result-number for part 1
                 * ... for part 2, the findNumbers function is called
                 */
                wl( "RES " + padL( step_counter, 5 ) + " " + padL( new_number, 5 ) + " #### ERROR ####" );
                wl( "" );

                console.log( fifo_mem );
                
                wl( "" );

                result_part_01 = new_number;

                result_part_02 = findNumber( all_numbers, new_number );

                /*
                 * Finally a break, ends the loop
                 */
                break;
            }
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day09_input.txt";

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

        calcArray( arrFromFile, 25, false );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "35"  );
    array_test.push( "20"  );
    array_test.push( "15"  );
    array_test.push( "25"  );
    array_test.push( "47"  );
    array_test.push( "40"  );
    array_test.push( "62"  );
    array_test.push( "55"  );
    array_test.push( "65"  );
    array_test.push( "95"  );
    array_test.push( "102" );
    array_test.push( "117" );
    array_test.push( "150" );
    array_test.push( "182" );
    array_test.push( "127" );
    array_test.push( "219" );
    array_test.push( "299" );
    array_test.push( "277" );
    array_test.push( "309" );
    array_test.push( "576" );

    return array_test;
}


wl( "" );
wl( "Day 09 - Encoding Error" );
wl( "" );

calcArray( getTestArray1(), 5, true );

checkReaddatei();

wl( "" )
wl( "Day 09 - End " );
