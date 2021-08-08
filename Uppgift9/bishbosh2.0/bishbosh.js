
window.addEventListener('load', () => 
{      
    document.querySelectorAll('.numberInput').forEach(element => 
    {
        element.addEventListener('blur', ()=>validateNumberInput(element));
        console.log(element);
    });

    let element=document.getElementById('form');
    element.addEventListener('submit', (event)=>
    { 
        event.preventDefault();
        console.log("on submit");
        
        const loop=document.getElementById('loop');
        const bish=document.getElementById('bish');    
        const bosh=document.getElementById('bosh');

        if(validateSubmission(loop, bish, bosh))
        {
            
            bishboshing(loop, bish, bosh);
        }
        else
        {
            // todo failöure message
        }
        

    });

});



function validateNumberInput(element)
{    
    let value=element.value;
    
    if(value<1)
    {        
        element.style.backgroundColor='#ff6666';
    }
    else
    {
        element.style.backgroundColor='#66ff66';
    }
}

function validateSubmission(element)
{   
    
    return true;
}

function bishboshing(loop, bish, bosh)
{    
    const list=document.getElementById('list');
    list.innerHTML="";
    for(let i=1;i<=loop.value;i++)
    {
        
        if(i%bish.value==0 && i%bosh.value==0)
        {
            list.innerHTML+='<li>bish-bosh</li>';
        }
        else if(i%bish.value==0)
        {
            list.innerHTML+='<li>Bish</li>';
        }
        else if(i%bosh.value==0)
        {
            list.innerHTML+='<li>Bosh</li>';
        }
        else
        {
            list.innerHTML+='<li>'+i+'</li>';            
        }
    }
}

