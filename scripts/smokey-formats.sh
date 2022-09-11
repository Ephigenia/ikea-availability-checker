#!/bin/bash

# exit when any command fails
set -e

cd "$(dirname "$0")" || exit

npm run start -s -- stock --country "de" "80213074"
npm run start -s -- stock --plain --country "de" "80213074"
npm run start -s -- stock --json --country "de" "80213074"
npm run start -s -- stock --pretty --country "de" "80213074"

npm run start -s -- stores "de" "80213074"
npm run start -s -- stores --plain "de" "80213074"
npm run start -s -- stores --csv "de" "80213074"
npm run start -s -- stores --json "de" "80213074"
