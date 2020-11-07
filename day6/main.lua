#!/usr/bin/lua

local Object = require 'object'

local Planet = Object:extend()

function Planet:init()
	self.orbits = {}
end

function Planet:add(orbit)
	self.orbits[#self.orbits + 1] = orbit
end

function Planet:count(offset)
	print('dee')
	local count = offset or 0
	for i, orbit in ipairs(self.orbits) do
		count = count + orbit:count((offset or -1) + 1)
	end
	return #self.orbits + count
end

local input_file = io.open(arg[1] or 'input.txt')
local input = input_file:read('*a')
input_file:close()

local planets = {}
for orbitee, orbiter in string.gmatch(input, '(%w+)%)(%w+)') do
	planets[orbiter] = Planet()
	if not planets[orbitee] then
		planets[orbitee] = Planet()
	end
	planets[orbitee]:add(planets[orbiter])
end

print('part 1: '.. planets['COM']:count())
