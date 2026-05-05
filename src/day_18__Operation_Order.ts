import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/18
 * 
 * https://www.reddit.com/r/adventofcode/comments/kfeldk/2020_day_18_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day18/day_18__Operation_Order.js
 * 
 * Day 18 - Operation Order
 * 
 * ----------------------------------------------------------------------
 * 
 *    1 | Recursion Nr   0 | Number      2   =        2
 *    5 | Recursion Nr   0 | Number      3 * =        6
 *   10 | Recursion Nr   0 | Number      4   =        4
 *   14 | Recursion Nr   0 | Number      5 * =       20
 *   15 | Recursion Nr   1 | ()         20   =       26
 *   16 | Recursion Nr   1 | Parser End      =       26
 * 
 * 2 * 3 + (4 * 5)  = 26
 * 
 * 2 * 3 + (4 * 5)  = 26 => expected 26  OK
 * 
 * ----------------------------------------------------------------------
 * 
 *    1 | Recursion Nr   0 | Number      5   =        5
 *    6 | Recursion Nr   0 | Number      8   =        8
 *   10 | Recursion Nr   0 | Number      3 * =       24
 *   14 | Recursion Nr   0 | Number      9 + =       33
 *   18 | Recursion Nr   0 | Number      3 + =       36
 *   22 | Recursion Nr   0 | Number      4 * =      144
 *   26 | Recursion Nr   0 | Number      3 * =      432
 *   27 | Recursion Nr   1 | ()        432   =      437
 *   28 | Recursion Nr   1 | Parser End      =      437
 * 
 * 5 + (8 * 3 + 9 + 3 * 4 * 3)  = 437
 * 
 * 5 + (8 * 3 + 9 + 3 * 4 * 3)  = 437 => expected 437  OK
 * 
 * ----------------------------------------------------------------------
 * 
 *    1 | Recursion Nr   0 | Number      5   =        5
 *    5 | Recursion Nr   0 | Number      9 * =       45
 *   10 | Recursion Nr   0 | Number      7   =        7
 *   14 | Recursion Nr   0 | Number      3 * =       21
 *   18 | Recursion Nr   0 | Number      3 * =       63
 *   22 | Recursion Nr   0 | Number      9 + =       72
 *   26 | Recursion Nr   0 | Number      3 * =      216
 *   31 | Recursion Nr   0 | Number      8   =        8
 *   35 | Recursion Nr   0 | Number      6 + =       14
 *   39 | Recursion Nr   0 | Number      4 * =       56
 *   40 | Recursion Nr   1 | ()         56   =      272
 *   41 | Recursion Nr   1 | ()        272   =    12240
 *   42 | Recursion Nr   1 | Parser End      =    12240
 * 
 * 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))  = 12240
 * 
 * 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))  = 12240 => expected 12240  OK
 * 
 * ----------------------------------------------------------------------
 * 
 *    3 | Recursion Nr   0 | Number      2   =        2
 *    7 | Recursion Nr   0 | Number      4 + =        6
 *   11 | Recursion Nr   0 | Number      9 * =       54
 *   12 | Recursion Nr   1 | ()         54   =       54
 *   17 | Recursion Nr   1 | Number      6   =        6
 *   21 | Recursion Nr   1 | Number      9 + =       15
 *   25 | Recursion Nr   1 | Number      8 * =      120
 *   29 | Recursion Nr   1 | Number      6 + =      126
 *   30 | Recursion Nr   2 | ()        126   =     6804
 *   34 | Recursion Nr   2 | Number      6 + =     6810
 *   35 | Recursion Nr   1 | ()       6810   =     6810
 *   39 | Recursion Nr   1 | Number      2 + =     6812
 *   43 | Recursion Nr   1 | Number      4 + =     6816
 *   47 | Recursion Nr   1 | Number      2 * =    13632
 *   48 | Recursion Nr   1 | Parser End      =    13632
 * 
 * ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2  = 13632
 * 
 * ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2  = 13632 => expected 13632  OK
 * 
 * ---------------------------------------------------------------
 * 
 * Day 18 - End
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


class FktParser
{
    input_string : string = '';

    cur_char     : string = ' ';

    index_read   : number = 0;

    public parseStart( pInput : string, pKnzDebug : boolean ) : number
    {
        this.input_string = pInput;

        this.index_read = 0;

        if ( pKnzDebug )
        {
            wl( "" );
        }

        let term_result : number = this.parseTerm( 0, pKnzDebug );

        if ( pKnzDebug )
        {
            wl( "" );
            wl( this.input_string + " = " + term_result );
            wl( "" );
        }

        return term_result;
    }

    public parseTerm( pRecursionNr : number, pKnzDebug : boolean ) : number
    {
        let last_op : string = ' ';

        let term_result : number = 0;

        while ( this.read() )
        {
            if ( ( this.cur_char >= '0' ) && ( this.cur_char <= '9') )
            {  
                /*
                 * read the new number 
                 */
                let new_number : number = this.parseNumber();

                /*
                 * Apply the last parsed operation
                 */
                     if ( last_op === '+' ) { term_result += new_number; }
                else if ( last_op === '*' ) { term_result *= new_number; }
                else { term_result = new_number; }

                if ( pKnzDebug )
                {
                    wl( padL( this.index_read, 4 ) + " | Recursion Nr " + padL( pRecursionNr, 3 ) +  " | Number " + padL( new_number, 6 ) + " " + last_op + " = " + padL( term_result, 8 ) );
                }

                /*
                 * Reset the last parsed operation
                 */
                last_op = ' ';
            }
            else if ( this.cur_char === '+' ) 
            {  
                last_op = '+';
            }
            else if ( this.cur_char === '*' ) 
            {  
                last_op = '*';
            }
            else if ( this.cur_char === ')' ) 
            {  
                return term_result;
            }
            else if ( this.cur_char === '(' ) 
            {  
                let new_number : number = this.parseTerm( pRecursionNr++, pKnzDebug );

                if ( new_number === 59046 )
                {
                    wl( "Break" );
                }

                     if ( last_op === '+' ) { term_result += new_number; }
                else if ( last_op === '*' ) { term_result *= new_number; }
                else { term_result = new_number; }

                last_op = ' ';

                if ( pKnzDebug )
                {
                    wl( padL( this.index_read, 4 ) + " | Recursion Nr " + padL( pRecursionNr, 3 ) +  " | ()     " + padL( new_number, 6 ) + " " + last_op + " = " + padL( term_result, 8 ) );
                }
            }
        }

        if ( pKnzDebug )
        {
            wl( padL( this.index_read, 4 ) + " | Recursion Nr " + padL( pRecursionNr, 3 ) +  " | Parser End  " + last_op + "   = " + padL( term_result, 8 ) );
        }

         return term_result;
    }
    
    private parseNumber() : number
    {
        /*
         * Consume the first read number.
         */
        let number_read : number = this.cur_char.charCodeAt( 0 ) - 48;

        /*
         * Read the rest of the number
         */
        while ( this.readNumber() )
        {
            number_read = ( number_read * 10 ) + this.cur_char.charCodeAt( 0 ) - 48;
        }

        if ( this.index_read >= this.input_string.length ) return number_read;

        this.index_read--;

        return number_read;     
    }

    private readNumber() : boolean
    {
        /*
         * Read the next character from the input
         */
        if ( this.read() === false ) { return false; }

        /*
         * return true, if the new character is a number
         */
        return ( ( this.cur_char >= '0' ) && ( this.cur_char <= '9' ) );
    }

    private read() : boolean
    {
        /*
         * If no input string is left to read, return false
         */
        if ( this.index_read >= this.input_string.length ) return false;

        /*
         * Update the cur_char-variable with the current value
         */
        this.cur_char = this.input_string.charAt( this.index_read );

        /*
         * Move the read-index one further to the string end
         */
        this.index_read++;

        /*
         * Return true for one read char
         */
        return true;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let fkt_parser : FktParser = new FktParser();


    for ( const cur_input_str of pArray ) 
    {
       let number_from_function : number = fkt_parser.parseStart( cur_input_str, pKnzDebug );

       wl( cur_input_str + " = " + number_from_function + " =>  " + result_part_01 );

       result_part_01 += number_from_function;
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
    let fkt_parser : FktParser = new FktParser();

    wl( "" );
    wl( "----------------------------------------------------------------------" );

    let number_from_function : number = fkt_parser.parseStart( pInput, pKnzDebug );

    wl( pInput + " = " + number_from_function + " => expected " + pExpect + "  " + ( number_from_function === pExpect ? "OK" : "#### ERROR ####" ) );
}


wl( "" );
wl( "Day 18 - Operation Order" );
wl( "" );

testCalcFunction( "2 * 3 + (4 * 5) ",                                    26, true );
testCalcFunction( "5 + (8 * 3 + 9 + 3 * 4 * 3) ",                       437, true );
testCalcFunction( "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) ",       12240, true );
testCalcFunction( "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 ", 13632, true );

//calcArray( getTestArray1(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

checkReaddatei();

wl( "" )
wl( "Day 18 - End " );
