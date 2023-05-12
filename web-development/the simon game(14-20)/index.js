let randomNumbers=[]
let level=0
let userClick={
    clickNumber:0,
    clickValue:-1
}
$(".square").click(() => userClicked(event));

$("button").click(startThegame)

function randomNumber()
{
   return Math.floor(Math.random()*4)+1
}

function startThegame(){
    $("button").hide()
    oneMore()
}

function light(num){
         $(`#s${num}`).fadeIn(1000).fadeOut(1000).fadeIn(1000);
}

function testUserClick(){

    if(userClick.clickValue===randomNumbers[userClick.clickNumber-1])
    {
        console.log("go",userClick.clickNumber)

        if(userClick.clickNumber===level){
            console.log("one more")
            oneMore()
        }
    }else{
        console.log(userClick)
        alert("wrong")
        $("button").show();
        level=0
        randomNumbers=[]
    }
    /* userClick.clickValues.forEach((click,indx)=>{
        if(click===randomNumbers[indx]){
            console.log("keep going")
            if (userClick.clickNumber===indx+1)
            {
                console.log(userClick.clickValues, "uservalues");
                oneMore();
            }
            
        }
        else{
            console.log(userClick.clickValues,"uservalues")
            alert("Wrong !! ");
        }
    }) */
    
}

function userClicked(event){
    userClick.clickNumber+=1
    userClick.clickValue=(Number($("#" + event.target.id).text())) 
    testUserClick()
}

function oneMore(){
    level+=1
    userClick.clickNumber=0
    userClick.clickValue=-1
    let number = randomNumber();
    randomNumbers.push(number);
    light(number);
    console.log(randomNumbers)
}