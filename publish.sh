#!/bin/bash
set -e
set -x
npm run build
scp -r build/* murmurations:/var/www/html/