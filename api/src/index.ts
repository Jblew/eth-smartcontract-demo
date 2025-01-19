import express, { Request, Response } from "express"
import { TokenService } from "./TokenService"
import fs from "fs"
import path from "path"

const app = express()
const port = 3000

const rpcUrl = process.env.RPC_URL
if (!rpcUrl) {
  throw new Error("Env RPC_URL is not set")
}
const contractAddressFile = "contract/ignition/deployments/chain-11155111/deployed_addresses.json"
const contractDeploymentName = "TokenModule#Token"
const contractAddresses = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../..", contractAddressFile), "utf-8"),
)
const contractAddress = contractAddresses[contractDeploymentName]
const tokenService = new TokenService({ rpcUrl, contractAddress })
const html = fs.readFileSync(path.resolve(__dirname, "index.html"))

app.get("/", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html")
  res.send(html)
})

app.get("/api/token/info", async (req: Request, res: Response) => {
  try {
    const info = await tokenService.getContractInfo()
    res.json(info)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch token info" })
  }
})

app.get("/api/token/balance/:address", async (req: Request, res: Response) => {
  try {
    const balance = await tokenService.getBalance(req.params.address)
    res.json({ balance })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch balance" })
  }
})

app.get("/api/token/transactions", async (req: Request, res: Response) => {
  try {
    const fromBlock = parseInt(req.query.fromBlock as string) || 0
    const transactions = await tokenService.getTransactionHistory(fromBlock)
    res.json({ transactions })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
