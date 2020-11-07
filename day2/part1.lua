#!/usr/bin/lua

local Machine = require 'machine'
local file = io.open(arg[1] or './input.txt')
print(Machine():load(file:read()):run():inspect(tonumber(arg[2]) or 0))
