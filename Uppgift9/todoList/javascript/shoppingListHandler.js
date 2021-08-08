// hanterar "rullgardins" menyn och hanterar list-instanserna
// sparar till localStorage
// drag mellan listorna
// mouse och touch input
// 

class ShoppingListHandler
{
    #isDown;  // the menu
    #isDragging;
    #draggedFrom;
    #draggedItem;
    #dragOffsetX;
    #dragOffsetY;
    #queen;

    #shoppingLists=[];

    constructor()
    {
        this.#isDown=false;   
        this.#isDragging=false;
        this.#dragOffsetX=-16;
        this.#dragOffsetY=-16;
        this.#queen=document.getElementById("dragQueen");

        document.getElementById("menu").addEventListener("animationend", (event)=>{this.onAnimateFinished(event)});
        
        document.addEventListener("click", (event)=>
        {
            
            this.onClick(event);            
        });        

        document.addEventListener("destroyEvent", (event)=>
        {            
            this.onDestroy(event.data);
        });
        
        document.addEventListener("touchstart", (event)=>
        {            
            this.onDown(event);            
        });
        document.addEventListener("mousedown", (event)=>
        {
            this.onDown(event);
            
        });
        
        document.addEventListener("touchmove", (event)=>
        {            
            this.onMove(event.touches[0].pageX+this.#dragOffsetX, event.touches[0].pageY+this.#dragOffsetY);            
            
        });
        document.addEventListener("mousemove", (event)=>
        {
            this.onMove(event.pageX+this.#dragOffsetX, event.pageY+this.#dragOffsetY);
        });
        

        
        
        
        document.addEventListener("touchend", (event)=>
        {
            
            this.#queen.style.top=-1000+"px";
            this.#queen.style.left=-1000+"px";

            let changedTouch = event.changedTouches[0];
            let element=document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            
            
            this.onUp(event, element);            
        });
        document.addEventListener("mouseup", (event)=>
        {
            
            this.#queen.style.top=-1000+"px";
            this.#queen.style.left=-1000+"px";
            
            let element=document.elementFromPoint(event.clientX, event.clientY);            
            this.onUp(event, element);           
        });
        
        


        window.addEventListener("beforeunload", (event)=>
        {
            this.#save();
        });

        this.#load();

    }


    
    #save()
    {
        let saveValue="";
        for(let i=0;i<this.#shoppingLists.length;i++)
        {   
            saveValue+=this.#shoppingLists[i].getSaveObject()+";";
        }
        localStorage.setItem("todoLists", saveValue);    

    }

    #load()
    {
        let loadObject=localStorage.getItem("todoLists");
                
        let lists = loadObject.split(";");        
        for(let i=0;i<lists.length;i++)
        {
            if(lists[i])
            {                 
                let values=lists[i].split(":");
                let name=values[0];
                let color=values[1];
                let items=[];
                for(let j=2;j<values.length;j++)
                {
                    items.push(values[j]);                    
                }
                this.#shoppingLists.push(new ShoppingList(name, color, items));

            }
        }
    }
    
    // testar ifall namnet redan finns
    #validateName(name)
    {
        for(let i=0;i<this.#shoppingLists.length;i++)
        {
            if(this.#shoppingLists[i].name===name)
            {
                return false;
            }
        }
        return true;
    }

    onMove(x, y)
    {
        if(this.#isDragging)
        {
            
            this.#queen.style.left=x+"px";
            this.#queen.style.top=y+"px";            
        }
    }

    onDown(event)
    { 
        let node=event.target;
        if(node.nodeName==="SPAN")
        {            
            this.#isDragging=true;
            this.#draggedItem=node;
            this.#draggedFrom=node.parentNode;
            
            this.#queen.innerHTML=node.innerHTML;
            if(node.classList.contains("purchased"))
            {
                this.#queen.classList="purchased";
            }
            else
            {
                this.#queen.classList="";
            }            
        }        
    }

    onUp(event, target)
    {              
        if(this.#isDragging)
        {
            this.#isDragging=false;

            for(let i=0;i<this.#shoppingLists.length;i++)
            {
                if(this.#shoppingLists[i].onUp(event, target, this.#draggedFrom, this.#draggedItem))
                {                      
                    return;
                }
            }
        }        
    }   

    onClick(event)
    {
        let node=event.target;

        if(node.id==="down")
        {   
            let menu=document.getElementById("menu");
            if(this.#isDown)
            {
                menu.classList.remove("menuAnimation1");
                menu.classList.add("menuAnimation2");
                node.blur();
            }
            else
            {
                menu.classList.remove("menuAnimation2");
                menu.classList.add("menuAnimation1");
                node.blur();
            }                   
            return;
        }

        if(node.id==="newButton")
        {

            let newInput=document.getElementById("newInput");
            if(newInput.value)
            {                
                if(this.#validateName(newInput.value))
                {
                    let colorRadio = document.querySelectorAll('input[name="colorRadio"]');
                    for(let choise of colorRadio)
                    {
                        if(choise.checked)
                        {
                            let label=choise.parentNode;                            
                            this.#shoppingLists.push(new ShoppingList(newInput.value, label.style.backgroundColor));
                            
                            newInput.value="";
                            
                            break;
                        } 
                    }
                    
                    // roll up
                    let menu=document.getElementById("menu");            
                    if(this.#isDown)
                    {
                        menu.classList.remove("menuAnimation1");
                        menu.classList.add("menuAnimation2");
                    }
                }
                else
                {
                    // todo invalid name message
                }

            }
            return;
            
        }

        for(let i=0;i<this.#shoppingLists.length;i++)
        {
            if(this.#shoppingLists[i].onClick(event))
            {                
                return;
            }
        }
        
        
    }

    onAnimateFinished(event)
    {        
        this.#isDown=!this.#isDown;

        let downButton=document.getElementById("down");
        if(this.#isDown)
        {
            downButton.innerHTML="&uarr;";
        }
        else
        {
            downButton.innerHTML="&darr;";
        }


    }

    onDestroy(obj)
    {        
        let removeIndex=this.#shoppingLists.indexOf(obj);
        this.#shoppingLists.splice(removeIndex, 1);
        obj.destructor();        
    }



}