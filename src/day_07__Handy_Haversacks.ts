import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/7
 * 
 * https://www.reddit.com/r/adventofcode/comments/k8a31f/2020_day_07_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day07/day_07__Handy_Haversacks.js
 * 
 * Day 07 - Handy Haversacks
 * 
 * bag bright white contains 1 contains shiny gold
 * bag muted yellow contains 2 contains shiny gold
 * 
 * bag bright white contains 1 contains shiny gold
 * bag muted yellow contains 2 contains shiny gold
 * 
 * bag bright white contains 1 contains shiny gold
 * 
 * bag muted yellow contains 2 contains shiny gold
 * 
 * Result Part 1 = 4
 * Result Part 2 = 6
 * 
 * Day 07 - End
 * 
 */

type PropertieNumber = Record< string, number >;

const SPLITT_STRING : string = "|";

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


class BagType
{
    type_name : string; 

    contains_bags : PropertieNumber = {};

    constructor( pString : string )
    {
        let cur_string : string = pString.replaceAll( "bags", "bag" ).replaceAll( " bag,", SPLITT_STRING ).replaceAll( " bag.", "" ).replaceAll( "bag contain", SPLITT_STRING );

        let bag_vector : string[] = cur_string.split( SPLITT_STRING ).map( (a) => a.trim() );

        this.type_name = bag_vector[ 0 ]!;

        for ( let idx = 1; idx < bag_vector.length; idx++ )
        {
            if ( bag_vector[ idx ] !== "no other" )
            {
                let contains_number_of_bags : number = bag_vector[ idx ]!.charCodeAt( 0 ) - 48;

                let contains_bag_name       : string = bag_vector[ idx ]!.substring( 2 );

                this.contains_bags[ contains_bag_name ] = contains_number_of_bags;
            }
        }
    }

    public isName( pName : string ) : boolean 
    {
        return this.type_name === pName;
    }

    public isNot( pName : string ) : boolean 
    {
        return this.type_name !== pName;
    }

    public contains( pVector : BagType[], pTypeName : string ) : number
    {
        if ( this.type_name === pTypeName )
        {
            return 0; // cant contain itself
        }

        let count_bag_numbers : number = 0;

        for ( const cur_bag_type_name of Object.keys( this.contains_bags ) ) 
        { 
            const contains_number_of_bags : number = this.contains_bags[ cur_bag_type_name ]!; 

            if ( cur_bag_type_name === pTypeName )
            {
                count_bag_numbers++;

                //count_bag_numbers += contains_number_of_bags;

                wl( "bag " + this.type_name + " contains " + contains_number_of_bags + " contains " + cur_bag_type_name );
            }

            if ( contains_number_of_bags > 0 )
            {
                let cur_bag = getBag( pVector, cur_bag_type_name );

                if ( cur_bag !== undefined )
                {
                    if ( cur_bag.isNot( this.type_name ) )
                    {
                        count_bag_numbers += cur_bag.contains( pVector, pTypeName );
                    }
                }
            }
        }

        return count_bag_numbers;
    }
}


function getBag( pVector : BagType[], pTypeName : string ) : BagType | undefined
{
    for ( const cur_bag of pVector ) 
    {
        if ( cur_bag.isName( pTypeName ) ) return cur_bag;
    }

    return undefined;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let bag_vector : BagType[] = [];

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str !== "" )
        {
            bag_vector.push( new BagType( cur_input_str ) );
        }
    }

    let str_bag_type : string = "shiny gold";

    for ( const cur_bag of bag_vector ) 
    {
        wl( "" );

        let nr_of_bags : number = cur_bag.contains( bag_vector, str_bag_type );

        if ( nr_of_bags > 0 )
        {
            result_part_01++;
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day07_input.txt";

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

    array_test.push( "light red bags contain 1 bright white bag, 2 muted yellow bags."    );
    array_test.push( "dark orange bags contain 3 bright white bags, 4 muted yellow bags." );
    array_test.push( "bright white bags contain 1 shiny gold bag."                        );
    array_test.push( "muted yellow bags contain 2 shiny gold bags, 9 faded blue bags."    );
    array_test.push( "shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags."     );
    array_test.push( "dark olive bags contain 3 faded blue bags, 4 dotted black bags."    );
    array_test.push( "vibrant plum bags contain 5 faded blue bags, 6 dotted black bags."  );
    array_test.push( "faded blue bags contain no other bags."                             );
    array_test.push( "dotted black bags contain no other bags."                           );

    return array_test;
}


wl( "" );
wl( "Day 07 - Handy Haversacks" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 07 - End " );
