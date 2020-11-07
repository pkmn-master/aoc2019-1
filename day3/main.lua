#!/usr/bin/lua

local objs = {
	{
		steps = 0,
		lines = {},
		cursor = { x = 0, y = 0 }
	},
	{
		steps = 0,
		lines = {},
		cursor = { x = 0, y = 0 }
	}
}

local op = {}
op['U'] = function(obj, len) 
	obj.lines[#obj.lines + 1] = {
		a = { 
			x = obj.cursor.x, 
			y = obj.cursor.y,
			s = obj.steps
		},
		b = { 
			x = obj.cursor.x, 
			y = obj.cursor.y + len,
			s = obj.steps + len
		},
		vertical = true
	}
	obj.cursor.y = obj.cursor.y + len
	obj.steps = obj.steps + len
end
op['D'] = function(obj, len) 
	obj.lines[#obj.lines + 1] = {
		a = { 
			x = obj.cursor.x, 
			y = obj.cursor.y - len,
			s = obj.steps + len
		},
		b = { 
			x = obj.cursor.x, 
			y = obj.cursor.y,
			s = obj.steps
		},
		vertical = true
	}
	obj.cursor.y = obj.cursor.y - len
	obj.steps = obj.steps + len
end
op['L'] = function(obj, len) 
	obj.lines[#obj.lines + 1] = {
		a = { 
			x = obj.cursor.x - len, 
			y = obj.cursor.y,
			s = obj.steps + len
		},
		b = { 
			x = obj.cursor.x, 
			y = obj.cursor.y,
			s = obj.steps
		},
		vertical = false
	}
	obj.cursor.x = obj.cursor.x - len
	obj.steps = obj.steps + len
end
op['R'] = function(obj, len) 
	obj.lines[#obj.lines + 1] = {
		a = { 
			x = obj.cursor.x,
			y = obj.cursor.y,
			s = obj.steps
		},
		b = { 
			x = obj.cursor.x + len,
			y = obj.cursor.y,
			s = obj.steps + len
		},
		vertical = false
	}
	obj.cursor.x = obj.cursor.x + len
	obj.steps = obj.steps + len
end

local i = 1;
local file = io.open(arg[1] or './input.txt')
for line in file:lines() do
	for dir, len in string.gmatch(line, '(%a)(%d+),?') do
		op[dir](objs[i], len)
	end
	i = i + 1
end

local intersections = {}
local vert, horiz, vend, hend, sx, sy, p
for i, left in ipairs(objs[1].lines) do
	for j, right in ipairs(objs[2].lines) do
		if left.vertical and not right.vertical then
			vert = left
			horiz = right
		elseif not left.vertical and right.vertical then
			vert = right
			horiz = left
		end
		if vert and horiz
			and vert.a.x > horiz.a.x 
			and vert.a.x < horiz.b.x 
			and horiz.a.y > vert.a.y
			and horiz.a.y < vert.b.y
		then
			vend = vert.a.s > vert.b.s and vert.a or vert.b
			hend = horiz.a.s > horiz.b.s and horiz.a or horiz.b
			p = { x = vert.a.x, y = horiz.a.y }
			sy = vend.s - math.abs(vend.y - p.y)
			sx = hend.s - math.abs(hend.x - p.x)
			p.s = sy + sx
			intersections[#intersections + 1] = p
		end
		vert = nil
		horiz = nil
	end
end

local low_dist = nil
local low_step = nil
for i, p in ipairs(intersections) do
	if not low_dist or math.abs(p.x) + math.abs(p.y) < low_dist then
		low_dist = math.abs(p.x) + math.abs(p.y)
	end
	if not low_step or p.s < low_step then
		low_step = p.s
	end
end

print('part1: ', low_dist)
print('part2: ', low_step)
