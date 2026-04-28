import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/6
 * 
 * https://www.reddit.com/r/adventofcode/comments/k7ndux/2020_day_06_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day06/day_06__Custom_Costums.js
 * 
 * Day 06 - Custom Customs
 * 
 * ----------------------------------------
 * Group Size 1 - Answers 3
 * 
 * {a: 1, b: 1, c: 1}
 * 
 * Value a Count 1    1
 * Value b Count 1    2
 * Value c Count 1    3
 * 
 * ----------------------------------------
 * Group Size 3 - Answers 3
 * 
 * {a: 1, b: 1, c: 1}
 * 
 * Value a Count 1    3
 * Value b Count 1    3
 * Value c Count 1    3
 * 
 * ----------------------------------------
 * Group Size 2 - Answers 3
 * 
 * {a: 2, b: 1, c: 1}
 * 
 * Value a Count 2    4
 * Value b Count 1    4
 * Value c Count 1    4
 * 
 * ----------------------------------------
 * Group Size 4 - Answers 1
 * 
 * {a: 4}
 * 
 * Value a Count 4    5
 * 
 * ----------------------------------------
 * Group Size 1 - Answers 1
 * 
 * {b: 1}
 * 
 * Value b Count 1 OK 6
 * 
 * Result Part 1 = 11
 * Result Part 2 = 6
 * 
 * ----------------------------------------------------
 * 
 * Result Part 1 = 6504
 * Result Part 2 = 3351
 * 
 */

type PropertieNumber = Record< string, number >;

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let group_size     : number = 0;
    let group_answers  : PropertieNumber = {};

    pArray.push( "" );

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str === "" )
        {
            const count_answers_yes = Object.keys( group_answers ).length;
            
            if ( pKnzDebug )
            {
                wl( "" );
                wl( "----------------------------------------" );
                wl( "Group Size " + group_size + " - Answers " + count_answers_yes );
                wl( "" );
                console.log( group_answers );
                wl( "" );
            }

            result_part_01 += count_answers_yes;

            for ( const key of Object.keys( group_answers ) ) 
            { 
                const value = group_answers[ key ]; 

                if ( value === group_size )
                {
                    result_part_02++;
                }

                if ( pKnzDebug )
                {
                   wl( "Value " + key + " Count " + value + " "  + ( ( value === count_answers_yes ) ? "OK" : "  " ) + " " + result_part_02 );
                }
            }

            group_size  = 0;
            group_answers = {};
        }
        else 
        {
            group_size++;

            for ( const cur_char of cur_input_str )
            {
                group_answers[ cur_char ] = ( group_answers[ cur_char ] ?? 0 ) + 1
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
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day06_input.txt";

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

    array_test.push( "abc" );
    array_test.push( ""    );
    array_test.push( "a"   );
    array_test.push( "b"   );
    array_test.push( "c"   );
    array_test.push( ""    );
    array_test.push( "ab"  );
    array_test.push( "ac"  );
    array_test.push( ""    );
    array_test.push( "a"   );
    array_test.push( "a"   );
    array_test.push( "a"   );
    array_test.push( "a"   );
    array_test.push( ""    );
    array_test.push( "b"   );

    return array_test;
}


wl( "" );
wl( "Day 06 - Custom Customs" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 06 - End " );
