import axios from 'axios'
import Noty from 'noty'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#class-counter')

function updateCart(pizza){
    axios.post('/update-cart', pizza).then (res=>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: "Item has been added."
        }).show();
    }).catch(err => {
        console.log('err')
        new Noty({
            type: 'error',
            timeout: 1000,
            text: "Item could not be added."
        }).show();
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let pizza = JSON.parse(btn.dataset.pizza) //taking data from data attribute in the home.ejs Add-to-cart button
        updateCart(pizza)
    })
})