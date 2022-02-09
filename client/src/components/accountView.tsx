import React, { useEffect, useState } from "react"
import {getGasPrice} from "../utils/utils"

type AccountViewProps = {
  accounts: any[],
  contract: any
}

const AccountView = ({accounts, contract}: AccountViewProps) => {
  const [balance, setBalance] = useState<number>(0);
  const [inputAmt, setInputAmt] = useState<number>(0);
  const [inputAmtType, setinputAmtType] = useState<"deposit" | "withdraw"> ("deposit")
  const [showAmtInput, setShowAmtInput] = useState<boolean>(false)

  const getBalance = async () => {

    const gasPriceMin = await getGasPrice(accounts, contract.methods.balance);
    console.log(gasPriceMin)
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.balance().call(
      {
        from: accounts[0],
        gas: gasPriceMin + 5000 // Do the estGas price plus 5k as a buffer.
      }
    )

    // Update state with the result.
    setBalance(response);
  }

  const depositFunds = async (amount: number) => {
    const maxBalance = 4294967295;
    await getBalance();

    console.log(Number(amount) + Number(balance))
    if (amount <= 0) {
      alert("Amount to deposit must be greater than 0.")
    }

    else if (amount + balance >= maxBalance) { // This is the maximum possible uint value. Do this to prevent rolling the balance over
      alert("The amount to deposit added to the current balance would be greater than the maximum amount allowed in the account. \n Maximum account balance cannot exceed " + maxBalance)
    }

    else {
      const gasPriceMin = await getGasPrice(accounts, contract.methods.deposit, amount);

      await contract.methods.deposit(amount).send(
        {
          from: accounts[0],
          gas: gasPriceMin + 5000
        }
      )
      .then((response:any) => {
        console.log(response)
        getBalance();
      })
      .catch((error:Error)  => {
        console.error("Unable to deposit funds: " + error.message)
      })
    }
  }

  const withdrawFunds = async (amount:number) => {
    await getBalance();

    if (amount <= 0) {
      alert("Withdraw amount must be greater than 0")
    }
    else if (amount > balance) {
      alert("Withdraw amount exceeds balance in the account.")
    }
    else {
      const gasPriceMin = await getGasPrice(accounts, contract.methods.deposit, amount);

      await contract.methods.withdraw(amount).send(
        {
          from: accounts[0],
          gas: gasPriceMin + 5000
        }
      )
      .then((response:any) => {
        console.log(response)
        setShowAmtInput(false)
        setInputAmt(0)
        getBalance();
      })
      .catch((error:Error)  => {
        console.error("Unable to withdraw funds: " + error.message)
      })
    }
  }

  const handleShowAmtInputClick = (type:"deposit"|"withdraw") => {
    setInputAmt(0)
    setinputAmtType(type)
    setShowAmtInput(true)
  }

  useEffect(()=> {
    getBalance();
  }, [])

  return (
    <div className="bg-blue-400 bg-opacity-50 text-white">
      <div className="text-2xl font-bold">Welcome to the Bank of Eth</div>
      <div className="text-xl">Account balance: ${balance}</div>
      <div>Actions:</div>
      <button className="bg-gray-500 rounded px-2 m-2" onClick={(e)=> {handleShowAmtInputClick("deposit")}}>
        Deposit
      </button>
      <button className="bg-gray-500 rounded px-2 m-2" onClick={(e)=> {handleShowAmtInputClick("withdraw")}}>
        Withdraw
      </button>
      {showAmtInput && <div>
        <div>Amount to {inputAmtType === "deposit" ? "Deposit" : "Withdraw"}</div>
        <input className="text-black px-1" type="number" step={0.01} value={inputAmt} onChange={(e) => setInputAmt(e.target.valueAsNumber)}/>
        <button className="bg-green-500 rounded px-2 m-2" onClick={(e)=> {inputAmtType === "deposit" ? depositFunds(inputAmt) : withdrawFunds(inputAmt)}}>
          Process
        </button>
      </div>}
    </div>
  )
}

export default AccountView
