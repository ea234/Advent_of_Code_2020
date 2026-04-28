import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/5
 * 
 * https://www.reddit.com/r/adventofcode/comments/k71h6r/2020_day_05_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day05/day_05__Binary_Boarding.js
 * 
 * Day 5 - Binary Boarding
 * 
 * BFFBFBFRLL  Row 1001010 =  74 - Column 100 = 4 - Seat ID =   596
 * BFFBFBFLRR  Row 1001010 =  74 - Column 011 = 3 - Seat ID =   595
 * BFFBFBFRRL  Row 1001010 =  74 - Column 110 = 6 - Seat ID =   598
 * BFFBFBFRRR  Row 1001010 =  74 - Column 111 = 7 - Seat ID =   599
 * BFFBFBFLRL  Row 1001010 =  74 - Column 010 = 2 - Seat ID =   594
 * BFFBFBFLLR  Row 1001010 =  74 - Column 001 = 1 - Seat ID =   593
 * BFFBFBFRLR  Row 1001010 =  74 - Column 101 = 5 - Seat ID =   597
 * 
 * Row   3 - Column 2 - Seat ID =    26
 * Row  74 - Column 0 - Seat ID =   592
 * Row 120 - Column 4 - Seat ID =   964
 * Row 127 - Column 7 - Seat ID =  1023
 * 
 * Result Part 1 = 963
 * Result Part 2 = 0
 * 
 *   1  ........
 *   2  ........
 *   3  ...#####
 *   4  ########
 *   5  ########
 *  71  ########
 *  72  ########
 *  73  ########
 *  74  .#######
 *  75  ########
 *  76  ########
 *  77  ########
 *  78  ########
 * 118  ########
 * 119  ########
 * 120  ####....
 * 121  ........
 * 122  ........
 * 123  ........
 * 124  ........
 * 125  ........
 * 126  ........
 * 127  ........
 * 
 */

type PropertieMap = Record< string, string >;

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

    let seat_plan : PropertieMap = {};

    /*
     * *******************************************************************************************************
     * Calculating Part 1 - Filling the seat plan.
     * *******************************************************************************************************
     */

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str !== "" )
        {
            let row_string    : string = cur_input_str.substring( 0, 7 ).replaceAll( "F", "0" ).replaceAll( "B", "1" );

            let row_value     : number = parseInt( row_string, 2 );

            let column_string : string = cur_input_str.substring( 7 ).replaceAll( "L", "0" ).replaceAll( "R", "1" );

            let column_value  : number = parseInt( column_string, 2 );

            let seat_id       : number = ( row_value * 8 ) + column_value;

            seat_plan[ "R" + row_value + "C" + column_value ] = "#";
            
            if ( row_value == 74 )
            {
                wl( cur_input_str + "  Row " + row_string + " = " + padL( row_value, 3 ) + " - Column " + column_string + " = " + column_value + " - Seat ID = " + padL( seat_id, 5 ) );
            }

            if ( pKnzDebug )
            {
                wl( "Row " + row_string + " = " + padL( row_value, 3 ) + " - Column " + column_string + " = " + column_value + " - Seat ID = " + padL( seat_id, 5 ) );
            }

            if ( seat_id > result_part_01 )
            {
                result_part_01 = seat_id;
            }
        }
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 2 - Calulating the seat id for every unused seat.
     * *******************************************************************************************************
     */

    let debug_seat_plan : string = "";

    for ( let cur_row = 1; cur_row < 128; cur_row++ )
    {
        debug_seat_plan += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = 0; cur_col < 8; cur_col++ )
        {
            debug_seat_plan += seat_plan[ "R" + cur_row  + "C" + cur_col ] ?? ".";

            if ( ( seat_plan[ "R" + cur_row  + "C" + cur_col ] ?? "." ) === "." )
            {
                let seat_id : number = ( cur_row * 8 ) + cur_col;

                wl( "Row " + padL( cur_row, 3 ) + " - Column " + cur_col + " - Seat ID = " + padL( seat_id, 5 )  );
            }
        }

        debug_seat_plan += "\n";
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
    wl( debug_seat_plan );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day05_input.txt";

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

    array_test.push( "BFFFBBFRRR" );
    array_test.push( "FFFBBBFRRR" );
    array_test.push( "BBFFBBFRLL" );

    return array_test;
}


wl( "" );
wl( "Day 5 - Binary Boarding" );
wl( "" );

//calcArray( getTestArray1(), true );

checkReaddatei();

wl( "" )
wl( "Day 05 - End " );

