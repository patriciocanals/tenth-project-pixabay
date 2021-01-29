const form =  document.querySelector('#form');
const resultDiv = document.querySelector('#result');
const pagDiv = document.querySelector('#pag');

const resultsByPage = 40;
let totalPages;
let iterator;
let currentPage = 1;

window.onload = () => {
    form.addEventListener('submit',validateForm);
}

function validateForm(e){
    e.preventDefault();

    const keyword = document.querySelector('#keyword').value;
    if(keyword === ''){
        showAlert('Write something');
        return;
    }

    searchImages();
}

function showAlert(msg){
    const previousAlert = document.querySelector('.exists');
    if(!previousAlert){
        const alert = document.createElement('p');
        alert.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','exists');
        alert.innerHTML = `
            <strong><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></strong>
            <span class="block sm:inline">${msg}</span>
        `;
        form.appendChild(alert);
    
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

async function searchImages(){
    const keyword = document.querySelector('#keyword').value;
    const apiKey = '20051212-e88f5a0bb397049a3256842c5';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${keyword}&per_page=${resultsByPage}&page=${currentPage}`;
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        totalPages = calculatePages(result.totalHits);
        showImages(result.hits);
    } catch (error) {
        console.log(error);
    }
}

function *createPages(total){
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calculatePages(total){
    return parseInt( Math.ceil(total/resultsByPage) )
}

function showImages(images){
    while(resultDiv.firstChild){
        resultDiv.removeChild(resultDiv.firstChild);
    }
    images.forEach(image => {
        const {previewURL,likes,views,largeImageURL,downloads} = image;
        resultDiv.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    <div class="w-full p-4 inline-flex justify-around">
                        <p><span class="text-center"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg></span>${likes}</p>
                        <p><span class="text-center"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></span>${views}</p>
                        <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer"> <span class="text-center"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>${downloads}</span> </p>
                    </div>
                </div>
            </div>
        `;
    })

    while(pagDiv.firstChild){
        pagDiv.removeChild(pagDiv.firstChild);
    }
    printPages();
}

function printPages() {
    iterator = createPages(totalPages);
    
    while(true){
        const {value,done} = iterator.next();
        if(done) return;
        const btn = document.createElement('a');
        btn.href = '#';
        btn.dataset.pag = value;
        btn.textContent = value;
        btn.classList.add('next','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-3','rounded');

        btn.onclick = () => {
            currentPage = value;
            searchImages();
        }

        pagDiv.appendChild(btn);
    }
}