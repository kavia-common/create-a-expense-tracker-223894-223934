#!/bin/bash
cd /home/kavia/workspace/code-generation/create-a-expense-tracker-223894-223934/WebApplication
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

