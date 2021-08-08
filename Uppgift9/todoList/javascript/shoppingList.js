
// skapar en lista baserad på bootstrap card classen
class ShoppingList
{
    #name;    
    #textDiv;
    #addInput;
    #addButton;
    #removeToggle;    
    #destroyButton;
    #mainCardDiv;

    #destroyEvent;
    #color;   

    
    constructor(name, color, items)
    {
        
        this.#color=color;        
        this.#destroyEvent = new Event("destroyEvent");
        this.#destroyEvent.data=this;
        this.#name=name;       

        
        let element=document.getElementById("cardCollection");
        element.appendChild(this.#createListCard());

        if(items)
        {
            for(let i=0;i<items.length;i+=2)
            {
                if(items[i+1]=="true")
                {
                    this.#addItem(items[i], true);
                }
                else
                {
                    this.#addItem(items[i], false); // is overlined
                } 
            }
        }
        
    }

    
    get name()
    {
        return this.#name;
    }

    // aktiveras ifrån handlern
    destructor()
    {        
        this.#mainCardDiv.remove();
    }

    // namn:färg:rad1:rad1-överstrykning:rad2...
    getSaveObject()
    {
        let ret=this.#name+":"+this.#color;        
        let listChildren=this.#textDiv.childNodes;
        for(let i=0;i<listChildren.length;i++)
        {                
            if(listChildren[i].nodeName==="SPAN")
            { 
                ret+=":"+listChildren[i].innerHTML+":"+listChildren[i].classList.contains("purchased");
            }
        }
        return ret;        
    }

    #createListCard()
    {
        this.#mainCardDiv=document.createElement("div");
        this.#mainCardDiv.classList="shoppingCard card text-nowrap overflow-hidden shadow m-1";        
        
        this.#mainCardDiv.appendChild(this.#createHeader());
        this.#mainCardDiv.appendChild(this.#createBody());
        this.#mainCardDiv.appendChild(this.#createFooter());        
        return this.#mainCardDiv;
    }

    #createHeader()
    {        
        let header=document.createElement("div");
        header.classList="card-header";
        header.style.backgroundColor = this.#color;  // styling option

        let title=document.createElement("h5");
        title.classList="card-title";
        title.innerText=this.#name;
        header.appendChild(title);

        let switchDiv=document.createElement("div");
        switchDiv.classList="custom-control custom-switch float-left";

        this.#removeToggle=document.createElement("input");
        this.#removeToggle.classList="removeToggle custom-control-input";
        this.#removeToggle.id=this.#name+"Switch";
        this.#removeToggle.type="checkbox";        
        switchDiv.appendChild(this.#removeToggle);

        let label=document.createElement("label");
        label.classList="custom-control-label";       
        label.htmlFor=this.#name+"Switch";
        label.innerText="Remove";
        switchDiv.appendChild(label);

        header.appendChild(switchDiv);

        this.#destroyButton=document.createElement("button");
        this.#destroyButton.classList="btn rounded-pill btn-danger float-right";
        this.#destroyButton.innerText="X";
        header.appendChild(this.#destroyButton);

        return header;
    }
        
    #createBody()
    {
        this.#textDiv=document.createElement("div");
        this.#textDiv.classList="listDiv card-body overflow-auto";
        this.#textDiv.contentEditable=false;

        return this.#textDiv;
    }

    #createFooter()
    {
        let foot=document.createElement("div");
        foot.classList="card-footer";
        foot.style.backgroundColor = this.#color;  // styling option

        let inpGroup=document.createElement("div");
        inpGroup.classList="input-group";
        foot.appendChild(inpGroup);

        this.#addInput=document.createElement("input");
        this.#addInput.classList="form-control float-left";
        this.#addInput.type="text";
        this.#addInput.placeholder="Add item";
        inpGroup.appendChild(this.#addInput);

        let inpAppendGroup=document.createElement("div");
        inpAppendGroup.classList="input-group-append";
        inpGroup.appendChild(inpAppendGroup);

        this.#addButton=document.createElement("button");
        this.#addButton.classList="addButton btn btn-outline-secondary btn-outline-info mb-3";
        this.#addButton.type="button";
        this.#addButton.innerText="Add";
        inpAppendGroup.appendChild(this.#addButton);

        return foot;
       
    }


    #addItem(str, strike)
    {     
        
        let button=document.createElement("button");                
        button.classList="removePill badge badge-danger";
        button.innerText="Remove";
        this.#textDiv.appendChild(button);

        let span=document.createElement("span");        
        span.innerHTML=str;
        if(strike)
        {
            span.classList.add("purchased");
        }
        this.#textDiv.appendChild(span);

        let br=document.createElement("br");
        this.#textDiv.appendChild(br);

        button.focus({preventScroll:false});
        if(!this.#removeToggle.checked)
        {
            button.style="display:none;";
        }
    }
    
    #toggleRemoveButtons()
    {
        let listChildren=this.#textDiv.childNodes;
        for(let i=0;i<listChildren.length;i++)
        {                
            if(listChildren[i].nodeName==="BUTTON")
            {                    
                listChildren[i].style.display="";                    
                if(this.#removeToggle.checked)
                {
                    listChildren[i].style.display="";                        
                }
                else
                {
                    listChildren[i].style.display="none";                        
                }
            }
        }
    }
    
    onUp(event, target, from, item)
    {
        let node=event.target;
        if(target)
        {
            node=target;
        }

        if(node.parentNode==this.#textDiv)
        {
            node=node.parentNode;            
        }        
        
        if(node===this.#textDiv)
        {
            if(node!==from)
            { 
                this.#addItem(item.innerHTML, item.classList.contains("purchased")); 
                
                item.previousElementSibling.remove();
                item.nextElementSibling.remove();                
                item.remove();

            }
            return true;
        }

        return false;
    }

    onClick(event)
    {       
        let node=event.target;
        if(node.nodeName==="SPAN")
        {
            node.classList.toggle("purchased"); // överstrykning
            return true;
        }

        if(node.classList.contains("removePill"))  // lilla remove knappen
        {            
            node.nextElementSibling.remove();
            node.nextElementSibling.remove();
            node.remove();
            return true;            
        }
        
        switch(node)
        { 
            case this.#removeToggle:
                this.#toggleRemoveButtons();
                return true;

            case this.#addButton:
                if(this.#addInput.value)
                {
                    this.#addItem(this.#addInput.value, false);
                    this.#addInput.value=""; 
                }
                return true;

            case this.#destroyButton:                            
                document.dispatchEvent(this.#destroyEvent);
                return true;

        }
        return false;

    }

}