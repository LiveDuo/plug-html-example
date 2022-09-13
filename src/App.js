import { useEffect } from "react";

import { HttpAgent } from '@dfinity/agent'

function App() {

  useEffect(() => {

    ; (async () => {
      const connected = await window.ic.plug.isConnected()
      if (connected) {
        console.log('connected')
      }
    })()
  }, [])


  const debug = async () => {
    
    if (!window.ic?.plug) {
      alert('no wallet')
      return
    }

    try {
      const hostLocal = 'http://localhost:8000/'
      const hostMainnet = 'https://ic0.app'
      const whitelist = ['rrkah-fqaaa-aaaaa-aaaaq-cai']

      const agentLocal = new HttpAgent({ host: hostLocal })
      const rootKeyAgentLocal = await agentLocal.fetchRootKey()
      console.log('root key agent local', rootKeyAgentLocal)

      const agentMainnet = new HttpAgent({ host: hostMainnet })
      const rootKeyAgentMainnet = await agentMainnet.fetchRootKey()
      console.log('root key agent mainnet', rootKeyAgentMainnet)

      const rootKeyPlugBefore = await window.ic?.plug.sessionManager.sessionData?.agent.fetchRootKey()
      console.log('root key plug before', rootKeyPlugBefore)

      await window.ic?.plug?.requestConnect({ host: hostLocal, whitelist })

      const rootKeyPlugLocal = await window.ic?.plug.sessionManager.sessionData?.agent.fetchRootKey()
      console.log('root key plug local', rootKeyPlugLocal)

      await window.ic?.plug?.requestConnect({ host: hostMainnet, whitelist })
      
      const rootKeyPlugMainnet = await window.ic?.plug.sessionManager.sessionData?.agent.fetchRootKey()
      console.log('root key plug mainnet', rootKeyPlugMainnet)

    } catch (e) {
      console.log(e)
    }

  }

  const disconnectWallet = async () => {
    const p1 = new Promise((r) => setTimeout(() => r(), 1000))
    const p2 = window.ic.plug.disconnect() // not resolving
    await Promise.race([p1, p2]) // hacky fix

    // await window.ic.plug.disconnect()
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
