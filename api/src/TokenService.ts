import { ethers } from "ethers"
import TokenArtifact from "../../contract/artifacts/contracts/Token.sol/Token.json"

export class TokenService {
  private contract: ethers.Contract
  private provider: ethers.Provider

  constructor({ rpcUrl, contractAddress }: { rpcUrl: string; contractAddress: string }) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.contract = new ethers.Contract(contractAddress, TokenArtifact.abi, this.provider)
  }

  async getContractInfo() {
    const [name, symbol, totalSupply, owner] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
      this.contract.totalSupply(),
      this.contract.owner(),
    ])

    return { name, symbol, totalSupply: totalSupply.toString(), owner }
  }

  async getBalance(address: string) {
    const balance = await this.contract.balanceOf(address)
    return balance.toString()
  }

  async getTransactionHistory(fromBlock = 0) {
    const filter = this.contract.filters.Transfer()
    const events = await this.contract.queryFilter(filter, fromBlock, "latest")

    return events.map((event) => {
      if ("args" in event) {
        return {
          from: event.args?._from,
          to: event.args?._to,
          value: event.args?._value.toString(),
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
        }
      }
      return {
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
      }
    })
  }
}
