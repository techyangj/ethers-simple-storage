const ethers = require("ethers")
// const solc = require("solc")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {

    console.log(process.env.RPC_URL)
    console.log(process.env.PRIVATE_KEY)
    let provider = new ethers.JsonRpcProvider(process.env.RPC_URL)

    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()


    // 这是重新修改后的程序，可以通过
    console.log(`Contract deployed to ${await contract.getAddress()}`)

    console.log("Updating favorite number...")
    let transactionResponse = await contract.store("7")
    let transactionReceipt = await transactionResponse.wait()
    let retrieveNumber = await contract.retrieve()
    console.log(`New Favorite Number: ${await contract.retrieve()}`)
    console.log(`New favorite Number: ${retrieveNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
