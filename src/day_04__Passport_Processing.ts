import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2020/day/4
 * 
 * https://www.reddit.com/r/adventofcode/comments/k6e8sw/2020_day_04_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day04/day_04__Passport_Processing.js
 * 
 * Day 4 - Passport Processing
 * 
 *    -  Field Name eyr - Value 1972 Check 0 ### NOT OK ###
 * 
 *    -  Field Name iyr - Value 2019 Check 1 OK
 *    -  Field Name hcl - Value #602927 Check 1 OK
 *    -  Field Name eyr - Value 1967 Check 0 ### NOT OK ###
 * 
 *    -  Field Name hcl - Value dab227 Check 0 ### NOT OK ###
 * 
 *    -  Field Name hgt - Value 59cm Check 0 ### NOT OK ###
 * 
 *    -  Field Name pid - Value 087499704 Check 1 OK
 *    -  Field Name hgt - Value 74in Check 1 OK
 *    -  Field Name ecl - Value grn Check 1 OK
 *    -  Field Name iyr - Value 2012 Check 1 OK
 *    -  Field Name eyr - Value 2030 Check 1 OK
 *    -  Field Name byr - Value 1980 Check 1 OK
 *    -  Field Name hcl - Value #623a2f Check 1 OK
 * 
 *    -  Field Name eyr - Value 2029 Check 1 OK
 *    -  Field Name ecl - Value blu Check 1 OK
 *    -  Field Name cid - Value 129 Check 1 OK
 *    -  Field Name byr - Value 1989 Check 1 OK
 *    -  Field Name iyr - Value 2014 Check 1 OK
 *    -  Field Name pid - Value 896056539 Check 1 OK
 *    -  Field Name hcl - Value #a97842 Check 1 OK
 *    -  Field Name hgt - Value 165cm Check 1 OK
 * 
 *    -  Field Name hcl - Value #888785 Check 1 OK
 *    -  Field Name hgt - Value 164cm Check 1 OK
 *    -  Field Name byr - Value 2001 Check 1 OK
 *    -  Field Name iyr - Value 2015 Check 1 OK
 *    -  Field Name cid - Value 88 Check 1 OK
 *    -  Field Name pid - Value 545766238 Check 1 OK
 *    -  Field Name ecl - Value hzl Check 1 OK
 *    -  Field Name eyr - Value 2022 Check 1 OK
 * 
 *    -  Field Name iyr - Value 2010 Check 1 OK
 *    -  Field Name hgt - Value 158cm Check 1 OK
 *    -  Field Name hcl - Value #b6652a Check 1 OK
 *    -  Field Name ecl - Value blu Check 1 OK
 *    -  Field Name byr - Value 1944 Check 1 OK
 *    -  Field Name eyr - Value 2021 Check 1 OK
 *    -  Field Name pid - Value 093154719 Check 1 OK
 * 
 * Result Part 1 = 8
 * Result Part 2 = 4
 * 
 * Day 04 - End
 * 
 * Result Part 1 = 210
 * Result Part 2 = 131
 * 
 */

const FIELD_BIRTH_YEAR      : string = "byr";
const FIELD_ISSUE_YEAR      : string = "iyr";
const FIELD_EXPIRATION_YEAR : string = "eyr";
const FIELD_HEIGHT          : string = "hgt";
const FIELD_HAIR_COLOR      : string = "hcl";
const FIELD_EYE_COLOR       : string = "ecl";
const FIELD_PASSPORT_ID     : string = "pid";
const FIELD_COUNTRY_ID      : string = "cid";

const CHECK_FIELDS_NEEDED   : string[] = [ FIELD_BIRTH_YEAR, FIELD_ISSUE_YEAR, FIELD_EXPIRATION_YEAR, FIELD_HEIGHT, FIELD_HAIR_COLOR, FIELD_EYE_COLOR, FIELD_PASSPORT_ID ];

const HEIGHT_CM_MIN         : number = 150;
const HEIGHT_CM_MAX         : number = 193;

const HEIGHT_IN_MIN         : number = 59;
const HEIGHT_IN_MAX         : number = 76;

const BIRTH_YEAR_FROM       : number = 1920;
const BIRTH_YEAR_TO         : number = 2002;

const ISSUE_YEAR_FROM       : number = 2010;
const ISSUE_YEAR_TO         : number = 2020;

const EXP_YEAR_FROM         : number = 2020;
const EXP_YEAR_TO           : number = 2030;

const EYE_COLOR             : string[] = [ "amb", "blu", "brn", "gry", "grn", "hzl", "oth" ];

const PASSPORT_ID_LENGTH    : number = 9;

type PassPortCheckResult = { knz_ok : boolean, fields_ok : string, fields_missing : string };


function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function checkYear( pString : string, pMinValue : number, pMaxValue : number ) : number 
{
    if ( pString.length != 4 ) return 0;

    let number_value : number = parseInt( pString, 10 ) ?? -1;

    if ( number_value < pMinValue ) return 0;

    if ( number_value > pMaxValue ) return 0;

    return 1;
}


function checkHeightValue( pString : string, pMinValue : number, pMaxValue : number ) : number 
{
    let number_value : number = parseInt( pString.slice( 0, -2 ), 10 ) ?? -1;

    if ( number_value < pMinValue ) return 0;

    if ( number_value > pMaxValue ) return 0;

    return 1;
}


function checkBirthYear( pString : string ) : number 
{ 
    return checkYear( pString, BIRTH_YEAR_FROM, BIRTH_YEAR_TO );
}


function checkIssueYear( pString : string ) : number 
{
    return checkYear( pString, ISSUE_YEAR_FROM, ISSUE_YEAR_TO );
}


function checkExpirationYear( pString : string ) : number 
{
    return checkYear( pString, EXP_YEAR_FROM, EXP_YEAR_TO );
}


function checkHeightStr( pString : string ) : number 
{
    if ( pString.length < 3 ) return 0;

    if ( pString.endsWith( "cm" ) )
    {
       return checkHeightValue( pString, HEIGHT_CM_MIN, HEIGHT_CM_MAX );
    }

    if ( pString.endsWith( "in" ) )
    {
       return checkHeightValue( pString, HEIGHT_IN_MIN, HEIGHT_IN_MAX );
    }

    return 0; 
}


function checkHairColor( pString : string ) : number 
{
    if ( pString.charAt( 0 ) !== "#" ) return 0;

    if ( pString.length != 7 ) return 0;

    let is_hex_number : boolean = /^[0-9a-fA-F]+$/.test( pString.substring( 1 ) );

    return is_hex_number ? 1 : 0; 
}


function checkEyeColor( pString : string ) : number 
{
    return EYE_COLOR.includes( pString ) ? 1 : 0;
}


function checkPassportId( pString : string ) : number 
{
    if ( pString.length != PASSPORT_ID_LENGTH ) return 0;

    let number_value : number = parseInt( pString, 10 ) ?? -1;

    if ( number_value === -1 ) return 0;

    return 1;
}


function checkPassPort( pInput : string ) : PassPortCheckResult
{
    let check_result : PassPortCheckResult = { knz_ok : true, fields_ok : "", fields_missing : "" };

    for ( const check_field of CHECK_FIELDS_NEEDED )
    {
        if ( pInput.indexOf( check_field + ":" ) === -1 )
        {
            check_result.knz_ok = false;

            check_result.fields_missing += check_field;
        }
        else
        {
            check_result.fields_ok += check_field;
        }
    }

    if ( pInput.indexOf( FIELD_COUNTRY_ID + ":"  ) === -1 )
    {
        check_result.fields_missing += FIELD_COUNTRY_ID;
    }
    else
    {
        check_result.fields_ok += FIELD_COUNTRY_ID;
    }

    return check_result;
}

function checkPassportFields( pInput : string, pKnzDebug : boolean ) : number
{
    if ( pInput.trim() === "" ) return 0;

    let field_vektor : string[] = pInput.split( " " );

    for ( const cur_field of field_vektor )
    {
        if ( cur_field != "" )
        {
            let [ field_name, field_value ] = cur_field.split( ":" );

            let result_v : number = 0;

                 if ( field_name!.startsWith( FIELD_BIRTH_YEAR       ) ) {  result_v = checkBirthYear(      field_value! ); }
            else if ( field_name!.startsWith( FIELD_ISSUE_YEAR       ) ) {  result_v = checkIssueYear(      field_value! ); }
            else if ( field_name!.startsWith( FIELD_EXPIRATION_YEAR  ) ) {  result_v = checkExpirationYear( field_value! ); }
            else if ( field_name!.startsWith( FIELD_HEIGHT           ) ) {  result_v = checkHeightStr (     field_value! ); }
            else if ( field_name!.startsWith( FIELD_HAIR_COLOR       ) ) {  result_v = checkHairColor(      field_value! ); }
            else if ( field_name!.startsWith( FIELD_EYE_COLOR        ) ) {  result_v = checkEyeColor(       field_value! ); }
            else if ( field_name!.startsWith( FIELD_PASSPORT_ID      ) ) {  result_v = checkPassportId(     field_value! ); }
            else if ( field_name!.startsWith( FIELD_COUNTRY_ID       ) ) {  result_v = 1;                                   }

            if ( pKnzDebug )
            {
                wl( "   -  Field Name " + field_name +  " - Value " +  field_value + " Check " + result_v + " " + ( result_v ? "OK" : "### NOT OK ###") );
            }

            if ( result_v == 0 ) return 0;
        }
    }

    return 1;
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

                    result_part_02 += checkPassportFields( pass_port_data, pKnzDebug );

                    if ( pKnzDebug )
                    {
                        wl( "" );
                    }
                }
            }

            pass_port_data = "";
        }
        else 
        {
            pass_port_data += " " + cur_input_str;
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


function getTestArray2() : string[] 
{
    const array_test: string[] = [];

    /*
     * Invalid Passports
     */
    array_test.push( "eyr:1972 cid:100"                                                       );
    array_test.push( "hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926"                );
    array_test.push( ""                                                                       );
    array_test.push( "iyr:2019"                                                               );
    array_test.push( "hcl:#602927 eyr:1967 hgt:170cm"                                         );
    array_test.push( "ecl:grn pid:012533040 byr:1946"                                         );
    array_test.push( ""                                                                       );
    array_test.push( "hcl:dab227 iyr:2012"                                                    );
    array_test.push( "ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277"              );
    array_test.push( ""                                                                       );
    array_test.push( "hgt:59cm ecl:zzz"                                                       );
    array_test.push( "eyr:2038 hcl:74454a iyr:2023"                                           );
    array_test.push( "pid:3556412378 byr:2007"                                                );
    array_test.push( ""                                                                       );

    /*
     * Valid Passports
     */
    array_test.push( ""                                                                       );
    array_test.push( "pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980"              );
    array_test.push( "hcl:#623a2f"                                                            );
    array_test.push( ""                                                                       );
    array_test.push( "eyr:2029 ecl:blu cid:129 byr:1989"                                      );
    array_test.push( "iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm"                           );
    array_test.push( ""                                                                       );
    array_test.push( "hcl:#888785"                                                            );
    array_test.push( "hgt:164cm byr:2001 iyr:2015 cid:88"                                     );
    array_test.push( "pid:545766238 ecl:hzl"                                                  );
    array_test.push( "eyr:2022"                                                               );
    array_test.push( ""                                                                       );
    array_test.push( "iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719" );

    return array_test;
}


wl( "" );
wl( "Day 4 - Passport Processing" );
wl( "" );

calcArray( getTestArray2(), true );

checkReaddatei();

wl( "" )
wl( "Day 04 - End " );

