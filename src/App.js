import { useEffect } from "react";

import { HttpAgent } from '@dfinity/agent'

function App() {

  useEffect(() => {

    ; (async () => {
      const connected = await window.ic.plug.isConnected()
      if (connected) {
        console.log('connected')
        // console.log(JSON.stringify(windows.ic.plug))
      }
    })()
  }, [])


  const debug = async () => {
    // console.log(window.ic.plug.sessionManager.getSession())
    console.log(window.ic.plug)
    // console.log(await window.ic.plug.sessionManager.getConnectionData())
    // console.log(await window.ic.plug.getICNSInfo())
  }

  const disconnectWallet = async () => {
    // const p1 = new Promise((r) => setTimeout(() => r(), 1000))
    // const p2 = window.ic.plug.disconnect() // not resolving
    // await Promise.race([p1, p2]) // hacky fix

    await window.ic.plug.disconnect()
  }

  const connectWallet = async () => {

    if (!window.ic?.plug) {
      alert('no wallet')
      return
    }

    try {
      const host = 'http://localhost:8000/'
      const whitelist = ['rrkah-fqaaa-aaaaa-aaaaq-cai']

      const agent = new HttpAgent({ host })
      const rootKey = await agent.fetchRootKey()
      console.log('root key agent', rootKey)

      const rootKey2 = await window.ic?.plug.sessionManager.sessionData?.agent.fetchRootKey()
      console.log('root key plug', rootKey2)

      await window.ic?.plug?.requestConnect({ host, whitelist })
    } catch (e) {
      console.log(e)
    }

  }
  const queryCanister = async () => {
    const canisterId = 'rrkah-fqaaa-aaaaa-aaaaq-cai';
    const interfaceFactory = ({ IDL }) => {
      return IDL.Service({
        'query_call': IDL.Func([], [IDL.Text], ['query']),
        'update_call': IDL.Func([], [], ['update']),
      });
    };
    const actor = await window.ic?.plug.createActor({ canisterId, interfaceFactory });
    const response = await actor.query_call();
    console.log('query_call', response);

    const response2 = await actor.update_call();
    console.log('update_call', response2);
  }

  return (
    <div>
      <button type="button" onClick={() => connectWallet()}>Connect</button>
      <button type="button" onClick={() => disconnectWallet()}>Disconnect</button>
      <button type="button" onClick={() => queryCanister()}>Query</button>
      <button type="button" onClick={() => debug()}>Debug</button>
    </div>
  );
}

export default App;
