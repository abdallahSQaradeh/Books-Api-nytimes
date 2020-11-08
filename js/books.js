const key=config.key;
let input = document.getElementById('books-search');
let search_result = document.getElementsByClassName('search-result')[0];
let l_names=[];
let field_encoded='';

window.addEventListener('scroll',(e)=>
{
    let nav =  document.getElementsByClassName("navigation")[0];
    if(window.pageYOffset>50)
    {
       nav.classList.add("scrolled");


    }else
    {
        nav.classList.remove("scrolled");
    }
})

async function  names(){

   
    const url =`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${key}`;
    await fetch(url,{
        method:"GET",
        credentials:'same-origin'
    }).then(response=>response.json())
    .then(response=>
        {
            let footer =document.getElementsByClassName('footer')[0]
            footer.children[0].textContent = response.copyright;
 
            return response.results
       
    })
    .then(results=>
        {
            results.map(name=>{
                l_names.push(name)
            });
        }).catch(err=>console.log(err));

}
function search()
{
    
    search_result.innerHTML = "";
    search_result.style.display="block";
    let x = l_names.filter((item,idx)=>
        {
            
            return item.list_name.toLowerCase().includes(input.value) 
        }).filter((_,idx)=>idx<7).map(item=>
            {
                let li_ = document.createElement("li");
                li_.textContent = item.display_name;
                li_.addEventListener('click',(e)=>
                {
                    input.value = e.target.textContent;
                    field_encoded=item.list_name_encoded;
                    search_result.style.display="none";
                    tryApi();
                })
                search_result.appendChild(li_)
            })
        
}
function undoSearch()
{
    search();
    if(input.value.length ==0) search_result.style.display="none";
}

function tryApi()
{
    let bookslist= document.getElementsByClassName("books-list")[0];
    bookslist.innerHTML ="";
    let search = field_encoded;



  
    const url = `https://api.nytimes.com/svc/books/v3/lists/current/${search.length<=0?'combined-print-and-e-book-fiction':search}.json?api-key=${key}`;
    fetch(url,{
        method:"GET",
        credentials:'same-origin'
    }).then(res=>res.json()).then(res=>{

        if(!res.errors)
        {let books = res.results.books;
            let src, title,publisher,author,contributer,discription;
            books.map(book=>
                {
                    let buy=[];
                    src=book.book_image;
                    title=book.title;
                    author=book.author;
                    contributer=book.contributor;
                    publisher=book.publisher;
                    discription= book.description;
                   
                    if(!discription)
                    {
                        discription="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, molestiae ipsum cum officia ut autem error praesentium maiores quae nobis cupiditate quo maxime assumenda velit placeat vitae tempora omnis tempore?";
                    }
                    book.buy_links.forEach((buyer)=>
                    {
                        buy.push(buyer.url);
                    })
                    let li = document.createElement("li");
                    li.classList.add("books-item");
                    li.innerHTML =`<span class="book-rank">
                    #${book.rank}
                </span>
                <div class="book-container">
                    <img class="book-image" src=${src} alt=${title}>
                    <div class="book-info">
                        <div class="book-header">
                            <h3 class="book-title">${title}</h3>
                            <div class="publisher">
                                <ion-icon name="book-outline"></ion-icon>
                                <h3 class="book-publisher">${publisher}</h3>
                            </div>
                        </div>
                        
                        <div class="book-people">
                           <p class="book-author">${author}</p>
                        <p class="book-contributer">${contributer}</p> 
                        </div>
                        
                        <p class="book-discreption">${discription}</p>
                        <div class="buy-book" onclick="extend()">
                            <div class="buy">
                               <span>Buy</span><ion-icon name="add-outline"></ion-icon> 
                            </div>
                            <div class="providers">
                                <ul class="provider-links">
                                <li><a href="${buy[0]}">
                                <img title="amazon"  src="assets/amazon.png">
                            </a></li>
                            <li><a href=" ${buy[1]}">
                                <img title="iBooks"  src="assets/iBooks-icon.png">
                            </a></li>
                            <li><a href="${buy[2]}">
                                <img title="Barnesnoble"  src="assets/BarnesNoble_logo.jpg">
                            </a></li>
                            <li><a href="${buy[3]}">
                                <img title="books-a-million"  src="assets/books-a-million-logo.jpg">
                            </a></li>
                            <li><a href="${buy[4]}">
                                <img title="bookshop" src="assets/bookshop.png">
                            </a></li>
                            <li><a href="${buy[5]}">
                                <img title="indiebound"  src="assets/indiebound.png">
                            </a></li>
                                </ul>
                            </div>
                            
                        </div>    
                    </div>
                </div>`
                    bookslist.appendChild(li);
                })
            
            

        }else{
            let bookslist= document.getElementsByClassName("books-list")[0]; 
            let li =document.createElement("li");
            li.classList.add("books-item");
            li.textContent = res.errors;
            bookslist.appendChild(li);
        }
        



    }).catch(err=>
        {
            let bookslist= document.getElementsByClassName("books-list")[0]; 
            let li =document.createElement("li");
            li.classList.add("books-item");
            li.textContent = err;
            bookslist.appendChild(li);
        });
}
function extend()
{
    const providers = document.getElementsByClassName("providers")[0];
    providers.style.display ="flex";
    providers.style.width="300px";
}

    names();
    tryApi();

 

