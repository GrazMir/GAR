#! /bin/bash

map=$(setxkbmap -query |  awk '/layout/ {print $2}')


if [[ "$map" = "us" ]]
then	setxkbmap gb
else	setxkbmap us
fi
