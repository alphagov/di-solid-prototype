import { Session } from '@inrupt/solid-client-authn-node';
import { getEssServiceURI, EssServices } from '../config';

export async function createProfileAndPod(session: Session) {
  if (session.info.webId) {
    await session.fetch(session.info.webId, {method: 'POST'})
    const provision = await (await session.fetch(getEssServiceURI(EssServices.Provision), {method: 'POST'})).json()

    await session.fetch(
      `${session.info.webId}/provision`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          '@context': {
            'id':'@id',
            'storage':{
               '@type':'@id',
               '@id':'http://www.w3.org/ns/pim/space#storage'
            },
            'profile':{
               '@type':'@id',
               '@id':'http://xmlns.com/foaf/0.1/isPrimaryTopicOf'
            }
         },
         'id': session.info.webId,
         'profile': provision['profile'],
         'storage': provision['storage']
        })
      }
    )
  }
}
