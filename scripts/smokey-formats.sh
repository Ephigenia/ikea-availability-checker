#!/bin/bash

# exit when any command fails
set -e

cd "$(dirname "$0")" || exit

npm run start -s -- stock --country "at" "80213074"
npm run start -s -- stock --plain --country "at" "80213074"
npm run start -s -- stock --json --country "at" "80213074"
npm run start -s -- stock --pretty --country "at" "80213074"

npm run start -s -- stores "at" "80213074"
npm run start -s -- stores --plain "at" "80213074"
npm run start -s -- stores --pretty "at" "80213074"
npm run start -s -- stores --json "at" "80213074"
