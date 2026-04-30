import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/12
 * 
 * https://www.reddit.com/r/adventofcode/comments/kbj5me/2020_day_12_solutions/
 * 
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day12/day_12__Rain_Risk.js
 * 
 * Day 12 - Rain Risk
 * 
 * Instruction    F10  Facing E  x   10  y    0
 * Instruction     N3  Facing E  x   10  y    3
 * Instruction     F7  Facing E  x   17  y    3
 * Instruction    R90  Facing S  x   17  y    3
 * Instruction    F11  Facing S  x   17  y   -8
 * 
 * Result Part 1 = 25
 * Result Part 2 = 0
 * 
 * ---------------------------------------------------------------
 * 
 * Result Part 1 = 820
 * Result Part 2 = 0
 * 
 */
const ACTION_MOVE_NORTH   : string = "N";
const ACTION_MOVE_SOUTH   : string = "S";
const ACTION_MOVE_EAST    : string = "E";
const ACTION_MOVE_WEST    : string = "W";
const ACTION_TURN_LEFT    : string = "L";
const ACTION_TURN_RIGHT   : string = "R";
const ACTION_MOVE_FORWARD : string = "F";

const FACING_NORTH        : string = "N";
const FACING_SOUTH        : string = "S";
const FACING_EAST         : string = "E";
const FACING_WEST         : string = "W";

type ShipCoords = { facing : string, cur_x : number, cur_y : number }


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


function getNewFacing90( pCurFacing : string, pTurnDirection : string ) : string 
{
    if ( pTurnDirection === ACTION_TURN_LEFT )
    {
        if ( pCurFacing === FACING_NORTH ) return FACING_WEST;
        if ( pCurFacing === FACING_WEST  ) return FACING_SOUTH;
        if ( pCurFacing === FACING_SOUTH ) return FACING_EAST;
        //if ( pCurFacing === FACING_EAST  ) return FACING_NORTH;
    }
    else if ( pTurnDirection === ACTION_TURN_RIGHT )
    {
        if ( pCurFacing === FACING_NORTH ) return FACING_EAST;
        if ( pCurFacing === FACING_EAST  ) return FACING_SOUTH;
        if ( pCurFacing === FACING_SOUTH ) return FACING_WEST;
        //if ( pCurFacing === FACING_WEST  ) return FACING_NORTH;
    }

    return FACING_NORTH;
}


function getNewFacing( pCurFacing : string, pTurnDirection : string, pDegrees : number ) : string 
{
    let new_facing : string = pCurFacing;

    if ( pDegrees >= 90  ) { new_facing = getNewFacing90( new_facing, pTurnDirection ); }
    if ( pDegrees >= 180 ) { new_facing = getNewFacing90( new_facing, pTurnDirection ); }
    if ( pDegrees >= 270 ) { new_facing = getNewFacing90( new_facing, pTurnDirection ); }

    return new_facing;
}


function shipForward( pShip : ShipCoords, pValue : number ) : void 
{
         if ( pShip.facing === FACING_EAST  ) { pShip.cur_x += pValue; }
    else if ( pShip.facing === FACING_WEST  ) { pShip.cur_x -= pValue; }
    else if ( pShip.facing === FACING_NORTH ) { pShip.cur_y += pValue; }
    else if ( pShip.facing === FACING_SOUTH ) { pShip.cur_y -= pValue; }
}


function shipToString( pShip : ShipCoords ) : string
{
    return "Facing " + pShip.facing + "  x " + padL( pShip.cur_x, 4 ) + "  y " + padL( pShip.cur_y, 4 );
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let ship : ShipCoords = { facing : FACING_EAST, cur_x : 0, cur_y : 0 }

    let cur_facing : string = FACING_EAST;

    for ( const cur_input_str of pArray ) 
    {
        let instruction_code : string = cur_input_str.charAt( 0 );

        let instruction_val  : number = parseInt( cur_input_str.substring( 1 ), 10 );

             if ( instruction_code === ACTION_MOVE_FORWARD ) { shipForward( ship, instruction_val ); }
        else if ( instruction_code === ACTION_MOVE_NORTH   ) { ship.cur_y += instruction_val;        }
        else if ( instruction_code === ACTION_MOVE_SOUTH   ) { ship.cur_y -= instruction_val;        }
        else if ( instruction_code === ACTION_MOVE_EAST    ) { ship.cur_x += instruction_val;        }
        else if ( instruction_code === ACTION_MOVE_WEST    ) { ship.cur_x -= instruction_val;        }
        else if ( instruction_code === ACTION_TURN_LEFT    ) { cur_facing = getNewFacing( cur_facing, instruction_code, instruction_val ); }
        else if ( instruction_code === ACTION_TURN_RIGHT   ) { cur_facing = getNewFacing( cur_facing, instruction_code, instruction_val ); }

        ship.facing = cur_facing;

        if ( pKnzDebug )
        {
            wl( "Instruction " + padL( cur_input_str, 6 ) + "  " + shipToString( ship ) );
        }
    }

    result_part_01 = Math.abs( ship.cur_x ) + Math.abs( ship.cur_y );

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day12_input.txt";

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

    array_test.push( "F10" );
    array_test.push( "N3"  );
    array_test.push( "F7"  );
    array_test.push( "R90" );
    array_test.push( "F11" );

    return array_test;
}


wl( "" );
wl( "Day 12 - Rain Risk" );
wl( "" );

calcArray( getTestArray1(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

checkReaddatei();

wl( "" )
wl( "Day 12 - End " );
