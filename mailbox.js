/** Browser device credential is never sent to peers or included in message payloads. */
export function createMailboxClient({profile,onIdentity=()=>{},onMessage=()=>false,fetchImpl=globalThis.fetch,storage=globalThis.localStorage}={}){
  let token=storage.getItem('yueliao-mailbox-secret');
  if(!/^[a-f0-9]{64}$/.test(token||'')){token=[...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join('');storage.setItem('yueliao-mailbox-secret',token)}
  let identity=null,registering=null,timer=null,polling=false,active=false;
  const linked=new Set();
  async function api(path,data){
    const response=await fetchImpl(`/api/mailbox/${path}`,{method:data===undefined?'GET':'POST',headers:{Authorization:`Bearer ${token}`,...(data===undefined?{}:{'Content-Type':'application/json'})},body:data===undefined?undefined:JSON.stringify(data),cache:'no-store',signal:AbortSignal.timeout(12000)});
    const result=await response.json();if(!response.ok)throw new Error(result.error||'离线消息服务暂时不可用');return result;
  }
  async function ensure(){
    if(identity)return identity;if(registering)return registering;
    registering=api('register',{id:profile.id,name:profile.name,language:profile.language}).then(result=>{identity=result.cloudId;onIdentity(identity);return identity}).finally(()=>{registering=null});return registering;
  }
  async function poll(){
    if(!active||polling)return;polling=true;
    try{
      await ensure();const result=await api('inbox');const ids=[];
      for(const row of result.messages||[])if(await onMessage(row))ids.push(row.seq);
      if(ids.length)await api('ack',{ids});
    }catch{ /* Pending messages stay on the server; retry on the next poll. */ }
    finally{polling=false;clearTimeout(timer);if(active)timer=setTimeout(poll,15000)}
  }
  return {
    ensure,
    async group(action,data={}){await ensure();return api('groups-'+action,data)},
    async unlink(contact){await ensure();await api('remove-contact',{cloudId:contact.cloudId});linked.delete(contact.cloudId)},
    async start(){active=true;await ensure();poll().catch(()=>{})},
    stop(){active=false;clearTimeout(timer)},
    async link(contact){if(!contact.cloudId||linked.has(contact.cloudId))return;await ensure();await api('contacts',{cloudId:contact.cloudId,id:contact.id});linked.add(contact.cloudId)},
    async send(contact,message){if(!contact.cloudId)throw new Error('请双方先打开新版连接一次，开启离线消息');await ensure();return api('send',{to:contact.cloudId,message})},
  };
}
