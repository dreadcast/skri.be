// "use strict";

var Prime = require("prime");

module.exports = Prime({
    parent: function(){
        var parent = this._parent || this.constructor.parent;
        
        this._parent = parent.constructor.parent;
        
        var parentName = arguments.callee.caller.$name,
        	result = parent[parentName].apply(this, arguments);
        
        this._parent = parent;
        
        return result;
    }
})
