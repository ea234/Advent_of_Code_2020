import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/22
 * 
 * https://www.reddit.com/r/adventofcode/comments/khyjgv/2020_day_22_solutions/
 * 
 * 
  * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day22/day_22__Crab_Combat.js
 * 
 * Day 22 - Crab Combat
 * 
 * Player 1:
 * 9
 * 2
 * 6
 * 3
 * 1
 * 
 * Player 2:
 * 5
 * 8
 * 4
 * 7
 * 10
 * 
 * ---- Round 1 -------------------------------------------------------
 * Player 1 - Cards: 9, 2, 6, 3, 1
 * Player 2 - Cards: 5, 8, 4, 7, 10
 * Player 1 - plays: 9
 * Player 2 - plays: 5
 * Player 1 wins the round
 * 
 * ---- Round 2 -------------------------------------------------------
 * Player 1 - Cards: 2, 6, 3, 1, 9, 5
 * Player 2 - Cards: 8, 4, 7, 10
 * Player 1 - plays: 2
 * Player 2 - plays: 8
 * Player 2 wins the round
 * 
 * ---- Round 3 -------------------------------------------------------
 * Player 1 - Cards: 6, 3, 1, 9, 5
 * Player 2 - Cards: 4, 7, 10, 8, 2
 * Player 1 - plays: 6
 * Player 2 - plays: 4
 * Player 1 wins the round
 * 
 * ---- Round 4 -------------------------------------------------------
 * Player 1 - Cards: 3, 1, 9, 5, 6, 4
 * Player 2 - Cards: 7, 10, 8, 2
 * Player 1 - plays: 3
 * Player 2 - plays: 7
 * Player 2 wins the round
 * 
 * ---- Round 5 -------------------------------------------------------
 * Player 1 - Cards: 1, 9, 5, 6, 4
 * Player 2 - Cards: 10, 8, 2, 7, 3
 * Player 1 - plays: 1
 * Player 2 - plays: 10
 * Player 2 wins the round
 * 
 * ---- Round 6 -------------------------------------------------------
 * Player 1 - Cards: 9, 5, 6, 4
 * Player 2 - Cards: 8, 2, 7, 3, 10, 1
 * Player 1 - plays: 9
 * Player 2 - plays: 8
 * Player 1 wins the round
 * 
 * ---- Round 7 -------------------------------------------------------
 * Player 1 - Cards: 5, 6, 4, 9, 8
 * Player 2 - Cards: 2, 7, 3, 10, 1
 * Player 1 - plays: 5
 * Player 2 - plays: 2
 * Player 1 wins the round
 * 
 * ...
 * 
 * ---- Round 24 -------------------------------------------------------
 * Player 1 - Cards: 6, 4
 * Player 2 - Cards: 5, 1, 10, 8, 9, 7, 3, 2
 * Player 1 - plays: 6
 * Player 2 - plays: 5
 * Player 1 wins the round
 * 
 * ---- Round 25 -------------------------------------------------------
 * Player 1 - Cards: 4, 6, 5
 * Player 2 - Cards: 1, 10, 8, 9, 7, 3, 2
 * Player 1 - plays: 4
 * Player 2 - plays: 1
 * Player 1 wins the round
 * 
 * ---- Round 26 -------------------------------------------------------
 * Player 1 - Cards: 6, 5, 4, 1
 * Player 2 - Cards: 10, 8, 9, 7, 3, 2
 * Player 1 - plays: 6
 * Player 2 - plays: 10
 * Player 2 wins the round
 * 
 * ---- Round 27 -------------------------------------------------------
 * Player 1 - Cards: 5, 4, 1
 * Player 2 - Cards: 8, 9, 7, 3, 2, 10, 6
 * Player 1 - plays: 5
 * Player 2 - plays: 8
 * Player 2 wins the round
 * 
 * ---- Round 28 -------------------------------------------------------
 * Player 1 - Cards: 4, 1
 * Player 2 - Cards: 9, 7, 3, 2, 10, 6, 8, 5
 * Player 1 - plays: 4
 * Player 2 - plays: 9
 * Player 2 wins the round
 * 
 * ---- Round 29 -------------------------------------------------------
 * Player 1 - Cards: 1
 * Player 2 - Cards: 7, 3, 2, 10, 6, 8, 5, 9, 4
 * Player 1 - plays: 1
 * Player 2 - plays: 7
 * Player 2 wins the round
 * 
 * ---- Round 29 -------------------------------------------------------
 * 
 * Player 1 - Cards:
 * Player 2 - Cards: 3, 2, 10, 6, 8, 5, 9, 4, 7, 1
 * index   9  card    1 * mult     1 =     10
 * index   8  card    7 * mult     2 =     63
 * index   7  card    4 * mult     3 =     32
 * index   6  card    9 * mult     4 =     63
 * index   5  card    5 * mult     5 =     30
 * index   4  card    8 * mult     6 =     40
 * index   3  card    6 * mult     7 =     24
 * index   2  card   10 * mult     8 =     30
 * index   1  card    2 * mult     9 =      4
 * index   0  card    3 * mult    10 =      3
 * 
 * Result Part 1 = 306
 * Result Part 2 = 0
 * 
 * 
 * ---- Round 271 -------------------------------------------------------
 * 
 * Result Part 1 = 32199
 * Result Part 2 = 0
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


class Player 
{
    name : string;

    cards : number[] = [];

    constructor( pName : string )
    {
        this.name = pName;
    }

    public addCard( pNumber : number ) : void 
    {
        this.cards.push( pNumber );
    }

    public getTopCard() : number
    {
        return this.cards.shift() ?? -1;
    }

    public toStringCards() : string 
    {
        return this.cards.join( ", " );
    }

    public hasCards() : boolean
    {
        return this.cards.length > 0;
    }

    public calcScore( pKnzDebug : boolean ) : number 
    {
        let result_nr     : number = 0;

        let multiplicator : number = 1;

        for ( let index_nr : number = this.cards.length - 1; index_nr >= 0; index_nr-- )
        {
            if ( pKnzDebug )
            {
                wl( "index " + padL( index_nr, 3 ) + "  card " + padL( this.cards[ index_nr ]!, 4 ) + " * mult " + padL( multiplicator, 5 ) + " = " + padL( ( ( index_nr + 1 ) * this.cards[ index_nr ]! ), 6 ) );
            }

            result_nr += multiplicator * this.cards[ index_nr ]!;

            multiplicator++;
        }

        return result_nr;
    }

    public toString() 
    {
        return this.name;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let player_1 : Player = new Player( "1" );
    let player_2 : Player = new Player( "2" );

    let cur_player : Player = player_1;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str === "" )
        {
            // do nothing
        }
        else if ( cur_input_str === "Player 1:" )
        {
            cur_player = player_1;
        }
        else if ( cur_input_str === "Player 2:" )
        {
            cur_player = player_2;
        }
        else
        {
            cur_player.addCard( parseInt( cur_input_str, 10 ) ); 
        }

        wl( cur_input_str );
    }

    let round_nr : number = 0;

    while ( ( round_nr < 32_000 ) && ( player_1.hasCards()  && player_2.hasCards() ) )
    {
        round_nr++;

        if ( pKnzDebug )
        {
            wl( "" );
            wl( "---- Round " + round_nr + " -------------------------------------------------------" );
            wl( "Player 1 - Cards: " + player_1.toStringCards() );
            wl( "Player 2 - Cards: " + player_2.toStringCards() );
        }

        let card_player_1 : number = player_1.getTopCard();
        let card_player_2 : number = player_2.getTopCard();

        if ( pKnzDebug )
        {
            wl( "Player 1 - plays: " + card_player_1 );
            wl( "Player 2 - plays: " + card_player_2 );
        }

        if ( card_player_1 > card_player_2 )
        {
            if ( pKnzDebug )
            {
                wl( "Player 1 wins the round" );
            }

            player_1.addCard( card_player_1 );
            player_1.addCard( card_player_2 );
        }
        else if ( card_player_2 > card_player_1 )
        {
            if ( pKnzDebug )
            {
                wl( "Player 2 wins the round" );
            }

            player_2.addCard( card_player_2 );
            player_2.addCard( card_player_1 );
        }
    }

    wl( "" );
    wl( "---- Round " + round_nr + " -------------------------------------------------------" );

    if ( pKnzDebug )
    {
        wl( "" );
        wl( "Player 1 - Cards: " + player_1.toStringCards() );
        wl( "Player 2 - Cards: " + player_2.toStringCards() );
    }

    if ( player_1.hasCards() )
    {
        result_part_01 = player_1.calcScore( pKnzDebug );
    }
    else if ( player_2.hasCards() )
    {
        result_part_01 = player_2.calcScore( pKnzDebug );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day22_input.txt";

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

    array_test.push( "Player 1:" );
    array_test.push( "9"         );
    array_test.push( "2"         );
    array_test.push( "6"         );
    array_test.push( "3"         );
    array_test.push( "1"         );
    array_test.push( ""          );
    array_test.push( "Player 2:" );
    array_test.push( "5"         );
    array_test.push( "8"         );
    array_test.push( "4"         );
    array_test.push( "7"         );
    array_test.push( "10"        );

    return array_test;
}


wl( "" );
wl( "Day 22 - Crab Combat" );
wl( "" );

calcArray( getTestArray1(), true );

wl( "")
wl( "---------------------------------------------------------------")
wl( "")

checkReaddatei();

wl( "" )
wl( "Day 22 - End " );
