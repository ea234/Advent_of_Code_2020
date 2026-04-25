import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/1
 * 
 * https://www.reddit.com/r/adventofcode/comments/k4e4lm/2020_day_1_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day01/day_01__Report_Repair.js
 * 
 * Day 01 - Report Repair
 * 
 * Part 1: number_1 1721
 * Part 1: number_2 299
 * 
 * Part 2: number_1 979
 * Part 2: number_2 675
 * Part 3: number_3 366
 * 
 * Result Part 1 = 514579
 * Result Part 2 = 241861950
 * 
 * ----------------------------------------------
 * 
 * Part 1: number_1 1018
 * Part 1: number_2 1002
 * 
 * Part 2: number_1 855
 * Part 2: number_2 643
 * Part 3: number_3 522
 * 
 * Result Part 1 = 1020036
 * Result Part 2 = 286977330
 * 
 */

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}

type ResultNumbers = { number_1 : number, number_2 : number }


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
                    return { number_1 : number_1, number_2 : number_2 };
                }
            }

        }
    }

    return { number_1 : 0, number_2 : 0 }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Creating Vektor
     * *******************************************************************************************************
     */
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let expense_vektor : number[] = [];

    for ( const cur_input_str of pArray ) 
    {
        let cur_expense : number = parseInt( cur_input_str );

        expense_vektor.push( cur_expense );
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 01
     * *******************************************************************************************************
     */

    expense_vektor.sort( ( a, b ) => ( a - b ) );

    let find_result : ResultNumbers = findTwoNumbers( expense_vektor, 2020, -1 )

    wl( "" );
    wl( "Part 1: number_1 " + find_result.number_1 );
    wl( "Part 1: number_2 " + find_result.number_2 );

    result_part_01 = find_result.number_1 * find_result.number_2;

    /*
     * *******************************************************************************************************
     * Calculating Part 02
     * *******************************************************************************************************
     */

    const number_target : number = 2020;

    for ( let idx = expense_vektor.length - 1; idx > 0; idx-- )
    {
        let number_1 : number = expense_vektor[ idx ]!;

        let target_number = number_target - number_1;

        if ( number_1 !== target_number )
        {
            let find_result : ResultNumbers = findTwoNumbers( expense_vektor, target_number, idx )

            if ( find_result.number_1 + find_result.number_2 === target_number )
            {
                wl( "" );
                wl( "Part 2: number_1 " + number_1             );
                wl( "Part 2: number_2 " + find_result.number_1 );
                wl( "Part 3: number_3 " + find_result.number_2 );

                result_part_02 = number_1 * find_result.number_1 * find_result.number_2;

                break;
            }
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day01_input.txt";

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

        calcArray( arrFromFile, true );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "1721" );
    array_test.push( "979"  );
    array_test.push( "366"  );
    array_test.push( "299"  );
    array_test.push( "675"  );
    array_test.push( "1456" );

    return array_test;
}


wl( "" );
wl( "Day 01 - Report Repair" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 01 - End " );