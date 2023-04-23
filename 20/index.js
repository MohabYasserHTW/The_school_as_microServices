$("h1").css("color","red") //it changes all h1 to red

$("button").text("3aaaaaaaa")

$("h2").html("<em>CC is ......</em>")

$("button").addClass("btn")

$("button").click(function(){alert("bs ya 3aaaaaaaaam")})

$("body").keydown(function(event){
    $("h1").text(event.key)
})

$("button").on("mouseover",()=>{
    $("body").css("background-color","red")//i note that i can write the css property as camel case or normal css
})

$("button").on("click",(event)=>{event.target.after("x")})