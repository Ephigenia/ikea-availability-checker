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
    exit_code=$?
    # Count lines without padding the input with an extra newline so that
    # an empty `result` yields 0 (plain `echo -e` always appends a newline
    # and would make this branch unreachable).
    lines=$(printf '%s' "${result}" | grep -c '^')

    if [[ $exit_code != 0 ]]; then
        # non-zero exit code — show the error message
        ERRORS=$((ERRORS+1))
        printf "    error: %b%s%b\n" "${RED}" "${countryCode}   ${productCode}" "${NC}";
        echo "${result}"
    elif [[ -z "${result}" || "${lines}" -eq "0" ]]; then
        ERRORS=$((ERRORS+1))
        printf "    error: %b%s%b\n" "${RED}" "${countryCode}   ${productCode}    0 (no results)" "${NC}";
    elif echo "${result}" | grep -qiE '^(Not found|Unknown Response error|HTTP [0-9]+)$'; then
        # INGKA bubbled back an error in stdout (e.g. "Not found" when the
        # item isn't stocked in the country) — pick a different productCode.
        ERRORS=$((ERRORS+1))
        printf "    error: %b%s%b\n" "${RED}" "${countryCode}   ${productCode}    no stock data (\"${result}\")" "${NC}";
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

# big thanks to @Teko012 for providing a list of working productIds & countries
# SEE https://github.com/Ephigenia/ikea-availability-checker/issues/155

smokeCountry "ae" "30514791";
smokeCountry "at" "80213074";
smokeCountry "au" "10514792";
smokeCountry "be" "80213074";
smokeCountry "bh" "30514791";
smokeCountry "ca" "80213074";
smokeCountry "ch" "80213074";
smokeCountry "cl" "30449908";
smokeCountry "cn" "10514792";
smokeCountry "co" "30449908";
smokeCountry "cz" "80213074";
smokeCountry "de" "80213074";
smokeCountry "dk" "80213074";
smokeCountry "ee" "30514791";
smokeCountry "eg" "30514791";
smokeCountry "es" "80213074";
smokeCountry "fi" "80213074";
smokeCountry "fr" "80213074";
smokeCountry "gb" "80213074";
smokeCountry "hk" "10514792";
smokeCountry "hr" "00263850";
smokeCountry "hu" "80213074";
smokeCountry "ie" "80213074";
smokeCountry "il" "30514791";
smokeCountry "in" "10514792";
smokeCountry "is" "30514791";
smokeCountry "it" "80213074";
smokeCountry "jo" "80213074";
smokeCountry "jp" "10514792";
smokeCountry "kr" "10514792";
smokeCountry "kw" "80213074";
smokeCountry "lt" "80213074";
smokeCountry "lv" "30514791";
smokeCountry "ma" "30514791";
smokeCountry "mx" "30514791";
smokeCountry "my" "10514792";
smokeCountry "nl" "80213074";
smokeCountry "no" "80213074";
smokeCountry "nz" "10514792";
smokeCountry "om" "30514791";
smokeCountry "ph" "10514792";
smokeCountry "pl" "80213074";
smokeCountry "pt" "80213074";
smokeCountry "qa" "80213074";
smokeCountry "ro" "80213074";
smokeCountry "rs" "30514791";
smokeCountry "sa" "80213074";
smokeCountry "se" "80213074";
smokeCountry "sg" "10514792";
smokeCountry "si" "30514791";
smokeCountry "sk" "80213074";
smokeCountry "th" "10514792";
smokeCountry "tr" "50510301";
smokeCountry "tw" "70509815";
smokeCountry "ua" "00263850";
smokeCountry "us" "80213074";

# countries we haven't added support for yet — their INGKA `ru/<CC>` endpoint
# returns store data but the franchise websites don't expose buCodes alongside
# names, so the slug → buCode mapping in scripts/scrape-misc-stores.js is
# still incomplete. Once mapped, move them into the smokeCountry calls above.
# BG - 30514791
# CY - 30514791
# DO - 30514791
# GR - 30514791
# ID - 10514792
# INTSALES - N/A
# PR - 30514791

printReport

# exit with non-zeor in case of an error
if [ $ERRORS -ne 0 ]; then
    exit 1
fi
