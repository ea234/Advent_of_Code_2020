import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/23
 * 
 * https://www.reddit.com/r/adventofcode/comments/kimluc/2020_day_23_solutions/
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


function toStringNumVec( pVektor : number[] ) : string 
{
    let str_result : string = "";

    for ( let cur_num of pVektor )
    {
        str_result += " " + padL( cur_num, 2 );
    }

    return str_result;
}


function calcString( pString : string ) : string 
{
    let num_vector_a : number[] = pString.trim().split( "" ).map( Number );

    let num_vector_b : number[] = [ ...num_vector_a ];

    let num_vector_length : number = num_vector_a.length;

    wl( "Num Vector Input " + toStringNumVec( num_vector_a ) );

    let move_nr  : number =   0;
    let move_max : number = 101;

    let current_cup_index : number = 0;
    let current_cup_label : number = 0;

    while ( move_nr <= move_max )
    {
        /*
         *****************************************************************************
         * Remove three cups immediately after the current cup
         *****************************************************************************
         */

        let remove_cup_1_index : number = current_cup_index + 1;
        let remove_cup_2_index : number = current_cup_index + 2;
        let remove_cup_3_index : number = current_cup_index + 3;
        
        if ( remove_cup_1_index >= num_vector_length ) { remove_cup_1_index -= num_vector_length; }
        if ( remove_cup_2_index >= num_vector_length ) { remove_cup_2_index -= num_vector_length; }
        if ( remove_cup_3_index >= num_vector_length ) { remove_cup_3_index -= num_vector_length; }

        let removed_cups : number[] = [ num_vector_a[ remove_cup_1_index ]!, num_vector_a[ remove_cup_2_index ]!, num_vector_a[ remove_cup_3_index ]! ];

        /*
         *****************************************************************************
         * Setting removed vector positions to -1
         *****************************************************************************
         */

        num_vector_a[ remove_cup_1_index ] = -1;
        num_vector_a[ remove_cup_2_index ] = -1;
        num_vector_a[ remove_cup_3_index ] = -1;

        /*
         *****************************************************************************
         * Closing the gap from the removed Elements
         *****************************************************************************
         */

        let shift_index_dest : number = remove_cup_1_index;
        let shift_index_src  : number = remove_cup_3_index + 1;

        if ( shift_index_dest >= num_vector_length ) { shift_index_dest -= num_vector_length; }
        if ( shift_index_src  >= num_vector_length ) { shift_index_src  -= num_vector_length; }

        let count_nr : number = 0;

        let max_label : number = -1;

        while ( count_nr < ( num_vector_length - 4 ) )
        {
            count_nr++;

            num_vector_a[ shift_index_dest ] = num_vector_a[ shift_index_src ]!;
            num_vector_a[ shift_index_src ] = -1;

            max_label = Math.max( max_label, num_vector_a[ shift_index_dest ]! );

            shift_index_dest++;
            shift_index_src++;

            if ( shift_index_dest >= num_vector_length ) { shift_index_dest -= num_vector_length; }
            if ( shift_index_src  >= num_vector_length ) { shift_index_src  -= num_vector_length; }
        }

        /*
         *****************************************************************************
         * Finding the insert label and index
         *****************************************************************************
         */

        let index_insert = -1;

        const findIndex = ( vector : number[], label : number ) : number => {

            for ( let idx = 0; idx < vector.length; idx++ )
            {
                if ( vector[ idx ] === label ) 
                {
                    return idx;
                }
            }

            return -1;
        }

        current_cup_label = num_vector_a[ current_cup_index ]!;

        let cup_destination_label = current_cup_label;

        while ( index_insert === -1 )
        {
            cup_destination_label--;

            if ( cup_destination_label < 0 )
            {
                cup_destination_label = max_label;
            }

            index_insert = findIndex( num_vector_a, cup_destination_label );

            //wl( "index insert = " + index_insert + "  cup_destination_label " + cup_destination_label );
        }

        //wl( "index insert = " + index_insert + "  cup_destination_label " + cup_destination_label );

        /*
         *****************************************************************************
         * Creating the new vector
         *****************************************************************************
         */

        let insert_index_dest : number = index_insert + 1;
        let insert_index_src  : number = index_insert + 1;

        if ( insert_index_dest >= num_vector_length ) { insert_index_dest -= num_vector_length; }
        if ( insert_index_src  >= num_vector_length ) { insert_index_src  -= num_vector_length; }

        while ( num_vector_a[ insert_index_src ] === -1 )
        {
            insert_index_src++;

            if ( insert_index_src  >= num_vector_length ) { insert_index_src  -= num_vector_length; }
        }

        count_nr = 0;

        while ( count_nr < num_vector_length )
        {
            if ( count_nr < 3 )
            {
                //wl( "A " + count_nr + " dest " + insert_index_dest + " src " + count_nr + "    " + num_arr[ insert_index_dest ] + " " + removed_cups[ count_nr ] )
                /*
                 * First 3 numbers are the removed numbers 
                 */
                num_vector_b[ insert_index_dest ] = removed_cups[ count_nr ]!;
            }
            else
            {
                //wl( "B " + count_nr + " dest " + insert_index_dest + " src " + insert_index_src + "    " + num_arr[ insert_index_dest ] + " " + num_arr[ insert_index_src ]! )

                num_vector_b[ insert_index_dest ] = num_vector_a[ insert_index_src ]!;

                insert_index_src++;

                if ( insert_index_src  >= num_vector_length ) { insert_index_src  -= num_vector_length; }

                while ( num_vector_a[ insert_index_src ] === -1 )
                {
                    insert_index_src++;
                    
                    if ( insert_index_src  >= num_vector_length ) { insert_index_src  -= num_vector_length; }
                }
            }

            count_nr++;

            insert_index_dest++;

            if ( insert_index_dest >= num_vector_length ) { insert_index_dest -= num_vector_length; }
        }

        for ( let copy_index = 0; copy_index < num_vector_a.length; copy_index++ )
        {
            num_vector_a[ copy_index ] = num_vector_b[ copy_index ]!;
        }

        wl( padL( move_nr, 3 ) + "  cup_label " + padL( current_cup_label, 3 ) + "  dest_label " + padL( cup_destination_label, 3 ) + "  removed " + toStringNumVec( removed_cups ) + "  result " + toStringNumVec( num_vector_a ) );

        current_cup_index++;

        if ( current_cup_index >= num_vector_length )
        {
            current_cup_index = 0;
        }

        move_nr++;
    }

    /*
     *****************************************************************************
     * Creating output string
     *****************************************************************************
     */

    return num_vector_a.join( "" );
}


wl( "" );
wl( "Day 23 - Crab Cups" );
wl( "" );

wl( calcString(  "389125467" ) );

//wl( calcString(  "1234567890" ) );

//wl( calcString(  "589174263" ) );

wl( "" )
wl( "Day 23 - End " );

/*



 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day23/day_23__Crab_Cups.js
 * 
 * Day 23 - Crab Cups
 * 
 * (9) [3, 8, 9, 1, 2, 5, 4, 6, 7]
 *   0  cup_label   3  dest_label   2  removed   8  9  1  result   3  2  8  9  1  5  4  6  7
 *   1  cup_label   2  dest_label   7  removed   8  9  1  result   3  2  5  4  6  7  8  9  1
 *   2  cup_label   5  dest_label   3  removed   4  6  7  result   7  2  5  8  9  1  3  4  6
 *   3  cup_label   8  dest_label   7  removed   9  1  3  result   3  2  5  8  4  6  7  9  1
 *   4  cup_label   4  dest_label   3  removed   6  7  9  result   9  2  5  8  4  1  3  6  7
 *   5  cup_label   1  dest_label   9  removed   3  6  7  result   7  2  5  8  4  1  9  3  6
 *   6  cup_label   9  dest_label   8  removed   3  6  7  result   8  3  6  7  4  1  9  2  5
 *   7  cup_label   2  dest_label   1  removed   5  8  3  result   7  4  1  5  8  3  9  2  6
 *   8  cup_label   6  dest_label   5  removed   7  4  1  result   5  7  4  1  8  3  9  2  6
 *   9  cup_label   5  dest_label   3  removed   7  4  1  result   5  8  3  7  4  1  9  2  6
 *  10  cup_label   8  dest_label   6  removed   3  7  4  result   5  8  1  9  2  6  3  7  4
 *  11  cup_label   1  dest_label   8  removed   9  2  6  result   2  6  1  3  7  4  5  8  9
 *  12  cup_label   3  dest_label   2  removed   7  4  5  result   5  6  1  3  8  9  2  7  4
 *  13  cup_label   8  dest_label   6  removed   9  2  7  result   2  7  1  3  8  4  5  6  9
 *  14  cup_label   4  dest_label   3  removed   5  6  9  result   3  5  6  9  8  4  2  7  1
 *  15  cup_label   2  dest_label   9  removed   7  1  3  result   9  7  1  3  8  4  2  5  6
 *  16  cup_label   5  dest_label   4  removed   6  9  7  result   3  8  4  6  9  7  2  5  1
 *  17  cup_label   1  dest_label   9  removed   3  8  4  result   6  9  3  8  4  7  2  5  1
 *  18  cup_label   6  dest_label   5  removed   9  3  8  result   6  4  7  2  5  9  3  8  1
 *  19  cup_label   4  dest_label   3  removed   7  2  5  result   6  4  9  3  7  2  5  8  1
 *  20  cup_label   9  dest_label   8  removed   3  7  2  result   6  4  9  5  8  3  7  2  1
 *  21  cup_label   5  dest_label   4  removed   8  3  7  result   3  7  9  5  2  1  6  4  8
 *  22  cup_label   2  dest_label   9  removed   1  6  4  result   1  6  4  5  2  8  3  7  9
 *  23  cup_label   8  dest_label   6  removed   3  7  9  result   7  9  4  5  2  8  1  6  3
 *  24  cup_label   1  dest_label   9  removed   6  3  7  result   3  7  4  5  2  8  1  9  6
 *  25  cup_label   9  dest_label   8  removed   6  3  7  result   5  2  8  6  3  7  1  9  4
 *  26  cup_label   4  dest_label   3  removed   5  2  8  result   6  3  5  2  8  7  1  9  4
 *  27  cup_label   6  dest_label   4  removed   3  5  2  result   6  8  7  1  9  4  3  5  2
 *  28  cup_label   8  dest_label   6  removed   7  1  9  result   9  8  4  3  5  2  6  7  1
 *  29  cup_label   4  dest_label   1  removed   3  5  2  result   9  8  4  6  7  1  3  5  2
 *  30  cup_label   6  dest_label   5  removed   7  1  3  result   9  8  4  6  5  7  1  3  2
 *  31  cup_label   5  dest_label   4  removed   7  1  3  result   7  1  3  6  5  2  9  8  4
 *  32  cup_label   2  dest_label   1  removed   9  8  4  result   8  4  3  6  5  2  7  1  9
 *  33  cup_label   7  dest_label   6  removed   1  9  8  result   6  1  9  8  5  2  7  4  3
 *  34  cup_label   4  dest_label   2  removed   3  6  1  result   8  5  2  3  6  1  7  4  9
 *  35  cup_label   9  dest_label   7  removed   8  5  2  result   3  6  1  7  8  5  2  4  9
 *  36  cup_label   3  dest_label   2  removed   6  1  7  result   3  8  5  2  6  1  7  4  9
 *  37  cup_label   8  dest_label   7  removed   5  2  6  result   3  8  1  7  5  2  6  4  9
 *  38  cup_label   1  dest_label   9  removed   7  5  2  result   3  8  1  6  4  9  7  5  2
 *  39  cup_label   6  dest_label   5  removed   4  9  7  result   3  8  1  6  5  4  9  7  2
 *  40  cup_label   5  dest_label   3  removed   4  9  7  result   7  8  1  6  5  2  3  4  9
 *  41  cup_label   2  dest_label   1  removed   3  4  9  result   3  4  9  6  5  2  7  8  1
 *  42  cup_label   7  dest_label   6  removed   8  1  3  result   6  8  1  3  5  2  7  4  9
 *  43  cup_label   4  dest_label   3  removed   9  6  8  result   3  9  6  8  5  2  7  4  1
 *  44  cup_label   1  dest_label   8  removed   3  9  6  result   8  3  9  6  5  2  7  4  1
 *  45  cup_label   8  dest_label   7  removed   3  9  6  result   8  5  2  7  3  9  6  4  1
 *  46  cup_label   5  dest_label   4  removed   2  7  3  result   8  5  9  6  4  2  7  3  1
 *  47  cup_label   9  dest_label   8  removed   6  4  2  result   2  5  9  7  3  1  8  6  4
 *  48  cup_label   7  dest_label   6  removed   3  1  8  result   2  5  9  7  6  3  1  8  4
 *  49  cup_label   6  dest_label   5  removed   3  1  8  result   1  8  9  7  6  4  2  5  3
 *  50  cup_label   4  dest_label   1  removed   2  5  3  result   3  8  9  7  6  4  1  2  5
 *  51  cup_label   1  dest_label   9  removed   2  5  3  result   2  5  3  7  6  4  1  8  9
 *  52  cup_label   8  dest_label   7  removed   9  2  5  result   7  9  2  5  6  4  1  8  3
 *  53  cup_label   3  dest_label   1  removed   7  9  2  result   5  6  4  1  7  9  2  8  3
 *  54  cup_label   5  dest_label   3  removed   6  4  1  result   5  7  9  2  8  3  6  4  1
 *  55  cup_label   7  dest_label   6  removed   9  2  8  result   5  7  3  6  9  2  8  4  1
 *  56  cup_label   3  dest_label   1  removed   6  9  2  result   5  7  3  8  4  1  6  9  2
 *  57  cup_label   8  dest_label   7  removed   4  1  6  result   1  6  3  8  9  2  5  7  4
 *  58  cup_label   9  dest_label   8  removed   2  5  7  result   8  2  5  7  9  4  1  6  3
 *  59  cup_label   4  dest_label   2  removed   1  6  3  result   6  3  5  7  9  4  8  2  1
 *  60  cup_label   8  dest_label   7  removed   2  1  6  result   7  2  1  6  9  4  8  3  5
 *  61  cup_label   3  dest_label   1  removed   5  7  2  result   5  7  2  6  9  4  8  3  1
 *  62  cup_label   1  dest_label   9  removed   5  7  2  result   6  9  5  7  2  4  8  3  1
 *  63  cup_label   6  dest_label   4  removed   9  5  7  result   6  2  4  9  5  7  8  3  1
 *  64  cup_label   2  dest_label   1  removed   4  9  5  result   6  2  7  8  3  1  4  9  5
 *  65  cup_label   7  dest_label   6  removed   8  3  1  result   1  2  7  4  9  5  6  8  3
 *  66  cup_label   4  dest_label   3  removed   9  5  6  result   1  2  7  4  8  3  9  5  6
 *  67  cup_label   8  dest_label   7  removed   3  9  5  result   3  9  5  4  8  6  1  2  7
 *  68  cup_label   6  dest_label   5  removed   1  2  7  result   1  2  7  4  8  6  3  9  5
 *  69  cup_label   3  dest_label   2  removed   9  5  1  result   5  1  7  4  8  6  3  2  9
 *  70  cup_label   2  dest_label   8  removed   9  5  1  result   4  8  9  5  1  6  3  2  7
 *  71  cup_label   7  dest_label   6  removed   4  8  9  result   5  1  6  4  8  9  3  2  7
 *  72  cup_label   5  dest_label   3  removed   1  6  4  result   5  8  9  3  1  6  4  2  7
 *  73  cup_label   8  dest_label   7  removed   9  3  1  result   5  8  6  4  2  7  9  3  1
 *  74  cup_label   6  dest_label   5  removed   4  2  7  result   7  8  6  9  3  1  5  4  2
 *  75  cup_label   9  dest_label   8  removed   3  1  5  result   1  5  6  9  4  2  7  8  3
 *  76  cup_label   4  dest_label   3  removed   2  7  8  result   1  5  6  9  4  3  2  7  8
 *  77  cup_label   3  dest_label   1  removed   2  7  8  result   8  5  6  9  4  3  1  2  7
 *  78  cup_label   1  dest_label   9  removed   2  7  8  result   9  2  7  8  4  3  1  5  6
 *  79  cup_label   5  dest_label   4  removed   6  9  2  result   8  4  6  9  2  3  1  5  7
 *  80  cup_label   7  dest_label   5  removed   8  4  6  result   9  2  3  1  5  8  4  6  7
 *  81  cup_label   9  dest_label   8  removed   2  3  1  result   9  5  8  2  3  1  4  6  7
 *  82  cup_label   5  dest_label   4  removed   8  2  3  result   9  5  1  4  8  2  3  6  7
 *  83  cup_label   1  dest_label   9  removed   4  8  2  result   2  5  1  3  6  7  9  4  8
 *  84  cup_label   3  dest_label   2  removed   6  7  9  result   9  5  1  3  4  8  2  6  7
 *  85  cup_label   4  dest_label   3  removed   8  2  6  result   3  8  2  6  4  7  9  5  1
 *  86  cup_label   7  dest_label   6  removed   9  5  1  result   6  9  5  1  4  7  3  8  2
 *  87  cup_label   3  dest_label   1  removed   8  2  6  result   1  8  2  6  4  7  3  9  5
 *  88  cup_label   9  dest_label   7  removed   5  1  8  result   6  4  7  5  1  8  3  9  2
 *  89  cup_label   2  dest_label   1  removed   6  4  7  result   5  1  6  4  7  8  3  9  2
 *  90  cup_label   5  dest_label   3  removed   1  6  4  result   5  7  8  3  1  6  4  9  2
 *  91  cup_label   7  dest_label   6  removed   8  3  1  result   5  7  6  8  3  1  4  9  2
 *  92  cup_label   6  dest_label   5  removed   8  3  1  result   1  7  6  4  9  2  5  8  3
 *  93  cup_label   4  dest_label   3  removed   9  2  5  result   1  7  6  4  8  3  9  2  5
 *  94  cup_label   8  dest_label   7  removed   3  9  2  result   9  2  6  4  8  5  1  7  3
 *  95  cup_label   5  dest_label   4  removed   1  7  3  result   4  1  7  3  8  5  9  2  6
 *  96  cup_label   9  dest_label   8  removed   2  6  4  result   3  8  2  6  4  5  9  1  7
 *  97  cup_label   1  dest_label   9  removed   7  3  8  result   6  4  5  9  7  3  8  1  2
 *  98  cup_label   2  dest_label   1  removed   6  4  5  result   9  7  3  8  1  6  4  5  2
 *  99  cup_label   9  dest_label   6  removed   7  3  8  result   9  1  6  7  3  8  4  5  2
 * 100  cup_label   1  dest_label   9  removed   6  7  3  result   3  1  8  4  5  2  9  6  7
 * 101  cup_label   8  dest_label   7  removed   4  5  2  result   3  1  8  9  6  7  4  5  2
 * 318967452
 * 
 * ---------------------------------------------------------------
 * 
 * Day 23 - End
589174263
*/
