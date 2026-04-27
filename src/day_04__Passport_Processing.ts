import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/4
 * 
 * https://www.reddit.com/r/adventofcode/comments/k6e8sw/2020_day_04_solutions/
 * 
 */

const FIELD_BIRTH_YEAR      : string = "byr:";
const FIELD_ISSUE_YEAR      : string = "iyr:";
const FIELD_EXPIRATION_YEAR : string = "eyr:";
const FIELD_HEIGHT          : string = "hgt:";
const FIELD_HAIR_COLOR      : string = "hcl:";
const FIELD_EYE_COLOR       : string = "ecl:";
const FIELD_PASSPORT_ID     : string = "pid:";
const FIELD_COUNTRY_ID      : string = "cid:";

const CHECK_FIELDS_NEEDED   : string[] = [ FIELD_BIRTH_YEAR, FIELD_ISSUE_YEAR, FIELD_EXPIRATION_YEAR, FIELD_HEIGHT, FIELD_HAIR_COLOR, FIELD_EYE_COLOR, FIELD_PASSPORT_ID ];

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}

type PassPortCheckResult = { knz_ok : boolean, fields_ok : string, fields_missing : string };

function checkPassPort( pInput : string ) : PassPortCheckResult
{
    let check_result : PassPortCheckResult = { knz_ok : true, fields_ok : "", fields_missing : "" };

    for ( const check_field of CHECK_FIELDS_NEEDED )
    {
        if ( pInput.indexOf( check_field ) === -1 )
        {
            check_result.knz_ok = false;

            check_result.fields_missing += check_field;
        }
        else
        {
            check_result.fields_ok += check_field;
        }
    }

    if ( pInput.indexOf( FIELD_COUNTRY_ID ) === -1 )
    {
        check_result.fields_missing += FIELD_COUNTRY_ID;
    }
    else
    {
        check_result.fields_ok += FIELD_COUNTRY_ID;
    }

    return check_result;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let pass_port_data : string = "";

    pArray.push( "" ); // Extra empty row for the last passport

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str === "" )
        {
            if ( pass_port_data != "" )
            {
                let check_result : PassPortCheckResult = checkPassPort( pass_port_data );

                if ( check_result.knz_ok )
                {
                    result_part_01++;
                }
            }

            pass_port_data = "";
        }
        else 
        {
            pass_port_data += "," + cur_input_str;
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2020__day04_input.txt";

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

    array_test.push( "ecl:gry pid:860033327 eyr:2020 hcl:#fffffd"      );
    array_test.push( "byr:1937 iyr:2017 cid:147 hgt:183cm"             );
    array_test.push( ""                                                );
    array_test.push( "iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884" );
    array_test.push( "hcl:#cfa07d byr:1929"                            );
    array_test.push( ""                                                );
    array_test.push( "hcl:#ae17e1 iyr:2013"                            );
    array_test.push( "eyr:2024"                                        );
    array_test.push( "ecl:brn pid:760753108 byr:1931"                  );
    array_test.push( "hgt:179cm"                                       );
    array_test.push( ""                                                );
    array_test.push( "hcl:#cfa07d eyr:2025 pid:166559648"              );
    array_test.push( "iyr:2011 ecl:brn hgt:59in"                       );

    return array_test;
}


wl( "" );
wl( "Day 4 - Passport Processing" );
wl( "" );

calcArray( getTestArray1(), true );

checkReaddatei();

wl( "" )
wl( "Day 04 - End " );

