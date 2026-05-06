/*
 * https://adventofcode.com/2020/day/23
 * 
 * https://www.reddit.com/r/adventofcode/comments/kimluc/2020_day_23_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day23/day_23__Crab_Cups.js
 * 
 * Day 23 - Crab Cups
 * 
 *   1  cup_idx   0  cup_label   3                                     input    3  8  9  1  2  5  4  6  7
 *   2  cup_idx   0  cup_label   3  dest_label   2  removed   8  9  1  result   3  2  8  9  1  5  4  6  7
 *   3  cup_idx   1  cup_label   2  dest_label   7  removed   8  9  1  result   3  2  5  4  6  7  8  9  1
 *   4  cup_idx   2  cup_label   5  dest_label   3  removed   4  6  7  result   7  2  5  8  9  1  3  4  6
 *   5  cup_idx   3  cup_label   8  dest_label   7  removed   9  1  3  result   3  2  5  8  4  6  7  9  1
 *   6  cup_idx   4  cup_label   4  dest_label   3  removed   6  7  9  result   9  2  5  8  4  1  3  6  7
 *   7  cup_idx   5  cup_label   1  dest_label   9  removed   3  6  7  result   7  2  5  8  4  1  9  3  6
 *   8  cup_idx   6  cup_label   9  dest_label   8  removed   3  6  7  result   8  3  6  7  4  1  9  2  5
 *   9  cup_idx   7  cup_label   2  dest_label   1  removed   5  8  3  result   7  4  1  5  8  3  9  2  6
 *  10  cup_idx   8  cup_label   6  dest_label   5  removed   7  4  1  result   5  7  4  1  8  3  9  2  6
 *  11  cup_idx   0  cup_label   5  dest_label   3  removed   7  4  1  result   5  8  3  7  4  1  9  2  6
 *  12  cup_idx   1  cup_label   8  dest_label   6  removed   3  7  4  result   5  8  1  9  2  6  3  7  4
 *  13  cup_idx   2  cup_label   1  dest_label   8  removed   9  2  6  result   2  6  1  3  7  4  5  8  9
 *  14  cup_idx   3  cup_label   3  dest_label   2  removed   7  4  5  result   5  6  1  3  8  9  2  7  4
 *  15  cup_idx   4  cup_label   8  dest_label   6  removed   9  2  7  result   2  7  1  3  8  4  5  6  9
 *  16  cup_idx   5  cup_label   4  dest_label   3  removed   5  6  9  result   3  5  6  9  8  4  2  7  1
 *  17  cup_idx   6  cup_label   2  dest_label   9  removed   7  1  3  result   9  7  1  3  8  4  2  5  6
 *  18  cup_idx   7  cup_label   5  dest_label   4  removed   6  9  7  result   3  8  4  6  9  7  2  5  1
 *  19  cup_idx   8  cup_label   1  dest_label   9  removed   3  8  4  result   6  9  3  8  4  7  2  5  1
 *  20  cup_idx   0  cup_label   6  dest_label   5  removed   9  3  8  result   6  4  7  2  5  9  3  8  1
 *  21  cup_idx   1  cup_label   4  dest_label   3  removed   7  2  5  result   6  4  9  3  7  2  5  8  1
 *  22  cup_idx   2  cup_label   9  dest_label   8  removed   3  7  2  result   6  4  9  5  8  3  7  2  1
 *  23  cup_idx   3  cup_label   5  dest_label   4  removed   8  3  7  result   3  7  9  5  2  1  6  4  8
 *  24  cup_idx   4  cup_label   2  dest_label   9  removed   1  6  4  result   1  6  4  5  2  8  3  7  9
 *  25  cup_idx   5  cup_label   8  dest_label   6  removed   3  7  9  result   7  9  4  5  2  8  1  6  3
 *  26  cup_idx   6  cup_label   1  dest_label   9  removed   6  3  7  result   3  7  4  5  2  8  1  9  6
 *  27  cup_idx   7  cup_label   9  dest_label   8  removed   6  3  7  result   5  2  8  6  3  7  1  9  4
 *  28  cup_idx   8  cup_label   4  dest_label   3  removed   5  2  8  result   6  3  5  2  8  7  1  9  4
 *  29  cup_idx   0  cup_label   6  dest_label   4  removed   3  5  2  result   6  8  7  1  9  4  3  5  2
 *  30  cup_idx   1  cup_label   8  dest_label   6  removed   7  1  9  result   9  8  4  3  5  2  6  7  1
 *  31  cup_idx   2  cup_label   4  dest_label   1  removed   3  5  2  result   9  8  4  6  7  1  3  5  2
 *  32  cup_idx   3  cup_label   6  dest_label   5  removed   7  1  3  result   9  8  4  6  5  7  1  3  2
 *  33  cup_idx   4  cup_label   5  dest_label   4  removed   7  1  3  result   7  1  3  6  5  2  9  8  4
 *  34  cup_idx   5  cup_label   2  dest_label   1  removed   9  8  4  result   8  4  3  6  5  2  7  1  9
 *  35  cup_idx   6  cup_label   7  dest_label   6  removed   1  9  8  result   6  1  9  8  5  2  7  4  3
 *  36  cup_idx   7  cup_label   4  dest_label   2  removed   3  6  1  result   8  5  2  3  6  1  7  4  9
 *  37  cup_idx   8  cup_label   9  dest_label   7  removed   8  5  2  result   3  6  1  7  8  5  2  4  9
 *  38  cup_idx   0  cup_label   3  dest_label   2  removed   6  1  7  result   3  8  5  2  6  1  7  4  9
 *  39  cup_idx   1  cup_label   8  dest_label   7  removed   5  2  6  result   3  8  1  7  5  2  6  4  9
 *  40  cup_idx   2  cup_label   1  dest_label   9  removed   7  5  2  result   3  8  1  6  4  9  7  5  2
 *  41  cup_idx   3  cup_label   6  dest_label   5  removed   4  9  7  result   3  8  1  6  5  4  9  7  2
 *  42  cup_idx   4  cup_label   5  dest_label   3  removed   4  9  7  result   7  8  1  6  5  2  3  4  9
 *  43  cup_idx   5  cup_label   2  dest_label   1  removed   3  4  9  result   3  4  9  6  5  2  7  8  1
 *  44  cup_idx   6  cup_label   7  dest_label   6  removed   8  1  3  result   6  8  1  3  5  2  7  4  9
 *  45  cup_idx   7  cup_label   4  dest_label   3  removed   9  6  8  result   3  9  6  8  5  2  7  4  1
 *  46  cup_idx   8  cup_label   1  dest_label   8  removed   3  9  6  result   8  3  9  6  5  2  7  4  1
 *  47  cup_idx   0  cup_label   8  dest_label   7  removed   3  9  6  result   8  5  2  7  3  9  6  4  1
 *  48  cup_idx   1  cup_label   5  dest_label   4  removed   2  7  3  result   8  5  9  6  4  2  7  3  1
 *  49  cup_idx   2  cup_label   9  dest_label   8  removed   6  4  2  result   2  5  9  7  3  1  8  6  4
 *  50  cup_idx   3  cup_label   7  dest_label   6  removed   3  1  8  result   2  5  9  7  6  3  1  8  4
 *  51  cup_idx   4  cup_label   6  dest_label   5  removed   3  1  8  result   1  8  9  7  6  4  2  5  3
 *  52  cup_idx   5  cup_label   4  dest_label   1  removed   2  5  3  result   3  8  9  7  6  4  1  2  5
 *  53  cup_idx   6  cup_label   1  dest_label   9  removed   2  5  3  result   2  5  3  7  6  4  1  8  9
 *  54  cup_idx   7  cup_label   8  dest_label   7  removed   9  2  5  result   7  9  2  5  6  4  1  8  3
 *  55  cup_idx   8  cup_label   3  dest_label   1  removed   7  9  2  result   5  6  4  1  7  9  2  8  3
 *  56  cup_idx   0  cup_label   5  dest_label   3  removed   6  4  1  result   5  7  9  2  8  3  6  4  1
 *  57  cup_idx   1  cup_label   7  dest_label   6  removed   9  2  8  result   5  7  3  6  9  2  8  4  1
 *  58  cup_idx   2  cup_label   3  dest_label   1  removed   6  9  2  result   5  7  3  8  4  1  6  9  2
 *  59  cup_idx   3  cup_label   8  dest_label   7  removed   4  1  6  result   1  6  3  8  9  2  5  7  4
 *  60  cup_idx   4  cup_label   9  dest_label   8  removed   2  5  7  result   8  2  5  7  9  4  1  6  3
 *  61  cup_idx   5  cup_label   4  dest_label   2  removed   1  6  3  result   6  3  5  7  9  4  8  2  1
 *  62  cup_idx   6  cup_label   8  dest_label   7  removed   2  1  6  result   7  2  1  6  9  4  8  3  5
 *  63  cup_idx   7  cup_label   3  dest_label   1  removed   5  7  2  result   5  7  2  6  9  4  8  3  1
 *  64  cup_idx   8  cup_label   1  dest_label   9  removed   5  7  2  result   6  9  5  7  2  4  8  3  1
 *  65  cup_idx   0  cup_label   6  dest_label   4  removed   9  5  7  result   6  2  4  9  5  7  8  3  1
 *  66  cup_idx   1  cup_label   2  dest_label   1  removed   4  9  5  result   6  2  7  8  3  1  4  9  5
 *  67  cup_idx   2  cup_label   7  dest_label   6  removed   8  3  1  result   1  2  7  4  9  5  6  8  3
 *  68  cup_idx   3  cup_label   4  dest_label   3  removed   9  5  6  result   1  2  7  4  8  3  9  5  6
 *  69  cup_idx   4  cup_label   8  dest_label   7  removed   3  9  5  result   3  9  5  4  8  6  1  2  7
 *  70  cup_idx   5  cup_label   6  dest_label   5  removed   1  2  7  result   1  2  7  4  8  6  3  9  5
 *  71  cup_idx   6  cup_label   3  dest_label   2  removed   9  5  1  result   5  1  7  4  8  6  3  2  9
 *  72  cup_idx   7  cup_label   2  dest_label   8  removed   9  5  1  result   4  8  9  5  1  6  3  2  7
 *  73  cup_idx   8  cup_label   7  dest_label   6  removed   4  8  9  result   5  1  6  4  8  9  3  2  7
 *  74  cup_idx   0  cup_label   5  dest_label   3  removed   1  6  4  result   5  8  9  3  1  6  4  2  7
 *  75  cup_idx   1  cup_label   8  dest_label   7  removed   9  3  1  result   5  8  6  4  2  7  9  3  1
 *  76  cup_idx   2  cup_label   6  dest_label   5  removed   4  2  7  result   7  8  6  9  3  1  5  4  2
 *  77  cup_idx   3  cup_label   9  dest_label   8  removed   3  1  5  result   1  5  6  9  4  2  7  8  3
 *  78  cup_idx   4  cup_label   4  dest_label   3  removed   2  7  8  result   1  5  6  9  4  3  2  7  8
 *  79  cup_idx   5  cup_label   3  dest_label   1  removed   2  7  8  result   8  5  6  9  4  3  1  2  7
 *  80  cup_idx   6  cup_label   1  dest_label   9  removed   2  7  8  result   9  2  7  8  4  3  1  5  6
 *  81  cup_idx   7  cup_label   5  dest_label   4  removed   6  9  2  result   8  4  6  9  2  3  1  5  7
 *  82  cup_idx   8  cup_label   7  dest_label   5  removed   8  4  6  result   9  2  3  1  5  8  4  6  7
 *  83  cup_idx   0  cup_label   9  dest_label   8  removed   2  3  1  result   9  5  8  2  3  1  4  6  7
 *  84  cup_idx   1  cup_label   5  dest_label   4  removed   8  2  3  result   9  5  1  4  8  2  3  6  7
 *  85  cup_idx   2  cup_label   1  dest_label   9  removed   4  8  2  result   2  5  1  3  6  7  9  4  8
 *  86  cup_idx   3  cup_label   3  dest_label   2  removed   6  7  9  result   9  5  1  3  4  8  2  6  7
 *  87  cup_idx   4  cup_label   4  dest_label   3  removed   8  2  6  result   3  8  2  6  4  7  9  5  1
 *  88  cup_idx   5  cup_label   7  dest_label   6  removed   9  5  1  result   6  9  5  1  4  7  3  8  2
 *  89  cup_idx   6  cup_label   3  dest_label   1  removed   8  2  6  result   1  8  2  6  4  7  3  9  5
 *  90  cup_idx   7  cup_label   9  dest_label   7  removed   5  1  8  result   6  4  7  5  1  8  3  9  2
 *  91  cup_idx   8  cup_label   2  dest_label   1  removed   6  4  7  result   5  1  6  4  7  8  3  9  2
 *  92  cup_idx   0  cup_label   5  dest_label   3  removed   1  6  4  result   5  7  8  3  1  6  4  9  2
 *  93  cup_idx   1  cup_label   7  dest_label   6  removed   8  3  1  result   5  7  6  8  3  1  4  9  2
 *  94  cup_idx   2  cup_label   6  dest_label   5  removed   8  3  1  result   1  7  6  4  9  2  5  8  3
 *  95  cup_idx   3  cup_label   4  dest_label   3  removed   9  2  5  result   1  7  6  4  8  3  9  2  5
 *  96  cup_idx   4  cup_label   8  dest_label   7  removed   3  9  2  result   9  2  6  4  8  5  1  7  3
 *  97  cup_idx   5  cup_label   5  dest_label   4  removed   1  7  3  result   4  1  7  3  8  5  9  2  6
 *  98  cup_idx   6  cup_label   9  dest_label   8  removed   2  6  4  result   3  8  2  6  4  5  9  1  7
 *  99  cup_idx   7  cup_label   1  dest_label   9  removed   7  3  8  result   6  4  5  9  7  3  8  1  2
 * 100  cup_idx   8  cup_label   2  dest_label   1  removed   6  4  5  result   9  7  3  8  1  6  4  5  2
 * 101  cup_idx   0  cup_label   9  dest_label   6  removed   7  3  8  result   9  1  6  7  3  8  4  5  2
 * 
 * index_1_from 2, index_1_to =>10, length 8, str_result  67384529
 * 
 * Result Part 1 67384529
 * 
 * Day 23 - End
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


function toStringNumVec( pVector : number[] ) : string 
{
    let str_result : string = "";

    for ( let cur_num of pVector )
    {
        str_result += " " + padL( cur_num, 2 );
    }

    return str_result;
}


function findIndex( pVector : number[], pLabel : number ) : number 
{
    for ( let idx = 0; idx < pVector.length; idx++ )
    {
        if ( pVector[ idx ] === pLabel ) 
        {
            return idx;
        }
    }

    return -1;
}


function calcString( pString : string ) : string 
{
    /*
     * Using 2 Vectors to minimize ram usage
     * Vector "num_vector_b" is only for temp usage.
     */

    let num_vector_a : number[] = pString.trim().split( "" ).map( Number );

    let num_vector_b : number[] = [ ...num_vector_a ];

    let num_vector_length : number = num_vector_a.length;

    let move_nr  : number =   1;

    let move_max : number = 101;

    let current_cup_index : number = 0;


    const incIndex = ( pIndex : number, pAmount : number = 1 ) => {

        pIndex += pAmount;

        if ( pIndex >= num_vector_length )
        {
            return pIndex - num_vector_length;
        }

        return pIndex;        
    }


    wl( padL( move_nr, 3 ) + "  cup_idx " + padL( current_cup_index, 3 ) + "  cup_label " + padL( num_vector_a[ current_cup_index ]!, 3 ) + "  input  " + toStringNumVec( num_vector_a ) );

    while ( move_nr < move_max )
    {
        /*
         *****************************************************************************
         * Remove three cups immediately after the current cup
         *****************************************************************************
         */

        let remove_cup_1_index : number = incIndex( current_cup_index    );
        let remove_cup_2_index : number = incIndex( current_cup_index, 2 );
        let remove_cup_3_index : number = incIndex( current_cup_index, 3 );

        let removed_cups : number[] = [ num_vector_a[ remove_cup_1_index ]!, num_vector_a[ remove_cup_2_index ]!, num_vector_a[ remove_cup_3_index ]! ];

        /*
         *****************************************************************************
         * Setting removed vector positions to -1
         *****************************************************************************
         */

        num_vector_a[ remove_cup_1_index ] = -1;
        num_vector_a[ remove_cup_2_index ] = -1;
        num_vector_a[ remove_cup_3_index ] = -1;

        //wl( "after remove     " + toStringNumVec( num_vector_a )  + "   Removed " + toStringNumVec( removed_cups ) );

        /*
         *****************************************************************************
         * Closing the gap from the removed Elements
         *****************************************************************************
         */

        let shift_index_dest : number = remove_cup_1_index;

        let shift_index_src  : number = incIndex( remove_cup_3_index );

        let count_nr  : number = 0;

        let max_label : number = -1;

        while ( count_nr < ( num_vector_length - 4 ) )
        {
            count_nr++;

            num_vector_a[ shift_index_dest ] = num_vector_a[ shift_index_src ]!;
            num_vector_a[ shift_index_src  ] = -1;

            max_label = Math.max( max_label, num_vector_a[ shift_index_dest ]! );

            shift_index_dest = incIndex( shift_index_dest );
            shift_index_src  = incIndex( shift_index_src  );
        }

        //wl( "after shift      " + toStringNumVec( num_vector_a ) );

        /*
         *****************************************************************************
         * Finding the insert label and index
         *****************************************************************************
         */

        let insert_index_a = -1;

        let current_cup_label : number = num_vector_a[ current_cup_index ]!;

        let cup_destination_label = current_cup_label;

        while ( insert_index_a === -1 )
        {
            cup_destination_label--;

            if ( cup_destination_label < 0 )
            {
                cup_destination_label = max_label;
            }

            insert_index_a = findIndex( num_vector_a, cup_destination_label );
        }

        //wl( "index insert = " + insert_index_a + "  cup_destination_label " + cup_destination_label );

        /*
         *****************************************************************************
         * Creating the new vector
         *****************************************************************************
         */

        let insert_index_dest : number = incIndex( insert_index_a );
        let insert_index_src  : number = incIndex( insert_index_a );

        while ( num_vector_a[ insert_index_src ] === -1 )
        {
            insert_index_src = incIndex( insert_index_src );
        }

        count_nr = 0;

        while ( count_nr < num_vector_length )
        {
            if ( count_nr < 3 )
            {
                //wl( "A " + count_nr + " dest " + insert_index_dest + " src " + count_nr + "    " + num_vector_a[ insert_index_dest ] + " " + removed_cups[ count_nr ] )

                /*
                 * First 3 numbers are the removed numbers 
                 */
                num_vector_b[ insert_index_dest ] = removed_cups[ count_nr ]!;
            }
            else
            {
                //wl( "B " + count_nr + " dest " + insert_index_dest + " src " + insert_index_src + "    " + num_vector_a[ insert_index_dest ] + " " + num_vector_b[ insert_index_src ]! )

                num_vector_b[ insert_index_dest ] = num_vector_a[ insert_index_src ]!;

                insert_index_src = incIndex( insert_index_src );

                while ( num_vector_a[ insert_index_src ] === -1 )
                {
                    insert_index_src = incIndex( insert_index_src );
                }
            }

            count_nr++;

            insert_index_dest = incIndex( insert_index_dest );
        }

        for ( let copy_index = 0; copy_index < num_vector_a.length; copy_index++ )
        {
            num_vector_a[ copy_index ] = num_vector_b[ copy_index ]!;
        }

        move_nr++;

        wl( padL( move_nr, 3 ) + "  cup_idx " + padL( current_cup_index, 3 ) + "  cup_label " + padL( current_cup_label, 3 ) + "  dest_label " + padL( cup_destination_label, 3 ) + "  removed " + toStringNumVec( removed_cups ) + "  result " + toStringNumVec( num_vector_a ) );

        current_cup_index = incIndex( current_cup_index );
    }

    /*
     *****************************************************************************
     * Creating output string
     *****************************************************************************
     */

    let string_string = num_vector_a.join( "" ) + num_vector_a.join( "" );

    let index_1_from : number = string_string.indexOf( "1" ) + 1;

    let index_1_to   : number = string_string.indexOf( "1" , index_1_from );

    let str_result   : string = string_string.substring( index_1_from, index_1_to );

    wl( "" );
    wl( "index_1_from " + index_1_from + ", index_1_to =>" + index_1_to + ", length " + ( index_1_to - index_1_from ) + ", str_result  " + str_result + " " );
    wl( "" );

    return str_result;
}


wl( "" );
wl( "Day 23 - Crab Cups" );
wl( "" );

wl( "Result Part 1 " + calcString(  "389125467" ) );

//wl( "Result Part 1 " + calcString(  "589174263" ) ); // 43896725

wl( "" )
wl( "Day 23 - End " );

