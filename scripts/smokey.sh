#!/bin/bash

cd "$(dirname "$0")" || exit

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

ERRORS=0
SUCCESS=0

function smokeCountry() {
    countryCode="${1}"
    productCode="${2}"

    # run ikea stock command and check the number of lines and exit code
    # to see if there has been an error
    result=$(npm run start -s -- stock --plain --country "${countryCode}" "${productCode}");
    lines=$(echo -e "${result}" | wc -l)

    # shellcheck disable=SC2181
    if [[ $? != 0 ]]; then
        # in case of non zero exit code, show the error message
        ERRORS=$((ERRORS+1))
        printf "    error: %b%s%b\n" "${RED}" "${countryCode}   ${productCode}" "${NC}";
        echo "${result}"
    elif [[ "${lines}" -eq "0" ]]; then
        ERRORS=$((ERRORS+1))
        # in case of an empty list of results, also show an error message
        printf "    error: %b%s%b\n" "${RED}" "${countryCode}   ${productCode}    0 (no results)" "${NC}";
    else
        SUCCESS=$((SUCCESS+1))
        printf "  success: %b%s%b\n" "${GREEN}" "${countryCode}   ${productCode}    ${lines}" "${NC}";
    fi
}

function printReport() {
    if [ $SUCCESS -ne 0 ]; then
        printf "%bSuccessful: %d%b\n" "${GREEN}" "${SUCCESS}" "${NC}";
    fi
    if [ $ERRORS -ne 0 ]; then
        printf "%bErrors: %d%b\n" "${RED}" "${ERRORS}" "${NC}";
        exit 1;
    fi
}

CODE="80213074"

smokeCountry "ie" "${CODE}";

smokeCountry "at" "${CODE}";
# smokeCountry "au" "${CODE}"; # no support in ingka api
smokeCountry "be" "${CODE}";
smokeCountry "ca" "${CODE}";
smokeCountry "ch" "${CODE}";
# smokeCountry "cn" "${CODE}"; # no support in ingka api
smokeCountry "cz" "${CODE}";
smokeCountry "de" "${CODE}";
smokeCountry "dk" "${CODE}";
smokeCountry "es" "${CODE}";
smokeCountry "fi" "${CODE}";
smokeCountry "fr" "${CODE}";
smokeCountry "gb" "${CODE}";
# smokeCountry "hk" "${CODE}"; # no support in ingka api
# smokeCountry "hr" "${CODE}"; # no support in ingka api
smokeCountry "hu" "${CODE}";
smokeCountry "ie" "${CODE}";
smokeCountry "it" "${CODE}";
smokeCountry "jo" "${CODE}";
# smokeCountry "jp" "${CODE}"; # no support in ingka api
# smokeCountry "kr" "${CODE}"; # no support in ingka api
smokeCountry "kw" "${CODE}";
smokeCountry "lt" "${CODE}";
# smokeCountry "my" "${CODE}"; # no support in ingka api
smokeCountry "nl" "${CODE}";
smokeCountry "no" "${CODE}";
smokeCountry "pl" "${CODE}";
smokeCountry "pt" "${CODE}";
smokeCountry "qa" "${CODE}";
smokeCountry "ro" "${CODE}";
# smokeCountry "ru" "${CODE}"; # problems with one city
smokeCountry "sa" "${CODE}";
smokeCountry "se" "${CODE}";
# smokeCountry "sg" "${CODE}"; # no support in ingka api
smokeCountry "sk" "${CODE}";
# smokeCountry "th" "${CODE}"; # no support in ingka api
# smokeCountry "tw" "${CODE}"; # no support in ingka api
smokeCountry "us" "${CODE}";

printReport
