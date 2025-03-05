const express = require('express');
const connection = require('./config/DbConnection');
const UserDoc = require('./models/UserSchema');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const SellerModel = require('./models/SellerSchema');
const MedicineModel = require('./models/Medicines');
const multer = require('multer');
const PORT = process.env.PORT || 9001;
const secret = 'thisissecret'
const path = require('path');
const cron = require('node-cron')

const OrderModel = require('./models/OrderSchema.js');
// const { userRouter } = require('./routes/userRoutes');
// import userRoutes from './routes/userRoutes.js'
const userRoutes = require('./routes/userRoutes.js');

connection();

app.use(express.json())

app.use(cors(corsOptions))

app.use(cookieParser())

app.use('/uploads', express.static('uploads'));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where images will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Give the file a unique name
    }
});

const upload = multer({ storage });



app.use('/', userRoutes)

// app.post('/login', async (req, res) => {
    
//     const { email, password } = req.body;
//     // console.log(req.body)

//     const isExistUser = await UserDoc.findOne({email: email});
    
//     if(isExistUser) {   
        
//         // const isCorrectPassword = bcryptjs.compareSync(password, isExistUser.password);
//         const isCorrectPassword = bcryptjs.compareSync(password, isExistUser.password);

//         if(isCorrectPassword) {

//             jwt.sign({email: isExistUser.email}, secret, {}, (err, token) => {

//                 if(err) {
//                     throw err;
//                 }

//                 res.cookie('token', token, {
//                     httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
//                     secure: false,    // Set to true in production if using HTTPS
//                     sameSite: 'Lax',  // Helps with CSRF protection
//                     maxAge: 5 * 60 * 1000 // 1 hour expiration
//                 });
//                 return res.status(200).json({message: "Login Successful", user: isExistUser})
//             })


//         }
//         else {
//             return res.status(401).json({message: "Password is incorrect. Please try again."});
//         }

//     }
//     else {
//         return res.status(402).json({message: "User didn't register"});
//     }
// })

// app.post('/register', async (req, res) => {
    
//     const { username, password, email } = req.body;
    
//     const existingUser = await UserDoc.findOne({email: email});
    
    
//     if(existingUser) {
//         return res.status(400).json({message: "User already exists."})
//     }
    
//     const hashedPassword = bcryptjs.hashSync(password, 10);
    
//     try {
//         const user = await UserDoc.create({
//             email,
//             username,
//             password: hashedPassword
//         })

//         return res.status(201).json({message: "User registered Successfully."})
//     }
//     catch(err) {
//         return res.status(500).json({ message: 'Server error. Please try again later.' });
//     }

// })


// app.get('/user-info', async (req, res) => {

//     const cookieData = req.cookies.token;
//     // console.log(cookieData)

//     if (!cookieData) {
//         return res.status(401).json({ message: "No token provided. Please log in.", path: "/login"});
//     }

//     jwt.verify(cookieData, secret, {}, async (err, userData) => {

//         if(err) {
//             throw err;
//         }
//         // console.log(userData);
//         const email = userData.email;
//         const userDoc = await UserDoc.findOne({email: email});
        
//         return res.status(200).json(userDoc)
        
//     })

//     // res.status(200).json(cookieData)
// })


// app.post('/sellerSignup', async (req, res) => {

//     const {email, shopName, password, location, gstin } = req.body;
//     try {

//         const hashedPassword = bcryptjs.hashSync(password, 10);
//         const sellerDoc = await SellerModel.create({ email: email, shopName: shopName, password: hashedPassword, location: location, gstin: gstin });
//         // console.log(sellerDoc)
//         return res.status(200).json({message: "Succesfully Created"})
//     }

//     catch(err) {
//         res.status(500).json({message: "Already Registered."})
//     }
// })

// app.post('/sellerLogin', async (req, res) => {

//     const { email, password } = req.body;

//     const isExistSeller = await SellerModel.findOne({email: email});

//     if(!isExistSeller) {

//         return res.status(402).json({message: "No Account Found."});
//     }   

    

//     const isCheck = bcryptjs.compareSync(password, isExistSeller.password);


//     if(isCheck) {

//         jwt.sign({id: isExistSeller._id, name: isExistSeller.shopName}, secret, {}, (err, token) => {
//             if(err) {
//                 throw err;
//             }
            
//             res.cookie('token', token, {
//                 httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
//                 secure: false,    // Set to true in production if using HTTPS
//                 sameSite: 'Lax',  // Helps with CSRF protection
//                 maxAge: 5 * 60 * 1000 // 1 hour expiration
//             });
//             return res.status(200).json({message: "Succesfully Created", seller: isExistSeller })
//         })

//     }
//     else {
//         return res.status(402).json({message: "Invalid Credentials."});
//     }
    
// })

// app.get('/seller-info', async (req, res) => {

//     const token = req.cookies.token;

//     if(!token) {
//         return res.status(400).json({message: "Login again", path: '/login'})
//     }

//     jwt.verify(token, secret, {}, async (err, data) => {
//         if(err) {
//             throw err;
//         }
//         // console.log(data)
//         const sellerDoc = await SellerModel.findOne({_id: data.id});

//         // console.log(sellerDoc)
//         return res.json(sellerDoc);
//     })
// })

app.get('/', async(req, res) => {
    console.log("HOllo")
    res.json({message: "HOllo"})
})

app.post('/addMedicine', upload.single('image'), async (req, res) => {

    
    const { medicineName, count, price, description, category, discount, discountedPrice } = req.body;
    const file = req.file;


    // console.log(file.path)
    // console.log(file.filename)
    // console.log(file)
    
    const tok = req.cookies.token1;

    if(!tok) {
        return res.status(400).json({message: "Login again"});
    }

    let sellerId = "";
    let sellerName = "";

    jwt.verify(tok, secret, {}, async (err, data) => {
        
        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }
        
        // return res.status(200).json(data);
        sellerId = data.id;
        sellerName = data.name
    })


    const SellerDoc = await SellerModel.findById({_id: sellerId});
    // const shopName = SellerDoc.shopName;
    const isPresent = await MedicineModel.findOne({name: medicineName, seller: sellerId, price })
    if(isPresent) {
        // isPresent.count += count;
        // await isPresent.save();
        return res.status(409).json({
            message: "Medicine with the same name and price already exists. You can change in Update Section",
            existingCount: SellerDoc.count
        });
    }
    else {

        const medicineDoc = await MedicineModel.create({ name: medicineName, seller: sellerId, count, price, discountedPrice, discount, description, image: file.filename, category, location: SellerDoc.location });
        
        await SellerModel.updateOne(
            { _id: sellerId },
            { $push: { medicinesUploaded: { _id: medicineDoc._id, medicine: medicineName , seller: sellerId, count, price, description, category, image: file.filename} } }
            );
        }
    // console.log(medicineName, shopName, count, price, description, file.filename, category)
    

    res.status(200);
    
})

app.post('/allMedicines', async (req, res) => {

    // console.log(req.body)
    const { searchItem } = req.body;
    // console.log(searchItem)
    try {

        const medicines = await MedicineModel.find({
            name: { $regex: searchItem, $options: 'i' } // 'i' makes it case-insensitive
        });
        // console.log(medicines)
        res.status(200).json(medicines);
        
    }

    catch(err) {
        console.log(err);
    }
})

app.post('/addToCart', async (req, res) => {

    const { id } = req.body;

    try {

        const medicine = await MedicineModel.findById(id);
        // console.log("this is ", medicine)

        if(!medicine) {
            return res.status(400).json({message: "No Medicine Found"})
        }
        const token = req.cookies.token;

        jwt.verify(token, secret, {}, async(err, data) => {
            if(err) {
                return res.status(401).json({ message: "Session has expired. Login in." });
            }

            const userEmail = data.email;
            const userId = data.id;
            // console.log(data, "this");
            const User = await UserDoc.findOne({email: userEmail});
            // const User = await UserDoc.findById(userId)
            // console.log(User)
            const cartItems = User.cart;

            const isPresent = cartItems.filter((item) => item._id.toString() === id);
            // some method can also be used to check presence of item in array

            if(isPresent.length === 0) {

                await UserDoc.updateOne(
                    { email: userEmail },
                    { $addToSet: { cart: {  _id: medicine._id,
                        name: medicine.name,
                        seller: medicine.seller,
                        price: medicine.price,
                        description: medicine.description,
                        discountedPrice: medicine.discountedPrice,
                        discount: medicine.discount,
                        image: medicine.image }}}
                );
    
                    const doc = await UserDoc.findOne({email: userEmail});
                    // console.log(doc.cart)
                    res.status(200).json({message: "Added to cart", items: doc.cart});
            }
            else {
                res.status(200).json({message: "Item is already present in Cart"});
            }

        })

           
    }

    catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }
})

app.get('/addToCart', async (req, res) => {

    
    try {
        const token = req.cookies.token;

        jwt.verify(token, secret, {}, async(err, data) => {
            if(err) {
                
                return res.status(401).json({ message: "Session has expired. Login in." });
            }
            const userEmail = data.email;
            const doc = await UserDoc.findOne({email: userEmail});
            const arr = [];
            // console.log(doc.cart)
            for(let i = 0; i < doc.cart.length; i++) {
                const id  = doc.cart[i]._id;
                console.log(id);
                const noo = await MedicineModel.findById(id);
                console.log(noo);
                const foundItemCount = noo.count
                arr.push(foundItemCount);
            }
            // console.log(arr)
            // console.log(doc.cart)
            res.status(200).json({message: "added to cart", items: doc.cart, itemsCount: arr});
        })
    }

    catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }
})

app.get('/inventory', async (req, res) => {

    const token = req.cookies.token1;

    if(!token) {
        return res.status(401).json({message: "Login again"});
    }


    jwt.verify(token, secret, {}, async (err, data) => {

        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }

        const sellerId = data.id;

        const SellerDoc = await SellerModel.findById(sellerId);
        // console.log(SellerDoc.medicinesUploaded)
        res.status(200).json(SellerDoc.medicinesUploaded);
    })

})

app.post('/sellerLogout', (req, res) => {
    res.cookie('token', '', { 
        httpOnly: true, 
        secure: false,  // Set to true in production if using HTTPS
        sameSite: 'Lax', 
        maxAge: 0       // Expire the cookie immediately
    });
    return res.status(200).json({message: "Successfully logged out"});
});



app.post('/buy', async (req, res) => {

    const { id } = req.body;

    try {

        const medicine = await MedicineModel.findById(id);

        if(!medicine) {
            return res.status(400).json({message: "No Medicine Found"})
        }
        const token = req.cookies.token;

        jwt.verify(token, secret, {}, async(err, data) => {
            if(err) {
                // throw err;
                return res.status(401).json({ message: "Session has expired. Login in." });
            }

            const userEmail = data.email;
            // console.log(data);

            await UserDoc.updateOne(
                { email: userEmail },
                { $addToSet: { booked: {  _id: medicine._id,
                    name: medicine.name,
                    seller: medicine.seller,
                    price: medicine.price,
                    description: medicine.description, }}}
            );

                const doc = await UserDoc.findOne({email: userEmail});
                // console.log(doc.booked)
                res.status(200).json({message: "Booked Item", items: doc.booked});
        })
    }

    catch(err) {
        console.log(err);
    }
})


app.post('/bookAllCart', async (req, res) => {

    const items = req.body;
    console.log(req.body)
    
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({path: "/login"});
    }

    jwt.verify(token, secret, {}, async (err, data) => {

        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }
        const email = data.email;

        const user = await UserDoc.findOne({email: email});

        let accept = 1; 
        let notAcceptedItems = []
        for(let i = 0; i < items.length; i++) {
            const itemId = items[i]._id;
            const count = items[i].count
            const foundItem = await MedicineModel.findById(itemId);

            if(foundItem.count < count) {
                notAcceptedItems.push(items[i].name)
                accept = 0;
            }
            
        }

        if(accept === 1) {

            // const allCartItems = user.cart;
            const allCartItems = items;
            let totalAmount = 0;

            for(let i = 0; i < items.length; i++) {
                const itemId = items[i]._id;
                const count = items[i].count
                const foundItem = await MedicineModel.findById(itemId);
    
                // if(foundItem.count < count) {
                   foundItem.count -= count
                   await foundItem.save();
                // }
                totalAmount += (foundItem.discountedPrice * count)
            }
            
            for(let i = 0; i < items.length; i++) {
                const sellerId = items[i].seller;
                const count = items[i].count
                const itemId = items[i]._id
                const seller = await SellerModel.findById(sellerId);
                const foundItem = seller.medicinesUploaded.find(m => m._id.toString() === itemId);
                
                // console.log("this")
                // console.log(foundItem);
                // if(foundItem.count < count) {
                   foundItem.count -= count
                   await seller.save();
                //   console.log(foundItem)
                // }
            }
            // console.log("this are products", items)

            const newOrder = new OrderModel({
                userId: user._id,
                deliveryDate: new Date(),
                products: items,
                totalAmount: totalAmount,

            })
            await newOrder.save()
            console.log(newOrder)
            console.log(newOrder._id)
        
            await UserDoc.updateOne({ email: email },
                // {$push : {booked: allCartItems}})
                { $push: { booked: { orderId: newOrder._id } } })
                
                
                await UserDoc.updateOne(
                    { email: email },          
                    { $set: { cart: [] } }
                    );
                    return res.status(200).json({message: "Order Successfully Placed"});
                }
                else {

                    return res.status(200).json({message: "not Accept", items: notAcceptedItems})
                }
        

    })
})



// * * * * * -> it says that it sends request every minute

cron.schedule('* * * * *', async () => {
    // console.log(Date.now())
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  
    // Find and update orders older than 10 minutes
    // await OrderModel.updateMany(
    //   { orderStatus: 'Current', createdAt: { $lte: tenMinutesAgo } },
    //   { $set: { orderStatus: 'Past' } }
    // );
    const ordersToUpdate = await OrderModel.find({
        orderStatus: 'Current',
        createdAt: { $lte: tenMinutesAgo }
      });

      for (let order of ordersToUpdate) {
        // Update order status to 'Past'
        await OrderModel.updateOne(
          { _id: order._id },
          { $set: { orderStatus: 'Past' } }
        );
  
        // Add the order to the 'received' array of the corresponding user
        await UserDoc.updateOne(
          { _id: order.userId },
          {
            $pull: {
                booked: { orderId: order._id }
              },
            $push: {
              received: {
                orderId: order._id,
                // name: order.products.map(product => product.name).join(', '),
                // seller: 'Seller Info', // Update if you have actual seller information
                // price: order.totalAmount,
                // description: `Order for products: ${order.products.map(product => product.name).join(', ')}`,
                // image: order.products[0]?.image || 'default-image-url' // If the product has an image
              }
            }
          }
        );
      }
  
    console.log('Checked and updated orders');
  });



app.post('/updateCount', async (req, res) => {

    const token = req.cookies.token1;

    if(!token) {
        return res.status(200).json({path: "/login"});
    }

    jwt.verify(token, secret, {}, async (err, data) => {

        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }

        const sid = data.id;

        // const user = await UserDoc.findOne({email: email});


        const { id, count } = req.body;

        const aa = await MedicineModel.updateOne({_id : id},
        {$set : {count: count}})
        
        const cc = await MedicineModel.findById({_id: id})
        // const seller = await SellerModel.findOne({email: email})

        const bb = await SellerModel.updateOne(
            { _id: sid, "medicinesUploaded._id": id },
            { $set: { "medicinesUploaded.$.count": count } }
        );
        console.log(count)
        console.log(cc)
        console.log(bb)
        res.status(200).json();
    })

    
})


// app.get('/userPastOrders', async (req, res) => {

//     const token = req.cookies.token;

//     if(!token) {
//         return res.status(200).json({path: "/login"});
//     }

//     jwt.verify(token, secret, {}, async (err, data) => {

//         if(err) {
//             // throw err;
//             return res.status(401).json({ message: "Session has expired. Login in." });
//         }

//         const email = data.email;

//         const user = await UserDoc.findOne({email: email});
//         // console.log(user)
//         const userPastOrders = user.booked;
//         // console.log(userPastOrders)

//         return res.status(200).json(userPastOrders);

//     })
// })


app.get('/userDashboard', async (req, res) => {

    const token = req.cookies.token;

    if(!token) {
        return res.status(200).json({path: "/login"});
    }

    jwt.verify(token, secret, {}, async (err, data) => {

        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }

        const email = data.email;

        const user = await UserDoc.findOne({email: email});
        // console.log(user)
        const userPastOrdersLength = user.booked.length;
        console.log(userPastOrdersLength)

        return res.status(200).json({a: userPastOrdersLength});

    })
    
})


app.put('/userUpdatedetails', async (req, res) => {

    // const { username, email, password } = req.body;
    // console.log("this is ", req.body.password)
    // console.log(req.body.data.username)
    // console.log(req.body.data.email)
    const password = req.body.password

    const token = req.cookies.token;

    if(!token) {
        return res.status(200).json({path: "/login"});
    }

    jwt.verify(token, secret, {}, async (err, data) => {

        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }
        // console.log(req.body)
        const email = data.email;

        const updateFields = {};
            if (req.body.data.username) updateFields.username = req.body.data.username;
            if (req.body.password) updateFields.password = bcryptjs.hashSync(req.body.password, 10);
            if (req.body.data.email) updateFields.email = req.body.data.email;

            // const us = await UserDoc.findOne({email: req.body.email});

            // if(us) {
            //     return res.status(400).json({message: "Email is already registered"});
            // }
            

        const user = await UserDoc.updateOne({email: email},{
            $set: updateFields 
        });
        // console.log(user)
        // console.log(user)

        jwt.sign({email: req.body.data.email}, secret, {}, (err, token) => {
            // console.log(req.body.dat.use)
            if(err) {
                throw err;
            }

            res.cookie('token', token, {
                httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
                secure: false,    // Set to true in production if using HTTPS
                sameSite: 'Lax',  // Helps with CSRF protection
                maxAge: 5 * 60 * 1000 // 1 hour expiration
            });
            console.log("success");
            // return res.status(200).json({message: "Login Successful", user: isExistUser})
            return res.status(200).json({message1: "Success"});
        })

        
      

        // return res.status(200).json({message1: "Success"});

    })
})


app.post('/deleteCartItem', async (req, res) => {


    const token = req.cookies.token;

    if(!token) {
        return res.status(200).json({path: "/login"});
    }

    jwt.verify(token, secret, {}, async (err, data) => {

        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }
        // console.log(req.body)
        const email = data.email;
        // console.log(data)

        const user = await UserDoc.findOne({email: email});
        const itemId = req.body.cartId;
        const items = user.cart.filter((item) => item._id.toString() !== itemId)

        user.cart = items;
        user.save();

        res.status(200).json({message: "Successfully Deleted Item", items: user.cart.length})


    })
})

app.get('/userPastOrders', async(req, res) => {

    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({path: "/login"});
    }

    jwt.verify(token, secret, {}, async (err, data) => {

        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }
        // console.log(req.body)
        const email = data.email;
        // console.log(data)

        const user = await UserDoc.findOne({email: email});

        const receivedOrderId = user.received;
        const receivedOrderList = [];

        for(let i = 0; i < receivedOrderId.length; i++) {
            const item = await OrderModel.findOne({_id: receivedOrderId[i].orderId})
            receivedOrderList.push(item)
        }

        // console.log("this is ", receivedOrderList)
        receivedOrderList.reverse()
        res.status(200).json({receivedItems: receivedOrderList})
        


    })


})


app.get('/userCurrentOrders', async(req, res) => {
    // console.log("got it ")
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({path: "/login"});
    }

    jwt.verify(token, secret, {}, async (err, data) => {

        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }
        // console.log(req.body)
        const email = data.email;
        // console.log(data)

        const user = await UserDoc.findOne({email: email});

        const currentOrderId = user.booked;
        const currentOrderList = [];

        for(let i = 0; i < currentOrderId.length; i++) {
            const item = await OrderModel.findOne({_id: currentOrderId[i].orderId})
            currentOrderList.push(item)
        }

        currentOrderList.reverse()
    
        res.status(200).json({currentItems: currentOrderList})
    
    })
})

app.get('/userHomeCurrentOrders', async(req, res) => {
    // console.log("got it ")
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({path: "/login"});
    }

    jwt.verify(token, secret, {}, async (err, data) => {

        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }
        // console.log(req.body)
        const email = data.email;
        console.log(email)
        // console.log(data)

        const user = await UserDoc.findOne({email: email});
        // console.log(user)
        const currentOrderId = user.booked;

        const currentOrderList = [];

        if(currentOrderId.length > 0) {

            for(let i = 0; i < Math.min(2, currentOrderId.length); i++) {
                const item = await OrderModel.findOne({_id: currentOrderId[i].orderId})
                currentOrderList.push(item)
            }
        }
        
        res.status(200).json({currentItems: currentOrderList})
    
    })
})

app.get('/topDeals', async(req, res) => {
    // console.log("got it ")
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({path: "/login"});
    }

    jwt.verify(token, secret, {}, async (err, data) => {

        if(err) {
            // throw err;
            return res.status(401).json({ message: "Session has expired. Login in." });
        }
        // console.log(req.body)

        const dealItems = await MedicineModel.find().sort({discount: -1}).limit(10)
        return res.status(200).json({items: dealItems})

        // const email = data.email;
        // // console.log(data)

        // const user = await UserDoc.findOne({email: email});

        // const currentOrderId = user.booked;
        // const currentOrderList = [];

        // for(let i = 0; i < 2; i++) {
        //     const item = await OrderModel.findOne({_id: currentOrderId[i].orderId})
        //     currentOrderList.push(item)
        // }
        
        // res.status(200).json({currentItems: currentOrderList})
    
    })
})
















// Seller Code starts from here
app.get("/getTimeSeries", async (req, res) => {
    try {
      const medicines = await MedicineModel.find();
      const timeIntervals = ["30m", "45m", "1h", "1d", "1m", "3m", "6m", "12m"];
  
      const result = timeIntervals.map((interval) => {
        const count = medicines.filter((med) => {
          const timeDifference = new Date() - new Date(med.createdAt);
          return timeDifference <= getIntervalMilliseconds(interval);
        }).length;
  
        return { time: interval, count };
      });
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch time-series data" });
    }
  });
  
  const getIntervalMilliseconds = (interval) => {
    switch (interval) {
      case "30m":
        return 30 * 60 * 1000;
      case "45m":
        return 45 * 60 * 1000;
      case "1h":
        return 60 * 60 * 1000;
      case "1d":
        return 24 * 60 * 60 * 1000;
      case "1m":
        return 30 * 24 * 60 * 60 * 1000;
      case "3m":
        return 90 * 24 * 60 * 60 * 1000;
      case "6m":
        return 180 * 24 * 60 * 60 * 1000;
      case "12m":
        return 365 * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  };
  
  app.get("/inventory/:category", async (req, res) => {
    const { category } = req.params;
    try {
      const medicines = await MedicineModel.find({ category: category });
      res.status(200).json(medicines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch medicines by category" });
    }
  });
  
  const authenticateToken = (req, res, next) => {
    const token = req.cookies.token1; // Get token from cookies
  
    if (!token) {
      return res
        .status(403)
        .json({ message: "Access denied. No token provided." });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
      }
      req.user = user; // Attach user data to the request
      next(); // Proceed to the next middleware or route handler
    });
  };
  
  app.get("/givesellerdata", authenticateToken, async (req, res) => {
    try {
      const sellerId = req.user.id; // Assuming the user ID is embedded in the JWT token
      const seller = await SellerModel.findById(sellerId);
  
      if (!seller) {
        return res.status(404).json({ message: "Seller not found." });
      }
  
      // Send the relevant data to the frontend
      const { shopName, location, gstin } = seller;
      res.json({ shopName, location, gstin });
    } catch (error) {
      console.error("Error fetching seller data:", error);
      res.status(500).json({ message: "Server error. Could not load profile." });
    }
  });
  
  app.patch("/updatesellerprofile", authenticateToken, async (req, res) => {
    try {
      const sellerId = req.user.id; // Extract user ID from the token
      const { shopName, location, gstin } = req.body;
  
      // Validate input
      if (!shopName && !location && !gstin) {
        return res.status(400).json({ message: "No profile fields to update." });
      }
  
      // Update the seller's profile
      const updatedSeller = await SellerModel.findByIdAndUpdate(
        sellerId,
        {
          ...(shopName && { shopName }),
          ...(location && { location }),
          ...(gstin && { gstin }),
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedSeller) {
        return res.status(404).json({ message: "Seller not found." });
      }
  
      res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
      console.error("Error updating seller profile:", error);
      res
        .status(500)
        .json({ message: "Server error. Failed to update profile." });
    }
  });
  
  // Update seller password
  app.patch("/updatepassword", authenticateToken, async (req, res) => {
    try {
      const sellerId = req.user.id; // Extract user ID from the token
      const { currentPassword, newPassword } = req.body;
  
      // Validate input
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Both current and new passwords are required." });
      }
  
      // Find the seller
      const seller = await SellerModel.findById(sellerId);
      if (!seller) {
        return res.status(404).json({ message: "Seller not found." });
      }
  
      // Check if the current password is correct
      const isMatch = await bcryptjs.compare(currentPassword, seller.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect." });
      }
  
      // Hash the new password and update it
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      seller.password = hashedPassword;
      await seller.save();
  
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Error updating password:", error);
      res
        .status(500)
        .json({ message: "Server error. Failed to update password." });
    }
  });



  app.get("/getRevenue/:sellerID", async (req, res) => {
    const { sellerID } = req.params;
    try {
      const seller = await SellerModel.findById(sellerID).populate(
        "medicinesUploaded"
      );
  
      if (
        !seller ||
        !seller.medicinesUploaded ||
        seller.medicinesUploaded.length === 0
      ) {
        return res
          .status(404)
          .json({ message: "No medicines found for this seller" });
      }
  
      const medicines = seller.medicinesUploaded;
  
      // Calculate Total Revenue and Total Orders
      let totalRevenue = 0;
      let totalOrders = 0;
  
      medicines.forEach((medicine) => {
        if (medicine.discountedPrice && medicine.count) {
          totalRevenue += medicine.discountedPrice * medicine.count;
          totalOrders += medicine.count;
        }
      });
  
      // Calculate Average Order Value
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
      res.status(200).json({
        totalRevenue,
        averageOrderValue,
        totalOrders,
        medicines,
      });
    } catch (error) {
      console.error("Error fetching medicines:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  });



  app.get("/inventory", async (req, res) => {
    const token = req.cookies.token1;
  
    if (!token) {
      return res.status(401).json({ message: "Login again" });
    }
  
    jwt.verify(token, secret, {}, async (err, data) => {
      if (err) {
        // throw err;
        return res
          .status(401)
          .json({ message: "Session has expired. Login in." });
      }
  
      const sellerId = data.id;
  
      const SellerDoc = await SellerModel.findById(sellerId);
  
      // console.log(SellerDoc.medicinesUploaded)
      console.log(SellerDoc.medicinesUploaded);
  
      const items = await MedicineModel.find();
      // console.log(items)
  
      res.status(200).json(SellerDoc.medicinesUploaded);
    });
  });
  
  app.delete("/inventory/:id", async (req, res) => {
    const token = req.cookies.token1;
  
    if (!token) {
      return res.status(401).json({ message: "Login again" });
    }
  
    const { id } = req.params;
    console.log(id);
  
    jwt.verify(token, secret, {}, async (err, data) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Session has expired. Login in." });
      }
  
      try {
        const medicine = await MedicineModel.findByIdAndDelete(id);
        // console.log(data)
        const presentSeller = await SellerModel.findById(data.id);
  
        const items = presentSeller.medicinesUploaded.filter(
          (item) => item._id.toString() !== id
        );
  
        presentSeller.medicinesUploaded = items;
  
        // console.log(items);
  
        await presentSeller.save();
  
        // return res.status(200);
        if (!medicine) {
          return res.status(404).json({ error: "Medicine not found" });
        }
        res.status(200).json({ message: "Medicine deleted successfully" });
        console.log("vit ap chota bheem");
      } catch (error) {
        console.error("Error deleting medicine:", error);
        res.status(500).json({ error: "Failed to delete medicine" });
      }
    });
  });


  const nodemailer = require('nodemailer')
const senderemail = "hexart637@gmail.com";

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderemail,
        pass: 'zetk dsdm imvx keoa'
    }
});



app.post('/contact', async (req, res) => {
    const { name, email, phone, subject, purpose, message } = req.body;

    // Construct email content
    const mailOptions = {
        from: senderemail, // Replace with your email
        to: 'sashankdaram29@gmail.com', // Replace with recipient email
        subject: `Contact Form Submission: ${subject}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log("mail sent");
        res.status(200).json({ message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'An error occurred while sending the message.' });
    }
});







app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
})