const Order = require('../../../models/order')

function orderController () {
    return {
        store(req,res) {
            /*console.log(req.body)*/
            //Validating requests
            const { phone, address } = req.body
            if(!phone || !address){
                req.flash('error','All fields are mandatory')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save().then( result => {
                req.flash('success','order placed successfully')
                /*return res.redirect('/')*/
                console.log('order success')
            }).catch(err => {
                req.flash('error','something went wrong')
                /*return res.redirect('/cart')*/
                console.log('order failed')
            })
        }
    }
}

module.exports = orderController