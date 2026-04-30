import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/13
 * 
 * https://www.reddit.com/r/adventofcode/comments/kc4njx/2020_day_13_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day13/day_13__Shuttle_Search.js
 * 
 * Day 13 - Shuttle Search
 * 
 * Timestamp    939  Bus Route      7 Multiplicant    135  Departing    945  Waiting    6
 * Timestamp    939  Bus Route     13 Multiplicant     73  Departing    949  Waiting   10
 * Timestamp    939  Bus Route     59 Multiplicant     16  Departing    944  Waiting    5
 * Timestamp    939  Bus Route     31 Multiplicant     31  Departing    961  Waiting   22
 * Timestamp    939  Bus Route     19 Multiplicant     50  Departing    950  Waiting   11
 * 
 * Result Part 1 = 295
 * Result Part 2 = 0
 * 
 * ---------------------------------------------------------------
 * 
 * Timestamp 1002576  Bus Route     13 Multiplicant  77122  Departing 1002586  Waiting   10
 * Timestamp 1002576  Bus Route     37 Multiplicant  27097  Departing 1002589  Waiting   13
 * Timestamp 1002576  Bus Route    449 Multiplicant   2233  Departing 1002617  Waiting   41
 * Timestamp 1002576  Bus Route     29 Multiplicant  34572  Departing 1002588  Waiting   12
 * Timestamp 1002576  Bus Route     19 Multiplicant  52768  Departing 1002592  Waiting   16
 * Timestamp 1002576  Bus Route     23 Multiplicant  43591  Departing 1002593  Waiting   17
 * Timestamp 1002576  Bus Route    773 Multiplicant   1297  Departing 1002581  Waiting    5
 * Timestamp 1002576  Bus Route     41 Multiplicant  24454  Departing 1002614  Waiting   38
 * Timestamp 1002576  Bus Route     17 Multiplicant  58976  Departing 1002592  Waiting   16
 * 
 * Result Part 1 = 3865
 * Result Part 2 = 0
 * 
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

    let waiting_min    : number = Number.MAX_SAFE_INTEGER;

    let bus_route_min  : number = 0;

    let time_stamp     : number = parseInt( pArray[ 0 ]!, 10 );

    let bus_routes     : number[] = pArray[ 1 ]!.replaceAll( "x,", "" ).split( "," ).map( Number );

    for ( const bus_route of bus_routes ) 
    {
        let multiplicant   : number = Math.floor( time_stamp / bus_route ) + 1;

        let departing_time : number = multiplicant * bus_route;

        let waiting_time   : number = departing_time - time_stamp;

        if ( waiting_time < waiting_min )
        {
            waiting_min = waiting_time;

            bus_route_min = bus_route;
        }

        if ( pKnzDebug )
        {
            wl( "Timestamp " + padL( time_stamp, 6 ) + "  Bus Route " + padL( bus_route, 6 ) + " Multiplicant " + padL( multiplicant, 6 ) + "  Departing " + padL( departing_time, 6 )  + "  Waiting " + padL( waiting_time, 4 ));
        }
    }

    result_part_01 = bus_route_min * waiting_min;

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day13_input.txt";

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

    array_test.push( "939" );
    array_test.push( "7,13,x,x,59,x,31,19"  );

    return array_test;
}


wl( "" );
wl( "Day 13 - Shuttle Search" );
wl( "" );

calcArray( getTestArray1(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

checkReaddatei();

wl( "" )
wl( "Day 13 - End " );
