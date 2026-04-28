import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/78
 * 
 * https://www.reddit.com/r/adventofcode/comments/k8xw8h/2020_day_08_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day08/day_08__Handheld_Halting.js
 * 
 * Day 08 - Handheld Halting
 * 
 * Step     0 instruction_name n  instruction_val    0  Accumulator      0
 * Step     1 instruction_name a  instruction_val    1  Accumulator      0
 * Step     2 instruction_name j  instruction_val    4  Accumulator      1
 * Step     3 instruction_name a  instruction_val    1  Accumulator      1
 * Step     4 instruction_name j  instruction_val   -4  Accumulator      2
 * Step     5 instruction_name a  instruction_val    3  Accumulator      2
 * Step     6 instruction_name j  instruction_val   -3  Accumulator      5
 * Step     7 instruction_name a  instruction_val    1  Accumulator      5
 * 
 * Result Part 1 = 5
 * Result Part 2 = 0
 * 
 * Day 08 - End
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


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01  : number = 0;
    let result_part_02  : number = 0;

    let pgm_pointer     : number = 0;

    let step_counter    : number = 0;

    let accumulator_val : number = 0;

    let count_exc       : number[] = [];

    while ( ( step_counter < 32000 ) && ( pgm_pointer < pArray.length ) )
    {
        let instruction_name : string = pArray[ pgm_pointer ]!.charAt( 0 );

        let instruction_val  : number = parseInt( pArray[ pgm_pointer ]!.substring( 3 ) );

        if ( pKnzDebug )
        {
            wl( "Step " + padL( step_counter, 5 ) + " instruction_name " + instruction_name + "  instruction_val " + padL( instruction_val, 4 ) + "  Accumulator " + padL( accumulator_val, 6 ) );
        }

        count_exc[ pgm_pointer ] = ( count_exc[ pgm_pointer ] ?? 0 ) + 1;

        if ( count_exc[ pgm_pointer ] === 2 ) break;

        switch ( instruction_name )
        {
            case "n" : pgm_pointer++;                                     break;
            case "a" : pgm_pointer++; accumulator_val += instruction_val; break;
            case "j" : pgm_pointer += instruction_val;                    break;
        }

        step_counter++;
    }

    result_part_01 = accumulator_val;

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day08_input.txt";

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

    array_test.push( "nop +0"  );
    array_test.push( "acc +1"  );
    array_test.push( "jmp +4"  );
    array_test.push( "acc +3"  );
    array_test.push( "jmp -3"  );
    array_test.push( "acc -99" );
    array_test.push( "acc +1"  );
    array_test.push( "jmp -4"  );
    array_test.push( "acc +6"  );

    return array_test;
}


wl( "" );
wl( "Day 08 - Handheld Halting" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 08 - End " );
