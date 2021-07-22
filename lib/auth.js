module.exports = {
    isOwner:function(request, response){
        if(request.user){ // deserial~ 의 done 에서 온 user
            return true;
        } else {
            return false;
        }
    },

    statusUI:function(request, response) {
        var authStatusUI = '<a href="/auth/login">login</a>'
        if(this.isOwner(request, response)){
            authStatusUI= `${request.user.nickname} | <a href="/auth/logout">logout</a>`
            return authStatusUI
        } 
    }
}