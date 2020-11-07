#!/usr/bin/lua

local Machine = require 'machine'
local file = io.open(arg[1] or './input.txt')
local input = file:read()
file:close()

Machine():load(input):run(0, arg[2])
