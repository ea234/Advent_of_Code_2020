import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/11
 * 
 * https://www.reddit.com/r/adventofcode/comments/kaw6oz/2020_day_11_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day11/day_11__Seating_System.js
 * 
 * Day 11 - Seating System
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    0  change_count   71  Seats empty     71 occupied      0
 * 
 *      0123456789        0123456789
 *   0  L.LL.LL.LL     0  #.##.##.##
 *   1  LLLLLLL.LL     1  #######.##
 *   2  L.L.L..L..     2  #.#.#..#..
 *   3  LLLL.LL.LL     3  ####.##.##
 *   4  L.LL.LL.LL     4  #.##.##.##
 *   5  L.LLLLL.LL     5  #.#####.##
 *   6  ..L.L.....     6  ..#.#.....
 *   7  LLLLLLLLLL     7  ##########
 *   8  L.LLLLLL.L     8  #.######.#
 *   9  L.LLLLL.LL     9  #.#####.##
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    1  change_count   51  Seats empty      0 occupied     71
 * 
 *      0123456789        0123456789
 *   0  #.##.##.##     0  #.LL.L#.##
 *   1  #######.##     1  #LLLLLL.L#
 *   2  #.#.#..#..     2  L.L.L..L..
 *   3  ####.##.##     3  #LLL.LL.L#
 *   4  #.##.##.##     4  #.LL.LL.LL
 *   5  #.#####.##     5  #.LLLL#.##
 *   6  ..#.#.....     6  ..L.L.....
 *   7  ##########     7  #LLLLLLLL#
 *   8  #.######.#     8  #.LLLLLL.L
 *   9  #.#####.##     9  #.#LLLL.##
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    2  change_count   31  Seats empty     51 occupied     20
 * 
 *      0123456789        0123456789
 *   0  #.LL.L#.##     0  #.##.L#.##
 *   1  #LLLLLL.L#     1  #L###LL.L#
 *   2  L.L.L..L..     2  L.#.#..#..
 *   3  #LLL.LL.L#     3  #L##.##.L#
 *   4  #.LL.LL.LL     4  #.##.LL.LL
 *   5  #.LLLL#.##     5  #.###L#.##
 *   6  ..L.L.....     6  ..#.#.....
 *   7  #LLLLLLLL#     7  #L######L#
 *   8  #.LLLLLL.L     8  #.LL###L.L
 *   9  #.#LLLL.##     9  #.#L###.##
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    3  change_count   21  Seats empty     20 occupied     51
 * 
 *      0123456789        0123456789
 *   0  #.##.L#.##     0  #.#L.L#.##
 *   1  #L###LL.L#     1  #LLL#LL.L#
 *   2  L.#.#..#..     2  L.L.L..#..
 *   3  #L##.##.L#     3  #LLL.##.L#
 *   4  #.##.LL.LL     4  #.LL.LL.LL
 *   5  #.###L#.##     5  #.LL#L#.##
 *   6  ..#.#.....     6  ..L.L.....
 *   7  #L######L#     7  #L#LLLL#L#
 *   8  #.LL###L.L     8  #.LLLLLL.L
 *   9  #.#L###.##     9  #.#L#L#.##
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    4  change_count    7  Seats empty     41 occupied     30
 * 
 *      0123456789        0123456789
 *   0  #.#L.L#.##     0  #.#L.L#.##
 *   1  #LLL#LL.L#     1  #LLL#LL.L#
 *   2  L.L.L..#..     2  L.#.L..#..
 *   3  #LLL.##.L#     3  #L##.##.L#
 *   4  #.LL.LL.LL     4  #.#L.LL.LL
 *   5  #.LL#L#.##     5  #.#L#L#.##
 *   6  ..L.L.....     6  ..L.L.....
 *   7  #L#LLLL#L#     7  #L#L##L#L#
 *   8  #.LLLLLL.L     8  #.LLLLLL.L
 *   9  #.#L#L#.##     9  #.#L#L#.##
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    5  change_count    0  Seats empty     34 occupied     37
 * 
 *      0123456789        0123456789
 *   0  #.#L.L#.##     0  #.#L.L#.##
 *   1  #LLL#LL.L#     1  #LLL#LL.L#
 *   2  L.#.L..#..     2  L.#.L..#..
 *   3  #L##.##.L#     3  #L##.##.L#
 *   4  #.#L.LL.LL     4  #.#L.LL.LL
 *   5  #.#L#L#.##     5  #.#L#L#.##
 *   6  ..L.L.....     6  ..L.L.....
 *   7  #L#L##L#L#     7  #L#L##L#L#
 *   8  #.LLLLLL.L     8  #.LLLLLL.L
 *   9  #.#L#L#.##     9  #.#L#L#.##
 * 
 * Result Part 1 = 37
 * Result Part 2 = 0
 * 
 * ---------------------------------------------------------------------------
 * 
 * iteration_nr    0  change_count 7252  Seats empty   7252 occupied      0
 * iteration_nr    1  change_count 7120  Seats empty      0 occupied   7252
 * iteration_nr    2  change_count 6747  Seats empty   7120 occupied    132
 * iteration_nr    3  change_count 6587  Seats empty    373 occupied   6879
 * ...
 * iteration_nr  108  change_count   27  Seats empty   5013 occupied   2239
 * iteration_nr  109  change_count   24  Seats empty   4986 occupied   2266
 * iteration_nr  110  change_count   20  Seats empty   5010 occupied   2242
 * iteration_nr  111  change_count   17  Seats empty   4990 occupied   2262
 * iteration_nr  112  change_count   12  Seats empty   5007 occupied   2245
 * iteration_nr  113  change_count    9  Seats empty   4995 occupied   2257
 * iteration_nr  114  change_count    3  Seats empty   5004 occupied   2248
 * iteration_nr  115  change_count    0  Seats empty   5001 occupied   2251
 * 
 * Result Part 1 = 2251
 * Result Part 2 = 2019
 * 
 * ------------------ Part 2 --------------------------------------------------
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day11/day_11__Seating_System.js
 * 
 * Day 11 - Seating System
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    0  change_count   71  Seats empty     71 occupied      0
 * 
 *      0123456789        0123456789
 *   0  L.LL.LL.LL     0  #.##.##.##
 *   1  LLLLLLL.LL     1  #######.##
 *   2  L.L.L..L..     2  #.#.#..#..
 *   3  LLLL.LL.LL     3  ####.##.##
 *   4  L.LL.LL.LL     4  #.##.##.##
 *   5  L.LLLLL.LL     5  #.#####.##
 *   6  ..L.L.....     6  ..#.#.....
 *   7  LLLLLLLLLL     7  ##########
 *   8  L.LLLLLL.L     8  #.######.#
 *   9  L.LLLLL.LL     9  #.#####.##
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    1  change_count   64  Seats empty      0 occupied     71
 * 
 *      0123456789        0123456789
 *   0  #.##.##.##     0  #.LL.LL.L#
 *   1  #######.##     1  #LLLLLL.LL
 *   2  #.#.#..#..     2  L.L.L..L..
 *   3  ####.##.##     3  LLLL.LL.LL
 *   4  #.##.##.##     4  L.LL.LL.LL
 *   5  #.#####.##     5  L.LLLLL.LL
 *   6  ..#.#.....     6  ..L.L.....
 *   7  ##########     7  LLLLLLLLL#
 *   8  #.######.#     8  #.LLLLLL.L
 *   9  #.#####.##     9  #.LLLLL.L#
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    2  change_count   46  Seats empty     64 occupied      7
 * 
 *      0123456789        0123456789
 *   0  #.LL.LL.L#     0  #.L#.##.L#
 *   1  #LLLLLL.LL     1  #L#####.LL
 *   2  L.L.L..L..     2  L.#.#..#..
 *   3  LLLL.LL.LL     3  ##L#.##.##
 *   4  L.LL.LL.LL     4  #.##.#L.##
 *   5  L.LLLLL.LL     5  #.#####.#L
 *   6  ..L.L.....     6  ..#.#.....
 *   7  LLLLLLLLL#     7  LLL####LL#
 *   8  #.LLLLLL.L     8  #.L#####.L
 *   9  #.LLLLL.L#     9  #.L####.L#
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    3  change_count   35  Seats empty     18 occupied     53
 * 
 *      0123456789        0123456789
 *   0  #.L#.##.L#     0  #.L#.L#.L#
 *   1  #L#####.LL     1  #LLLLLL.LL
 *   2  L.#.#..#..     2  L.L.L..#..
 *   3  ##L#.##.##     3  ##LL.LL.L#
 *   4  #.##.#L.##     4  L.LL.LL.L#
 *   5  #.#####.#L     5  #.LLLLL.LL
 *   6  ..#.#.....     6  ..L.L.....
 *   7  LLL####LL#     7  LLLLLLLLL#
 *   8  #.L#####.L     8  #.LLLLL#.L
 *   9  #.L####.L#     9  #.L#LL#.L#
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    4  change_count   13  Seats empty     53 occupied     18
 * 
 *      0123456789        0123456789
 *   0  #.L#.L#.L#     0  #.L#.L#.L#
 *   1  #LLLLLL.LL     1  #LLLLLL.LL
 *   2  L.L.L..#..     2  L.L.L..#..
 *   3  ##LL.LL.L#     3  ##L#.#L.L#
 *   4  L.LL.LL.L#     4  L.L#.#L.L#
 *   5  #.LLLLL.LL     5  #.L####.LL
 *   6  ..L.L.....     6  ..#.#.....
 *   7  LLLLLLLLL#     7  LLL###LLL#
 *   8  #.LLLLL#.L     8  #.LLLLL#.L
 *   9  #.L#LL#.L#     9  #.L#LL#.L#
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    5  change_count    5  Seats empty     40 occupied     31
 * 
 *      0123456789        0123456789
 *   0  #.L#.L#.L#     0  #.L#.L#.L#
 *   1  #LLLLLL.LL     1  #LLLLLL.LL
 *   2  L.L.L..#..     2  L.L.L..#..
 *   3  ##L#.#L.L#     3  ##L#.#L.L#
 *   4  L.L#.#L.L#     4  L.L#.LL.L#
 *   5  #.L####.LL     5  #.LLLL#.LL
 *   6  ..#.#.....     6  ..#.L.....
 *   7  LLL###LLL#     7  LLL###LLL#
 *   8  #.LLLLL#.L     8  #.LLLLL#.L
 *   9  #.L#LL#.L#     9  #.L#LL#.L#
 * 
 * -----------------------------------------------------------------------------
 * iteration_nr    6  change_count    0  Seats empty     45 occupied     26
 * 
 *      0123456789        0123456789
 *   0  #.L#.L#.L#     0  #.L#.L#.L#
 *   1  #LLLLLL.LL     1  #LLLLLL.LL
 *   2  L.L.L..#..     2  L.L.L..#..
 *   3  ##L#.#L.L#     3  ##L#.#L.L#
 *   4  L.L#.LL.L#     4  L.L#.LL.L#
 *   5  #.LLLL#.LL     5  #.LLLL#.LL
 *   6  ..#.L.....     6  ..#.L.....
 *   7  LLL###LLL#     7  LLL###LLL#
 *   8  #.LLLLL#.L     8  #.LLLLL#.L
 *   9  #.L#LL#.L#     9  #.L#LL#.L#
 * 
 * Result Part 2 = 26
 * 
 * Day 11 - End
 * 
 */

type SeatCount = { floor : number, empty : number, occupied : number, not_grid : number };

type PropertieMap = Record< string, string >;

const STR_COMBINE_SPACER     : string = "   "; 

const PREFIX_MAP_1           : string = "M1_";
const PREFIX_MAP_2           : string = "M2_";

const CHAR_NOT_MAP           : string = "X";
const CHAR_MAP_FLOOR         : string = ".";
const CHAR_MAP_EMPTY_SEAT    : string = "L";
const CHAR_MAP_OCCUPIED_SEAT : string = "#";


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


function combineStrings( pString1: string | undefined | null, pString2: string | undefined | null) : string 
{
    const lines1 = ( pString1 != null ? pString1.split(/\r?\n/) : [] );
    const lines2 = ( pString2 != null ? pString2.split(/\r?\n/) : [] );

    const max_lines = Math.max( lines1.length, lines2.length );

    let result : string[] = [];

    for ( let line_index = 0; line_index < max_lines; line_index++ ) 
    {
        const str_a = line_index < lines1.length ? lines1[ line_index ] : "";
        const str_b = line_index < lines2.length ? lines2[ line_index ] : "";

        result.push( str_a + STR_COMBINE_SPACER + str_b );
    }

    return result.join("\n");
}


function getDebugMap( pMapInput : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number, pPrefix : string ) : string 
{
    let str_result : string = "";

    str_result += padL( " ", 3 ) + "  ";

    for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
    {
        str_result += Math.abs( cur_col ) % 10;
    }

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        str_result += "\n";
        str_result += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pMapInput[ pPrefix + "R" + cur_row  + "C" + cur_col ] ?? " ";
        }
    }

    return str_result;
}


function countTiles( pMapInput : PropertieMap, pMaxRows : number, pMaxCols : number, pTile : string, pPrefix : string ) : number
{
    let count_tile : number = 0;

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            if ( ( pMapInput[ pPrefix + "R" + cur_row  + "C" + cur_col  ] ?? CHAR_MAP_FLOOR ) == pTile )
            {
                count_tile++;
            }
        }
    }

    return count_tile;
}


function addToSeatCount( pMapInput : PropertieMap, pKey : string, pSeatCount : SeatCount ) : void 
{
    let map_tile : string =  pMapInput[ pKey ] ?? CHAR_NOT_MAP;

         if ( map_tile === CHAR_MAP_EMPTY_SEAT    ) { pSeatCount.empty++;    }
    else if ( map_tile === CHAR_MAP_OCCUPIED_SEAT ) { pSeatCount.occupied++; }
    else if ( map_tile === CHAR_MAP_FLOOR         ) { pSeatCount.floor++;    }
    else if ( map_tile === CHAR_NOT_MAP           ) { pSeatCount.not_grid++; }
}


function getSeatCountPart1( pMapInput : PropertieMap, pRow : number, pCol : number, pPrefix : string ) : SeatCount 
{
    let result_seat_count : SeatCount = { floor : 0, empty : 0, occupied : 0, not_grid : 0 };

    addToSeatCount( pMapInput, pPrefix + "R" + pRow + "C" + ( pCol - 1 ), result_seat_count );
    addToSeatCount( pMapInput, pPrefix + "R" + pRow + "C" + ( pCol + 1 ), result_seat_count );

    addToSeatCount( pMapInput, pPrefix + "R" + ( pRow-1 ) + "C" + ( pCol - 1 ), result_seat_count );
    addToSeatCount( pMapInput, pPrefix + "R" + ( pRow-1 ) + "C" +   pCol,       result_seat_count );
    addToSeatCount( pMapInput, pPrefix + "R" + ( pRow-1 ) + "C" + ( pCol + 1 ), result_seat_count );

    addToSeatCount( pMapInput, pPrefix + "R" + ( pRow + 1 ) + "C" + ( pCol - 1 ), result_seat_count );
    addToSeatCount( pMapInput, pPrefix + "R" + ( pRow + 1 ) + "C" +   pCol,       result_seat_count );
    addToSeatCount( pMapInput, pPrefix + "R" + ( pRow + 1 ) + "C" + ( pCol + 1 ), result_seat_count );

    return result_seat_count;
}


function searchSeat( pMapInput : PropertieMap, pRow : number, pCol : number, pDeltaRow : number, pDeltaCol : number,  pPrefix : string, pSeatCount : SeatCount ) : void
{
    let cur_row : number = pRow;
    let cur_col : number = pCol;

    let cur_char : string = "";

    while ( cur_char !== CHAR_NOT_MAP )
    {
        cur_row += pDeltaRow;
        cur_col += pDeltaCol;

        cur_char = pMapInput[ pPrefix + "R" + cur_row + "C" + cur_col ] ?? CHAR_NOT_MAP;

        if ( cur_char === CHAR_MAP_OCCUPIED_SEAT )
        {
            pSeatCount.occupied++;

            return;
        }

        if ( cur_char === CHAR_MAP_EMPTY_SEAT )
        {
            pSeatCount.empty++;

            return;
        }
    }

    pSeatCount.not_grid++;
}


function getSeatCountPart2( pMapInput : PropertieMap, pRow : number, pCol : number, pPrefix : string ) : SeatCount 
{
    let result_seat_count : SeatCount = { floor : 0, empty : 0, occupied : 0, not_grid : 0 };

    searchSeat( pMapInput, pRow, pCol,  0, -1, pPrefix, result_seat_count );
    searchSeat( pMapInput, pRow, pCol,  0,  1, pPrefix, result_seat_count );

    searchSeat( pMapInput, pRow, pCol, -1, -1, pPrefix, result_seat_count );
    searchSeat( pMapInput, pRow, pCol, -1,  0, pPrefix, result_seat_count );
    searchSeat( pMapInput, pRow, pCol, -1,  1, pPrefix, result_seat_count );

    searchSeat( pMapInput, pRow, pCol,  1, -1, pPrefix, result_seat_count );
    searchSeat( pMapInput, pRow, pCol,  1,  0, pPrefix, result_seat_count );
    searchSeat( pMapInput, pRow, pCol,  1,  1, pPrefix, result_seat_count );

    return result_seat_count;
}


function calcOccupiedSeats( pMapInput : PropertieMap, pGridRows : number, pGridCols : number, pNrOfOccSeats : number, pKnzDebug : boolean, pKnzCalcPart1 : boolean ) : number 
{
    let seat_occupied      : number  = 0;

    let map_toggle         : boolean = true;

    let prefix_source      : string  = "";

    let prefix_destination : string  = PREFIX_MAP_2;

    for ( let iteration_nr = 0; iteration_nr < 32000; iteration_nr++ )
    {
        if ( map_toggle )
        {
            prefix_source      = PREFIX_MAP_1;
            prefix_destination = PREFIX_MAP_2;
        }
        else
        {
            prefix_source      = PREFIX_MAP_2;
            prefix_destination = PREFIX_MAP_1;
        }

        map_toggle = !map_toggle;

        seat_occupied = 0;

        let change_count : number = 0;

        let seat_free    : number = 0;

        for ( let cur_row = 0; cur_row < pGridRows; cur_row++ )
        {
            for ( let cur_col = 0; cur_col < pGridCols; cur_col++ )
            {
                let seat_cur : string = pMapInput[ prefix_source + "R" + cur_row  + "C" + cur_col ] ?? CHAR_MAP_FLOOR;

                if ( seat_cur === CHAR_MAP_FLOOR )
                {
                    pMapInput[ prefix_destination + "R" + cur_row  + "C" + cur_col ] = CHAR_MAP_FLOOR;
                }
                else
                {
                    let seat_count : SeatCount;
                    
                    if ( pKnzCalcPart1 )
                    {
                        seat_count = getSeatCountPart1( pMapInput, cur_row, cur_col, prefix_source );
                    }
                    else
                    {
                        seat_count = getSeatCountPart2( pMapInput, cur_row, cur_col, prefix_source );
                    }                    

                    if ( seat_cur === CHAR_MAP_EMPTY_SEAT ) 
                    {
                        seat_free++;

                        let empty_seats_adjacent : number = seat_count.empty + seat_count.floor + seat_count.not_grid;

                        if ( empty_seats_adjacent === 8 )
                        { 
                            pMapInput[ prefix_destination + "R" + cur_row  + "C" + cur_col ] = CHAR_MAP_OCCUPIED_SEAT;

                            change_count++;
                        }
                        else
                        { 
                            pMapInput[ prefix_destination + "R" + cur_row  + "C" + cur_col ] = CHAR_MAP_EMPTY_SEAT;
                        }
                    }
                    else if ( seat_cur === CHAR_MAP_OCCUPIED_SEAT ) 
                    {
                        seat_occupied++;

                        if ( seat_count.occupied >= pNrOfOccSeats )
                        { 
                            pMapInput[ prefix_destination + "R" + cur_row  + "C" + cur_col ] = CHAR_MAP_EMPTY_SEAT;

                            change_count++;
                        }
                        else
                        { 
                            pMapInput[ prefix_destination + "R" + cur_row  + "C" + cur_col ] = CHAR_MAP_OCCUPIED_SEAT;
                        }
                    }
                }
            }
        }

        if ( pKnzDebug )
        {
            wl( "" );
            wl( "-----------------------------------------------------------------------------" );
        }

        wl( "iteration_nr " + padL( iteration_nr, 4 ) + "  change_count " + padL( change_count, 4 ) + "  Seats empty " + padL( seat_free, 6 ) + " occupied " + padL( seat_occupied, 6 ) );

        if ( pKnzDebug )
        {
            let dbg_map_source      = getDebugMap( pMapInput, 0, 0, pGridRows, pGridCols, prefix_source      );
            let dbg_map_destination = getDebugMap( pMapInput, 0, 0, pGridRows, pGridCols, prefix_destination );

            wl( "" );
            wl( combineStrings( dbg_map_source, dbg_map_destination ) );
            wl( "" );
        }

        if ( change_count === 0 )
        {
            break;
        }
    }

    return seat_occupied;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows      : number = 0; 
    let grid_cols      : number = 0;

    let map_input      : PropertieMap = {};
    
    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            grid_cols = cur_col1;

            let cur_char_input : string = cur_input_str[ grid_cols ] ?? CHAR_MAP_FLOOR;

            map_input[ PREFIX_MAP_1 + "R" + grid_rows + "C" + grid_cols ] = cur_char_input;
            map_input[ PREFIX_MAP_2 + "R" + grid_rows + "C" + grid_cols ] = cur_char_input;
        }

        grid_rows++;
    }

    grid_cols++;

    let map_save : PropertieMap = { ...map_input };

    result_part_01 = calcOccupiedSeats( map_input, grid_rows, grid_cols, 4, pKnzDebug, true  );

    result_part_02 = calcOccupiedSeats( map_save,  grid_rows, grid_cols, 5, pKnzDebug, false );

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day11_input.txt";

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

    array_test.push( "L.LL.LL.LL" );
    array_test.push( "LLLLLLL.LL" );
    array_test.push( "L.L.L..L.." );
    array_test.push( "LLLL.LL.LL" );
    array_test.push( "L.LL.LL.LL" );
    array_test.push( "L.LLLLL.LL" );
    array_test.push( "..L.L....." );
    array_test.push( "LLLLLLLLLL" );
    array_test.push( "L.LLLLLL.L" );
    array_test.push( "L.LLLLL.LL" );

    return array_test;
}


wl( "" );
wl( "Day 11 - Seating System" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 11 - End " );
