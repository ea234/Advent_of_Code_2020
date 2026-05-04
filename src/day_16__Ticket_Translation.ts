import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/16
 * 
 * https://www.reddit.com/r/adventofcode/comments/ke2qp6/2020_day_16_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day16/day_16__Ticket_Translation.js
 * 
 * Day 16 - Ticket Translation
 * 
 * ----------------------------------------------------------------------
 * Check Input Data 7,1,14
 * Nr no Category
 * 
 * Category class - OK - 1
 * Category row - OK - 7
 * Category seat - OK - 14
 * 
 * ----------------------------------------------------------------------
 * Check Input Data 7,3,47
 * Nr no Category
 * 
 * Category class - OK - 3
 * Category row - OK - 7
 * Category seat - OK - 47
 * 
 * ----------------------------------------------------------------------
 * Check Input Data 40,4,50
 * Nr no Category   4
 * 
 * Category class - no value ####
 * Category row - OK - 40
 * Category seat - OK - 50
 * 
 * ----------------------------------------------------------------------
 * Check Input Data 55,2,20
 * Nr no Category   55
 * 
 * Category class - OK - 2
 * Category row - no value ####
 * Category seat - OK - 20
 * 
 * ----------------------------------------------------------------------
 * Check Input Data 38,6,12
 * Nr no Category   12
 * 
 * Category class - OK - 6
 * Category row - OK - 6
 * Category seat - OK - 38
 * 
 * Parsed Categories
 * CategoryX class:,  1 - 3,  5 - 7
 * CategoryX row:,  6 - 11,  33 - 44
 * CategoryX seat:,  13 - 40,  45 - 50
 * 
 * Result Part 1 = 71
 * Result Part 2 = 0
 * 
 * ---------------------------------------------------------------
 * 
 * Day 16 - End
 * 
 * ----------------------------------------------------------------------
 * Check Input Data 127,83,79,197,157,67,71,131,97,193,181,191,163,61,53,89,59,137,73,167
 * Nr no Category
 * 
 * departure_location 167
 * departure_station  167
 * departure_platform 167
 * departure_track    167
 * departure_date     167
 * departure_time     167
 * 
 * result.mult_sum    21691961596369
 * 
 * Category departure location - OK - 167
 * Category departure station - OK - 167
 * Category departure platform - OK - 167
 * Category departure track - OK - 167
 * Category departure date - OK - 167
 * Category departure time - OK - 167
 * Category arrival location - OK - 167
 * Category arrival station - OK - 167
 * Category arrival platform - OK - 167
 * Category arrival track - OK - 167
 * Category class - OK - 167
 * Category duration - OK - 167
 * Category price - OK - 167
 * Category route - OK - 167
 * Category row - OK - 167
 * Category seat - OK - 167
 * Category train - OK - 167
 * Category type - OK - 167
 * Category wagon - OK - 167
 * Category zone - OK - 167
 * 
 * Result Part 1 = 20091
 * Result Part 2 = 21691961596369
 * 
 */

type PropertieCategory = Record< string, Category >;
type PropertieNumber   = Record< string, number   >;

type CheckResult = { knz_ok : number, nr_no_cat : number[], nr_no_cat_sum : number, mult_sum_departure : number };

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


class Range 
{
    min_val : number = 0;

    max_val : number = Number.MAX_SAFE_INTEGER;

    constructor( pRange : string )
    {
        let [ p_min, p_max ] : number[] = pRange.split( "-" ).map( Number );

        this.min_val = p_min!;
        this.max_val = p_max!;
    }

    public getMax() : number 
    { 
        return this.max_val; 
    }

    public getMin() : number
    { 
        return this.min_val; 
    }

    public checkNumber( pNumber : number ) : boolean
    {
        return ( pNumber >= this.min_val ) && ( pNumber <= this.max_val );
    }

    public toString() : string 
    {
        return this.min_val + " - " + this.max_val;
    }
}


class Category
{
    name   : string = "";

    ranges : Range[] = [];

    constructor( pInput : string )
    {
        let [ p_name, p_rest ] : string[] = pInput.split( ":" );

        this.name = p_name!;

        let [ p_range_1, p_range_2 ] : string[] = p_rest!.split( "or" );

        this.ranges.push( new Range( p_range_1! ) );
        this.ranges.push( new Range( p_range_2! ) );
    }

    public checkNumber( pNumber : number ) : boolean
    {
        for ( let cur_range of this.ranges )
        {
            if ( cur_range.checkNumber( pNumber) )
            {
                return true;
            }
        }

        return false;
    }

    public getName() : string 
    {
        return this.name;
    }

    private toStringRanges() : string 
    {
        let res_string : string = "";

        for ( let cur_range of this.ranges )
        {
            res_string += ",  " + cur_range.toString();            
        }

        return res_string;
    }

    public toString() : string 
    {
        return this.name + ":" + this.toStringRanges();
    }
}


function checkTicket( pInput : string, pCategoryProperties : PropertieCategory, pCategoryNames : string[], pKnzDebug : boolean ) : CheckResult
{
    let prop_numbers : PropertieNumber = {};

    let input_data : number[] = pInput.split( "," ).map( Number );

    let chek_result : CheckResult = { knz_ok : 1, nr_no_cat : [], nr_no_cat_sum : 0, mult_sum_departure : 0 }

    for ( let cur_number of input_data )
    {
        let nr_of_categories : number = 0;

        for ( let cur_cat_name of pCategoryNames )
        {
            let cur_cat_inst = pCategoryProperties[ cur_cat_name ]!;

            if ( cur_cat_inst.checkNumber( cur_number ) ) 
            {
                prop_numbers[ cur_cat_inst.getName() ] = cur_number;

                nr_of_categories++;
            }
        }

        if ( nr_of_categories === 0 )
        {
            chek_result.nr_no_cat.push( cur_number );

            chek_result.nr_no_cat_sum += cur_number;
        }
    }

    /*
     * Part 2
     * Multiplieing all departure numbers
     */

    let departure_location : number = prop_numbers[ "departure location" ] ?? 0;
    let departure_station  : number = prop_numbers[ "departure station"  ] ?? 0;
    let departure_platform : number = prop_numbers[ "departure platform" ] ?? 0;
    let departure_track    : number = prop_numbers[ "departure track"    ] ?? 0;
    let departure_date     : number = prop_numbers[ "departure date"     ] ?? 0;
    let departure_time     : number = prop_numbers[ "departure time"     ] ?? 0;

    chek_result.mult_sum_departure = departure_location * departure_station * departure_platform * departure_track * departure_date * departure_time ;

    
    if ( pKnzDebug )
    {
        wl( "" );
        wl( "----------------------------------------------------------------------" );
        wl( "Check Input Data " + pInput );
        wl( "Nr no Category   " + Array.from( chek_result.nr_no_cat.values() ).join( ", " ) );
        wl( "" );

        if ( chek_result.mult_sum_departure > 0 )
        {
            wl( "departure_location " + departure_location );
            wl( "departure_station  " + departure_station  );
            wl( "departure_platform " + departure_platform );
            wl( "departure_track    " + departure_track    );
            wl( "departure_date     " + departure_date     );
            wl( "departure_time     " + departure_time     );
            wl( "" );
            wl( "result.mult_sum    " + chek_result.mult_sum_departure    );
            wl( "" );
        }
    }

    for ( let cur_cat_name of pCategoryNames )
    {
        let cur_number : number = prop_numbers[ cur_cat_name ] ?? -1;

        if ( cur_number === -1 )
        {
            if ( pKnzDebug )
            {
                wl( "Category " + cur_cat_name + " - no value ####" );
            }

            chek_result.knz_ok = 0;
        }
        else
        {
            if ( pKnzDebug )
            {
                wl( "Category " + cur_cat_name + " - OK - " + cur_number );
            }
        }
    }

    return chek_result;
}

function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let parse_nr       : number = 0;

    let category_prop  : PropertieCategory = {};
    let category_vec   : string[]          = [];

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str === "" )
        {
            // ignore empty strings          
        }
        else if ( cur_input_str === "your ticket:" )
        {
            parse_nr = 1;
        }
        else if ( cur_input_str === "nearby tickets:" )
        {
            parse_nr = 2;

            //break;
        }
        else if ( parse_nr === 0 )
        {
            let cur_cat : Category = new Category( cur_input_str );

            category_vec.push( cur_cat.getName() );

            category_prop[ cur_cat.getName() ] = cur_cat;
        }
        else
        {
            let result_c : CheckResult = checkTicket( cur_input_str, category_prop, category_vec, ( pKnzDebug ) || ( parse_nr === 1 ) );

            result_part_01 += result_c.nr_no_cat_sum;

            if ( parse_nr === 1 )
            {
                result_part_02 = result_c.mult_sum_departure;
            }
        }
    }

    if ( pKnzDebug )
    {
        wl( "" );
        wl( "Parsed Categories" );

        for ( let cur_cat_name of category_vec )
        {
            wl( "CategoryX " + category_prop[ cur_cat_name ]!.toString() );
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day16_input.txt";

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

    array_test.push( "class: 1-3 or 5-7"    );
    array_test.push( "row: 6-11 or 33-44"   );
    array_test.push( "seat: 13-40 or 45-50" );
    array_test.push( ""                     );
    array_test.push( "your ticket:"         );
    array_test.push( "7,1,14"               );
    array_test.push( ""                     );
    array_test.push( "nearby tickets:"      );
    array_test.push( "7,3,47"               );
    array_test.push( "40,4,50"              );
    array_test.push( "55,2,20"              );
    array_test.push( "38,6,12"              );

    return array_test;
}


wl( "" );
wl( "Day 16 - Ticket Translation" );
wl( "" );

calcArray( getTestArray1(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

checkReaddatei();

wl( "" )
wl( "Day 16 - End " );
