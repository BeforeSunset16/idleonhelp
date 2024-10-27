import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifyDrive',
  access: (allow) => ({
    'profile-pictures/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'picture-submissions/*': [
      allow.authenticated.to(['read','write']),
      allow.guest.to(['read', 'write'])
    ],
  })
});

export const idleonhelpBucket1 = defineStorage({
    name: 'idleonhelpBucket1',
    isDefault: true, // identify your default storage bucket (required)
  });
  
  export const idleonhelpBucket2 = defineStorage({
    name: 'idleonhelpBucket2',
    access: (allow) => ({
      'private/{entity_id}/*': [
        allow.entity('identity').to(['read', 'write', 'delete'])
      ]
    })
  })