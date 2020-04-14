#!/bin/sh

echo "Starting everything: app and server"
echo ""

# Start multiple processes
# and be able to kill them all with `Ctrl + c`
# @source: https://stackoverflow.com/a/52033580
(trap 'kill 0' SIGINT; cd ./app; npm start & cd ../; npm start)
