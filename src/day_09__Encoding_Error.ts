import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/9
 * 
 * https://www.reddit.com/r/adventofcode/comments/k9lfwj/2020_day_09_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day09/day_09__Encoding_Error.js
 * 
 * Day 09 - Encoding Error
 * 
 *     6    40 OK =    25 +    15
 *     7    62 OK =    47 +    15
 *     8    55 OK =    15 +    40
 *     9    65 OK =    25 +    40
 *    10    95 OK =    55 +    40
 *    11   102 OK =    62 +    40
 *    12   117 OK =    55 +    62
 *    13   150 OK =    95 +    55
 *    14   182 OK =    65 +   117
 *    15   127 #### ERROR ####
 * 
 * (5) [102, 117, 150, 182, 95]
 * 
 * Result Part 1 = 127
 * Result Part 2 = 0
 * 
 * --------------------------------------------------
 * 
 *   505 14144619 #### ERROR ####
 * 
 * (25) [18626976, 17672716, 17703820, 17851962, 8855488, 9630524, 9003630, 12526739, 9623346, 11116867, 10294294, 9917096, 16907445, 14012323, 13726510, 12320741, 14582666, 15546077, 13878755, 15514973, 15776526, 18889622, 22157263, 17315646, 17784570]
 * 
 * Result Part 1 = 14144619
 * Result Part 2 = 0
 * 
 */

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

type ResultNumbers = { knz_ok : boolean, number_1 : number, number_2 : number }

function findTwoNumbers( pVektor : number[], pTargetNumber : number, pExcludeIndex : number ) : ResultNumbers
{
    for ( let idx = pVektor.length - 1; idx > 0; idx-- )
    {
        if ( idx !== pExcludeIndex )
        {
            let number_1 : number = pVektor[ idx ]!;

            let number_2 : number = pTargetNumber - number_1;

            if ( ( number_2 > 0 ) && ( number_2 !== ( pVektor[ pExcludeIndex ] ?? -100 ) ) )
            {
                if ( pVektor.includes( number_2 ) )
                {
                    return { knz_ok : true, number_1 : number_1, number_2 : number_2 };
                }
            }

        }
    }

    return { knz_ok : false, number_1 : 0, number_2 : 0 }
}

function calcArray( pArray : string[], pPeambleSize : number, pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let fifo_mem       : number[] = [];

    let step_counter   : number = 0;
    let index_add      : number = -1;

    for ( const cur_input_str of pArray ) 
    {
        step_counter++;
 
        if ( step_counter <= pPeambleSize )
        {
            fifo_mem.push( parseInt( cur_input_str, 10 ) );
        }
        else 
        {
            index_add++;

            if ( index_add == pPeambleSize )
            {
                index_add = 0;
            }

            let new_number : number =  parseInt( cur_input_str, 10 );

            let res : ResultNumbers = findTwoNumbers( fifo_mem, new_number, -1 );

            if ( res.knz_ok )
            {
                fifo_mem[ index_add ] = parseInt( cur_input_str, 10 );

                if ( pKnzDebug )
                {
                    wl( padL( step_counter, 5 ) + " " + padL( new_number, 5 ) + " OK = " + padL( res.number_1, 5 ) + " + " + padL( res.number_2, 5 ) )
                }
            }
            else
            {
                wl( padL( step_counter, 5 ) + " " + padL( new_number, 5 ) + " #### ERROR ####" );
                wl( "" );
                console.log( fifo_mem );
                wl( "" );

                result_part_01 = new_number;

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

//checkReaddatei();

wl( "" )
wl( "Day 09 - End " );
