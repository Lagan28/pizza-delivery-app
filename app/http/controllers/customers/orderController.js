const Order = require('../../../models/order')
const moment = require('moment')

function orderController(){
    return {
        store(req,res) {
            /*console.log(req.body)*/
            //Validating requests
            const { phone, address } = req.body
            if(!phone || !address){
                req.flash('error','All fields are mandatory')
                return res.redirect('/cart')
            }

            //creating an order
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save().then( result => {
                req.flash('success','order placed successfully')
                delete req.session.cart
                return res.redirect('/customer/orders')
                /*console.log('order success')*/
            }).catch(err => {
                req.flash('error','something went wrong')
                return res.redirect('/cart')
                /*console.log('order failed')*/
            })
        },
        async index(req,res){
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } }) //last option to print the list of orders in descending order in accordance with the timestamp
            res.header('Cache-Control','no-cache,private,no-store, must-revalidate, max-stale=0, post-check=0, pre-check = 0') //for no cache on back button
            res.render('customers/orders', { orders: orders, moment: moment }) //sending info to the frontend
            /*console.log(orders)*/
        }
    }
}

module.exports = orderController