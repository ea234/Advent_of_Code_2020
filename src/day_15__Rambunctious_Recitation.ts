/*
 * https://adventofcode.com/2020/day/15
 * 
 * https://www.reddit.com/r/adventofcode/comments/kdf85p/2020_day_15_solutions/
 * 
 * 
  * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day15/day_15__Rambunctious_Recitation.js
 * 
 * Day 15 - Rambunctious Recitation
 * 
 *    1 Old Number      0
 *    2 Old Number      3
 *    3 Old Number      6
 *    4 Old Number      6  turn 1    3  turn 2   -1   New Number      0
 *    5 Old Number      0  turn 1    1  turn 2    4   New Number      3
 *    6 Old Number      3  turn 1    2  turn 2    5   New Number      3
 *    7 Old Number      3  turn 1    5  turn 2    6   New Number      1
 *    8 Old Number      1  turn 1    7  turn 2   -1   New Number      0
 *    9 Old Number      0  turn 1    4  turn 2    8   New Number      4
 *   10 Old Number      4  turn 1    9  turn 2   -1   New Number      0
 *   11 Old Number      0  turn 1    8  turn 2   10   New Number      2
 *   12 Old Number      2  turn 1   11  turn 2   -1   New Number      0
 *   13 Old Number      0  turn 1   10  turn 2   12   New Number      2
 *   14 Old Number      2  turn 1   11  turn 2   13   New Number      2
 *   15 Old Number      2  turn 1   13  turn 2   14   New Number      1
 *   16 Old Number      1  turn 1    7  turn 2   15   New Number      8
 *   17 Old Number      8  turn 1   16  turn 2   -1   New Number      0
 *   18 Old Number      0  turn 1   12  turn 2   17   New Number      5
 *   19 Old Number      5  turn 1   18  turn 2   -1   New Number      0
 *   20 Old Number      0  turn 1   17  turn 2   19   New Number      2
 *   ...
 * 2002 Old Number     57  turn 1 1811  turn 2 2001   New Number    190
 * 2003 Old Number    190  turn 1 2002  turn 2   -1   New Number      0
 * 2004 Old Number      0  turn 1 1995  turn 2 2003   New Number      8
 * 2005 Old Number      8  turn 1 1988  turn 2 2004   New Number     16
 * 2006 Old Number     16  turn 1 1609  turn 2 2005   New Number    396
 * 2007 Old Number    396  turn 1 2006  turn 2   -1   New Number      0
 * 2008 Old Number      0  turn 1 2003  turn 2 2007   New Number      4
 * 2009 Old Number      4  turn 1 1997  turn 2 2008   New Number     11
 * 2010 Old Number     11  turn 1 1946  turn 2 2009   New Number     63
 * 2011 Old Number     63  turn 1 1283  turn 2 2010   New Number    727
 * 2012 Old Number    727  turn 1 2011  turn 2   -1   New Number      0
 * 2013 Old Number      0  turn 1 2007  turn 2 2012   New Number      5
 * 2014 Old Number      5  turn 1 1975  turn 2 2013   New Number     38
 * 2015 Old Number     38  turn 1 1662  turn 2 2014   New Number    352
 * 2016 Old Number    352  turn 1 2015  turn 2   -1   New Number      0
 * 2017 Old Number      0  turn 1 2012  turn 2 2016   New Number      4
 * 2018 Old Number      4  turn 1 2008  turn 2 2017   New Number      9
 * 2019 Old Number      9  turn 1 1960  turn 2 2018   New Number     58
 * 2020 Old Number     58  turn 1 1583  turn 2 2019   New Number    436
 * 
 * 

 * Start-Numbers 0,3,6 = 436  => expected 436   OK
 * Start-Numbers 1,3,2 = 1    => expected 1     OK
 * Start-Numbers 2,1,3 = 10   => expected 10    OK
 * Start-Numbers 1,2,3 = 27   => expected 27    OK
 * Start-Numbers 2,3,1 = 78   => expected 78    OK
 * Start-Numbers 3,2,1 = 438  => expected 438   OK
 * Start-Numbers 3,1,2 = 1836 => expected 1836  OK
 * 
 * Start-Numbers 0,5,4,1,10,14,7 = 203 => expected 203  OK
 *  
 */

type PropertieNumbers = Record< string, number >;

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


function getNumber( pStartNumbers : string, pMaxRounds : number, pKnzDebug : boolean ) : number 
{
    let prop_num : PropertieNumbers = {};

    let array_start_numbers : number[] = pStartNumbers.split( "," ).map( Number );

    let turn_counter : number = 0;

    for ( let xturn of array_start_numbers )
    {
        turn_counter++;

        prop_num[ "turn_1_" + xturn ] = turn_counter;

        if ( pKnzDebug )
        {
            wl( padL( turn_counter, 4 ) + " Old Number " + padL( xturn, 6 )  );
        }
    }

    let new_number  : number = 0;
    let last_number : number = array_start_numbers[ array_start_numbers.length - 1 ]!;

    while ( turn_counter < pMaxRounds )
    {
        /*
         * Increase the turn counter by 1
         */
        turn_counter++;

        /*
         * Get the turns, when the last number were last spoken
         */
        let last_nr_spoken_turn_1 : number = prop_num[ "turn_1_" + last_number ] ?? -1;
        let last_nr_spoken_turn_2 : number = prop_num[ "turn_2_" + last_number ] ?? -1;

        if ( ( last_nr_spoken_turn_1 > 0 ) && ( last_nr_spoken_turn_2 > 0 ) )
        {
            new_number = last_nr_spoken_turn_2 - last_nr_spoken_turn_1;
        }
        else
        {
            new_number = 0;
        }

        /*
         * Get the turns, when the new number were last spoken
         */
        let new_nr_spoken_turn_1 : number = prop_num[ "turn_1_" + new_number ] ?? -1;
        let new_nr_spoken_turn_2 : number = prop_num[ "turn_2_" + new_number ] ?? -1;

        if ( ( new_nr_spoken_turn_1 > 0 ) && ( new_nr_spoken_turn_2 > 0 ) )
        {
            prop_num[ "turn_1_" + new_number ] = new_nr_spoken_turn_2;
            prop_num[ "turn_2_" + new_number ] = turn_counter;
        }
        else if ( ( new_nr_spoken_turn_1 > 0 ) && ( new_nr_spoken_turn_2 < 0 ) )
        {
            /*
             * The new number were once spoken before.
             * The new number needs to be stored in the "turn_2" location
             */
            prop_num[ "turn_2_" + new_number ] = turn_counter;
        }
        else
        {
            /*
             * The new number were never spoken before
             */
            prop_num[ "turn_1_" + new_number ] = turn_counter;
        }

        if ( pKnzDebug )
        {
            wl( padL( turn_counter, 6 ) + " Old Number " + padL( last_number, 6 ) + "  turn 1 " + padL( last_nr_spoken_turn_1, 4 ) + "  turn 2 " + padL( last_nr_spoken_turn_2, 4 ) + "   New Number " + padL( new_number, 6 ) );
        }

        last_number = new_number;
    }

    return last_number;
}

function testGetNumber( pStartNumbers : string, pMaxRounds : number, pExpect : number ) : void
{
    let number_from_function : number = getNumber( pStartNumbers, pMaxRounds, false );

    wl( "" );
    wl( "Start-Numbers " + pStartNumbers + " = " + number_from_function + " => expected " + pExpect + "  " + ( number_from_function === pExpect ? "OK" : "#### ERROR ####" ) );
}


wl( "" );
wl( "Day 15 - Rambunctious Recitation" );
wl( "" );

testGetNumber( "0,3,6", 2020, 436  );
testGetNumber( "1,3,2", 2020, 1    );
testGetNumber( "2,1,3", 2020, 10   );
testGetNumber( "1,2,3", 2020, 27   );
testGetNumber( "2,3,1", 2020, 78   );
testGetNumber( "3,2,1", 2020, 438  );
testGetNumber( "3,1,2", 2020, 1836 );

testGetNumber( "0,5,4,1,10,14,7", 2020, 203 );

//testGetNumber( "0,5,4,1,10,14,7", 30000000, -1 );

wl( "" )
wl( "Day 15 - End " );
