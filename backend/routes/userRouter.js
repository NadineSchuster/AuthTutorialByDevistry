const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const connection = require('../database');

router.post("/register", async (req, res) => {
    try {
        let { email, password, passwordCheck, displayName } = req.body;

        console.log(req.body);

        // validation
        if(!email || !password || !passwordCheck){
            return res
                .status(400)
                .json({msg: "Not all fields have been entered."});
        }
        if(password.length < 5){
            return res
                .status(400)
                .json({ msg: "The password needs to be at least 5 charakters long."})
        }
        if(password !== passwordCheck){
            return res
                .status(400)
                .json({ msg: "Enter the same password twice for verification."})
        }

        // Here must be checked, if the email is unique
        // const existingUser = " "; // = await check DB for email
        // if(existingUser){
        //     return res
        //         .status(400)
        //         .json({ msg: "An Account with this email already exists."})
        // }

        if(!displayName) displayName = email;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = {
            name: displayName,
            password: passwordHash,
            email: email
        };

        console.log(user);

        let sql = "INSERT INTO registeredUsers SET ?";

        let insertion = connection.query(sql, user, (err, result) => {
            if (err) throw err;
            console.log(result);
        });

        res.status(201).send();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ msg: "Not all fields have been entered." });
        }

        let sql = `SELECT * FROM registeredUsers WHERE email = "${email}"`;

        let query = connection.query(sql, async (err, result) => {
            if (err) throw err;

            let user = result[0];

            if (user == null) {
                return res.status(400).send('Cannot find user');
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
            
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
           
            res.json({
                token,
                user: {
                    id: user.id,
                    displayName: user.name
                },
            });
        });

    } catch (err){
        res.status(500).json({ error: err.message })
    }
})

router.delete("/delete", auth, async (req,res) => {
    try {
        // const deletedUser = await delete user where Id == Id
        // res.json(deletedUser)
        // let sql = `DELETE * FROM registeredUsers WHERE Id = "${req.user.id}" LIMIT 1`
        console.log(req.user);
        res.json("Jo, ok, alles klar, Befehl angekommen.");
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

router.post("/tokenIsValid", async ( req, res ) => {
     try {
         const token = req.header("x-auth-token");
         if(!token) return res.json(false);

         const verified = jwt.verify(token, process.env.JWT_SECRET);
         if (!verified) return res.json(false);

         // schauen, ob User in der Datenbank existiert

         // Check if user exists QUERY
        // let sql = `SELECT EXISTS(SELECT * FROM registeredUsers WHERE  id = "${loggedInUserId}");`;

         return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/", auth, async (req, res) => {
   
    let loggedInUserId = await req.user.id;
    
    let sql = `SELECT * FROM registeredUsers WHERE id = "${loggedInUserId}"`;

    try{

        let query = await connection.query(sql, async (err, result) => {
            if (err) throw err;
            
            let user = result[0];

            if (user == null) {
                return res.status(400).send('Cannot find user');
            }

            res.json({
                user: {
                    id: user.id,
                    displayName: user.name
                },
            });
        });

    } catch (err) {

        res.status(500).json({ error: err.message })
        
    }
})

module.exports = router;