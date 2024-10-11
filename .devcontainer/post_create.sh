#!/bin/bash
echo "Installing base dependancies"
npm install
echo "Installing ui dependancies"
npm install --prefix ui
echo "Installing backend dependancies"
npm install --prefix backend

# installing cypress binaries
cd /workspaces/yorkshire-3-peaks-website/ui
echo Downloading Cypress in ui, this will take a few minutes
npx cypress install