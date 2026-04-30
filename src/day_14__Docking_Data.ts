import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/14
 * 
 * https://www.reddit.com/r/adventofcode/comments/kcr1ct/2020_day_14_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day14/day_14__Docking_Data.js
 * 
 * Day 14 - Docking Data
 * 
 * new BitMask SET 00000000000000000000000001000000         64
 * new BitMask DEL 00000000000000000000000000000010          2
 * 
 * Mem Pos     8  val_input         11 =>         73
 * Mem Pos     7  val_input        101 =>        101
 * Mem Pos     8  val_input          0 =>         64
 * 
 * Result Part 1 = 165
 * Result Part 2 = 0
 * 
 * ---------------------------------------------------------------------
 * 
 * Result Part 1 = 10452688630537
 * Result Part 2 = 0
 */

type PropertieBigInt = Record< string, bigint >;

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


function getDebugStr( pNumber : bigint ) : string
{
   return  pNumber.toString( 2 ).padStart( 32, '0' ) + " " + padL( "" + pNumber, 10 );
}


function applyBitMask( pNumberInput : bigint, pMaskSet : bigint, pMaskDel : bigint ) : bigint
{
    let val_set : bigint = pNumberInput | pMaskSet;

    let val_del : bigint = val_set & ~pMaskDel;

    // wl( "      val_input      " +  getDebugStr( pNumberInput ) );
    // wl( " or   bit_mask_set   " +  getDebugStr( pMaskSet ) );
    // wl( "  =   val_set        " +  getDebugStr( val_set ) );
    // wl( "" );
    // wl( "      val_set        " +  getDebugStr( val_set ) );
    // wl( " and  bit_mask_set   " +  getDebugStr( pMaskDel ) );
    // wl( "  =   val_set        " +  getDebugStr( val_del ) );
    // wl( "" );

    return val_del;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_02 : number = 0;

    let bit_mask_set : bigint = 1n;
    let bit_mask_del : bigint = 1n;

    let prop_mem : PropertieBigInt = {};

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.startsWith( "mask" ) )
        {
            let mask_input : string = cur_input_str.substring( 7 );

            let mask_del : string = "";
            let mask_set : string = "";

            for ( let nr = 0; nr < mask_input.length; nr++ )
            {
                let cur_char_input : string = mask_input.charAt( nr );

                if ( cur_char_input === 'X' )
                {
                    mask_del += "0";
                    mask_set += "0"
                }
                else if ( cur_char_input === '1' )
                {
                    mask_del += "0";
                    mask_set += "1"
                }
                else if ( cur_char_input === '0' )
                {
                    mask_del += "1";
                    mask_set += "0"
                }
            }

            bit_mask_set = BigInt("0b" + mask_set );
            bit_mask_del = BigInt("0b" + mask_del );

            if ( pKnzDebug )
            {
                wl( "" );
                wl( "new BitMask SET " + getDebugStr( bit_mask_set ) );
                wl( "new BitMask DEL " + getDebugStr( bit_mask_del ) );
                wl( "" );
            }
        }
        else
        {
            let mem_pos_end : number = cur_input_str.indexOf( "] = " );

            if ( mem_pos_end > 0 )
            {
                let val_input : bigint = BigInt( parseInt( cur_input_str.substring( mem_pos_end + 4 ) ) );

                let mem_value  : bigint = applyBitMask( val_input, bit_mask_set, bit_mask_del );

                let mem_pos_start : number = cur_input_str.indexOf( "[" );

                let mem_pos_adr : string = cur_input_str.substring( mem_pos_start + 1, mem_pos_end );

                if ( pKnzDebug )
                {
                    wl( "Mem Pos " + padL( mem_pos_adr, 5 ) + "  val_input " + padL( "" + val_input, 10 )  + " => " + padL( "" + mem_value, 10 ) ); 
                }
                
                prop_mem[ mem_pos_adr ] = mem_value;
            }            
        }
    }

    let result_part_01 : bigint = 0n;

    for ( let key  of Object.keys( prop_mem ) ) 
    {
        result_part_01 += prop_mem[ key ]!;
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day14_input.txt";

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

    array_test.push( "mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X" );
    array_test.push( "mem[8] = 11"  );
    array_test.push( "mem[7] = 101" );
    array_test.push( "mem[8] = 0"   );

    return array_test;
}


wl( "" );
wl( "Day 14 - Docking Data" );
wl( "" );

calcArray( getTestArray1(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

//checkReaddatei();

wl( "" )
wl( "Day 14 - End " );
