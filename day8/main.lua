#!/usr/bin/lua

local h = 6
local w = 25
local raw = {}
local layers = {}

local f = io.open('input.txt' or arg[1])
for line in f:lines() do
	for digit in string.gmatch(line, '%d') do
		raw[#raw + 1] = digit
	end
end
f:close();

local z, i = 1
local layer_sz = w*h
local raw_i, layer_i
while i < #raw/layer_sz do
	layers[i] = {}
	for y = 0, h-1 do
		for x = 0, w-1 do
			layer_i = (y*w)+x
			raw_i = (layer_sz * (i-1)) + layer_i
			layers[i][layer_i + 1] = raw[raw_i]
		end
	end
end
