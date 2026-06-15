import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/24
 * 
 * https://www.reddit.com/r/adventofcode/comments/kj96iw/2020_day_24_solutions/
 * 
 * Similar Challenge
 * AOC 2017 - Day 11 - https://adventofcode.com/2017/day/11
 * 
 * https://github.com/ea234/Advent_of_Code_2017/blob/main/src/de/ea234/aoc2017/day11/Day11_HexEd.java
 * 
 * 
 * 
 * https://codegolf.stackexchange.com/questions/70166/draw-and-label-an-ascii-hexagonal-grid
 *          _____         _____         _____
 *         /     \       /     \       /     \
 *   _____/ -2,-1 \_____/  0,-1 \_____/  2,-1 \_____
 *  /     \       /     \       /     \       /     \
 * / -3,-1 \_____/ -1,-1 \_____/  1,-1 \_____/  3,-1 \
 * \       /     \       /     \       /     \       /
 *  \_____/ -2,0  \_____/  0,0  \_____/  2,0  \_____/
 *  /     \       /     \       /     \       /     \
 * / -3,0  \_____/ -1,0  \_____/  1,0  \_____/  3,0  \
 * \       /     \       /     \       /     \       /
 *  \_____/ -2,1  \_____/  0,1  \_____/  2,1  \_____/
 *  /     \       /     \       /     \       /     \
 * / -3,1  \_____/ -1,1  \_____/  1,1  \_____/  3,1  \
 * \       /     \       /     \       /     \       /
 *  \_____/       \_____/       \_____/       \_____/
 * 
 * 
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day24/day_24__Lobby_Layout.js
 * 
 * Day 24 - Lobby Layout
 * 
 * sesenwnenenewseeswwswswwnenewsewsw       R2C4
 * neeenesenwnwwswnenewnwwsewnenwseswesw    R-3C4
 * seswneswswsenwwnwse                      R3C2
 * nwnwneseeswswnenewneswwnewseswneseene    R-2C7
 * swweswneswnenwsewnwneneseenw             R-2C4
 * eesenwseswswnenwswnwnwsewwnwsene         R0C2
 * sewnenenenesenwsewnenwwwse               R-3C7
 * wenwwweseeeweswwwnwwe                    R0C1
 * wsweesenenewnwwnwsenewsenwwsesesenwne    R-1C6
 * neeswseenwwswnwswswnw                    R1C0
 * nenwswwsewswnenenewsenwsenwnesesenew     R-2C6
 * enewnwewneswsewnwswenweswnenwsenwsw      R-2C1
 * sweneswneswneneenwnewenewwneswswnese     R-3C7
 * swwesenesewenwneswnwwneseswwne           R0C4
 * enesenwswwswneneswsenwnewswseenwsese     R2C6
 * wnwnesenesenenwwnenwsewesewsesesew       R0C8
 * nenewswnwewswnenesenwnesewesw            R-2C5
 * eneswnwswnwsenenwnwnwwseeswneewsenese    R-2C5
 * neswnwewnwnwseenwseesewsenwsweewe        R0C5
 * wseweeenwnesenwwwswnew                   R-1C3
 * 
 *       R2C4    1
 *      R-3C4    1
 *       R3C2    1
 *      R-2C7    1
 *      R-2C4    1
 *       R0C2    1
 *      R-3C7    2
 *       R0C1    1
 *      R-1C6    1
 *       R1C0    1
 *      R-2C6    1
 *      R-2C1    1
 *       R0C4    1
 *       R2C6    1
 *       R0C8    1
 *      R-2C5    2
 *       R0C5    1
 *      R-1C3    1
 * 
 * Result Part 1 = 0
 * Result Part 2 = 0
 * 
 * ---------------------------------------------------------------
 * 
 * esenee  = Coords  Parser R0C8  Transform R0C8
 * esew    = Coords  Parser R1C5  Transform R1C5
 * nwwswee = Coords  Parser R0C3  Transform R0C3
 * 
 * Day 24 - End
 * 
 * 
 */

const START_ROW : number = 0;
const START_COL : number = 4;

type PropertieNumber = Record< string, number >;


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


function testTransform( pString : string ) : string 
{
    let str_result : string = pString;

    str_result = str_result.replaceAll( "nw", "X" );
    str_result = str_result.replaceAll( "ne", "Y" );
    str_result = str_result.replaceAll( "se", "Z" );
    str_result = str_result.replaceAll( "sw", "T" );

    let cur_row : number = START_ROW;
    let cur_col : number = START_COL;

    let cur_index : number = 0;

    while ( cur_index < str_result.length )
    {
        let cur_char : string = str_result.charAt( cur_index );

             if ( cur_char === "X" ) { cur_row--; cur_col--; }
        else if ( cur_char === "Y" ) { cur_row--; cur_col++; }
        else if ( cur_char === "T" ) { cur_row++; cur_col--; }
        else if ( cur_char === "Z" ) { cur_row++; cur_col++; }
        else if ( cur_char === "e" ) { cur_col++; }
        else if ( cur_char === "w" ) { cur_col--; }

        cur_index++;
    }

    return "R" + cur_row + "C" + cur_col;
}


function getCoordinates( pString : string ) : string 
{
    let cur_row   : number = START_ROW;
    let cur_col   : number = START_COL;

    let cur_index : number = 0;

    while ( cur_index < pString.length )
    {
        let cur_char : string = pString.charAt( cur_index );

             if ( cur_char === "n" ) { cur_row--; cur_index++; }
        else if ( cur_char === "s" ) { cur_row++; cur_index++; }

        cur_char = pString.charAt( cur_index );

             if ( cur_char === "e" ) { cur_col++; }
        else if ( cur_char === "w" ) { cur_col--; }

        cur_index++;
    }

    return "R" + cur_row + "C" + cur_col;
}


function testGetCoords( pString : string ) : string 
{
    let coords_parser    : string = getCoordinates( pString );
    let coords_transform : string = testTransform( pString );

    wl( pString + " = Coords  Parser " + coords_parser + "  Transform " + coords_transform + " " + ( coords_parser === coords_transform ? "" : "#### ERR ####") );

    return coords_parser;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let prop_tiles : PropertieNumber = {};

    for ( const cur_input_str of pArray ) 
    {
        let coords_parser    : string = getCoordinates( cur_input_str );

        let count_x : number = ( prop_tiles[ coords_parser ] ?? 0 ) + 1;

         prop_tiles[ coords_parser ] = count_x;

        wl( cur_input_str + "    " + coords_parser );
    }

    wl( "" );

    for ( let coords of Object.keys( prop_tiles) )
    {
        wl( padL( coords , 10 ) + "    " + ( prop_tiles[ coords ] ?? 0 ) );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day24_input.txt";

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

    array_test.push( "sesenwnenenewseeswwswswwnenewsewsw"    );
    array_test.push( "neeenesenwnwwswnenewnwwsewnenwseswesw" );
    array_test.push( "seswneswswsenwwnwse"                   );
    array_test.push( "nwnwneseeswswnenewneswwnewseswneseene" );
    array_test.push( "swweswneswnenwsewnwneneseenw"          );
    array_test.push( "eesenwseswswnenwswnwnwsewwnwsene"      );
    array_test.push( "sewnenenenesenwsewnenwwwse"            );
    array_test.push( "wenwwweseeeweswwwnwwe"                 );
    array_test.push( "wsweesenenewnwwnwsenewsenwwsesesenwne" );
    array_test.push( "neeswseenwwswnwswswnw"                 );
    array_test.push( "nenwswwsewswnenenewsenwsenwnesesenew"  );
    array_test.push( "enewnwewneswsewnwswenweswnenwsenwsw"   );
    array_test.push( "sweneswneswneneenwnewenewwneswswnese"  );
    array_test.push( "swwesenesewenwneswnwwneseswwne"        );
    array_test.push( "enesenwswwswneneswsenwnewswseenwsese"  );
    array_test.push( "wnwnesenesenenwwnenwsewesewsesesew"    );
    array_test.push( "nenewswnwewswnenesenwnesewesw"         );
    array_test.push( "eneswnwswnwsenenwnwnwwseeswneewsenese" );
    array_test.push( "neswnwewnwnwseenwseesewsenwsweewe"     );
    array_test.push( "wseweeenwnesenwwwswnew"                );

    return array_test;
}


wl( "" );
wl( "Day 24 - Lobby Layout" );
wl( "" );

calcArray( getTestArray1(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

testGetCoords( "esenee"  );
testGetCoords( "esew"    );
testGetCoords( "nwwswee" );

//checkReaddatei();

wl( "" )
wl( "Day 24 - End " );
