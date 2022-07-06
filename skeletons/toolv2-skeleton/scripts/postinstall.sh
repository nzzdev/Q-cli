#!/bin/bash
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    git init;
    husky install;
fi
