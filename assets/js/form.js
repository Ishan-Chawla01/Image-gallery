
function verify() {
    const email=document.getElementById("email");
    const name=document.getElementById("name");
    const message=document.getElementById("message");  
    if(email.value=="" || name.value=="" || message.value==null){
        alert("Please fill all the fields");
    }
        else{
            if(email.value.includes("@") && email.value.includes(".") && name.value.length>2 ){
                alert("Thank you for your response");
                
            }
            else{
                alert("Please enter valid data");
            }
        }

}
