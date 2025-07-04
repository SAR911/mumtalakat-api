const express = require("express")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")

const app = express()
const PORT = process.env.PORT || 3000
const SECRET_KEY = "MUMTALAKAT_SECRET"

const users = [
    { id: 1, email: "test@mumtalakat.sa", password: "123456", name: "عبدالله القرعاوي" }
]

app.use(bodyParser.json())

app.post("/login", (req, res) => {
    const { email, password } = req.body
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) return res.status(401).json({ message: "بيانات الدخول غير صحيحة" })

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" })
    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    })
})

app.post("/logout", (req, res) => {
    res.json({ message: "تم تسجيل الخروج" })
})

app.get("/me", (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ message: "لا يوجد توكن" })

    const token = authHeader.split(" ")[1]
    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        const user = users.find(u => u.id === decoded.id)
        if (!user) throw new Error()
        res.json(user)
    } catch (e) {
        res.status(401).json({ message: "توكن غير صالح" })
    }
})

app.listen(PORT, () => {
    console.log(`✅ Mumtalakat API شغال على المنفذ ${PORT}`)
})
