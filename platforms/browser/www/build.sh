#!/usr/bin/env bash
npm run pg && cd phonegap && phonegap plugin save && phonegap prepare && phonegap platform remove android && phonegap platform add android
