import express, { Request, Response } from "express"

const app = express()
const port = 3000

app.get("/", (req: Request, res: Response) => {
  res.json({
    ok: true,
  })
})
app.get("/api/hello", (req: Request, res: Response) => {
  res.json({
    message: "Hello from Express + TypeScript!",
    timestamp: new Date().toISOString(),
  })
})

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
