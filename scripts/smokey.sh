#!/bin/bash

# TODO make sure the script knows it’s WORKDIR
# WORKDIR="../";
# cd "${WORKDIR}";

# TODO add DEBUG option

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# ERRORS=0
# SUCCESS=0

function smokeCountry() {
    countryCode="${1}"
    productCode="${2}"

    result=$(npm run start -s -- stock --plain --country "${countryCode}" "${productCode}");
    lines=$(echo -n "${result}" | wc -l)

    # TODO double check negative and positve
    if [[ $? != 0 ]]; then
        # TODO there are cases where the command runs sucessful but there
        #      are no results
        printf "    error: %b%s%b\n" "${RED}" "${countryCode}   ${productCode}" "${NC}";
        echo "${result}"
    elif [[ "${lines}" -eq "0" ]]; then
        printf "    error: %b%s%b\n" "${RED}" "${countryCode}   ${productCode}    0 (no results)" "${NC}";
    else
        printf "  success: %b%s%b\n" "${GREEN}" "${countryCode}   ${productCode}    ${lines}" "${NC}";
    fi
}

# IDEA create some kind of report which country is still working
# IDEA publish the report on github

CODE="80213074"

# TODO check with the countries
smokeCountry "at" "${CODE}";
smokeCountry "au" "${CODE}"; # no support in ingka api
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
