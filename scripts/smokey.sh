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

# big thanks to @Teko012 for providing a list of working productIds & countries
# SEE https://github.com/Ephigenia/ikea-availability-checker/issues/155

smokeCountry "at" "80213074";
smokeCountry "au" "10514792";
smokeCountry "be" "80213074";
smokeCountry "ca" "80213074";
smokeCountry "ch" "80213074";
smokeCountry "cn" "10514792";
smokeCountry "cz" "80213074";
smokeCountry "de" "80213074";
smokeCountry "dk" "80213074";
smokeCountry "es" "80213074";
smokeCountry "fi" "80213074";
smokeCountry "fr" "80213074";
smokeCountry "gb" "80213074";
smokeCountry "hk" "10514792";
smokeCountry "hr" "00263850";
smokeCountry "hu" "80213074";
smokeCountry "ie" "80213074";
smokeCountry "it" "80213074";
smokeCountry "jo" "80213074";
smokeCountry "jp" "10514792";
smokeCountry "kr" "10514792";
smokeCountry "kw" "80213074";
smokeCountry "lt" "80213074";
smokeCountry "lv" "30514791";
smokeCountry "my" "10514792";
smokeCountry "nl" "80213074";
smokeCountry "no" "80213074";
smokeCountry "pl" "80213074";
smokeCountry "pt" "80213074";
smokeCountry "qa" "80213074";
smokeCountry "ro" "80213074";
smokeCountry "sa" "80213074";
smokeCountry "se" "80213074";
smokeCountry "sg" "10514792";
smokeCountry "sk" "80213074";
smokeCountry "th" "10514792";
smokeCountry "tw" "80213074";
smokeCountry "us" "80213074";

# countries to be added
# AE - 30514791
# BG - 30514791
# BH - 30514791
# CE - 30514791 (this is ES but it's the Islands website, same as SP, but a different country code on API from them)
# CL - 30449908 (different product from the same family)
# CY - 30514791
# DO - 30514791
# EE - 30514791
# EG - 30514791
# GR - 30514791
# ID - 10514792
# IL - 30514791
# IN - 10514792
# INTSALES - N/A
# IS - 30514791
# MA - 30514791
# MX - 30514791
# OM - 30514791
# PH - 10514792
# PR - 30514791
# RS - 30514791
# SI - 30514791
# SP - 30514791 (this is ES but it's the Islands website, same as CE domain, but a different country code on API from them)
# TR - 30514791
# UA - 00263850


# russia lists stores but their APIs seems to be closed, every store returns
# "Service not available"
# smokeCountry "ru" "80213074"; # problems with one city

printReport

# exit with non-zeor in case of an error
if [ $ERRORS -ne 0 ]; then
    exit 1
fi
