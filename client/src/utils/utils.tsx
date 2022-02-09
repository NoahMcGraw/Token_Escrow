export const getGasPrice = async (accounts:any[], contractMethod: Function, methodParam: any = null) => {
  let estGas = 50000;
  await (methodParam === null ? contractMethod() : contractMethod(methodParam)).estimateGas(
    {
      from: accounts[0],
      gas: 50000
    }
  )
  .then((response:any) => {
    estGas = response;
  })
  .catch((error:Error) => {
    console.error("Could not est gas price, defaulting to 50k.")
  })

  return estGas;
}
