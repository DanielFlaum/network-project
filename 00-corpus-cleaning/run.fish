#!/usr/bin/fish

for filepath in 00-raw/*
    set filename (basename $filepath)
    npm start -- cleanFile $filepath 01-clean/$filename
end
