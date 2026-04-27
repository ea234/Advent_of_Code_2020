import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/3
 * 
 * https://www.reddit.com/r/adventofcode/comments/k5qsrk/2020_day_03_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day03/day_03__Toboggan_Trajectory.js
 * 
 * Day 3 - Toboggan Trajectory
 * 
 * ----------------------------------------------------------------------------------------------------
 * 
 * Right 1, Down 1 = Tree Hit 2
 * 
 *      01234567890      01234567890
 *   0  ..##.......   0  O..........
 *   1  #...#...#..   1  .O.........
 *   2  .#....#..#.   2  ..O........
 *   3  ..#.#...#.#   3  ...O.......
 *   4  .#...##..#.   4  ....O......
 *   5  ..#.##.....   5  .....x.....
 *   6  .#.#.#....#   6  ......O....
 *   7  .#........#   7  .......O...
 *   8  #.##...#...   8  ........O..
 *   9  #...##....#   9  .........O.
 *  10  .#..#...#.#  10  ..........x
 * 
 * 
 *      012345678901
 *   0  O...........
 *   1  .O..........
 *   2  ..O.........
 *   3  ...O........
 *   4  ....O.......
 *   5  .....x......
 *   6  ......O.....
 *   7  .......O....
 *   8  ........O...
 *   9  .........O..
 *  10  ..........x.
 * 
 * ----------------------------------------------------------------------------------------------------
 * 
 * Right 3, Down 1 = Tree Hit 7
 * 
 *      01234567890      01234567890
 *   0  ..##.......   0  O..........
 *   1  #...#...#..   1  ...O.......
 *   2  .#....#..#.   2  ......x....
 *   3  ..#.#...#.#   3  .........O.
 *   4  .#...##..#.   4  .x.........
 *   5  ..#.##.....   5  ....x......
 *   6  .#.#.#....#   6  .......O...
 *   7  .#........#   7  ..........x
 *   8  #.##...#...   8  ..x........
 *   9  #...##....#   9  .....x.....
 *  10  .#..#...#.#  10  ........x..
 * 
 * 
 *      0123456789012345678901234567890123
 *   0  O.................................
 *   1  ...O..............................
 *   2  ......x...........................
 *   3  .........O........................
 *   4  ............x.....................
 *   5  ...............x..................
 *   6  ..................O...............
 *   7  .....................x............
 *   8  ........................x.........
 *   9  ...........................x......
 *  10  ..............................x...
 * 
 * ----------------------------------------------------------------------------------------------------
 * 
 * Right 5, Down 1 = Tree Hit 3
 * 
 *      01234567890      01234567890
 *   0  ..##.......   0  O..........
 *   1  #...#...#..   1  .....O.....
 *   2  .#....#..#.   2  ..........O
 *   3  ..#.#...#.#   3  ....x......
 *   4  .#...##..#.   4  .........x.
 *   5  ..#.##.....   5  ...O.......
 *   6  .#.#.#....#   6  ........O..
 *   7  .#........#   7  ..O........
 *   8  #.##...#...   8  .......x...
 *   9  #...##....#   9  .O.........
 *  10  .#..#...#.#  10  ......O....
 * 
 * 
 *      01234567890123456789012345678901234567890123456789012345
 *   0  O.......................................................
 *   1  .....O..................................................
 *   2  ..........O.............................................
 *   3  ...............x........................................
 *   4  ....................x...................................
 *   5  .........................O..............................
 *   6  ..............................O.........................
 *   7  ...................................O....................
 *   8  ........................................x...............
 *   9  .............................................O..........
 *  10  ..................................................O.....
 * 
 * ----------------------------------------------------------------------------------------------------
 * 
 * Right 7, Down 1 = Tree Hit 4
 * 
 *      01234567890      01234567890
 *   0  ..##.......   0  O..........
 *   1  #...#...#..   1  .......O...
 *   2  .#....#..#.   2  ...O.......
 *   3  ..#.#...#.#   3  ..........x
 *   4  .#...##..#.   4  ......x....
 *   5  ..#.##.....   5  ..x........
 *   6  .#.#.#....#   6  .........O.
 *   7  .#........#   7  .....O.....
 *   8  #.##...#...   8  .O.........
 *   9  #...##....#   9  ........O..
 *  10  .#..#...#.#  10  ....x......
 * 
 * 
 *      012345678901234567890123456789012345678901234567890123456789012345678901234567
 *   0  O.............................................................................
 *   1  .......O......................................................................
 *   2  ..............O...............................................................
 *   3  .....................x........................................................
 *   4  ............................x.................................................
 *   5  ...................................x..........................................
 *   6  ..........................................O...................................
 *   7  .................................................O............................
 *   8  ........................................................O.....................
 *   9  ...............................................................O..............
 *  10  ......................................................................x.......
 * 
 * ----------------------------------------------------------------------------------------------------
 * 
 * Right 1, Down 2 = Tree Hit 2
 * 
 *      01234567890      01234567890
 *   0  ..##.......   0  O..........
 *   1  #...#...#..   1  ...........
 *   2  .#....#..#.   2  .x.........
 *   3  ..#.#...#.#   3  ...........
 *   4  .#...##..#.   4  ..O........
 *   5  ..#.##.....   5  ...........
 *   6  .#.#.#....#   6  ...x.......
 *   7  .#........#   7  ...........
 *   8  #.##...#...   8  ....O......
 *   9  #...##....#   9  ...........
 *  10  .#..#...#.#  10  .....O.....
 * 
 * 
 *      0123456
 *   0  O......
 *   1  .......
 *   2  .x.....
 *   3  .......
 *   4  ..O....
 *   5  .......
 *   6  ...x...
 *   7  .......
 *   8  ....O..
 *   9  .......
 *  10  .....O.
 *  11  .......
 * 
 * ----------------------------------------------------------------------------------------------------
 * 
 * tree_hit_slope_1   2
 * tree_hit_slope_2   7
 * tree_hit_slope_3   3
 * tree_hit_slope_4   4
 * tree_hit_slope_5   2
 * 
 * Result Part 1 = 7
 * Result Part 2 = 336
 * 
 * Day 03 - End
 * 
 * ----------------------------------------------------------------------------------------------------
 * 
 * tree_hit_slope_1  77
 * tree_hit_slope_2 218
 * tree_hit_slope_3  65
 * tree_hit_slope_4  82
 * tree_hit_slope_5  43
 * 
 * Result Part 1 = 218
 * Result Part 2 = 3847183340
 * 
 */

type PropertieMap = Record< string, string >;

const STR_COMBINE_SPACER     : string = " ";

const MAP_CHAR_OPEN_SQUARE   : string = ".";
const MAP_CHAR_TREE          : string = "#";
const MAP_CHAR_PATH_NO_HIT   : string = "O";
const MAP_CHAR_PATH_TREE_HIT : string = "x";

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


function getDebugMap( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number ): string 
{
    let str_result : string = "";

    str_result += padL( " ", 3 ) + "  ";

    for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
    {
        str_result += cur_col % 10;
    }

    str_result += "\n";

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        str_result += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? ".";
        }

        str_result += "\n";
    }

    return str_result;
}


function combineStrings( pString1: string | undefined | null, pString2: string | undefined | null ): string 
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


function getTreeHitNumber( pGridInput : PropertieMap, pMaxRows : number, pMaxCols : number, pPathColDelta : number, pPathRowDelta : number, pKnzDebug : boolean )
{
    let tree_hits      : number = 0;

    let grid_path_1    : PropertieMap = {};
    let grid_path_2    : PropertieMap = {};

    let path_row_pos   : number = 0;
    let path_col_pos   : number = 0;

    let path_col_pos_c : number = 0;

    while ( path_row_pos < pMaxRows )
    {
        if ( pGridInput[ "R" + path_row_pos + "C" + path_col_pos_c ] === MAP_CHAR_TREE )
        {
            tree_hits++;

            grid_path_1[ "R" + path_row_pos + "C" + path_col_pos_c ] = MAP_CHAR_PATH_TREE_HIT; 
            grid_path_2[ "R" + path_row_pos + "C" + path_col_pos   ] = MAP_CHAR_PATH_TREE_HIT; 
        }
        else 
        {
            grid_path_1[ "R" + path_row_pos + "C" + path_col_pos_c ] = MAP_CHAR_PATH_NO_HIT; 
            grid_path_2[ "R" + path_row_pos + "C" + path_col_pos   ] = MAP_CHAR_PATH_NO_HIT; 
        }

        path_col_pos_c += pPathColDelta;

        if ( path_col_pos_c >= pMaxCols )
        {
            path_col_pos_c -= pMaxCols;
        }

        path_row_pos += pPathRowDelta;
        path_col_pos += pPathColDelta;
    }

    /*
     * *******************************************************************************************************
     * Doing some Debug-Stuff
     * *******************************************************************************************************
     */
    if ( pKnzDebug )
    {
        let debug_map_grid_input : string = getDebugMap( pGridInput,  pMaxRows, pMaxCols );
        let debug_map_path_1     : string = getDebugMap( grid_path_1, pMaxRows, pMaxCols );
        let debug_map_path_2     : string = getDebugMap( grid_path_2, path_row_pos, path_col_pos + 1 );

        wl( "" );
        wl( "----------------------------------------------------------------------------------------------------" );
        wl( "" );
        wl( "Right " + pPathColDelta + ", Down " + pPathRowDelta + " = Tree Hit " + tree_hits );
        wl( "" );
        wl( combineStrings( debug_map_grid_input, debug_map_path_1 ) );
        wl( "" );
        wl( debug_map_path_2 );
        wl( "" );
    }

    return tree_hits;
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ) : void 
{
    let grid_input : PropertieMap = {};

    let grid_rows  : number = 0;
    let grid_cols  : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            grid_cols = cur_col1;

            let cur_char_input : string = cur_input_str[ grid_cols ] ?? MAP_CHAR_OPEN_SQUARE;

            if ( cur_char_input === MAP_CHAR_TREE )
            {
                grid_input[ "R" + grid_rows + "C" + grid_cols ] = MAP_CHAR_TREE;
            }
        }

        grid_rows++;
    }

    grid_cols++;

    let tree_hit_slope_1 : number = getTreeHitNumber( grid_input, grid_rows, grid_cols, 1, 1, pKnzDebug );
    let tree_hit_slope_2 : number = getTreeHitNumber( grid_input, grid_rows, grid_cols, 3, 1, pKnzDebug );
    let tree_hit_slope_3 : number = getTreeHitNumber( grid_input, grid_rows, grid_cols, 5, 1, pKnzDebug );
    let tree_hit_slope_4 : number = getTreeHitNumber( grid_input, grid_rows, grid_cols, 7, 1, pKnzDebug );
    let tree_hit_slope_5 : number = getTreeHitNumber( grid_input, grid_rows, grid_cols, 1, 2, pKnzDebug );

    let result_part_01 : number = tree_hit_slope_2;

    let result_part_02 : number = tree_hit_slope_1 * tree_hit_slope_2 * tree_hit_slope_3 * tree_hit_slope_4 * tree_hit_slope_5;

    wl( "" );
    wl( "----------------------------------------------------------------------------------------------------" );
    wl( "" );
    wl( "tree_hit_slope_1 " + padL( tree_hit_slope_1, 3 ) );
    wl( "tree_hit_slope_2 " + padL( tree_hit_slope_2, 3 ) );
    wl( "tree_hit_slope_3 " + padL( tree_hit_slope_3, 3 ) );
    wl( "tree_hit_slope_4 " + padL( tree_hit_slope_4, 3 ) );
    wl( "tree_hit_slope_5 " + padL( tree_hit_slope_5, 3 ) );
    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day03_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}


function checkReaddatei(): void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "..##......." );
    array_test.push( "#...#...#.." );
    array_test.push( ".#....#..#." );
    array_test.push( "..#.#...#.#" );
    array_test.push( ".#...##..#." );
    array_test.push( "..#.##....." );
    array_test.push( ".#.#.#....#" );
    array_test.push( ".#........#" );
    array_test.push( "#.##...#..." );
    array_test.push( "#...##....#" );
    array_test.push( ".#..#...#.#" );

    return array_test;
}


wl( "" );
wl( "Day 3 - Toboggan Trajectory" );
wl( "" );

calcArray( getTestArray1(), true );

checkReaddatei();

wl( "" )
wl( "Day 03 - End " );
