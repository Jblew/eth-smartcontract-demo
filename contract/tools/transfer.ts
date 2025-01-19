import { ethers } from "ethers"
import { Token__factory } from "../typechain-types"
import * as fs from "fs"
import * as path from "path"

const rpcUrl = mustGetEnv("RPC_URL")
const to = mustGetEnv("TRANSFER_TO")
const amount = parseInt(mustGetEnv("TRANSFER_AMOUNT"))
const walletPrivkey = mustGetEnv("WALLET_PRIVKEY")

const contractAddressFile = "../ignition/deployments/chain-11155111/deployed_addresses.json"
const contractDeploymentName = "TokenModule#Token"

run().catch(console.error)
async function run() {
  const contractAddresses = JSON.parse(
    fs.readFileSync(path.join(__dirname, contractAddressFile), "utf-8"),
  )
  const contractAddress = contractAddresses[contractDeploymentName]
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const signer = new ethers.Wallet(walletPrivkey, provider)
  const token = Token__factory.connect(contractAddress, signer)

  console.log("Transferring tokens...")
  const tx = await token.transfer(to, amount)

  console.log("Waiting for confirmation...")
  await tx.wait()

  console.log(`Transferred ${amount} tokens to ${to}`)

  // Check balances
  const recipientBalance = await token.balanceOf(to)
  console.log(`Recipient balance: ${recipientBalance}`)
}

function mustGetEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Env ${name} is not set`)
  }
  return value
}
