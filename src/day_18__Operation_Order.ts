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
 * 
 * PART 2
 * 
 * 1 + (2 * 3) + (4 * (5 + 6))                        = 51     => expected 51  OK
 * 2 * 3 + (4 * 5)                                    = 46     => expected 46  OK
 * 5 + (8 * 3 + 9 + 3 * 4 * 3)                        = 1445   => expected 1445  OK
 * 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))          = 669060 => expected 669060  OK
 * ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2    = 23976  => expected 23340  #### ERROR ####
 * (((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 ) = 23976  => expected 23340  #### ERROR ####
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day18/day_18__Operation_Order.js
 * 
 * Day 18 - Operation Order
 * 
 * ----------------------------------------------------------------------
 * 
 *    3 | Recursion Nr   0 | Number      2   =        2
 *    7 | Recursion Nr   0 | Number      4 + =        6
 *   11 | Recursion Nr   0 | Number      9   =        9
 *   12 | Recursion Nr   1 | *           9   =       54
 *   17 | Recursion Nr   1 | Number      6   =        6
 *   21 | Recursion Nr   1 | Number      9 + =       15
 *   25 | Recursion Nr   1 | Number      8   =        8
 *   29 | Recursion Nr   1 | Number      6 + =       14
 *   30 | Recursion Nr   2 | *          14   =      210
 *   34 | Recursion Nr   2 | Number      6 + =      216
 *   35 | Recursion Nr   2 | ()        216   =      216
 *   39 | Recursion Nr   2 | Number      2 + =      218
 *   43 | Recursion Nr   2 | Number      4 + =      222
 *   48 | Recursion Nr   2 | Number      2   =        2
 *   48 | Recursion Nr   2 | Parser End      =        2
 *   48 | Recursion Nr   3 | *           2   =      444
 *   48 | Recursion Nr   3 | Parser End      =      444
 *   48 | Recursion Nr   2 | *         444   =    23976
 *   48 | Recursion Nr   2 | Parser End      =    23976
 *   48 | Recursion Nr   1 | ()      23976   =    23976
 *   48 | Recursion Nr   1 | Parser End      =    23976
 *   48 | Recursion Nr   1 | ()      23976   =    23976
 *   48 | Recursion Nr   1 | Parser End      =    23976
 * 
 * ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2  = 23976
 * 
 * ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2  = 23976 => expected 23340  #### ERROR ####
 * 
 * ----------------------------------------------------------------------
 * 
 *    1 | Recursion Nr   0 | Number      1   =        1
 *    5 | Recursion Nr   0 | Number      2 + =        3
 *    9 | Recursion Nr   0 | Number      3   =        3
 *   13 | Recursion Nr   0 | Number      4 + =        7
 *   17 | Recursion Nr   0 | Number      5   =        5
 *   21 | Recursion Nr   0 | Number      6 + =       11
 *   21 | Recursion Nr   0 | Parser End      =       11
 *   21 | Recursion Nr   1 | *          11   =       77
 *   21 | Recursion Nr   1 | Parser End      =       77
 *   21 | Recursion Nr   1 | *          77   =      231
 *   21 | Recursion Nr   1 | Parser End      =      231
 * 
 * 1 + 2 * 3 + 4 * 5 + 6 = 231
 * 
 * 1 + 2 * 3 + 4 * 5 + 6 = 231 => expected 231  OK
 * 
 * ---------------------------------------------------------------
 * 1 + 2 * 3 + 4 * 5 + 6
 *   3   * 3 + 4 * 5 + 6
 *   3   *   7   * 5 + 6
 *   3   *   7   *  11
 *      21       *  11
 *          231
 * ---------------------------------------------------------------
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day18/day_18__Operation_Order.js
 * 
 * Day 18 - Operation Order
 * 
 * ----------------------------------------------------------------------
 * 
 *    3 | Recursion Nr   0 | Number      1   =        1
 *    7 | Recursion Nr   0 | Number      1 + =        2
 *   12 | Recursion Nr   0 | Number     10   =       10
 *   13 | Recursion Nr   1 | *          10   =       20
 *   18 | Recursion Nr   1 | Number      1   =        1
 *   22 | Recursion Nr   1 | Number      1 + =        2
 *   26 | Recursion Nr   1 | Number      2   =        2
 *   30 | Recursion Nr   1 | Number      2 + =        4
 *   31 | Recursion Nr   2 | *           4   =        8
 *   36 | Recursion Nr   2 | Number     20 + =       28
 *   37 | Recursion Nr   2 | ()         28   =       28
 *   42 | Recursion Nr   2 | Number     30 + =       58
 *   47 | Recursion Nr   2 | Number     40 + =       98
 *   52 | Recursion Nr   2 | Number     50   =       50
 *   52 | Recursion Nr   2 | Parser End      =       50
 *   52 | Recursion Nr   3 | *          50   =     4900
 *   52 | Recursion Nr   3 | Parser End      =     4900
 *   52 | Recursion Nr   2 | *        4900   =    98000
 *   52 | Recursion Nr   2 | Parser End      =    98000
 *   52 | Recursion Nr   1 | ()      98000   =    98000
 *   52 | Recursion Nr   1 | Parser End      =    98000
 *   52 | Recursion Nr   1 | ()      98000   =    98000
 *   52 | Recursion Nr   1 | Parser End      =    98000
 * 
 * ((1 + 1 * 10) * (1 + 1 * 2 + 2) + 20) + 30 + 40 * 50 = 98000
 * 
 * ((1 + 1 * 10) * (1 + 1 * 2 + 2) + 20) + 30 + 40 * 50 = 98000 => expected 23340  #### ERROR ####
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

    knz_is_part2 : boolean = false;

    public parseStart( pInput : string, pKnzPart2 : boolean, pKnzDebug : boolean ) : number
    {
        this.input_string = pInput;

        this.index_read = 0;

        this.knz_is_part2 = pKnzPart2;

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
                    wl( padL( this.index_read, 4 ) + " " + this.cur_char + " | Recursion Nr " + padL( pRecursionNr, 3 ) +  " | Number " + padL( new_number, 6 ) + " " + last_op + " = " + padL( term_result, 8 ) );
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

                if ( this.knz_is_part2 )
                {
                    let new_number : number = this.parseTerm( pRecursionNr + 1, pKnzDebug );
                    let old_number : number = term_result;

                    if ( new_number === 15 )
                    {
                        wl( "Break" );
                    }

                         if ( last_op === '+' ) { term_result += new_number; }
                    else if ( last_op === '*' ) { term_result *= new_number; }
                    else { term_result = new_number; }

                    last_op = ' ';

                    if ( pKnzDebug )
                    {
                        wl( padL( this.index_read, 4 ) + " " + this.cur_char + " | Recursion Nr " + padL( pRecursionNr, 3 ) +  " | *      " + padL( new_number, 6 ) + " " + last_op + " = " + padL( term_result, 8 )  + "  old number " + old_number );
                    }
                }
            }
            else if ( this.cur_char === ')' ) 
            {  
                return term_result;
            }
            else if ( this.cur_char === '(' ) 
            {  
                let new_number : number = this.parseTerm( pRecursionNr + 1, pKnzDebug );

                if ( new_number === 217 )
                {
                    wl( "Break" );
                }

                     if ( last_op === '+' ) { term_result += new_number; }
                else if ( last_op === '*' ) { term_result *= new_number; }
                else { term_result = new_number; }

                last_op = ' ';

                if ( pKnzDebug )
                {
                    wl( padL( this.index_read, 4 ) + " " + this.cur_char + " | Recursion Nr " + padL( pRecursionNr, 3 ) +  " | ()     " + padL( new_number, 6 ) + " " + last_op + " = " + padL( term_result, 8 ) );
                }
            }
        }

        if ( pKnzDebug )
        {
            wl( padL( this.index_read, 4 ) + " " + this.cur_char + " | Recursion Nr " + padL( pRecursionNr, 3 ) +  " | Parser End  " + last_op + "   = " + padL( term_result, 8 ) );
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
       let number_from_function : number = fkt_parser.parseStart( cur_input_str, false, pKnzDebug );

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


function testCalcFunction( pInput : string, pExpect : number, pKnzPart2 : boolean, pKnzDebug : boolean = false ) : void
{
    let fkt_parser : FktParser = new FktParser();

    wl( "" );
    wl( "----------------------------------------------------------------------" );

    let number_from_function : number = fkt_parser.parseStart( pInput, pKnzPart2, true );

    wl( pInput + " = " + number_from_function + " => expected " + pExpect + "  " + ( number_from_function === pExpect ? "OK" : "#### ERROR ####" ) );
}


wl( "" );
wl( "Day 18 - Operation Order" );
wl( "" );

// testCalcFunction( "2 * 3 + (4 * 5) ",                                    26, false, true );
// testCalcFunction( "5 + (8 * 3 + 9 + 3 * 4 * 3) ",                       437, false, true );
// testCalcFunction( "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) ",       12240, false, true );
// testCalcFunction( "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 ", 13632, false, true );

// testCalcFunction( "1 + (2 * 3) + (4 * (5 + 6))",                          51, true, true );
// testCalcFunction( "2 * 3 + (4 * 5) ",                                     46, true, true );
// testCalcFunction( "5 + (8 * 3 + 9 + 3 * 4 * 3) ",                       1445, true, true );
// testCalcFunction( "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) ",       669060, true, true );
// testCalcFunction( "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 ",  23340, true, true );
// testCalcFunction( "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 7) + 2 + 4 * 2 ",  23340, true, true );

testCalcFunction( "((1 + 1 * 10) * (1 + 1 * 2 + 2) + 20) + 30 + 40 * 50",  23340, true, true );
testCalcFunction( "((1 + 1 * 10) + 20 ) + 40 * 2",  160, true, true );

testCalcFunction( "((1 + 1 * 10) + 20 ) + 40 + 10 * 2",  180, true, true );

testCalcFunction( "((1 + 1 * 10) * ( 2 + 8 ) + 20 ) + 40 + 10 * 2",  180, true, true );

testCalcFunction( "((2) * ( 2 ) ) + 4 ",  8, true, true );


testCalcFunction( "1 + 1 * 2 + 2",  8, true, true );
testCalcFunction( "(1 + 1) * 2 + 2",  8, true, true );
testCalcFunction( "((1 + 1) * 2) + 2",  6, true, true );


testCalcFunction( "(1 + 1) * (2 + 2)",  8, true, true );
testCalcFunction( "(1 + 1) * (2 + 2) + 1",  10, true, true );
testCalcFunction( "(1 + 1  *  2 + 2) + 1",  9, true, true );

testCalcFunction( "(1 + 1  *  2 + 2) + 1 * 2",  18, true, true );

testCalcFunction( "(1 + 1) * (2 + 2) + 1 * 2",  20, true, true );
testCalcFunction( "(1 + 1) * (2 + 2) + 1 + 2 * 2",  20, true, true );
testCalcFunction( " 1 + 1  *  2 + 2  + 1 + 2 * 2",  20, true, true );

testCalcFunction( "1 + 2 * 3 + 4 * 5 + 6",  231, true, true );


//calcArray( getTestArray1(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

//checkReaddatei();

wl( "" )
wl( "Day 18 - End " );

/*
/home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day18/day_18__Operation_Order.js

Day 18 - Operation Order

----------------------------------------------------------------------

   3   | Recursion Nr   2 | Number      1   =        1
   7   | Recursion Nr   2 | Number      1 + =        2
  12 ) | Recursion Nr   3 | Number     10   =       10
  13 ) | Recursion Nr   2 | *          10   =       20  old number 2
  18   | Recursion Nr   4 | Number      1   =        1
  22   | Recursion Nr   4 | Number      1 + =        2
  26   | Recursion Nr   5 | Number      2   =        2
  30 ) | Recursion Nr   5 | Number      2 + =        4
  31 ) | Recursion Nr   4 | *           4   =        8  old number 2
  36 ) | Recursion Nr   4 | Number     20 + =       28
  37 ) | Recursion Nr   3 | ()         28   =       28
  42   | Recursion Nr   3 | Number     30 + =       58
  47   | Recursion Nr   3 | Number     40 + =       98
  52 0 | Recursion Nr   4 | Number     50   =       50
  52 0 | Recursion Nr   4 | Parser End      =       50
  52 0 | Recursion Nr   3 | *          50   =     4900  old number 98
  52 0 | Recursion Nr   3 | Parser End      =     4900
  52 0 | Recursion Nr   2 | *        4900   =    98000  old number 20
  52 0 | Recursion Nr   2 | Parser End      =    98000
  52 0 | Recursion Nr   1 | ()      98000   =    98000
  52 0 | Recursion Nr   1 | Parser End      =    98000
  52 0 | Recursion Nr   0 | ()      98000   =    98000
  52 0 | Recursion Nr   0 | Parser End      =    98000

((1 + 1 * 10) * (1 + 1 * 2 + 2) + 20) + 30 + 40 * 50 = 98000

((1 + 1 * 10) * (1 + 1 * 2 + 2) + 20) + 30 + 40 * 50 = 98000 => expected 23340  #### ERROR ####

----------------------------------------------------------------------

   3   | Recursion Nr   2 | Number      1   =        1
   7   | Recursion Nr   2 | Number      1 + =        2
  12 ) | Recursion Nr   3 | Number     10   =       10
  13 ) | Recursion Nr   2 | *          10   =       20  old number 2
  18   | Recursion Nr   2 | Number     20 + =       40
  20 ) | Recursion Nr   1 | ()         40   =       40
  25   | Recursion Nr   1 | Number     40 + =       80
  29 2 | Recursion Nr   2 | Number      2   =        2
  29 2 | Recursion Nr   2 | Parser End      =        2
  29 2 | Recursion Nr   1 | *           2   =      160  old number 80
  29 2 | Recursion Nr   1 | Parser End      =      160
  29 2 | Recursion Nr   0 | ()        160   =      160
  29 2 | Recursion Nr   0 | Parser End      =      160

((1 + 1 * 10) + 20 ) + 40 * 2 = 160

((1 + 1 * 10) + 20 ) + 40 * 2 = 160 => expected 160  OK

----------------------------------------------------------------------

   3   | Recursion Nr   2 | Number      1   =        1
   7   | Recursion Nr   2 | Number      1 + =        2
  12 ) | Recursion Nr   3 | Number     10   =       10
  13 ) | Recursion Nr   2 | *          10   =       20  old number 2
  18   | Recursion Nr   2 | Number     20 + =       40
  20 ) | Recursion Nr   1 | ()         40   =       40
  25   | Recursion Nr   1 | Number     40 + =       80
  30   | Recursion Nr   1 | Number     10 + =       90
  34 2 | Recursion Nr   2 | Number      2   =        2
  34 2 | Recursion Nr   2 | Parser End      =        2
  34 2 | Recursion Nr   1 | *           2   =      180  old number 90
  34 2 | Recursion Nr   1 | Parser End      =      180
  34 2 | Recursion Nr   0 | ()        180   =      180
  34 2 | Recursion Nr   0 | Parser End      =      180

((1 + 1 * 10) + 20 ) + 40 + 10 * 2 = 180

((1 + 1 * 10) + 20 ) + 40 + 10 * 2 = 180 => expected 180  OK

----------------------------------------------------------------------

   3   | Recursion Nr   2 | Number      1   =        1
   7   | Recursion Nr   2 | Number      1 + =        2
  12 ) | Recursion Nr   3 | Number     10   =       10
  13 ) | Recursion Nr   2 | *          10   =       20  old number 2
  19   | Recursion Nr   4 | Number      2   =        2
  23   | Recursion Nr   4 | Number      8 + =       10
  25 ) | Recursion Nr   3 | ()         10   =       10
  30   | Recursion Nr   3 | Number     20 + =       30
  32 ) | Recursion Nr   2 | *          30   =      600  old number 20
  37   | Recursion Nr   2 | Number     40 + =      640
  42   | Recursion Nr   2 | Number     10 + =      650
  46 2 | Recursion Nr   3 | Number      2   =        2
  46 2 | Recursion Nr   3 | Parser End      =        2
  46 2 | Recursion Nr   2 | *           2   =     1300  old number 650
  46 2 | Recursion Nr   2 | Parser End      =     1300
  46 2 | Recursion Nr   1 | ()       1300   =     1300
  46 2 | Recursion Nr   1 | Parser End      =     1300
  46 2 | Recursion Nr   0 | ()       1300   =     1300
  46 2 | Recursion Nr   0 | Parser End      =     1300

((1 + 1 * 10) * ( 2 + 8 ) + 20 ) + 40 + 10 * 2 = 1300

((1 + 1 * 10) * ( 2 + 8 ) + 20 ) + 40 + 10 * 2 = 1300 => expected 180  #### ERROR ####

----------------------------------------------------------------------

   3 ) | Recursion Nr   2 | Number      2   =        2
   4 ) | Recursion Nr   1 | ()          2   =        2
  10   | Recursion Nr   3 | Number      2   =        2
  12 ) | Recursion Nr   2 | ()          2   =        2
  14 ) | Recursion Nr   1 | *           2   =        4  old number 2
  19   | Recursion Nr   1 | Number      4 + =        8
  19   | Recursion Nr   1 | Parser End      =        8
  19   | Recursion Nr   0 | ()          8   =        8
  19   | Recursion Nr   0 | Parser End      =        8

((2) * ( 2 ) ) + 4  = 8

((2) * ( 2 ) ) + 4  = 8 => expected 8  OK

----------------------------------------------------------------------

   1   | Recursion Nr   0 | Number      1   =        1
   5   | Recursion Nr   0 | Number      1 + =        2
   9   | Recursion Nr   1 | Number      2   =        2
  13 2 | Recursion Nr   1 | Number      2 + =        4
  13 2 | Recursion Nr   1 | Parser End      =        4
  13 2 | Recursion Nr   0 | *           4   =        8  old number 2
  13 2 | Recursion Nr   0 | Parser End      =        8

1 + 1 * 2 + 2 = 8

1 + 1 * 2 + 2 = 8 => expected 8  OK

----------------------------------------------------------------------

   2   | Recursion Nr   1 | Number      1   =        1
   6 ) | Recursion Nr   1 | Number      1 + =        2
   7 ) | Recursion Nr   0 | ()          2   =        2
  11   | Recursion Nr   1 | Number      2   =        2
  15 2 | Recursion Nr   1 | Number      2 + =        4
  15 2 | Recursion Nr   1 | Parser End      =        4
  15 2 | Recursion Nr   0 | *           4   =        8  old number 2
  15 2 | Recursion Nr   0 | Parser End      =        8

(1 + 1) * 2 + 2 = 8

(1 + 1) * 2 + 2 = 8 => expected 8  OK

----------------------------------------------------------------------

   3   | Recursion Nr   2 | Number      1   =        1
   7 ) | Recursion Nr   2 | Number      1 + =        2
   8 ) | Recursion Nr   1 | ()          2   =        2
  12 ) | Recursion Nr   2 | Number      2   =        2
  13 ) | Recursion Nr   1 | *           2   =        4  old number 2
  17 2 | Recursion Nr   1 | Number      2 + =        6
  17 2 | Recursion Nr   1 | Parser End      =        6
  17 2 | Recursion Nr   0 | ()          6   =        6
  17 2 | Recursion Nr   0 | Parser End      =        6

((1 + 1) * 2) + 2 = 6

((1 + 1) * 2) + 2 = 6 => expected 6  OK

----------------------------------------------------------------------

   2   | Recursion Nr   1 | Number      1   =        1
   6 ) | Recursion Nr   1 | Number      1 + =        2
   7 ) | Recursion Nr   0 | ()          2   =        2
  12   | Recursion Nr   2 | Number      2   =        2
  17 ) | Recursion Nr   2 | Number      2 + =        4
  17 ) | Recursion Nr   2 | Parser End      =        4
  17 ) | Recursion Nr   1 | ()          4   =        4
  17 ) | Recursion Nr   1 | Parser End      =        4
  17 ) | Recursion Nr   0 | *           4   =        8  old number 2
  17 ) | Recursion Nr   0 | Parser End      =        8

(1 + 1) * (2 + 2) = 8

(1 + 1) * (2 + 2) = 8 => expected 8  OK

----------------------------------------------------------------------

   2   | Recursion Nr   1 | Number      1   =        1
   6 ) | Recursion Nr   1 | Number      1 + =        2
   7 ) | Recursion Nr   0 | ()          2   =        2
  12   | Recursion Nr   2 | Number      2   =        2
  16 ) | Recursion Nr   2 | Number      2 + =        4
  17 ) | Recursion Nr   1 | ()          4   =        4
  21 1 | Recursion Nr   1 | Number      1 + =        5
  21 1 | Recursion Nr   1 | Parser End      =        5
  21 1 | Recursion Nr   0 | *           5   =       10  old number 2
  21 1 | Recursion Nr   0 | Parser End      =       10

(1 + 1) * (2 + 2) + 1 = 10

(1 + 1) * (2 + 2) + 1 = 10 => expected 10  OK

----------------------------------------------------------------------

   2   | Recursion Nr   1 | Number      1   =        1
   6   | Recursion Nr   1 | Number      1 + =        2
  12   | Recursion Nr   2 | Number      2   =        2
  16 ) | Recursion Nr   2 | Number      2 + =        4
  17 ) | Recursion Nr   1 | *           4   =        8  old number 2
  21 1 | Recursion Nr   1 | Number      1 + =        9
  21 1 | Recursion Nr   1 | Parser End      =        9
  21 1 | Recursion Nr   0 | ()          9   =        9
  21 1 | Recursion Nr   0 | Parser End      =        9

(1 + 1  *  2 + 2) + 1 = 9

(1 + 1  *  2 + 2) + 1 = 9 => expected 9  OK

----------------------------------------------------------------------

   2   | Recursion Nr   1 | Number      1   =        1
   6   | Recursion Nr   1 | Number      1 + =        2
  12   | Recursion Nr   2 | Number      2   =        2
  16 ) | Recursion Nr   2 | Number      2 + =        4
  17 ) | Recursion Nr   1 | *           4   =        8  old number 2
  21   | Recursion Nr   1 | Number      1 + =        9
  25 2 | Recursion Nr   2 | Number      2   =        2
  25 2 | Recursion Nr   2 | Parser End      =        2
  25 2 | Recursion Nr   1 | *           2   =       18  old number 9
  25 2 | Recursion Nr   1 | Parser End      =       18
  25 2 | Recursion Nr   0 | ()         18   =       18
  25 2 | Recursion Nr   0 | Parser End      =       18

(1 + 1  *  2 + 2) + 1 * 2 = 18

(1 + 1  *  2 + 2) + 1 * 2 = 18 => expected 18  OK

----------------------------------------------------------------------

   2   | Recursion Nr   1 | Number      1   =        1
   6 ) | Recursion Nr   1 | Number      1 + =        2
   7 ) | Recursion Nr   0 | ()          2   =        2
  12   | Recursion Nr   2 | Number      2   =        2
  16 ) | Recursion Nr   2 | Number      2 + =        4
  17 ) | Recursion Nr   1 | ()          4   =        4
  21   | Recursion Nr   1 | Number      1 + =        5
  25 2 | Recursion Nr   2 | Number      2   =        2
  25 2 | Recursion Nr   2 | Parser End      =        2
  25 2 | Recursion Nr   1 | *           2   =       10  old number 5
  25 2 | Recursion Nr   1 | Parser End      =       10
  25 2 | Recursion Nr   0 | *          10   =       20  old number 2
  25 2 | Recursion Nr   0 | Parser End      =       20

(1 + 1) * (2 + 2) + 1 * 2 = 20

(1 + 1) * (2 + 2) + 1 * 2 = 20 => expected 20  OK

----------------------------------------------------------------------

   2   | Recursion Nr   1 | Number      1   =        1
   6 ) | Recursion Nr   1 | Number      1 + =        2
   7 ) | Recursion Nr   0 | ()          2   =        2
  12   | Recursion Nr   2 | Number      2   =        2
  16 ) | Recursion Nr   2 | Number      2 + =        4
  17 ) | Recursion Nr   1 | ()          4   =        4
  21   | Recursion Nr   1 | Number      1 + =        5
  25   | Recursion Nr   1 | Number      2 + =        7
  29 2 | Recursion Nr   2 | Number      2   =        2
  29 2 | Recursion Nr   2 | Parser End      =        2
  29 2 | Recursion Nr   1 | *           2   =       14  old number 7
  29 2 | Recursion Nr   1 | Parser End      =       14
  29 2 | Recursion Nr   0 | *          14   =       28  old number 2
  29 2 | Recursion Nr   0 | Parser End      =       28

(1 + 1) * (2 + 2) + 1 + 2 * 2 = 28

(1 + 1) * (2 + 2) + 1 + 2 * 2 = 28 => expected 20  #### ERROR ####

----------------------------------------------------------------------

   2   | Recursion Nr   0 | Number      1   =        1
   6   | Recursion Nr   0 | Number      1 + =        2
  12   | Recursion Nr   1 | Number      2   =        2
  16   | Recursion Nr   1 | Number      2 + =        4
  21   | Recursion Nr   1 | Number      1 + =        5
  25   | Recursion Nr   1 | Number      2 + =        7
  29 2 | Recursion Nr   2 | Number      2   =        2
  29 2 | Recursion Nr   2 | Parser End      =        2
  29 2 | Recursion Nr   1 | *           2   =       14  old number 7
  29 2 | Recursion Nr   1 | Parser End      =       14
  29 2 | Recursion Nr   0 | *          14   =       28  old number 2
  29 2 | Recursion Nr   0 | Parser End      =       28

 1 + 1  *  2 + 2  + 1 + 2 * 2 = 28

 1 + 1  *  2 + 2  + 1 + 2 * 2 = 28 => expected 20  #### ERROR ####

----------------------------------------------------------------------

   1   | Recursion Nr   0 | Number      1   =        1
   5   | Recursion Nr   0 | Number      2 + =        3
   9   | Recursion Nr   1 | Number      3   =        3
  13   | Recursion Nr   1 | Number      4 + =        7
  17   | Recursion Nr   2 | Number      5   =        5
  21 6 | Recursion Nr   2 | Number      6 + =       11
  21 6 | Recursion Nr   2 | Parser End      =       11
  21 6 | Recursion Nr   1 | *          11   =       77  old number 7
  21 6 | Recursion Nr   1 | Parser End      =       77
  21 6 | Recursion Nr   0 | *          77   =      231  old number 3
  21 6 | Recursion Nr   0 | Parser End      =      231

1 + 2 * 3 + 4 * 5 + 6 = 231

1 + 2 * 3 + 4 * 5 + 6 = 231 => expected 231  OK

---------------------------------------------------------------

Day 18 - End

*/