import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/18
 * 
 * https://www.reddit.com/r/adventofcode/comments/kfeldk/2020_day_18_solutions/
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
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;


    for ( const cur_input_str of pArray ) 
    {
        wl( cur_input_str );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day18_input.txt";

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

    array_test.push( "mem[8] = 0"   );

    return array_test;
}


function testCalcFunction( pInput : string, pExpect : number, pKnzDebug : boolean = false ) : void
{
    let number_from_function : number = -1; //calcFunction( pInput, pKnzDebug );

    wl( "" );
    wl( "Start-Numbers " + pInput + " = " + number_from_function + " => expected " + pExpect + "  " + ( number_from_function === pExpect ? "OK" : "#### ERROR ####" ) );
}


wl( "" );
wl( "Day 18 - Operation Order" );
wl( "" );


testCalcFunction( "2 * 3 + (4 * 5)                                 ",    26, true );
testCalcFunction( "5 + (8 * 3 + 9 + 3 * 4 * 3)                     ",   437, true );
testCalcFunction( "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))       ", 12240, true );
testCalcFunction( "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 ", 13632, true );

//calcArray( getTestArray1(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

//checkReaddatei();

wl( "" )
wl( "Day 18 - End " );
