local Object = {}

Object.__index = Object
setmetatable(Object, {
	__call = function (class, ...)
		local obj = setmetatable({}, Object)
		obj:init(...)
		return obj
	end
})

function Object:init() end
function Object:extend()
	local new_class = {}
	new_class.super = self
	new_class.__index = new_class
	return setmetatable(new_class, {
		__index = self,
		__call = function(cls, ...)
			local instance = setmetatable({}, cls)
			instance:init(...)
			return instance
		end
	})
end

return Object 
