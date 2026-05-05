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

class FktParser
{
    index_read : number = 0;

    cur_char : string = ' ';

    constructor( private input_string : string )
    {

    }

    public parseStart() : number
    {
        this.index_read = 0;

        wl( this.input_string )

        // let term_result : number = 0;

        // while ( this.read() )
        // {
        //     if ( this.cur_char === ' ' )
        //     {
        //         // White-Space ... do nothing
        //     }
        //     else if ( this.cur_char >= '+' ) 
        //     {  
        //         wl( "+ parse new term");
        //         /*
        //          * Operator '+' = parse new term and add the result to the current term result
        //          */
        //         term_result = term_result + this.parseTerm();

        //         wl( "########## + end result is " + term_result );

        //     }
        //     else if ( this.cur_char >= '*' ) 
        //     {  
        //         wl( "* parse new term");
        //         /*
        //          * Operator '*' = parse new term and add the result to the current term result
        //          */
        //         term_result = term_result * this.parseTerm();

        //         wl( "########## * end result is " + term_result );
        //     }
        // }

        return this.parseTerm();
    }

    public parseTerm() : number
    {

        let term_result : number = 0;

        while ( this.read() )
        {
            if ( this.cur_char === ' ' )
            {
                // White-Space ... do nothing
            }
            else if ( ( this.cur_char >= '0' ) && ( this.cur_char <= '9') )
            {  
                /*
                 * Number found 
                 */
                term_result = this.parseNumber();

                wl( padL( this.index_read, 4 ) + " Number        "  + padL( term_result, 8 ) );

                return term_result;
            }
            else if ( this.cur_char === '+' ) 
            {  
                wl( padL( this.index_read, 4 ) + " + parseTerm S "  + padL( term_result, 8 ) );

                /*
                 * Operator '+' = parse new term and add the result to the current term result
                 */
                term_result = term_result + this.parseTerm();

                wl( padL( this.index_read, 4 ) + " + parseTerm E "  + padL( term_result, 8 ) );

            }
            else if ( this.cur_char === '*' ) 
            {  
                wl( padL( this.index_read, 4 ) + " * parseTerm S "  + padL( term_result, 8 ) );
                /*
                 * Operator '*' = parse new term and add the result to the current term result
                 */
                term_result = term_result * this.parseTerm();

                wl( padL( this.index_read, 4 ) + " * parseTerm E "  + padL( term_result, 8 ) );
            }
            else if ( this.cur_char === ')' ) 
            {  
                wl( padL( this.index_read, 4 ) + " ) parseTerm E "  + padL( term_result, 8 ) );

                return term_result;
            }
            else if ( this.cur_char === '(' ) 
            {  
                wl( padL( this.index_read, 4 ) + " ( parseTerm S "  + padL( term_result, 8 ) );

                term_result = this.parseTerm();
            }
         }

        wl( padL( this.index_read, 4 ) + " End parseFkt  "  + padL( term_result, 8 ) );

         return term_result;
    }

    private parseParenthesis() : number
    {
        return 0;
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

        this.index_read--;

        return number_read;     
    }

    private readNumber() : boolean
    {
        /*
         * Read the next character from the input
         */
        this.read();

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


// testCalcFunction( "2 * 3 + (4 * 5)                                 ",    26, true );
// testCalcFunction( "5 + (8 * 3 + 9 + 3 * 4 * 3)                     ",   437, true );
// testCalcFunction( "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))       ", 12240, true );
// testCalcFunction( "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 ", 13632, true );

//calcArray( getTestArray1(), true );

//let test1 : FktParser = new FktParser( "2 * 3 + (4 * 5)" );
//let test1 : FktParser = new FktParser( "2 * 3 + (4 * 5)" );
let test1 : FktParser = new FktParser( "     2  *  3  + (    500   +      500 )  " );

let vv : number = test1.parseStart();

wl( "Resul is " + vv)

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

//checkReaddatei();

wl( "" )
wl( "Day 18 - End " );
